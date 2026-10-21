/**
 * Bir martalik migratsiya: mavjud markazlar uchun centers/{centerId}.revenueStats
 * maydonini haqiqiy to'lovlar tarixidan hisoblab to'ldiradi.
 *
 * Nega kerak: functions/index.js dagi onPaymentWritten trigger bu maydonni
 * FAQAT YANGI to'lovlar uchun (deploy qilingandan keyingi create/update/delete)
 * yuritadi. Deploy paytida allaqachon mavjud bo'lgan tarixiy to'lovlar hisobga
 * kirmagan bo'lib qoladi — bu skript ularni bir martalik hisoblab, boshlang'ich
 * qiymatni to'g'ri o'rnatadi. Shundan keyin trigger davom ettiradi.
 *
 * MUHIM: trigger deploy qilingandan KEYIN ishga tushiring — aks holda deploy
 * paytida kirgan yangi to'lovlar backfill bilan trigger orasida "yo'qolib"
 * yoki ikki marta hisoblanib qolishi mumkin.
 *
 * Ishga tushirish (loyihaning service account kaliti bilan):
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node functions/scripts/backfillRevenueStats.js
 *
 * Yoki `firebase login` qilingan mahalliy muhitda:
 *   node functions/scripts/backfillRevenueStats.js --project=<firebase-project-id>
 */
const admin = require('firebase-admin');
const { paymentContribution } = require('../revenueStats');

const projectArg = process.argv.find((a) => a.startsWith('--project='));
const projectId = projectArg ? projectArg.split('=')[1] : undefined;

admin.initializeApp(projectId ? { projectId } : undefined);
const db = admin.firestore();

async function backfillCenter(centerDoc) {
  const centerId = centerDoc.id;
  const data = centerDoc.data();

  const paymentsSnap = await db.collection(`centers/${centerId}/payments`).get();

  let total = 0;
  const byMonth = {};
  const byMethod = {};

  paymentsSnap.forEach((doc) => {
    const { amount, month, method } = paymentContribution(doc.data());
    if (!month) return;
    total += amount;
    byMonth[month] = (byMonth[month] || 0) + amount;
    byMethod[method] = (byMethod[method] || 0) + amount;
  });

  await centerDoc.ref.update({ revenueStats: { total, byMonth, byMethod } });

  console.log(
    `✅ ${centerId} (${data.name || 'nomsiz'}): ${paymentsSnap.size} to'lov hujjati ko'rib chiqildi, ` +
    `jami daromad ${total.toLocaleString()} so'm`
  );
}

async function main() {
  const centersSnap = await db.collection('centers').get();
  console.log(`${centersSnap.size} ta markaz topildi. revenueStats backfill boshlanmoqda...\n`);

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
