// Tarif rejalari bo'yicha limitlar (sanaladigan turlar: students/teachers/groups/admins).
// MUHIM: shu qiymatlarni src/utils/subscriptions.js dagi SUBSCRIPTION_PLANS[...].limits
// bilan qo'lda sinxron tuting — ikkisi turli runtime'da ishlagani uchun (Vite/ESM vs
// Cloud Functions/CommonJS) umumiy fayl ulash imkonsiz.
const SUBSCRIPTION_LIMITS = {
  trial: { students: -1, teachers: -1, groups: -1, admins: -1 },
  solo: { students: 150, teachers: 1, groups: 12, admins: 1 },
  basic: { students: 100, teachers: 10, groups: 20, admins: 2 },
  pro: { students: -1, teachers: -1, groups: -1, admins: -1 },
};

function resolveLimits(subscription) {
  return SUBSCRIPTION_LIMITS[subscription] || SUBSCRIPTION_LIMITS.trial;
}

/**
 * Markaz turini aniqlaydi — /pricing sahifasi shu maydonga qarab qaysi
 * tariflarni ko'rsatishni tanlaydi (solo → Solo+Pro, center → Basic+Pro).
 *
 * Qoidalar (TAXMIN QILINMAYDI — faqat aniq signalga tayanadi):
 *   1) `type` allaqachon bor bo'lsa — TEGILMAYDI (ro'yxatdan o'tishda qo'yilgan
 *      yoki super_admin qo'lda o'zgartirgan)
 *   2) tarifi allaqachon 'solo' bo'lsa — bu aniq yakka o'qituvchi
 *   3) qolgan hamma holatda 'center' — bu hozirgi xatti-harakatning O'ZI
 *      (getVisiblePlans'da `type` yo'q bo'lsa markaz deb hisoblanadi), ya'ni
 *      hech kim uchun hech narsa o'zgarmaydi, shunchaki maydon aniq yoziladi.
 *
 * O'qituvchi soniga qarab TAXMIN QILINMAYDI: yangi ochilgan markazda ham bitta
 * o'qituvchi bo'lishi mumkin, uni "yakka o'qituvchi" deb belgilash xato bo'lardi
 * va u noto'g'ri tariflarni ko'rib qolardi. Bunday markazlarni SuperAdmin
 * sahifasidagi "Markaz/Yakka" tanlovi orqali qo'lda to'g'rilash mumkin.
 */
function resolveCenterType(centerData) {
  const data = centerData || {};
  if (data.type === 'solo' || data.type === 'center') return data.type;
  if (data.subscription === 'solo') return 'solo';
  return 'center';
}

module.exports = { SUBSCRIPTION_LIMITS, resolveLimits, resolveCenterType };
