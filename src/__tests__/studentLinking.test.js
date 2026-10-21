/**
 * functions/studentLinking.js — o'quvchi/ota-onani talaba yozuviga bog'lash
 * va student_directory maydonlari.
 */
import { describe, it, expect } from 'vitest';
import {
  phonesMatch, directoryEntry, directoryChanged,
  findUserForStudent, findStudentForUser, findChildrenForParent, existingChildIds,
} from '../../functions/studentLinking.js';

describe('phonesMatch', () => {
  it('formatdan qat\'i nazar bir xil raqam', () => {
    expect(phonesMatch('+998 90 123-45-67', '998901234567')).toBe(true);
    expect(phonesMatch('901234567', '+998901234567')).toBe(true);
  });
  it('boshqa raqam yoki bo\'sh qiymat mos emas', () => {
    expect(phonesMatch('+998901234567', '+998901234568')).toBe(false);
    expect(phonesMatch('', '')).toBe(false);
    expect(phonesMatch('1', '998901234561')).toBe(false); // qisqa qism mos kelmaydi
  });
});

describe('directoryEntry — faqat xavfsiz maydonlar', () => {
  const student = {
    fullName: 'Ali Valiyev', groupId: 'g1', groupName: 'Frontend', status: 'active',
    phone: '+998901234567', parentPhone: '+998907654321', parentName: 'Vali', address: 'Sho\'rchi',
    discount: 20, email: '901234567@student.edu', userId: 'u1', birthDate: '2010-01-01',
  };

  it('telefon, ota-ona, manzil, chegirma, email, userId kirmaydi', () => {
    const e = directoryEntry(student);
    expect(e).toEqual({ fullName: 'Ali Valiyev', groupId: 'g1', groupName: 'Frontend', status: 'active' });
  });

  it("faqat katalog maydoni o'zgarganda yangilanadi", () => {
    expect(directoryChanged(student, { ...student, phone: '+998000000000' })).toBe(false);
    expect(directoryChanged(student, { ...student, groupId: 'g2' })).toBe(true);
    expect(directoryChanged(null, student)).toBe(true);
  });
});

describe("o'quvchi hisobini bog'lash", () => {
  const users = [
    { id: 'u1', role: 'student', email: '901234567@student.edu', phone: '+998901234567' },
    { id: 'u2', role: 'student', email: 'b@x.uz', phone: '+998931112233' },
  ];

  it('email bo\'yicha topadi', () => {
    expect(findUserForStudent({ email: '901234567@STUDENT.edu' }, users)?.id).toBe('u1');
  });

  it("email bo'lmasa telefon bo'yicha", () => {
    expect(findUserForStudent({ phone: '93 111 22 33' }, users)?.id).toBe('u2');
  });

  it("bir nechta nomzod bo'lsa bog'lamaydi", () => {
    const dup = [...users, { id: 'u3', role: 'student', phone: '+998931112233' }];
    expect(findUserForStudent({ phone: '+998931112233' }, dup)).toBeNull();
  });

  it("hisob uchun talaba — faqat hali bog'lanmaganlar orasidan", () => {
    const students = [
      { id: 's1', email: 'b@x.uz', userId: 'someone' },
      { id: 's2', phone: '+998931112233' },
    ];
    expect(findStudentForUser(users[1], students)?.id).toBe('s2');
  });
});

describe("ota-onani bog'lash", () => {
  const students = [
    { id: 's1', parentPhone: '+998 90 765 43 21' },
    { id: 's2', parentPhone: '907654321' },
    { id: 's3', parentPhone: '+998911111111' },
  ];

  it('parentPhone bo\'yicha barcha farzandlar', () => {
    expect(findChildrenForParent({ phone: '+998907654321' }, students)).toEqual(['s1', 's2']);
  });

  it("telefoni yo'q ota-onaga hech narsa bog'lanmaydi", () => {
    expect(findChildrenForParent({ phone: '' }, students)).toEqual([]);
  });

  it('eski childId maydoni ham hisobga olinadi', () => {
    expect(existingChildIds({ childId: 'a', childIds: ['b'] })).toEqual(['b', 'a']);
    expect(existingChildIds({})).toEqual([]);
  });
});
