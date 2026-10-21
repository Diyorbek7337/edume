/**
 * 1000+ talabali markazda sahifalar aslida NECHTA Firestore hujjat o'qiyotganini
 * va bu qancha vaqt olishini o'lchaydi.
 *
 * MUHIM cheklov: bu skript faqat Firestore EMULATOR bilan ishlaydi (hech qanday
 * real loyiha yoki production ma'lumotiga tegmaydi, xavfsiz). Vaqt o'lchovlari
 * (ms) lokal, tarmoqsiz emulator muhitida olinadi — production'dagi haqiqiy
 * tarmoq kechikishini AKS ETTIRMAYDI (u yerda sezilarli sekinroq bo'ladi).
 * Lekin O'QILGAN HUJJATLAR SONI — bu skriptning asosiy va ishonchli natijasi:
 * Firestore narxi ham, tarmoq murojaatlari soni ham, real sekinlik ham
 * to'g'ridan-to'g'ri shu songa bog'liq, muhitdan qat'iy nazar.
 *
 * Ishga tushirish: npm run perf:measure
 */
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { collection, doc, setDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';

const PROJECT_ID = 'demo-edume-perf-test';
const CENTER_ID = 'perf-center';
const STUDENT_COUNT = 1200;
const TEACHER_COUNT = 14;
const GROUP_COUNT = 40;

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const writeAll = async (db, ops) => {
  for (const part of chunk(ops, 400)) {
    const batch = writeBatch(db);
    part.forEach(({ ref, data }) => batch.set(ref, data));
    await batch.commit();
  }
};

const measure = async (label, fn) => {
  const start = Date.now();
  const count = await fn();
  const ms = Date.now() - start;
  console.log(`  ${label.padEnd(48)} ${String(ms).padStart(5)}ms   ${count} hujjat`);
  return { label, ms, count };
};

async function main() {
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8005';
  const [host, portStr] = emulatorHost.split(':');
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host, port: Number(portStr) },
  });

  console.log(`\n📦 ${STUDENT_COUNT} talaba, ${TEACHER_COUNT} o'qituvchi, ${GROUP_COUNT} guruh uchun test ma'lumoti yaratilmoqda...`);
  const seedStart = Date.now();
  let paymentCount = 0;

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    await setDoc(doc(db, `centers/${CENTER_ID}`), {
      name: 'Perf Test Center', ownerUid: 'director-perf', subscription: 'pro',
      limits: { students: -1, teachers: -1, groups: -1 },
      usage: { students: STUDENT_COUNT, teachers: TEACHER_COUNT, groups: GROUP_COUNT },
    });
    await setDoc(doc(db, 'users/admin-perf'), { role: 'admin', centerId: CENTER_ID });

    const groupIds = Array.from({ length: GROUP_COUNT }, (_, i) => `group-${i}`);

    await writeAll(db, Array.from({ length: TEACHER_COUNT }, (_, i) => ({
      ref: doc(db, `centers/${CENTER_ID}/teachers/teacher-${i}`),
      data: { fullName: `O'qituvchi ${i}`, subject: 'Matematika', status: 'active' },
    })));

    await writeAll(db, groupIds.map((id, i) => ({
      ref: doc(db, `centers/${CENTER_ID}/groups/${id}`),
      data: {
        name: `Guruh ${i}`, teacherId: `teacher-${i % TEACHER_COUNT}`,
        monthlyFee: 500000, status: 'active',
        studentsCount: Math.ceil(STUDENT_COUNT / GROUP_COUNT),
      },
    })));

    await writeAll(db, Array.from({ length: STUDENT_COUNT }, (_, i) => ({
      ref: doc(db, `centers/${CENTER_ID}/students/student-${i}`),
      data: {
        fullName: `Talaba ${i}`, phone: `99890${String(1000000 + i).slice(-7)}`,
        groupId: groupIds[i % GROUP_COUNT], status: 'active', discount: 0,
      },
    })));

    // Har talaba uchun 3 oylik to'lov tarixi
    const paymentOps = [];
    for (let i = 0; i < STUDENT_COUNT; i++) {
      for (let m = 1; m <= 3; m++) {
        paymentOps.push({
          ref: doc(collection(db, `centers/${CENTER_ID}/payments`)),
          data: {
            studentId: `student-${i}`, amount: 500000, method: 'Naqd',
            paidAt: `2026-0${m}-05T00:00:00.000Z`,
          },
        });
      }
    }
    paymentCount = paymentOps.length;
    await writeAll(db, paymentOps);

    console.log(`   ✓ Yaratildi: ${STUDENT_COUNT} talaba, ${TEACHER_COUNT} o'qituvchi, ${GROUP_COUNT} guruh, ${paymentCount} to'lov`);
  });
  console.log(`   ⏱  Seed vaqti: ${Date.now() - seedStart}ms`);

  const db = testEnv.authenticatedContext('admin-perf').firestore();

  console.log('\n📊 Sahifa yuklanish naqshlari (haqiqiy getAll() so\'rovlari, real ma\'lumot hajmida):\n');

  console.log("— Dashboard.jsx mount (bir Promise.all ichida bir nechta getAll):");
  await measure('studentsAPI.getAll()', async () => (await getDocs(collection(db, `centers/${CENTER_ID}/students`))).size);
  await measure('teachersAPI.getAll()', async () => (await getDocs(collection(db, `centers/${CENTER_ID}/teachers`))).size);
  await measure('groupsAPI.getAll()', async () => (await getDocs(collection(db, `centers/${CENTER_ID}/groups`))).size);

  console.log("\n— Payments.jsx / Reports.jsx / PDFReports.jsx (paymentsAPI.getAll — TO'LIQ tarix):");
  await measure("paymentsAPI.getAll() — 3 oylik tarix", async () => (await getDocs(collection(db, `centers/${CENTER_ID}/payments`))).size);

  console.log("\n— Taqqoslash: sana bo'yicha CHEKLANGAN so'rov (Dashboard.jsx dagi getSince naqshi):");
  await measure("paymentsAPI.getSince('2026-03-01')", async () => {
    const q = query(collection(db, `centers/${CENTER_ID}/payments`), where('paidAt', '>=', '2026-03-01'));
    return (await getDocs(q)).size;
  });

  console.log('\n💡 Xulosa: getAll() hujjat soni ma\'lumot bazasi bilan CHIZIQLI o\'sadi.');
  console.log(`   1200 talaba, atigi 3 oylik to'lov tarixida allaqachon ${paymentCount} hujjat bitta`);
  console.log("   so'rovda yuklanadi (sana filtri bo'lmagani uchun). 2-3 yillik ish tarixida bu");
  console.log('   10,000+ hujjatga yetadi — sahifa ochilishi sezilarli sekinlashadi va Firestore');
  console.log("   o'qish xarajati ortadi. getSince() namunasidagi kabi sana chegarasi qo'yish —");
  console.log('   eng arzon va tezkor yechim.\n');

  await testEnv.cleanup();
  process.exit(0);
}

main().catch((err) => {
  console.error('Xato:', err);
  process.exit(1);
});
