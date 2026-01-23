// Tarif rejalari va cheklovlar
export const SUBSCRIPTION_PLANS = {
  trial: {
    name: 'Trial',
    nameUz: 'Sinov',
    price: 0,
    priceUzs: 0,
    priceUsd: 0,
    duration: 30, // kun - 30 kun sinov
    limits: {
      students: 20,
      teachers: 3,
      groups: 5,
      admins: 1,
    },
    features: {
      smsNotifications: false,
      telegramNotifications: false,
      fullReports: false,
      prioritySupport: false,
    },
    color: 'yellow',
    icon: 'Clock',
    popular: false,
  },
  
  basic: {
    name: 'Basic',
    nameUz: 'Asosiy',
    price: 165000, // so'm
    priceUzs: 165000,
    priceUsd: 13,
    duration: 30, // kun
    limits: {
      students: 100,
      teachers: 10,
      groups: 25,
      admins: 3,
    },
    features: {
      smsNotifications: false,
      telegramNotifications: true,
      fullReports: true,
      prioritySupport: false,
    },
    color: 'blue',
    icon: 'Zap',
    popular: true,
  },
  
  pro: {
    name: 'Pro',
    nameUz: 'Professional',
    price: 320000, // so'm
    priceUzs: 320000,
    priceUsd: 25,
    duration: 30,
    limits: {
      students: 500,
      teachers: 50,
      groups: 100,
      admins: 10,
    },
    features: {
      smsNotifications: true,
      telegramNotifications: true,
      fullReports: true,
      prioritySupport: true,
    },
    color: 'purple',
    icon: 'Crown',
    popular: false,
  },
  
  enterprise: {
    name: 'Enterprise',
    nameUz: 'Korporativ',
    price: 1270000, // so'm
    priceUzs: 1270000,
    priceUsd: 100,
    duration: 30,
    limits: {
      students: -1, // -1 = cheksiz
      teachers: -1,
      groups: -1,
      admins: -1,
    },
    features: {
      smsNotifications: true,
      telegramNotifications: true,
      fullReports: true,
      prioritySupport: true,
    },
    color: 'emerald',
    icon: 'Shield',
    popular: false,
  },
};

// Qo'shimcha xizmatlar (add-ons)
export const ADDON_SERVICES = {
  sms: {
    name: 'SMS xabarnomalar',
    nameUz: 'SMS xabarnomalar',
    description: "Ota-onalarga avtomatik SMS yuborish",
    price: 180000, // so'm/oy
    priceUzs: 180000,
    priceUsd: 14,
    icon: 'MessageSquare',
    availableFor: ['basic', 'pro', 'enterprise'], // Qaysi tariflarga qo'shish mumkin
  },
  telegram: {
    name: 'Telegram bot',
    nameUz: 'Telegram bot',
    description: "Telegram orqali xabarnomalar va ma'lumot olish",
    price: 100000,
    priceUzs: 100000,
    priceUsd: 8,
    icon: 'Send',
    availableFor: ['trial', 'basic', 'pro', 'enterprise'],
  },
  extraStudents50: {
    name: "+50 o'quvchi",
    nameUz: "+50 o'quvchi limiti",
    description: "O'quvchilar limitini 50 taga oshirish",
    price: 50000,
    priceUzs: 50000,
    priceUsd: 4,
    icon: 'Users',
    availableFor: ['basic', 'pro'],
  },
  extraStudents100: {
    name: "+100 o'quvchi",
    nameUz: "+100 o'quvchi limiti",
    description: "O'quvchilar limitini 100 taga oshirish",
    price: 80000,
    priceUzs: 80000,
    priceUsd: 6,
    icon: 'Users',
    availableFor: ['basic', 'pro'],
  },
  prioritySupport: {
    name: 'Tezkor yordam',
    nameUz: 'Tezkor yordam',
    description: "24/7 telefon va chat orqali yordam",
    price: 100000,
    priceUzs: 100000,
    priceUsd: 8,
    icon: 'Headphones',
    availableFor: ['basic', 'pro'],
  },
  whiteLabel: {
    name: "O'z brending",
    nameUz: "O'z brending",
    description: "Logo va ranglarni o'zgartirish imkoniyati",
    price: 250000,
    priceUzs: 250000,
    priceUsd: 20,
    icon: 'Palette',
    availableFor: ['pro', 'enterprise'],
  },
};

// Markaz uchun jami narxni hisoblash
export const calculateTotalPrice = (subscription, activeAddons = []) => {
  const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
  let total = plan.price;
  
  activeAddons.forEach(addonKey => {
    const addon = ADDON_SERVICES[addonKey];
    if (addon && addon.availableFor.includes(subscription)) {
      total += addon.price;
    }
  });
  
  return total;
};

// Limit tekshirish funksiyasi
export const checkLimit = (subscription, limitType, currentCount) => {
  const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
  const limit = plan.limits[limitType];
  
  // -1 = cheksiz
  if (limit === -1) {
    return { allowed: true, limit: -1, current: currentCount, remaining: -1 };
  }
  
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
    groups: "guruhlar",
    admins: "adminlar",
  };
  
  return `${plan.nameUz} tarifida ${limit} ta ${typeNames[limitType]} cheklovi mavjud. Limitni oshirish uchun tarifni yangilang.`;
};

// Narxni formatlash
export const formatPrice = (plan) => {
  if (plan.price === 0) return 'Bepul';
  return `${plan.priceUzs.toLocaleString()} so'm/oy`;
};

// Tarif taqqoslash uchun
export const PLAN_FEATURES_LIST = [
  { key: 'students', label: "O'quvchilar soni", type: 'limit' },
  { key: 'teachers', label: "O'qituvchilar soni", type: 'limit' },
  { key: 'groups', label: 'Guruhlar soni', type: 'limit' },
  { key: 'admins', label: 'Adminlar soni', type: 'limit' },
  { key: 'fullReports', label: "To'liq hisobotlar", type: 'boolean' },
  { key: 'telegramNotifications', label: 'Telegram xabarnomalar', type: 'boolean' },
  { key: 'smsNotifications', label: 'SMS xabarnomalar', type: 'boolean' },
  { key: 'prioritySupport', label: 'Tezkor yordam', type: 'boolean' },
];
