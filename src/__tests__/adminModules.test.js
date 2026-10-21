/**
 * ADMIN_MODULES va HELPER_TEACHER_MODULES — invariantlar testi.
 *
 * Nega kerak: modul ID'lari uch joyda bir xil bo'lishi shart —
 *   1) src/utils/constants.js (ADMIN_MODULES — interfeys katakchalari)
 *   2) src/App.jsx (allowedModule="...")
 *   3) firestore.rules (hasModulePermission('...'))
 * Ulardan birida xato yozilsa (masalan 'homeworks'), hech qanday xato
 * chiqmaydi — ruxsat shunchaki JIMGINA ishlamay qoladi. Bu testlar kamida
 * preset ichidagi ID'lar haqiqiy modul ekanini kafolatlaydi.
 */
import { describe, it, expect } from 'vitest';
import { ADMIN_MODULES, HELPER_TEACHER_MODULES } from '../utils/constants';

const ALL_IDS = ADMIN_MODULES.map(m => m.id);

describe('ADMIN_MODULES', () => {
  it('ID lar takrorlanmaydi', () => {
    expect(new Set(ALL_IDS).size).toBe(ALL_IDS.length);
  });

  it('har bir modulda id va label bor', () => {
    ADMIN_MODULES.forEach(m => {
      expect(typeof m.id).toBe('string');
      expect(m.id.length).toBeGreaterThan(0);
      expect(typeof m.label).toBe('string');
      expect(m.label.length).toBeGreaterThan(0);
    });
  });
});

describe("HELPER_TEACHER_MODULES (yordamchi o'qituvchi preseti)", () => {
  it('faqat mavjud modul ID laridan iborat', () => {
    HELPER_TEACHER_MODULES.forEach(id => {
      expect(ALL_IDS).toContain(id);
    });
  });

  it("uy vazifasini baholash uchun 'homework' bo'lishi SHART", () => {
    // Foydalanuvchi talabi: yordamchi "berilgan sinf va uyga topshiriqlarini
    // baholay olishi kerak". homework_submissions update qoidasi aynan shu
    // modulga bog'langan — u tushib qolsa baholash ishlamaydi.
    expect(HELPER_TEACHER_MODULES).toContain('homework');
  });

  it("davomat va baholar uchun kerakli modullar bor", () => {
    expect(HELPER_TEACHER_MODULES).toContain('attendance');
    expect(HELPER_TEACHER_MODULES).toContain('grades');
    expect(HELPER_TEACHER_MODULES).toContain('students');
  });

  it('sezgir bo\'limlarni O\'Z ICHIGA OLMAYDI', () => {
    // Bu presetning butun maqsadi — moliyaviy va boshqaruv bo'limlarini yopish
    ['payments', 'leads', 'expenses', 'reports', 'teachers'].forEach(id => {
      expect(HELPER_TEACHER_MODULES).not.toContain(id);
    });
  });

  it('to\'liq ruxsatga teng emas (aks holda cheklovning ma\'nosi yo\'q)', () => {
    expect(HELPER_TEACHER_MODULES.length).toBeLessThan(ALL_IDS.length);
  });
});
