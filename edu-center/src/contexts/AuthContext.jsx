import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, setCurrentCenter, getCurrentCenter } from '../services/firebase';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = { id: userDoc.id, ...userDoc.data() };
            setUserData(data);
            
            // Center ma'lumotlarini olish va set qilish
            if (data.centerId) {
              console.log('Setting centerId:', data.centerId);
              setCurrentCenter(data.centerId);
              const centerDoc = await getDoc(doc(db, 'centers', data.centerId));
              if (centerDoc.exists()) {
                setCenterData({ id: centerDoc.id, ...centerDoc.data() });
              }
            } else {
              console.warn('User has no centerId:', data);
            }
          } else {
            console.warn('User document not found for:', firebaseUser.uid);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        setUser(null);
        setUserData(null);
        setCenterData(null);
        setCurrentCenter(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (userDoc.exists()) {
      const data = { id: userDoc.id, ...userDoc.data() };
      setUserData(data);
      
      // Center set qilish
      if (data.centerId) {
        console.log('SignIn - Setting centerId:', data.centerId);
        setCurrentCenter(data.centerId);
        const centerDoc = await getDoc(doc(db, 'centers', data.centerId));
        if (centerDoc.exists()) {
          setCenterData({ id: centerDoc.id, ...centerDoc.data() });
        }
      } else {
        console.warn('SignIn - User has no centerId');
      }
    }
    return result;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
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
