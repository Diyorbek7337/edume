import {
  collection, doc, getDocs, getDoc,
  addDoc as fsAddDoc, updateDoc as fsUpdateDoc, deleteDoc as fsDeleteDoc, setDoc as fsSetDoc,
  writeBatch as fsWriteBatch, runTransaction as fsRunTransaction,
  query, where, orderBy, limit, serverTimestamp, getFirestore,
  increment, arrayUnion
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { db, getCurrentCenter, getCenterCollection, storage, assertCenterWritable, getViewer, isLearnerViewer } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { captureError } from './sentry';
import { toast } from 'react-toastify';

// console.error + Sentry wrapper — barcha catch bloklarda ishlatiladi
// silent=true — fon operatsiyalari uchun (getUnreadCount, markAsRead va h.k.)
const _log = (...args) => Function.prototype.apply.call(console.error, console, args);
const logError = (message, err, silent = false) => {
  _log(message, err);
  captureError(err, { context: message });
  if (!silent) {
    toast.error("Ma'lumot yuklashda xatolik yuz berdi. Sahifani yangilang.", {
      toastId: 'api-error',
      autoClose: 5000,
    });
  }
};

// ==================== YOZISH AMALLARI (faqat-o'qish rejimi nazorati) ====================
// Obuna tugagan markazda yozishdan oldin tushunarli xato beradi (firebase.js →
// assertCenterWritable). Imzolar firebase/firestore bilan bir xil.
const addDoc = (ref, data) => { assertCenterWritable(ref); return fsAddDoc(ref, data); };
const updateDoc = (ref, ...args) => { assertCenterWritable(ref); return fsUpdateDoc(ref, ...args); };
const setDoc = (ref, ...args) => { assertCenterWritable(ref); return fsSetDoc(ref, ...args); };
const deleteDoc = (ref) => { assertCenterWritable(ref); return fsDeleteDoc(ref); };
const writeBatch = (firestore) => {
  const batch = fsWriteBatch(firestore);
  return {
    set: (ref, ...args) => { assertCenterWritable(ref); batch.set(ref, ...args); return batch; },
    update: (ref, ...args) => { assertCenterWritable(ref); batch.update(ref, ...args); return batch; },
    delete: (ref) => { assertCenterWritable(ref); batch.delete(ref); return batch; },
    commit: () => batch.commit(),
  };
};
const runTransaction = (firestore, fn, options) => fsRunTransaction(firestore, (tx) => fn({
  get: (ref) => tx.get(ref),
  set: (ref, ...args) => { assertCenterWritable(ref); tx.set(ref, ...args); return tx; },
  update: (ref, ...args) => { assertCenterWritable(ref); tx.update(ref, ...args); return tx; },
  delete: (ref) => { assertCenterWritable(ref); tx.delete(ref); return tx; },
}), options);

// Secondary Firebase instance - faqat bir marta yaratiladi
let secondaryApp = null;
let secondaryAuth = null;

const getSecondaryAuth = () => {
  if (!secondaryAuth) {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    };
    
    // Mavjud instance ni tekshirish
    const appName = 'SecondaryApp';
    const existingApps = getApps();
    secondaryApp = existingApps.find(app => app.name === appName);
    
    if (!secondaryApp) {
      secondaryApp = initializeApp(firebaseConfig, appName);
    }
    
    secondaryAuth = getAuth(secondaryApp);
  }
  return secondaryAuth;
};

// Helper: Get collection reference with center prefix
const centerCollection = (name) => {
  const centerId = getCurrentCenter();
  if (!centerId) {
    logError('No center selected! Please login again.');
    throw new Error('No center selected');
  }
  return collection(db, `centers/${centerId}/${name}`);
};

const centerDoc = (name, id) => {
  const centerId = getCurrentCenter();
  if (!centerId) {
    logError('No center selected! Please login again.');
    throw new Error('No center selected');
  }
  return doc(db, `centers/${centerId}/${name}`, id);
};

