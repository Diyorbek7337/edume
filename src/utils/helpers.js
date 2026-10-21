import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

// Display uchun format (UI da ko'rsatish)
export const formatDate = (date, formatStr = 'dd.MM.yyyy') => {
  if (!date) return '';
  try {
    const d = date?.toDate ? date.toDate() : new Date(date);
    if (isNaN(d.getTime())) return '';
    return format(d, formatStr, { locale: uz });
  } catch (err) {
    return '';
  }
};

// Mahalliy vaqt bo'yicha YYYY-MM-DD — toISOString() UTC ga o'girib, UTC+5 da
// kechqurun sanani bir kun orqaga surib yuborardi (davomat noto'g'ri kunga tushardi)
const toLocalYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Database uchun ISO format (YYYY-MM-DD) - saqlash va filter uchun
export const formatDateISO = (date) => {
  if (!date) return '';
  try {
    const d = date?.toDate ? date.toDate() : new Date(date);
    if (isNaN(d.getTime())) return '';
    return toLocalYMD(d);
  } catch (err) {
    return '';
  }
};

// Turli formatlarni YYYY-MM-DD ga convert qilish
export const toISODateString = (dateValue) => {
  if (!dateValue) return null;
  
  // String formatda kelsa
  if (typeof dateValue === 'string') {
    // Agar YYYY-MM-DD formatda bo'lsa
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // DD.MM.YYYY formatda bo'lsa
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split('.');
      return `${year}-${month}-${day}`;
    }
    // DD/MM/YYYY formatda bo'lsa
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split('/');
      return `${year}-${month}-${day}`;
    }
    // ISO string yoki boshqa formatlarni parse qilish
    const d = new Date(dateValue);
    if (!isNaN(d.getTime())) {
      return toLocalYMD(d);
    }
    return null;
  }

  // Firestore Timestamp
  if (dateValue?.toDate) {
    return toLocalYMD(dateValue.toDate());
  }
  if (dateValue?.seconds) {
    return toLocalYMD(new Date(dateValue.seconds * 1000));
  }

  // Date object
  if (dateValue instanceof Date) {
    return toLocalYMD(dateValue);
  }
  
  return null;
};

export const formatMoney = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  return phone;
};

export const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Matnni buferga nusxalaydi va HAQIQATAN nusxalanganini qaytaradi.
 *
 * Nega kerak: kod bo'ylab `navigator.clipboard.writeText(x)` await/catch'siz
 * chaqirilardi va darhol "nusxalandi" deb ko'rsatilardi. Agar nusxalash
 * muvaffaqiyatsiz bo'lsa (eng ko'p uchraydigan sabab — ilovaga localhost
 * o'rniga IP manzil orqali kirish: u xavfsiz kontekst emas va brauzer
 * navigator.clipboard ni umuman bermaydi) foydalanuvchi YOLG'ON muvaffaqiyat
 * ko'rardi, keyin qo'yganda bo'sh chiqardi.
 *
 * Zaxira yo'l: eskirgan document.execCommand('copy') — u xavfsiz kontekst
 * talab qilmaydi, shuning uchun HTTP orqali ochilganda ham ishlaydi.
 *
 * @returns {Promise<boolean>} true — nusxalandi, false — chaqiruvchi
 *          foydalanuvchiga matnni qo'lda belgilash imkonini berishi kerak.
 */
export const copyToClipboard = async (text) => {
  const value = String(text ?? '');
  if (!value) return false;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // xavfsiz kontekst emas yoki ruxsat berilmadi — pastdagi zaxira yo'lga o'tamiz
    }
  }

  try {
    const el = document.createElement('textarea');
    el.value = value;
    el.setAttribute('readonly', '');
    // Ekrandan tashqarida, lekin fokus olishi uchun display:none EMAS
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
};

// O'zbekcha oy nomlari — YAGONA manba.
//
// NEGA KERAK: oy+yil yorlig'i ilgari uch xil yo'l bilan hosil qilinardi:
//   1) toLocaleDateString('uz-UZ', {month:'long', year:'numeric'})
//   2) Payments.jsx ichidagi qo'lda yozilgan massiv ('Sentyabr')
//   3) Dashboard.jsx ichidagi boshqa massiv ('Sentabr' — imlosi ham boshqa)
//
// Birinchisi eng xavflisi: uz-UZ lokali ICU'da to'liq emas va brauzerga
// qarab "sentabr, 2026" o'rniga "2026 M09" qaytarishi mumkin. Aynan shu
// ota-onaga ketgan Telegram xabarida "Oy: 2026 M09" bo'lib chiqdi.
// Intl'ga tayanmaymiz — nomlar shu yerda aniq yozilgan.
export const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

/**
 * Oy + yil yorlig'i: "Sentyabr 2026".
 * Qabul qiladi: Date | "YYYY-MM" | "YYYY-MM-DD" | Firestore Timestamp.
 * Aniqlab bo'lmasa — joriy oyni qaytaradi (hech qachon bo'sh yoki "M09" emas).
 */
export const formatMonthUz = (input) => {
  let year, monthIndex;

  if (typeof input === 'string' && /^\d{4}-\d{2}/.test(input)) {
    const [y, m] = input.split('-');
    year = Number(y);
    monthIndex = Number(m) - 1;
  } else {
    const d = input?.toDate ? input.toDate() : (input ? new Date(input) : new Date());
    const safe = isNaN(d?.getTime?.()) ? new Date() : d;
    year = safe.getFullYear();
    monthIndex = safe.getMonth();
  }

  const name = MONTHS_UZ[monthIndex];
  if (!name || !year) {
    const now = new Date();
    return `${MONTHS_UZ[now.getMonth()]} ${now.getFullYear()}`;
  }
  return `${name} ${year}`;
};
