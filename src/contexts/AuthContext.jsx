import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, setCurrentCenter, getCurrentCenter, setCenterWritable, setViewer } from '../services/firebase';
import { getCenterAccess } from '../utils/subscriptions';
import { setSentryUser, clearSentryUser, captureError } from '../services/sentry';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserDataState] = useState(null);
  // Viewer (studentsAPI uchun rol/childIds) SINXRON o'rnatiladi — sahifalarning
  // useEffect'lari AuthContext'nikidan OLDIN ishlaydi, shuning uchun effektda
  // o'rnatish kechikardi va birinchi so'rov noto'g'ri rol bilan ketardi.
  const setUserData = (data) => {
    setViewer(data);
    setUserDataState(data);
  };
  const [centerData, setCenterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 soat

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sessiya vaqtini tekshirish
        const loginTime = sessionStorage.getItem('loginTime');
        if (!loginTime || Date.now() - parseInt(loginTime) > SESSION_DURATION) {
          await firebaseSignOut(auth);
          sessionStorage.removeItem('loginTime');
          setLoading(false);
          return;
        }

        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = { id: userDoc.id, ...userDoc.data() };
            setUserData(data);
            setSentryUser(firebaseUser.uid, data.role, data.centerId);

            // Center ma'lumotlarini olish va set qilish
            if (data.centerId) {
              setCurrentCenter(data.centerId);
              const centerDoc = await getDoc(doc(db, 'centers', data.centerId));
              if (centerDoc.exists()) {
                setCenterData({ id: centerDoc.id, ...centerDoc.data() });
              }
            }
          }
        } catch (err) {
          captureError(err, { context: 'fetchUserData' });
          toast.error("Foydalanuvchi ma'lumotlari yuklanmadi. Sahifani yangilang.", { toastId: 'auth-fetch-error' });
        }
      } else {
        setUser(null);
        setUserData(null);
        setCenterData(null);
        setCurrentCenter(null);
        clearSentryUser();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence);
    // loginTime ni oldin set qilish kerak, chunki onAuthStateChanged
    // signInWithEmailAndPassword dan darhol ishga tushadi va loginTime null bo'lsa logout qiladi
    sessionStorage.setItem('loginTime', Date.now().toString());
    let result;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      sessionStorage.removeItem('loginTime');
      throw err;
    }
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    let role = null;
    if (userDoc.exists() && userDoc.data().role === 'device') {
      // Face ID terminal account: only for the "Davomat" program, never for the web app
      await firebaseSignOut(auth);
      sessionStorage.removeItem('loginTime');
      throw Object.assign(new Error('Bu Face ID qurilmasi akkaunti — u bilan Edume\'ga kirib bo\'lmaydi'), { code: 'auth/device-account' });
    }
    if (userDoc.exists()) {
      const data = { id: userDoc.id, ...userDoc.data() };
      role = data.role;
      setUser(result.user);
      setUserData(data);

      // Center set qilish
      if (data.centerId) {
        setCurrentCenter(data.centerId);
        const centerDoc = await getDoc(doc(db, 'centers', data.centerId));
        if (centerDoc.exists()) {
          setCenterData({ id: centerDoc.id, ...centerDoc.data() });
        }
      }
    }
    return { ...result, role };
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    sessionStorage.removeItem('loginTime');
    setUser(null);
    setUserData(null);
    setCenterData(null);
    setCurrentCenter(null);
  };

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (userDoc.exists()) {
      setUserData({ id: userDoc.id, ...userDoc.data() });
    }
  };

  // centerId ni userData dan yoki getCurrentCenter dan olish
  const centerId = userData?.centerId || getCurrentCenter();

  // Obuna holati: active | grace | expired | suspended (utils/subscriptions.js).
  // expired/suspended — faqat o'qish rejimi (api.js yozishdan oldin tekshiradi,
  // firestore.rules esa server tomonda bloklaydi). super_admin cheklanmaydi.
  const centerAccess = useMemo(() => getCenterAccess(centerData), [centerData]);
  const isSuperAdminUser = userData?.role === 'super_admin';
  const readOnly = !isSuperAdminUser && (centerAccess.state === 'expired' || centerAccess.state === 'suspended');

  useEffect(() => {
    setCenterWritable(!readOnly);
  }, [readOnly]);

  const value = {
    user,
    userData,
    centerData,
    loading,
    signIn,
    signOut,
    refreshUserData,
    isAuthenticated: !!user,
    role: userData?.role || null,
    centerId,
    centerAccess,
    readOnly,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
