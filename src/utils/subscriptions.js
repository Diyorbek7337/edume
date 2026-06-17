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
      aiQuiz:                true,
      prioritySupport:       true,
    },
    color: 'amber',
    icon: 'Crown',
    badge: 'VIP',
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
      aiQuiz:                false,
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
      aiQuiz:                true,
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
  { key: 'aiQuiz',                label: 'AI test yaratish',     type: 'boolean' },
  { key: 'prioritySupport',       label: 'Tezkor yordam',        type: 'boolean' },
];

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
