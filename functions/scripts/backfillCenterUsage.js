/**
 * Bir martalik migratsiya: mavjud markazlar uchun centers/{centerId}.usage,
 * .limits va .type maydonlarini to'ldiradi.
 *
 * Nega kerak:
 *  - usage/limits: yangi firestore.rules talaba/o'qituvchi/guruh yaratishda shu
 *    maydonlarga tayanadi. Ular yo'q markazlarda rules "usage=0, limit=cheksiz"
 *    deb hisoblaydi (xavfsiz, lekin noaniq) — bu skript ularni to'g'ri qiymat
 *    bilan boshlab beradi, aks holda mavjud limitdan oshib ketgan markazlar
 *    yangi cheklovdan chetlab o'tgan bo'lib qoladi.
 *  - type: /pricing sahifasi shu maydonga qarab qaysi tariflarni ko'rsatishni
 *    tanlaydi (solo → Solo+Pro, center → Basic+Pro). Eski markazlarda bu maydon
 *    yo'q — skript uni aniq yozib qo'yadi (qarang: resolveCenterType).
 *
 * Skript IDEMPOTENT: qayta-qayta ishga tushirish xavfsiz, allaqachon to'g'ri
 * qo'yilgan `type` qiymatiga tegmaydi.
 *
 * Ishga tushirish (loyihaning service account kaliti bilan):
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node functions/scripts/backfillCenterUsage.js
 *
 * Yoki `firebase login` qilingan mahalliy muhitda:
 *   node functions/scripts/backfillCenterUsage.js --project=<firebase-project-id>
 */
const admin = require('firebase-admin');
const { resolveLimits, resolveCenterType } = require('../subscriptionLimits');

const projectArg = process.argv.find((a) => a.startsWith('--project='));
const projectId = projectArg ? projectArg.split('=')[1] : undefined;

admin.initializeApp(projectId ? { projectId } : undefined);
const db = admin.firestore();

async function countDocs(centerId, type) {
  const snap = await db.collection(`centers/${centerId}/${type}`).count().get();
  return snap.data().count;
}

// Adminlar boshqalardan farqli — centers/{centerId}/admins subkolleksiyasi
// emas, GLOBAL users kolleksiyasida (role='admin' + centerId maydoni bilan)
async function countAdmins(centerId) {
  const snap = await db.collection('users')
    .where('centerId', '==', centerId)
    .where('role', '==', 'admin')
    .count().get();
  return snap.data().count;
}

async function backfillCenter(centerDoc) {
  const centerId = centerDoc.id;
  const data = centerDoc.data();

  const [students, teachers, groups, admins] = await Promise.all([
    countDocs(centerId, 'students'),
    countDocs(centerId, 'teachers'),
    countDocs(centerId, 'groups'),
    countAdmins(centerId),
  ]);

  const limits = resolveLimits(data.subscription);
  const type = resolveCenterType(data);

  await centerDoc.ref.update({
    usage: { students, teachers, groups, admins },
    limits,
    type,
  });

  console.log(
    `✅ ${centerId} (${data.name || 'nomsiz'}, ${data.subscription || 'trial'}, ${type}): ` +
    `students ${students}/${limits.students === -1 ? '∞' : limits.students}, ` +
    `teachers ${teachers}/${limits.teachers === -1 ? '∞' : limits.teachers}, ` +
    `groups ${groups}/${limits.groups === -1 ? '∞' : limits.groups}, ` +
    `admins ${admins}/${limits.admins === -1 ? '∞' : limits.admins}` +
    (data.type ? '' : `  ← type "${type}" deb yozildi`)
  );
}

async function main() {
  const centersSnap = await db.collection('centers').get();
  console.log(`${centersSnap.size} ta markaz topildi. Backfill boshlanmoqda...\n`);

  for (const centerDoc of centersSnap.docs) {
    await backfillCenter(centerDoc);
  }

  console.log('\nTayyor.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backfill xatosi:', err);
    process.exit(1);
  });
