/**
 * src/services/telegram.js — haqiqiy modul testlari (sof funksiyalar)
 */
import { describe, it, expect } from 'vitest';
import {
  parseRegistrations,
  buildDeepLink,
  buildPaymentReminderText,
} from '../services/telegram';

describe('parseRegistrations', () => {
  const makeUpdate = (text, chatId = 100, firstName = 'Ota', username = 'otauser') => ({
    message: {
      text,
      chat: { id: chatId, first_name: firstName, username },
    },
  });

  it('/start telefon xabarlarini ajratib oladi', () => {
    const result = parseRegistrations([makeUpdate('/start 998901234567')]);
    expect(result).toHaveLength(1);
    expect(result[0].phone).toBe('998901234567');
    expect(result[0].chatId).toBe(100);
    expect(result[0].name).toBe('Ota');
  });

  it('dublikatlarni tashlab yuboradi', () => {
    const updates = [
      makeUpdate('/start 998901234567'),
      makeUpdate('/start 998901234567'),
    ];
    expect(parseRegistrations(updates)).toHaveLength(1);
  });

  it("telefonsiz /start va oddiy xabarlarni e'tiborsiz qoldiradi", () => {
    const updates = [
      makeUpdate('/start'),
      makeUpdate('salom'),
      { message: null },
      {},
    ];
    expect(parseRegistrations(updates)).toHaveLength(0);
  });

  it("noto'g'ri uzunlikdagi raqamni rad etadi", () => {
    expect(parseRegistrations([makeUpdate('/start 12345')])).toHaveLength(0);
  });
});

describe('buildDeepLink', () => {
  it('bot username va telefondan link yasaydi', () => {
    expect(buildDeepLink('my_edu_bot', '998901234567')).toBe('https://t.me/my_edu_bot?start=998901234567');
  });

  it('telefondan raqam bo\'lmagan belgilarni olib tashlaydi', () => {
    expect(buildDeepLink('my_edu_bot', '+998 90 123-45-67')).toBe('https://t.me/my_edu_bot?start=998901234567');
  });
});

describe('buildPaymentReminderText', () => {
  it("kerakli ma'lumotlarni o'z ichiga oladi", () => {
    const text = buildPaymentReminderText({
      studentName: 'Ali Valiyev',
      debt: 500000,
      centerName: 'Test Markaz',
      month: 'Yanvar 2025',
    });
    expect(text).toContain('Ali Valiyev');
    expect(text).toContain('Test Markaz');
    expect(text).toContain('Yanvar 2025');
    expect(text).toContain('500');
  });

  it('HTML belgilarini escape qiladi (XSS himoyasi)', () => {
    const text = buildPaymentReminderText({
      studentName: '<script>alert(1)</script>',
      debt: 100,
      centerName: 'A & B',
    });
    expect(text).not.toContain('<script>');
    expect(text).toContain('&lt;script&gt;');
    expect(text).toContain('A &amp; B');
  });

  it("markaz nomi bo'lmasa default ishlatiladi", () => {
    const text = buildPaymentReminderText({ studentName: 'Ali', debt: 100 });
    expect(text).toContain("O'quv markaz");
  });

  it("oy berilmasa ICU zaxira ko'rinishini ('2026 M09') YOZMAYDI (regressiya)", () => {
    // Asl xato: month uzatilmaganda kod
    //   new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })
    // ishlatardi. uz-UZ lokali ba'zi brauzerlarda to'liq emas va natijada
    // ota-onaga Telegram orqali "Oy: 2026 M09" deb ketgan edi.
    const text = buildPaymentReminderText({ studentName: 'Ali', debt: 100 });
    const oyQatori = text.split('\n').find(l => l.startsWith('Oy:'));

    expect(oyQatori).toBeDefined();
    expect(oyQatori).not.toMatch(/M\d/);
    // O'zbekcha oy nomi + yil bo'lishi kerak, masalan "Sentyabr 2026"
    expect(oyQatori).toMatch(/^Oy: <b>[A-Z][a-z]+ \d{4}<\/b>$/);
  });
});
