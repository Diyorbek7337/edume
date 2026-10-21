/**
 * Obuna holati hisoboti — yangi firestore.rules (faqat-o'qish rejimi) DEPLOY
 * QILISHDAN OLDIN ishga tushiring.
 *
 * Nega kerak: yangi qoidalar bilan sinov muddati (trialEndsAt) 3 kundan ko'proq
 * oldin tugagan markazlar DARHOL faqat-o'qish rejimiga o'tadi. Ilgari muddat
 * hech narsani bloklamagani uchun, hozir sinov muddati allaqachon tugagan,
 * lekin haqiqatda ishlab turgan markazlar bo'lishi mumkin. Bu skript ularni
 * ro'yxat qiladi — deploy'dan oldin ular bilan gaplashib, yoki tarif berib,
 * yoki sinovni uzaytirib olasiz.
 *
 * Standart holatda FAQAT O'QIYDI, hech narsa yozmaydi:
 *   node functions/scripts/subscriptionReport.js --project=<firebase-project-id>
 *
 * Muddati tugagan barcha SINOV markazlariga bugundan +N kun berish (ixtiyoriy):
 *   node functions/scripts/subscriptionReport.js --project=<id> --extend-expired-trials=7
 */
const admin = require('firebase-admin');

const arg = (name) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=')[1] : undefined;
};

const projectId = arg('project');
const extendDays = parseInt(arg('extend-expired-trials'), 10) || 0;

admin.initializeApp(projectId ? { projectId } : undefined);
const db = admin.firestore();

const GRACE_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);

function accessOf(c, now) {
  if (c.status === 'suspended') return { state: 'suspended', endsAt: null };
  const sub = c.subscription || 'trial';
  const endsAt = toDate(sub === 'trial' ? c.trialEndsAt : c.paidUntil);
  if (!endsAt || Number.isNaN(endsAt.getTime())) return { state: sub === 'trial' ? 'active' : 'no-expiry', endsAt: null };
  if (now < endsAt) return { state: 'active', endsAt };
  if (now < new Date(endsAt.getTime() + GRACE_DAYS * DAY_MS)) return { state: 'grace', endsAt };
  return { state: 'expired', endsAt };
}

async function main() {
  const now = new Date();
  const snap = await db.collection('centers').get();
  const rows = [];

  for (const d of snap.docs) {
    const c = d.data();
    const a = accessOf(c, now);
    rows.push({
      id: d.id,
      name: c.name || '—',
      plan: c.subscription || 'trial',
      state: a.state,
      endsAt: a.endsAt ? a.endsAt.toISOString().slice(0, 10) : '—',
      students: c.usage?.students ?? '?',
    });
  }

  const order = { expired: 0, suspended: 1, grace: 2, 'no-expiry': 3, active: 4 };
  rows.sort((x, y) => order[x.state] - order[y.state]);
  console.table(rows);

  const expiredTrials = rows.filter((r) => r.state === 'expired' && r.plan === 'trial');
  const noExpiryPaid = rows.filter((r) => r.state === 'no-expiry');
  console.log(`\nJami: ${rows.length} markaz`);
  console.log(`Deploy'dan keyin DARHOL faqat-o'qish: ${rows.filter((r) => r.state === 'expired' || r.state === 'suspended').length}`);
  console.log(`  shundan muddati o'tgan sinov: ${expiredTrials.length}`);
  console.log(`Pullik, lekin paidUntil yo'q (muddatsiz ishlaydi — SuperAdmin'da "+30 kun" bosing): ${noExpiryPaid.length}`);

  if (extendDays > 0 && expiredTrials.length > 0) {
    const newEnd = new Date(now.getTime() + extendDays * DAY_MS);
    for (const r of expiredTrials) {
      await db.doc(`centers/${r.id}`).update({ trialEndsAt: newEnd, updatedAt: now });
      console.log(`  ✓ ${r.name} (${r.id}) — sinov ${newEnd.toISOString().slice(0, 10)} gacha uzaytirildi`);
    }
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
