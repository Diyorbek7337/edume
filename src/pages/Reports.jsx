import { useState, useEffect } from 'react';
import {
  Download, FileText, Users, CreditCard, CalendarCheck, TrendingUp,
  BarChart3, PieChart as PieChartIcon, Calendar, Filter, AlertTriangle,
  TrendingDown, Percent, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, Button, Badge, Loading } from '../components/common';
import { studentsAPI, teachersAPI, groupsAPI, paymentsAPI, attendanceAPI, gradesAPI } from '../services/api';
import { formatMoney, formatDate } from '../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('all');
  
  const [stats, setStats] = useState({
    students: 0, activeStudents: 0, teachers: 0, groups: 0,
    revenue: 0, pendingPayments: 0, attendanceRate: 0, avgGrade: 0
  });
  
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [groupDistribution, setGroupDistribution] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Moliyaviy tahlil uchun qo'shimcha state
  const [revenueByGroup, setRevenueByGroup] = useState([]);
  const [debtAging, setDebtAging] = useState([]);
  const [topDebtors, setTopDebtors] = useState([]);
  const [collectionRate, setCollectionRate] = useState(0);
  const [monthComparison, setMonthComparison] = useState({ current: 0, previous: 0, growth: 0 });
  const [forecastRevenue, setForecastRevenue] = useState(0);
  const [totalDebtAmount, setTotalDebtAmount] = useState(0);
  const [allDebtorsCount, setAllDebtorsCount] = useState(0);

  useEffect(() => { fetchData(); }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsData, teachersData, groupsData, paymentsData] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
        groupsAPI.getAll(),
        paymentsAPI.getAll()
      ]);
      
      setStudents(studentsData);
      setTeachers(teachersData);
      setGroups(groupsData);
      setPayments(paymentsData);
      
      
      // Davomat va baholarni olish
      let allAttendance = [];
      let allGrades = [];
      for (const group of groupsData) {
        try {
          const att = await attendanceAPI.getByGroup(group.id);
          const grd = await gradesAPI.getByGroup(group.id);
          allAttendance = [...allAttendance, ...att];
          allGrades = [...allGrades, ...grd];
        } catch (err) {
          console.error('Error fetching group data:', err);
        }
      }
      setAttendance(allAttendance);
      setGrades(allGrades);
      
      
      // Statistika hisoblash - period filter'siz
      const paidPayments = paymentsData.filter(p => p.status === 'paid');
      const pendingPaymentsList = paymentsData.filter(p => p.status === 'pending');
      const presentCount = allAttendance.filter(a => a.status === 'present').length;
      const attendanceRate = allAttendance.length > 0 
        ? Math.round((presentCount / allAttendance.length) * 100) : 0;
      const avgGrade = allGrades.length > 0
        ? Math.round(allGrades.reduce((sum, g) => sum + ((g.grade / g.maxGrade) * 100), 0) / allGrades.length) : 0;
      
      setStats({
        students: studentsData.length,
        activeStudents: studentsData.filter(s => s.status === 'active').length,
        teachers: teachersData.length,
        groups: groupsData.length,
        revenue: paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        pendingPayments: pendingPaymentsList.reduce((sum, p) => sum + (p.amount || 0), 0),
        attendanceRate,
        avgGrade
      });
      
      // Oylik daromad grafigi (oxirgi 6 oy)
      const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const revenueByMonth = [];
      
      for (let i = 5; i >= 0; i--) {
        const month = (thisMonth - i + 12) % 12;
        const year = thisMonth - i < 0 ? thisYear - 1 : thisYear;
        const monthPayments = paymentsData.filter(p => {
          if (p.status !== 'paid') return false;
          let paidDate;
          if (p.paidAt?.seconds) {
            paidDate = new Date(p.paidAt.seconds * 1000);
          } else if (p.paidAt?.toDate) {
            paidDate = p.paidAt.toDate();
          } else if (p.paidAt) {
            paidDate = new Date(p.paidAt);
          } else if (p.createdAt?.seconds) {
            paidDate = new Date(p.createdAt.seconds * 1000);
          } else if (p.createdAt?.toDate) {
            paidDate = p.createdAt.toDate();
          } else {
            paidDate = new Date(p.createdAt);
          }
          return paidDate.getMonth() === month && paidDate.getFullYear() === year;
        });
        revenueByMonth.push({ 
          name: monthNames[month], 
          revenue: monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 1000000,
          count: monthPayments.length
        });
      }
      setMonthlyRevenue(revenueByMonth);
      
      // Guruhlar bo'yicha taqsimot
      const gStats = [];
      for (const g of groupsData) {
        const groupStudents = studentsData.filter(s => s.groupId === g.id);
        if (groupStudents.length > 0) {
          gStats.push({ name: g.name, students: groupStudents.length });
        }
      }
      setGroupDistribution(gStats);
      
      // Davomat trendi (oxirgi 7 kun)
      const attendanceTrendData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const dayAttendance = allAttendance.filter(a => a.date === dateStr);
        const present = dayAttendance.filter(a => a.status === 'present').length;
        const total = dayAttendance.length;
        attendanceTrendData.push({
          name: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'][date.getDay()],
          rate: total > 0 ? Math.round((present / total) * 100) : 0,
          present,
          total
        });
      }
      setAttendanceTrend(attendanceTrendData);
      
      // To'lov usullari
      const methods = {};
      paidPayments.forEach(p => {
        const method = p.method || 'Naqd';
        methods[method] = (methods[method] || 0) + (p.amount || 0);
      });
      setPaymentMethods(Object.entries(methods).map(([name, value]) => ({
        name,
        value: value / 1000000
      })));

      // ===== MOLIYAVIY TAHLIL =====

      // Monthly bills (joriy oy va o'tgan oy)
      let allBills = [];
      try { allBills = await paymentsAPI.getMonthlyBills() || []; } catch { allBills = []; }

      const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

      // Collection rate: bu oy to'langan / bu oy jami bill
      const thisMonthBills = allBills.filter(b => b.month === thisMonthStr);
      const totalBilled = thisMonthBills.reduce((s, b) => s + (b.totalAmount || 0), 0);
      const totalCollected = thisMonthBills.reduce((s, b) => s + (b.paidAmount || 0), 0);
      setCollectionRate(totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0);

      // Bu oy va o'tgan oy daromad taqqoslash
      const currentMonthRevenue = paymentsData
        .filter(p => {
          if (p.status !== 'paid') return false;
          const d = p.paidAt?.toDate ? p.paidAt.toDate() : new Date(p.paidAt || p.createdAt);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === thisMonthStr;
        })
        .reduce((s, p) => s + (p.amount || 0), 0);

      const prevMonthRevenue = paymentsData
        .filter(p => {
          if (p.status !== 'paid') return false;
          const d = p.paidAt?.toDate ? p.paidAt.toDate() : new Date(p.paidAt || p.createdAt);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === prevMonthStr;
        })
        .reduce((s, p) => s + (p.amount || 0), 0);

      const growth = prevMonthRevenue > 0
        ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
        : 0;
      setMonthComparison({ current: currentMonthRevenue, previous: prevMonthRevenue, growth });

      // Guruh bo'yicha daromad (bu oy)
      const groupRevenue = groupsData.map(g => {
        const groupBills = thisMonthBills.filter(b => b.groupId === g.id);
        const billed = groupBills.reduce((s, b) => s + (b.totalAmount || 0), 0);
        const collected = groupBills.reduce((s, b) => s + (b.paidAmount || 0), 0);
        const remaining = billed - collected;
        return { name: g.name, billed, collected, remaining };
      }).filter(g => g.billed > 0);
      setRevenueByGroup(groupRevenue);

      // Top qarzdorlar
      const debtorMap = {};
      allBills.forEach(b => {
        if ((b.remainingAmount || 0) > 0 && !b.isFree) {
          debtorMap[b.studentId] = {
            name: b.studentName || '—',
            groupName: b.groupName || '—',
            debt: (debtorMap[b.studentId]?.debt || 0) + b.remainingAmount,
          };
        }
      });
      const allDebtorsList = Object.values(debtorMap).sort((a, b) => b.debt - a.debt);
      setAllDebtorsCount(allDebtorsList.length);
      setTotalDebtAmount(allDebtorsList.reduce((s, d) => s + d.debt, 0));
      const sortedDebtors = allDebtorsList.slice(0, 8);
      setTopDebtors(sortedDebtors);

      // Qarz yoshi (aging): unpaid bills by month count
      const agingBuckets = { '1 oy': 0, '2 oy': 0, '3+ oy': 0 };
      allBills.forEach(b => {
        if ((b.remainingAmount || 0) <= 0 || b.isFree) return;
        const [yr, mo] = b.month.split('-').map(Number);
        const billDate = new Date(yr, mo - 1, 1);
        const diffMonths = (now.getFullYear() - billDate.getFullYear()) * 12 + (now.getMonth() - billDate.getMonth());
        if (diffMonths <= 1) agingBuckets['1 oy'] += b.remainingAmount;
        else if (diffMonths === 2) agingBuckets['2 oy'] += b.remainingAmount;
        else agingBuckets['3+ oy'] += b.remainingAmount;
      });
      setDebtAging(Object.entries(agingBuckets).map(([name, value]) => ({ name, value: value / 1000000 })));

      // Daromad prognozi: faol o'quvchilar × guruh narxi
      let forecast = 0;
      groupsData.forEach(g => {
        const fee = parseInt(g.monthlyFee) || parseInt(g.price) || 0;
        const cnt = studentsData.filter(s => s.groupId === g.id && s.status === 'active' && !s.isFree).length;
        forecast += fee * cnt;
      });
      setForecastRevenue(forecast);

    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  const exportStudentsCSV = () => {
    const headers = ["#", "Ism", "Telefon", "Email", "Guruh", "Holat"];
    const rows = students.map((s, i) => [i + 1, s.fullName, s.phone, s.email, s.groupName, s.status]);
    downloadCSV(headers, rows, 'students.csv');
  };

  const exportPaymentsCSV = () => {
    const headers = ["#", "O'quvchi", "Summa", "Usul", "Holat", "Sana"];
    const rows = payments.map((p, i) => [
      i + 1, p.studentName, p.amount, p.method, p.status, formatDate(p.paidAt || p.createdAt)
    ]);
    downloadCSV(headers, rows, 'payments.csv');
  };

  const downloadCSV = (headers, rows, filename) => {
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hisobotlar va Tahlil</h1>
          <p className="text-gray-500">Statistika va grafik tahlil</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Umumiy', icon: BarChart3 },
          { id: 'finance', label: 'Moliya', icon: CreditCard },
          { id: 'attendance', label: 'Davomat', icon: CalendarCheck },
          { id: 'export', label: 'Eksport', icon: Download },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="p-4" className="bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">O'quvchilar</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.students}</p>
                  <p className="text-xs text-blue-500">{stats.activeStudents} faol</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </Card>
            
            <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Jami daromad</p>
                  <p className="text-xl font-bold text-green-700">{formatMoney(stats.revenue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </Card>
            
            <Card padding="p-4" className="bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Davomat</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.attendanceRate}%</p>
                </div>
                <CalendarCheck className="w-8 h-8 text-purple-400" />
              </div>
            </Card>
            
            <Card padding="p-4" className="bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">O'rtacha baho</p>
                  <p className="text-2xl font-bold text-orange-700">{stats.avgGrade}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-400" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Oylik daromad (mln so'm)
              </h3>
              <div className="h-64">
                {monthlyRevenue.some(m => m.revenue > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)} mln`, 'Daromad']} />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#93C5FD" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    To'lovlar yo'q
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-primary-600" />
                Guruhlar bo'yicha o'quvchilar
              </h3>
              <div className="h-64">
                {groupDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={groupDistribution}
                        dataKey="students"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, students }) => `${name}: ${students}`}
                      >
                        {groupDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Guruhlar yo'q
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Davomat trendi (oxirgi 7 kun)
              </h3>
              <div className="h-64">
                {attendanceTrend.some(a => a.total > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Davomat']} />
                      <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Davomat ma'lumotlari yo'q
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                To'lov usullari
              </h3>
              <div className="h-64">
                {paymentMethods.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentMethods} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)} mln`, 'Summa']} />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    To'lovlar yo'q
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
        <>
          {/* KPI kartalar — 5 ta */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card padding="p-4" className="bg-green-50 border-green-200">
              <p className="text-xs text-green-600 font-medium">Jami tushum</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{formatMoney(stats.revenue)}</p>
              <p className="text-xs text-green-500 mt-1">{payments.filter(p => p.status === 'paid').length} ta to'lov</p>
            </Card>

            <Card padding="p-4" className="bg-red-50 border-red-200">
              <p className="text-xs text-red-600 font-medium">Umumiy qarz</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{formatMoney(totalDebtAmount)}</p>
              <p className="text-xs text-red-500 mt-1">{allDebtorsCount} ta qarzdor</p>
            </Card>

            <Card padding="p-4" className="bg-blue-50 border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Inkasso stavkasi</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{collectionRate}%</p>
              <p className="text-xs text-blue-500 mt-1">Bu oy yig'ildi</p>
            </Card>

            <Card padding="p-4" className={monthComparison.growth >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}>
              <p className={`text-xs font-medium ${monthComparison.growth >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>Bu oy o'sish</p>
              <div className="flex items-center gap-1 mt-1">
                {monthComparison.growth >= 0
                  ? <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                  : <ArrowDownRight className="w-5 h-5 text-orange-600" />}
                <p className={`text-2xl font-bold ${monthComparison.growth >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                  {monthComparison.growth >= 0 ? '+' : ''}{monthComparison.growth}%
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{formatMoney(monthComparison.current)}</p>
            </Card>

            <Card padding="p-4" className="bg-purple-50 border-purple-200">
              <p className="text-xs text-purple-600 font-medium">Prognoz (joriy oy)</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{formatMoney(forecastRevenue)}</p>
              <p className="text-xs text-purple-500 mt-1">Barcha o'quvchilar to'lasa</p>
            </Card>
          </div>

          {/* Oylik taqqoslash + To'lov usullari */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Oylik daromad (mln so'm)
              </h3>
              <div className="h-64">
                {monthlyRevenue.some(m => m.revenue > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(v) => [`${v.toFixed(1)} mln`, 'Daromad']} />
                      <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">To'lovlar yo'q</div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                To'lov usullari
              </h3>
              <div className="h-64">
                {paymentMethods.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentMethods} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(v) => [`${v.toFixed(1)} mln`, 'Summa']} />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">To'lovlar yo'q</div>
                )}
              </div>
            </Card>
          </div>

          {/* Guruh bo'yicha daromad */}
          {revenueByGroup.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                Guruh bo'yicha (joriy oy, mln so'm)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByGroup.map(g => ({
                    name: g.name,
                    "To'langan": +(g.collected / 1000000).toFixed(2),
                    "Qoldi": +(g.remaining / 1000000).toFixed(2),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={(v, n) => [`${v} mln`, n]} />
                    <Legend />
                    <Bar dataKey="To'langan" stackId="a" fill="#10B981" />
                    <Bar dataKey="Qoldi" stackId="a" fill="#F87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Qarz yoshi + Top qarzdorlar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Qarz yoshi (mln so'm)
              </h3>
              <p className="text-xs text-gray-500 mb-4">Muddati o'tgan to'lovlar qancha vaqtdan beri kutmoqda</p>
              <div className="h-48">
                {debtAging.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={debtAging}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(v) => [`${v.toFixed(2)} mln`, 'Qarz']} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {debtAging.map((_, i) => (
                          <Cell key={i} fill={['#FCD34D', '#F97316', '#EF4444'][i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-green-600 font-medium">Qarzdorlik yo'q!</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Top qarzdorlar
              </h3>
              {topDebtors.length > 0 ? (
                <div className="space-y-2">
                  {topDebtors.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-400' : i === 2 ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{d.name}</p>
                        <p className="text-xs text-gray-500 truncate">{d.groupName}</p>
                      </div>
                      <span className="text-sm font-bold text-red-600 flex-shrink-0">{formatMoney(d.debt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">Qarzdorlar yo'q</p>
              )}
            </Card>
          </div>

          {/* Inkasso progress */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Joriy oy inkasso
              </h3>
              <span className={`text-2xl font-bold ${collectionRate >= 80 ? 'text-green-600' : collectionRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {collectionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all ${collectionRate >= 80 ? 'bg-green-500' : collectionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>To'langan: {formatMoney(monthComparison.current)}</span>
              <span>Prognoz: {formatMoney(forecastRevenue)}</span>
            </div>
          </Card>
        </>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="p-4" className="bg-green-50">
              <div className="text-center">
                <p className="text-sm text-green-600">Keldi</p>
                <p className="text-3xl font-bold text-green-700">
                  {attendance.filter(a => a.status === 'present').length}
                </p>
              </div>
            </Card>
            <Card padding="p-4" className="bg-red-50">
              <div className="text-center">
                <p className="text-sm text-red-600">Kelmadi</p>
                <p className="text-3xl font-bold text-red-700">
                  {attendance.filter(a => a.status === 'absent').length}
                </p>
              </div>
            </Card>
            <Card padding="p-4" className="bg-yellow-50">
              <div className="text-center">
                <p className="text-sm text-yellow-600">Kechikdi</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {attendance.filter(a => a.status === 'late').length}
                </p>
              </div>
            </Card>
            <Card padding="p-4" className="bg-purple-50">
              <div className="text-center">
                <p className="text-sm text-purple-600">Umumiy davomat</p>
                <p className="text-3xl font-bold text-purple-700">{stats.attendanceRate}%</p>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Guruhlar bo'yicha davomat</h3>
            <div className="space-y-3">
              {groups.map(group => {
                const groupAtt = attendance.filter(a => a.groupId === group.id);
                const present = groupAtt.filter(a => a.status === 'present').length;
                const rate = groupAtt.length > 0 ? Math.round((present / groupAtt.length) * 100) : 0;
                return (
                  <div key={group.id} className="flex items-center gap-4">
                    <div className="w-32 font-medium truncate">{group.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${rate >= 80 ? 'bg-green-500' : rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-semibold">{rate}%</span>
                      <span className="text-xs text-gray-500 ml-1">({groupAtt.length})</span>
                    </div>
                  </div>
                );
              })}
              {groups.length === 0 && (
                <p className="text-center text-gray-500 py-4">Guruhlar yo'q</p>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition cursor-pointer" onClick={exportStudentsCSV}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">O'quvchilar</h3>
                <p className="text-sm text-gray-500">{stats.students} ta</p>
              </div>
              <Download className="w-5 h-5 text-gray-400" />
            </div>
          </Card>

          <Card className="hover:shadow-md transition cursor-pointer" onClick={exportPaymentsCSV}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">To'lovlar</h3>
                <p className="text-sm text-gray-500">{payments.length} ta</p>
              </div>
              <Download className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
