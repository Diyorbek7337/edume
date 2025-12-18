import { useState, useEffect } from 'react';
import { 
  Search, Plus, CreditCard, CheckCircle, Clock, AlertTriangle, Eye, 
  Users, Wallet, Gift, TrendingUp, Filter, Percent, AlertCircle, Calendar
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { paymentsAPI, studentsAPI, groupsAPI, teachersAPI, settingsAPI, scheduleAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatMoney, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';


const Payments = () => {
  const { userData, role } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  // Sana bo‘yicha filtr (admin / direktor)
const [dateFilter, setDateFilter] = useState('month');
// today | week | month | range

const [customRange, setCustomRange] = useState({
  start: null,
  end: null,
});

// Guruh bo‘yicha filtr (pending & debtors)
const [groupFilter, setGroupFilter] = useState('');


  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ 
    studentId: '', amount: '', method: 'Naqd', type: 'monthly', description: '', discount: '0', month: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [myStudent, setMyStudent] = useState(null);
  const [teacherSalary, setTeacherSalary] = useState(0);
  const [schedule, setSchedule] = useState([]);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  useEffect(() => { fetchData(); }, []);

  // Oylik darslar sonini hisoblash
  const getLessonsPerMonth = (groupId) => {
    const groupSchedule = schedule.filter(s => s.groupId === groupId);
    // Har hafta necha dars
    const lessonsPerWeek = groupSchedule.length;
    // Oyda taxminan 4-5 hafta
    return lessonsPerWeek * 4; // O'rtacha 4 hafta
  };

  // Proporsional to'lov hisoblash
  const calculateProratedFee = (student, monthlyFee) => {
    if (!student.startDate || student.paymentType !== 'prorated') {
      return monthlyFee;
    }
    
    const startDate = new Date(student.startDate);
    const now = new Date();
    
    // Agar o'quvchi boshlagan oy hali bu oy bo'lsa
    if (startDate.getMonth() === now.getMonth() && startDate.getFullYear() === now.getFullYear()) {
      const totalLessons = getLessonsPerMonth(student.groupId) || 12; // Default 12
      const startDay = startDate.getDate();
      
      // Oyning qancha qismi qolganini hisoblash
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const remainingDays = daysInMonth - startDay + 1;
      const ratio = remainingDays / daysInMonth;
      
      // Proporsional to'lov
      const proratedAmount = Math.round(monthlyFee * ratio);
      return proratedAmount;
    }
    
    return monthlyFee;
  };


  const isInDateRange = (date, filter, range) => {
  if (!date) return false;

  const d = new Date(date);
  const now = new Date();

  if (filter === 'today') {
    return d.toDateString() === now.toDateString();
  }

  if (filter === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return d >= start && d <= now;
  }

  if (filter === 'month') {
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }

  if (filter === 'range' && range.start && range.end) {
    return d >= range.start && d <= range.end;
  }

  return false;
};

const paidPaymentsFiltered = payments.filter(p =>
  p.status === 'paid' &&
  isInDateRange(p.paidAt, dateFilter, customRange)
);

const paidTotalAmount = paidPaymentsFiltered.reduce(
  (sum, p) => sum + (p.amount || 0),
  0
);

const paidStudentsCount = new Set(
  paidPaymentsFiltered.map(p => p.studentId)
).size;

const getPendingStudents = () => {
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return students.filter(s => {
    const paidThisMonth = payments.some(p =>
      p.studentId === s.id &&
      p.status === 'paid' &&
      p.month === monthStr
    );

    const startDate = new Date(s.startDate);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return !paidThisMonth && startDate <= endOfMonth;
  });
};

const pendingStudents = getPendingStudents();

const pendingTotalAmount = pendingStudents.reduce(
  (sum, s) => sum + (s.monthlyFee || 0),
  0
);
const getDebtors = () => {
  const now = new Date();
  const lastMonthStr = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;

  return students.filter(s => {
    const startDate = new Date(s.startDate);
    if (startDate >= new Date(now.getFullYear(), now.getMonth(), 1)) return false;

    const paidLastMonth = payments.some(p =>
      p.studentId === s.id &&
      p.status === 'paid' &&
      p.month === lastMonthStr
    );

    return !paidLastMonth;
  });
};

const debtors = getDebtors();

const debtorsTotalAmount = debtors.reduce(
  (sum, s) => sum + (s.monthlyFee || 0),
  0
);
const paidStudents = students.filter(s =>
  payments.some(p =>
    p.studentId === s.id &&
    p.status === 'paid' &&
    isInDateRange(p.paidAt, dateFilter, customRange)
  )
);
const pendingFiltered = pendingStudents.filter(s =>
  groupFilter ? s.groupId === groupFilter : true
);

const debtorsFiltered = debtors.filter(s =>
  groupFilter ? s.groupId === groupFilter : true
);
  // Joriy oy uchun to'lov qilinganmi tekshirish
  const hasPaymentForMonth = (studentId, year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return payments.some(p => {
      if (p.studentId !== studentId) return false;
      if (p.status !== 'paid') return false;
      
      // month field yoki paidAt dan tekshirish
      if (p.month === monthStr) return true;
      
      if (p.paidAt) {
        let paidDate;
        if (typeof p.paidAt === 'string') {
          paidDate = new Date(p.paidAt);
        } else if (p.paidAt?.seconds) {
          paidDate = new Date(p.paidAt.seconds * 1000);
        } else if (p.paidAt?.toDate) {
          paidDate = p.paidAt.toDate();
        }
        if (paidDate) {
          const paidMonth = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}`;
          return paidMonth === monthStr;
        }
      }
      return false;
    });
  };

  // O'quvchi to'lov holati
  const getStudentPaymentStatus = (student) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const hasPaidCurrentMonth = hasPaymentForMonth(student.id, currentYear, currentMonth);
    const hasPaidLastMonth = hasPaymentForMonth(student.id, lastMonthYear, lastMonth);
    
    // Agar o'quvchi shu oyda boshlagan bo'lsa, oldingi oyni tekshirmaymiz
    const startDate = student.startDate ? new Date(student.startDate) : null;
    const startedThisMonth = startDate && 
      startDate.getMonth() === currentMonth && 
      startDate.getFullYear() === currentYear;
    
    if (!hasPaidCurrentMonth && !startedThisMonth) {
      if (!hasPaidLastMonth && !startedThisMonth) {
        return { status: 'debtor', label: 'Qarzdor', color: 'danger' }; // Oldingi oy uchun to'lamagan
      }
      return { status: 'pending', label: 'Kutilmoqda', color: 'warning' }; // Bu oy uchun to'lamagan
    }
    
    return { status: 'paid', label: "To'langan", color: 'success' };
  };

  const fetchData = async () => {
    try {
      const [settingsData, scheduleData] = await Promise.all([
        settingsAPI.get(),
        scheduleAPI.getAll()
      ]);
      setSettings(settingsData || {});
      setSchedule(scheduleData || []);
      
      let paymentsData = [];
      let studentsData = [];
      let groupsData = [];

      if (isAdmin) {
        [paymentsData, studentsData, groupsData] = await Promise.all([
          paymentsAPI.getAll(),
          studentsAPI.getAll(),
          groupsAPI.getAll()
        ]);
      } else if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        
        const allGroups = await groupsAPI.getAll();
        if (teacher) {
          groupsData = allGroups.filter(g => g.teacherId === teacher.id);
        }
        const groups2 = allGroups.filter(g => g.teacherId === userData?.id);
        groupsData = [...groupsData, ...groups2].filter((g, i, self) => 
          i === self.findIndex(t => t.id === g.id)
        );
        
        for (const group of groupsData) {
          const groupStudents = await studentsAPI.getByGroup(group.id);
          studentsData = [...studentsData, ...groupStudents];
        }
        studentsData = studentsData.filter((s, i, self) => i === self.findIndex(t => t.id === s.id));
        
        const allPayments = await paymentsAPI.getAll();
        const studentIds = studentsData.map(s => s.id);
        paymentsData = allPayments.filter(p => studentIds.includes(p.studentId));
        
        calculateTeacherSalary(studentsData, paymentsData, settingsData);
        
      } else if (isStudentOrParent) {
        const allStudents = await studentsAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        
        let foundStudent;
        if (role === ROLES.PARENT) {
          foundStudent = allStudents.find(s => 
            normalizePhone(s.parentPhone) === normalizePhone(userData?.phone)
          );
        } else {
          foundStudent = allStudents.find(s => 
            s.email === userData?.email ||
            normalizePhone(s.phone) === normalizePhone(userData?.phone)
          );
        }
        
        if (foundStudent) {
          setMyStudent(foundStudent);
          studentsData = [foundStudent];
          const allPayments = await paymentsAPI.getAll();
          paymentsData = allPayments.filter(p => p.studentId === foundStudent.id);
          
          if (foundStudent.groupId) {
            const allGroups = await groupsAPI.getAll();
            groupsData = allGroups.filter(g => g.id === foundStudent.groupId);
          }
        }
      }

      setPayments(paymentsData);
      setStudents(studentsData);
      setGroups(groupsData);
    } catch (err) { 
      console.error(err); 
      toast.error("Ma'lumotlarni yuklashda xatolik");
    }
    finally { setLoading(false); }
  };

  const calculateTeacherSalary = (studentsData, paymentsData, settingsData) => {
    if (!settingsData) return;
    
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const thisMonthPayments = paymentsData.filter(p => {
      if (p.status !== 'paid') return false;
      if (p.month === currentMonthStr) return true;
      
      if (p.paidAt) {
        let paidDate;
        if (typeof p.paidAt === 'string') paidDate = new Date(p.paidAt);
        else if (p.paidAt?.seconds) paidDate = new Date(p.paidAt.seconds * 1000);
        if (paidDate) {
          return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
        }
      }
      return false;
    });
    
    const totalRevenue = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    let salary = 0;
    switch (settingsData.teacherSalaryType) {
      case 'fixed':
        salary = parseInt(settingsData.teacherFixedSalary) || 0;
        break;
      case 'per_student':
        salary = studentsData.length * (parseInt(settingsData.teacherPerStudent) || 0);
        break;
      case 'percentage':
        salary = totalRevenue * ((parseInt(settingsData.teacherPercentage) || 0) / 100);
        break;
      default:
        salary = 0;
    }
    setTeacherSalary(salary);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const student = students.find(s => s.id === formData.studentId);
      const group = groups.find(g => g.id === student?.groupId);
      
      const finalAmount = parseInt(formData.amount) - (parseInt(formData.amount) * (parseInt(formData.discount) || 0) / 100);
      
      const now = new Date();
      const monthStr = formData.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const newPayment = await paymentsAPI.create({
        studentId: formData.studentId,
        studentName: student?.fullName || '',
        groupId: student?.groupId || '',
        groupName: group?.name || '',
        amount: finalAmount,
        originalAmount: parseInt(formData.amount),
        discount: parseInt(formData.discount) || 0,
        method: formData.method,
        type: formData.type,
        description: formData.description,
        month: monthStr, // Qaysi oy uchun to'lov
        status: 'paid',
        paidAt: new Date().toISOString()
      });
      
      setPayments([newPayment, ...payments]);
      setShowAddModal(false);
      setFormData({ studentId: '', amount: '', method: 'Naqd', type: 'monthly', description: '', discount: '0', month: '' });
      toast.success("To'lov qabul qilindi");
    } catch (err) { 
      console.error(err);
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  // Umumiy statistikalar
  const getStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    let debtors = 0;
    let pending = 0;
    let paid = 0;
    
    students.forEach(s => {
      const status = getStudentPaymentStatus(s);
      if (status.status === 'debtor') debtors++;
      else if (status.status === 'pending') pending++;
      else paid++;
    });
    
    return {
      totalPaid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0),
      paidCount: paid,
      pendingCount: pending,
      debtorsCount: debtors
    };
  };

  const stats = getStats();

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // O'quvchi/Ota-ona uchun
  if (isStudentOrParent) {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyFee = parseInt(settings.monthlyFee) || 0;
    const proratedFee = myStudent ? calculateProratedFee(myStudent, monthlyFee) : monthlyFee;
    const paymentStatus = myStudent ? getStudentPaymentStatus(myStudent) : null;
    
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
    const referralBonus = myStudent?.referralBonus || 0;
    
    // Bu oy uchun to'lov qilinganmi
    const hasPaidThisMonth = hasPaymentForMonth(myStudent?.id, now.getFullYear(), now.getMonth());
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlarim</h1>
          <p className="text-gray-500">To'lov tarixi va qarzdorlik</p>
        </div>

        {/* To'lov eslatmasi */}
        {!hasPaidThisMonth && paymentStatus?.status !== 'paid' && (
          <Card padding="p-4" className="border-2 border-orange-300 bg-orange-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  {paymentStatus?.status === 'debtor' 
                    ? "⚠️ Sizda qarzdorlik mavjud!" 
                    : "💰 Bu oy uchun to'lov qilish kerak"}
                </h3>
                <p className="mt-1 text-sm text-orange-700">
                  {paymentStatus?.status === 'debtor' 
                    ? "Oldingi oy uchun to'lov qilinmagan. Iltimos, to'lovni amalga oshiring."
                    : `${now.toLocaleString('uz-UZ', { month: 'long' })} oyi uchun to'lov qilish muddati keldi.`}
                </p>
                <p className="mt-2 text-lg font-bold text-orange-800">
                  To'lov summasi: {formatMoney(proratedFee)}
                  {proratedFee !== monthlyFee && (
                    <span className="ml-2 text-sm font-normal">(proporsional)</span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Statistika */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card padding="p-4" className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <p className="text-sm text-blue-600">Oylik to'lov</p>
              <p className="text-xl font-bold text-blue-700">{formatMoney(proratedFee)}</p>
              {proratedFee !== monthlyFee && (
                <p className="text-xs text-blue-500">(proporsional)</p>
              )}
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <p className="text-sm text-green-600">Jami to'langan</p>
              <p className="text-xl font-bold text-green-700">{formatMoney(totalPaid)}</p>
            </div>
          </Card>
          
          <Card padding="p-4" className={`bg-gradient-to-br ${paymentStatus?.status !== 'paid' ? 'from-red-50 to-red-100' : 'from-emerald-50 to-emerald-100'}`}>
            <div className="text-center">
              <p className={`text-sm ${paymentStatus?.status !== 'paid' ? 'text-red-600' : 'text-emerald-600'}`}>Holat</p>
              <p className={`text-xl font-bold ${paymentStatus?.status !== 'paid' ? 'text-red-700' : 'text-emerald-700'}`}>
                {paymentStatus?.label || '-'}
              </p>
            </div>
          </Card>
          
          {referralBonus > 0 && (
            <Card padding="p-4" className="bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-center">
                <p className="text-sm text-purple-600">Tavsiya mukofoti</p>
                <p className="text-xl font-bold text-purple-700">{formatMoney(referralBonus)}</p>
              </div>
            </Card>
          )}
        </div>

        {/* To'lov tarixi */}
        <Card>
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <CreditCard className="w-5 h-5 text-primary-600" />
            To'lov tarixi
          </h3>
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.sort((a, b) => {
                const dateA = a.paidAt?.seconds ? a.paidAt.seconds : new Date(a.paidAt || a.createdAt).getTime() / 1000;
                const dateB = b.paidAt?.seconds ? b.paidAt.seconds : new Date(b.paidAt || b.createdAt).getTime() / 1000;
                return dateB - dateA;
              }).map(payment => (
                <div key={payment.id} className={`p-4 rounded-lg border-l-4 ${
                  payment.status === 'paid' ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {payment.month ? `${payment.month} oyi uchun` : (payment.type === 'monthly' ? 'Oylik to\'lov' : payment.description)}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(payment.paidAt || payment.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatMoney(payment.amount)}</p>
                      <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                        {payment.status === 'paid' ? 'To\'langan' : 'Kutilmoqda'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={CreditCard} title="To'lovlar yo'q" description="Hali to'lov qilinmagan" />
          )}
        </Card>
      </div>
    );
  }

  // O'qituvchi uchun
  if (isTeacher) {
    const now = new Date();
    const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-500">O'quvchilar to'lovlari va maosh</p>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <p className="text-sm text-green-600">Jami tushum</p>
              <p className="text-xl font-bold text-green-700">{formatMoney(stats.totalPaid)}</p>
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-center">
              <p className="text-sm text-yellow-600">Kutilmoqda ({monthNames[now.getMonth()]})</p>
              <p className="text-xl font-bold text-yellow-700">{stats.pendingCount}</p>
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-center">
              <p className="text-sm text-red-600">Qarzdorlar</p>
              <p className="text-xl font-bold text-red-700">{stats.debtorsCount}</p>
            </div>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-center">
              <p className="text-sm text-purple-600">Mening maoshim</p>
              <p className="text-xl font-bold text-purple-700">{formatMoney(teacherSalary)}</p>
              <p className="text-xs text-purple-500">
                {settings.teacherSalaryType === 'fixed' && 'Qat\'iy oylik'}
                {settings.teacherSalaryType === 'per_student' && `${students.length} x ${formatMoney(parseInt(settings.teacherPerStudent) || 0)}`}
                {settings.teacherSalaryType === 'percentage' && `${settings.teacherPercentage}% dan`}
              </p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 pb-2 overflow-x-auto border-b">
          {[
            { id: 'students', label: "O'quvchilar", count: students.length },
            { id: 'pending', label: `Kutilmoqda (${monthNames[now.getMonth()]})`, count: stats.pendingCount },
            { id: 'debtors', label: 'Qarzdorlar', count: stats.debtorsCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <Badge variant={tab.id === 'debtors' ? 'danger' : tab.id === 'pending' ? 'warning' : 'default'}>{tab.count}</Badge>
            </button>
          ))}
        </div>

        {/* O'quvchilar ro'yxati */}
        {activeTab === 'students' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">O'quvchi</th>
                    <th className="px-4 py-3 text-left">Guruh</th>
                    <th className="px-4 py-3 text-center">Holat</th>
                    <th className="px-4 py-3 text-right">Telefon</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map(student => {
                    const status = getStudentPaymentStatus(student);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.fullName} size="sm" />
                            <span className="font-medium">{student.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{student.groupName}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={status.color}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">{student.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Kutilmoqda */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {students.filter(s => getStudentPaymentStatus(s).status === 'pending').map(student => (
              <Card key={student.id} className="border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={student.fullName} />
                    <div>
                      <p className="font-semibold">{student.fullName}</p>
                      <p className="text-sm text-gray-500">{student.groupName} • {student.phone}</p>
                    </div>
                  </div>
                  <Badge variant="warning">Kutilmoqda</Badge>
                </div>
              </Card>
            ))}
            {stats.pendingCount === 0 && (
              <Card><EmptyState icon={CheckCircle} title="Hammasi to'lagan" description="Bu oy uchun barcha o'quvchilar to'lov qilgan" /></Card>
            )}
          </div>
        )}

        {/* Qarzdorlar */}
        {activeTab === 'debtors' && (
          <div className="space-y-3">
            {students.filter(s => getStudentPaymentStatus(s).status === 'debtor').map(student => (
              <Card key={student.id} className="border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={student.fullName} />
                    <div>
                      <p className="font-semibold">{student.fullName}</p>
                      <p className="text-sm text-gray-500">{student.groupName} • {student.phone}</p>
                    </div>
                  </div>
                  <Badge variant="danger">Qarzdor</Badge>
                </div>
              </Card>
            ))}
            {stats.debtorsCount === 0 && (
              <Card><EmptyState icon={CheckCircle} title="Qarzdorlar yo'q" /></Card>
            )}
          </div>
        )}
      </div>
    );
  }

  // Admin uchun
  const now = new Date();
  const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const getFilteredStudents = () => {
    let filtered = students.filter(s => 
      s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.includes(searchQuery)
    );
    
    if (activeTab === 'pending') {
      filtered = filtered.filter(s => getStudentPaymentStatus(s).status === 'pending');
    } else if (activeTab === 'debtors') {
      filtered = filtered.filter(s => getStudentPaymentStatus(s).status === 'debtor');
    }
    
    return filtered;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p className="text-gray-500">To'lovlarni boshqarish - {monthNames[now.getMonth()]} {now.getFullYear()}</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>To'lov qabul qilish</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600">To'lagan</p>
              <p className="text-xl font-bold text-green-700">{stats.paidCount}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="p-4" className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Kutilmoqda</p>
              <p className="text-xl font-bold text-yellow-700">{stats.pendingCount}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="p-4" className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600">Qarzdorlar</p>
              <p className="text-xl font-bold text-red-700">{stats.debtorsCount}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="p-4" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Jami tushum</p>
              <p className="text-lg font-bold text-blue-700">{formatMoney(stats.totalPaid)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card padding="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'students', label: "Barcha o'quvchilar", icon: Users },
              { id: 'pending', label: `Kutilmoqda`, icon: Clock },
              { id: 'debtors', label: 'Qarzdorlar', icon: AlertTriangle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>O'quvchi</Table.Header>
              <Table.Header>Guruh</Table.Header>
              <Table.Header>Boshlangan</Table.Header>
              <Table.Header>Holat</Table.Header>
              <Table.Header></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {getFilteredStudents().map(student => {
              const status = getStudentPaymentStatus(student);
              const proratedFee = calculateProratedFee(student, parseInt(settings.monthlyFee) || 0);
              
              return (
                <Table.Row key={student.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.fullName} size="sm" />
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-xs text-gray-500">{student.phone}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell><Badge variant="primary">{student.groupName || '-'}</Badge></Table.Cell>
                  <Table.Cell>{student.startDate || '-'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={status.color}>{status.label}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {status.status !== 'paid' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            studentId: student.id, 
                            amount: String(proratedFee),
                            month: currentMonthStr
                          });
                          setShowAddModal(true);
                        }}
                      >
                        To'lov ({formatMoney(proratedFee)})
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        {getFilteredStudents().length === 0 && (
          <div className="p-8">
            <EmptyState icon={Users} title="O'quvchilar topilmadi" />
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="To'lov qabul qilish" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Select
            label="O'quvchi"
            value={formData.studentId}
            onChange={(e) => {
              const student = students.find(s => s.id === e.target.value);
              const proratedFee = student ? calculateProratedFee(student, parseInt(settings.monthlyFee) || 0) : '';
              setFormData({ ...formData, studentId: e.target.value, amount: String(proratedFee) });
            }}
            options={students.map(s => ({ 
              value: s.id, 
              label: `${s.fullName} (${s.groupName || 'Guruh yo\'q'}) - ${getStudentPaymentStatus(s).label}` 
            }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Summa (so'm)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Input
              label="Chegirma (%)"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              min="0"
              max="100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Qaysi oy uchun"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              options={[
                { value: currentMonthStr, label: `${monthNames[now.getMonth()]} ${now.getFullYear()}` },
                { value: `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`, label: `${monthNames[now.getMonth() - 1] || monthNames[11]} ${now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()}` },
              ]}
            />
            <Select
              label="To'lov usuli"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              options={[
                { value: 'Naqd', label: 'Naqd pul' },
                { value: 'Karta', label: 'Bank kartasi' },
                { value: 'Click', label: 'Click' },
                { value: 'Payme', label: 'Payme' },
              ]}
            />
          </div>
          {formData.amount && formData.discount > 0 && (
            <div className="p-3 rounded-lg bg-green-50">
              <p className="text-sm text-green-700">
                Chegirma bilan: <strong>{formatMoney(parseInt(formData.amount) - (parseInt(formData.amount) * parseInt(formData.discount) / 100))}</strong>
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Qabul qilish</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
