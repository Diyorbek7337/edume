import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, serverTimestamp, setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db } from './firebase';

// Yangi foydalanuvchi yaratish uchun alohida Firebase instance
// Bu joriy foydalanuvchini logout qilmaslik uchun kerak
const getSecondaryAuth = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  };
  const secondaryApp = initializeApp(firebaseConfig, 'Secondary' + Date.now());
  return getAuth(secondaryApp);
};

// ==================== USERS ====================
export const usersAPI = {
  getByRole: async (role) => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', role));
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

  create: async (data, password) => {
    const secondaryAuth = getSecondaryAuth();
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, password);
    const uid = userCredential.user.uid;
    
    const userData = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      role: data.role,
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

// ==================== STUDENTS ====================
export const studentsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'students'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('students getAll error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'students', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  getByGroup: async (groupId) => {
    try {
      const q = query(collection(db, 'students'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('getByGroup error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'students'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'students', id), { ...data, updatedAt: serverTimestamp() });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'students', id));
    return true;
  },
};

// ==================== TEACHERS ====================
export const teachersAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'teachers'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('teachers getAll error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'teachers', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'teachers'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'teachers', id), { ...data, updatedAt: serverTimestamp() });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'teachers', id));
    return true;
  },
};

// ==================== GROUPS ====================
export const groupsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'groups'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('groups getAll error:', err);
      return [];
    }
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'groups', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  getByTeacher: async (teacherId) => {
    try {
      const q = query(collection(db, 'groups'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('getByTeacher error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'groups'), {
      ...data,
      studentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'groups', id), { ...data, updatedAt: serverTimestamp() });
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'groups', id));
    return true;
  },
};

// ==================== LEADS ====================
export const leadsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'leads'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('leads getAll error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...data,
      status: 'new',
      notes: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'leads', id), { ...data, updatedAt: serverTimestamp() });
    return { id, ...data };
  },

  addNote: async (id, note) => {
    const leadDoc = await getDoc(doc(db, 'leads', id));
    const notes = leadDoc.data()?.notes || [];
    notes.push({ ...note, date: new Date().toISOString() });
    await updateDoc(doc(db, 'leads', id), { notes, updatedAt: serverTimestamp() });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'leads', id));
    return true;
  },
};

// ==================== PAYMENTS ====================
export const paymentsAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'payments'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('payments getAll error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    const q = query(collection(db, 'payments'), where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'payments'), { ...data, createdAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'payments', id), data);
    return { id, ...data };
  },
};

// ==================== ATTENDANCE ====================
export const attendanceAPI = {
  getByGroupAndDate: async (groupId, date) => {
    try {
      const q = query(collection(db, 'attendance'), where('groupId', '==', groupId), where('date', '==', date));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('attendance error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    const q = query(collection(db, 'attendance'), where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  save: async (groupId, date, records) => {
    const existing = await attendanceAPI.getByGroupAndDate(groupId, date);
    for (const record of existing) {
      await deleteDoc(doc(db, 'attendance', record.id));
    }
    for (const record of records) {
      await addDoc(collection(db, 'attendance'), {
        groupId, date, studentId: record.studentId, studentName: record.studentName, status: record.status, createdAt: serverTimestamp()
      });
    }
    return true;
  },
};

// ==================== GRADES ====================
export const gradesAPI = {
  getByGroup: async (groupId) => {
    try {
      const q = query(collection(db, 'grades'), where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('grades error:', err);
      return [];
    }
  },

  getByStudent: async (studentId) => {
    const q = query(collection(db, 'grades'), where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'grades'), { ...data, createdAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    await updateDoc(doc(db, 'grades', id), data);
    return { id, ...data };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'grades', id));
    return true;
  },
};

// ==================== MESSAGES ====================
export const messagesAPI = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'messages'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('messages error:', err);
      return [];
    }
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, 'messages'), { ...data, read: false, createdAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  },

  markAsRead: async (id) => {
    await updateDoc(doc(db, 'messages', id), { read: true });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, 'messages', id));
    return true;
  },
};

// ==================== FEEDBACK ====================
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

// ==================== SETTINGS ====================
export const settingsAPI = {
  get: async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'general'));
      return docSnap.exists() ? docSnap.data() : null;
    } catch (err) {
      console.error('settings error:', err);
      return null;
    }
  },

  update: async (data) => {
    await setDoc(doc(db, 'settings', 'general'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  },
};
