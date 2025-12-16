import { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, UsersRound, CreditCard, TrendingUp, 
  Calendar, Award, BarChart3, Clock, CheckCircle, XCircle, Bell, 
  UserPlus, BookOpen, AlertTriangle, ArrowRight, Percent, Filter
} from 'lucide-react';
import { Card, Badge, Avatar, Select, Loading, Button } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { 
  studentsAPI, teachersAPI, groupsAPI, paymentsAPI, gradesAPI, 
  attendanceAPI, leadsAPI, settingsAPI 
} from '../services/api';
import { formatMoney, formatDate } from '../utils/helpers';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Admin/Direktor Dashboard
const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    students: 0, teachers: 0, groups: 0, revenue: 0,
    newLeads: 0, pendingPayments: 0, activeStudents: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [groupStats, setGroupStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  // Date helper functions
  const toLocalDateStr = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  const normalizeDate = (value) => {
    if (!value) return null;

    // STRING formats
    if (typeof value === 'string') {
      // DD.MM.YYYY -> YYYY-MM-DD
      if (value.includes('.')) {
        const [day, month, year] = value.split('.');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      // already YYYY-MM-DD
      return value;
    }

    // Firestore Timestamp
    if (value?.toDate) {
      return toLocalDateStr(value.toDate());
    }

    // Timestamp seconds
    if (value?.seconds) {
      return toLocalDateStr(new Date(value.seconds * 1000));
    }

    // Date / number
    return toLocalDateStr(new Date(value));
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // console.log('AdminDashboard: Fetching stats...');
        const [students, teachers, groups, payments, leads] = await Promise.all([
          studentsAPI.getAll(),
          teachersAPI.getAll(),
          groupsAPI.getAll(),
          paymentsAPI.getAll(),
          leadsAPI.getAll()
        ]);
        
        // console.log('Fetched data:', { 
        //   students: students?.length, 
        //   teachers: teachers?.length, 
        //   groups: groups?.length, 
        //   payments: payments?.length, 
        //   leads: leads?.length 
        // });
        
        // Period bo'yicha filter
        const now = new Date();
        const todayStr = toLocalDateStr(now);

        const filterByPeriod = (dateStr) => {
          if (!dateStr || period === 'all') return true;

          const normalizedDate = normalizeDate(dateStr);
          if (!normalizedDate) return false;

          switch (period) {
            case 'day':
              return normalizedDate === todayStr;

            case 'week': {
              const start = new Date();
              start.setDate(now.getDate() - 6);
              const startStr = toLocalDateStr(start);
              return normalizedDate >= startStr && normalizedDate <= todayStr;
            }

            case 'month':
              return normalizedDate.startsWith(todayStr.slice(0, 7));

            default:
              return true;
          }
        };
        
        // Daromad hisoblash
        const filteredPayments = payments.filter(p => {
          if (p.status !== 'paid') return false;
          const paidDate = normalizeDate(p.paidAt || p.createdAt);
          return filterByPeriod(paidDate);
        });
        const totalRevenue = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // console.log('Revenue calculation:', { 
        //   totalPayments: payments.length, 
        //   filteredPayments: filteredPayments.length, 
        //   totalRevenue 
        // });

        // Kutilayotgan to'lovlar
        const pending = payments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        // Yangi lidlar
        const newLeadsCount = leads.filter(l => l.status === 'new').length;

        // console.log('Stats calculated:', { 
        //   students: students.length, 
        //   teachers: teachers.length, 
        //   groups: groups.length, 
        //   totalRevenue, 
        //   pending, 
        //   newLeadsCount 
        // });

        setStats({
          students: students.length,
          teachers: teachers.length,
          groups: groups.length,
          revenue: totalRevenue,
          newLeads: newLeadsCount,
          pendingPayments: pending,
          activeStudents: students.filter(s => s.status === 'active').length
        });

        setRecentStudents(students.slice(-5).reverse());
        const paidPayments = payments.filter(p => p.status === 'paid');
        setRecentPayments(paidPayments.slice(-5).reverse());

        // console.log('Recent data:', { 
        //   recentStudents: students.slice(-5).length, 
        //   recentPayments: paidPayments.slice(-5).length 
        // });

        // Guruhlar statistikasi - haqiqiy o'quvchilar soni
        const gStats = await Promise.all(groups.map(async (g) => {
          try {
            const groupStudents = await studentsAPI.getByGroup(g.id);
            return { name: g.name, students: groupStudents?.length || 0 };
          } catch (err) {
            console.error('Error fetching group students:', err);
            return { name: g.name, students: 0 };
          }
        }));
        setGroupStats(gStats);

        // console.log('Group stats:', gStats);

        // Oylik daromad grafigi
        const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const revenueByMonth = [];
        for (let i = 5; i >= 0; i--) {
          const month = (thisMonth - i + 12) % 12;
          const year = thisMonth - i < 0 ? thisYear - 1 : thisYear;
          const monthRevenue = payments
            .filter(p => {
              if (p.status !== 'paid') return false;
              const paidDateStr = normalizeDate(p.paidAt || p.createdAt);
              if (!paidDateStr) return false;
              const [pYear, pMonth] = paidDateStr.split('-').map(Number);
              return pMonth - 1 === month && pYear === year;
            })
            .reduce((sum, p) => sum + (p.amount || 0), 0);
          revenueByMonth.push({ name: monthNames[month], revenue: monthRevenue / 1000000 });
        }
        setMonthlyRevenue(revenueByMonth);

        // console.log('Monthly revenue:', revenueByMonth);

      } catch (err) { 
        console.error('AdminDashboard error:', err);
        // Xato bo'lsa ham asosiy ma'lumotlarni ko'rsatish
        setStats({
          students: 0,
          teachers: 0,
          groups: 0,
          revenue: 0,
          newLeads: 0,
          pendingPayments: 0,
          activeStudents: 0
        });
      }
      finally { setLoading(false); }
    };
    fetchStats();
  }, [period]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  const periodLabels = { day: 'Bugun', week: 'Bu hafta', month: 'Bu oy', all: 'Jami' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bosh sahifa</h1>
          <p className="text-gray-500">O'quv markaz statistikasi</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            <option value="day">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="all">Jami</option>
          </select>
        </div>
      </div>

      {/* Asosiy statistika */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card padding="p-5" className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">O'quvchilar</p>
              <p className="text-3xl font-bold text-blue-700">{stats.students}</p>
              <p className="mt-1 text-xs text-blue-500">{stats.activeStudents} faol</p>
            </div>
            <div className="flex items-center justify-center bg-blue-500 shadow-lg w-14 h-14 rounded-2xl shadow-blue-200">
              <Users className="text-white w-7 h-7" />
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">O'qituvchilar</p>
              <p className="text-3xl font-bold text-green-700">{stats.teachers}</p>
              <p className="mt-1 text-xs text-green-500">{stats.groups} guruh</p>
            </div>
            <div className="flex items-center justify-center bg-green-500 shadow-lg w-14 h-14 rounded-2xl shadow-green-200">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Daromad ({periodLabels[period]})</p>
              <p className="text-xl font-bold text-purple-700">{formatMoney(stats.revenue)}</p>
            </div>
            <div className="flex items-center justify-center bg-purple-500 shadow-lg w-14 h-14 rounded-2xl shadow-purple-200">
              <CreditCard className="text-white w-7 h-7" />
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Yangi lidlar</p>
              <p className="text-3xl font-bold text-orange-700">{stats.newLeads}</p>
            </div>
            <div className="flex items-center justify-center bg-orange-500 shadow-lg w-14 h-14 rounded-2xl shadow-orange-200">
              <UserPlus className="text-white w-7 h-7" />
            </div>
          </div>
        </Card>
      </div>

      {/* Qarzdorlik ogohlantirishi */}
      {stats.pendingPayments > 0 && (
        <Card padding="p-4" className="border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-700">Kutilayotgan to'lovlar</p>
                <p className="text-2xl font-bold text-red-600">{formatMoney(stats.pendingPayments)}</p>
              </div>
            </div>
            <Link to="/payments">
              <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-100">
                Ko'rish <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daromad grafigi */}
        <Card>
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-primary-600" /> Oylik daromad (mln)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} mln`, 'Daromad']} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Guruhlar bo'yicha */}
        <Card>
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <UsersRound className="w-5 h-5 text-primary-600" /> Guruhlar bo'yicha
          </h3>
          {groupStats.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupStats}
                    dataKey="students"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, students }) => `${name}: ${students}`}
                  >
                    {groupStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">Guruhlar yo'q</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* So'nggi o'quvchilar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Users className="w-5 h-5 text-primary-600" /> So'nggi o'quvchilar
            </h3>
            <Link to="/students" className="text-sm text-primary-600 hover:underline">Barchasi</Link>
          </div>
          <div className="space-y-3">
            {recentStudents.length > 0 ? recentStudents.map(student => (
              <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Avatar name={student.fullName} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">{student.groupName || 'Guruh yo\'q'}</p>
                </div>
              </div>
            )) : (
              <p className="py-4 text-center text-gray-500">O'quvchilar yo'q</p>
            )}
          </div>
        </Card>

        {/* So'nggi to'lovlar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="w-5 h-5 text-primary-600" /> So'nggi to'lovlar
            </h3>
            <Link to="/payments" className="text-sm text-primary-600 hover:underline">Barchasi</Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length > 0 ? recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.paidAt || payment.createdAt)}</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">{formatMoney(payment.amount)}</p>
              </div>
            )) : (
              <p className="py-4 text-center text-gray-500">To'lovlar yo'q</p>
            )}
          </div>
        </Card>
      </div>

      {/* Tezkor havolalar */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Tezkor amallar</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link to="/students" className="p-4 text-center transition bg-blue-50 rounded-xl hover:bg-blue-100">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-medium text-blue-700">O'quvchi qo'shish</p>
          </Link>
          <Link to="/leads" className="p-4 text-center transition bg-orange-50 rounded-xl hover:bg-orange-100">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="font-medium text-orange-700">Lid qo'shish</p>
          </Link>
          <Link to="/payments" className="p-4 text-center transition bg-green-50 rounded-xl hover:bg-green-100">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-green-700">To'lov qabul qilish</p>
          </Link>
          <Link to="/groups" className="p-4 text-center transition bg-purple-50 rounded-xl hover:bg-purple-100">
            <UsersRound className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-purple-700">Guruh ochish</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

// Teacher Dashboard
const TeacherDashboard = () => {
  const { userData } = useAuth();
  const [groups, setGroups] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState({ present: 0, absent: 0, late: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log('TeacherDashboard - userData:', userData);
        
        const allTeachers = await teachersAPI.getAll();
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email ||
          t.phone === userData?.phone ||
          t.phone?.replace(/\D/g, '') === userData?.phone?.replace(/\D/g, '')
        );
        // console.log('Found teacher:', teacher);
        
        let allGroupsData = await groupsAPI.getAll();
        let groupsData = [];
        
        if (teacher) {
          groupsData = allGroupsData.filter(g => g.teacherId === teacher.id);
        }
        const groups2 = allGroupsData.filter(g => g.teacherId === userData?.id);
        const uniqueGroups = [...groupsData, ...groups2].filter((g, index, self) => 
          index === self.findIndex(t => t.id === g.id)
        );
        
        // console.log('Teacher groups:', uniqueGroups);
        
        let studentCount = 0;
        let allAtt = [];
        
        const groupsWithCounts = await Promise.all(
          uniqueGroups.map(async (group) => {
            const students = await studentsAPI.getByGroup(group.id);
            const attendance = await attendanceAPI.getByGroup(group.id);
            studentCount += students.length;
            allAtt = [...allAtt, ...attendance];
            return { ...group, studentsCount: students.length };
          })
        );
        
        setGroups(groupsWithCounts);
        setTotalStudents(studentCount);
        setAllAttendance(allAtt);
        // console.log('All attendance loaded:', allAtt.length);
        
      } catch (err) { console.error('TeacherDashboard error:', err); }
      finally { setLoading(false); }
    };
    if (userData?.id) fetchData();
  }, [userData]);

  // Period o'zgarganda davomat statistikasini qayta hisoblash
  useEffect(() => {
    if (allAttendance.length === 0 && !loading) return;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // console.log('TeacherDashboard - Period changed:', period);
    // console.log('Total attendance records:', allAttendance.length);
    // console.log('Sample attendance:', allAttendance[0]);
    
    const filteredAttendance = allAttendance.filter(a => {
      const dateStr = a.date;
      if (!dateStr) {
        console.log('No date for attendance:', a);
        return false;
      }
      
      // Date normalizatsiya
      let normalizedDate = dateStr;
      if (typeof dateStr === 'string') {
        if (dateStr.includes('.')) {
          const [day, month, year] = dateStr.split('.');
          normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      } else if (dateStr?.toDate) {
        normalizedDate = dateStr.toDate().toISOString().split('T')[0];
      } else if (dateStr?.seconds) {
        normalizedDate = new Date(dateStr.seconds * 1000).toISOString().split('T')[0];
      }
      
      // console.log('Original date:', dateStr, 'Normalized:', normalizedDate, 'Today:', todayStr);
      
      if (period === 'all') return true;
      
      switch (period) {
        case 'day':
          return normalizedDate === todayStr;
        case 'week': {
          const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
          const weekAgoStr = weekAgo.toISOString().split('T')[0];
          const isInWeek = normalizedDate >= weekAgoStr && normalizedDate <= todayStr;
          console.log('Week check:', normalizedDate, 'between', weekAgoStr, 'and', todayStr, '=', isInWeek);
          return isInWeek;
        }
        case 'month': {
          const monthPrefix = todayStr.substring(0, 7);
          const isInMonth = normalizedDate.startsWith(monthPrefix);
          console.log('Month check:', normalizedDate, 'starts with', monthPrefix, '=', isInMonth);
          return isInMonth;
        }
        default:
          return true;
      }
    });
    
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    
    // console.log('Period:', period, 'Total:', allAttendance.length, 'Filtered:', filteredAttendance.length, { present, absent, late });
    setTodayAttendance({ present, absent, late });
  }, [period, allAttendance, loading]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  const periodLabels = { day: 'Bugun', week: 'Bu hafta', month: 'Bu oy', all: 'Jami' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salom, {userData?.fullName}!</h1>
          <p className="text-gray-500">Darslaringiz va statistikangiz</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg"
        >
          <option value="day">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="month">Bu oy</option>
          <option value="all">Jami</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card padding="p-5" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
              <UsersRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Guruhlarim</p>
              <p className="text-2xl font-bold text-blue-700">{groups.length}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600">O'quvchilar</p>
              <p className="text-2xl font-bold text-green-700">{totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card padding="p-5" className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-600">Keldi ({periodLabels[period]})</p>
              <p className="text-2xl font-bold text-emerald-700">{todayAttendance.present}</p>
            </div>
          </div>
        </Card>

        <Card padding="p-5" className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600">Kelmadi ({periodLabels[period]})</p>
              <p className="text-2xl font-bold text-red-700">{todayAttendance.absent}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
          <BookOpen className="w-5 h-5 text-primary-600" /> Guruhlarim
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {groups.map(group => (
            <div key={group.id} className="p-4 transition border bg-gray-50 rounded-xl hover:border-primary-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">{group.name}</h4>
                <Badge variant="primary">{group.studentsCount || 0} o'quvchi</Badge>
              </div>
              <p className="mb-3 text-sm text-gray-500">{group.schedule?.days} • {group.schedule?.time}</p>
              <div className="flex gap-2">
                <Link to="/attendance">
                  <Button size="sm" variant="outline">Davomat</Button>
                </Link>
                <Link to="/grades">
                  <Button size="sm" variant="outline">Baholar</Button>
                </Link>
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <p className="col-span-2 py-8 text-center text-gray-500">Sizga guruh biriktirilmagan</p>
          )}
        </div>
      </Card>
    </div>
  );
};

// Student/Parent Dashboard
const StudentDashboard = ({ isParent = false }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [period, setPeriod] = useState('all');
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');

  const toLocalDateStr = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-CA');
  };

  const normalizeDate = (value) => {
    if (!value) return null;

    if (typeof value === 'string') {
      if (value.includes('.')) {
        const [day, month, year] = value.split('.');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return value;
    }

    if (value?.toDate) {
      return toLocalDateStr(value.toDate());
    }

    if (value?.seconds) {
      return toLocalDateStr(new Date(value.seconds * 1000));
    }

    return toLocalDateStr(new Date(value));
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const students = await studentsAPI.getAll();
        // console.log('All students:', students);
        // console.log('Current userData:', userData);
        
        let student;
        
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const userPhone = normalizePhone(userData?.phone);
        const userEmail = userData?.email?.toLowerCase();
        
        if (isParent) {
          const childIds = userData?.childIds || (userData?.childId ? [userData.childId] : []);
          
          const myChildren = students.filter(s => {
            const studentParentPhone = normalizePhone(s.parentPhone);
            return (
              s.parentPhone === userData?.phone ||
              studentParentPhone === userPhone ||
              childIds.includes(s.id)
            );
          });
          
          // console.log('Found children:', myChildren);
          setChildren(myChildren);
          
          if (myChildren.length > 0) {
            const targetChildId = selectedChildId || myChildren[0].id;
            setSelectedChildId(targetChildId);
            student = myChildren.find(c => c.id === targetChildId) || myChildren[0];
          }
        } else {
          student = students.find(s => {
            const studentPhone = normalizePhone(s.phone);
            const studentEmail = s.email?.toLowerCase();
            return (
              studentEmail === userEmail ||
              s.phone === userData?.phone ||
              studentPhone === userPhone
            );
          });
        }
        
        // console.log('Found student:', student);
        
        if (student) {
          setStudentData(student);
          
          const allGroups = await groupsAPI.getAll();
          // console.log('All groups:', allGroups);
          
          const studentGroups = allGroups.filter(g => 
            g.id === student.groupId || 
            g.studentIds?.includes(student.id)
          );
          // console.log('Student groups:', studentGroups);
          
          setGroups(studentGroups);
          
          if (studentGroups.length > 0) {
            setSelectedGroupId(studentGroups[0].id);
          }
          
          const allPayments = await paymentsAPI.getAll();
          setPayments(allPayments.filter(p => p.studentId === student.id));
        }
      } catch (err) { console.error('StudentDashboard error:', err); }
      finally { setLoading(false); }
    };
    
    if (userData) fetchStudentData();
  }, [userData, isParent, selectedChildId]);

  useEffect(() => {
    const fetchGradesAndAttendance = async () => {
      if (!selectedGroupId || !studentData) return;
      
      try {
        const [gradesData, attendanceData] = await Promise.all([
          gradesAPI.getByGroup(selectedGroupId),
          attendanceAPI.getByGroup(selectedGroupId)
        ]);
        
        // console.log('Raw gradesData:', gradesData);
        // console.log('Raw attendanceData:', attendanceData);
        // console.log('StudentData ID:', studentData.id);
        
        const myGrades = gradesData.filter(g => g.studentId === studentData.id);
        const myAttendance = attendanceData.filter(a => a.studentId === studentData.id);
        
        // console.log('Filtered myGrades:', myGrades);
        // console.log('Filtered myAttendance:', myAttendance);
        
        const now = new Date();
        const todayStr = toLocalDateStr(now);

        const filterByPeriod = (dateStr) => {
          if (!dateStr || period === 'all') return true;

          switch (period) {
            case 'day':
              return dateStr === todayStr;

            case 'week': {
              const start = new Date();
              start.setDate(now.getDate() - 6);
              const startStr = toLocalDateStr(start);
              return dateStr >= startStr && dateStr <= todayStr;
            }

            case 'month':
              return dateStr.startsWith(todayStr.slice(0, 7));

            default:
              return true;
          }
        };

        const filteredGrades = myGrades.filter((g) =>
          filterByPeriod(normalizeDate(g.date || g.createdAt))
        );

        const filteredAttendance = myAttendance.filter((a) =>
          filterByPeriod(normalizeDate(a.date))
        );

        setGrades(filteredGrades);
        setAttendance(filteredAttendance);

        // console.log(
        //   'TODAY:', todayStr,
        //   'RAW ATT:', myAttendance[0]?.date,
        //   'NORMALIZED:', normalizeDate(myAttendance[0]?.date),
        //   'RESULT:', filteredAttendance.length
        // );
      } catch (err) { console.error(err); }
    };
    
    fetchGradesAndAttendance();
  }, [selectedGroupId, studentData, period]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  if (!studentData) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">O'quvchi ma'lumotlari topilmadi</p>
      </div>
    );
  }

  const gradeStats = {
    total: grades.length,
    average: grades.length > 0 
      ? Math.round(grades.reduce((sum, g) => sum + ((g.grade / g.maxGrade) * 100), 0) / grades.length) 
      : 0
  };

  const attendanceStats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    total: attendance.length
  };

  const attendancePercent = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100) 
    : 0;

  const paymentStats = {
    paid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);
  const periodLabels = { day: 'Bugun', week: 'Bu hafta', month: 'Bu oy', all: 'Jami' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isParent ? `${studentData?.fullName} natijalari` : 'Mening natijalarim'}
          </h1>
          <p className="text-gray-500">{selectedGroup?.name || 'Guruh tanlanmagan'}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {isParent && children.length > 1 && (
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-2 text-sm font-medium border border-blue-200 rounded-lg bg-blue-50"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.fullName}</option>
              ))}
            </select>
          )}
          {groups.length > 1 && (
            <Select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              options={groups.map(g => ({ value: g.id, label: g.name }))}
              className="w-48"
            />
          )}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            <option value="day">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="all">Jami</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card padding="p-5" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <div className="flex items-center justify-center mx-auto mb-3 bg-blue-500 w-14 h-14 rounded-2xl">
              <Percent className="text-white w-7 h-7" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{gradeStats.average}%</p>
            <p className="text-sm text-blue-600">O'rtacha ball</p>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <div className="flex items-center justify-center mx-auto mb-3 bg-green-500 w-14 h-14 rounded-2xl">
              <CheckCircle className="text-white w-7 h-7" />
            </div>
            <p className="text-3xl font-bold text-green-700">{attendancePercent}%</p>
            <p className="text-sm text-green-600">Davomat</p>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-center">
            <div className="flex items-center justify-center mx-auto mb-3 bg-purple-500 w-14 h-14 rounded-2xl">
              <Award className="text-white w-7 h-7" />
            </div>
            <p className="text-3xl font-bold text-purple-700">{gradeStats.total}</p>
            <p className="text-sm text-purple-600">Baholar ({periodLabels[period]})</p>
          </div>
        </Card>
        
        <Card padding="p-5" className={`bg-gradient-to-br ${paymentStats.pending > 0 ? 'from-red-50 to-red-100' : 'from-emerald-50 to-emerald-100'}`}>
          <div className="text-center">
            <div className={`w-14 h-14 ${paymentStats.pending > 0 ? 'bg-red-500' : 'bg-emerald-500'} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
              <CreditCard className="text-white w-7 h-7" />
            </div>
            <p className={`text-2xl font-bold ${paymentStats.pending > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
              {formatMoney(paymentStats.pending || 0)}
            </p>
            <p className={`text-sm ${paymentStats.pending > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {paymentStats.pending > 0 ? 'Qarzdorlik' : 'Qarz yo\'q'}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Award className="w-5 h-5 text-primary-600" /> Oxirgi baholar
            </h3>
            <Link to="/grades" className="text-sm text-primary-600 hover:underline">Barchasi</Link>
          </div>
          {grades.length > 0 ? (
            <div className="space-y-3">
              {grades.slice(-5).reverse().map(grade => {
                const percent = Math.round((grade.grade / grade.maxGrade) * 100);
                return (
                  <div key={grade.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{grade.topic}</p>
                      <p className="text-xs text-gray-500">{formatDate(grade.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg font-bold ${
                      percent >= 80 ? 'bg-green-100 text-green-700' :
                      percent >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {grade.grade}/{grade.maxGrade}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">Baholar yo'q</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="w-5 h-5 text-primary-600" /> Davomat ({periodLabels[period]})
            </h3>
            <Link to="/attendance" className="text-sm text-primary-600 hover:underline">Barchasi</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 text-center bg-green-50 rounded-xl">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-700">{attendanceStats.present}</p>
              <p className="text-sm text-green-600">Keldi</p>
            </div>
            <div className="p-4 text-center bg-red-50 rounded-xl">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-red-700">{attendanceStats.absent}</p>
              <p className="text-sm text-red-600">Kelmadi</p>
            </div>
            <div className="p-4 text-center bg-yellow-50 rounded-xl">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-700">{attendanceStats.late}</p>
              <p className="text-sm text-yellow-600">Kechikdi</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Tezkor havolalar</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link to="/grades" className="p-4 text-center transition bg-blue-50 rounded-xl hover:bg-blue-100">
            <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-medium text-blue-700">Baholarim</p>
          </Link>
          <Link to="/attendance" className="p-4 text-center transition bg-green-50 rounded-xl hover:bg-green-100">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-green-700">Davomatim</p>
          </Link>
          <Link to="/payments" className="p-4 text-center transition bg-purple-50 rounded-xl hover:bg-purple-100">
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-purple-700">To'lovlarim</p>
          </Link>
          <Link to="/messages" className="p-4 text-center transition bg-orange-50 rounded-xl hover:bg-orange-100">
            <Bell className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="font-medium text-orange-700">Xabarlar</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { role } = useAuth();

  if (role === ROLES.DIRECTOR || role === ROLES.ADMIN) {
    return <AdminDashboard />;
  }
  
  if (role === ROLES.TEACHER) {
    return <TeacherDashboard />;
  }
  
  if (role === ROLES.PARENT) {
    return <StudentDashboard isParent={true} />;
  }
  
  return <StudentDashboard isParent={false} />;
};

export default Dashboard;