// ==================== CENTERS (Global) ====================
export const centersAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'centers'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('centers getAll error:', err);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const docSnap = await getDoc(doc(db, 'centers', id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (err) {
      logError('centers getById error:', err);
      return null;
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'centers'), {
      ...data,
      status: 'active',
      subscription: 'trial', // trial, basic, pro, enterprise
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 kun sinov
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'centers', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'centers', id));
    return true;
  },

  // Center uchun admin yaratish.
  // Barcha yozuvlar ikkilamchi (yangi yaratilgan foydalanuvchi bilan autentifikatsiyalangan)
  // ilova orqali ketadi — ro'yxatdan o'tayotgan tashrifchi birlamchi ilovada login
  // qilmagan bo'ladi va rules yozuvni rad etadi. Tartib muhim:
  // auth user -> center (ownerUid bilan) -> users doc -> settings,
  // chunki users create qoidasi center.ownerUid ni, settings qoidasi esa
  // allaqachon yozilgan users doc'dagi director rolini tekshiradi.
  createWithAdmin: async (centerData, adminData, password) => {
    const auth = getSecondaryAuth();
    const secondaryDb = getFirestore(secondaryApp);

    try {
      // 1. Admin auth user yaratish
      const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, password);
      const uid = userCredential.user.uid;

      // 2. Center yaratish
      const centerRef = await addDoc(collection(secondaryDb, 'centers'), {
        name: centerData.name,
        phone: centerData.phone || '',
        email: centerData.email || '',
        address: centerData.address || '',
        logo: centerData.logo || '',
        type: centerData.type === 'solo' ? 'solo' : 'center',
        status: 'active',
        subscription: 'trial',
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 kun sinov
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const centerId = centerRef.id;

      // 3. Users kolleksiyasiga qo'shish
      await setDoc(doc(secondaryDb, 'users', uid), {
        fullName: adminData.fullName,
        email: adminData.email,
        phone: adminData.phone || '',
        role: 'director',
        centerId: centerId,
        createdAt: serverTimestamp(),
      });

      // 4. Center settings yaratish
      await setDoc(doc(secondaryDb, `centers/${centerId}/settings`, 'main'), {
        centerName: centerData.name,
        phone: centerData.phone || '',
        email: centerData.email || '',
        monthlyFee: '500000',
        trialDays: '3',
        siblingDiscount: '10',
        referralBonus: '10',
        teacherSalaryType: 'fixed',
        teacherFixedSalary: '3000000',
        createdAt: serverTimestamp(),
      });

      // 5. Direktorni o'zini ham "O'qituvchi" sifatida qo'shish — asosan yakka
      // o'qituvchilar (markazsiz repetitorlar) uchun: aks holda ular guruh
      // yaratganda o'zlarini "O'qituvchi" ro'yxatidan topa olmay qolishardi
      // (Teachers kolleksiyasida yozuvi yo'q edi). Ko'p xodimli markazlar uchun
      // ham zararsiz — direktor buni tahrirlashi yoki e'tiborsiz qoldirishi mumkin.
      await addDoc(collection(secondaryDb, `centers/${centerId}/teachers`), {
        fullName: adminData.fullName,
        email: adminData.email,
        phone: adminData.phone || '',
        telegram: '',
        subject: adminData.subject || '',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(e => logError('auto teacher-record creation warning:', e, true));

      // Sign out from secondary auth
      await signOut(auth).catch(e => logError('secondary signOut warning:', e, true));

      return { centerId, odamId: uid };
    } catch (err) {
      logError('createWithAdmin error:', err);
      await signOut(auth).catch(() => {});
      throw err;
    }
  },
};

// ==================== USERS (Global with centerId) ====================
export const usersAPI = {
  getAll: async () => {
    try {
      const centerId = getCurrentCenter();
      const q = query(collection(db, 'users'), where('centerId', '==', centerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('users getAll error:', err);
      return [];
    }
  },

  getByRole: async (role) => {
    try {
      const centerId = getCurrentCenter();
      const q = query(
        collection(db, 'users'), 
        where('role', '==', role),
        where('centerId', '==', centerId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('getByRole error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'users', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  getByCenterId: async (centerId) => {
    try {
      const q = query(collection(db, 'users'), where('centerId', '==', centerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('getByCenterId error:', err);
      return [];
    }
  },

  create: async (data, password) => {
    const centerId = getCurrentCenter();
    const auth = getSecondaryAuth();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, password);
      const uid = userCredential.user.uid;
      
      const userData = {
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        telegram: data.telegram || '',
        role: data.role,
        centerId: centerId,
        ...(data.mustChangePassword && { mustChangePassword: true }),
        ...(data.permissions && { permissions: data.permissions }),
        // Parent uchun qo'shimcha fieldlar
        ...(data.role === 'parent' && {
          childId: data.childId || null,
          childName: data.childName || '',
          childIds: data.childIds || [],
          childNames: data.childNames || [],
        }),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', uid), userData);
      
      // Sign out from secondary auth
      try {
        await signOut(auth);
      } catch (e) {
        console.log('Secondary signOut warning:', e);
      }
      
      return { id: uid, ...userData };
    } catch (err) {
      logError('usersAPI.create error:', err);
      
      // Sign out anyway
      try {
        await signOut(auth);
      } catch (e) {}
      
      throw err;
    }
  },

  upsertById: async (uid, data) => {
    const centerId = getCurrentCenter();
    await setDoc(doc(db, 'users', uid), {
      ...data,
      centerId,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { id: uid, ...data };
  },

  update: async (id, data) => {
    const updateData = { ...data };
    delete updateData.email;
    updateData.updatedAt = serverTimestamp();
    await updateDoc(doc(db, 'users', id), updateData);
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'users', id));
    return true;
  },
};

// ==================== STUDENTS (Center-based) ====================
// ==================== O'QUVCHI / OTA-ONA UCHUN XAVFSIZ RO'YXAT ====================
// O'quvchi va ota-ona `students` kolleksiyasini ro'yxat qilib o'qiy olmaydi
// (firestore.rules). Ular uchun studentsAPI.getAll/getByGroup quyidagini
// qaytaradi:
//   - O'Z yozuvlari to'liq holda (o'quvchi: userId == uid; ota-ona: childIds)
//   - qolgan talabalar — student_directory'dan FAQAT { id, fullName, groupId,
//     groupIds, groupName, status } (telefon, ota-ona, manzil, to'lov — yo'q)
// Sahifalardagi "o'zimni topish" mantig'i (email/telefon/childIds bo'yicha)
// o'zgarishsiz ishlayveradi: telefon/email faqat o'z yozuvlarida bor.
const getMyStudentRecords = async () => {
  const { role, uid, childIds } = getViewer();
  if (role === 'student' && uid) {
    const snap = await getDocs(query(centerCollection('students'), where('userId', '==', uid)));
    return snap.docs.map(d => ({ id: d.id, ...d.data(), isMine: true }));
  }
  if (role === 'parent' && childIds.length > 0) {
    const snaps = await Promise.all(childIds.map(id => getDoc(centerDoc('students', id))));
    return snaps.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data(), isMine: true }));
  }
  return [];
};

const getDirectoryEntries = async (groupId = null) => {
  const coll = centerCollection('student_directory');
  const snap = await getDocs(groupId ? query(coll, where('groupId', '==', groupId)) : coll);
  return snap.docs.map(d => ({ id: d.id, ...d.data(), isDirectoryEntry: true }));
};

const mergeWithOwn = (directory, own) => {
  const ownIds = new Set(own.map(s => s.id));
  return [...own, ...directory.filter(s => !ownIds.has(s.id))];
};

const inGroup = (student, groupId) =>
  student.groupId === groupId || (Array.isArray(student.groupIds) && student.groupIds.includes(groupId));

export const studentsAPI = {
  getAll: async () => {
    try {
      if (isLearnerViewer()) {
        const [own, directory] = await Promise.all([
          getMyStudentRecords(),
          getDirectoryEntries().catch(() => []),
        ]);
        return mergeWithOwn(directory, own);
      }
      const snapshot = await getDocs(centerCollection('students'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('students getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      if (isLearnerViewer()) {
        const [own, directory] = await Promise.all([
          getMyStudentRecords(),
          getDirectoryEntries(groupId).catch(() => []),
        ]);
        return mergeWithOwn(directory, own.filter(s => inGroup(s, groupId)));
      }
      const q = query(centerCollection('students'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('students getByGroup error:', err);
      return [];
    }
  },

  // Joriy o'quvchining o'z yozuvi / ota-onaning farzandlari (to'liq ma'lumot bilan)
  getMine: async () => {
    try {
      return await getMyStudentRecords();
    } catch (err) {
      logError('students getMine error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(centerDoc('students', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('students'), {
      ...data,
      status: data.status || 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('students', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('students', id));
    return true;
  },

  /**
   * Guruhdagi barcha FAOL o'quvchilarni "bitirgan" deb belgilaydi.
   *
   * Nega kerak: guruh bitirgan deb belgilanganda ichidagi o'quvchilar
   * avval faol bo'lib qolaverardi. Natijada ular To'lovlar sahifasida
   * qarzdor bo'lib turaverar, guruhi esa ro'yxatda topilmagani uchun
   * "Guruhsiz" ko'rinardi va qarzi guruh narxi o'rniga standart narx
   * bo'yicha hisoblanardi.
   *
   * Allaqachon bitirgan yoki arxivlangan o'quvchilarga tegilmaydi.
   * @returns {Promise<number>} nechta o'quvchi belgilangani
   */
  graduateByGroup: async (groupId, performerId) => {
    const all = await studentsAPI.getByGroup(groupId);
    const target = all.filter(s => s.status === 'active' || !s.status);
    if (target.length === 0) return 0;

    const graduatedAt = new Date().toISOString();
    const CHUNK = 499;
    for (let i = 0; i < target.length; i += CHUNK) {
      const batch = writeBatch(db);
      target.slice(i, i + CHUNK).forEach(s => {
        batch.update(centerDoc('students', s.id), {
          status: 'graduated',
          graduatedAt,
          graduatedBy: performerId || null,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }
    return target.length;
  },
};

// ==================== TEACHERS (Center-based) ====================
export const teachersAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('teachers'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('teachers getAll error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(centerDoc('teachers', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('teachers'), {
      ...data,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('teachers', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('teachers', id));
    return true;
  },
};

// ==================== GROUPS (Center-based) ====================
export const groupsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('groups'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('groups getAll error:', err);
      return [];
    }
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(centerCollection('groups'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('groups getByTeacher error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(centerDoc('groups', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('groups'), {
      ...data,
      studentsCount: 0,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('groups', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('groups', id));
    return true;
  },
};

// ==================== PAYMENTS (Center-based) ====================
export const paymentsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('payments'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('payments getAll error:', err);
      return [];
    }
  },

  // Dashboard uchun: faqat so'nggi N oy to'lovlarini yuklaydi (getAll dan tezroq)
  getSince: async (sinceIso) => {
    try {
      const q = query(
        centerCollection('payments'),
        where('paidAt', '>=', sinceIso),
        orderBy('paidAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('payments getSince error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('payments'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('payments getByStudent error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('payments'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('payments', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('payments', id));
    return true;
  },

  // ========== MONTHLY BILLS (Oylik hisoblar) ==========
  getMonthlyBills: async () => {
    try {
      const snapshot = await getDocs(centerCollection('monthly_bills'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('monthly_bills getAll error:', err);
      return [];
    }
  },

  getMonthlyBillsByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('monthly_bills'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('monthly_bills getByStudent error:', err);
      return [];
    }
  },

  getMonthlyBillsByMonth: async (month) => {
    try {
      const q = query(centerCollection('monthly_bills'), where('month', '==', month));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('monthly_bills getByMonth error:', err);
      return [];
    }
  },

  // Faqat `sinceMonth`dan (masalan "2025-05") keyingi hisob-kitoblar — Payments.jsx
  // sahifasi kunlik operatsion ish uchun ochilganda BUTUN tarixni emas, oqilona
  // oynani yuklashi uchun. 15 oy orqaga — yil chegarasidan (dekabr→yanvar) o'tib
  // ketgan qarzlar ham to'g'ri hisoblanishi uchun xavfsizlik zaxirasi bilan.
  getMonthlyBillsSince: async (sinceMonth) => {
    try {
      const q = query(centerCollection('monthly_bills'), where('month', '>=', sinceMonth));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('monthly_bills getSince error:', err);
      return [];
    }
  },

  createMonthlyBill: async (data) => {
    const docRef = await addDoc(centerCollection('monthly_bills'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  // Mavjud oylik hisobga to'lovni ATOMIK qo'shish.
  // MUHIM: paidAmount/remainingAmount ni oldindan hisoblangan absolyut son
  // sifatida emas, increment() orqali yozadi — shuning uchun ikki admin
  // bir vaqtda (masalan ikki tabda) shu bitta billga to'lov kiritsa ham,
  // Firestore serverida ikkalasi ham to'g'ri qo'shiladi ("oxirgi yozuvchi
  // g'olib" muammosi yo'q). payments tarixi ham arrayUnion bilan — to'liq
  // massivni qayta yozib, boshqa yozuvchining yozgan elementini yo'qotmaydi.
  // status hali ham chaqiruvchi tomonidan hisoblanadi (bu yerda o'zgarmadi) —
  // juda kamdan-kam concurrent holatda bir lahzaga eskirishi mumkin, lekin
  // pul summalari (asosiy xavf) har doim to'g'ri bo'ladi.
  applyBillPayment: async (billId, {
    paymentAmount, paymentRecord, status,
    totalAmount, originalAmount, appliedDiscount, discountType, discountAmount,
  }) => {
    const updateData = {
      paidAmount: increment(paymentAmount),
      remainingAmount: increment(-paymentAmount),
      payments: arrayUnion(paymentRecord),
      status,
      updatedAt: serverTimestamp(),
    };
    // Chegirma birinchi marta qo'llanayotgan bo'lsagina yuboriladi
    if (totalAmount !== undefined) {
      updateData.totalAmount = totalAmount;
      updateData.originalAmount = originalAmount;
      updateData.appliedDiscount = appliedDiscount;
      updateData.discountType = discountType;
      updateData.discountAmount = discountAmount;
    }
    await updateDoc(centerDoc('monthly_bills', billId), updateData);
    return { id: billId };
  },

  // Hali Firestore'da yo'q ("virtual") davr uchun to'lovni ATOMIK qo'llaydi.
  // MUHIM: deterministik ID (`${studentId}_${periodKey}`) + runTransaction
  // ishlatadi. Sabab: eski kod "bu davr uchun hisob bormi?" tekshiruvini
  // mahalliy (eskirishi mumkin) state'dan qilib, keyin addDoc bilan yangi
  // hujjat yaratardi — ikki foydalanuvchi bir vaqtda AYNAN shu davr uchun
  // BIRINCHI to'lovni kiritsa, ikkalasi ham "hali yo'q" deb topib, IKKITA
  // alohida hisob-kitob hujjati yaratib qo'yardi (dublikat bookkeeping).
  // Deterministik ID bilan ikkalasi ham BIR XIL hujjatga urinadi;
  // runTransaction Firestore'ning optimistik concurrency nazorati orqali
  // ikkinchi urinishni avtomatik qayta ishga tushiradi — u hujjat
  // birinchisi tomonidan ALLAQACHON yaratilganini ko'rib, ustiga yozib
  // yubormasdan, to'lovni qo'shib qo'yadi (increment kabi, lekin qo'lda).
  applyPeriodPayment: async (studentId, periodKey, { paymentAmount, paymentRecord, billDefaults }) => {
    const centerId = getCurrentCenter();
    if (!centerId) throw new Error('No center selected');
    const billId = `${studentId}_${periodKey}`;
    const billRef = doc(db, `centers/${centerId}/monthly_bills`, billId);

    return runTransaction(db, async (tx) => {
      const snap = await tx.get(billRef);

      if (!snap.exists()) {
        const totalAmount = billDefaults.totalAmount;
        const newPaidAmount = paymentAmount;
        const newRemainingAmount = Math.max(0, totalAmount - newPaidAmount);
        const data = {
          ...billDefaults,
          studentId,
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          status: newRemainingAmount <= 0 ? 'paid' : 'partial',
          payments: [paymentRecord],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        tx.set(billRef, data);
        return { id: billId, ...data };
      }

      // Boshqa so'rov shu oraliqda ulgurib yaratgan ekan — increment o'rniga
      // qo'lda qo'shamiz (tranzaksiya ichida increment() ham ishlaydi, lekin
      // aniq son bilan qaytarish uchun shu yerda o'zimiz hisoblaymiz)
      const existing = snap.data();
      const newPaidAmount = (existing.paidAmount || 0) + paymentAmount;
      const newRemainingAmount = Math.max(0, existing.totalAmount - newPaidAmount);
      const data = {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        status: newRemainingAmount <= 0 ? 'paid' : 'partial',
        payments: [...(existing.payments || []), paymentRecord],
        updatedAt: serverTimestamp(),
      };
      tx.update(billRef, data);
      return { id: billId, ...existing, ...data };
    });
  },

  deleteMonthlyBill: async (id) => {
    await deleteDoc(centerDoc('monthly_bills', id));
    return true;
  },
};

// ==================== ATTENDANCE (Center-based) ====================
export const attendanceAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('attendance'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('attendance getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('attendance'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('attendance getByGroup error:', err);
      return [];
    }
  },

  getByDate: async (date) => {
    try {
      const q = query(centerCollection('attendance'), where('date', '==', date));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('attendance getByDate error:', err);
      return [];
    }
  },

  getByGroupAndDate: async (groupId, date) => {
    try {
      // Composite index (groupId ASC, date ASC) ishlatiladi — firestore.indexes.json
      const q = query(
        centerCollection('attendance'),
        where('groupId', '==', groupId),
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('attendance getByGroupAndDate error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('attendance'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('attendance', id), data);
    return { id, ...data };
  },

  bulkCreate: async (records) => {
    const CHUNK = 499;
    const coll = centerCollection('attendance');
    const results = [];
    for (let i = 0; i < records.length; i += CHUNK) {
      const batch = writeBatch(db);
      records.slice(i, i + CHUNK).forEach(record => {
        const ref = doc(coll);
        batch.set(ref, { ...record, createdAt: serverTimestamp() });
        results.push({ id: ref.id, ...record });
      });
      await batch.commit();
    }
    return results;
  },

  bulkUpdate: async (records) => {
    const CHUNK = 499;
    const toUpdate = records.filter(r => r.id);
    for (let i = 0; i < toUpdate.length; i += CHUNK) {
      const batch = writeBatch(db);
      toUpdate.slice(i, i + CHUNK).forEach(record => {
        batch.update(centerDoc('attendance', record.id), record);
      });
      await batch.commit();
    }
    return records;
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('attendance'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('attendance getByStudent error:', err);
      return [];
    }
  },

  getByGroupAndMonth: async (groupId, month) => {
    // month = "2024-01" formatida
    // Composite index (groupId ASC, date ASC) mavjud — firestore.indexes.json
    const [y, m] = month.split('-').map(Number);
    const nextY = m === 12 ? y + 1 : y;
    const nextM = m === 12 ? 1 : m + 1;
    const nextMonth = `${nextY}-${String(nextM).padStart(2, '0')}`;
    try {
      const q = query(
        centerCollection('attendance'),
        where('groupId', '==', groupId),
        where('date', '>=', `${month}-01`),
        where('date', '<', `${nextMonth}-01`)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      logError('attendance getByGroupAndMonth error:', err);
      return [];
    }
  },

  // Davomat saqlash - mavjudlarni yangilash, yo'qlarini yaratish
  save: async (groupId, date, records) => {
    try {
      // Shu guruh va sana uchun mavjud davomatlarni olish
      const q = query(
        centerCollection('attendance'), 
        where('groupId', '==', groupId),
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);
      const existing = {};
      snapshot.docs.forEach(doc => {
        existing[doc.data().studentId] = { id: doc.id, ...doc.data() };
      });

      const CHUNK = 499;
      const coll = centerCollection('attendance');
      for (let i = 0; i < records.length; i += CHUNK) {
        const batch = writeBatch(db);
        records.slice(i, i + CHUNK).forEach(record => {
          const existingId = existing[record.studentId]?.id;
          if (existingId) {
            batch.update(centerDoc('attendance', existingId), {
              status: record.status,
              updatedAt: serverTimestamp(),
            });
          } else {
            const ref = doc(coll);
            batch.set(ref, { ...record, groupId, date, createdAt: serverTimestamp() });
          }
        });
        await batch.commit();
      }
      return true;
    } catch (err) {
      logError('attendance save error:', err);
      throw err;
    }
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('attendance', id));
    return true;
  },
};

// ==================== GRADES (Center-based) ====================
export const gradesAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('grades'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('grades getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('grades'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('grades getByGroup error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('grades'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('grades getByStudent error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('grades'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('grades', id), data);
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('grades', id));
    return true;
  },
};

// ==================== MESSAGES (Center-based) ====================
export const messagesAPI = {
  getAll: async () => {
    try {
      const q = query(centerCollection('messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      const snapshot = await getDocs(centerCollection('messages'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('messages'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('messages', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('messages', id));
    return true;
  },
};

// ==================== LEADS (Center-based) ====================
export const leadsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('leads'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('leads getAll error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('leads'), {
      ...data,
      status: data.status || 'new',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('leads', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('leads', id));
    return true;
  },
};

// ==================== SETTINGS (Center-based) ====================
export const settingsAPI = {
  get: async () => {
    try {
      const centerId = getCurrentCenter();
      if (!centerId) return null;
      const docSnap = await getDoc(doc(db, `centers/${centerId}/settings`, 'main'));
      return docSnap.exists() ? docSnap.data() : null;
    } catch (err) {
      logError('settings get error:', err);
      return null;
    }
  },

  update: async (data) => {
    const centerId = getCurrentCenter();
    if (!centerId) return null;
    await setDoc(doc(db, `centers/${centerId}/settings`, 'main'), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return data;
  },
};

// ==================== SCHEDULE (Center-based) ====================
export const scheduleAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('schedule'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('schedule getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('schedule'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('schedule getByGroup error:', err);
      return [];
    }
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(centerCollection('schedule'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('schedule getByTeacher error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('schedule'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('schedule', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('schedule', id));
    return true;
  },
};

// ==================== TEACHER RATINGS (Center-based) ====================
export const teacherRatingsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('teacher_ratings'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('teacher_ratings getAll error:', err);
      return [];
    }
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(centerCollection('teacher_ratings'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('teacher_ratings getByTeacher error:', err);
      return [];
    }
  },

  create: async (data) => {
    // Composite ID: {teacherId}_{odamId} — bir o'quvchi bir o'qituvchiga faqat bir baho bera oladi
    const docId = `${data.teacherId}_${data.odamId}`;
    const docRef = doc(centerCollection('teacher_ratings'), docId);
    await setDoc(docRef, { ...data, createdAt: serverTimestamp() });
    return { id: docId, ...data };
  },

  checkExisting: async (teacherId, odamId) => {
    try {
      const docId = `${teacherId}_${odamId}`;
      const snap = await getDoc(doc(centerCollection('teacher_ratings'), docId));
      return snap.exists();
    } catch (err) {
      logError('checkExisting error:', err);
      return false;
    }
  },
};

// ==================== UY VAZIFALARI API ====================
export const homeworkAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('homework'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('homework getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('homework'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('homework getByGroup error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('homework'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('homework', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('homework', id));
  },

  // Topshiriqlar
  getSubmissions: async (homeworkId) => {
    try {
      const q = query(centerCollection('homework_submissions'), where('homeworkId', '==', homeworkId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('getSubmissions error:', err);
      return [];
    }
  },

  submitHomework: async (homeworkId, data) => {
    // Mavjud topshiriqni tekshirish
    const q = query(
      centerCollection('homework_submissions'),
      where('homeworkId', '==', homeworkId),
      where('studentId', '==', data.studentId)
    );
    const existing = await getDocs(q);
    
    if (!existing.empty) {
      // Yangilash
      await updateDoc(centerDoc('homework_submissions', existing.docs[0].id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { id: existing.docs[0].id, ...data };
    }
    
    // Yangi yaratish
    const docRef = await addDoc(centerCollection('homework_submissions'), {
      ...data,
      homeworkId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  gradeSubmission: async (homeworkId, submissionId, data) => {
    await updateDoc(centerDoc('homework_submissions', submissionId), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id: submissionId, ...data };
  },
};

// ==================== CHAT API ====================
export const chatAPI = {
  getMessages: async (groupId, msgLimit = 100) => {
    try {
      // Compound index (groupId ASC, createdAt DESC) ishlatiladi — firestore.indexes.json
      const q = query(
        centerCollection('chat_messages'),
        where('groupId', '==', groupId),
        orderBy('createdAt', 'desc'),
        limit(msgLimit)
      );
      const snapshot = await getDocs(q);
      // desc tartibda keladi — ko'rsatish uchun asc ga o'giramiz
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse();
    } catch (err) {
      logError('getMessages error:', err);
      return [];
    }
  },

  sendMessage: async (groupId, data) => {
    const docRef = await addDoc(centerCollection('chat_messages'), {
      ...data,
      groupId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  getUnreadCount: async (groupId, odamId) => {
    try {
      // Oxirgi o'qilgan vaqtni olish
      const readDoc = await getDoc(centerDoc('chat_read_status', `${groupId}_${odamId}`));
      const lastRead = readDoc.exists() ? readDoc.data().lastRead : null;
      
      // O'qilmagan xabarlarni sanash
      const q = query(
        centerCollection('chat_messages'),
        where('groupId', '==', groupId)
      );
      const snapshot = await getDocs(q);

      if (!lastRead) return snapshot.size;

      const lastReadTime = lastRead?.seconds || new Date(lastRead).getTime() / 1000;
      return snapshot.docs.filter(doc => {
        // Xabarlar sendMessage da createdAt (serverTimestamp) bilan yoziladi
        const created = doc.data().createdAt;
        const msgTime = created?.seconds || (created ? new Date(created).getTime() / 1000 : 0);
        return msgTime > lastReadTime && doc.data().senderId !== odamId;
      }).length;
    } catch (err) {
      logError('getUnreadCount error:', err, true); // silent — fon operatsiyasi
      return 0;
    }
  },

  markAsRead: async (groupId, odamId) => {
    try {
      await setDoc(centerDoc('chat_read_status', `${groupId}_${odamId}`), {
        lastRead: serverTimestamp(),
        odamId,
        groupId
      });
    } catch (err) {
      logError('markAsRead error:', err, true); // silent — fon operatsiyasi
    }
  },
};

// ==================== QUIZ/TEST API ====================
export const quizAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('quizzes'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('quizzes getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('quizzes'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('quizzes getByGroup error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('quizzes'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('quizzes', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('quizzes', id));
  },

  // Test natijalari
  getResults: async (quizId) => {
    try {
      const q = query(centerCollection('quiz_results'), where('quizId', '==', quizId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('getResults error:', err);
      return [];
    }
  },

  submitResult: async (quizId, data) => {
    // Mavjud natijani tekshirish
    const q = query(
      centerCollection('quiz_results'),
      where('quizId', '==', quizId),
      where('studentId', '==', data.studentId)
    );
    const existing = await getDocs(q);
    
    if (!existing.empty) {
      // Yangilash
      await updateDoc(centerDoc('quiz_results', existing.docs[0].id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { id: existing.docs[0].id, ...data };
    }
    
    // Yangi yaratish
    const docRef = await addDoc(centerCollection('quiz_results'), {
      ...data,
      quizId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },
};

// ==================== MATERIALS API ====================
export const materialsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('materials'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('materials getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('materials'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('materials getByGroup error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('materials'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('materials', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('materials', id));
  },
};

// ==================== REWARDS API ====================
export const rewardsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('rewards'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('rewards getAll error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('rewards'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('rewards', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('rewards', id));
  },

  // Sotib olishlar — admin uchun barchasi, o'quvchi uchun o'zining
  getPurchases: async () => {
    try {
      const snapshot = await getDocs(centerCollection('reward_purchases'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('getPurchases error:', err);
      return [];
    }
  },

  // Compound index (studentId ASC, createdAt DESC) — firestore.indexes.json
  getPurchasesByStudent: async (studentId) => {
    try {
      const q = query(
        centerCollection('reward_purchases'),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('getPurchasesByStudent error:', err);
      return [];
    }
  },

  purchase: async (data) => {
    const docRef = await addDoc(centerCollection('reward_purchases'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  updatePurchase: async (id, data) => {
    await updateDoc(centerDoc('reward_purchases', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },
};

export const feedbackAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'feedback'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('feedback error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'feedback'), { ...data, status: 'pending', createdAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'feedback', id), { ...data, updatedAt: serverTimestamp() });
    return { id, ...data };
  },

  updateStatus: async (id, status, response = '') => {
    await updateDoc(doc(db, 'feedback', id), { status, response, respondedAt: serverTimestamp() });
  },
};

// ==================== CERTIFICATES API ====================
export const certificatesAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('certificates'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('certificates getAll error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('certificates'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('certificates getByStudent error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('certificates'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('certificates', id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('certificates', id));
  },

  // Sertifikat shablonini saqlash (Firestore settings ga)
  saveTemplate: async (templateDataUrl, textLayout = null) => {
    const centerId = getCurrentCenter();
    await setDoc(doc(db, `centers/${centerId}/settings`, 'certificate_template'), {
      dataUrl: templateDataUrl,
      ...(textLayout && { textLayout }),
      updatedAt: serverTimestamp()
    });
  },

  // Sertifikat shablonini olish
  getTemplate: async () => {
    try {
      const centerId = getCurrentCenter();
      const snap = await getDoc(doc(db, `centers/${centerId}/settings`, 'certificate_template'));
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      return null;
    }
  },

  // QR orqali ochilganda sertifikatni raqam bilan topish (public)
  getByNumber: async (certNumber) => {
    try {
      const centerId = getCurrentCenter();
      if (!centerId) return null;
      const q = query(
        collection(db, `centers/${centerId}/certificates`),
        where('certificateNumber', '==', certNumber)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch (err) {
      return null;
    }
  },
};

// ==================== EXPENSES (Harajatlar) ====================

export const expensesAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('expenses'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      logError('expenses getAll error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('expenses'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(centerDoc('expenses', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(centerDoc('expenses', id));
    return true;
  },
};

// ==================== TARIF ARIZALARI ====================
//
// Mijoz tarifni tanlaganda shu yerga yozuv tushadi va Cloud Function
// (onSubscriptionRequest) Telegram orqali xabar yuboradi. To'lov tizimi
// yo'q — tarifni SuperAdmin qo'lda faollashtiradi.
//
// GLOBAL kolleksiya (centers/{id}/... emas): super_admin barcha markazlarning
// arizalarini bitta so'rov bilan ko'rishi uchun.
export const subscriptionRequestsAPI = {
  create: async ({ plan, centerId, centerName, contactName, contactPhone, note }) => {
    const docRef = await addDoc(collection(db, 'subscription_requests'), {
      plan,
      centerId,
      centerName: centerName || '',
      contactName: contactName || '',
      contactPhone: contactPhone || '',
      note: note || '',
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  },

  // Direktor o'z markazining arizalarini ko'radi (takroriy yuborishning oldini
  // olish va "so'rovingiz qabul qilindi" holatini ko'rsatish uchun)
  getMine: async () => {
    try {
      const centerId = getCurrentCenter();
      if (!centerId) return [];
      const q = query(
        collection(db, 'subscription_requests'),
        where('centerId', '==', centerId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      logError('subscriptionRequests getMine error:', err, true);
      return [];
    }
  },

  // SuperAdmin uchun — barcha markazlar arizalari
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'subscription_requests'));
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      logError('subscriptionRequests getAll error:', err);
      return [];
    }
  },

  updateStatus: async (id, status) => {
    await updateDoc(doc(db, 'subscription_requests', id), {
      status,
      updatedAt: serverTimestamp(),
    });
    return { id, status };
  },
};
