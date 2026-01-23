import { useState, useEffect } from 'react';
import { 
  Search, Plus, CreditCard, CheckCircle, Clock, AlertTriangle, Eye, 
  Users, Wallet, TrendingUp, Filter, Calendar, History, ArrowRight,
  DollarSign, PieChart, AlertCircle, ChevronDown, ChevronUp, Receipt
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading } from '../components/common';
import { paymentsAPI, studentsAPI, groupsAPI, settingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatMoney, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedStudents, setExpandedStudents] = useState({});

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'Naqd',
    description: ''
  });

  const [billForm, setBillForm] = useState({
    studentId: '',
    month: '',
    totalAmount: ''
  });

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  useEffect(() => {
    const now = new Date();
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, groupsData, paymentsData, billsData, settingsData] = await Promise.all([
        studentsAPI.getAll(),
        groupsAPI.getAll(),
        paymentsAPI.getAll(),
        paymentsAPI.getMonthlyBills ? paymentsAPI.getMonthlyBills() : [],
        settingsAPI.get()
      ]);

      setStudents(studentsData.filter(s => s.status === 'active'));
      setGroups(groupsData);
      setPayments(paymentsData);
      setSettings(settingsData || {});
      
      // Eski to'lovlarni monthly_bills formatiga o'tkazish
      const convertedBills = convertOldPaymentsToBills(paymentsData, billsData, studentsData, groupsData, settingsData);
      setMonthlyBills(convertedBills);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // Eski payments dan monthly_bills yaratish
  const convertOldPaymentsToBills = (oldPayments, existingBills, studentsData, groupsData, settingsData) => {
    const billsMap = {};
    
    // To'lovlarni ID bo'yicha indekslash (duplikatlarni oldini olish)
    const processedPaymentIds = new Set();
    
    // Avval mavjud monthly_bills ni qo'shish
    existingBills.forEach(bill => {
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
      if (!payment.studentId || payment.type === 'expense') return;
      
      // Agar bu to'lov allaqachon monthly_bills ga qo'shilgan bo'lsa, o'tkazib yuborish
      if (processedPaymentIds.has(payment.id)) return;
      
      // MUHIM: Yangi tizimda qo'shilgan to'lovlarni o'tkazib yuborish
      if (payment.alreadyInMonthlyBill === true) return;
      
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
    
    // MUHIM: Guruhning monthlyFee yoki price ni olish
    const groupMonthlyFee = parseInt(group?.monthlyFee) || parseInt(group?.price) || 0;
    const defaultFee = parseInt(settings.defaultMonthlyFee) || 500000;
    const monthlyFee = groupMonthlyFee > 0 ? groupMonthlyFee : defaultFee;

    return {
      studentId,
      month,
      totalAmount: monthlyFee,
      paidAmount: 0,
      remainingAmount: monthlyFee,
      status: 'pending',
      payments: [],
      isVirtual: true,
      groupName: group?.name || '',
      studentName: student?.fullName || ''
    };
  };

  // O'quvchining barcha oylik hisoblari
  const getStudentBills = (studentId) => {
    const studentBills = monthlyBills.filter(b => b.studentId === studentId);
    const student = students.find(s => s.id === studentId);
    
    // Joriy oy
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Agar o'quvchi shu oyda boshlagan bo'lsa, faqat joriy oyni ko'rsatish
    const startDate = student?.startDate ? new Date(student.startDate) : null;
    const startMonth = startDate ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}` : null;
    
    // Faqat joriy oyni ko'rsatish (qarz bo'lsa boshqa oylar ham ko'rinadi)
    const currentBill = studentBills.find(b => b.month === currentMonth) || getOrCreateMonthlyBill(studentId, currentMonth);
    
    // Qarzi bor oylarni ham qo'shish
    const debtBills = studentBills.filter(b => b.month !== currentMonth && b.remainingAmount > 0);
    
    // To'langan oylar (oxirgi 2 ta)
    const paidBills = studentBills
      .filter(b => b.month !== currentMonth && b.status === 'paid')
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 2);
    
    // Barcha billlarni birlashtirish
    const allBills = [currentBill, ...debtBills, ...paidBills];
    
    // Unique qilish va tartiblash
    const uniqueBills = allBills.filter((bill, index, self) => 
      index === self.findIndex(b => b.month === bill.month)
    );
    
    return uniqueBills.sort((a, b) => b.month.localeCompare(a.month));
  };

  // O'quvchi umumiy qarz (faqat joriy oy)
  const getStudentTotalDebt = (studentId) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentBill = monthlyBills.find(b => b.studentId === studentId && b.month === currentMonth) 
      || getOrCreateMonthlyBill(studentId, currentMonth);
    
    // Joriy oy + o'tgan oylarning qarzi
    const pastDebt = monthlyBills
      .filter(b => b.studentId === studentId && b.month < currentMonth && b.remainingAmount > 0)
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
    
    return (currentBill.remainingAmount || 0) + pastDebt;
  };

  // O'quvchi to'lov holati
  const getStudentPaymentStatus = (student) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Joriy oy uchun bill
    const currentBill = monthlyBills.find(b => b.studentId === student.id && b.month === currentMonth);
    
    // O'tgan oylarning qarzi
    const pastDebt = monthlyBills
      .filter(b => b.studentId === student.id && b.month < currentMonth && b.remainingAmount > 0)
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
    
    // Joriy oy qarzi
    const currentDebt = currentBill ? (currentBill.remainingAmount || 0) : 0;
    
    // Agar joriy oy uchun to'lov qilingan bo'lsa
    if (currentBill && currentBill.status === 'paid') {
      if (pastDebt > 0) {
        return { status: 'debtor', label: 'Qarzdor', color: 'danger', debt: pastDebt };
      }
      return { status: 'paid', label: "To'langan", color: 'success', debt: 0 };
    }
    
    // Qisman to'langan
    if (currentBill && currentBill.status === 'partial') {
      return { status: 'partial', label: 'Qisman', color: 'warning', debt: currentDebt + pastDebt };
    }
    
    // O'tgan oylar uchun qarz bor
    if (pastDebt > 0) {
      return { status: 'debtor', label: 'Qarzdor', color: 'danger', debt: currentDebt + pastDebt };
    }
    
    // Joriy oy - hech narsa to'lanmagan
    // O'quvchi qachon boshlagan tekshirish
    const startDate = student.startDate ? new Date(student.startDate) : null;
    const startMonth = startDate ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}` : null;
    
    // Agar o'quvchi joriy oyda boshlagan bo'lsa yoki bill mavjud emas
    if (!currentBill) {
      // Virtual bill yaratish
      const virtualBill = getOrCreateMonthlyBill(student.id, currentMonth);
      return { status: 'pending', label: 'Kutilmoqda', color: 'warning', debt: virtualBill.totalAmount };
    }
    
    return { status: 'pending', label: 'Kutilmoqda', color: 'warning', debt: currentDebt };
  };

  // To'lov qilish
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !paymentForm.amount) {
      toast.error("Summani kiriting");
      return;
    }

    setFormLoading(true);
    try {
      const amount = parseInt(paymentForm.amount);
      const student = students.find(s => s.id === selectedStudent.id);
      const group = groups.find(g => g.id === student?.groupId);

      // Eng eski qarzdan boshlab to'lash
      const bills = getStudentBills(selectedStudent.id)
        .filter(b => b.remainingAmount > 0)
        .sort((a, b) => a.month.localeCompare(b.month));

      let remainingPayment = amount;
      const updatedBills = [];

      for (const bill of bills) {
        if (remainingPayment <= 0) break;

        const paymentForThisBill = Math.min(remainingPayment, bill.remainingAmount);
        remainingPayment -= paymentForThisBill;

        const newPaidAmount = (bill.paidAmount || 0) + paymentForThisBill;
        const newRemainingAmount = bill.totalAmount - newPaidAmount;
        const newStatus = newRemainingAmount <= 0 ? 'paid' : 'partial';

        const paymentRecord = {
          amount: paymentForThisBill,
          method: paymentForm.method,
          description: paymentForm.description,
          paidAt: new Date().toISOString(),
          paidBy: userData?.id,
          paidByName: userData?.fullName
        };

        if (bill.isVirtual || !bill.id) {
          // Yangi bill yaratish
          const newBill = await paymentsAPI.createMonthlyBill({
            studentId: selectedStudent.id,
            studentName: student?.fullName || '',
            groupId: student?.groupId || '',
            groupName: group?.name || '',
            month: bill.month,
            totalAmount: bill.totalAmount,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            payments: [paymentRecord]
          });
          updatedBills.push(newBill);
        } else {
          // Mavjud billni yangilash
          const updatedBill = await paymentsAPI.updateMonthlyBill(bill.id, {
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            payments: [...(bill.payments || []), paymentRecord]
          });
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
        amount: amount,
        method: paymentForm.method,
        description: paymentForm.description,
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

      setShowPaymentModal(false);
      setPaymentForm({ amount: '', method: 'Naqd', description: '' });
      setSelectedStudent(null);
      toast.success(`${formatMoney(amount)} to'lov qabul qilindi!`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setFormLoading(false);
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
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    let totalDebt = 0;
    let totalPaid = 0;
    let debtors = 0;
    let partialPaid = 0;
    let fullyPaid = 0;

    students.forEach(student => {
      const status = getStudentPaymentStatus(student);
      totalDebt += status.debt;

      if (status.status === 'paid') fullyPaid++;
      else if (status.status === 'partial') partialPaid++;
      else if (status.status === 'debtor') debtors++;
    });

    // Bu oyda to'langan summa
    const currentMonthBills = monthlyBills.filter(b => b.month === currentMonth);
    totalPaid = currentMonthBills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);

    return { totalDebt, totalPaid, debtors, partialPaid, fullyPaid };
  };

  const stats = getStats();

  // Filtrlangan o'quvchilar
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone?.includes(searchQuery);
    
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    
    const status = getStudentPaymentStatus(student);
    return status.status === filterStatus;
  });

  // Toggle student expansion
  const toggleStudentExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Oy nomlari
  const getMonthName = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-500">Qisman to'lov tizimi</p>
        </div>
        
        {isAdmin && (
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
        )}
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
          
          <div className="flex items-center gap-2">
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
            </select>
          </div>
        </div>
      </Card>

      {/* O'quvchilar ro'yxati */}
      <div className="space-y-3">
        {filteredStudents.map(student => {
          const status = getStudentPaymentStatus(student);
          const group = groups.find(g => g.id === student.groupId);
          const bills = getStudentBills(student.id);
          const isExpanded = expandedStudents[student.id];

          return (
            <Card key={student.id} className="overflow-hidden">
              {/* Asosiy qator */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleStudentExpand(student.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar name={student.fullName} size="md" />
                  <div>
                    <h3 className="font-semibold">{student.fullName}</h3>
                    <p className="text-sm text-gray-500">{group?.name || 'Guruhsiz'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
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
                                style={{ width: `${(bill.paidAmount || 0) / bill.totalAmount * 100}%` }}
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

                  {/* To'lov tugmasi */}
                  {isAdmin && status.debt > 0 && (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                        setPaymentForm({ ...paymentForm, amount: '' });
                        setShowPaymentModal(true);
                      }}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      To'lov qabul qilish
                    </Button>
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
                    style={{ width: `${(selectedBill.paidAmount || 0) / selectedBill.totalAmount * 100}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1 text-gray-500">
                  {Math.round((selectedBill.paidAmount || 0) / selectedBill.totalAmount * 100)}% to'langan
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
    </div>
  );
};

export default Payments;
