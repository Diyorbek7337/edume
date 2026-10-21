/**
 * utils/studentDebt.js — To'lovlar sahifasi, CRM eslatmalari va Telegram bot
 * qarzni BIR XIL hisoblashi uchun.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getStudentPeriods as periodsCRM } from '../utils/billingPeriods';
import { getStudentPeriods as periodsShared, computeStudentDebt, toZonedYMD } from '../utils/studentDebt';
import { getPendingReminders } from '../services/autoReminder';

const TODAY = '2026-09-21';
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(`${TODAY}T12:00:00+05:00`)); });
afterEach(() => { vi.useRealTimers(); });

describe('Ikki davr hisoblagichi bir xil natija beradi', () => {
  // billingPeriods.js (To'lovlar sahifasi) va studentDebt.js (eslatmalar, bot)
  // alohida fayllar — ular farqlanib ketsa, sahifa va bot turli qarz ko'rsatadi.
  const cases = [
    [{ startDate: '2026-07-02' }, null],
    [{ startDate: '2026-07-02' }, { courseDurationMonths: 2 }],
    [{ startDate: '2026-07-02', courseDurationMonths: 1 }, { courseDurationMonths: 2 }],
    [{ startDate: '2026-01-31' }, null],
    [{ startDate: '2026-07-13', pausedPeriods: [{ from: '2026-07-20', to: null }] }, null],
    [{ startDate: '2026-01-15', pausedPeriods: [{ from: '2026-03-15', to: '2026-05-15' }] }, { courseDurationMonths: 3 }],
    [{ startDate: '2026-06-09', graduatedAt: '2026-08-20T10:00:00Z' }, null],
    [{ startDate: TODAY }, null],
    [{}, null],
  ];
  it.each(cases)('%j / guruh %j', (student, group) => {
    const a = periodsCRM(student, group).map(p => p.periodStart);
    const b = periodsShared(student, group, toZonedYMD(new Date())).map(p => p.periodStart);
    expect(b).toEqual(a);
  });
});

describe("Eslatmalar — umuman to'lanmagan oy ham ko'rinadi", () => {
  const student = { id: 's1', status: 'active', startDate: '2026-07-02', paymentDay: 1 };
  const group = { id: 'g1', price: 300000, courseDurationMonths: 2 };

  it("guruhlar berilsa, yozuvi yo'q oy qarzga kiradi (Ramazonov holati: 305 000)", () => {
    const bills = [{ studentId: 's1', periodStart: '2026-07-02', month: '2026-07', remainingAmount: 5000, status: 'partial' }];
    const [r] = getPendingReminders([{ ...student, groupId: 'g1' }], bills, {}, [group]);
    expect(r.debt).toBe(305000);
  });

  it("guruhlar berilsa, hech qanday yozuvi yo'q o'quvchi ham eslatma oladi", () => {
    // Ilgari: yozuv yo'q → eslatma yo'q. Aynan eng kerakli holatda jim turardi.
    const res = getPendingReminders([{ ...student, groupId: 'g1' }], [], {}, [group]);
    expect(res).toHaveLength(1);
    expect(res[0].debt).toBe(600000);
  });

  it("to'liq to'lagan o'quvchiga eslatma ketmaydi", () => {
    const bills = ['2026-07-02', '2026-08-02'].map(p => ({ studentId: 's1', periodStart: p, remainingAmount: 0, status: 'paid' }));
    expect(getPendingReminders([{ ...student, groupId: 'g1' }], bills, {}, [group])).toHaveLength(0);
  });

  it('guruhlar berilmasa — avvalgi xatti-harakat (faqat DB yozuvlari)', () => {
    expect(getPendingReminders([{ ...student, groupId: 'g1' }], [], {})).toHaveLength(0);
  });
});

describe('Bot bilan nusxa', () => {
  it("edu-center-bot/functions/studentDebt.js bilan AYNAN bir xil", () => {
    // Bot alohida repozitoriy va alohida deploy — import qila olmaydi, shuning
    // uchun fayl nusxalanadi. Yonma-yon turgan bo'lsa, farqlanmasligi shart.
    const here = fileURLToPath(new URL('../utils/studentDebt.js', import.meta.url));
    const bot = fileURLToPath(new URL('../../../edu-center-bot/functions/studentDebt.js', import.meta.url));
    if (!existsSync(bot)) return; // boshqa kompyuterda bot repozitoriysi bo'lmasligi mumkin
    expect(readFileSync(here, 'utf8')).toBe(readFileSync(bot, 'utf8'));
  });
});

describe('computeStudentDebt', () => {
  it('yozuvi yo\'q davr guruh narxi bilan hisoblanadi', () => {
    const r = computeStudentDebt({ student: { id: 'x', startDate: TODAY }, group: { price: 450000 }, today: TODAY });
    expect(r.debt).toBe(450000);
  });
});
