const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentWritten, onDocumentCreated, onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const { resolveLimits } = require('./subscriptionLimits');
const { computeRevenueDeltas } = require('./revenueStats');
const linking = require('./studentLinking');

admin.initializeApp();
const db = admin.firestore();

const CENTER_ID = process.env.CENTER_ID;
const LEAD_NOTIFY_CHAT_ID = process.env.LEAD_NOTIFY_CHAT_ID;
const SITE_BOT_TOKEN = process.env.SITE_BOT_TOKEN;

const SOURCE_LABELS = {
  landing: 'Sayt (proteach.uz)',
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function setCors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

// expireAt — Firestore TTL siyosati orqali eski hujjatlar avtomatik o'chiriladi.
// TTL ni bir marta yoqish kerak:
//   gcloud firestore fields ttls update expireAt --collection-group=rate_limits --enable-ttl
async function checkRateLimit(ip) {
  const docId = String(ip).replace(/[^a-zA-Z0-9_-]/g, '_') || 'unknown';
  const ref = db.collection('rate_limits').doc(docId);
  const now = Date.now();
  const expireAt = admin.firestore.Timestamp.fromMillis(now + 24 * 60 * 60 * 1000);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();

    if (!data || now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
      tx.set(ref, { windowStart: now, count: 1, expireAt });
      return true;
    }

    if (data.count >= RATE_LIMIT_MAX) {
      return false;
    }

    tx.update(ref, { count: data.count + 1, expireAt });
    return true;
  });
}

async function notifyTelegram(lead) {
  if (!LEAD_NOTIFY_CHAT_ID || !SITE_BOT_TOKEN) return;

  const token = SITE_BOT_TOKEN;

  const text =
    `🆕 <b>Yangi ariza — sayt</b>\n\n` +
    `👤 Ism: ${lead.fullName}\n` +
    `📞 Telefon: ${lead.phone}` +
    (lead.subject ? `\n📚 Kurs: ${lead.subject}` : '') +
    (lead.note ? `\n💬 Izoh: ${lead.note}` : '');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: LEAD_NOTIFY_CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    logger.error('Telegram notify failed', { status: res.status, body });
  }
}

exports.createPublicLead = onRequest(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const { fullName, phone, subject, note, source, company } = req.body || {};

  if (company) {
    res.status(200).json({ ok: true, id: 'ok' });
    return;
  }

  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const withinLimit = await checkRateLimit(ip);
  if (!withinLimit) {
    res.status(429).json({ ok: false, error: "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring." });
    return;
  }

  if (typeof fullName !== 'string' || !fullName.trim() || fullName.length > 200) {
    res.status(400).json({ ok: false, error: "Ism kiritilishi shart" });
    return;
  }
  if (typeof phone !== 'string' || !phone.trim() || phone.length > 30) {
    res.status(400).json({ ok: false, error: 'Telefon raqam kiritilishi shart' });
    return;
  }

  const lead = {
    fullName: fullName.trim(),
    phone: phone.trim(),
    subject: typeof subject === 'string' ? subject.trim().slice(0, 200) : '',
    note: typeof note === 'string' ? note.trim().slice(0, 1000) : '',
    source: SOURCE_LABELS[source] ? source : 'landing',
    status: 'new',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    const docRef = await db.collection(`centers/${CENTER_ID}/leads`).add(lead);

    notifyTelegram(lead).catch((err) => logger.error('notifyTelegram error', err));

    res.status(200).json({ ok: true, id: docRef.id });
  } catch (err) {
    logger.error('createPublicLead error', err);
    res.status(500).json({ ok: false, error: 'Server xatosi, keyinroq urinib ko\'ring' });
  }
});

// ==================== SUBSCRIPTION LIMIT ENFORCEMENT ====================
//
// Firestore xavfsizlik qoidalari hujjatlarni sanay olmaydi, shuning uchun har bir
// markazning joriy talaba/o'qituvchi/guruh soni (`usage`) va tarifga mos limiti
// (`limits`) centers/{centerId} hujjatida saqlanadi va shu triggerlar orqali
// avtomatik yangilanadi. firestore.rules shu maydonlarga qarab `create`ni bloklaydi
// — mijoz (browser) hech qachon bu hisoblagichlarni to'g'ridan-to'g'ri o'zgartira olmaydi.

// subscription o'zgarganda (yoki markaz yaratilganda) limits maydonini sinxronlaydi.
exports.syncCenterLimits = onDocumentWritten('centers/{centerId}', async (event) => {
  const after = event.data?.after;
  if (!after?.exists) return;

  const data = after.data();
  const resolved = resolveLimits(data.subscription);
  const current = data.limits;

  const alreadyInSync =
    current &&
    current.students === resolved.students &&
    current.teachers === resolved.teachers &&
    current.groups === resolved.groups &&
    current.admins === resolved.admins;
  if (alreadyInSync) return; // cheksiz loop bo'lmasligi uchun

  await after.ref.update({ limits: resolved });
});

