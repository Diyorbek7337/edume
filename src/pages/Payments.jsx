import { useState, useEffect, useRef } from 'react';
import { validatePaymentForm, hasErrors } from '../utils/validation';
import {
  Search, Plus, CreditCard, CheckCircle, Clock, AlertTriangle, Eye,
  Users, Wallet, TrendingUp, Filter, Calendar, History, ArrowRight,
  DollarSign, PieChart, AlertCircle, ChevronDown, ChevronUp, Receipt,
  Bell, Send, MessageCircle, Phone, CheckSquare, Square, X
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading } from '../components/common';
import { paymentsAPI, studentsAPI, groupsAPI, settingsAPI, messagesAPI, teachersAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatMoney, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';
import { activityLogAPI, LOG_ACTIONS } from '../services/activityLog';
import { sendTelegramMessage, buildPaymentReminderText } from '../services/telegram';
import { getPendingReminders, sendAllReminders } from '../services/autoReminder';

const Payments = () => {
  const { userData, role } = useAuth();
  const [monthlyBills, setMonthlyBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [settings, setSettings] = useState({});

  // Auto-reminder
  const [pendingReminders, setPendingReminders] = useState([]);
  const [autoSending, setAutoSending]           = useState(false);
  const [autoProgress, setAutoProgress]         = useState(null); // { done, total }
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [expandedStudents, setExpandedStudents] = useState({});

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'Naqd',
    description: '',
    discount: 0,
    discountType: 'percent' // 'percent' yoki 'amount'
  });

  const [billForm, setBillForm] = useState({
    studentId: '',
    month: '',
    totalAmount: ''
  });

  const [reminderForm, setReminderForm] = useState({
    sendToProfile: true,
    sendToTelegram: true,
    sendToSMS: false,
    customMessage: ''
  });

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => { isMountedRef.current = false; };
  }, []);

  const fetchData = async () => {
    try {
      let studentsData = [];
      let groupsData = [];
      let paymentsData = [];
      let billsData = [];
      
      const settingsData = await settingsAPI.get();
      setSettings(settingsData || {});

      if (isStudentOrParent) {
        // O'quvchi yoki ota-ona - faqat o'z ma'lumotlarini olish
        let studentId = null;
        let student = null;
        
        // Barcha studentlarni olish
        const allStudents = await studentsAPI.getAll();
        
        if (role === ROLES.STUDENT) {
          // O'quvchi - email orqali topish yoki userData.studentId
          if (userData?.email) {
            student = allStudents.find(s => s.email === userData.email);
          }
          if (!student && userData?.studentId) {
            student = allStudents.find(s => s.id === userData.studentId);
          }
          if (!student && userData?.phone) {
            student = allStudents.find(s => s.phone === userData.phone);
          }
        } else if (role === ROLES.PARENT) {
          // Ota-ona - childId yoki phone orqali
          if (userData?.childId) {
            student = allStudents.find(s => s.id === userData.childId);
          }
          if (!student && userData?.childIds?.length > 0) {
            student = allStudents.find(s => s.id === userData.childIds[0]);
          }
          if (!student && userData?.phone) {
            // Ota-ona telefoni orqali bolani topish
            student = allStudents.find(s => s.parentPhone === userData.phone);
          }
        }
        
        
        if (student) {
          studentId = student.id;
          studentsData = [student];
          
          // Guruhni olish
          const allGroups = await groupsAPI.getAll();
          if (student.groupId) {
            const group = allGroups.find(g => g.id === student.groupId);
            groupsData = group ? [group] : [];
          }
          
          // Barcha to'lovlar va bills
          const allPayments = await paymentsAPI.getAll();
          paymentsData = allPayments.filter(p => p.studentId === studentId);
          
          try {
            const allBills = await paymentsAPI.getMonthlyBills();
            billsData = (allBills || []).filter(b => b.studentId === studentId);
          } catch (e) {
            billsData = [];
          }
          
        }
      } else if (isTeacher) {
        // O'qituvchi - faqat o'z guruhlari o'quvchilarini
        const userId = userData?.id;
        const userEmail = userData?.email;
        const userPhone = userData?.phone;
        const userFullName = userData?.fullName;
        
        // Teachers jadvalidan o'qituvchini topish - email, phone yoki ism bo'yicha
        const allTeachers = await teachersAPI.getAll();
        
        let teacher = allTeachers.find(t => t.email === userEmail);
        if (!teacher && userPhone) {
          teacher = allTeachers.find(t => t.phone === userPhone);
        }
        if (!teacher && userFullName) {
          teacher = allTeachers.find(t => t.fullName === userFullName);
        }
        
        const teacherId = teacher?.id;
        
        // Barcha guruhlarni olib, teacher bo'yicha filter
        const allGroups = await groupsAPI.getAll();
        
        // teacherId - teachers jadvalidagi ID bo'lishi kerak
        groupsData = allGroups.filter(g => 
          g.teacherId === teacherId ||  // Teachers ID
          g.teacherId === userId ||     // Users ID (eski ma'lumotlar uchun)
          g.teacherEmail === userEmail  // Email bo'yicha
        );
        
        
        const groupIds = groupsData.map(g => g.id);
        
        // Barcha studentlarni olib, guruh bo'yicha filter
        const allStudents = await studentsAPI.getAll();
        studentsData = groupIds.length > 0 
          ? allStudents.filter(s => groupIds.includes(s.groupId) && s.status === 'active')
          : []; // Agar guruh yo'q bo'lsa, o'quvchilar ham bo'lmasin
        
        
        const studentIds = studentsData.map(s => s.id);
        
        // To'lovlarni filter qilish
        const allPayments = await paymentsAPI.getAll();
        paymentsData = allPayments.filter(p => studentIds.includes(p.studentId));
        
        try {
          const allBills = await paymentsAPI.getMonthlyBills();
          billsData = (allBills || []).filter(b => studentIds.includes(b.studentId));
        } catch (e) {
          billsData = [];
        }
      } else {
        // Admin/Direktor - hamma ma'lumotlar
        const [allStudents, allGroups, allPayments] = await Promise.all([
          studentsAPI.getAll(),
          groupsAPI.getAll(),
          paymentsAPI.getAll()
        ]);
        
        studentsData = allStudents.filter(s => s.status === 'active');
        groupsData = allGroups;
        paymentsData = allPayments;
        
        try {
          billsData = await paymentsAPI.getMonthlyBills();
        } catch (e) {
          billsData = [];
        }
      }

      if (!isMountedRef.current) return;
      setStudents(studentsData);
      setGroups(groupsData);
      setPayments(paymentsData);

      // Eski to'lovlarni monthly_bills formatiga o'tkazish
      const convertedBills = convertOldPaymentsToBills(paymentsData, billsData || [], studentsData, groupsData, settingsData);
      setMonthlyBills(convertedBills);

      // Auto-reminder: faqat admin/direktor uchun
      if (settingsData?.telegramEnabled || true) {
        const pending = getPendingReminders(
          studentsData.filter(s => s.status === 'active'),
          convertedBills,
          settingsData || {}
        );
        setPendingReminders(pending);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('fetchData error:', err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  // Eski payments dan monthly_bills yaratish
  const convertOldPaymentsToBills = (oldPayments, existingBills, studentsData, groupsData, settingsData) => {
    
    const billsMap = {};
    
    // To'lovlarni ID bo'yicha indekslash (duplikatlarni oldini olish)
    const processedPaymentIds = new Set();
    
    // Avval mavjud monthly_bills ni qo'shish
    (existingBills || []).forEach(bill => {
      const key = `${bill.studentId}-${bill.month}`;
      billsMap[key] = { ...bill };
      
      // Bu billdagi to'lovlarni processed qilish
      if (bill.payments) {
        bill.payments.forEach(p => {
          if (p.legacyPaymentId) {
            processedPaymentIds.add(p.legacyPaymentId);
          }
        });
      }
    });
    
    // Eski to'lovlarni tekshirish
    oldPayments.forEach(payment => {
      if (!payment.studentId || payment.type === 'expense') {
        return;
      }
      
      // Agar bu to'lov allaqachon monthly_bills ga qo'shilgan bo'lsa, o'tkazib yuborish
      if (processedPaymentIds.has(payment.id)) {
        return;
      }
      
      // MUHIM: Yangi tizimda qo'shilgan to'lovlarni o'tkazib yuborish
      if (payment.alreadyInMonthlyBill === true) {
        return;
      }
      
      // To'lov sanasidan oyni aniqlash
      let paymentDate;
      if (payment.month) {
        paymentDate = payment.month;
      } else if (payment.paidAt) {
        let date;
        if (typeof payment.paidAt === 'string') {
          date = new Date(payment.paidAt);
        } else if (payment.paidAt?.seconds) {
          date = new Date(payment.paidAt.seconds * 1000);
        } else if (payment.paidAt?.toDate) {
          date = payment.paidAt.toDate();
        }
        if (date && !isNaN(date)) {
          paymentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
      } else if (payment.createdAt) {
        let date;
        if (payment.createdAt?.seconds) {
          date = new Date(payment.createdAt.seconds * 1000);
        }
        if (date && !isNaN(date)) {
          paymentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
      }
      
      if (!paymentDate) return;
      
      const key = `${payment.studentId}-${paymentDate}`;
      const student = studentsData.find(s => s.id === payment.studentId);
      
      // MUHIM: To'lovdagi groupId yoki studentning groupId dan guruhni olish
      const groupId = payment.groupId || student?.groupId;
      const group = groupsData.find(g => g.id === groupId);
      
      // MUHIM: Guruhning monthlyFee ni olish (price yoki monthlyFee)
      const groupMonthlyFee = parseInt(group?.monthlyFee) || parseInt(group?.price) || 0;
      const defaultFee = parseInt(settingsData?.defaultMonthlyFee) || 500000;
      const monthlyFee = groupMonthlyFee > 0 ? groupMonthlyFee : defaultFee;
      
      if (!billsMap[key]) {
        // Yangi bill yaratish
        billsMap[key] = {
          id: `legacy-${key}`,
          studentId: payment.studentId,
          studentName: payment.studentName || student?.fullName || '',
          groupId: student?.groupId || '',
          groupName: group?.name || '',
          month: paymentDate,
          totalAmount: monthlyFee,
          paidAmount: 0,
          remainingAmount: monthlyFee,
          status: 'pending',
          payments: [],
          isLegacy: true,
          appliedDiscount: 0
        };
      }
      
      // MUHIM: Skidkani hisobga olish
      const discount = parseInt(payment.discount) || 0;
      const originalAmount = parseInt(payment.originalAmount) || parseInt(payment.amount) || 0;
      const actualPaidAmount = parseInt(payment.amount) || 0;
      
      // Agar skidka qo'llanilgan bo'lsa
      if (discount > 0) {
        // Skidka bilan to'lov - to'liq to'langan hisoblanadi
        const discountedTotal = Math.round(billsMap[key].totalAmount * (100 - discount) / 100);
        billsMap[key].appliedDiscount = discount;
        billsMap[key].discountedAmount = discountedTotal;
        
        // To'lov qo'shish
        billsMap[key].paidAmount = (billsMap[key].paidAmount || 0) + actualPaidAmount;
        
        // Qarz hisoblash - skidkali narx bo'yicha
        billsMap[key].remainingAmount = discountedTotal - billsMap[key].paidAmount;
      } else {
        // Oddiy to'lov
        billsMap[key].paidAmount = (billsMap[key].paidAmount || 0) + actualPaidAmount;
        billsMap[key].remainingAmount = billsMap[key].totalAmount - billsMap[key].paidAmount;
      }
      
      // Status yangilash
      if (billsMap[key].remainingAmount <= 0) {
        billsMap[key].remainingAmount = 0;
        billsMap[key].status = 'paid';
      } else if (billsMap[key].paidAmount > 0) {
        billsMap[key].status = 'partial';
      }
      
      // To'lov tarixiga qo'shish
      billsMap[key].payments.push({
        amount: actualPaidAmount,
        originalAmount: originalAmount,
        discount: discount,
        method: payment.method || 'Naqd',
        paidAt: payment.paidAt || payment.createdAt,
        description: payment.description,
        legacyPaymentId: payment.id
      });
    });
    
    return Object.values(billsMap);
  };

  // Oylik hisob-kitob olish yoki yaratish
  const getOrCreateMonthlyBill = (studentId, month) => {
    const existing = monthlyBills.find(b => b.studentId === studentId && b.month === month);
    if (existing) return existing;

    const student = students.find(s => s.id === studentId);
    const group = groups.find(g => g.id === student?.groupId);

    // Bepul o'quvchi — to'lov hisoblanmaydi
    if (student?.isFree) {
      return {
        studentId,
        month,
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        status: 'paid',
        payments: [],
        isVirtual: true,
        isFree: true,
        groupName: group?.name || '',
        studentName: student?.fullName || ''
      };
    }

    // MUHIM: Guruhning monthlyFee yoki price ni olish
    const groupMonthlyFee = parseInt(group?.monthlyFee) || parseInt(group?.price) || 0;
    const defaultFee = parseInt(settings.defaultMonthlyFee) || 500000;
    const monthlyFee = groupMonthlyFee > 0 ? groupMonthlyFee : defaultFee;

    // Pro-rated hisob-kitob: o'quvchi oyning o'rtasida boshlagan bo'lsa
    let billAmount = monthlyFee;
    let isProrated = false;
    if (student?.startDate) {
      const startDate = new Date(student.startDate);
      const startMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
      if (startMonth === month) {
        const [y, m] = month.split('-');
        const daysInMonth = new Date(parseInt(y), parseInt(m), 0).getDate();
        const startDay = startDate.getDate();
        const remainingDays = daysInMonth - startDay + 1;
        billAmount = Math.round(monthlyFee * remainingDays / daysInMonth);
        isProrated = true;
      }
    }

    return {
      studentId,
      month,
      totalAmount: billAmount,
      paidAmount: 0,
      remainingAmount: billAmount,
      status: 'pending',
      payments: [],
      isVirtual: true,
      isProrated,
      groupName: group?.name || '',
      studentName: student?.fullName || ''
    };
  };

  // O'quvchining barcha oylik hisoblari
  const getStudentBills = (studentId) => {
    const studentBills = monthlyBills.filter(b => b.studentId === studentId);
    const student = students.find(s => s.id === studentId);
    const currentMonth = selectedMonth;

    // O'quvchi boshlagan oy
    const startDate = student?.startDate ? new Date(student.startDate) : null;
    const startMonth = startDate
      ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
      : currentMonth;

    // startMonth dan currentMonth gacha barcha oylar uchun bill olish yoki yaratish
    const allMonthBills = [];
    const cursor = new Date(startMonth + '-01');
    const endDate = new Date(currentMonth + '-01');

    while (cursor <= endDate) {
      const m = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      const existing = studentBills.find(b => b.month === m);
      allMonthBills.push(existing || getOrCreateMonthlyBill(studentId, m));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    // startMonth dan OLDINGI oylar: to'lanmagan DB qarzlar ham ko'rsatiladi
    const olderUnpaidBills = studentBills
      .filter(b => b.month < startMonth && (b.remainingAmount || 0) > 0);

    // To'langan eski oylar (oxirgi 2 ta, tarix uchun)
    const olderPaidBills = studentBills
      .filter(b => b.month < startMonth && b.status === 'paid')
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 2);

    const allBills = [...allMonthBills, ...olderUnpaidBills, ...olderPaidBills];

    // Unique va tartiblash
    const uniqueBills = allBills.filter((bill, index, self) =>
      index === self.findIndex(b => b.month === bill.month)
    );

    return uniqueBills.sort((a, b) => b.month.localeCompare(a.month));
  };

  // O'quvchi umumiy qarz (virtual billlarni ham hisobga oladi)
  const getStudentTotalDebt = (studentId) => {
    const allBills = getStudentBills(studentId);
    return allBills
      .filter(b => b.month <= selectedMonth)
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
  };

  // O'quvchi to'lov holati
  const getStudentPaymentStatus = (student) => {
    if (student.isFree) {
      return { status: 'free', label: 'Bepul', color: 'info', debt: 0 };
    }
    const currentMonth = selectedMonth;

    // Barcha billlarni olish (virtual + DB, startDate dan currentMonth gacha)
    const allBills = getStudentBills(student.id);

    // Tanlangan oy uchun bill
    const currentBill = allBills.find(b => b.month === currentMonth)
      || getOrCreateMonthlyBill(student.id, currentMonth);

    // O'tgan oylarning qarzi (virtual billlarni ham qo'shib)
    const pastDebt = allBills
      .filter(b => b.month < currentMonth && (b.remainingAmount || 0) > 0)
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

    const currentDebt = currentBill.remainingAmount || 0;

    if (currentBill.status === 'paid') {
      if (pastDebt > 0) {
        return { status: 'debtor', label: 'Qarzdor', color: 'danger', debt: pastDebt };
      }
      return { status: 'paid', label: "To'langan", color: 'success', debt: 0 };
    }

    if (currentBill.status === 'partial') {
      return { status: 'partial', label: 'Qisman', color: 'warning', debt: currentDebt + pastDebt };
    }

    if (pastDebt > 0) {
      return { status: 'debtor', label: 'Qarzdor', color: 'danger', debt: currentDebt + pastDebt };
    }

    return { status: 'pending', label: 'Kutilmoqda', color: 'warning', debt: currentDebt };
  };

  // To'lov qilish
  const handlePayment = async (e) => {
    e.preventDefault();
    const errors = validatePaymentForm(paymentForm);
    if (hasErrors(errors)) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    if (!selectedStudent) {
      toast.error("O'quvchi tanlanmagan");
      return;
    }

    setFormLoading(true);
    try {
      const paidAmount = Math.round(Number(paymentForm.amount)); // O'quvchi bergan summa (butun son, so'm)
      const discount = paymentForm.discount || 0;
      const discountType = paymentForm.discountType || 'percent';
      
      const student = students.find(s => s.id === selectedStudent.id);
      const group = groups.find(g => g.id === student?.groupId);
      const monthlyFee = parseInt(group?.monthlyFee) || parseInt(group?.price) || 0;
      
      // Chegirma OYLIK NARXDAN hisoblanadi
      let discountAmount = 0;
      if (discount > 0) {
        if (discountType === 'percent') {
          discountAmount = Math.round(monthlyFee * discount / 100);
        } else {
          discountAmount = discount;
        }
      }
      
      // Chegirmali oylik narx
      const discountedMonthlyFee = monthlyFee - discountAmount;
      
      // Qarzdan qancha yopiladi (chegirmali narx bo'yicha hisoblash)
      // Masalan: 350,000 to'landi, oylik 400,000 (500k - 20%) = 350,000 qarz yopiladi
      const debtCovered = paidAmount; // To'langan summa = yopilgan qarz

      // Eng eski qarzdan boshlab to'lash
      const bills = getStudentBills(selectedStudent.id)
        .filter(b => b.remainingAmount > 0)
        .sort((a, b) => a.month.localeCompare(b.month));

      let remainingPayment = debtCovered;
      const updatedBills = [];

      for (const bill of bills) {
        if (remainingPayment <= 0) break;

        // Agar chegirma bo'lsa, bu bill uchun chegirmali narx
        let billTotalWithDiscount = bill.totalAmount;
        if (discount > 0 && bill.totalAmount === monthlyFee) {
          billTotalWithDiscount = discountedMonthlyFee;
        }
        
        // Qolgan qarz (chegirmali)
        const billRemaining = billTotalWithDiscount - (bill.paidAmount || 0);
        
        const paymentForThisBill = Math.min(remainingPayment, billRemaining);
        remainingPayment -= paymentForThisBill;

        const newPaidAmount = (bill.paidAmount || 0) + paymentForThisBill;
        const newRemainingAmount = billTotalWithDiscount - newPaidAmount;
        const newStatus = newRemainingAmount <= 0 ? 'paid' : 'partial';

        const paymentRecord = {
          amount: paymentForThisBill,
          actualPaid: paymentForThisBill,
          discount: discount,
          discountType: discountType,
          discountAmount: discount > 0 ? discountAmount : 0,
          method: paymentForm.method,
          description: paymentForm.description + (discount > 0 ? ` (${discountType === 'percent' ? discount + '%' : formatMoney(discount)} chegirma)` : ''),
          paidAt: new Date().toISOString(),
          paidBy: userData?.id,
          paidByName: userData?.fullName
        };

        if (bill.isVirtual || !bill.id) {
          // Yangi bill yaratish (chegirmali narx bilan)
          const newBill = await paymentsAPI.createMonthlyBill({
            studentId: selectedStudent.id,
            studentName: student?.fullName || '',
            groupId: student?.groupId || '',
            groupName: group?.name || '',
            month: bill.month,
            totalAmount: billTotalWithDiscount, // Chegirmali narx
            originalAmount: monthlyFee, // Asl narx
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            appliedDiscount: discount,
            discountType: discountType,
            discountAmount: discountAmount,
            payments: [paymentRecord]
          });
          updatedBills.push(newBill);
        } else {
          // Mavjud billni yangilash
          // Agar chegirma yangi qo'llanayotgan bo'lsa, totalAmount ni ham yangilash
          const updateData = {
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            payments: [...(bill.payments || []), paymentRecord]
          };
          
          // Chegirma birinchi marta qo'llanayotgan bo'lsa
          if (discount > 0 && !bill.appliedDiscount) {
            updateData.totalAmount = billTotalWithDiscount;
            updateData.originalAmount = bill.totalAmount;
            updateData.appliedDiscount = discount;
            updateData.discountType = discountType;
            updateData.discountAmount = discountAmount;
          }
          
          const updatedBill = await paymentsAPI.updateMonthlyBill(bill.id, updateData);
          updatedBills.push({ ...bill, ...updatedBill });
        }
      }

      // Umumiy to'lovlar ro'yxatiga qo'shish (statistika uchun)
      // MUHIM: alreadyInMonthlyBill flag - duplikat oldini olish
      const newPaymentDoc = await paymentsAPI.create({
        studentId: selectedStudent.id,
        studentName: student?.fullName || '',
        groupId: student?.groupId || '',
        groupName: group?.name || '',
        amount: paidAmount,
        originalAmount: discount > 0 ? monthlyFee : paidAmount,
        discount: discount,
        discountType: discountType,
        discountAmount: discountAmount,
        method: paymentForm.method,
        description: paymentForm.description + (discount > 0 ? ` (${discountType === 'percent' ? discount + '%' : formatMoney(discount)} chegirma)` : ''),
        type: 'monthly',
        status: 'paid',
        paidAt: new Date().toISOString(),
        alreadyInMonthlyBill: true // Bu flag bilan convertOldPaymentsToBills o'tkazib yuboradi
      });

      // State yangilash
      setMonthlyBills(prev => {
        const filtered = prev.filter(b => !updatedBills.find(ub => ub.id === b.id));
        return [...filtered, ...updatedBills];
      });

      activityLogAPI.log({
        action: LOG_ACTIONS.PAYMENT_ADDED.key,
        entityType: 'payment',
        entityName: student?.fullName || selectedStudent?.fullName || '',
        details: { amount: paidAmount, method: paymentForm.method, groupName: group?.name || '' },
        performer: { id: userData?.id, fullName: userData?.fullName, role },
      });

      setShowPaymentModal(false);
      setPaymentForm({ amount: '', method: 'Naqd', description: '', discount: 0, discountType: 'percent' });
      setSelectedStudent(null);
      toast.success(`${formatMoney(paidAmount)} to'lov qabul qilindi!${discount > 0 ? ` (${discountType === 'percent' ? discount + '%' : formatMoney(discount)} chegirma)` : ''}`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setFormLoading(false);
    }
  };

  // ==================== AUTO BULK REMINDER ====================
  const handleSendAllReminders = async () => {
    if (autoSending || pendingReminders.length === 0) return;
    setAutoSending(true);
    setAutoProgress({ done: 0, total: pendingReminders.length });

    const { sent, telegram, failed } = await sendAllReminders(
      pendingReminders,
      settings,
      userData,
      (done, total) => setAutoProgress({ done, total })
    );

    // Update local student state so sent ones disappear from pending list
    setStudents(prev =>
      prev.map(s =>
        pendingReminders.find(r => r.id === s.id)
          ? { ...s, lastReminderSent: new Date().toISOString() }
          : s
      )
    );
    setPendingReminders([]);
    setAutoSending(false);
    setAutoProgress(null);
    setReminderDismissed(true);

    const tgNote = telegram > 0 ? `, ${telegram} ta Telegram` : '';
    if (failed === 0) {
      toast.success(`${sent} ta eslatma yuborildi${tgNote}!`);
    } else {
      toast.warning(`${sent} ta yuborildi${tgNote}, ${failed} ta xatolik`);
    }
  };

  // To'lov eslatmasi yuborish
  const openReminderModal = (student) => {
    setSelectedStudent(student);
    setReminderForm({
      sendToProfile: true,
      sendToTelegram: !!(student.parentTelegramChatId && settings.telegramBotToken),
      sendToSMS: false,
      customMessage: ''
    });
    setShowReminderModal(true);
  };

  const handleSendReminder = async () => {
    if (!selectedStudent) return;
    
    setReminderLoading(true);
    try {
      const debt = getStudentTotalDebt(selectedStudent.id);
      const group = groups.find(g => g.id === selectedStudent.groupId);
      
      // Standart xabar matni
      const defaultMessage = `Hurmatli ${selectedStudent.parentName || selectedStudent.fullName}!\n\n` +
        `${selectedStudent.fullName} ning "${group?.name || 'Guruh'}" guruhidagi to'lov muddati o'tganligini ma'lum qilamiz.\n\n` +
        `💰 Qarz miqdori: ${formatMoney(debt)}\n` +
        `📅 Sana: ${new Date().toLocaleDateString('uz-UZ')}\n\n` +
        `Iltimos, to'lovni amalga oshiring.\n\n` +
        `Hurmat bilan,\n${settings.centerName || "O'quv markazi"}`;
      
      const message = reminderForm.customMessage || defaultMessage;
      let sentCount = 0;
      
      // 1. Profilga xabar yuborish (Messages collection)
      if (reminderForm.sendToProfile) {
        await messagesAPI.create({
          title: "💰 To'lov eslatmasi",
          content: message,
          type: 'payment_reminder',
          priority: 'high',
          recipientType: 'student',
          recipientId: selectedStudent.id,
          recipientIds: [selectedStudent.id],
          senderId: userData?.id,
          senderName: userData?.fullName,
          debt: debt,
          read: false
        });
        sentCount++;
        
        // Agar ota-ona telefoni bo'lsa, ota-onani topib xabar yuborish
        if (selectedStudent.parentPhone) {
          try {
            const cleanPhone = selectedStudent.parentPhone.replace(/\D/g, '');
            const parentEmail = `parent${cleanPhone}@edu.local`;
            const allUsers = await usersAPI.getAll();
            const parentUser = allUsers.find(u => u.email === parentEmail || u.phone === selectedStudent.parentPhone);
            if (parentUser) {
              await messagesAPI.create({
                title: "💰 To'lov eslatmasi",
                content: message,
                type: 'payment_reminder',
                priority: 'high',
                recipientType: 'parent',
                recipientId: parentUser.id,
                recipientIds: [parentUser.id],
                senderId: userData?.id,
                senderName: userData?.fullName,
                studentId: selectedStudent.id,
                studentName: selectedStudent.fullName,
                debt: debt,
                read: false
              });
            }
          } catch (parentErr) {
            console.error('Parent message error:', parentErr);
          }
        }
      }
      
      // 2. Telegramga yuborish
      if (reminderForm.sendToTelegram) {
        const token = settings.telegramBotToken;
        const chatId = selectedStudent.parentTelegramChatId;

        if (token && chatId) {
          // Bot ulangan — to'g'ridan-to'g'ri yuborish
          try {
            const tgText = buildPaymentReminderText({
              studentName: selectedStudent.fullName,
              debt,
              centerName: settings.centerName,
            });
            await sendTelegramMessage(token, chatId, tgText);
            sentCount++;
            toast.success("Telegram xabari yuborildi!");
          } catch (tgErr) {
            toast.error("Telegram xatolik: " + tgErr.message);
          }
        } else if (!token) {
          toast.warning("Telegram bot sozlanmagan. Sozlamalar sahifasiga o'ting.");
        } else {
          // chatId yo'q — ota-ona botga ro'yxatdan o'tmagan
          toast.warning(
            "Bu ota-onaning Telegram chat ID'si yo'q. Avval ota-onaga ro'yxatdan o'tish havolasini yuboring.",
            { autoClose: 6000 }
          );
        }
      }
      
      // 3. SMS yuborish (keyinroq qo'shiladi)
      if (reminderForm.sendToSMS && selectedStudent.parentPhone) {
        // SMS API integratsiya qilinadi
        toast.info("SMS funksiyasi tez orada qo'shiladi");
      }
      
      // O'quvchiga eslatma yuborilganini belgilash
      await studentsAPI.update(selectedStudent.id, {
        lastReminderSent: new Date().toISOString(),
        reminderCount: (selectedStudent.reminderCount || 0) + 1
      });
      
      setShowReminderModal(false);
      setSelectedStudent(null);
      toast.success(`Eslatma ${sentCount} ta kanalga yuborildi!`);
      fetchData();
      
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setReminderLoading(false);
    }
  };

  // Yangi oylik hisob yaratish
  const handleCreateBill = async (e) => {
    e.preventDefault();
    if (!billForm.studentId || !billForm.month || !billForm.totalAmount) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }

    setFormLoading(true);
    try {
      const student = students.find(s => s.id === billForm.studentId);
      const group = groups.find(g => g.id === student?.groupId);

      // Mavjud bill bormi tekshirish
      const existing = monthlyBills.find(b => 
        b.studentId === billForm.studentId && b.month === billForm.month
      );

      if (existing) {
        toast.error("Bu oy uchun hisob allaqachon mavjud");
        setFormLoading(false);
        return;
      }

      const newBill = await paymentsAPI.createMonthlyBill({
        studentId: billForm.studentId,
        studentName: student?.fullName || '',
        groupId: student?.groupId || '',
        groupName: group?.name || '',
        month: billForm.month,
        totalAmount: parseInt(billForm.totalAmount),
        paidAmount: 0,
        remainingAmount: parseInt(billForm.totalAmount),
        status: 'pending',
        payments: []
      });

      setMonthlyBills([...monthlyBills, newBill]);
      setShowCreateBillModal(false);
      setBillForm({ studentId: '', month: '', totalAmount: '' });
      toast.success("Oylik hisob yaratildi");
    } catch (err) {
      console.error(err);
      toast.error("Xatolik");
    } finally {
      setFormLoading(false);
    }
  };

  // Statistika
  const getStats = () => {
    const currentMonth = selectedMonth;

    let totalDebt = 0;
    let totalPaid = 0;
    let debtors = 0;      // Qarz bor (to'lamagan)
    let partialPaid = 0;  // Qisman to'lagan
    let fullyPaid = 0;    // To'liq to'lagan

    students.forEach(student => {
      const status = getStudentPaymentStatus(student);
      totalDebt += status.debt;

      if (status.status === 'paid') {
        fullyPaid++;
      } else if (status.status === 'partial') {
        partialPaid++;
      } else if (status.debt > 0) {
        // debtor yoki pending - qarz bor bo'lsa qarzdor
        debtors++;
      }
    });

    // Bu oyda to'langan summa
    const currentMonthBills = monthlyBills.filter(b => b.month === currentMonth);
    totalPaid = currentMonthBills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);

    return { totalDebt, totalPaid, debtors, partialPaid, fullyPaid };
  };

  const stats = getStats();

  // Filtrlangan o'quvchilar
  const filteredStudents = students.filter(student => {
    // Qidiruv bo'yicha
    const matchesSearch = student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone?.includes(searchQuery);
    
    if (!matchesSearch) return false;

    // Guruh bo'yicha filter
    if (filterGroup !== 'all' && student.groupId !== filterGroup) {
      return false;
    }

    // Status bo'yicha filter
    if (filterStatus === 'all') return true;
    
    const status = getStudentPaymentStatus(student);
    
    // "Qarzdor" filterida - qarz bor bo'lgan barcha o'quvchilar
    if (filterStatus === 'debtor') {
      return status.debt > 0;
    }
    
    return status.status === filterStatus;
  });

  // Toggle student expansion
  const toggleStudentExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // ==================== BULK ACTIONS ====================
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const debtorIds = filteredStudents.filter(s => {
    const st = getStudentPaymentStatus(s);
    return st.debt > 0;
  }).map(s => s.id);

  const allDebtorsSelected = debtorIds.length > 0 && debtorIds.every(id => selectedStudentIds.has(id));
  const someBulkSelected = selectedStudentIds.size > 0;

  const toggleBulkSelectAll = () => {
    if (allDebtorsSelected) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(debtorIds));
    }
  };

  const toggleBulkSelect = (id) => {
    setSelectedStudentIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearBulkSelection = () => setSelectedStudentIds(new Set());

  // Bulk: bu oyda tanlangan o'quvchilarning qarzini to'langan deb belgilash
  const bulkMarkPaid = async () => {
    if (!window.confirm(`${selectedStudentIds.size} ta o'quvchining ${getMonthName(selectedMonth)} oyi to'lovini to'liq to'langan deb belgilaysizmi?`)) return;
    setBulkActionLoading(true);
    let success = 0;
    try {
      for (const studentId of selectedStudentIds) {
        const student = students.find(s => s.id === studentId);
        if (!student) continue;
        const bill = monthlyBills.find(b => b.studentId === studentId && b.month === selectedMonth);
        if (bill && bill.status !== 'paid') {
          const remaining = bill.remainingAmount || bill.totalAmount || 0;
          if (remaining > 0) {
            await paymentsAPI.markBillPaid(bill.id, {
              amount: remaining,
              method: 'Naqd',
              description: 'Toplu to\'lov',
              paidBy: userData?.fullName,
              paidAt: new Date().toISOString(),
            });
            success++;
          }
        }
      }
      toast.success(`${success} ta o'quvchi to'lovi belgilandi`);
      clearBulkSelection();
      await fetchData();
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Bulk: tanlangan o'quvchilarga eslatma yuborish
  const bulkSendReminders = async () => {
    if (selectedStudentIds.size === 0) return;
    setBulkActionLoading(true);
    let sent = 0;
    try {
      for (const studentId of selectedStudentIds) {
        const student = students.find(s => s.id === studentId);
        if (!student) continue;
        const debt = getStudentTotalDebt(studentId);
        const group = groups.find(g => g.id === student.groupId);
        const msg = `Hurmatli ${student.parentName || student.fullName}!\n\n` +
          `${student.fullName}ning "${group?.name || 'Guruh'}" to'lov eslatmasi.\n` +
          `💰 Qarz: ${formatMoney(debt)}\n` +
          `📅 ${getMonthName(selectedMonth)}\n\n` +
          `Iltimos, to'lovni amalga oshiring.\n— ${settings.centerName || "O'quv markazi"}`;
        await messagesAPI.create({
          title: "💰 To'lov eslatmasi",
          content: msg,
          type: 'payment_reminder',
          priority: 'high',
          recipientType: 'student',
          recipientId: studentId,
          recipientIds: [studentId],
          senderId: userData?.id,
          senderName: userData?.fullName,
          debt,
          read: false,
        });
        if (student.parentTelegramChatId && settings.telegramBotToken) {
          try {
            await sendTelegramMessage(
              settings.telegramBotToken,
              student.parentTelegramChatId,
              buildPaymentReminderText({ studentName: student.fullName, debt, centerName: settings.centerName, month: getMonthName(selectedMonth) })
            );
          } catch { /* silent */ }
        }
        sent++;
      }
      toast.success(`${sent} ta o'quvchiga eslatma yuborildi`);
      clearBulkSelection();
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Oy nomlari
  const getMonthName = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  // O'qituvchi oyligi hisoblash
  const getTeacherSalaryInfo = () => {
    if (!isTeacher || !userData?.id) return null;
    
    // groups allaqachon fetchData da filter qilingan - faqat o'qituvchining guruhlari
    const teacherGroups = groups;
    const totalStudents = students.length;
    
    // Guruhlar bo'yicha REJALI daromad (barcha o'quvchilar to'lasa)
    let plannedIncome = 0;
    teacherGroups.forEach(group => {
      const groupStudents = students.filter(s => s.groupId === group.id);
      const monthlyFee = parseInt(group.monthlyFee) || parseInt(group.price) || 0;
      plannedIncome += groupStudents.length * monthlyFee;
    });
    
    // HAQIQIY yig'ilgan pul (bu oy to'langan)
    const currentMonth = selectedMonth || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    let collectedIncome = 0;
    
    // monthlyBills dan bu oy to'langan summani hisoblash
    monthlyBills.forEach(bill => {
      // Faqat o'qituvchining o'quvchilari
      const isTeacherStudent = students.some(s => s.id === bill.studentId);
      if (isTeacherStudent && bill.month === currentMonth) {
        collectedIncome += bill.paidAmount || 0;
      }
    });
    
    // Agar monthlyBills bo'sh bo'lsa, payments dan hisoblash
    if (collectedIncome === 0) {
      payments.forEach(payment => {
        const isTeacherStudent = students.some(s => s.id === payment.studentId);
        if (isTeacherStudent) {
          let paymentMonth;
          if (payment.paidAt) {
            const date = typeof payment.paidAt === 'string' 
              ? new Date(payment.paidAt) 
              : payment.paidAt?.toDate?.() || new Date(payment.paidAt?.seconds * 1000);
            if (date && !isNaN(date)) {
              paymentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
          }
          if (paymentMonth === currentMonth) {
            collectedIncome += parseInt(payment.amount) || 0;
          }
        }
      });
    }
    
    // O'qituvchi ulushi foizi
    const teacherPercent = parseInt(settings.teacherPercent) || 40;
    
    // Ikki xil oylik hisoblash
    const plannedSalary = Math.round(plannedIncome * teacherPercent / 100);
    const collectedSalary = Math.round(collectedIncome * teacherPercent / 100);
    
    return {
      groups: teacherGroups.length,
      students: totalStudents,
      plannedIncome,      // Rejali daromad
      collectedIncome,    // Yig'ilgan pul
      percent: teacherPercent,
      plannedSalary,      // Rejali oylik
      collectedSalary     // Haqiqiy oylik (yig'ilgan puldan)
    };
  };

  const teacherSalary = getTeacherSalaryInfo();

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // ========== O'QUVCHI / OTA-ONA KO'RINISHI ==========
  if (isStudentOrParent) {
    const student = students[0]; // fetchData da topilgan student
    const studentId = student?.id; // To'g'ri studentId - students jadvalidan
    const studentBills = getStudentBills(studentId);
    const totalDebt = getStudentTotalDebt(studentId);
    
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mening to'lovlarim</h1>
          <p className="text-gray-500">{student?.fullName}</p>
        </div>

        {/* Qarz holati */}
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500">Joriy qarz</p>
              <p className={`text-3xl font-bold ${totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatMoney(totalDebt)}
              </p>
            </div>
            {totalDebt > 0 ? (
              <AlertTriangle className="w-12 h-12 text-red-500" />
            ) : (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
          </div>
          {totalDebt > 0 && (
            <p className="text-sm text-gray-500">
              Iltimos, to'lovni amalga oshiring yoki admin bilan bog'laning.
            </p>
          )}
        </Card>

        {/* Oylik to'lovlar */}
        <div>
          <h2 className="text-lg font-semibold mb-4">To'lov tarixi</h2>
          <div className="space-y-3">
            {studentBills.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500">To'lovlar mavjud emas</p>
              </Card>
            ) : (
              studentBills.map((bill, index) => (
                <Card key={index} padding="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{getMonthName(bill.month)}</span>
                    <Badge variant={
                      bill.status === 'paid' ? 'success' : 
                      bill.status === 'partial' ? 'warning' : 'danger'
                    }>
                      {bill.status === 'paid' ? "To'langan" : 
                       bill.status === 'partial' ? 'Qisman' : 'Kutilmoqda'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>To'langan: {formatMoney(bill.paidAmount)}</span>
                    <span>Jami: {formatMoney(bill.totalAmount)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        bill.status === 'paid' ? 'bg-green-500' : 
                        bill.status === 'partial' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min((bill.paidAmount / bill.totalAmount) * 100, 100)}%` }}
                    />
                  </div>
                  {bill.remainingAmount > 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Qoldi: {formatMoney(bill.remainingAmount)}
                    </p>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== O'QITUVCHI KO'RINISHI ==========
  if (isTeacher) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-500">Mening guruhlarim bo'yicha</p>
        </div>

        {/* O'qituvchi oyligi */}
        {teacherSalary && (
          <Card padding="p-6" className="bg-gradient-to-br from-blue-50 to-indigo-100">
            <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Mening oyligim
            </h2>
            
            {/* Asosiy ma'lumotlar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-blue-600">Guruhlar</p>
                <p className="text-2xl font-bold text-blue-800">{teacherSalary.groups}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">O'quvchilar</p>
                <p className="text-2xl font-bold text-blue-800">{teacherSalary.students}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Rejali daromad</p>
                <p className="text-2xl font-bold text-blue-800">{formatMoney(teacherSalary.plannedIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Yig'ilgan pul</p>
                <p className="text-2xl font-bold text-green-700">{formatMoney(teacherSalary.collectedIncome)}</p>
              </div>
            </div>
            
            {/* Oylik hisob-kitob */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
              <div className="p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Rejali oylik ({teacherSalary.percent}%)</p>
                <p className="text-xl font-bold text-gray-700">{formatMoney(teacherSalary.plannedSalary)}</p>
                <p className="text-xs text-gray-500 mt-1">Barcha o'quvchilar to'lasa</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg border-2 border-green-300">
                <p className="text-sm text-green-700 mb-1">Haqiqiy oylik ({teacherSalary.percent}%)</p>
                <p className="text-2xl font-bold text-green-700">{formatMoney(teacherSalary.collectedSalary)}</p>
                <p className="text-xs text-green-600 mt-1">Yig'ilgan puldan</p>
              </div>
            </div>
          </Card>
        )}

        {/* Statistika */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card padding="p-4" className="bg-red-50">
            <p className="text-2xl font-bold text-red-700">{formatMoney(stats.totalDebt)}</p>
            <p className="text-sm text-red-600">Umumiy qarz</p>
          </Card>
          <Card padding="p-4" className="bg-green-50">
            <p className="text-2xl font-bold text-green-700">{formatMoney(stats.totalPaid)}</p>
            <p className="text-sm text-green-600">Bu oy to'langan</p>
          </Card>
          <Card padding="p-4" className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.fullyPaid}</p>
            <p className="text-sm text-gray-500">To'langan</p>
          </Card>
          <Card padding="p-4" className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.partialPaid}</p>
            <p className="text-sm text-gray-500">Qisman</p>
          </Card>
        </div>

        {/* O'quvchilar ro'yxati */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="O'quvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <Card className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">O'quvchilar topilmadi</p>
            </Card>
          ) : (
            filteredStudents.map(student => {
              const status = getStudentPaymentStatus(student);
              return (
                <Card key={student.id} padding="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={student.fullName} />
                      <div>
                        <h3 className="font-medium">{student.fullName}</h3>
                        <p className="text-sm text-gray-500">
                          {groups.find(g => g.id === student.groupId)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {status.debt > 0 && (
                        <p className="text-red-600 font-semibold">{formatMoney(status.debt)} qarz</p>
                      )}
                      <Badge variant={
                        status.status === 'paid' ? 'success' : 
                        status.status === 'partial' ? 'warning' : 'danger'
                      }>
                        {status.status === 'paid' ? "To'langan" : 
                         status.status === 'partial' ? 'Qisman' : 'Kutilmoqda'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ========== ADMIN / DIREKTOR KO'RINISHI ==========
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ===== AUTO-REMINDER PANEL ===== */}
      {isAdmin && pendingReminders.length > 0 && !reminderDismissed && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">
                  {pendingReminders.length} ta o'quvchiga to'lov eslatmasi yuborilmagan
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Bugun to'lov muddati yaqinlashgan yoki o'tib ketgan o'quvchilar
                  {settings.telegramBotToken
                    ? ` — Telegram ulangan o'quvchilarga bot orqali yuboriladi`
                    : ` — faqat tizim ichida xabar yuboriladi`}
                </p>

                {/* Preview list — max 5 */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {pendingReminders.slice(0, 5).map(s => (
                    <span key={s.id} className="inline-flex items-center gap-1 text-xs bg-white border border-amber-200 rounded-full px-2.5 py-1 text-amber-800">
                      {s.fullName}
                      <span className="text-amber-500 font-medium">
                        {Number(s.debt).toLocaleString()} so'm
                      </span>
                      {s.parentTelegramChatId && settings.telegramBotToken && (
                        <Send className="w-3 h-3 text-blue-500 ml-0.5" />
                      )}
                    </span>
                  ))}
                  {pendingReminders.length > 5 && (
                    <span className="text-xs text-amber-600 self-center">
                      + {pendingReminders.length - 5} ta
                    </span>
                  )}
                </div>

                {/* Progress bar while sending */}
                {autoProgress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-amber-700 mb-1">
                      <span>Yuborilmoqda...</span>
                      <span>{autoProgress.done}/{autoProgress.total}</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-1.5">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(autoProgress.done / autoProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setReminderDismissed(true)}
                className="text-amber-500 hover:text-amber-700 text-sm px-2 py-1"
                disabled={autoSending}
              >
                Keyinroq
              </button>
              <Button
                size="sm"
                loading={autoSending}
                onClick={handleSendAllReminders}
                className="bg-amber-500 hover:bg-amber-600 text-white border-0"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Barchasiga yuborish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-500">Qisman to'lov tizimi</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowCreateBillModal(true)}>
            <Receipt className="w-4 h-4 mr-2" />
            Hisob yaratish
          </Button>
          <Button onClick={() => {
            setSelectedStudent(null);
            setShowPaymentModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            To'lov qabul qilish
          </Button>
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card padding="p-4" className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{formatMoney(stats.totalDebt)}</p>
              <p className="text-sm text-red-600">Umumiy qarz</p>
            </div>
          </div>
        </Card>

        <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{formatMoney(stats.totalPaid)}</p>
              <p className="text-sm text-green-600">Bu oy to'langan</p>
            </div>
          </div>
        </Card>

        <Card padding="p-4" className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.fullyPaid}</p>
          <p className="text-sm text-gray-500">To'langan</p>
        </Card>

        <Card padding="p-4" className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.partialPaid}</p>
          <p className="text-sm text-gray-500">Qisman</p>
        </Card>

        <Card padding="p-4" className="text-center">
          <p className="text-2xl font-bold text-red-600">{stats.debtors}</p>
          <p className="text-sm text-gray-500">Qarzdor</p>
        </Card>
      </div>

      {/* Filtrlar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="O'quvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Oy tanlash */}
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            />

            {/* Guruh filteri */}
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">Barcha guruhlar</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            {/* Status filteri */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">Barchasi</option>
              <option value="paid">To'langan</option>
              <option value="partial">Qisman</option>
              <option value="pending">Kutilmoqda</option>
              <option value="debtor">Qarzdor</option>
              <option value="free">Bepul</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bulk actions toolbar */}
      {someBulkSelected && isAdmin && (
        <div className="sticky top-0 z-20 bg-primary-600 text-white rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-lg">
          <span className="font-semibold text-sm">{selectedStudentIds.size} ta tanlandi</span>
          <div className="flex-1" />
          <button
            onClick={bulkMarkPaid}
            disabled={bulkActionLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition"
          >
            <CheckCircle className="w-4 h-4" /> To'langan deb belgilash
          </button>
          <button
            onClick={bulkSendReminders}
            disabled={bulkActionLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
          >
            <Bell className="w-4 h-4" /> Eslatma yuborish
          </button>
          <button onClick={clearBulkSelection} className="p-1.5 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barchani tanlash (faqat qarzdorlar bo'lsa) */}
      {isAdmin && debtorIds.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <button onClick={toggleBulkSelectAll} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition">
            {allDebtorsSelected
              ? <CheckSquare className="w-4 h-4 text-primary-600" />
              : <Square className="w-4 h-4" />}
            Barcha qarzdorlarni tanlash ({debtorIds.length} ta)
          </button>
        </div>
      )}

      {/* O'quvchilar ro'yxati */}
      <div className="space-y-3">
        {filteredStudents.map(student => {
          const status = getStudentPaymentStatus(student);
          const group = groups.find(g => g.id === student.groupId);
          const bills = getStudentBills(student.id);
          const isExpanded = expandedStudents[student.id];
          const isChecked = selectedStudentIds.has(student.id);

          return (
            <Card key={student.id} className={`overflow-hidden ${isChecked ? 'ring-2 ring-primary-400' : ''}`}>
              {/* Asosiy qator */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleStudentExpand(student.id)}
              >
                <div className="flex items-center gap-4">
                  {isAdmin && status.debt > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBulkSelect(student.id); }}
                      className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                    >
                      {isChecked
                        ? <CheckSquare className="w-4 h-4 text-primary-600" />
                        : <Square className="w-4 h-4 text-gray-400" />}
                    </button>
                  )}
                  <Avatar name={student.fullName} size="md" />
                  <div>
                    <h3 className="font-semibold">{student.fullName}</h3>
                    <p className="text-sm text-gray-500">{group?.name || 'Guruhsiz'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {student.isFree && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Bepul</span>
                  )}
                  {status.debt > 0 && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{formatMoney(status.debt)}</p>
                      <p className="text-xs text-gray-500">Qarz</p>
                    </div>
                  )}
                  
                  <Badge variant={status.color}>{status.label}</Badge>
                  
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Kengaytirilgan qism */}
              {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                  {/* Oylik hisoblar */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Oylik hisoblar</h4>
                    <div className="space-y-2">
                      {bills.map((bill, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            bill.status === 'paid' ? 'bg-green-50 border border-green-200' :
                            bill.status === 'partial' ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="font-medium">{getMonthName(bill.month)}</span>
                              {bill.appliedDiscount > 0 && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  -{bill.appliedDiscount}% skidka
                                </span>
                              )}
                              {bill.isProrated && (
                                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                  Kunlik hisob
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm">
                                <span className="text-green-600 font-medium">{formatMoney(bill.paidAmount || 0)}</span>
                                <span className="text-gray-400"> / </span>
                                {bill.appliedDiscount > 0 ? (
                                  <span>
                                    <span className="text-gray-400 line-through text-xs">{formatMoney(bill.totalAmount)}</span>
                                    <span className="text-gray-600 ml-1">{formatMoney(bill.discountedAmount || bill.totalAmount)}</span>
                                  </span>
                                ) : (
                                  <span className="text-gray-600">{formatMoney(bill.totalAmount)}</span>
                                )}
                              </p>
                              {bill.remainingAmount > 0 && (
                                <p className="text-xs text-red-500">Qarz: {formatMoney(bill.remainingAmount)}</p>
                              )}
                            </div>

                            {/* Progress bar */}
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${bill.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}
                                style={{ width: `${bill.totalAmount > 0 ? Math.min((bill.paidAmount || 0) / bill.totalAmount * 100, 100) : 0}%` }}
                              />
                            </div>

                            {bill.payments?.length > 0 && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBill(bill);
                                  setShowHistoryModal(true);
                                }}
                              >
                                <History className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tugmalar */}
                  {isAdmin && status.debt > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                          setPaymentForm({ ...paymentForm, amount: '' });
                          setShowPaymentModal(true);
                        }}
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        To'lov
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReminderModal(student);
                        }}
                        className="px-3"
                        title="Eslatma yuborish"
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        {filteredStudents.length === 0 && (
          <Card className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">O'quvchilar topilmadi</p>
          </Card>
        )}
      </div>

      {/* To'lov qabul qilish modali */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedStudent(null);
        }}
        title="To'lov qabul qilish"
      >
        <form onSubmit={handlePayment} className="space-y-4">
          {!selectedStudent ? (
            <Select
              label="O'quvchini tanlang"
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                const student = students.find(s => s.id === e.target.value);
                setSelectedStudent(student);
              }}
              options={students
                .filter(s => getStudentPaymentStatus(s).debt > 0)
                .map(s => ({ 
                  value: s.id, 
                  label: `${s.fullName} - Qarz: ${formatMoney(getStudentTotalDebt(s.id))}` 
                }))}
              placeholder="O'quvchini tanlang"
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={selectedStudent.fullName} size="md" />
                <div>
                  <h3 className="font-semibold">{selectedStudent.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    {groups.find(g => g.id === selectedStudent.groupId)?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Umumiy qarz:</span>
                <span className="text-xl font-bold text-red-700">
                  {formatMoney(getStudentTotalDebt(selectedStudent.id))}
                </span>
              </div>
            </div>
          )}

          {selectedStudent && (
            <>
              {/* Tez summa tugmalari */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tez tanlash</label>
                <div className="flex flex-wrap gap-2">
                  {[100000, 200000, 300000, 500000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, amount: amount.toString() })}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        paymentForm.amount === amount.toString() 
                          ? 'bg-primary-500 text-white border-primary-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {formatMoney(amount)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ 
                      ...paymentForm, 
                      amount: getStudentTotalDebt(selectedStudent.id).toString() 
                    })}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      paymentForm.amount === getStudentTotalDebt(selectedStudent.id).toString()
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'hover:bg-green-50 text-green-700 border-green-300'
                    }`}
                  >
                    To'liq: {formatMoney(getStudentTotalDebt(selectedStudent.id))}
                  </button>
                </div>
              </div>

              <Input
                type="number"
                label="To'lov summasi"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="0"
                required
              />

              <Select
                label="To'lov usuli"
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                options={[
                  { value: 'Naqd', label: 'Naqd pul' },
                  { value: 'Karta', label: 'Plastik karta' },
                  { value: 'Click', label: 'Click' },
                  { value: 'Payme', label: 'Payme' },
                  { value: "O'tkazma", label: "Bank o'tkazmasi" },
                ]}
              />

              {/* Skidka qismi - OYLIK NARXDAN chegirma */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                <label className="block text-sm font-medium text-blue-800">
                  Oylik to'lovdan chegirma
                </label>
                
                {/* Guruh narxi va chegirma */}
                {(() => {
                  const group = groups.find(g => g.id === selectedStudent?.groupId);
                  const monthlyFee = parseInt(group?.monthlyFee) || parseInt(group?.price) || 0;
                  const discountAmount = paymentForm.discountType === 'percent' 
                    ? Math.round(monthlyFee * (paymentForm.discount || 0) / 100)
                    : (paymentForm.discount || 0);
                  const discountedFee = monthlyFee - discountAmount;
                  
                  return (
                    <>
                      <div className="text-sm text-gray-600 bg-white p-2 rounded">
                        Guruh narxi: <strong>{formatMoney(monthlyFee)}</strong> / oy
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            value={paymentForm.discount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, discount: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <Select
                          value={paymentForm.discountType}
                          onChange={(e) => setPaymentForm({ ...paymentForm, discountType: e.target.value })}
                          options={[
                            { value: 'percent', label: '%' },
                            { value: 'amount', label: "so'm" },
                          ]}
                          className="w-24"
                        />
                      </div>
                      
                      {/* Tez chegirma tugmalari */}
                      <div className="flex flex-wrap gap-2">
                        {[5, 10, 15, 20, 25, 30].map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setPaymentForm({ ...paymentForm, discount: d, discountType: 'percent' })}
                            className={`px-3 py-1 rounded-full text-xs transition ${
                              paymentForm.discount === d && paymentForm.discountType === 'percent'
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white border hover:bg-blue-100'
                            }`}
                          >
                            -{d}%
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setPaymentForm({ ...paymentForm, discount: 0 })}
                          className={`px-3 py-1 rounded-full text-xs transition ${
                            paymentForm.discount === 0
                              ? 'bg-gray-500 text-white' 
                              : 'bg-white border hover:bg-gray-100'
                          }`}
                        >
                          Chegirmasiz
                        </button>
                      </div>
                      
                      {paymentForm.discount > 0 && (
                        <div className="text-sm bg-green-100 text-green-800 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span>Oylik narx:</span>
                            <span className="line-through text-gray-500">{formatMoney(monthlyFee)}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Chegirma ({paymentForm.discountType === 'percent' ? `${paymentForm.discount}%` : formatMoney(paymentForm.discount)}):</span>
                            <span className="text-red-600">-{formatMoney(discountAmount)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-1">
                            <span>O'quvchi to'laydi:</span>
                            <span>{formatMoney(discountedFee)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <Input
                label="Izoh (ixtiyoriy)"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                placeholder="Qo'shimcha ma'lumot..."
              />
            </>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              type="submit" 
              className="flex-1" 
              loading={formLoading}
              disabled={!selectedStudent || !paymentForm.amount}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              To'lovni qabul qilish
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedStudent(null);
              }}
            >
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* To'lovlar tarixi modali */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedBill(null);
        }}
        title={selectedBill ? `${getMonthName(selectedBill.month)} - To'lovlar tarixi` : "To'lovlar tarixi"}
      >
        {selectedBill && (
          <div className="space-y-4">
            {/* Umumiy ma'lumot */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Umumiy summa:</span>
                <span className="font-bold">{formatMoney(selectedBill.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">To'langan:</span>
                <span className="font-bold text-green-600">{formatMoney(selectedBill.paidAmount || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Qoldiq:</span>
                <span className="font-bold text-red-600">{formatMoney(selectedBill.remainingAmount || 0)}</span>
              </div>
              {/* Progress */}
              <div className="mt-3">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${selectedBill.totalAmount > 0 ? Math.min((selectedBill.paidAmount || 0) / selectedBill.totalAmount * 100, 100) : 0}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1 text-gray-500">
                  {selectedBill.totalAmount > 0 ? Math.round((selectedBill.paidAmount || 0) / selectedBill.totalAmount * 100) : 0}% to'langan
                </p>
              </div>
            </div>

            {/* To'lovlar ro'yxati */}
            <div>
              <h4 className="font-medium mb-2">To'lovlar</h4>
              <div className="space-y-2">
                {selectedBill.payments?.map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-green-700">{formatMoney(payment.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.paidAt)} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {payment.paidByName && <p>{payment.paidByName}</p>}
                      {payment.description && <p className="text-xs">{payment.description}</p>}
                    </div>
                  </div>
                ))}

                {(!selectedBill.payments || selectedBill.payments.length === 0) && (
                  <p className="text-center text-gray-500 py-4">To'lovlar yo'q</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Yangi hisob yaratish modali */}
      <Modal
        isOpen={showCreateBillModal}
        onClose={() => setShowCreateBillModal(false)}
        title="Yangi oylik hisob yaratish"
      >
        <form onSubmit={handleCreateBill} className="space-y-4">
          <Select
            label="O'quvchi"
            value={billForm.studentId}
            onChange={(e) => {
              const student = students.find(s => s.id === e.target.value);
              const group = groups.find(g => g.id === student?.groupId);
              setBillForm({ 
                ...billForm, 
                studentId: e.target.value,
                totalAmount: group?.monthlyFee || settings.defaultMonthlyFee || '500000'
              });
            }}
            options={students.map(s => ({ value: s.id, label: s.fullName }))}
            placeholder="O'quvchini tanlang"
            required
          />

          <Input
            type="month"
            label="Oy"
            value={billForm.month}
            onChange={(e) => setBillForm({ ...billForm, month: e.target.value })}
            required
          />

          <Input
            type="number"
            label="Summa"
            value={billForm.totalAmount}
            onChange={(e) => setBillForm({ ...billForm, totalAmount: e.target.value })}
            placeholder="500000"
            required
          />

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1" loading={formLoading}>
              Yaratish
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowCreateBillModal(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Eslatma yuborish modali */}
      <Modal
        isOpen={showReminderModal}
        onClose={() => {
          setShowReminderModal(false);
          setSelectedStudent(null);
        }}
        title="To'lov eslatmasi yuborish"
      >
        {selectedStudent && (
          <div className="space-y-4">
            {/* O'quvchi ma'lumotlari */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={selectedStudent.fullName} size="md" />
                <div>
                  <h3 className="font-semibold">{selectedStudent.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    {groups.find(g => g.id === selectedStudent.groupId)?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Qarz miqdori:</span>
                <span className="text-xl font-bold text-red-700">
                  {formatMoney(getStudentTotalDebt(selectedStudent.id))}
                </span>
              </div>
            </div>

            {/* Yuborish kanallari */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Qayerga yuborish:</label>
              
              {/* Profil */}
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={reminderForm.sendToProfile}
                  onChange={(e) => setReminderForm({ ...reminderForm, sendToProfile: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Profil (Xabarlar)</p>
                  <p className="text-sm text-gray-500">O'quvchi va ota-ona profiliga</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </label>

              {/* Telegram */}
              {(() => {
                const hasChatId = !!selectedStudent.parentTelegramChatId;
                const hasToken = !!settings.telegramBotToken;
                const canSend = hasChatId && hasToken;
                return (
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${canSend ? 'hover:bg-gray-50' : 'opacity-50'}`}>
                <input
                  type="checkbox"
                  checked={reminderForm.sendToTelegram}
                  onChange={(e) => setReminderForm({ ...reminderForm, sendToTelegram: e.target.checked })}
                  disabled={!canSend}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Send className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium">Telegram</p>
                  <p className="text-sm text-gray-500">
                    {canSend
                      ? "Bot orqali to'g'ridan-to'g'ri yuboriladi"
                      : !hasToken
                        ? "Bot sozlanmagan (Sozlamalar)"
                        : "Ota-ona Telegram botga ulanmagan"}
                  </p>
                </div>
                {canSend && <CheckCircle className="w-5 h-5 text-green-500" />}
              </label>
                );
              })()}

              {/* SMS */}
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedStudent.parentPhone ? 'hover:bg-gray-50' : 'opacity-50'}`}>
                <input
                  type="checkbox"
                  checked={reminderForm.sendToSMS}
                  onChange={(e) => setReminderForm({ ...reminderForm, sendToSMS: e.target.checked })}
                  disabled={!selectedStudent.parentPhone}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Phone className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.parentPhone || "Telefon kiritilmagan"}
                    {selectedStudent.parentPhone && <span className="text-yellow-600 ml-2">(Tez kunda)</span>}
                  </p>
                </div>
              </label>
            </div>

            {/* Maxsus xabar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maxsus xabar (ixtiyoriy)
              </label>
              <textarea
                value={reminderForm.customMessage}
                onChange={(e) => setReminderForm({ ...reminderForm, customMessage: e.target.value })}
                placeholder="Bo'sh qoldirsangiz, standart xabar yuboriladi..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Oldingi eslatmalar */}
            {selectedStudent.lastReminderSent && (
              <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                <p className="text-yellow-800">
                  <strong>Oxirgi eslatma:</strong> {formatDate(selectedStudent.lastReminderSent)}
                  {selectedStudent.reminderCount && ` (Jami: ${selectedStudent.reminderCount} marta)`}
                </p>
              </div>
            )}

            {/* Tugmalar */}
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleSendReminder}
                className="flex-1" 
                loading={reminderLoading}
                disabled={!reminderForm.sendToProfile && !reminderForm.sendToTelegram && !reminderForm.sendToSMS}
              >
                <Bell className="w-4 h-4 mr-2" />
                Eslatma yuborish
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowReminderModal(false);
                  setSelectedStudent(null);
                }}
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
