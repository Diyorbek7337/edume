/**
 * firestore.rules — real Firestore emulator ustida ishlaydigan xavfsizlik testlari.
 *
 * Bu testlar shu loyihada aniqlangan va tuzatilgan kritik zaifliklarning
 * REGRESSIYASINI tekshiradi — ular qayta paydo bo'lsa (masalan, kimdir
 * rules faylini "soddalashtirsa"), test darhol qizil chiqadi.
 *
 * Ishga tushirish: npm run test:rules
 * (Firestore emulator uchun Java (JRE 11+) o'rnatilgan bo'lishi shart.)
 */
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import {
  doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-edume-rules-test';

let testEnv;

beforeAll(async () => {
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8005';
  const [host, portStr] = emulatorHost.split(':');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host,
      port: Number(portStr),
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

// Har bir testdan oldin ma'lumotlar bazasini tozalab, umumiy fixture'larni
// qoidalarsiz (admin huquqi bilan) qayta joylaymiz — testlar bir-biriga
// ta'sir qilmasligi uchun.
beforeEach(async () => {
  await testEnv.clearFirestore();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    // --- Center A: Basic tarif, bo'sh limit (0/100 talaba) ---
    await setDoc(doc(db, 'centers/center-a'), {
      name: 'Center A',
      ownerUid: 'director-a',
      subscription: 'basic',
      limits: { students: 100, teachers: 10, groups: 20 },
      usage: { students: 0, teachers: 0, groups: 0 },
    });

    // --- Center B: begona markaz (izolyatsiya testlari uchun) ---
    await setDoc(doc(db, 'centers/center-b'), {
      name: 'Center B',
      ownerUid: 'director-b',
      subscription: 'pro',
      limits: { students: -1, teachers: -1, groups: -1 },
      usage: { students: 0, teachers: 0, groups: 0 },
    });

    // --- Center Full: Basic tarif, limitga yetgan (2/2 talaba, 1/1 admin) ---
    await setDoc(doc(db, 'centers/center-full'), {
      name: 'Center Full',
      ownerUid: 'director-full',
      subscription: 'basic',
      limits: { students: 2, teachers: 10, groups: 20, admins: 1 },
      usage: { students: 2, teachers: 0, groups: 0, admins: 1 },
    });

    // --- Center Solo: Solo tarif, hali admin (yordamchi o'qituvchi) yo'q (0/1) ---
    await setDoc(doc(db, 'centers/center-solo'), {
      name: 'Center Solo',
      ownerUid: 'director-solo',
      subscription: 'solo',
      limits: { students: 150, teachers: 1, groups: 12, admins: 1 },
      usage: { students: 1, teachers: 1, groups: 1, admins: 0 },
    });

    // --- Foydalanuvchilar ---
    await setDoc(doc(db, 'users/director-a'), { role: 'director', centerId: 'center-a' });
    await setDoc(doc(db, 'users/admin-a'), { role: 'admin', centerId: 'center-a' });
    await setDoc(doc(db, 'users/teacher-a'), { role: 'teacher', centerId: 'center-a' });
    await setDoc(doc(db, 'users/student-a'), { role: 'student', centerId: 'center-a' });
    await setDoc(doc(db, 'users/parent-a'), {
      role: 'parent', centerId: 'center-a', childIds: ['student-a-doc'],
    });
    await setDoc(doc(db, 'users/director-b'), { role: 'director', centerId: 'center-b' });
    await setDoc(doc(db, 'users/admin-full'), { role: 'admin', centerId: 'center-full' });
    await setDoc(doc(db, 'users/director-full'), { role: 'director', centerId: 'center-full' });
    await setDoc(doc(db, 'users/director-solo'), { role: 'director', centerId: 'center-solo' });
    // "Yordamchi o'qituvchi" — cheklangan admin. Aynan shu to'rtlik uning
    // vazifasiga mos: o'quvchi aloqa ma'lumotlari, davomat, sinf va uy
    // topshiriqlarini baholash. Boshqa hamma modul (to'lov, lid, jadval,
    // material, chat, xabar...) unga yopiq bo'lishi kerak.
    await setDoc(doc(db, 'users/helper-a'), {
      role: 'admin',
      centerId: 'center-a',
      permissions: ['students', 'attendance', 'grades', 'homework'],
    });

    // --- Markaz ichidagi hujjatlar ---
    await setDoc(doc(db, 'centers/center-a/students/student-a-doc'), {
      fullName: 'Talaba A', userId: 'student-a',
    });
    await setDoc(doc(db, 'centers/center-b/students/student-b-doc'), {
      fullName: 'Talaba B', userId: 'student-b',
    });
    await setDoc(doc(db, 'centers/center-a/payments/payment-own'), {
      studentId: 'student-a', amount: 100000,
    });
    await setDoc(doc(db, 'centers/center-a/payments/payment-other'), {
      studentId: 'some-other-uid', amount: 50000,
    });

    // --- Modul cheklovi testlari uchun hujjatlar ---
    await setDoc(doc(db, 'centers/center-a/homework/hw-1'), { title: 'Uy vazifa 1' });
    await setDoc(doc(db, 'centers/center-a/homework_submissions/sub-1'), {
      homeworkId: 'hw-1', studentId: 'student-a',
    });
    await setDoc(doc(db, 'centers/center-a/materials/mat-1'), { title: 'Video dars' });
    await setDoc(doc(db, 'centers/center-a/schedule/sch-1'), { dayOfWeek: 1, groupName: 'A guruh' });
    await setDoc(doc(db, 'centers/center-a/messages/msg-1'), { text: 'Salom', senderId: 'director-a' });
    await setDoc(doc(db, 'centers/center-a/chat_messages/chat-1'), { text: 'Chat', senderId: 'teacher-a' });
  });
});

const asDb = (uid) => testEnv.authenticatedContext(uid).firestore();
const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

describe('Privilege escalation himoyasi', () => {
  it("yangi (ro'yxatdan o'tmagan) foydalanuvchi o'zini super_admin qilib yoza olmaydi", async () => {
    const db = asDb('attacker'); // users/attacker hujjati yo'q
    await assertFails(setDoc(doc(db, 'users/attacker'), {
      role: 'super_admin', centerId: 'center-a',
    }));
  });

  it("admin boshqa foydalanuvchini super_admin darajasiga ko'tara olmaydi", async () => {
    const db = asDb('admin-a');
    await assertFails(updateDoc(doc(db, 'users/teacher-a'), { role: 'super_admin' }));
  });

  it("admin foydalanuvchini boshqa markazga ko'chira olmaydi (centerId tamper)", async () => {
    const db = asDb('admin-a');
    await assertFails(updateDoc(doc(db, 'users/teacher-a'), { centerId: 'center-b' }));
  });

  it("ota-ona o'z childIds ro'yxatini o'zi tahrirlay olmaydi", async () => {
    const db = asDb('parent-a');
    await assertFails(updateDoc(doc(db, 'users/parent-a'), {
      childIds: ['student-a-doc', 'student-b-doc'],
    }));
  });

  it("foydalanuvchi o'z profilida bog'liq bo'lmagan maydonni (masalan telefon) yangilay oladi", async () => {
    const db = asDb('parent-a');
    await assertSucceeds(updateDoc(doc(db, 'users/parent-a'), { phone: '+998901234567' }));
  });
});

describe('Multi-tenant izolyatsiya', () => {
  it("Center A admin Center B talabasini o'qiy olmaydi", async () => {
    const db = asDb('admin-a');
    await assertFails(getDoc(doc(db, 'centers/center-b/students/student-b-doc')));
  });

  it("Center A admin Center B ga talaba yoza olmaydi", async () => {
    const db = asDb('admin-a');
    await assertFails(setDoc(doc(db, 'centers/center-b/students/hacked'), {
      fullName: 'Hacked', userId: 'x',
    }));
  });

  it("o'quvchi boshqa o'quvchining to'lov hujjatini to'g'ridan-to'g'ri o'qiy olmaydi", async () => {
    const db = asDb('student-a');
    await assertFails(getDoc(doc(db, 'centers/center-a/payments/payment-other')));
  });

  it("o'quvchi o'zining to'lov hujjatini o'qiy oladi", async () => {
    const db = asDb('student-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/payments/payment-own')));
  });

  it("o'quvchi filtrsiz (where'siz) barcha to'lovlar ro'yxatini so'rasa rad etiladi", async () => {
    const db = asDb('student-a');
    await assertFails(getDocs(collection(db, 'centers/center-a/payments')));
  });

  it("o'quvchi o'z studentId'i bo'yicha filtrlangan so'rovni bajara oladi", async () => {
    const db = asDb('student-a');
    const q = query(collection(db, 'centers/center-a/payments'), where('studentId', '==', 'student-a'));
    await assertSucceeds(getDocs(q));
  });

  it("o'quvchi boshqa studentId bilan filtrlangan so'rov yubora olmaydi", async () => {
    const db = asDb('student-a');
    const q = query(collection(db, 'centers/center-a/payments'), where('studentId', '==', 'some-other-uid'));
    await assertFails(getDocs(q));
  });
});

