export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  DIRECTOR: 'director',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const ROLE_NAMES = {
  super_admin: 'Super Admin',
  director: 'Direktor',
  admin: 'Administrator',
  teacher: "O'qituvchi",
  student: "O'quvchi",
  parent: 'Ota-ona'
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PARTIAL: 'partial'
};

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  TRIAL: 'trial',
  CONVERTED: 'converted',
  LOST: 'lost'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
};

// Kimlar nimani ko'rishi/qilishi mumkin
export const PERMISSIONS = {
  // Dashboard
  VIEW_FULL_STATS: ['director', 'admin'],
  
  // Foydalanuvchilar
  MANAGE_ADMINS: ['director'],
  MANAGE_TEACHERS: ['director', 'admin'],
  MANAGE_STUDENTS: ['director', 'admin'],
  MANAGE_PARENTS: ['director', 'admin'],
  MANAGE_GROUPS: ['director', 'admin'],
  
  // Lidlar
  MANAGE_LEADS: ['director', 'admin'],
  
  // To'lovlar
  MANAGE_PAYMENTS: ['director', 'admin'],
  VIEW_OWN_PAYMENTS: ['student', 'parent'],
  
  // Davomat & Baholar
  MANAGE_ATTENDANCE: ['director', 'admin', 'teacher'],
  MANAGE_GRADES: ['teacher'],
  VIEW_OWN_GRADES: ['student', 'parent'],
  
  // Xabarlar
  SEND_TO_ALL: ['director', 'admin'],
  SEND_TO_GROUP: ['teacher'],
  SEND_FEEDBACK: ['student', 'parent'],
  
  // Sozlamalar
  SYSTEM_SETTINGS: ['director'],
};

export const hasPermission = (role, permission) => {
  return PERMISSIONS[permission]?.includes(role) || false;
};

// Admin uchun boshqariluvchi modullar
export const ADMIN_MODULES = [
  { id: 'students',        label: "O'quvchilar" },
  { id: 'teachers',        label: "O'qituvchilar" },
  { id: 'groups',          label: 'Guruhlar' },
  { id: 'schedule',        label: 'Jadval' },
  { id: 'leads',           label: 'Lidlar' },
  { id: 'payments',        label: "To'lovlar" },
  { id: 'expenses',        label: 'Xarajatlar' },
  { id: 'attendance',      label: 'Davomat' },
  { id: 'grades',          label: 'Baholar' },
  { id: 'homework',        label: 'Uy vazifalari' },
  { id: 'quizzes',         label: 'Testlar' },
  { id: 'materials',       label: 'Materiallar' },
  { id: 'leaderboard',     label: 'Reyting' },
  { id: 'rewards',         label: 'Mukofotlar' },
  { id: 'certificates',    label: 'Sertifikatlar' },
  { id: 'chat',            label: 'Chat' },
  { id: 'pdf-reports',     label: 'PDF hisobotlar' },
  { id: 'teacher-ratings', label: "O'qituvchi reytingi" },
  { id: 'messages',        label: 'Xabarlar' },
  { id: 'reports',         label: 'Hisobotlar' },
];

// "Yordamchi o'qituvchi" — yakka o'qituvchi tarifidagi bitta cheklangan admin
// uchun tayyor ruxsatlar to'plami. Uning vazifasi: o'quvchilarning aloqa
// ma'lumotlarini ko'rish, davomat qilish, sinf va uy topshiriqlarini baholash.
//
// MUHIM: bu to'rtta modul firestore.rules'da HAQIQATAN tekshiriladi — 'homework'
// bo'lmasa yordamchi uy vazifasini baholay OLMAYDI. Moliyaviy va boshqaruv
// bo'limlari (to'lov, lid, xarajat, sozlama) ataylab kiritilmagan.
export const HELPER_TEACHER_MODULES = ['students', 'attendance', 'grades', 'homework'];
