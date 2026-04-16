/**
 * Web Notifications API wrapper
 *
 * Works in modern browsers (Chrome, Edge, Firefox, Safari 16.4+).
 * Shows notifications when the app is open in any tab (foreground).
 * On PWA (installed), works in background too on Android Chrome.
 *
 * Usage:
 *   await requestNotificationPermission();
 *   showNotification('Yangi baho', { body: 'Matematika: 95/100' });
 */

// ==================== PERMISSION ====================

/** Returns 'granted' | 'denied' | 'default' | 'unsupported' */
export const getNotificationStatus = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

/**
 * Ask the browser for notification permission.
 * Safe to call multiple times — only prompts when status is 'default'.
 * @returns {Promise<boolean>} true if granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
};

// ==================== SHOW ====================

/**
 * Display a browser notification.
 * Silently no-ops if permission not granted or API unavailable.
 *
 * @param {string} title
 * @param {object} options
 * @param {string} [options.body]
 * @param {string} [options.icon]   default: /pwa-192.png
 * @param {string} [options.badge]  default: /pwa-192.png
 * @param {string} [options.tag]    groups notifications of same type
 * @param {string} [options.url]    URL to open on click
 */
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const { url, ...rest } = options;

  const n = new Notification(title, {
    icon: '/pwa-192.png',
    badge: '/pwa-192.png',
    ...rest,
  });

  if (url) {
    n.onclick = () => {
      window.focus();
      window.location.href = url;
    };
  }
};

// ==================== TYPED HELPERS ====================

export const notifyNewGrade = ({ studentName, subject, grade, maxGrade }) =>
  showNotification('📊 Yangi baho qo\'yildi', {
    body: `${studentName}: ${subject} — ${grade}/${maxGrade}`,
    tag: 'grade',
    url: '/my-grades',
  });

export const notifyAbsent = ({ studentName, groupName, date }) =>
  showNotification('📅 Darsga kelmadi', {
    body: `${studentName} — ${groupName} (${date})`,
    tag: 'attendance',
    url: '/my-attendance',
  });

export const notifyPaymentDue = ({ studentName, debt, centerName }) =>
  showNotification('💰 To\'lov eslatmasi', {
    body: `${centerName}: ${Number(debt).toLocaleString()} so'm to\'lov kutilmoqda`,
    tag: 'payment',
    url: '/my-payments',
  });

export const notifyNewMessage = ({ senderName, preview }) =>
  showNotification('✉️ Yangi xabar', {
    body: `${senderName}: ${preview}`,
    tag: 'message',
    url: '/messages',
  });

// ==================== PWA INSTALL PROMPT ====================

let deferredInstallPrompt = null;

/** Call once in App.jsx to capture the install prompt */
export const setupInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
};

/** Returns true if the app can be installed (not already installed) */
export const canInstallPWA = () => !!deferredInstallPrompt;

/** Triggers the native install dialog. Returns 'accepted' | 'dismissed' */
export const triggerInstallPrompt = async () => {
  if (!deferredInstallPrompt) return 'unavailable';
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  return outcome;
};