describe('Tarif limiti enforcement', () => {
  it('limitga yetgan markazda yangi talaba yaratib bo\'lmaydi', async () => {
    const db = asDb('admin-full');
    await assertFails(setDoc(doc(db, 'centers/center-full/students/new-student'), {
      fullName: 'Yangi', status: 'active',
    }));
  });

  it('limit ichida bo\'lsa admin yangi talaba yarata oladi', async () => {
    const db = asDb('admin-a');
    await assertSucceeds(setDoc(doc(db, 'centers/center-a/students/new-student'), {
      fullName: 'Yangi', status: 'active',
    }));
  });
});

describe("Ro'yxatdan o'tish oqimi (regressiya)", () => {
  it("yangi foydalanuvchi o'z markazini va direktor profilini yarata oladi", async () => {
    const db = asDb('new-director'); // users/new-director hali yo'q

    await assertSucceeds(setDoc(doc(db, 'centers/new-center'), {
      name: 'Yangi Markaz', ownerUid: 'new-director', subscription: 'trial',
      status: 'active', trialEndsAt: daysFromNow(30),
    }));

    await assertSucceeds(setDoc(doc(db, 'users/new-director'), {
      role: 'director', centerId: 'new-center',
    }));
  });

  it("direktor o'zini ham O'qituvchi sifatida yarata oladi (createWithAdmin 5-qadami — yakka o'qituvchi onboarding)", async () => {
    const db = asDb('new-director-2');

    await assertSucceeds(setDoc(doc(db, 'centers/new-center-2'), {
      name: 'Yangi Markaz 2', ownerUid: 'new-director-2', subscription: 'trial',
      status: 'active', trialEndsAt: daysFromNow(30),
    }));
    await assertSucceeds(setDoc(doc(db, 'users/new-director-2'), {
      role: 'director', centerId: 'new-center-2',
    }));
    // users/{uid} allaqachon yozilgandan keyin — teacher yozuvi ham muvaffaqiyatli bo'lishi kerak
    await assertSucceeds(setDoc(doc(db, 'centers/new-center-2/teachers/self-teacher'), {
      fullName: 'Yangi Direktor 2', email: 'director2@example.com', phone: '',
      telegram: '', subject: '', status: 'active',
    }));
  });

  it("foydalanuvchi begona markazning direktori bo'lib yoza olmaydi (ownerUid mos kelmasa)", async () => {
    const db = asDb('new-director');
    // center-a allaqachon mavjud, egasi director-a — new-director emas
    await assertFails(setDoc(doc(db, 'users/new-director'), {
      role: 'director', centerId: 'center-a',
    }));
  });

  it("markaz yaratganda ownerUid o'zinikidan boshqa bo'lsa rad etiladi", async () => {
    const db = asDb('new-director');
    await assertFails(setDoc(doc(db, 'centers/fake-center'), {
      name: 'Soxta', ownerUid: 'someone-else', subscription: 'trial',
    }));
  });
});

