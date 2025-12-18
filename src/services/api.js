import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, serverTimestamp, setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, getCurrentCenter, getCenterCollection } from './firebase';

// Yangi foydalanuvchi yaratish uchun alohida Firebase instance
const getSecondaryAuth = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  };
  const secondaryApp = initializeApp(firebaseConfig, 'Secondary' + Date.now());
  return getAuth(secondaryApp);
};

// Helper: Get collection reference with center prefix
const centerCollection = (name) => collection(db, getCenterCollection(name));
const centerDoc = (name, id) => doc(db, getCenterCollection(name), id);

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
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 kun
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
    // 1. Center yaratish
    const centerRef = await addDoc(collection(db, 'centers'), {
      name: centerData.name,
      phone: centerData.phone || '',
      email: centerData.email || '',
      address: centerData.address || '',
      logo: centerData.logo || '',
      status: 'active',
      subscription: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const centerId = centerRef.id;

    // 2. Admin user yaratish
    const secondaryAuth = getSecondaryAuth();
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, adminData.email, password);
    const uid = userCredential.user.uid;

    // 3. Users kolleksiyasiga qo'shish
    await setDoc(doc(db, 'users', uid), {
      fullName: adminData.fullName,
      email: adminData.email,
      phone: adminData.phone || '',
      role: 'director',
      centerId: centerId, // Qaysi markazga tegishli
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

    await secondaryAuth.signOut();

    return { centerId, odamId: uid };
  },
};

// ==================== USERS (Global with centerId) ====================
export const usersAPI = {
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
    const secondaryAuth = getSecondaryAuth();
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, password);
    const uid = userCredential.user.uid;
    
    const userData = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      role: data.role,
      centerId: centerId, // Markaz ID
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, 'users', uid), userData);
    await secondaryAuth.signOut();
    
    return { id: uid, ...userData };
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
};
// ==================== Feedback ====================

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

  // YANGI METOD: Guruh va sana bo'yicha davomat olish
  getByGroupAndDate: async (groupId, date) => {
    try {
      const q = query(
        centerCollection('attendance'), 
        where('groupId', '==', groupId),
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('attendance getByGroupAndDate error:', err);
      return [];
    }
  },

  // YANGI METOD: Davomat saqlash (yangilash yoki yaratish)
  save: async (groupId, date, records) => {
    try {
      // Avval mavjud davomat borligini tekshirish
      const q = query(
        centerCollection('attendance'), 
        where('groupId', '==', groupId),
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);
      const existing = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Har bir o'quvchi uchun yangilash yoki yaratish
      const results = [];
      for (const record of records) {
        const existingRecord = existing.find(e => e.studentId === record.studentId);
        
        if (existingRecord) {
          // Mavjud davomat - yangilash
          await updateDoc(centerDoc('attendance', existingRecord.id), {
            status: record.status,
            studentName: record.studentName,
            updatedAt: serverTimestamp(),
          });
          results.push({ id: existingRecord.id, ...record });
        } else {
          // Yangi davomat - yaratish
          const docRef = await addDoc(centerCollection('attendance'), {
            groupId,
            date,
            studentId: record.studentId,
            studentName: record.studentName,
            status: record.status,
            createdAt: serverTimestamp(),
          });
          results.push({ id: docRef.id, ...record });
        }
      }
      
      return results;
    } catch (err) {
      console.error('attendance save error:', err);
      throw err;
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
