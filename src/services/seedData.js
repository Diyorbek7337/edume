// Firebase Setup Script
// Bu skript Firebase Console'da yoki Firebase Admin SDK orqali ishlatiladi

/*
FIREBASE SOZLASH QO'LLANMASI:

1. Firebase Console'ga kiring: https://console.firebase.google.com
2. Yangi loyiha yarating yoki mavjud loyihani tanlang
3. Authentication -> Sign-in method -> Email/Password ni yoqing
4. Firestore Database yarating (production mode)
5. Project Settings -> General -> Your apps -> Web app qo'shing
6. Firebase konfiguratsiyasini oling va .env fayliga qo'shing

.env fayl namunasi:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
*/

// Test foydalanuvchilar yaratish uchun namuna ma'lumotlar
export const seedUsers = [
  {
    email: 'director@educenter.uz',
    password: 'director123',
    userData: {
      fullName: 'Karimov Anvar',
      role: 'director',
      phone: '+998901234567',
      createdAt: new Date(),
    }
  },
  {
    email: 'admin@educenter.uz',
    password: 'admin123',
    userData: {
      fullName: 'Rahimova Dilnoza',
      role: 'admin',
      phone: '+998901234568',
      createdAt: new Date(),
    }
  },
  {
    email: 'teacher@educenter.uz',
    password: 'teacher123',
    userData: {
      fullName: 'Aziza Rahimova',
      role: 'teacher',
      phone: '+998901234569',
      subject: 'Ingliz tili',
      createdAt: new Date(),
    }
  },
  {
    email: 'student@educenter.uz',
    password: 'student123',
    userData: {
      fullName: 'Alisher Karimov',
      role: 'student',
      phone: '+998901234570',
      groupId: 'group1',
      parentId: 'parent1',
      createdAt: new Date(),
    }
  },
  {
    email: 'parent@educenter.uz',
    password: 'parent123',
    userData: {
      fullName: 'Karim Aliyev',
      role: 'parent',
      phone: '+998901234571',
      studentIds: ['student1'],
      createdAt: new Date(),
    }
  },
];

// Test guruhlar
export const seedGroups = [
  {
    name: 'Ingliz tili - Beginner',
    teacherId: 'teacher1',
    teacherName: 'Aziza Rahimova',
    schedule: { days: 'Du, Chor, Ju', time: '09:00-10:30' },
    price: 850000,
    maxStudents: 15,
    status: 'active',
  },
  {
    name: 'Ingliz tili - Intermediate',
    teacherId: 'teacher1',
    teacherName: 'Aziza Rahimova',
    schedule: { days: 'Se, Pay, Sha', time: '11:00-12:30' },
    price: 850000,
    maxStudents: 15,
    status: 'active',
  },
  {
    name: 'Matematika - 9-sinf',
    teacherId: 'teacher2',
    teacherName: 'Jasur Toshev',
    schedule: { days: 'Du, Chor, Ju', time: '14:00-15:30' },
    price: 750000,
    maxStudents: 12,
    status: 'active',
  },
];

// Test o'quvchilar
export const seedStudents = [
  {
    fullName: 'Alisher Karimov',
    phone: '+998901234570',
    email: 'alisher@gmail.com',
    groupId: 'group1',
    groupName: 'Ingliz tili - Beginner',
    parentName: 'Karim Aliyev',
    parentPhone: '+998901234571',
    status: 'active',
    joinDate: new Date('2024-09-01'),
  },
  {
    fullName: 'Malika Rahimova',
    phone: '+998901234572',
    email: 'malika@gmail.com',
    groupId: 'group2',
    groupName: 'Ingliz tili - Intermediate',
    parentName: 'Rahim Karimov',
    parentPhone: '+998901234573',
    status: 'active',
    joinDate: new Date('2024-10-15'),
  },
];

// Test lidlar
export const seedLeads = [
  {
    fullName: 'Sardor Aliyev',
    phone: '+998901234575',
    interest: 'Ingliz tili',
    source: 'Instagram',
    status: 'new',
    notes: [],
  },
  {
    fullName: 'Dilnoza Karimova',
    phone: '+998901234576',
    interest: 'Matematika',
    source: "Do'st tavsiyasi",
    status: 'contacted',
    notes: [{ text: "Qo'ng'iroq qilindi", date: new Date() }],
  },
];

console.log('Firebase seed data tayyor!');
console.log('Bu ma\'lumotlarni Firebase Console yoki Admin SDK orqali yuklab olishingiz mumkin.');
