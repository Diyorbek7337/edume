import { useState, useEffect } from 'react';
import { 
  Download, FileText, Users, CreditCard, CalendarCheck, TrendingUp, 
  BarChart3, PieChart as PieChartIcon, Calendar, Filter
} from 'lucide-react';
import { Card, Button, Badge, Loading } from '../components/common';
import { studentsAPI, teachersAPI, groupsAPI, paymentsAPI, attendanceAPI, gradesAPI } from '../services/api';
import { formatMoney, formatDate } from '../utils/helpers';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
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
      
      console.log('Students:', studentsData.length);
      console.log('Payments:', paymentsData);
      
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
      
      console.log('Attendance:', allAttendance.length);
      console.log('Grades:', allGrades.length);
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="p-4" className="bg-green-50 border-green-200">
              <div className="text-center">
                <p className="text-sm text-green-600">Jami tushum</p>
                <p className="text-3xl font-bold text-green-700">{formatMoney(stats.revenue)}</p>
                <p className="text-xs text-green-500 mt-1">
                  {payments.filter(p => p.status === 'paid').length} ta to'lov
                </p>
              </div>
            </Card>
            
            <Card padding="p-4" className="bg-red-50 border-red-200">
              <div className="text-center">
                <p className="text-sm text-red-600">Kutilayotgan to'lovlar</p>
                <p className="text-3xl font-bold text-red-700">{formatMoney(stats.pendingPayments)}</p>
                <p className="text-xs text-red-500 mt-1">
                  {payments.filter(p => p.status === 'pending').length} ta qarzdor
                </p>
              </div>
            </Card>
            
            <Card padding="p-4" className="bg-blue-50 border-blue-200">
              <div className="text-center">
                <p className="text-sm text-blue-600">O'rtacha to'lov</p>
                <p className="text-3xl font-bold text-blue-700">
                  {payments.filter(p => p.status === 'paid').length > 0 
                    ? formatMoney(stats.revenue / payments.filter(p => p.status === 'paid').length)
                    : '0 so\'m'}
                </p>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Barcha to'lovlar</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">O'quvchi</th>
                    <th className="px-4 py-3 text-left">Guruh</th>
                    <th className="px-4 py-3 text-right">Summa</th>
                    <th className="px-4 py-3 text-center">Usul</th>
                    <th className="px-4 py-3 text-center">Holat</th>
                    <th className="px-4 py-3 text-right">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.length > 0 ? payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{payment.studentName}</td>
                      <td className="px-4 py-3 text-gray-500">{payment.groupName}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatMoney(payment.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="default">{payment.method || 'Naqd'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                          {payment.status === 'paid' ? 'To\'langan' : 'Kutilmoqda'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        To'lovlar yo'q
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
