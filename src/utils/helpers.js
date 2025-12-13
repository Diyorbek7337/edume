import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

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
