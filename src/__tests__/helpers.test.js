/**
 * src/utils/helpers.js — haqiqiy modul testlari
 */
import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatMonthUz,
  MONTHS_UZ,
  formatDateISO,
  toISODateString,
  formatMoney,
  formatPhone,
  getInitials,
} from '../utils/helpers';

describe('formatDateISO', () => {
  it('YYYY-MM-DD formatida qaytaradi', () => {
    expect(formatDateISO(new Date(2025, 0, 15))).toBe('2025-01-15');
  });

  it("bo'sh qiymatda bo'sh string qaytaradi", () => {
    expect(formatDateISO(null)).toBe('');
    expect(formatDateISO(undefined)).toBe('');
  });

  it("noto'g'ri sanada bo'sh string qaytaradi", () => {
    expect(formatDateISO('not-a-date')).toBe('');
  });

  it('MAHALLIY sanani qaytaradi — kechki soatda UTC siljishi bo\'lmasligi kerak', () => {
    // 2025-01-15 23:30 mahalliy vaqt — UTC ga o'girilsa keyingi/oldingi kunga o'tib ketishi mumkin edi
    const lateEvening = new Date(2025, 0, 15, 23, 30);
    expect(formatDateISO(lateEvening)).toBe('2025-01-15');
    const earlyMorning = new Date(2025, 0, 15, 0, 30);
    expect(formatDateISO(earlyMorning)).toBe('2025-01-15');
  });

  it('Firestore Timestamp (toDate) ni qabul qiladi', () => {
    const fakeTimestamp = { toDate: () => new Date(2025, 5, 10) };
    expect(formatDateISO(fakeTimestamp)).toBe('2025-06-10');
  });
});

describe('toISODateString', () => {
  it('YYYY-MM-DD stringni o\'zgartirmasdan qaytaradi', () => {
    expect(toISODateString('2025-01-15')).toBe('2025-01-15');
  });

  it('DD.MM.YYYY formatni o\'giradi', () => {
    expect(toISODateString('15.01.2025')).toBe('2025-01-15');
  });

  it('DD/MM/YYYY formatni o\'giradi', () => {
    expect(toISODateString('15/01/2025')).toBe('2025-01-15');
  });

  it('Firestore Timestamp (seconds) ni o\'giradi', () => {
    const date = new Date(2025, 2, 20, 12, 0);
    expect(toISODateString({ seconds: date.getTime() / 1000 })).toBe('2025-03-20');
  });

  it('Date obyektini mahalliy sana bo\'yicha o\'giradi', () => {
    expect(toISODateString(new Date(2025, 0, 15, 23, 30))).toBe('2025-01-15');
  });

  it("bo'sh yoki noto'g'ri qiymatda null qaytaradi", () => {
    expect(toISODateString(null)).toBe(null);
    expect(toISODateString('')).toBe(null);
    expect(toISODateString('abc')).toBe(null);
  });
});

describe('formatDate', () => {
  it('dd.MM.yyyy formatida qaytaradi', () => {
    expect(formatDate(new Date(2025, 0, 15))).toBe('15.01.2025');
  });

  it("bo'sh qiymatda bo'sh string qaytaradi", () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('formatMoney', () => {
  it("summani so'm bilan formatlaydi", () => {
    const result = formatMoney(500000);
    expect(result).toContain('500');
    expect(result).toContain("so'm");
  });

  it('0 ni formatlaydi', () => {
    expect(formatMoney(0)).toContain('0');
  });

  it("bo'sh qiymatda bo'sh string qaytaradi", () => {
    expect(formatMoney(null)).toBe('');
    expect(formatMoney(undefined)).toBe('');
  });
});

describe('formatPhone', () => {
  it('998 bilan boshlangan 12 raqamni formatlaydi', () => {
    expect(formatPhone('998901234567')).toBe('+998 90 123 45 67');
    expect(formatPhone('+998901234567')).toBe('+998 90 123 45 67');
  });

  it("boshqa formatni o'zgartirmasdan qaytaradi", () => {
    expect(formatPhone('901234567')).toBe('901234567');
  });

  it("bo'sh qiymatda bo'sh string qaytaradi", () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone(null)).toBe('');
  });
});

describe('getInitials', () => {
  it('ikki so\'zdan bosh harflarni oladi', () => {
    expect(getInitials('Alisher Navoiy')).toBe('AN');
  });

  it('bitta so\'zdan bitta harf oladi', () => {
    expect(getInitials('Alisher')).toBe('A');
  });

  it("uzun ismda maksimum 2 harf", () => {
    expect(getInitials('Abu Ali Ibn Sino')).toBe('AA');
  });

  it("bo'sh qiymatda bo'sh string", () => {
    expect(getInitials('')).toBe('');
    expect(getInitials(null)).toBe('');
  });
});

describe("formatMonthUz — oy+yil yorlig'i", () => {
  it('"YYYY-MM" ni formatlaydi', () => {
    expect(formatMonthUz('2026-09')).toBe('Sentyabr 2026');
    expect(formatMonthUz('2026-01')).toBe('Yanvar 2026');
    expect(formatMonthUz('2026-12')).toBe('Dekabr 2026');
  });

  it('"YYYY-MM-DD" ni ham formatlaydi', () => {
    expect(formatMonthUz('2026-09-15')).toBe('Sentyabr 2026');
  });

  it('Date obyektini formatlaydi', () => {
    expect(formatMonthUz(new Date(2026, 8, 15))).toBe('Sentyabr 2026');
  });

  it('Firestore Timestamp (toDate) ni qo\'llab-quvvatlaydi', () => {
    expect(formatMonthUz({ toDate: () => new Date(2026, 8, 15) })).toBe('Sentyabr 2026');
  });

  it("HECH QACHON 'M09' kabi ICU zaxira ko'rinishini qaytarmaydi (regressiya)", () => {
    // Asl xato: toLocaleDateString('uz-UZ', {month:'long'}) ba'zi brauzerlarda
    // "2026 M09" qaytarardi va ota-onaga Telegram orqali shu ketgan edi.
    for (const v of ['2026-09', '2026-01-01', new Date(), null, undefined, 'axlat', 0, {}]) {
      const out = formatMonthUz(v);
      expect(out).not.toMatch(/M\d/);
      expect(out).toMatch(/^[A-Za-z]+ \d{4}$/);
    }
  });

  it("noto'g'ri kirishda joriy oyni qaytaradi, bo'sh emas", () => {
    const now = new Date();
    const expected = `${MONTHS_UZ[now.getMonth()]} ${now.getFullYear()}`;
    expect(formatMonthUz(null)).toBe(expected);
    expect(formatMonthUz('axlat')).toBe(expected);
  });

  it('12 ta oy nomi bor va imlosi bir xil', () => {
    expect(MONTHS_UZ).toHaveLength(12);
    expect(MONTHS_UZ[8]).toBe('Sentyabr');
    expect(MONTHS_UZ[9]).toBe('Oktyabr');
  });
});
