import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export const initSentry = () => {
  // DSN sozlanmagan bo'lsa (development yoki konfiguratsiya yo'q) — o'tkazib yuborish
  if (!SENTRY_DSN || import.meta.env.DEV) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE, // 'production' | 'staging'
    // Har 10 ta sessiondan 1 tasi record qilinadi (performance monitoring)
    tracesSampleRate: 0.1,
    // Xatolarni filterlash — bizga kerakli ma'lumotlar
    beforeSend(event) {
      // Foydalanuvchi ma'lumotlarini (email, telefon) xato reportdan olib tashlash
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
    // Ignorilanadigan xatolar (tashqi kutubxonalardan keladigan shovqinlar)
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      /Loading chunk \d+ failed/,
      /NetworkError/,
      'AbortError',
    ],
  });
};

// Foydalanuvchi tizimga kirganda Sentry'ga ulash (anonimlashtirilib)
export const setSentryUser = (userId, role, centerId) => {
  if (!SENTRY_DSN || import.meta.env.DEV) return;
  Sentry.setUser({ id: userId, role, centerId });
};

// Foydalanuvchi chiqib ketganda tozalash
export const clearSentryUser = () => {
  if (!SENTRY_DSN || import.meta.env.DEV) return;
  Sentry.setUser(null);
};

// Qo'lda xato yuborish (try-catch bloklarida)
export const captureError = (error, context = {}) => {
  if (import.meta.env.DEV) {
    console.error('[Sentry captureError]', error, context);
    return;
  }
  Sentry.withScope((scope) => {
    Object.entries(context).forEach(([key, value]) => scope.setExtra(key, value));
    Sentry.captureException(error);
  });
};

export { Sentry };
