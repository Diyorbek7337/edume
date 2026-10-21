/**
 * functions/revenueStats.js — sof funksiyalar, emulatorsiz testlanadi.
 * centers/{centerId}.revenueStats denormalized hisoblagichini yuritadigan
 * delta-hisoblash mantig'ini tekshiradi (Cloud Function trigger shu logikaga tayanadi).
 */
import { describe, it, expect } from 'vitest';
import { paymentContribution, computeRevenueDeltas, sanitizeKey } from '../../functions/revenueStats.js';

describe('sanitizeKey', () => {
  it("oddiy so'zni o'zgartirmaydi", () => {
    expect(sanitizeKey('Naqd')).toBe('Naqd');
  });

  it("Firestore field path'da man etilgan belgilarni almashtiradi", () => {
    expect(sanitizeKey('Click/Payme.uz')).toBe('Click_Payme_uz');
  });

  it("bo'sh qiymatda 'unknown' qaytaradi", () => {
    expect(sanitizeKey('')).toBe('unknown');
    expect(sanitizeKey(null)).toBe('unknown');
    expect(sanitizeKey(undefined)).toBe('unknown');
  });
});

describe('paymentContribution', () => {
  it("'paid' bo'lmagan to'lovda hissa yo'q", () => {
    const result = paymentContribution({ status: 'pending', amount: 500000, paidAt: '2026-01-15' });
    expect(result).toEqual({ amount: 0, month: null, method: null });
  });

  it("'paid' to'lovdan to'g'ri hissa chiqaradi", () => {
    const result = paymentContribution({
      status: 'paid', amount: 500000, method: 'Naqd', paidAt: '2026-01-15T10:00:00.000Z',
    });
    expect(result).toEqual({ amount: 500000, month: '2026-01', method: 'Naqd' });
  });

  it("paidAt yo'q bo'lsa createdAt'ga tushadi", () => {
    const result = paymentContribution({
      status: 'paid', amount: 300000, method: 'Karta', createdAt: '2026-03-05T08:00:00.000Z',
    });
    expect(result).toEqual({ amount: 300000, month: '2026-03', method: 'Karta' });
  });

  it('Firestore Timestamp (toDate) ni qabul qiladi', () => {
    const result = paymentContribution({
      status: 'paid', amount: 100000, method: 'Naqd',
      paidAt: { toDate: () => new Date(2026, 5, 10) },
    });
    expect(result.month).toBe('2026-06');
  });

  it("sana bo'lmasa yoki yaroqsiz bo'lsa hissa yo'q", () => {
    expect(paymentContribution({ status: 'paid', amount: 100000 })).toEqual({ amount: 0, month: null, method: null });
    expect(paymentContribution({ status: 'paid', amount: 100000, paidAt: 'not-a-date' }))
      .toEqual({ amount: 0, month: null, method: null });
  });

  it("method ko'rsatilmasa 'Naqd' deb hisoblanadi", () => {
    const result = paymentContribution({ status: 'paid', amount: 100000, paidAt: '2026-01-01' });
    expect(result.method).toBe('Naqd');
  });

  it('null/undefined hujjatda hissa yo\'q', () => {
    expect(paymentContribution(null)).toEqual({ amount: 0, month: null, method: null });
    expect(paymentContribution(undefined)).toEqual({ amount: 0, month: null, method: null });
  });
});

