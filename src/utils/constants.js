export const ROLES = {
  DIRECTOR: 'director',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const ROLE_NAMES = {
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
