/**
 * src/services/autoReminder.js — haqiqiy modul testlari.
 * api.js (Firebase) mock qilinadi — sof funksiyalargina tekshiriladi.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../services/api', () => ({
  messagesAPI: { create: vi.fn() },
  studentsAPI: { update: vi.fn() },
}));

import { shouldRemind, calcDebt, getPendingReminders } from '../services/autoReminder';

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const activeStudent = (overrides = {}) => ({
  id: 'student-1',
  status: 'active',
  isFree: false,
  paymentDay: 1,
  ...overrides,
});

const unpaidBill = (overrides = {}) => ({
  studentId: 'student-1',
  month: currentMonth(),
  status: 'pending',
  remainingAmount: 500000,
  ...overrides,
});

describe('shouldRemind', () => {
  it('qarzdor faol o\'quvchiga eslatma kerak', () => {
    expect(shouldRemind(activeStudent(), [unpaidBill()], {})).toBe(true);
  });

  it('bepul o\'quvchiga eslatma kerak emas', () => {
    expect(shouldRemind(activeStudent({ isFree: true }), [unpaidBill()], {})).toBe(false);
  });

  it('nofaol o\'quvchiga eslatma kerak emas', () => {
    expect(shouldRemind(activeStudent({ status: 'inactive' }), [unpaidBill()], {})).toBe(false);
  });

  it('bugun eslatilgan bo\'lsa qayta yubormaydi', () => {
    const student = activeStudent({ lastReminderSent: new Date().toISOString() });
    expect(shouldRemind(student, [unpaidBill()], {})).toBe(false);
  });

  it('kecha eslatilgan bo\'lsa bugun yana yuboradi', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const student = activeStudent({ lastReminderSent: yesterday.toISOString() });
    expect(shouldRemind(student, [unpaidBill()], {})).toBe(true);
  });

  it("qarz yo'q bo'lsa eslatma kerak emas", () => {
    expect(shouldRemind(activeStudent(), [], {})).toBe(false);
    expect(shouldRemind(activeStudent(), [unpaidBill({ status: 'paid', remainingAmount: 0 })], {})).toBe(false);
  });

  it("kelajakdagi oy hisobi qarz emas", () => {
    const d = new Date();
    const nextMonth = `${d.getFullYear() + 1}-01`;
    expect(shouldRemind(activeStudent(), [unpaidBill({ month: nextMonth })], {})).toBe(false);
  });
});

describe('calcDebt', () => {
  it('barcha qarzlarni yig\'adi', () => {
    const bills = [
      unpaidBill({ remainingAmount: 300000 }),
      unpaidBill({ month: '2024-01', remainingAmount: 200000 }),
    ];
    expect(calcDebt('student-1', bills)).toBe(500000);
  });

  it("boshqa o'quvchining hisobini qo'shmaydi", () => {
    const bills = [unpaidBill({ studentId: 'other', remainingAmount: 999999 })];
    expect(calcDebt('student-1', bills)).toBe(0);
  });
});

describe('getPendingReminders', () => {
  it('eng katta qarzdorni birinchi qo\'yadi', () => {
    const students = [
      activeStudent({ id: 's1' }),
      activeStudent({ id: 's2' }),
    ];
    const bills = [
      unpaidBill({ studentId: 's1', remainingAmount: 100000 }),
      unpaidBill({ studentId: 's2', remainingAmount: 900000 }),
    ];
    const result = getPendingReminders(students, bills, {});
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('s2');
    expect(result[0].debt).toBe(900000);
  });

  it("eslatma kerak bo'lmaganlarni chiqarib tashlaydi", () => {
    const students = [activeStudent({ id: 's1', isFree: true })];
    const bills = [unpaidBill({ studentId: 's1' })];
    expect(getPendingReminders(students, bills, {})).toHaveLength(0);
  });
});
