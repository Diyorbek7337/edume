// Tarif rejalari va cheklovlar
export const SUBSCRIPTION_PLANS = {
  // 30 kunlik bepul VIP sinov — Pro darajasida
  trial: {
    name: 'Trial',
    nameUz: '30 kunlik VIP sinov',
    price: 0,
    priceUzs: 0,
    priceUsd: 0,
    duration: 30,
    limits: {
      students: -1,  // cheksiz sinov davrida
      teachers: -1,
      groups:   -1,
      admins:   -1,
    },
    features: {
      telegramNotifications: true,
      fullReports:           true,
      prioritySupport:       true,
    },
    color: 'amber',
    icon: 'Crown',
    badge: 'VIP',
    popular: false,
  },

  // 100,000 so'm/oy — yakka o'qituvchilar uchun (markaz tashkil qilmagan repetitorlar).
  // Pozitsiyalash: Basic'dan (99,000) 1000 so'm qimmatroq, lekin talaba soni 150
  // (Basic'ning 100 tasidan ko'p!) — bir o'qituvchi ko'p talabaga dars berishi
  // mumkin, deb hisoblanadi. Baribir Solo Basic bilan yonma-yon TAQQOSLAB
  // ko'rsatilmaydi (alohida segment, alohida sotuv sahifasi/xabar) — ikkalasi
  // butunlay boshqa mezon (talaba/o'qituvchi nisbati) bo'yicha farqlanadi.
  solo: {
    name: 'Solo',
    nameUz: 'Yakka o\'qituvchi',
    price: 100000,
    priceUzs: 100000,
    priceUsd: 8,
    duration: 30,
    limits: {
      students: 150,
      teachers: 1,   // faqat o'zi (Teachers kolleksiyasida) — ikkinchi haqiqiy o'qituvchi yozuvi qo'sha olmaydi
      groups:   12,  // 150 talaba ~12 guruhga (o'rtacha 12-13 talaba/guruh) taqsimlanishi uchun
      admins:   1,   // BITTA "yordamchi o'qituvchi" — cheklangan huquqli admin (students/attendance/grades)
    },
    features: {
      telegramNotifications: false,
      fullReports:           true,
      prioritySupport:       false,
    },
    color: 'emerald',
    icon: 'User',
    badge: null,
    popular: false,
  },

  // 99,000 so'm/oy
  basic: {
    name: 'Basic',
    nameUz: 'Asosiy',
    price: 99000,
    priceUzs: 99000,
    priceUsd: 8,
    duration: 30,
    limits: {
      students: 100,
      teachers: 10,
      groups:   20,
      admins:   2,
    },
    features: {
      telegramNotifications: false,
      fullReports:           true,
      prioritySupport:       false,
    },
    color: 'blue',
    icon: 'Zap',
    badge: null,
    popular: true,
  },

  // 199,000 so'm/oy
  pro: {
    name: 'Pro',
    nameUz: 'Professional',
    price: 199000,
    priceUzs: 199000,
    priceUsd: 16,
    duration: 30,
    limits: {
      students: -1,
      teachers: -1,
      groups:   -1,
      admins:   -1,
    },
    features: {
      telegramNotifications: true,
      fullReports:           true,
      prioritySupport:       true,
    },
    color: 'purple',
    icon: 'Crown',
    badge: 'Eng yaxshi',
    popular: false,
  },
};

// Limit tekshirish
export const checkLimit = (subscription, limitType, currentCount) => {
  const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
  const limit = plan.limits[limitType];
  if (limit === -1) return { allowed: true, limit: -1, current: currentCount, remaining: -1 };
  const remaining = limit - currentCount;
  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount,
    remaining: Math.max(0, remaining),
  };
};

// Feature mavjudligini tekshirish
export const hasFeature = (subscription, feature) => {
  const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
  return plan.features[feature] || false;
};

// Limit xabari
export const getLimitMessage = (limitType, subscription) => {
  const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
  const limit = plan.limits[limitType];
  const typeNames = {
    students: "o'quvchilar",
    teachers: "o'qituvchilar",
    groups:   "guruhlar",
    admins:   "adminlar",
  };
  if (limit === -1) return '';
  return `${plan.nameUz} tarifida ${limit} ta ${typeNames[limitType]} cheklovi mavjud. Limitni oshirish uchun tarifni yangilang.`;
};

// Narxni formatlash
export const formatPrice = (plan) => {
  // plan noma'lum bo'lishi MUMKIN: markazda SUBSCRIPTION_PLANS'da yo'q tarif
  // nomi turgan bo'lsa (eski yoki qo'lda yozilgan qiymat) SUBSCRIPTION_PLANS[sub]
  // undefined qaytaradi. Ilgari bu yerda undefined.price o'qilib, butun
  // Sozlamalar sahifasi yiqilardi.
  if (!plan || typeof plan.priceUzs !== 'number') return '—';
  if (plan.price === 0) return 'Bepul (30 kun)';
  return `${plan.priceUzs.toLocaleString()} so'm/oy`;
};

// Tarif taqqoslash ro'yxati
export const PLAN_FEATURES_LIST = [
  { key: 'students',              label: "O'quvchilar",         type: 'limit' },
  { key: 'teachers',              label: "O'qituvchilar",        type: 'limit' },
  { key: 'groups',                label: 'Guruhlar',             type: 'limit' },
  { key: 'admins',                label: 'Adminlar',             type: 'limit' },
  { key: 'telegramNotifications', label: 'Telegram xabarnomalar', type: 'boolean' },
  { key: 'fullReports',           label: "To'liq hisobotlar",    type: 'boolean' },
  { key: 'prioritySupport',       label: 'Tezkor yordam',        type: 'boolean' },
];

