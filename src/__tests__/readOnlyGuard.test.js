/**
 * Faqat-o'qish rejimi — api.js yozishdan oldin chaqiradigan tekshiruv
 * (services/firebase.js → assertCenterWritable).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { setCenterWritable, assertCenterWritable, READ_ONLY_MESSAGE } from '../services/firebase';

describe('assertCenterWritable', () => {
  afterEach(() => setCenterWritable(true));

  it('odatiy holatda hech narsani bloklamaydi', () => {
    expect(() => assertCenterWritable({ path: 'centers/c1/students' })).not.toThrow();
  });

  it("faqat-o'qish rejimida markaz kolleksiyasiga yozishni tushunarli xato bilan to'xtatadi", () => {
    setCenterWritable(false);
    expect(() => assertCenterWritable({ path: 'centers/c1/students/s1' })).toThrow(READ_ONLY_MESSAGE);
    expect(() => assertCenterWritable('centers/c1/payments')).toThrow(READ_ONLY_MESSAGE);
  });

  it("global kolleksiyalar (users, subscription_requests) bloklanmaydi — tarif arizasi yuborish mumkin", () => {
    setCenterWritable(false);
    expect(() => assertCenterWritable({ path: 'users/u1' })).not.toThrow();
    expect(() => assertCenterWritable({ path: 'subscription_requests' })).not.toThrow();
  });

  it("o'qilganlik belgilari (chat_read_status, messages) bloklanmaydi", () => {
    setCenterWritable(false);
    expect(() => assertCenterWritable({ path: 'centers/c1/chat_read_status/u1' })).not.toThrow();
    expect(() => assertCenterWritable({ path: 'centers/c1/messages/m1' })).not.toThrow();
  });
});
