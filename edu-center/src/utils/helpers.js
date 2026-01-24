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

// Database uchun ISO format (YYYY-MM-DD) - saqlash va filter uchun
export const formatDateISO = (date) => {
  if (!date) return '';
  try {
    const d = date?.toDate ? date.toDate() : new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // "2026-01-05" format
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
      return d.toISOString().split('T')[0];
    }
    return null;
  }
  
  // Firestore Timestamp
  if (dateValue?.toDate) {
    return dateValue.toDate().toISOString().split('T')[0];
  }
  if (dateValue?.seconds) {
    return new Date(dateValue.seconds * 1000).toISOString().split('T')[0];
  }
  
  // Date object
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
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