describe("Cheklangan admin — \"yordamchi o'qituvchi\" (modul ruxsati)", () => {
  // helper-a: permissions: ['students', 'attendance', 'grades', 'homework'].
  // Bu blok firestore.rules'ga hasModulePermission()/isDirectorOrPermittedAdmin()
  // qo'shilgandan keyingi TO'LIQ tekshiruv: ruxsat berilgan modullarda ishlashi,
  // ruxsat berilmagan (to'lovlar, lidlar, sozlamalar, admin yaratish) joyda
  // bloklanishi kerak.

  it('ruxsat berilgan modulda (davomat) yoza oladi', async () => {
    const db = asDb('helper-a');
    await assertSucceeds(setDoc(doc(db, 'centers/center-a/attendance/att-1'), {
      studentId: 'student-a-doc', date: '2026-08-23', status: 'present',
    }));
  });

  it('ruxsat berilgan modulda (baholar) yoza oladi', async () => {
    const db = asDb('helper-a');
    await assertSucceeds(setDoc(doc(db, 'centers/center-a/grades/grade-1'), {
      studentId: 'student-a-doc', grade: 5, maxGrade: 5,
    }));
  });

  it("ruxsat berilmagan modulda (to'lovlar) o'QIY olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(getDoc(doc(db, 'centers/center-a/payments/payment-own')));
  });

  it("ruxsat berilmagan modulda (to'lovlar) yoza olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(setDoc(doc(db, 'centers/center-a/payments/new-payment'), {
      studentId: 'student-a-doc', amount: 100000,
    }));
  });

  it("ruxsat berilmagan modulda (lidlar) o'qiy va yoza olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(getDocs(collection(db, 'centers/center-a/leads')));
    await assertFails(setDoc(doc(db, 'centers/center-a/leads/new-lead'), {
      fullName: 'Yangi Lid', phone: '901234567', status: 'new',
    }));
  });

  it('sozlamalarni yangilay olmaydi (faqat direktor)', async () => {
    const db = asDb('helper-a');
    await assertFails(setDoc(doc(db, 'centers/center-a/settings/main'), {
      centerName: 'Buzilgan',
    }));
  });

  it("BOSHQA admin yarata olmaydi (o'z-o'zini eskalatsiya qilolmaydi)", async () => {
    const db = asDb('helper-a');
    await assertFails(setDoc(doc(db, 'users/new-full-admin'), {
      role: 'admin', centerId: 'center-a',
    }));
  });

  it("permissions maydoni yo'q oddiy admin (eski/to'liq huquqli) baribir to'lovlarni ko'ra oladi", async () => {
    // Orqaga moslik: admin-a'da permissions maydoni yo'q — bu TO'LIQ huquq
    // deb hisoblanishi kerak (eski, permissions'siz yaratilgan adminlar buzilib
    // qolmasligi uchun).
    const db = asDb('admin-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/payments/payment-own')));
  });

  it('direktor sozlamalarni yangilay oladi', async () => {
    const db = asDb('director-a');
    await assertSucceeds(setDoc(doc(db, 'centers/center-a/settings/main'), {
      centerName: 'Yangilangan',
    }));
  });
});