describe('computeRevenueDeltas', () => {
  it('CREATE: yangi to\'langan to\'lov — barcha bucketlarga qo\'shiladi', () => {
    const after = { status: 'paid', amount: 500000, method: 'Naqd', paidAt: '2026-01-15' };
    const deltas = computeRevenueDeltas(null, after);
    expect(deltas).toEqual({
      'revenueStats.total': 500000,
      'revenueStats.byMonth.2026-01': 500000,
      'revenueStats.byMethod.Naqd': 500000,
    });
  });

  it('CREATE: yangi PENDING to\'lov — hech qanday delta yo\'q', () => {
    const after = { status: 'pending', amount: 500000, paidAt: '2026-01-15' };
    expect(computeRevenueDeltas(null, after)).toEqual({});
  });

  it('DELETE: to\'langan to\'lov o\'chirilsa — barcha bucketlardan ayiriladi', () => {
    const before = { status: 'paid', amount: 500000, method: 'Karta', paidAt: '2026-02-10' };
    const deltas = computeRevenueDeltas(before, null);
    expect(deltas).toEqual({
      'revenueStats.total': -500000,
      'revenueStats.byMonth.2026-02': -500000,
      'revenueStats.byMethod.Karta': -500000,
    });
  });

  it('UPDATE: pending → paid (masalan to\'lov tasdiqlangan) — yaratilgandek qo\'shiladi', () => {
    const before = { status: 'pending', amount: 400000, method: 'Naqd', paidAt: '2026-01-20' };
    const after = { status: 'paid', amount: 400000, method: 'Naqd', paidAt: '2026-01-20' };
    const deltas = computeRevenueDeltas(before, after);
    expect(deltas).toEqual({
      'revenueStats.total': 400000,
      'revenueStats.byMonth.2026-01': 400000,
      'revenueStats.byMethod.Naqd': 400000,
    });
  });

  it('UPDATE: paid → pending (bekor qilingan) — o\'chirilgandek ayiriladi', () => {
    const before = { status: 'paid', amount: 400000, method: 'Naqd', paidAt: '2026-01-20' };
    const after = { status: 'pending', amount: 400000, method: 'Naqd', paidAt: '2026-01-20' };
    const deltas = computeRevenueDeltas(before, after);
    expect(deltas).toEqual({
      'revenueStats.total': -400000,
      'revenueStats.byMonth.2026-01': -400000,
      'revenueStats.byMethod.Naqd': -400000,
    });
  });

  it('UPDATE: summasi o\'zgardi (oy/usul bir xil) — faqat FARQ qo\'llanadi', () => {
    const before = { status: 'paid', amount: 400000, method: 'Naqd', paidAt: '2026-01-20' };
    const after = { status: 'paid', amount: 550000, method: 'Naqd', paidAt: '2026-01-20' };
    const deltas = computeRevenueDeltas(before, after);
    expect(deltas).toEqual({
      'revenueStats.total': 150000,
      'revenueStats.byMonth.2026-01': 150000,
      'revenueStats.byMethod.Naqd': 150000,
    });
  });

  it('UPDATE: to\'lov usuli o\'zgardi — eski bucket kamayadi, yangisi ortadi, JAMI o\'zgarmaydi', () => {
    const before = { status: 'paid', amount: 300000, method: 'Naqd', paidAt: '2026-01-20' };
    const after = { status: 'paid', amount: 300000, method: 'Karta', paidAt: '2026-01-20' };
    const deltas = computeRevenueDeltas(before, after);
    // total delta 0 bo'lgani uchun natijada UMUMAN chiqmasligi kerak
    expect(deltas).not.toHaveProperty('revenueStats.total');
    expect(deltas['revenueStats.byMethod.Naqd']).toBe(-300000);
    expect(deltas['revenueStats.byMethod.Karta']).toBe(300000);
  });

  it('UPDATE: oy o\'zgardi (masalan sana tuzatildi) — eski oy kamayadi, yangi oy ortadi', () => {
    const before = { status: 'paid', amount: 200000, method: 'Naqd', paidAt: '2026-01-31' };
    const after = { status: 'paid', amount: 200000, method: 'Naqd', paidAt: '2026-02-01' };
    const deltas = computeRevenueDeltas(before, after);
    expect(deltas['revenueStats.byMonth.2026-01']).toBe(-200000);
    expect(deltas['revenueStats.byMonth.2026-02']).toBe(200000);
    expect(deltas).not.toHaveProperty('revenueStats.total');
  });

  it("hech narsa o'zgarmasa (aynan bir xil before/after) — bo'sh natija", () => {
    const payment = { status: 'paid', amount: 200000, method: 'Naqd', paidAt: '2026-01-15' };
    expect(computeRevenueDeltas(payment, { ...payment })).toEqual({});
  });

  it('ikkalasi ham null bo\'lsa (nazariy holat) — bo\'sh natija', () => {
    expect(computeRevenueDeltas(null, null)).toEqual({});
  });

  it("ikkalasi ham 'paid' bo'lmasa — hech qanday delta yo'q", () => {
    const before = { status: 'pending', amount: 100000, paidAt: '2026-01-01' };
    const after = { status: 'cancelled', amount: 100000, paidAt: '2026-01-01' };
    expect(computeRevenueDeltas(before, after)).toEqual({});
  });
});
