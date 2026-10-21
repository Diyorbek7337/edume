/**
 * copyToClipboard — HAQIQATAN nusxalanganini qaytarishi shart.
 *
 * Regressiya: ilgari kod bo'ylab navigator.clipboard.writeText() await/catch'siz
 * chaqirilardi va darhol "nusxalandi" deb ko'rsatilardi. Nusxalash muvaffaqiyatsiz
 * bo'lganda ham foydalanuvchi YOLG'ON muvaffaqiyat ko'rar, keyin qo'yganda bo'sh
 * chiqardi. Shu testlar bunday holat qaytmasligini kafolatlaydi.
 *
 * Test muhiti 'node' (jsdom yo'q) — shuning uchun kerakli DOM qismlari shu yerda
 * qo'lda soxtalashtiriladi. Yordamchi faqat shu to'rttasiga tayanadi:
 * navigator.clipboard.writeText, document.createElement, body.append/remove,
 * document.execCommand.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from '../utils/helpers';

let appended;

const makeDocument = (execResult) => ({
  createElement: () => ({
    value: '', style: {}, setAttribute: () => {}, select: () => {},
  }),
  body: {
    appendChild: (el) => { appended.push(el); },
    removeChild: (el) => { appended = appended.filter(x => x !== el); },
  },
  execCommand: typeof execResult === 'function' ? execResult : vi.fn(() => execResult),
});

// Node 18+ da globalThis.navigator faqat o'qish uchun aksessor — oddiy
// o'zlashtirish otiladi, shuning uchun defineProperty ishlatiladi.
const setNavigator = (value) => {
  Object.defineProperty(globalThis, 'navigator', {
    value, configurable: true, writable: true,
  });
};

beforeEach(() => {
  appended = [];
  setNavigator({});
  globalThis.document = makeDocument(false);
});

afterEach(() => {
  setNavigator(undefined);
  delete globalThis.document;
  vi.restoreAllMocks();
});

describe('copyToClipboard', () => {
  it('muvaffaqiyatli nusxalanganda true qaytaradi', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigator({ clipboard: { writeText } });
    await expect(copyToClipboard('salom')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('salom');
  });

  it("clipboard API rad etsa YOLG'ON muvaffaqiyat qaytarmaydi", async () => {
    setNavigator({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    await expect(copyToClipboard('salom')).resolves.toBe(false);
  });

  it("clipboard API rad etsa zaxira yo'lga o'tadi", async () => {
    setNavigator({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    globalThis.document = makeDocument(true);
    await expect(copyToClipboard('salom')).resolves.toBe(true);
    expect(globalThis.document.execCommand).toHaveBeenCalledWith('copy');
  });

  it("clipboard API umuman yo'q bo'lsa (HTTP orqali kirish) zaxira ishlaydi", async () => {
    // Eng ko'p uchraydigan holat: ilovaga localhost o'rniga IP manzil orqali
    // kirish — xavfsiz kontekst emas, navigator.clipboard mavjud bo'lmaydi
    globalThis.document = makeDocument(true);
    await expect(copyToClipboard('salom')).resolves.toBe(true);
  });

  it("ikkala yo'l ham ishlamasa false qaytaradi", async () => {
    await expect(copyToClipboard('salom')).resolves.toBe(false);
  });

  it('execCommand otilsa ham false qaytaradi (yiqilmaydi)', async () => {
    globalThis.document = makeDocument(() => { throw new Error('boom'); });
    await expect(copyToClipboard('salom')).resolves.toBe(false);
  });

  it("bo'sh matn uchun false qaytaradi va clipboard'ga tegmaydi", async () => {
    const writeText = vi.fn();
    setNavigator({ clipboard: { writeText } });
    await expect(copyToClipboard('')).resolves.toBe(false);
    await expect(copyToClipboard(null)).resolves.toBe(false);
    await expect(copyToClipboard(undefined)).resolves.toBe(false);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("zaxira yo'l vaqtinchalik elementni tozalab ketadi", async () => {
    globalThis.document = makeDocument(true);
    await copyToClipboard('salom');
    expect(appended.length).toBe(0);
  });
});