describe('Qolgan modullar cheklovi (jadval, material, chat, xabar, uy vazifasi)', () => {
  // Bu modullar ilgari FAQAT interfeys darajasida cheklanardi — qoidalarda
  // isStaff()/belongsToCenter() edi, ya'ni Admins.jsx'dagi katakchani olib
  // tashlash hech narsa qilmasdi. Endi adminModuleOk() orqali qoidalarda ham
  // tekshiriladi.

  it("yordamchi o'qituvchi uy vazifasini o'qiy oladi ('homework' ruxsati bor)", async () => {
    const db = asDb('helper-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/homework/hw-1')));
  });

  it("yordamchi o'qituvchi uy vazifasini BAHOLAY oladi (submission update)", async () => {
    // Foydalanuvchi talabi: "berilgan sinf va uyga topshiriqlarini baholay olishi kerak"
    const db = asDb('helper-a');
    await assertSucceeds(updateDoc(doc(db, 'centers/center-a/homework_submissions/sub-1'), {
      grade: 5, feedback: 'Yaxshi',
    }));
  });

  it("yordamchi o'qituvchi jadvalni o'qiy va o'zgartira olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(getDoc(doc(db, 'centers/center-a/schedule/sch-1')));
    await assertFails(setDoc(doc(db, 'centers/center-a/schedule/sch-2'), { dayOfWeek: 2 }));
  });

  it("yordamchi o'qituvchi materiallarni o'qiy olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(getDoc(doc(db, 'centers/center-a/materials/mat-1')));
  });

  it("yordamchi o'qituvchi xabarlarni o'qiy olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(getDoc(doc(db, 'centers/center-a/messages/msg-1')));
  });

  it("yordamchi o'qituvchi chatni o'qiy va yoza olmaydi", async () => {
    const db = asDb('helper-a');
    await assertFails(getDoc(doc(db, 'centers/center-a/chat_messages/chat-1')));
    await assertFails(setDoc(doc(db, 'centers/center-a/chat_messages/chat-2'), {
      text: 'Ruxsatsiz', senderId: 'helper-a',
    }));
  });

  // --- Regressiya: adminModuleOk() BOSHQA rollarga tegmasligi kerak ---

  it("o'quvchi materiallarni baribir o'qiy oladi (cheklov faqat adminga tegishli)", async () => {
    const db = asDb('student-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/materials/mat-1')));
  });

  it("o'qituvchi material qo'sha oladi", async () => {
    const db = asDb('teacher-a');
    await assertSucceeds(setDoc(doc(db, 'centers/center-a/materials/mat-2'), { title: 'Yangi' }));
  });

  it("o'quvchi jadvalni baribir ko'ra oladi", async () => {
    const db = asDb('student-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/schedule/sch-1')));
  });

  it("permissions maydoni yo'q admin barcha yangi modullarga baribir kira oladi", async () => {
    // Orqaga moslik — eng muhim regressiya tekshiruvi
    const db = asDb('admin-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/materials/mat-1')));
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/schedule/sch-1')));
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/messages/msg-1')));
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/chat_messages/chat-1')));
  });

  it('direktorga hech qanday modul cheklovi tegmaydi', async () => {
    const db = asDb('director-a');
    await assertSucceeds(getDoc(doc(db, 'centers/center-a/materials/mat-1')));
    await assertSucceeds(setDoc(doc(db, 'centers/center-a/schedule/sch-3'), { dayOfWeek: 3 }));
  });
});

