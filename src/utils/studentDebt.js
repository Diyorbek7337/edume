/**
 * O'quvchi qarzini CRM'ning To'lovlar sahifasi bilan AYNAN BIR XIL hisoblaydi.
 *
 * NEGA KERAK: bot ilgari qarzni faqat monthly_bills yozuvlaridan sanardi.
 * Lekin bu yozuv faqat TO'LOV qilinganda paydo bo'ladi — umuman to'lanmagan
 * oy uchun yozuv yo'q. Natijada eng muhim holatda — ota-ona bir oy umuman
 * to'lamaganda — bot jim turardi. Haqiqiy holat: Ramazonov Kamoliddinning
 * qarzi 305 000 (iyuldan 5 000 + avgust to'liq), bot esa /qarz da "5 000"
 * ko'rsatardi va eslatma yubormasdi.
 *
 * CRM sahifasi esa har bir o'quvchi uchun startDate dan boshlab oylik
 * davrlarni hisoblaydi va yozuvi yo'q davrni "virtual" hisob sifatida
 * guruh narxi bo'yicha qarz deb ko'rsatadi. Bu modul o'sha mantiqning
 * portidir. Manbalar (edu-center):
 *   - src/utils/billingPeriods.js  — getStudentPeriods, getEffectiveCourseDuration
 *   - src/pages/Payments.jsx       — getOrCreatePeriodBill, getStudentBills,
 *                                    getStudentPaymentStatus (pastDebt)
 * Ulardan birini o'zgartirsangiz, bu yerni ham o'zgartiring. Mosligi
 * scripts/checkDebtParity.mjs bilan haqiqiy ma'lumotda tekshiriladi.
 *
 * Modul SOF: hech qanday import yo'q, Firestore'ga murojaat qilmaydi.
 */

export const TIME_ZONE = 'Asia/Tashkent';

// ==================== SANA YORDAMCHILARI ====================

/**
 * Sanani markaz vaqt zonasida YYYY-MM-DD ga aylantiradi.
 * CRM brauzerda (Toshkent vaqti) hisoblaydi, Cloud Functions esa UTC'da
 * ishlaydi. 04:00 Toshkent = 23:00 UTC (kechagi kun) — vaqt zonasi aniq
 * berilmasa, chegaraviy kunlarda bot va CRM turli davrni "joriy" deb oladi.
 */
export const toZonedYMD = (value, timeZone = TIME_ZONE) => {
  if (!value) return '';
  let d;
  if (typeof value?.toDate === 'function') d = value.toDate();
  else if (value instanceof Date) d = value;
  else if (typeof value === 'object' && value._seconds !== undefined) d = new Date(value._seconds * 1000);
  else d = new Date(value);
  if (isNaN(d.getTime())) return '';
  // en-CA formati — YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
};

