import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, serverTimestamp, setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { db, getCurrentCenter, getCenterCollection } from './firebase';

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
    console.error('No center selected! Please login again.');
    throw new Error('No center selected');
  }
  return collection(db, `centers/${centerId}/${name}`);
};

const centerDoc = (name, id) => {
  const centerId = getCurrentCenter();
  if (!centerId) {
    console.error('No center selected! Please login again.');
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
      console.error('centers getAll error:', err);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const docSnap = await getDoc(doc(db, 'centers', id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (err) {
      console.error('centers getById error:', err);
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

  // Center uchun admin yaratish
  createWithAdmin: async (centerData, adminData, password) => {
    const auth = getSecondaryAuth();
    
    try {
      // 1. Center yaratish
      const centerRef = await addDoc(collection(db, 'centers'), {
        name: centerData.name,
        phone: centerData.phone || '',
        email: centerData.email || '',
        address: centerData.address || '',
        logo: centerData.logo || '',
        status: 'active',
        subscription: 'trial',
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 kun sinov
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const centerId = centerRef.id;

      // 2. Admin user yaratish
      const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, password);
      const uid = userCredential.user.uid;

      // 3. Users kolleksiyasiga qo'shish
      await setDoc(doc(db, 'users', uid), {
        fullName: adminData.fullName,
        email: adminData.email,
        phone: adminData.phone || '',
        role: 'director',
        centerId: centerId,
        createdAt: serverTimestamp(),
      });

      // 4. Center settings yaratish
      await setDoc(doc(db, `centers/${centerId}/settings`, 'main'), {
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

      // Sign out from secondary auth
      try {
        await signOut(auth);
      } catch (e) {
        console.log('Secondary signOut warning:', e);
      }

      return { centerId, odamId: uid };
    } catch (err) {
      console.error('createWithAdmin error:', err);
      
      // Sign out anyway
      try {
        await signOut(auth);
      } catch (e) {}
      
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
      console.error('users getAll error:', err);
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
      console.error('getByRole error:', err);
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
      console.error('getByCenterId error:', err);
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
      console.error('usersAPI.create error:', err);
      
      // Sign out anyway
      try {
        await signOut(auth);
      } catch (e) {}
      
      throw err;
    }
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
export const studentsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('students'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('students getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('students'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('students getByGroup error:', err);
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
};

// ==================== TEACHERS (Center-based) ====================
export const teachersAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('teachers'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('teachers getAll error:', err);
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
      console.error('groups getAll error:', err);
      return [];
    }
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(centerCollection('groups'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('groups getByTeacher error:', err);
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
      console.error('payments getAll error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('payments'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('payments getByStudent error:', err);
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
      console.error('monthly_bills getAll error:', err);
      return [];
    }
  },

  getMonthlyBillsByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('monthly_bills'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('monthly_bills getByStudent error:', err);
      return [];
    }
  },

  getMonthlyBillsByMonth: async (month) => {
    try {
      const q = query(centerCollection('monthly_bills'), where('month', '==', month));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('monthly_bills getByMonth error:', err);
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

  updateMonthlyBill: async (id, data) => {
    await updateDoc(centerDoc('monthly_bills', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
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
      console.error('attendance getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('attendance'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('attendance getByGroup error:', err);
      return [];
    }
  },

  getByDate: async (date) => {
    try {
      const q = query(centerCollection('attendance'), where('date', '==', date));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('attendance getByDate error:', err);
      return [];
    }
  },

  getByGroupAndDate: async (groupId, date) => {
    try {
      // Avval guruh bo'yicha olish, keyin date bo'yicha filter
      const q = query(centerCollection('attendance'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(a => a.date === date);
      return results;
    } catch (err) {
      console.error('attendance getByGroupAndDate error:', err);
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
    const results = [];
    for (const record of records) {
      const docRef = await addDoc(centerCollection('attendance'), {
        ...record,
        createdAt: serverTimestamp(),
      });
      results.push({ id: docRef.id, ...record });
    }
    return results;
  },

  bulkUpdate: async (records) => {
    for (const record of records) {
      if (record.id) {
        await updateDoc(centerDoc('attendance', record.id), record);
      }
    }
    return records;
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

      // Har bir record uchun
      for (const record of records) {
        if (existing[record.studentId]) {
          // Mavjud - yangilash
          await updateDoc(centerDoc('attendance', existing[record.studentId].id), {
            status: record.status,
            updatedAt: serverTimestamp()
          });
        } else {
          // Yangi - yaratish
          await addDoc(centerCollection('attendance'), {
            ...record,
            groupId,
            date,
            createdAt: serverTimestamp(),
          });
        }
      }
      return true;
    } catch (err) {
      console.error('attendance save error:', err);
      throw err;
    }
  },
};

// ==================== GRADES (Center-based) ====================
export const gradesAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(centerCollection('grades'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('grades getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('grades'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('grades getByGroup error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('grades'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('grades getByStudent error:', err);
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
      console.error('leads getAll error:', err);
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
      console.error('settings get error:', err);
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
      console.error('schedule getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('schedule'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('schedule getByGroup error:', err);
      return [];
    }
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(centerCollection('schedule'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('schedule getByTeacher error:', err);
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
      console.error('teacher_ratings getAll error:', err);
      return [];
    }
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(centerCollection('teacher_ratings'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('teacher_ratings getByTeacher error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(centerCollection('teacher_ratings'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  checkExisting: async (teacherId, odamId) => {
    try {
      const q = query(
        centerCollection('teacher_ratings'),
        where('teacherId', '==', teacherId),
        where('odamId', '==', odamId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      console.error('checkExisting error:', err);
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
      console.error('homework getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('homework'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('homework getByGroup error:', err);
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
      console.error('getSubmissions error:', err);
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
  getMessages: async (groupId, limit = 100) => {
    try {
      const q = query(
        centerCollection('chat_messages'),
        where('groupId', '==', groupId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const timeA = a.timestamp?.seconds || new Date(a.timestamp).getTime() / 1000;
          const timeB = b.timestamp?.seconds || new Date(b.timestamp).getTime() / 1000;
          return timeA - timeB;
        })
        .slice(-limit);
    } catch (err) {
      console.error('getMessages error:', err);
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
      let q;
      if (lastRead) {
        q = query(
          centerCollection('chat_messages'),
          where('groupId', '==', groupId)
        );
      } else {
        q = query(
          centerCollection('chat_messages'),
          where('groupId', '==', groupId)
        );
      }
      
      const snapshot = await getDocs(q);
      
      if (!lastRead) return snapshot.size;
      
      const lastReadTime = lastRead?.seconds || new Date(lastRead).getTime() / 1000;
      return snapshot.docs.filter(doc => {
        const msgTime = doc.data().timestamp?.seconds || new Date(doc.data().timestamp).getTime() / 1000;
        return msgTime > lastReadTime && doc.data().senderId !== odamId;
      }).length;
    } catch (err) {
      console.error('getUnreadCount error:', err);
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
      console.error('markAsRead error:', err);
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
      console.error('quizzes getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('quizzes'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('quizzes getByGroup error:', err);
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
      console.error('getResults error:', err);
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
      console.error('materials getAll error:', err);
      return [];
    }
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(centerCollection('materials'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('materials getByGroup error:', err);
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
      console.error('rewards getAll error:', err);
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

  // Sotib olishlar
  getPurchases: async () => {
    try {
      const snapshot = await getDocs(centerCollection('reward_purchases'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('getPurchases error:', err);
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
      console.error('feedback error:', err);
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
      console.error('certificates getAll error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    try {
      const q = query(centerCollection('certificates'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('certificates getByStudent error:', err);
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
};