describe('Tarif arizalari (subscription_requests)', () => {
  it("direktor o'z markazi uchun ariza yarata oladi", async () => {
    const db = asDb('director-a');
    await assertSucceeds(setDoc(doc(db, 'subscription_requests/req-1'), {
      plan: 'pro', centerId: 'center-a', status: 'new', contactPhone: '901234567',
    }));
  });

  it('direktor BOSHQA markaz nomidan ariza yarata olmaydi', async () => {
    const db = asDb('director-a');
    await assertFails(setDoc(doc(db, 'subscription_requests/req-fake'), {
      plan: 'pro', centerId: 'center-b', status: 'new',
    }));
  });

  it("ariza 'new' holatidan boshqa holat bilan yaratilmaydi", async () => {
    // Aks holda mijoz o'z arizasini darhol "bajarildi" deb yozib qo'yardi
    const db = asDb('director-a');
    await assertFails(setDoc(doc(db, 'subscription_requests/req-done'), {
      plan: 'pro', centerId: 'center-a', status: 'done',
    }));
  });

  it('direktor ariza holatini o\'zgartira olmaydi (faqat super_admin)', async () => {
    const db = asDb('director-a');
    await assertSucceeds(setDoc(doc(db, 'subscription_requests/req-2'), {
      plan: 'pro', centerId: 'center-a', status: 'new',
    }));
    await assertFails(updateDoc(doc(db, 'subscription_requests/req-2'), { status: 'done' }));
  });

  it('admin (yordamchi) ariza yarata olmaydi — faqat direktor', async () => {
    const db = asDb('helper-a');
    await assertFails(setDoc(doc(db, 'subscription_requests/req-helper'), {
      plan: 'pro', centerId: 'center-a', status: 'new',
    }));
  });

  it("o'quvchi ariza yarata olmaydi", async () => {
    const db = asDb('student-a');
    await assertFails(setDoc(doc(db, 'subscription_requests/req-student'), {
      plan: 'pro', centerId: 'center-a', status: 'new',
    }));
  });

  it('begona markaz direktori arizani o\'qiy olmaydi', async () => {
    const dbA = asDb('director-a');
    await assertSucceeds(setDoc(doc(dbA, 'subscription_requests/req-3'), {
      plan: 'pro', centerId: 'center-a', status: 'new',
    }));
    const dbB = asDb('director-b');
    await assertFails(getDoc(doc(dbB, 'subscription_requests/req-3')));
  });
});