/** Berilgan sanaga bir kalendar oyi qo'shadi (31 Yan → 28/29 Fev). */
export const addOneMonth = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  let newYear = y;
  let newMonth = m + 1;
  if (newMonth > 12) { newMonth = 1; newYear++; }
  const maxDay = new Date(newYear, newMonth, 0).getDate();
  const newDay = Math.min(d, maxDay);
  return `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
};

// ==================== DAVRLAR ====================

/** O'quvchining o'z qiymati ustun, bo'lmasa guruhniki; aks holda null (cheklanmagan). */
export const getEffectiveCourseDuration = (student, group = null) => {
  const own = parseInt(student?.courseDurationMonths, 10);
  if (own > 0) return own;
  const fromGroup = parseInt(group?.courseDurationMonths, 10);
  return fromGroup > 0 ? fromGroup : null;
};

/**
 * startDate dan joriy davrgacha bo'lgan oylik davrlar.
 * @param today  YYYY-MM-DD (markaz vaqt zonasida)
 */
export const getStudentPeriods = (student, group, today) => {
  if (!student?.startDate) return [];

  const endStr = student.graduatedAt ? toZonedYMD(student.graduatedAt) : today;

  const periods = [];
  let currentStart = student.startDate;
  for (let i = 0; i < 60; i++) {
    const periodEnd = addOneMonth(currentStart);
    periods.push({ periodStart: currentStart, periodEnd, month: currentStart.substring(0, 7) });
    if (periodEnd >= endStr) break;
    currentStart = periodEnd;
  }

  const paused = (student.pausedPeriods || []).filter(p => p.from);
  const active = paused.length === 0
    ? periods
    : periods.filter(period => !paused.some(p =>
        period.periodStart >= p.from && (!p.to || period.periodStart < p.to)));

  const duration = getEffectiveCourseDuration(student, group);
  return duration ? active.slice(0, duration) : active;
};

// ==================== ESKI TO'LOVLAR ====================

// To'lov sanasidan oy (YYYY-MM) — markaz vaqt zonasida
const paymentMonth = (payment) => {
  if (payment.month) return payment.month;
  const raw = payment.paidAt || payment.createdAt;
  const ymd = toZonedYMD(raw);
  return ymd ? ymd.slice(0, 7) : null;
};

/**
 * Hisoblar tizimidan OLDINGI to'lovlarni (monthly_bills'da yozuvi yo'q)
 * oylik hisobga aylantiradi. Payments.jsx convertOldPaymentsToBills'ning
 * bitta o'quvchi uchun porti.
 *
 * NEGA: 2026-yil boshidagi to'lovlar faqat payments kolleksiyasida,
 * monthly_bills'da yozuvi yo'q. Bu qadamsiz o'sha oylar "to'lanmagan"
 * bo'lib chiqadi — Safarov Elshod, Gamirov Dilshod, Ziyodullayev
 * Nurmuhammadga yanvar uchun 500 000 soxta qarz hisoblangan edi.
 *
 * IDEMPOTENT: allaqachon aylantirilgan to'lov (hisob ichida legacyPaymentId
 * bilan turgan) qayta qo'shilmaydi — shuning uchun sahifa aylantirib
 * bo'lgan hisoblarni ham xavfsiz qabul qiladi.
 *
 * @param groups  to'lov boshqa (avvalgi) guruhga tegishli bo'lishi mumkin —
 *                narx o'sha guruhdan olinadi
 */
export const convertLegacyPayments = ({ student, bills = [], payments = [], groups = [], group = null, settings = {} }) => {
  const map = new Map();
  const processed = new Set();
  for (const bill of bills) {
    map.set(bill.periodStart || bill.month, { ...bill });
    for (const p of bill.payments || []) if (p.legacyPaymentId) processed.add(p.legacyPaymentId);
  }

  for (const payment of payments) {
    if (payment.studentId !== student.id || payment.type === 'expense') continue;
    if (processed.has(payment.id) || payment.alreadyInMonthlyBill === true) continue;
    const month = paymentMonth(payment);
    if (!month) continue;

    const gid = payment.groupId || student.groupId;
    const g = groups.find(x => x.id === gid) || (group && student.groupId === gid ? group : null);
    const groupFee = parseInt(g?.monthlyFee) || parseInt(g?.price) || 0;
    const fee = groupFee > 0 ? groupFee : (parseInt(settings?.defaultMonthlyFee) || 500000);

    if (!map.has(month)) {
      map.set(month, {
        studentId: student.id, month, totalAmount: fee, paidAmount: 0,
        remainingAmount: fee, status: 'pending', payments: [], isLegacy: true, appliedDiscount: 0,
      });
    }
    const b = map.get(month);
    const discount = parseInt(payment.discount) || 0;
    const paid = parseInt(payment.amount) || 0;
    b.paidAmount = (b.paidAmount || 0) + paid;
    if (discount > 0) {
      const discountedTotal = Math.round(b.totalAmount * (100 - discount) / 100);
      b.appliedDiscount = discount;
      b.remainingAmount = discountedTotal - b.paidAmount;
    } else {
      b.remainingAmount = b.totalAmount - b.paidAmount;
    }
    if (b.remainingAmount <= 0) { b.remainingAmount = 0; b.status = 'paid'; }
    else if (b.paidAmount > 0) b.status = 'partial';
    b.payments = [...(b.payments || []), { amount: paid, legacyPaymentId: payment.id }];
  }
  return [...map.values()];
};

// ==================== QARZ ====================

const toDateKey = (s) => (s && s.length === 7 ? `${s}-01` : (s || ''));

/**
 * @param {object} p
 * @param {object} p.student   o'quvchi hujjati ({ id, ... })
 * @param {object} p.group     guruh hujjati yoki null
 * @param {Array}  p.bills     SHU o'quvchining monthly_bills yozuvlari
 * @param {object} p.settings  markaz sozlamalari (defaultMonthlyFee)
 * @param {string} p.today     YYYY-MM-DD, markaz vaqt zonasida
 * @param {Array}  [p.payments] SHU o'quvchining payments yozuvlari — berilsa,
 *                              hisobi yo'q eski to'lovlar hisobga aylantiriladi
 * @param {Array}  [p.groups]   eski to'lovlar guruhini topish uchun
 * @returns {{ debt:number, overdueDebt:number, currentDebt:number,
 *             currentPeriod:object|null, monthlyFee:number }}
 *   debt        — jami qarz (CRM sahifasidagi raqam)
 *   overdueDebt — muddati TUGAGAN davrlar bo'yicha (periodEnd <= bugun) —
 *                 haftalik qarzdorlik eslatmasi faqat shunga yuboriladi.
 *                 "Oxirgi davr = joriy" deb olinmaydi: kurs tugagan bo'lsa,
 *                 oxirgi davr ham tugagan (Ramazonov: avgust davri 2-sentabrda
 *                 tugagan — u ham qarzdorlikka kiradi, jami 305 000).
 *   currentDebt — hali davom etayotgan davr(lar) bo'yicha to'lanmagan qism
 */
export const computeStudentDebt = ({ student, group, bills: dbBills = [], settings = {}, today, payments, groups }) => {
  const bills = payments
    ? convertLegacyPayments({ student, bills: dbBills, payments, groups: groups || [], group, settings })
    : dbBills;
  const groupFee = parseInt(group?.monthlyFee) || parseInt(group?.price) || 0;
  const defaultFee = parseInt(settings?.defaultMonthlyFee) || 500000;
  const baseFee = groupFee > 0 ? groupFee : defaultFee;
  const discount = parseInt(student?.discount) || 0;
  const discounted = discount > 0 ? Math.round(baseFee * (100 - discount) / 100) : baseFee;

  const empty = { debt: 0, overdueDebt: 0, currentDebt: 0, currentPeriod: null, monthlyFee: baseFee };

  // startDate yo'q — CRM faqat DB yozuvlariga tayanadi
  if (!student?.startDate) {
    const debt = bills.reduce((s, b) => s + (b.remainingAmount || 0), 0);
    return { ...empty, debt };
  }

  const periods = getStudentPeriods(student, group, today);
  if (periods.length === 0) {
    const debt = bills.reduce((s, b) => s + (b.remainingAmount || 0), 0);
    return { ...empty, debt };
  }

  // Har bir davr uchun: DB yozuvi yoki virtual hisob (Payments.jsx getOrCreatePeriodBill)
  const periodBills = periods.map(period => {
    const existing = bills.find(b =>
      (b.periodStart && b.periodStart === period.periodStart) ||
      (!b.periodStart && b.month === period.month));

    const end = period.periodEnd;
    if (existing) {
      if (discount > 0 && !existing.appliedDiscount && !(existing.paidAmount > 0)) {
        return { end, remaining: discounted };
      }
      return { end, remaining: existing.remainingAmount || 0 };
    }
    if (student.isFree) return { end, remaining: 0 };
    return { end, remaining: discounted };
  });

  // Hech bir davrga kirmaydigan eski yozuvlar (legacy) — CRM ham qo'shadi
  const covered = new Set(periods.flatMap(p => [p.periodStart, p.month]));
  const extra = bills
    .filter(b => !covered.has(b.periodStart) && !covered.has(b.month) && (b.remainingAmount || 0) > 0)
    .map(b => ({
      // Tugash sanasi yo'q eski yozuv: periodEnd, bo'lmasa oy boshidan bir oy keyin
      end: b.periodEnd || addOneMonth(toDateKey(b.periodStart || b.month)),
      remaining: b.remainingAmount || 0,
    }));

  const all = [...periodBills, ...extra];
  const currentPeriod = periods[periods.length - 1];

  const debt = all.reduce((s, b) => s + b.remaining, 0);
  const overdueDebt = all
    .filter(b => b.end && b.end <= today)
    .reduce((s, b) => s + b.remaining, 0);

  return {
    debt,
    overdueDebt,
    currentDebt: debt - overdueDebt,
    currentPeriod,
    monthlyFee: baseFee,
  };
};
