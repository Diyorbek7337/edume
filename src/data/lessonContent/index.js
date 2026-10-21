// Dars matnlari reyestri.
//
// Har dars ikki maydonli: { goal, student, teacher }
//   student — o'quvchi, ota-ona va o'qituvchi ko'radi
//   teacher — FAQAT o'qituvchi/admin ko'radi
//
// Yangi modul qo'shish:
//   1. Shu papkada junior-m2.js kabi fayl yarating
//   2. Uni quyida import qilib, LESSON_CONTENT ichiga qo'shing
//
// Dars kaliti curriculum.js dagi id bilan bir xil bo'lishi SHART
// (masalan 'junior.m1.l8'), aks holda material darsga ulanmaydi.

import { JUNIOR_M1_CONTENT } from './junior-m1';
import { JUNIOR_M1_OY2_CONTENT } from './junior-m1-oy2';
import { JUNIOR_M1_OY3_CONTENT } from './junior-m1-oy3';
import { JUNIOR_M2_CONTENT } from './junior-m2';
import { JUNIOR_M3_CONTENT } from './junior-m3';

export const LESSON_CONTENT = {
  // 1-Modul: Visual Foundation (HTML/CSS)
  ...JUNIOR_M1_CONTENT,      // 1-oy  (1–12-darslar)
  ...JUNIOR_M1_OY2_CONTENT,  // 2-oy  (13–24-darslar)
  ...JUNIOR_M1_OY3_CONTENT,  // 3-oy  (25–36-darslar)

  // 2-Modul: Algoritmlar va Mantiq (JavaScript)
  ...JUNIOR_M2_CONTENT,

  // 3-Modul: Real-World Tools & Firebase
  ...JUNIOR_M3_CONTENT,
};

/** Darsda o'quvchiga ko'rsatiladigan matn bormi? */
export const hasLessonContent = (lessonId) =>
  Boolean(LESSON_CONTENT[lessonId]?.student);

/**
 * Dars matnini rolga qarab qaytaradi.
 *
 * XAVFSIZLIK: o'qituvchi matni faqat includeTeacher === true bo'lgandagina
 * qaytariladi. Chaqiruvchi tomonda rol tekshiriladi.
 */
export const getLessonContent = (lessonId, { includeTeacher = false } = {}) => {
  const entry = LESSON_CONTENT[lessonId];
  if (!entry) return null;
  return {
    goal: entry.goal || '',
    student: entry.student || '',
    teacher: includeTeacher ? entry.teacher || '' : '',
  };
};
