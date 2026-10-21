/**
 * src/utils/billingPeriods.js — talabaning oylik to'lov davrlarini hisoblash.
 *
 * Muhim regressiya: talaba "Kompyuter Savodxonligi" kursiga 2 oyga yozilgan
 * bo'lsa, tizim 3-oy uchun ham avtomatik to'lov hisoblab yuborayotgan edi —
 * chunki courseDurationMonths degan tushuncha umuman yo'q edi. Shu testlar
 * aynan shu holatni tekshiradi.
 *
 * "Bugun" vi.setSystemTime() bilan qotirilgan — sana chegaralarida (oy oxiri,
 * kabisa yil) test natijasi kim qachon ishga tushirishiga bog'liq bo'lmasligi uchun.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addOneMonth, formatPeriodDisplay, getStudentPeriods, getEffectiveCourseDuration } from '../utils/billingPeriods';

const TODAY = '2026-06-15';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${TODAY}T12:00:00`));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('addOneMonth', () => {
  it('oddiy holatda bir oy qo\'shadi', () => {
    expect(addOneMonth('2026-01-15')).toBe('2026-02-15');
  });

  it('yil chegarasidan to\'g\'ri o\'tadi', () => {
    expect(addOneMonth('2025-12-20')).toBe('2026-01-20');
  });

  it('31-kundan qisqa oyga o\'tganda kunni to\'g\'irlaydi (31 Yan → 28/29 Fev)', () => {
    expect(addOneMonth('2025-01-31')).toBe('2025-02-28');
    expect(addOneMonth('2024-01-31')).toBe('2024-02-29'); // kabisa yil
  });
});

describe('formatPeriodDisplay', () => {
  it("davrni o'zbekcha formatda ko'rsatadi", () => {
    expect(formatPeriodDisplay('2026-01-17', '2026-02-17')).toBe('17 Yan – 17 Fev 2026');
  });
});

describe('getStudentPeriods — asosiy hisoblash', () => {
  it('startDate yo\'q bo\'lsa bo\'sh massiv', () => {
    expect(getStudentPeriods({})).toEqual([]);
    expect(getStudentPeriods(null)).toEqual([]);
  });

  it('bugun boshlagan talaba uchun bitta davr', () => {
    const student = { startDate: TODAY };
    expect(getStudentPeriods(student)).toHaveLength(1);
  });

  it('6 oy oldin boshlagan, cheklovsiz talaba uchun 6 ta davr', () => {
    const student = { startDate: '2025-12-15' }; // TODAY dan 6 oy oldin
    expect(getStudentPeriods(student)).toHaveLength(6);
  });

  it('bitirgan talaba uchun davr graduatedAt sanasida to\'xtaydi', () => {
    const student = {
      startDate: '2025-01-01',
      graduatedAt: '2025-03-15', // TODAYdan qat'iy nazar, shu yerda to'xtashi kerak
    };
    // Yan-Fev, Fev-Mar, Mar-Apr — 3 ta davr (Mar-Apr davri Mar-15 dan keyin tugaydi)
    expect(getStudentPeriods(student)).toHaveLength(3);
  });
});

describe('getStudentPeriods — kurs davomiyligi (asosiy bug fix)', () => {
  it("courseDurationMonths belgilanmagan bo'lsa, kurs muddatsiz davom etadi (eski xatti-harakat)", () => {
    const student = { startDate: '2025-12-15' }; // 6 oy oldin, cheklovsiz
    expect(getStudentPeriods(student)).toHaveLength(6);
  });

  it("courseDurationMonths=2 bo'lsa, 6 oy oldin boshlagan talabada ham FAQAT 2 ta davr bo'ladi", () => {
    // Bu — foydalanuvchi xabar qilgan aynan shu holat: "Kompyuter Savodxonligi"
    // 2 oyga mo'ljallangan, lekin ba'zida 3-oyga o'tib ketayotgan edi.
    const student = { startDate: '2025-12-15', courseDurationMonths: 2 };
    expect(getStudentPeriods(student)).toHaveLength(2);
  });

  it('courseDurationMonths=2 va talaba hali 1-oyda bo\'lsa, faqat 1 ta davr qaytadi', () => {
    const student = { startDate: TODAY, courseDurationMonths: 2 }; // bugun boshlagan
    expect(getStudentPeriods(student)).toHaveLength(1);
  });

  it('courseDurationMonths=1 bo\'lsa, 1 yil oldin boshlagan bo\'lsa ham faqat bitta davr', () => {
    const student = { startDate: '2025-06-15', courseDurationMonths: 1 };
    expect(getStudentPeriods(student)).toHaveLength(1);
  });

  it("to'xtatilgan (pauza) davrlar kurs davomiyligi sanog'iga kirmaydi", () => {
    // 4 oy oldin boshlagan (2026-02-15), 2-davr (Mar15-Apr15) pauza qilingan,
    // courseDurationMonths=2 — natijada 2 ta HAQIQIY (pauzasiz) davr qaytishi kerak:
    // 1) Fev15-Mar15 (birinchi), 2) Apr15-May15 (pauzadan keyingi birinchi haqiqiy davr)
    const student = {
      startDate: '2026-02-15',
      courseDurationMonths: 2,
      pausedPeriods: [{ from: '2026-03-15', to: '2026-04-15' }],
    };
    const periods = getStudentPeriods(student);
    expect(periods).toHaveLength(2);
    expect(periods.some(p => p.periodStart === '2026-03-15')).toBe(false);
    expect(periods[0].periodStart).toBe('2026-02-15');
    expect(periods[1].periodStart).toBe('2026-04-15');
  });

  it('courseDurationMonths=0 — muddatsiz deb hisoblanadi (himoya, bo\'sh maydon bilan bir xil)', () => {
    const student = { startDate: '2025-12-15', courseDurationMonths: 0 };
    expect(getStudentPeriods(student)).toHaveLength(6); // cheklov qo'llanmaydi
  });
});

describe('Kurs davomiyligi — guruh darajasida', () => {
  // Regressiya: "Kompyuter Savodxonligi iyul" (2 oylik) guruhida davomiylik
  // hech bir o'quvchiga qo'yilmagan edi. Kurs tugagach ham tizim har oy yangi
  // davr ochib, to'liq to'lagan 8 o'quvchini 300 000 dan qarzdor qilgan.
  const SIX_MONTHS_AGO = '2025-12-15'; // TODAY dan 6 oy oldin

  it("guruhda belgilangan bo'lsa, o'quvchida bo'lmasa ham cheklaydi", () => {
    const student = { startDate: SIX_MONTHS_AGO };
    const group = { courseDurationMonths: 2 };
    expect(getStudentPeriods(student, group)).toHaveLength(2);
  });

  it("o'quvchining o'z qiymati guruhnikidan USTUN (istisno holat)", () => {
    // Masalan kursga kech qo'shilib, faqat 1 oy o'qiydigan o'quvchi
    const student = { startDate: SIX_MONTHS_AGO, courseDurationMonths: 1 };
    const group = { courseDurationMonths: 2 };
    expect(getStudentPeriods(student, group)).toHaveLength(1);
  });

  it("guruh berilmasa — avvalgi xatti-harakat (faqat o'quvchi qiymati)", () => {
    expect(getStudentPeriods({ startDate: SIX_MONTHS_AGO })).toHaveLength(6);
    expect(getStudentPeriods({ startDate: SIX_MONTHS_AGO, courseDurationMonths: 2 })).toHaveLength(2);
  });

  it("ikkalasida ham yo'q bo'lsa — cheklanmaydi", () => {
    expect(getStudentPeriods({ startDate: SIX_MONTHS_AGO }, {})).toHaveLength(6);
    expect(getStudentPeriods({ startDate: SIX_MONTHS_AGO }, { courseDurationMonths: null })).toHaveLength(6);
  });

  it("formadan kelgan satr qiymatlar ham ishlaydi ('2')", () => {
    expect(getStudentPeriods({ startDate: SIX_MONTHS_AGO }, { courseDurationMonths: '2' })).toHaveLength(2);
  });

  it("0 yoki bo'sh qiymat 'cheklov yo'q' degani — guruhnikiga o'tadi", () => {
    const group = { courseDurationMonths: 3 };
    expect(getEffectiveCourseDuration({ courseDurationMonths: 0 }, group)).toBe(3);
    expect(getEffectiveCourseDuration({ courseDurationMonths: '' }, group)).toBe(3);
    expect(getEffectiveCourseDuration({ courseDurationMonths: null }, group)).toBe(3);
  });

  it("noto'g'ri qiymatlarda null qaytaradi, yiqilmaydi", () => {
    expect(getEffectiveCourseDuration(null, null)).toBeNull();
    expect(getEffectiveCourseDuration({}, { courseDurationMonths: 'abc' })).toBeNull();
    expect(getEffectiveCourseDuration({}, { courseDurationMonths: -2 })).toBeNull();
  });

  it("guruh cheklovi pauzalarni hisobga olgan holda ishlaydi", () => {
    const student = {
      startDate: '2026-01-15',
      pausedPeriods: [{ from: '2026-02-15', to: '2026-03-15' }],
    };
    const periods = getStudentPeriods(student, { courseDurationMonths: 2 });
    expect(periods).toHaveLength(2);
    expect(periods.some(p => p.periodStart === '2026-02-15')).toBe(false);
  });
});