describe("Adminlar limiti (\"bitta yordamchi o'qituvchi\")", () => {
  it("Solo tarifda (limit ichida) direktor 1-admin (yordamchi o'qituvchi) yarata oladi", async () => {
    const db = asDb('director-solo');
    await assertSucceeds(setDoc(doc(db, 'users/helper-solo'), {
      role: 'admin', centerId: 'center-solo', permissions: ['students', 'attendance', 'grades'],
    }));
  });

  it('limitga yetgan markazda direktor 2-adminni yarata olmaydi', async () => {
    const db = asDb('director-full');
    await assertFails(setDoc(doc(db, 'users/second-admin'), {
      role: 'admin', centerId: 'center-full',
    }));
  });

  it("cheklangan admin (yordamchi o'qituvchi) hech qanday admin yarata olmaydi (limit ichida bo'lsa ham)", async () => {
    // helper-a — center-a'da, u yerda limits.admins yo'q (default cheksiz) —
    // lekin baribir role='admin' yaratish faqat DIREKTORGA ruxsat, admin emas
    const db = asDb('helper-a');
    await assertFails(setDoc(doc(db, 'users/another-admin'), {
      role: 'admin', centerId: 'center-a',
    }));
  });
});

describe("Tarif maydonlarini himoyalash (to'lovsiz Pro olishning oldini olish)", () => {
  it("direktor o'z markazining tarifini o'zi 'pro' qila olmaydi", async () => {
    const db = asDb('director-a');
    await assertFails(updateDoc(doc(db, 'centers/center-a'), { subscription: 'pro' }));
  });

  it("direktor usage/limits hisoblagichlarini o'zgartira olmaydi", async () => {
    const db = asDb('director-a');
    await assertFails(updateDoc(doc(db, 'centers/center-a'), { 'usage.students': -1000 }));
    await assertFails(updateDoc(doc(db, 'centers/center-a'), { 'limits.students': -1 }));
  });

  it("direktor muddat maydonlarini (paidUntil, trialEndsAt) va holatni o'zgartira olmaydi", async () => {
    const db = asDb('director-a');
    await assertFails(updateDoc(doc(db, 'centers/center-a'), { paidUntil: daysFromNow(3650) }));
    await assertFails(updateDoc(doc(db, 'centers/center-a'), { trialEndsAt: daysFromNow(3650) }));
    await assertFails(updateDoc(doc(db, 'centers/center-a'), { status: 'active' }));
  });

  it("direktor markaz profilini (nom, telefon, logo) o'zgartira oladi", async () => {
    const db = asDb('director-a');
    await assertSucceeds(updateDoc(doc(db, 'centers/center-a'), {
      name: 'Center A (yangi nom)', phone: '+998901234567', updatedAt: new Date(),
    }));
  });

  it("ro'yxatdan o'tishda markazni darhol 'pro' qilib yaratib bo'lmaydi", async () => {
    const db = asDb('sneaky');
    await assertFails(setDoc(doc(db, 'centers/sneaky-center'), {
      name: 'Sneaky', ownerUid: 'sneaky', subscription: 'pro', status: 'active', trialEndsAt: daysFromNow(30),
    }));
  });

  it("ro'yxatdan o'tishda 31 kundan uzun sinov muddati bilan yaratib bo'lmaydi", async () => {
    const db = asDb('sneaky');
    await assertFails(setDoc(doc(db, 'centers/sneaky-center'), {
      name: 'Sneaky', ownerUid: 'sneaky', subscription: 'trial', status: 'active', trialEndsAt: daysFromNow(3650),
    }));
  });

  it("ro'yxatdan o'tishda usage/limits/paidUntil yozib bo'lmaydi", async () => {
    const db = asDb('sneaky');
    await assertFails(setDoc(doc(db, 'centers/sneaky-center'), {
      name: 'Sneaky', ownerUid: 'sneaky', subscription: 'trial', status: 'active',
      trialEndsAt: daysFromNow(30), usage: { students: -1000 },
    }));
  });
});

