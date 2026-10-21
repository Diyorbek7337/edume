// O'quvchi/ota-ona hisoblarini talaba yozuvlariga bog'lash va "student_directory"
// (xavfsiz ro'yxat) uchun SOF funksiyalar — Firestore'ga bog'liq emas, shuning
// uchun emulatorsiz testlanadi (src/__tests__/studentLinking.test.js).
//
// Nega kerak: ilgari o'quvchi va ota-ona sahifalari markazdagi BARCHA talabalarni
// (telefon, ota-ona telefoni, manzil, chegirma bilan) yuklab olib, o'zini
// brauzerda telefon/email bo'yicha qidirardi. Endi:
//   - o'quvchi o'z yozuvini students.userId == uid orqali oladi
//   - ota-ona farzandlarini users.childIds orqali oladi
//   - sinfdoshlar ismi kerak bo'lsa — student_directory (faqat ism/guruh/holat)
// Bu bog'lanishlar server tomonida avtomatik o'rnatiladi (functions/index.js).

// Telefonni faqat raqamlarga keltiradi
const phoneDigits = (phone) => String(phone || '').replace(/\D/g, '');

// Ikki telefon bir xilmi: to'liq mos yoki oxirgi 9 raqam mos
// (+998 90 123 45 67 == 901234567 == 998901234567)
function phonesMatch(a, b) {
  const x = phoneDigits(a);
  const y = phoneDigits(b);
  if (!x || !y) return false;
  if (x === y) return true;
  return x.length >= 9 && y.length >= 9 && x.slice(-9) === y.slice(-9);
}

const emailsMatch = (a, b) =>
  Boolean(a && b) && String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

// student_directory hujjati — boshqa o'quvchi/ota-onalarga ko'rinadigan YAGONA
// maydonlar. Telefon, ota-ona ma'lumoti, manzil, chegirma, to'lov — YO'Q.
const DIRECTORY_FIELDS = ['fullName', 'groupId', 'groupIds', 'groupName', 'status'];

function directoryEntry(student) {
  const entry = {};
  DIRECTORY_FIELDS.forEach((key) => {
    if (student && student[key] !== undefined) entry[key] = student[key];
  });
  if (!entry.fullName) entry.fullName = '';
  return entry;
}

// Katalogga ta'sir qiladigan o'zgarish bo'ldimi (ortiqcha yozuvlarning oldini olish)
function directoryChanged(before, after) {
  if (!before || !after) return true;
  return DIRECTORY_FIELDS.some((key) =>
    JSON.stringify(before[key] ?? null) !== JSON.stringify(after[key] ?? null));
}

// Talaba yozuviga mos o'quvchi hisobini (users, role=student) topadi:
// avval email (Students.jsx har bir o'quvchiga `telefon@student.edu` beradi),
// keyin telefon. Bir nechta nomzod bo'lsa — hech birini tanlamaydi (xato
// bog'lashdan ko'ra bog'lamaslik xavfsizroq).
function findUserForStudent(student, studentUsers) {
  if (!student) return null;
  const byEmail = studentUsers.filter((u) => emailsMatch(u.email, student.email));
  if (byEmail.length === 1) return byEmail[0];
  const byPhone = studentUsers.filter((u) => phonesMatch(u.phone, student.phone));
  return byPhone.length === 1 ? byPhone[0] : null;
}

// O'quvchi hisobiga mos talaba yozuvini topadi (hali userId'siz yozuvlar orasidan)
function findStudentForUser(user, students) {
  if (!user) return null;
  const free = students.filter((s) => !s.userId);
  const byEmail = free.filter((s) => emailsMatch(s.email, user.email));
  if (byEmail.length === 1) return byEmail[0];
  const byPhone = free.filter((s) => phonesMatch(s.phone, user.phone));
  return byPhone.length === 1 ? byPhone[0] : null;
}

// Ota-onaning farzandlari: talaba yozuvidagi parentPhone ota-ona telefoniga mos
function findChildrenForParent(parent, students) {
  if (!parent || !phoneDigits(parent.phone)) return [];
  return students.filter((s) => phonesMatch(s.parentPhone, parent.phone)).map((s) => s.id);
}

// Ota-ona hisobidagi mavjud bog'lanishlar (eski childId maydoni ham)
function existingChildIds(parent) {
  const ids = Array.isArray(parent?.childIds) ? [...parent.childIds] : [];
  if (parent?.childId && !ids.includes(parent.childId)) ids.push(parent.childId);
  return ids;
}

module.exports = {
  phoneDigits,
  phonesMatch,
  DIRECTORY_FIELDS,
  directoryEntry,
  directoryChanged,
  findUserForStudent,
  findStudentForUser,
  findChildrenForParent,
  existingChildIds,
};