// Har bir sanaladigan subkolleksiya uchun create/delete triggerlarini yaratadi.
function registerUsageCounters(type) {
  const path = `centers/{centerId}/${type}/{docId}`;
  const suffix = type.charAt(0).toUpperCase() + type.slice(1);

  exports[`on${suffix}Created`] = onDocumentCreated(path, async (event) => {
    const { centerId } = event.params;
    await db.doc(`centers/${centerId}`).update({
      [`usage.${type}`]: admin.firestore.FieldValue.increment(1),
    }).catch((err) => logger.error(`usage increment failed (${type})`, { centerId, err }));
  });

  exports[`on${suffix}Deleted`] = onDocumentDeleted(path, async (event) => {
    const { centerId } = event.params;
    await db.doc(`centers/${centerId}`).update({
      [`usage.${type}`]: admin.firestore.FieldValue.increment(-1),
    }).catch((err) => logger.error(`usage decrement failed (${type})`, { centerId, err }));
  });
}

['students', 'teachers', 'groups'].forEach(registerUsageCounters);

// Adminlar boshqalardan farqli — ular centers/{centerId}/admins kabi
// subkolleksiyada emas, GLOBAL users/{uid} hujjatida (role='admin' + centerId
// maydoni) saqlanadi. Shuning uchun alohida trigger: yaratilish/o'chirilishdan
// tashqari, mavjud foydalanuvchining ROLI 'admin'ga o'zgarishi (yoki undan
// chiqishi) ham hisobga olinishi kerak — shuning uchun onDocumentWritten.
exports.onUserWritten = onDocumentWritten('users/{uid}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  if (!before && !after) return;

  const wasAdmin = before?.role === 'admin';
  const isAdminNow = after?.role === 'admin';
  if (wasAdmin === isAdminNow && before?.centerId === after?.centerId) return; // hech narsa o'zgarmagan

  const deltas = {};
  if (wasAdmin && before.centerId) deltas[before.centerId] = (deltas[before.centerId] || 0) - 1;
  if (isAdminNow && after.centerId) deltas[after.centerId] = (deltas[after.centerId] || 0) + 1;

  await Promise.all(Object.entries(deltas).map(([centerId, delta]) =>
    db.doc(`centers/${centerId}`).update({
      'usage.admins': admin.firestore.FieldValue.increment(delta),
    }).catch((err) => logger.error('admins usage update failed', { centerId, err }))
  ));
});

