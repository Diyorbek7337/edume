import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, setCurrentCenter, getCurrentCenter } from '../services/firebase';
import { setSentryUser, clearSentryUser } from '../services/sentry';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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
          console.error('Error fetching user data:', err);
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
    if (userDoc.exists()) {
      const data = { id: userDoc.id, ...userDoc.data() };
      setUserData(data);
      
      // Center set qilish
      if (data.centerId) {
        setCurrentCenter(data.centerId);
        const centerDoc = await getDoc(doc(db, 'centers', data.centerId));
        if (centerDoc.exists()) {
          setCenterData({ id: centerDoc.id, ...centerDoc.data() });
        }
      } else {
      }
    }
    return result;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    sessionStorage.removeItem('loginTime');
    setUser(null);
    setUserData(null);
    setCenterData(null);
    setCurrentCenter(null);
  };

  // centerId ni userData dan yoki getCurrentCenter dan olish
  const centerId = userData?.centerId || getCurrentCenter();

  const value = {
    user,
    userData,
    centerData,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    role: userData?.role || null,
    centerId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