describe("Obuna muddati: 3 kunlik imtiyoz, keyin faqat o'qish", () => {
  const seedCenter = async (id, data) => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, `centers/${id}`), { name: id, ownerUid: `director-${id}`, ...data });
      await setDoc(doc(db, `users/director-${id}`), { role: 'director', centerId: id });
      await setDoc(doc(db, `users/parent-${id}`), { role: 'parent', centerId: id, childIds: ['kid-1'] });
      await setDoc(doc(db, `centers/${id}/students/kid-1`), { fullName: 'Kid' });
    });
  };
  const addStudent = (id) => setDoc(doc(asDb(`director-${id}`), `centers/${id}/students/new-kid`), { fullName: 'Yangi' });

  it('sinov muddati tugamagan — yozish mumkin', async () => {
    await seedCenter('c-active', { subscription: 'trial', trialEndsAt: daysFromNow(5) });
    await assertSucceeds(addStudent('c-active'));
  });

  it('sinov 1 kun oldin tugagan (imtiyoz davri) — yozish hali mumkin', async () => {
    await seedCenter('c-grace', { subscription: 'trial', trialEndsAt: daysFromNow(-1) });
    await assertSucceeds(addStudent('c-grace'));
  });

  it("sinov 4 kun oldin tugagan — yozish rad etiladi, o'qish mumkin", async () => {
    await seedCenter('c-expired', { subscription: 'trial', trialEndsAt: daysFromNow(-4) });
    await assertFails(addStudent('c-expired'));
    await assertSucceeds(getDoc(doc(asDb('director-c-expired'), 'centers/c-expired/students/kid-1')));
  });

  it("pullik tarif paidUntil'dan 4 kun o'tgan — yozish rad etiladi", async () => {
    await seedCenter('c-paid-exp', { subscription: 'basic', trialEndsAt: null, paidUntil: daysFromNow(-4) });
    await assertFails(addStudent('c-paid-exp'));
  });

  it("pullik tarif, paidUntil yo'q (eski mijoz) — cheklov yo'q", async () => {
    await seedCenter('c-legacy', { subscription: 'pro', trialEndsAt: null });
    await assertSucceeds(addStudent('c-legacy'));
  });

  it("to'xtatilgan (suspended) markaz — yozish rad etiladi", async () => {
    await seedCenter('c-susp', { subscription: 'pro', status: 'suspended' });
    await assertFails(addStudent('c-susp'));
  });

  it("muddati tugagan markaz direktori ham tarif arizasi yubora oladi", async () => {
    await seedCenter('c-expired2', { subscription: 'trial', trialEndsAt: daysFromNow(-10) });
    await assertSucceeds(setDoc(doc(asDb('director-c-expired2'), 'subscription_requests/req-exp'), {
      centerId: 'c-expired2', plan: 'basic', status: 'new',
    }));
  });
});

