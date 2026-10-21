/**
 * src/utils/validation.js — haqiqiy modul testlari
 */
import { describe, it, expect } from 'vitest';
import {
  isValidPhone,
  isValidEmail,
  isPositiveNumber,
  validateStudentForm,
  validateTeacherForm,
  validateLeadForm,
  validatePaymentForm,
  validateGroupForm,
  hasErrors,
} from '../utils/validation';

describe('isValidPhone', () => {
  it('9 yoki 12 raqamli telefonni qabul qiladi', () => {
    expect(isValidPhone('901234567')).toBe(true);
    expect(isValidPhone('998901234567')).toBe(true);
    expect(isValidPhone('+998 90 123 45 67')).toBe(true);
  });

  it("noto'g'ri uzunlikni rad etadi", () => {
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone(null)).toBe(false);
  });
});

describe('isValidEmail', () => {
  it("to'g'ri emailni qabul qiladi", () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('student998901234567@edu.local')).toBe(true);
  });

  it("noto'g'ri emailni rad etadi", () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isPositiveNumber', () => {
  it('musbat sonlarni qabul qiladi', () => {
    expect(isPositiveNumber(1)).toBe(true);
    expect(isPositiveNumber('500000')).toBe(true);
  });

  it("0, manfiy va son bo'lmaganlarni rad etadi", () => {
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-5)).toBe(false);
    expect(isPositiveNumber('abc')).toBe(false);
  });
});

describe('validateStudentForm', () => {
  const validData = {
    fullName: 'Test O\'quvchi',
    phone: '901234567',
    groupId: 'group-1',
  };

  it("to'g'ri ma'lumotda xato yo'q", () => {
    expect(hasErrors(validateStudentForm(validData))).toBe(false);
  });

  it('ism talab qilinadi', () => {
    const errors = validateStudentForm({ ...validData, fullName: '' });
    expect(errors.fullName).toBeTruthy();
  });

  it('qisqa ism rad etiladi', () => {
    const errors = validateStudentForm({ ...validData, fullName: 'Ab' });
    expect(errors.fullName).toBeTruthy();
  });

  it('telefon talab qilinadi', () => {
    const errors = validateStudentForm({ ...validData, phone: '' });
    expect(errors.phone).toBeTruthy();
  });

  it('guruh talab qilinadi', () => {
    const errors = validateStudentForm({ ...validData, groupId: '' });
    expect(errors.groupId).toBeTruthy();
  });

  it('chegirma 0-100 oralig\'ida', () => {
    expect(validateStudentForm({ ...validData, discount: 150 }).discount).toBeTruthy();
    expect(validateStudentForm({ ...validData, discount: -5 }).discount).toBeTruthy();
    expect(validateStudentForm({ ...validData, discount: 50 }).discount).toBeFalsy();
  });

  it("to'lov kuni 1-31 oralig'ida", () => {
    expect(validateStudentForm({ ...validData, paymentDay: 32 }).paymentDay).toBeTruthy();
    expect(validateStudentForm({ ...validData, paymentDay: 0 }).paymentDay).toBeTruthy();
    expect(validateStudentForm({ ...validData, paymentDay: 15 }).paymentDay).toBeFalsy();
  });

  it("kurs davomiyligi ixtiyoriy — bo'sh bo'lsa xato yo'q", () => {
    expect(validateStudentForm({ ...validData, courseDurationMonths: '' }).courseDurationMonths).toBeFalsy();
    expect(validateStudentForm(validData).courseDurationMonths).toBeFalsy();
  });

  it("kurs davomiyligi 1-60 oy orasida bo'lishi kerak", () => {
    expect(validateStudentForm({ ...validData, courseDurationMonths: 2 }).courseDurationMonths).toBeFalsy();
    expect(validateStudentForm({ ...validData, courseDurationMonths: 0 }).courseDurationMonths).toBeTruthy();
    expect(validateStudentForm({ ...validData, courseDurationMonths: 61 }).courseDurationMonths).toBeTruthy();
    expect(validateStudentForm({ ...validData, courseDurationMonths: 1.5 }).courseDurationMonths).toBeTruthy();
  });
});

describe('validateTeacherForm', () => {
  it('fan talab qilinadi', () => {
    const errors = validateTeacherForm({ fullName: 'Test Teacher', phone: '901234567', subject: '' });
    expect(errors.subject).toBeTruthy();
  });
});

describe('validateLeadForm', () => {
  it("ism va telefon yetarli", () => {
    expect(hasErrors(validateLeadForm({ fullName: 'Ali', phone: '901234567' }))).toBe(false);
  });
});

describe('validatePaymentForm', () => {
  it('musbat summa talab qilinadi', () => {
    expect(validatePaymentForm({ amount: 0, method: 'cash' }).amount).toBeTruthy();
    expect(validatePaymentForm({ amount: -100, method: 'cash' }).amount).toBeTruthy();
    expect(validatePaymentForm({ amount: 500000, method: 'cash' }).amount).toBeFalsy();
  });

  it('juda katta summa rad etiladi', () => {
    expect(validatePaymentForm({ amount: 200_000_000, method: 'cash' }).amount).toBeTruthy();
  });

  it("to'lov usuli talab qilinadi", () => {
    expect(validatePaymentForm({ amount: 500000, method: '' }).method).toBeTruthy();
  });
});

describe('validateGroupForm', () => {
  it("nom va o'qituvchi talab qilinadi", () => {
    const errors = validateGroupForm({ name: '', teacherId: '' });
    expect(errors.name).toBeTruthy();
    expect(errors.teacherId).toBeTruthy();
  });

  it("sig'im 1-100 oralig'ida", () => {
    expect(validateGroupForm({ name: 'A', teacherId: 't1', capacity: 150 }).capacity).toBeTruthy();
    expect(validateGroupForm({ name: 'A', teacherId: 't1', capacity: 15 }).capacity).toBeFalsy();
  });
});
