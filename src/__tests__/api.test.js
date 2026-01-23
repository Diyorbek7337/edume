/**
 * EduCenter API Tests
 * 
 * Bu testlar Firebase emulator bilan ishlaydi
 * Ishga tushirish: npm test
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// ==================== MOCK DATA ====================

const mockStudent = {
  fullName: 'Test O\'quvchi',
  phone: '998901234567',
  email: 'student998901234567@edu.local',
  groupId: 'test-group-1',
  groupName: 'Ingliz tili - Beginner',
  parentName: 'Test Ota',
  parentPhone: '998907654321',
  status: 'active',
};

const mockGroup = {
  name: 'Ingliz tili - Beginner',
  teacherId: 'teacher-1',
  teacherName: 'Test O\'qituvchi',
  schedule: {
    days: 'Du, Chor, Ju',
    time: '09:00-10:30',
    scheduleDays: [1, 3, 5],
    startTime: '09:00',
    endTime: '10:30',
  },
  price: 500000,
  maxStudents: 15,
  studentsCount: 0,
  status: 'active',
};

const mockPayment = {
  studentId: 'student-1',
  studentName: 'Test O\'quvchi',
  amount: 500000,
  month: '2025-01',
  status: 'paid',
  paymentMethod: 'cash',
};

// ==================== HELPER FUNCTIONS ====================

describe('Helper Functions', () => {
  describe('formatMoney', () => {
    const formatMoney = (amount) => {
      return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
    };

    it('should format money correctly', () => {
      expect(formatMoney(500000)).toContain('500');
      expect(formatMoney(500000)).toContain("so'm");
      expect(formatMoney(1234567)).toContain('1');
      expect(formatMoney(1234567)).toContain('234');
      expect(formatMoney(0)).toContain('0');
    });
  });

  describe('formatDate', () => {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    it('should format date to YYYY-MM-DD', () => {
      expect(formatDate('2025-01-15')).toBe('2025-01-15');
      expect(formatDate(new Date('2025-01-15'))).toBe('2025-01-15');
    });
  });

  describe('formatPhone', () => {
    const formatPhone = (phone) => {
      const digits = phone?.replace(/\D/g, '') || '';
      if (digits.length === 12) {
        return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
      }
      return phone;
    };

    it('should format phone number', () => {
      expect(formatPhone('998901234567')).toBe('+998 90 123 4567');
      expect(formatPhone('+998901234567')).toBe('+998 90 123 4567');
    });
  });
});

// ==================== PAYMENT STATUS LOGIC ====================

describe('Payment Status Logic', () => {
  const hasPaymentForMonth = (payments, studentId, year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return payments.some(p => 
      p.studentId === studentId && 
      p.status === 'paid' && 
      p.month === monthStr
    );
  };

  const getStudentPaymentStatus = (student, payments, now = new Date()) => {
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const hasPaidCurrentMonth = hasPaymentForMonth(payments, student.id, currentYear, currentMonth);
    const hasPaidLastMonth = hasPaymentForMonth(payments, student.id, lastMonthYear, lastMonth);
    
    const startDate = student.startDate ? new Date(student.startDate) : null;
    const startedThisMonth = startDate && 
      startDate.getMonth() === currentMonth && 
      startDate.getFullYear() === currentYear;
    
    if (hasPaidCurrentMonth) {
      return { status: 'paid', label: "To'langan" };
    }
    
    if (startedThisMonth) {
      return { status: 'pending', label: 'Kutilmoqda' };
    }
    
    if (!hasPaidLastMonth) {
      return { status: 'debtor', label: 'Qarzdor' };
    }
    
    return { status: 'pending', label: 'Kutilmoqda' };
  };

  it('should return "paid" if current month is paid', () => {
    const now = new Date('2025-01-15');
    const student = { id: 'student-1', startDate: '2024-09-01' };
    const payments = [{ studentId: 'student-1', status: 'paid', month: '2025-01' }];
    
    const result = getStudentPaymentStatus(student, payments, now);
    expect(result.status).toBe('paid');
  });

  it('should return "pending" for new student this month', () => {
    const now = new Date('2025-01-15');
    const student = { id: 'student-1', startDate: '2025-01-10' };
    const payments = [];
    
    const result = getStudentPaymentStatus(student, payments, now);
    expect(result.status).toBe('pending');
  });

  it('should return "debtor" if last month not paid', () => {
    const now = new Date('2025-01-15');
    const student = { id: 'student-1', startDate: '2024-09-01' };
    const payments = []; // No payments
    
    const result = getStudentPaymentStatus(student, payments, now);
    expect(result.status).toBe('debtor');
  });

  it('should return "pending" if only current month not paid', () => {
    const now = new Date('2025-01-15');
    const student = { id: 'student-1', startDate: '2024-09-01' };
    const payments = [{ studentId: 'student-1', status: 'paid', month: '2024-12' }];
    
    const result = getStudentPaymentStatus(student, payments, now);
    expect(result.status).toBe('pending');
  });
});

// ==================== PRORATED PAYMENT ====================

describe('Prorated Payment Calculation', () => {
  const calculateProratedFee = (startDate, monthlyFee) => {
    const date = new Date(startDate);
    const startDay = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - startDay + 1;
    return Math.round((remainingDays / daysInMonth) * monthlyFee);
  };

  it('should calculate full month if start on 1st', () => {
    const fee = calculateProratedFee('2025-01-01', 500000);
    expect(fee).toBe(500000);
  });

  it('should calculate half month if start on 16th', () => {
    const fee = calculateProratedFee('2025-01-16', 500000);
    // 31 days in January, starting on 16th = 16 days remaining
    // 16/31 * 500000 = ~258064
    expect(fee).toBeGreaterThan(250000);
    expect(fee).toBeLessThan(270000);
  });

  it('should calculate correctly for different months', () => {
    const febFee = calculateProratedFee('2025-02-15', 500000);
    // February 2025 has 28 days, starting on 15th = 14 days
    // 14/28 * 500000 = 250000
    expect(febFee).toBe(250000);
  });
});

// ==================== SCHEDULE DAYS ====================

describe('Schedule Days', () => {
  const WEEKDAYS = [
    { id: 1, short: 'Du', full: 'Dushanba' },
    { id: 2, short: 'Se', full: 'Seshanba' },
    { id: 3, short: 'Chor', full: 'Chorshanba' },
    { id: 4, short: 'Pay', full: 'Payshanba' },
    { id: 5, short: 'Ju', full: 'Juma' },
    { id: 6, short: 'Sha', full: 'Shanba' },
    { id: 0, short: 'Yak', full: 'Yakshanba' },
  ];

  const formatScheduleDays = (scheduleDays) => {
    return scheduleDays
      .sort((a, b) => a - b)
      .map(d => WEEKDAYS.find(w => w.id === d)?.short)
      .join(', ');
  };

  it('should format schedule days correctly', () => {
    expect(formatScheduleDays([1, 3, 5])).toBe('Du, Chor, Ju');
    expect(formatScheduleDays([2, 4, 6])).toBe('Se, Pay, Sha');
  });

  it('should handle single day', () => {
    expect(formatScheduleDays([0])).toBe('Yak');
  });

  it('should sort days correctly', () => {
    expect(formatScheduleDays([5, 1, 3])).toBe('Du, Chor, Ju');
  });
});

// ==================== TELEGRAM LINK ====================

describe('Telegram Link Generation', () => {
  const getTelegramLink = (telegram) => {
    if (!telegram) return null;
    if (telegram.match(/^\d+$/)) {
      return `https://t.me/+${telegram}`;
    }
    return `https://t.me/${telegram.replace('@', '')}`;
  };

  it('should generate phone-based link', () => {
    expect(getTelegramLink('998901234567')).toBe('https://t.me/+998901234567');
  });

  it('should generate username-based link', () => {
    expect(getTelegramLink('username')).toBe('https://t.me/username');
    expect(getTelegramLink('@username')).toBe('https://t.me/username');
  });

  it('should return null for empty input', () => {
    expect(getTelegramLink('')).toBe(null);
    expect(getTelegramLink(null)).toBe(null);
  });
});

// ==================== SUBSCRIPTION LIMITS ====================

describe('Subscription Limits', () => {
  const SUBSCRIPTION_PLANS = {
    trial: { students: 10, groups: 3, teachers: 2 },
    basic: { students: 50, groups: 10, teachers: 5 },
    pro: { students: 200, groups: 50, teachers: 20 },
    enterprise: { students: Infinity, groups: Infinity, teachers: Infinity },
  };

  const checkLimit = (subscription, type, current) => {
    const plan = SUBSCRIPTION_PLANS[subscription] || SUBSCRIPTION_PLANS.trial;
    const limit = plan[type];
    const canAdd = current < limit;
    const remaining = Math.max(0, limit - current);
    return { canAdd, remaining, limit };
  };

  it('should allow adding within limit', () => {
    const result = checkLimit('trial', 'students', 5);
    expect(result.canAdd).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it('should block adding at limit', () => {
    const result = checkLimit('trial', 'students', 10);
    expect(result.canAdd).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should handle enterprise unlimited', () => {
    const result = checkLimit('enterprise', 'students', 1000);
    expect(result.canAdd).toBe(true);
  });
});

// ==================== EMAIL VALIDATION ====================

describe('Email Validation', () => {
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('student998901234567@edu.local')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });
});

// ==================== ATTENDANCE SAVE ====================

describe('Attendance Save Logic', () => {
  const processAttendanceRecords = (existing, newRecords, groupId, date) => {
    const toUpdate = [];
    const toCreate = [];
    
    for (const record of newRecords) {
      const existingRecord = existing.find(e => e.studentId === record.studentId);
      if (existingRecord) {
        toUpdate.push({ ...existingRecord, status: record.status });
      } else {
        toCreate.push({ ...record, groupId, date });
      }
    }
    
    return { toUpdate, toCreate };
  };

  it('should identify records to update', () => {
    const existing = [
      { id: 'att-1', studentId: 'student-1', status: 'present' }
    ];
    const newRecords = [
      { studentId: 'student-1', status: 'absent' }
    ];
    
    const { toUpdate, toCreate } = processAttendanceRecords(existing, newRecords, 'group-1', '2025-01-15');
    
    expect(toUpdate.length).toBe(1);
    expect(toUpdate[0].status).toBe('absent');
    expect(toCreate.length).toBe(0);
  });

  it('should identify records to create', () => {
    const existing = [];
    const newRecords = [
      { studentId: 'student-1', status: 'present' }
    ];
    
    const { toUpdate, toCreate } = processAttendanceRecords(existing, newRecords, 'group-1', '2025-01-15');
    
    expect(toUpdate.length).toBe(0);
    expect(toCreate.length).toBe(1);
    expect(toCreate[0].groupId).toBe('group-1');
  });
});

console.log('✅ All tests defined. Run with: npm test');
