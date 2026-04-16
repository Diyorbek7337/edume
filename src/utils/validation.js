// Markaziy validatsiya funksiyalari
// Qaytaradi: { field: 'xato matni' } yoki {} (xato yo'q)

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  // 9 yoki 12 raqam (998 bilan yoki siz)
  return digits.length === 9 || digits.length === 12;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isPositiveNumber = (val) => {
  const n = Number(val);
  return !isNaN(n) && n > 0;
};

export const isNonNegativeNumber = (val) => {
  const n = Number(val);
  return !isNaN(n) && n >= 0;
};

// ===================== STUDENT FORMI =====================
export const validateStudentForm = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Ism-familiya kiritilishi shart";
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = "Ism kamida 3 ta harf bo'lishi kerak";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Telefon raqam kiritilishi shart";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Telefon noto'g'ri formatda (masalan: 901234567)";
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = "Email formati noto'g'ri";
  }

  if (!data.groupId) {
    errors.groupId = "Guruhni tanlash shart";
  }

  if (data.discount !== undefined && data.discount !== '') {
    const d = Number(data.discount);
    if (isNaN(d) || d < 0 || d > 100) {
      errors.discount = "Chegirma 0-100% orasida bo'lishi kerak";
    }
  }

  if (data.paymentDay !== undefined && data.paymentDay !== '') {
    const pd = Number(data.paymentDay);
    if (isNaN(pd) || pd < 1 || pd > 31) {
      errors.paymentDay = "To'lov kuni 1-31 orasida bo'lishi kerak";
    }
  }

  return errors;
};

// ===================== TEACHER FORMI =====================
export const validateTeacherForm = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Ism-familiya kiritilishi shart";
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = "Ism kamida 3 ta harf bo'lishi kerak";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Telefon raqam kiritilishi shart";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Telefon noto'g'ri formatda (masalan: 901234567)";
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = "Email formati noto'g'ri";
  }

  if (!data.subject?.trim()) {
    errors.subject = "Fan kiritilishi shart";
  }

  return errors;
};

// ===================== LEAD FORMI =====================
export const validateLeadForm = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Ism-familiya kiritilishi shart";
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = "Ism kamida 2 ta harf bo'lishi kerak";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Telefon raqam kiritilishi shart";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Telefon noto'g'ri formatda (masalan: 901234567)";
  }

  return errors;
};

// ===================== TO'LOV FORMI =====================
export const validatePaymentForm = (data) => {
  const errors = {};

  if (!data.amount || !isPositiveNumber(data.amount)) {
    errors.amount = "Summa musbat son bo'lishi shart";
  } else if (Number(data.amount) > 100_000_000) {
    errors.amount = "Summa juda katta (max 100,000,000)";
  }

  if (!data.method?.trim()) {
    errors.method = "To'lov usulini tanlang";
  }

  return errors;
};

// ===================== GURUH FORMI =====================
export const validateGroupForm = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = "Guruh nomi kiritilishi shart";
  }

  if (!data.teacherId) {
    errors.teacherId = "O'qituvchini tanlash shart";
  }

  if (data.capacity !== undefined && data.capacity !== '') {
    const c = Number(data.capacity);
    if (isNaN(c) || c < 1 || c > 100) {
      errors.capacity = "Sig'im 1-100 orasida bo'lishi kerak";
    }
  }

  if (data.monthlyFee !== undefined && data.monthlyFee !== '') {
    if (!isNonNegativeNumber(data.monthlyFee)) {
      errors.monthlyFee = "Oylik to'lov noto'g'ri";
    }
  }

  return errors;
};

// Formda birorta xato borligini tekshirish
export const hasErrors = (errors) => Object.keys(errors).length > 0;
