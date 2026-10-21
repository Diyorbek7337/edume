/**
 * To'lov summasi yozilishining ATOMIKLIGINI tekshiradi (real Firestore emulator ustida).
 *
 * Fon: Payments.jsx dagi handlePayment ilgari monthly_bills.paidAmount/remainingAmount'ni
 * mahalliy state'dan hisoblangan ABSOLYUT son bilan updateDoc qilardi. Ikki admin bir
 * vaqtda (masalan ikki brauzer tabida) shu bitta billga to'lov kiritsa, "oxirgi yozuvchi
 * g'olib" bo'lib, birinchi to'lov Firestore'da butunlay yo'qolib qolardi.
 *
 * Tuzatish: src/services/api.js dagi paymentsAPI.applyBillPayment endi Firestore'ning
 * increment()/arrayUnion() FieldValue sentinellaridan foydalanadi — bular serverda
 * atomik bajariladi, klient tomonidagi eski qiymatga bog'liq emas.
 *
 * Bu test aynan shu increment()/arrayUnion() naqshini haqiqiy emulatorda, haqiqatan
 * bir vaqtda (Promise.all) yuborilgan ikkita yozuv bilan tekshiradi.
 *
 * Ishga tushirish: npm run test:rules
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import {
  doc, getDoc, getDocs, collection, setDoc, updateDoc,
  increment, arrayUnion, runTransaction, serverTimestamp,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-edume-payment-test';
const BILL_PATH = 'centers/center-a/monthly_bills/bill-concurrent';

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

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'centers/center-a'), {
      name: 'Center A', ownerUid: 'director-a', subscription: 'basic',
      limits: { students: 100, teachers: 10, groups: 20 },
      usage: { students: 0, teachers: 0, groups: 0 },
    });
    await setDoc(doc(db, 'users/admin-a'), { role: 'admin', centerId: 'center-a' });
    await setDoc(doc(db, BILL_PATH), {
      studentId: 'student-a',
      totalAmount: 500000,
      paidAmount: 0,
      remainingAmount: 500000,
      status: 'pending',
      payments: [],
    });
  });
});

describe("To'lov summasi — bir vaqtdagi (concurrent) yozuvlar", () => {
  it("ikkita parallel to'lov increment() bilan ikkalasi ham yo'qolmasdan hisoblanadi", async () => {
    const db = testEnv.authenticatedContext('admin-a').firestore();
    const billRef = doc(db, BILL_PATH);

    // Ikki "admin" bir vaqtda (haqiqatan parallel, Promise.all) turli summa bilan
    // to'lov kiritadi — xuddi ikki brauzer tabida bo'lgani kabi.
    await Promise.all([
      updateDoc(billRef, {
        paidAmount: increment(200000),
        remainingAmount: increment(-200000),
        payments: arrayUnion({ amount: 200000, paidBy: 'admin-a-session-1' }),
      }),
      updateDoc(billRef, {
        paidAmount: increment(150000),
        remainingAmount: increment(-150000),
        payments: arrayUnion({ amount: 150000, paidBy: 'admin-a-session-2' }),
      }),
    ]);

    const snap = await getDoc(billRef);
    const data = snap.data();

    // Eski (absolyut yozuv) kodda bu ikkisidan biri boshqasini "yutib" yuborar edi
    expect(data.paidAmount).toBe(350000);
    expect(data.remainingAmount).toBe(150000);
    expect(data.payments).toHaveLength(2);
  });

  it("eskicha absolyut yozuv (regressiya namoyishi) haqiqatan ma'lumot yo'qotadi", async () => {
    // Bu test ATAYLAB eski, xato naqshni takrorlaydi — increment() ZARURATINI isbotlash uchun.
    const db = testEnv.authenticatedContext('admin-a').firestore();
    const billRef = doc(db, BILL_PATH);

    // Ikkala "admin" ham BIR XIL boshlang'ich holatni (paidAmount: 0) o'qigan deb faraz
    // qilinadi, so'ng har biri o'z hisobiga ko'ra ABSOLYUT yangi qiymat yozadi —
    // aynan Payments.jsx dagi eski kod qilgani kabi.
    await Promise.all([
      updateDoc(billRef, { paidAmount: 200000, remainingAmount: 300000 }),
      updateDoc(billRef, { paidAmount: 150000, remainingAmount: 350000 }),
    ]);

    const snap = await getDoc(billRef);
    const data = snap.data();

    // To'g'ri natija 350000 bo'lishi kerak edi — lekin absolyut yozuvda
    // faqat bitta yozuvchining qiymati qoladi (350000 EMAS).
    expect(data.paidAmount).not.toBe(350000);
  });
});

describe("Yangi (virtual) hisob-kitob yaratish — dublikat oldini olish", () => {
  // Bu blok paymentsAPI.applyPeriodPayment (services/api.js) bilan BIR XIL
  // naqshni (deterministik ID + runTransaction, get-or-create) takrorlaydi —
  // to'g'ridan-to'g'ri api.js'ni import qilmaydi, chunki u browser-only
  // Firebase Auth persistence'ga bog'liq va Node test muhitida ishlamaydi.
  // Maqsad — mexanizmning o'zini (Firestore transaction orqali "check-then-create"
  // poyga holatini yo'qotish) haqiqiy emulatorda tasdiqlash.
  const applyPeriodPayment = (db, billRef, studentId, paymentAmount, paidBy) =>
    runTransaction(db, async (tx) => {
      const snap = await tx.get(billRef);

      if (!snap.exists()) {
        const totalAmount = 500000;
        tx.set(billRef, {
          studentId,
          totalAmount,
          paidAmount: paymentAmount,
          remainingAmount: totalAmount - paymentAmount,
          status: 'partial',
          payments: [{ amount: paymentAmount, paidBy }],
          createdAt: serverTimestamp(),
        });
        return;
      }

      const existing = snap.data();
      const newPaidAmount = (existing.paidAmount || 0) + paymentAmount;
      tx.update(billRef, {
        paidAmount: newPaidAmount,
        remainingAmount: Math.max(0, existing.totalAmount - newPaidAmount),
        payments: [...(existing.payments || []), { amount: paymentAmount, paidBy }],
      });
    });

  it("ikkita parallel \"birinchi to'lov\" bitta hujjat yaratadi, IKKITASI EMAS", async () => {
    const db = testEnv.authenticatedContext('admin-a').firestore();
    const billRef = doc(db, 'centers/center-a/monthly_bills/student-a_2026-08-01');

    // Ikkalasi ham "hujjat hali yo'q" holatidan boshlanadi va bir vaqtda yozadi —
    // eski (addDoc bilan) kodda bu ikkita alohida hujjat yaratardi.
    await Promise.all([
      applyPeriodPayment(db, billRef, 'student-a', 200000, 'admin-a-session-1'),
      applyPeriodPayment(db, billRef, 'student-a', 150000, 'admin-a-session-2'),
    ]);

    const allBills = await getDocs(collection(db, 'centers/center-a/monthly_bills'));
    // Fixture'da 'bill-concurrent' allaqachon bor edi (beforeEach) — jami 2 bo'lishi kerak,
    // lekin YANGI davr uchun faqat BITTA hujjat (dublikat yo'q)
    const newPeriodDocs = allBills.docs.filter(d => d.id === 'student-a_2026-08-01');
    expect(newPeriodDocs).toHaveLength(1);

    const data = newPeriodDocs[0].data();
    expect(data.paidAmount).toBe(350000);
    expect(data.payments).toHaveLength(2);
  });
});
