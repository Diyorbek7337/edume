// Payments.status === 'paid' bo'lgan hujjatlardan centers/{centerId}.revenueStats
// (jami daromad, oy va usul bo'yicha taqsimot) ni yuritish uchun SOF funksiyalar
// — hech qanday Firebase Admin SDK chaqiruvi yo'q, shuning uchun oddiy vitest bilan
// (emulatorsiz) testlanadi. Cloud Function trigger (functions/index.js) va
// backfill skripti (functions/scripts/backfillRevenueStats.js) shu yerdan foydalanadi.
//
// Nega kerak: Reports.jsx ilgari markazning BUTUN to'lovlar tarixini
// (paymentsAPI.getAll()) o'qib, "jami daromad"/"oylik trend"/"to'lov usuli"
// ko'rsatkichlarini har safar qaytadan hisoblardi — yillar davomida bu
// minglab hujjat degani. Endi bu raqamlar markaz hujjatida oldindan
// hisoblangan holda saqlanadi, Reports.jsx BITTA hujjat o'qiydi.

// Firestore map kaliti sifatida xavfsiz bo'lmagan belgilarni olib tashlaydi
// ('.', '/', '[', ']', '*', '~' — map field path'da man etilgan)
function sanitizeKey(value) {
  const cleaned = String(value ?? '').trim().replace(/[./[\]*~]/g, '_');
  return cleaned || 'unknown';
}

// To'lov hujjatidan daromad hissasini chiqaradi. Faqat status === 'paid'
// hisobga olinadi va paidAt/createdAt'dan yaroqli sana chiqarilishi shart —
// aks holda hissasi yo'q (amount: 0, month: null) deb hisoblanadi.
function paymentContribution(data) {
  if (!data || data.status !== 'paid') return { amount: 0, month: null, method: null };

  const raw = data.paidAt || data.createdAt;
  if (!raw) return { amount: 0, month: null, method: null };
  const date = raw?.toDate ? raw.toDate() : new Date(raw);
  if (isNaN(date.getTime())) return { amount: 0, month: null, method: null };

  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const method = sanitizeKey(data.method || 'Naqd');
  const amount = Number(data.amount) || 0;
  return { amount, month, method };
}

// before/after (Firestore document data, ikkalasi ham null bo'lishi mumkin)
// asosida centers/{centerId} hujjatiga qo'llanadigan increment() delta'larni
// hisoblaydi. Create: before=null. Delete: after=null. Update: ikkalasi ham bor
// — shu holatda eski hissa AYIRILADI, yangi hissa QO'SHILADI (agar oy/usul
// o'zgargan bo'lsa, ikkita turli bucket'ga to'g'ri taqsimlanadi).
//
// Natija: { 'revenueStats.total': 500000, 'revenueStats.byMonth.2026-01': 500000, ... }
// — faqat NOLGA TENG BO'LMAGAN delta'lar bilan (o'zgarish bo'lmasa {} qaytaradi).
function computeRevenueDeltas(before, after) {
  const b = paymentContribution(before);
  const a = paymentContribution(after);

  const deltas = {};
  const add = (path, amount) => {
    if (!amount) return;
    deltas[path] = (deltas[path] || 0) + amount;
  };

  if (b.month) {
    add('revenueStats.total', -b.amount);
    add(`revenueStats.byMonth.${b.month}`, -b.amount);
    add(`revenueStats.byMethod.${b.method}`, -b.amount);
  }
  if (a.month) {
    add('revenueStats.total', a.amount);
    add(`revenueStats.byMonth.${a.month}`, a.amount);
    add(`revenueStats.byMethod.${a.method}`, a.amount);
  }

  // Nolga tenglashgan delta'larni tozalash (masalan hech narsa o'zgarmagan holat)
  Object.keys(deltas).forEach((k) => { if (deltas[k] === 0) delete deltas[k]; });
  return deltas;
}

module.exports = { paymentContribution, computeRevenueDeltas, sanitizeKey };