// Markaz turiga qarab KO'RSATILADIGAN tariflar.
//
// Solo (100,000) Basic'dan (99,000) qimmatroq bo'lgani uchun ular yonma-yon
// ko'rsatilsa mijoz chalkashadi. Ular butunlay boshqa segment: Solo — bitta
// repetitor (150 o'quvchi, 1 o'qituvchi), Basic — markaz (100 o'quvchi, 10
// o'qituvchi). Shuning uchun har bir mijoz faqat o'ziga tegishlisini ko'radi:
//   yakka o'qituvchi  → Solo + Pro
//   o'quv markaz      → Basic + Pro
export const getVisiblePlans = (centerType, currentSubscription) => {
  const base = centerType === 'solo' ? ['solo', 'pro'] : ['basic', 'pro'];
  // Joriy tarif ro'yxatga kirmasa ham ko'rsatiladi (masalan super_admin qo'lda
  // boshqa tarif bergan bo'lsa) — mijoz o'zi nimada turganini bilishi shart.
  if (
    currentSubscription
    && currentSubscription !== 'trial'
    && SUBSCRIPTION_PLANS[currentSubscription]
    && !base.includes(currentSubscription)
  ) {
    return [currentSubscription, ...base];
  }
  return base;
};

// Sinov tugagan banner uchun qisqa narx matni. MUHIM: narxlar shu yerdan —
// SUBSCRIPTION_PLANS dan — olinadi, qo'lda yozilmaydi. Ilgari banner matni
// qo'lda yozilgan edi va Pro narxi eskirib, mijozga 249,000 deb ko'rsatilardi
// (aslida 199,000).
export const trialUpgradeHint = (centerType) =>
  getVisiblePlans(centerType, null)
    .map(key => `${SUBSCRIPTION_PLANS[key].nameUz}: ${SUBSCRIPTION_PLANS[key].priceUzs.toLocaleString()} so'm/oy`)
    .join(' · ');

// Sinov muddati tugaganmi
export const isTrialExpired = (center) => {
  if (center?.subscription !== 'trial') return false;
  const trialEndsAt = center?.trialEndsAt;
  if (!trialEndsAt) return false;
  const endDate = trialEndsAt?.toDate ? trialEndsAt.toDate() : new Date(trialEndsAt);
  return new Date() > endDate;
};

// Sinov muddati qolgan kunlar
export const trialDaysLeft = (center) => {
  if (center?.subscription !== 'trial') return null;
  const trialEndsAt = center?.trialEndsAt;
  if (!trialEndsAt) return null;
  const endDate = trialEndsAt?.toDate ? trialEndsAt.toDate() : new Date(trialEndsAt);
  const diff = endDate - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Eski kodni qo'llab-quvvatlash uchun
export const calculateTotalPrice = (subscription) => {
  const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
  return plan.price;
};

export const ADDON_SERVICES = {};

// ==================== OBUNA HOLATI (muddat + imtiyoz) ====================
//
// firestore.rules (centerWritable) va bot loyihasidagi functions/centerAccess.js
// bilan BIR XIL mantiq — birini o'zgartirsangiz, qolganlarini ham moslang.
//
//   active    — sinov/tarif muddati tugamagan
//   grace     — muddat tugagan, 3 kunlik imtiyoz davri (hamma narsa ishlaydi)
//   expired   — imtiyoz ham tugagan: faqat o'qish rejimi
//   suspended — super_admin qo'lda to'xtatgan: faqat o'qish rejimi
//
// Muddat maydoni: sinovda `trialEndsAt`, pullik tarifda `paidUntil`.
// Pullik tarifda `paidUntil` bo'lmasa (eski mijozlar) — muddatsiz.
export const GRACE_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const toDateSafe = (v) => {
  if (!v) return null;
  if (typeof v.toDate === 'function') return v.toDate();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const getCenterAccess = (center, now = new Date()) => {
  const base = { state: 'active', endsAt: null, graceEndsAt: null, daysLeft: null };
  if (!center) return base;
  if (center.status === 'suspended') return { ...base, state: 'suspended' };

  const subscription = center.subscription || 'trial';
  const endsAt = toDateSafe(subscription === 'trial' ? center.trialEndsAt : center.paidUntil);
  if (!endsAt) return base;

  const graceEndsAt = new Date(endsAt.getTime() + GRACE_DAYS * DAY_MS);
  if (now < endsAt) {
    return { state: 'active', endsAt, graceEndsAt, daysLeft: Math.ceil((endsAt - now) / DAY_MS) };
  }
  if (now < graceEndsAt) {
    return { state: 'grace', endsAt, graceEndsAt, daysLeft: Math.ceil((graceEndsAt - now) / DAY_MS) };
  }
  return { state: 'expired', endsAt, graceEndsAt, daysLeft: 0 };
};

export const isCenterWritable = (center, now = new Date()) => {
  const { state } = getCenterAccess(center, now);
  return state === 'active' || state === 'grace';
};

// Muddatni uzaytirish (SuperAdmin): joriy muddat hali tugamagan bo'lsa — undan
// keyin, tugagan bo'lsa — bugundan boshlab `days` kun qo'shiladi. Shunda mijoz
// kechikib to'lasa ham to'langan kunlarini to'liq oladi, oldindan to'lasa yo'qotmaydi.
export const extendFrom = (current, days, now = new Date()) => {
  const cur = toDateSafe(current);
  const start = cur && cur > now ? cur : now;
  return new Date(start.getTime() + days * DAY_MS);
};