// ==================== TARIF ARIZALARI ====================
//
// Direktor /pricing sahifasida tarif tanlaganda subscription_requests'ga yozuv
// tushadi. To'lov tizimi yo'q — ariza Telegram orqali keladi, tarif SuperAdmin
// tomonidan qo'lda faollashtiriladi.
exports.onSubscriptionRequest = onDocumentCreated('subscription_requests/{docId}', async (event) => {
  const data = event.data?.data();
  if (!data) return;

  if (!LEAD_NOTIFY_CHAT_ID || !SITE_BOT_TOKEN) {
    logger.warn('subscription request notify skipped — bot sozlanmagan', { docId: event.params.docId });
    return;
  }

  const text =
    `💳 <b>Yangi tarif arizasi</b>\n\n` +
    `🏢 Markaz: ${data.centerName || data.centerId}\n` +
    `📦 Tarif: <b>${data.plan}</b>\n` +
    (data.contactName ? `👤 Ism: ${data.contactName}\n` : '') +
    `📞 Telefon: ${data.contactPhone || '—'}\n` +
    (data.note ? `💬 Izoh: ${data.note}\n` : '') +
    `\n🆔 <code>${data.centerId}</code>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${SITE_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: LEAD_NOTIFY_CHAT_ID, text, parse_mode: 'HTML' }),
    });
    if (!res.ok) {
      logger.error('subscription request Telegram notify failed', {
        status: res.status,
        body: await res.text(),
      });
    }
  } catch (err) {
    logger.error('subscription request notify error', err);
  }
});

// ==================== DAROMAD STATISTIKASI (denormalized) ====================
//
// Reports.jsx sahifasi "jami daromad", oxirgi 6 oylik trend va to'lov usuli
// taqsimotini ko'rsatish uchun ILGARI markazning BUTUN to'lovlar tarixini
// (paymentsAPI.getAll()) o'qirdi — yillar davomida bu minglab hujjat degani.
// Endi bu raqamlar centers/{centerId}.revenueStats maydonida oldindan
// hisoblangan holda saqlanadi va har bir to'lov yaratilganda/o'zgartirilganda/
// o'chirilganda shu trigger orqali avtomatik yangilanadi (increment() bilan,
// atomik) — Reports.jsx endi BITTA hujjat o'qish bilan kifoyalanadi.
//
// Delta-hisoblash mantig'i (create/update/delete/oy-usul almashishi) —
// revenueStats.js da, alohida sof funksiya sifatida (emulatorsiz testlangan:
// src/__tests__/revenueStats.test.js).
exports.onPaymentWritten = onDocumentWritten('centers/{centerId}/payments/{paymentId}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  if (!before && !after) return;

  const deltas = computeRevenueDeltas(before, after);
  const entries = Object.entries(deltas);
  if (entries.length === 0) return; // masalan status hech qachon 'paid' bo'lmagan

  const { centerId } = event.params;
  const updateData = {};
  entries.forEach(([path, amount]) => {
    updateData[path] = admin.firestore.FieldValue.increment(amount);
  });

  await db.doc(`centers/${centerId}`).update(updateData)
    .catch((err) => logger.error('revenueStats update failed', { centerId, err }));
});

// ==================== O'QUVCHI MA'LUMOTLARI MAXFIYLIGI ====================
//
// O'quvchi va ota-ona endi `students` kolleksiyasini ro'yxat qilib o'qiy olmaydi
// (firestore.rules). Ular:
//   - o'z yozuvini   → students.userId == uid (o'quvchi) / users.childIds (ota-ona)
//   - sinfdoshlarni  → centers/{c}/student_directory (faqat ism, guruh, holat)
// orqali oladi. Quyidagi triggerlar shu ikkisini avtomatik to'g'ri holatda
// ushlab turadi. Mavjud ma'lumotlar uchun bir martalik:
//   node functions/scripts/backfillStudentPrivacy.js --project=<id>
//
// Triggerlar faqat ARZON (tenglik bo'yicha) so'rovlar ishlatadi; telefonni
// "oxirgi 9 raqam" bo'yicha taxminiy moslashtirish faqat backfill skriptida.

exports.onStudentWrittenPrivacy = onDocumentWritten('centers/{centerId}/students/{studentId}', async (event) => {
  const { centerId, studentId } = event.params;
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  const dirRef = db.doc(`centers/${centerId}/student_directory/${studentId}`);

  // 1) Katalog (student_directory) — faqat xavfsiz maydonlar
  try {
    if (!after) {
      await dirRef.delete();
      return;
    }
    if (linking.directoryChanged(before, after)) {
      await dirRef.set(linking.directoryEntry(after));
    }
  } catch (err) {
    logger.error('student_directory sync failed', { centerId, studentId, err });
  }

  // 2) O'quvchi hisobini bog'lash (students.userId) — yangi yozuv yoki email/telefon o'zgarganda
  const contactChanged = !before || before.email !== after.email || before.phone !== after.phone;
  if (!after.userId && contactChanged) {
    try {
      let candidates = [];
      if (after.email) {
        const snap = await db.collection('users')
          .where('centerId', '==', centerId).where('email', '==', after.email).limit(2).get();
        candidates = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((u) => u.role === 'student');
      }
      if (candidates.length === 0 && after.phone) {
        const snap = await db.collection('users')
          .where('centerId', '==', centerId).where('phone', '==', after.phone).limit(2).get();
        candidates = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((u) => u.role === 'student');
      }
      if (candidates.length === 1) {
        const uid = candidates[0].id;
        // Bu hisob allaqachon boshqa talaba yozuviga bog'langan bo'lsa — tegmaymiz
        const taken = await db.collection(`centers/${centerId}/students`).where('userId', '==', uid).limit(1).get();
        if (taken.empty) await event.data.after.ref.update({ userId: uid });
      }
    } catch (err) {
      logger.error('student userId link failed', { centerId, studentId, err });
    }
  }

  // 3) Ota-onani bog'lash (users.childIds) — parentPhone yangi yoki o'zgarganda
  if (after.parentPhone && (!before || before.parentPhone !== after.parentPhone)) {
    try {
      const snap = await db.collection('users')
        .where('centerId', '==', centerId).where('phone', '==', after.parentPhone).get();
      await Promise.all(snap.docs
        .filter((d) => d.data().role === 'parent')
        .filter((d) => !linking.existingChildIds(d.data()).includes(studentId))
        .map((d) => d.ref.update({
          childIds: admin.firestore.FieldValue.arrayUnion(studentId),
          ...(d.data().childId ? {} : { childId: studentId }),
        })));
    } catch (err) {
      logger.error('parent childIds link failed', { centerId, studentId, err });
    }
  }
});

// Yangi o'quvchi/ota-ona hisobi yaratilganda — mavjud talaba yozuviga bog'lash
exports.onUserCreatedLink = onDocumentCreated('users/{uid}', async (event) => {
  const user = event.data?.data();
  const { uid } = event.params;
  if (!user?.centerId) return;
  const students = db.collection(`centers/${user.centerId}/students`);

  try {
    if (user.role === 'student') {
      const already = await students.where('userId', '==', uid).limit(1).get();
      if (!already.empty) return;
      let docs = [];
      if (user.email) docs = (await students.where('email', '==', user.email).limit(2).get()).docs;
      if (docs.length === 0 && user.phone) docs = (await students.where('phone', '==', user.phone).limit(2).get()).docs;
      const free = docs.filter((d) => !d.data().userId);
      if (free.length === 1) await free[0].ref.update({ userId: uid });
    } else if (user.role === 'parent' && user.phone && linking.existingChildIds(user).length === 0) {
      const snap = await students.where('parentPhone', '==', user.phone).get();
      const ids = snap.docs.map((d) => d.id);
      if (ids.length > 0) await event.data.ref.update({ childIds: ids, childId: ids[0] });
    }
  } catch (err) {
    logger.error('user link on create failed', { uid, err });
  }
});