describe("Ota-ona faqat o'z farzandining to'lovlarini ko'radi", () => {
  it("ota-ona o'z farzandi bo'yicha filtrlangan to'lovlar so'rovini bajara oladi", async () => {
    const db = asDb('parent-a');
    await assertSucceeds(getDocs(query(
      collection(db, 'centers/center-a/payments'), where('studentId', '==', 'student-a-doc'),
    )));
  });

  it("ota-ona filtrsiz barcha to'lovlar ro'yxatini ola olmaydi", async () => {
    const db = asDb('parent-a');
    await assertFails(getDocs(collection(db, 'centers/center-a/payments')));
  });

  it("ota-ona begona o'quvchi bo'yicha to'lovlarni so'ray olmaydi", async () => {
    const db = asDb('parent-a');
    await assertFails(getDocs(query(
      collection(db, 'centers/center-a/payments'), where('studentId', '==', 'some-other-uid'),
    )));
  });

  it("ota-ona filtrsiz barcha oylik hisoblarni (monthly_bills) ola olmaydi", async () => {
    const db = asDb('parent-a');
    await assertFails(getDocs(collection(db, 'centers/center-a/monthly_bills')));
  });
});

describe("O'quvchilar ro'yxati maxfiyligi (students / student_directory)", () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'centers/center-a/students/other-kid'), {
        fullName: 'Boshqa bola', phone: '+998901112233', parentPhone: '+998909998877', userId: 'other-student',
      });
      await setDoc(doc(db, 'centers/center-a/student_directory/other-kid'), { fullName: 'Boshqa bola', groupId: 'g1' });
      await setDoc(doc(db, 'users/legacy-parent'), { role: 'parent', centerId: 'center-a', childId: 'student-a-doc' });
    });
  });

  it("o'quvchi filtrsiz barcha talabalar ro'yxatini ola olmaydi", async () => {
    await assertFails(getDocs(collection(asDb('student-a'), 'centers/center-a/students')));
  });

  it("o'quvchi o'z yozuvini userId bo'yicha so'rab oladi", async () => {
    await assertSucceeds(getDocs(query(
      collection(asDb('student-a'), 'centers/center-a/students'), where('userId', '==', 'student-a'),
    )));
  });

  it("o'quvchi boshqa o'quvchining yozuvini o'qiy olmaydi", async () => {
    await assertFails(getDoc(doc(asDb('student-a'), 'centers/center-a/students/other-kid')));
  });

  it("ota-ona filtrsiz barcha talabalar ro'yxatini ola olmaydi", async () => {
    await assertFails(getDocs(collection(asDb('parent-a'), 'centers/center-a/students')));
  });

  it("ota-ona o'z farzandini (childIds) o'qiy oladi, begona bolani yo'q", async () => {
    await assertSucceeds(getDoc(doc(asDb('parent-a'), 'centers/center-a/students/student-a-doc')));
    await assertFails(getDoc(doc(asDb('parent-a'), 'centers/center-a/students/other-kid')));
  });

  it("eski ota-ona hisobi (faqat childId) ham farzandini o'qiy oladi", async () => {
    await assertSucceeds(getDoc(doc(asDb('legacy-parent'), 'centers/center-a/students/student-a-doc')));
  });

  it("o'quvchi va ota-ona katalogni (faqat ismlar) o'qiy oladi", async () => {
    await assertSucceeds(getDocs(collection(asDb('student-a'), 'centers/center-a/student_directory')));
    await assertSucceeds(getDocs(collection(asDb('parent-a'), 'centers/center-a/student_directory')));
  });

  it("begona markaz katalogni o'qiy olmaydi, hech kim katalogga yoza olmaydi", async () => {
    await assertFails(getDocs(collection(asDb('director-b'), 'centers/center-a/student_directory')));
    await assertFails(setDoc(doc(asDb('director-a'), 'centers/center-a/student_directory/x'), { fullName: 'X' }));
  });

  it("xodimlar (o'qituvchi) ro'yxatni odatdagidek oladi", async () => {
    await assertSucceeds(getDocs(collection(asDb('teacher-a'), 'centers/center-a/students')));
  });
});
