import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// App Check — reCAPTCHA v3 orqali DDoS va API suiiste'moldan himoya.
// Kalit sozlanmagan bo'lsa (masalan, lokal muhit) o'tkazib yuboriladi —
// aks holda ReCaptchaV3Provider undefined bilan modul yuklanishida otilib,
// butun ilova oq ekran bo'lib qoladi.
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (typeof window !== 'undefined' && recaptchaSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else if (typeof window !== 'undefined') {
  console.warn('VITE_RECAPTCHA_SITE_KEY sozlanmagan — App Check o\'chirilgan');
}

// Session persistence: brauzer yopilganda sessiya tugaydi
setPersistence(auth, browserSessionPersistence).catch(console.error);

// Center context for multi-tenant
let currentCenterId = null;

export const setCurrentCenter = (centerId) => {
  currentCenterId = centerId;
  if (centerId) {
    localStorage.setItem('currentCenterId', centerId);
  } else {
    localStorage.removeItem('currentCenterId');
  }
};

export const getCurrentCenter = () => {
  if (!currentCenterId) {
    currentCenterId = localStorage.getItem('currentCenterId');
  }
  return currentCenterId;
};

// ==================== FAQAT-O'QISH REJIMI ====================
// Obuna muddati (3 kunlik imtiyoz bilan) tugagan yoki markaz to'xtatilgan
// bo'lsa AuthContext shu bayroqni false qiladi. api.js dagi barcha yozish
// amallari (addDoc/updateDoc/setDoc/deleteDoc/batch/transaction) markaz
// kolleksiyalariga yozishdan OLDIN shu yerni tekshiradi va tushunarli xato
// qaytaradi. Haqiqiy himoya — firestore.rules (centerWritable); bu faqat
// foydalanuvchiga "Missing or insufficient permissions" o'rniga aniq xabar
// ko'rsatish uchun.
let centerWritable = true;

export const setCenterWritable = (value) => {
  centerWritable = value !== false;
};

export const isCurrentCenterWritable = () => centerWritable;

// Faqat-o'qish rejimida ham ruxsat etilgan kolleksiyalar (o'qilganlik belgilari)
const READ_ONLY_EXEMPT = ['chat_read_status', 'messages'];

export const READ_ONLY_MESSAGE =
  "Obuna muddati tugagan — tizim faqat ko'rish rejimida. Davom ettirish uchun tarifni yangilang.";

export const assertCenterWritable = (refOrPath) => {
  if (centerWritable) return;
  const path = typeof refOrPath === 'string' ? refOrPath : refOrPath?.path || '';
  const parts = path.split('/');
  if (parts[0] !== 'centers' || parts.length < 3) return; // global kolleksiyalar (users, ...)
  if (READ_ONLY_EXEMPT.includes(parts[2])) return;
  const err = new Error(READ_ONLY_MESSAGE);
  err.code = 'subscription/read-only';
  throw err;
};

// ==================== JORIY FOYDALANUVCHI (o'quvchi/ota-ona maxfiyligi) ====================
// AuthContext o'rnatadi. api.js → studentsAPI shu orqali o'quvchi/ota-onaga
// boshqa talabalarning TO'LIQ yozuvlari o'rniga faqat katalogni (ism, guruh,
// holat) qaytaradi — firestore.rules ularga students ro'yxatini bermaydi.
let viewer = { role: null, uid: null, childIds: [] };

export const setViewer = (userData) => {
  if (!userData) {
    viewer = { role: null, uid: null, childIds: [] };
    return;
  }
  const childIds = Array.isArray(userData.childIds) ? [...userData.childIds] : [];
  if (userData.childId && !childIds.includes(userData.childId)) childIds.push(userData.childId);
  viewer = { role: userData.role || null, uid: userData.id || null, childIds };
};

export const getViewer = () => viewer;

export const isLearnerViewer = () => viewer.role === 'student' || viewer.role === 'parent';

// Collection paths with center prefix
export const getCenterCollection = (collectionName) => {
  const centerId = getCurrentCenter();
  if (!centerId) {
    // Global (markazsiz) yo'lga yozib yubormaslik uchun fallback emas — xato
    throw new Error('No center selected');
  }
  return `centers/${centerId}/${collectionName}`;
};

export default app;
