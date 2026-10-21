// Talabaning oylik ("12-dars") to'lov davrlarini hisoblaydigan sof funksiyalar.
// Payments.jsx dan chiqarilgan — pastdagi eng muhim qoida (kurs davomiyligi)
// to'g'ri ishlashini avtomatik test bilan tasdiqlash uchun.
import { formatDateISO } from './helpers';

export const MONTH_NAMES = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

// Berilgan sanaga bir kalendar oyi qo'shadi (31 Yan → 28/29 Fev kabi edge case'larni ham to'g'ri bajaradi)
export const addOneMonth = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  let newYear = y;
  let newMonth = m + 1;
  if (newMonth > 12) { newMonth = 1; newYear++; }
  const maxDay = new Date(newYear, newMonth, 0).getDate(); // o'sha oyning oxirgi kuni
  const newDay = Math.min(d, maxDay);
  return `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
};

// "17 May – 17 Iyn 2026" formatida davr ko'rinishi
export const formatPeriodDisplay = (periodStart, periodEnd) => {
  const [sy, sm, sd] = periodStart.split('-').map(Number);
  const [ey, em, ed] = periodEnd.split('-').map(Number);
  const start = `${sd} ${MONTH_NAMES[sm - 1]}`;
  const end = `${ed} ${MONTH_NAMES[em - 1]} ${ey}`;
  return `${start} – ${end}`;
};

/**
 * O'quvchi uchun amaldagi kurs davomiyligi (oy) yoki null (cheklanmagan).
 *
 * Ustuvorlik:
 *   1) O'quvchining o'z qiymati — istisno holatlar uchun (masalan kursga
 *      kech qo'shilib, kamroq oy o'qiydigan o'quvchi).
 *   2) Guruhning qiymati — odatiy holat. Bir marta guruhga yoziladi va
 *      undagi hamma o'quvchiga tegishli bo'ladi.
 *
 * NEGA GURUH DARAJASI: ilgari davomiylik faqat har bir o'quvchiga qo'lda
 * qo'yilardi. Qo'yish unutilgan guruhda ("Kompyuter Savodxonligi iyul",
 * 2 oylik kurs) kurs tugagandan keyin ham tizim har oy yangi davr ochib,
 * to'liq to'lagan 8 o'quvchini 300 000 dan qarzdor qilib ko'rsatgan —
 * jami 2 700 000 so'm soxta qarz.
 */
export const getEffectiveCourseDuration = (student, group = null) => {
  const own = parseInt(student?.courseDurationMonths, 10);
  if (own > 0) return own;
  const fromGroup = parseInt(group?.courseDurationMonths, 10);
  return fromGroup > 0 ? fromGroup : null;
};

/**
 * O'quvchining barcha oylik to'lov davrlarini qaytaradi (startDate dan joriy
 * davrgacha). Har bir davr: startDate → xuddi shu sana keyingi oyda.
 *
 * Uch narsa davrlar sonini cheklaydi:
 *   1) Bitirgan o'quvchi (graduatedAt) — davr shu sanada to'xtaydi.
 *   2) To'xtatilgan davrlar (pausedPeriods) — ta'til/arxiv oralig'idagi
 *      davrlar ro'yxatdan olib tashlanadi (lekin sanashda hisobga kirmaydi).
 *   3) Kurs davomiyligi (getEffectiveCourseDuration: o'quvchining o'zi yoki
 *      guruhi) — belgilangan bo'lsa, FAQAT shuncha (pauzasiz) davr
 *      qaytariladi, undan ko'pi HECH QACHON yaratilmaydi. Masalan
 *      "Kompyuter Savodxonligi" — 2 oy — belgilansa, 3-oy uchun avtomatik
 *      to'lov hisoblanmaydi.
 *
 * @param group  o'quvchining guruhi (ixtiyoriy). Berilmasa, faqat
 *               o'quvchining o'z courseDurationMonths qiymati ishlatiladi.
 */
export const getStudentPeriods = (student, group = null) => {
  if (!student?.startDate) return [];

  const todayStr = student.graduatedAt
    ? formatDateISO(student.graduatedAt)
    : formatDateISO(new Date());

  const periods = [];
  let currentStart = student.startDate;

  for (let i = 0; i < 60; i++) { // Max 60 davr (5 yil) — cheksiz sikl bo'lmasligi uchun xavfsizlik chegarasi
    const periodEnd = addOneMonth(currentStart);
    periods.push({
      periodStart: currentStart,
      periodEnd,
      month: currentStart.substring(0, 7), // Eski bill bilan moslik uchun
      periodDisplay: formatPeriodDisplay(currentStart, periodEnd),
    });
    if (periodEnd >= todayStr) break; // Joriy davrga yetdik
    currentStart = periodEnd; // Keyingi davr shu davr tugagan sanadan boshlanadi
  }

  // To'xtatilgan davrlarni (arxiv, ta'til) o'tkazib yuborish
  const pausedPeriods = (student.pausedPeriods || []).filter(p => p.from);
  const activePeriods = pausedPeriods.length === 0
    ? periods
    : periods.filter(period =>
        !pausedPeriods.some(paused =>
          period.periodStart >= paused.from && (!paused.to || period.periodStart < paused.to)
        )
      );

  // Kurs davomiyligi belgilangan bo'lsa, shu sondan ko'p (pauzasiz) davr qaytarilmaydi
  const duration = getEffectiveCourseDuration(student, group);
  if (duration) {
    return activePeriods.slice(0, duration);
  }
  return activePeriods;
};
