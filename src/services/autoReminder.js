/**
 * Auto Payment Reminder Service
 *
 * Determines which students need a payment reminder today and sends them.
 * Works without a server — triggered when admin opens the Payments page.
 *
 * Reminder is sent if ALL of the following are true:
 *   1. Student is active and not free
 *   2. Student has an unpaid/partial bill (current month or overdue)
 *   3. Today >= student.paymentDay - reminderDays  (within reminder window)
 *   4. lastReminderSent is NOT today (no duplicate reminders)
 */

import { sendTelegramMessage, buildPaymentReminderText } from './telegram';
import { messagesAPI, studentsAPI } from './api';

// ==================== PURE HELPERS ====================

const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Returns true if the student should receive a reminder today.
 */
export const shouldRemind = (student, monthlyBills, settings) => {
  if (student.isFree) return false;
  if (student.status !== 'active') return false;

  // Already reminded today?
  if (student.lastReminderSent) {
    const last = new Date(student.lastReminderSent);
    if (last.toDateString() === new Date().toDateString()) return false;
  }

  // Within reminder window?
  const paymentDay    = parseInt(student.paymentDay) || 1;
  const reminderDays  = parseInt(settings?.paymentReminderDays) || 3;
  const todayDate     = new Date().getDate();
  if (todayDate < paymentDay - reminderDays) return false;

  // Has any unpaid debt (current month or older)?
  const cm = currentMonthKey();
  const hasDebt = monthlyBills.some(
    b =>
      b.studentId === student.id &&
      b.month <= cm &&
      (b.status === 'pending' || b.status === 'partial') &&
      (b.remainingAmount || 0) > 0
  );

  return hasDebt;
};

/**
 * Calculate total debt for one student.
 */
export const calcDebt = (studentId, monthlyBills) => {
  const cm = currentMonthKey();
  return monthlyBills
    .filter(b => b.studentId === studentId && b.month <= cm)
    .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
};

/**
 * Filter the full student list to those who need reminders today.
 * Returns enriched objects: { ...student, debt }
 */
export const getPendingReminders = (students, monthlyBills, settings) =>
  students
    .filter(s => shouldRemind(s, monthlyBills, settings))
    .map(s => ({ ...s, debt: calcDebt(s.id, monthlyBills) }))
    .sort((a, b) => b.debt - a.debt); // highest debt first

// ==================== SENDER ====================

/**
 * Send a reminder to a single student.
 * Returns { telegram: bool, message: bool }
 */
export const sendReminderToStudent = async (student, settings, senderInfo) => {
  const result = { telegram: false, message: false };

  const messageText =
    `Hurmatli ${student.parentName || student.fullName}!\n\n` +
    `${student.fullName} ning to'lov muddati yaqinlashdi yoki o'tib ketdi.\n\n` +
    `💰 Qarz: ${Number(student.debt).toLocaleString()} so'm\n` +
    `📅 To'lov kuni: har oyning ${student.paymentDay || 1}-kuni\n\n` +
    `Iltimos, to'lovni amalga oshiring.\n\n` +
    `Hurmat bilan, ${settings?.centerName || "O'quv markazi"}`;

  // 1. In-app message (always)
  try {
    await messagesAPI.create({
      title: "💰 To'lov eslatmasi",
      content: messageText,
      type: 'payment_reminder',
      priority: 'high',
      recipientType: 'student',
      recipientId: student.id,
      recipientIds: [student.id],
      senderId: senderInfo?.id,
      senderName: senderInfo?.fullName,
      studentId: student.id,
      studentName: student.fullName,
      debt: student.debt,
      read: false,
      autoSent: true,
    });
    result.message = true;
  } catch (err) {
    console.warn('In-app message error:', err);
  }

  // 2. Telegram (if connected)
  const token  = settings?.telegramBotToken;
  const chatId = student.parentTelegramChatId;
  if (token && chatId) {
    try {
      const tgText = buildPaymentReminderText({
        studentName: student.fullName,
        debt: student.debt,
        centerName: settings?.centerName,
      });
      await sendTelegramMessage(token, chatId, tgText);
      result.telegram = true;
    } catch (err) {
      console.warn('Telegram send error:', err);
    }
  }

  // 3. Mark reminder sent
  try {
    await studentsAPI.update(student.id, {
      lastReminderSent: new Date().toISOString(),
      reminderCount: (student.reminderCount || 0) + 1,
    });
  } catch (err) {
    console.warn('Update lastReminderSent error:', err);
  }

  return result;
};

/**
 * Send reminders to ALL pending students.
 * Calls onProgress(sent, total) after each one.
 *
 * @returns {{ sent: number, telegram: number, failed: number }}
 */
export const sendAllReminders = async (pendingStudents, settings, senderInfo, onProgress) => {
  let sent = 0, telegram = 0, failed = 0;
  const total = pendingStudents.length;

  for (const student of pendingStudents) {
    try {
      const res = await sendReminderToStudent(student, settings, senderInfo);
      sent++;
      if (res.telegram) telegram++;
    } catch {
      failed++;
    }
    if (onProgress) onProgress(sent + failed, total);
  }

  return { sent, telegram, failed };
};
