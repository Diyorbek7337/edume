/**
 * Bir martalik migratsiya — o'quvchi ma'lumotlari maxfiyligi.
 *
 * YANGI firestore.rules'ni deploy qilishdan OLDIN ishga tushiring (functions
 * deploy qilingandan keyin — yangi yozuvlarni triggerlar o'zi bog'laydi).
 *
 * Nima qiladi (har bir markaz uchun):
 *   1. centers/{c}/student_directory — har bir talaba uchun faqat ism, guruh,
 *      holat (sinfdoshlar ro'yxati uchun; telefon va boshqa ma'lumotlarsiz)
 *   2. students.userId — o'quvchi hisobi (users, role=student) bilan bog'lanmagan
 *      talabalarni email yoki telefon (oxirgi 9 raqam) bo'yicha bog'laydi
 *   3. users.childIds — farzandi bog'lanmagan ota-onalarni talabaning
 *      parentPhone maydoni bo'yicha bog'laydi (mavjud childIds'ga qo'shadi)
 *
 * Aniq bitta nomzod topilmasa — BOG'LAMAYDI (xato bog'lashdan ko'ra yaxshiroq)
 * va hisobotda ko'rsatadi: ularni Students sahifasida qo'lda to'g'rilang.
 *
 * IDEMPOTENT — qayta ishga tushirish xavfsiz.
 *
 *   node functions/scripts/backfillStudentPrivacy.js --project=<id> --dry-run   # faqat hisobot
 *   node functions/scripts/backfillStudentPrivacy.js --project=<id>             # yozadi
 */
const admin = require('firebase-admin');
const linking = require('../studentLinking');

const projectArg = process.argv.find((a) => a.startsWith('--project='));
const projectId = projectArg ? projectArg.split('=')[1] : undefined;
const DRY = process.argv.includes('--dry-run');

admin.initializeApp(projectId ? { projectId } : undefined);
const db = admin.firestore();

async function commitInChunks(ops) {
  for (let i = 0; i < ops.length; i += 400) {
    const batch = db.batch();
    ops.slice(i, i + 400).forEach((fn) => fn(batch));
    if (!DRY) await batch.commit();
  }
}

async function processCenter(centerDoc) {
  const centerId = centerDoc.id;
  const [studentsSnap, usersSnap] = await Promise.all([
    db.collection(`centers/${centerId}/students`).get(),
    db.collection('users').where('centerId', '==', centerId).get(),
  ]);
  const students = studentsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const studentUsers = users.filter((u) => u.role === 'student');
  const parents = users.filter((u) => u.role === 'parent');

  const ops = [];
  const report = { directory: students.length, linkedStudents: 0, linkedParents: 0, unlinkedStudentUsers: [], parentsWithoutChildren: [] };

  // 1) Katalog
  students.forEach((s) => {
    const ref = db.doc(`centers/${centerId}/student_directory/${s.id}`);
    ops.push((b) => b.set(ref, linking.directoryEntry(s)));
  });

  // 2) O'quvchi hisoblari → students.userId
  const linkedUserIds = new Set(students.filter((s) => s.userId).map((s) => s.userId));
  const working = students.map((s) => ({ ...s }));
  studentUsers.filter((u) => !linkedUserIds.has(u.id)).forEach((u) => {
    const match = linking.findStudentForUser(u, working);
    if (match) {
      match.userId = u.id;
      report.linkedStudents++;
      ops.push((b) => b.update(db.doc(`centers/${centerId}/students/${match.id}`), { userId: u.id }));
    } else {
      report.unlinkedStudentUsers.push(`${u.fullName || '—'} (${u.phone || u.email || u.id})`);
    }
  });

  // 3) Ota-onalar → users.childIds
  parents.forEach((p) => {
    const current = linking.existingChildIds(p);
    const found = linking.findChildrenForParent(p, students);
    const merged = [...new Set([...current, ...found])];
    if (merged.length > current.length) {
      report.linkedParents++;
      ops.push((b) => b.update(db.doc(`users/${p.id}`), { childIds: merged, childId: merged[0] }));
    }
    if (merged.length === 0) report.parentsWithoutChildren.push(`${p.fullName || '—'} (${p.phone || p.id})`);
  });

  await commitInChunks(ops);
  return report;
}

async function main() {
  console.log(DRY ? "=== DRY RUN — hech narsa yozilmaydi ===\n" : "=== Yozish rejimi ===\n");
  const centers = await db.collection('centers').get();
  for (const c of centers.docs) {
    const r = await processCenter(c);
    console.log(`▶ ${c.data().name || c.id} (${c.id})`);
    console.log(`   katalog: ${r.directory} ta, bog'langan o'quvchi: ${r.linkedStudents}, bog'langan ota-ona: ${r.linkedParents}`);
    if (r.unlinkedStudentUsers.length) {
      console.log(`   ⚠ talaba yozuvi topilmagan o'quvchi hisoblari (${r.unlinkedStudentUsers.length}):`);
      r.unlinkedStudentUsers.forEach((x) => console.log(`      - ${x}`));
    }
    if (r.parentsWithoutChildren.length) {
      console.log(`   ⚠ farzandi topilmagan ota-onalar (${r.parentsWithoutChildren.length}):`);
      r.parentsWithoutChildren.forEach((x) => console.log(`      - ${x}`));
    }
  }
  console.log("\n⚠ ro'yxatidagilar yangi qoidalardan keyin o'z ma'lumotlarini ko'rmaydi — Students sahifasida telefon/ota-ona telefonini to'g'rilang (trigger o'zi bog'laydi).");
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
