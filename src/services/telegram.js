/**
 * Telegram Bot API service
 *
 * Flow:
 * 1. Admin creates a bot via @BotFather → gets token + bot username
 * 2. Admin saves them in Settings
 * 3. Admin copies a deep-link per parent: https://t.me/{botUsername}?start={parentPhone}
 * 4. Parent clicks the link → Telegram opens with "/start 998XXXXXXXXX" pre-filled → sends it
 * 5. Admin clicks "Sinxronlash" in Settings → app calls getUpdates → finds /start messages
 *    → matches phone numbers to student records → saves parentTelegramChatId to Firestore
 * 6. From now on, Payments can call sendMessage(token, chatId, text) directly
 */

const BASE = (token) => `https://api.telegram.org/bot${token}`;

// ==================== CORE API CALLS ====================

/**
 * Validate token and return bot info.
 * @returns {{ id, username, first_name }}
 */
export const getBotInfo = async (token) => {
  const res = await fetch(`${BASE(token)}/getMe`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || "Token noto'g'ri");
  return data.result;
};

/**
 * Send a text message to a Telegram chat.
 * @param {string} token    - Bot token
 * @param {string|number} chatId - Recipient chat_id
 * @param {string} text     - Message text (HTML allowed)
 * @returns Telegram message object
 */
export const sendTelegramMessage = async (token, chatId, text) => {
  const res = await fetch(`${BASE(token)}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'Yuborishda xatolik');
  return data.result;
};

/**
 * Fetch recent updates (messages sent to the bot).
 * Uses offset=0 to get all unconfirmed updates (up to 100).
 */
export const getUpdates = async (token) => {
  const res = await fetch(`${BASE(token)}/getUpdates?limit=100&timeout=0`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'getUpdates xatosi');
  return data.result; // array of Update objects
};

// ==================== REGISTRATION HELPERS ====================

/**
 * Parse getUpdates result and extract phone → chatId mappings.
 * Parents are expected to send "/start 998XXXXXXXXX" (via deep-link).
 *
 * @param {Array} updates - result from getUpdates()
 * @returns {Array<{ phone: string, chatId: number, name: string, username: string }>}
 */
export const parseRegistrations = (updates) => {
  const seen = new Set();
  const result = [];

  updates.forEach((update) => {
    const msg = update.message;
    if (!msg?.text) return;

    const match = msg.text.trim().match(/^\/start\s+(\d{9,12})$/);
    if (!match) return;

    const phone = match[1];
    const chatId = msg.chat.id;
    const key = `${phone}-${chatId}`;
    if (seen.has(key)) return;
    seen.add(key);

    result.push({
      phone,
      chatId,
      name: [msg.chat.first_name, msg.chat.last_name].filter(Boolean).join(' '),
      username: msg.chat.username || '',
    });
  });

  return result;
};

/**
 * Generate the deep-link a parent should click to register.
 * Clicking it opens Telegram with "/start {phone}" pre-filled.
 *
 * @param {string} botUsername - e.g. "my_edu_bot"
 * @param {string} phone       - parent phone (digits only or with +)
 * @returns {string} URL
 */
export const buildDeepLink = (botUsername, phone) => {
  const digits = phone.replace(/\D/g, '');
  return `https://t.me/${botUsername}?start=${digits}`;
};

// ==================== MESSAGE TEMPLATES ====================

/**
 * Build a payment reminder message in Uzbek.
 */
export const buildPaymentReminderText = ({ studentName, debt, centerName, month }) => {
  const monthStr = month || new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' });
  return (
    `💰 <b>To'lov eslatmasi</b>\n\n` +
    `O'quv markaz: <b>${centerName || "O'quv markaz"}</b>\n` +
    `O'quvchi: <b>${studentName}</b>\n` +
    `Oy: <b>${monthStr}</b>\n` +
    `Qarzdorlik: <b>${Number(debt).toLocaleString()} so'm</b>\n\n` +
    `Iltimos, to'lovni amalga oshiring. Savollar bo'lsa, biz bilan bog'laning.`
  );
};
