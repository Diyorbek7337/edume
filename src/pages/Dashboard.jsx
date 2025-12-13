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
  const [period, setPeriod] = useState('month'); // day, week, month, all

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, groups, payments, leads] = await Promise.all([
          studentsAPI.getAll(),
          teachersAPI.getAll(),
          groupsAPI.getAll(),
          paymentsAPI.getAll(),
          leadsAPI.getAll()
        ]);
        
        // Period bo'yicha filter
        const now = new Date();
        const filterByPeriod = (date) => {
          if (!date) return false;
          const d = date?.toDate ? date.toDate() : new Date(date);
          if (isNaN(d.getTime())) return false;
          
          switch (period) {
            case 'day':
              return d.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return d >= weekAgo;
            case 'month':
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        };
        
        // Daromad hisoblash
        const filteredPayments = payments.filter(p => {
          if (p.status !== 'paid') return false;
          const paidDate = p.paidAt || p.createdAt;
          return filterByPeriod(paidDate);
        });
        const totalRevenue = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        // Kutilayotgan to'lovlar
        const pending = payments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        // Yangi lidlar
        const newLeadsCount = leads.filter(l => l.status === 'new').length;

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
        setRecentPayments(payments.filter(p => p.status === 'paid').slice(-5).reverse());

        // Guruhlar statistikasi - haqiqiy o'quvchilar soni
        const gStats = await Promise.all(groups.map(async (g) => {
          const groupStudents = await studentsAPI.getByGroup(g.id);
          return { name: g.name, students: groupStudents.length };
        }));
        setGroupStats(gStats);

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
              const paidDate = p.paidAt ? new Date(p.paidAt) : (p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt));
              return paidDate.getMonth() === month && paidDate.getFullYear() === year;
            })
            .reduce((sum, p) => sum + (p.amount || 0), 0);
          revenueByMonth.push({ name: monthNames[month], revenue: monthRevenue / 1000000 });
        }
        setMonthlyRevenue(revenueByMonth);

      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, [period]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  const periodLabels = { day: 'Bugun', week: 'Bu hafta', month: 'Bu oy', all: 'Jami' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bosh sahifa</h1>
          <p className="text-gray-500">O'quv markaz statistikasi</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="day">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="all">Jami</option>
          </select>
        </div>
      </div>

      {/* Asosiy statistika */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="p-5" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">O'quvchilar</p>
              <p className="text-3xl font-bold text-blue-700">{stats.students}</p>
              <p className="text-xs text-blue-500 mt-1">{stats.activeStudents} faol</p>
            </div>
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">O'qituvchilar</p>
              <p className="text-3xl font-bold text-green-700">{stats.teachers}</p>
              <p className="text-xs text-green-500 mt-1">{stats.groups} guruh</p>
            </div>
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Daromad ({periodLabels[period]})</p>
              <p className="text-xl font-bold text-purple-700">{formatMoney(stats.revenue)}</p>
            </div>
            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Yangi lidlar</p>
              <p className="text-3xl font-bold text-orange-700">{stats.newLeads}</p>
            </div>
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Qarzdorlik ogohlantirishi */}
      {stats.pendingPayments > 0 && (
        <Card padding="p-4" className="bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-700">Kutilayotgan to'lovlar</p>
                <p className="text-2xl font-bold text-red-600">{formatMoney(stats.pendingPayments)}</p>
              </div>
            </div>
            <Link to="/payments">
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-100">
                Ko'rish <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daromad grafigi */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
            <p className="text-center text-gray-500 py-8">Guruhlar yo'q</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* So'nggi o'quvchilar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" /> So'nggi o'quvchilar
            </h3>
            <Link to="/students" className="text-primary-600 text-sm hover:underline">Barchasi</Link>
          </div>
          <div className="space-y-3">
            {recentStudents.length > 0 ? recentStudents.map(student => (
              <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <Avatar name={student.fullName} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">{student.groupName || 'Guruh yo\'q'}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">O'quvchilar yo'q</p>
            )}
          </div>
        </Card>

        {/* So'nggi to'lovlar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-600" /> So'nggi to'lovlar
            </h3>
            <Link to="/payments" className="text-primary-600 text-sm hover:underline">Barchasi</Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length > 0 ? recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
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
              <p className="text-center text-gray-500 py-4">To'lovlar yo'q</p>
            )}
          </div>
        </Card>
      </div>

      {/* Tezkor havolalar */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Tezkor amallar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/students" className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-700">O'quvchi qo'shish</p>
          </Link>
          <Link to="/leads" className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition">
            <UserPlus className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-orange-700">Lid qo'shish</p>
          </Link>
          <Link to="/payments" className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition">
            <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-700">To'lov qabul qilish</p>
          </Link>
          <Link to="/groups" className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition">
            <UsersRound className="w-8 h-8 text-purple-600 mx-auto mb-2" />
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
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState({ present: 0, absent: 0, late: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // O'qituvchini teachers kolleksiyasidan topish
        const allTeachers = await teachersAPI.getAll();
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email
        );
        
        // Guruhlarni topish
        let groupsData = [];
        if (teacher) {
          groupsData = await groupsAPI.getByTeacher(teacher.id);
        }
        // Users ID bilan ham qidirish
        const groups2 = await groupsAPI.getByTeacher(userData?.id);
        const allGroups = [...groupsData, ...groups2];
        const uniqueGroups = allGroups.filter((g, index, self) => 
          index === self.findIndex(t => t.id === g.id)
        );
        
        // Haqiqiy o'quvchilar soni
        let studentCount = 0;
        const groupsWithCounts = await Promise.all(
          uniqueGroups.map(async (group) => {
            const students = await studentsAPI.getByGroup(group.id);
            studentCount += students.length;
            return { ...group, studentsCount: students.length };
          })
        );
        
        setGroups(groupsWithCounts);
        setTotalStudents(studentCount);

        // Davomat statistikasi
        const now = new Date();
        let present = 0, absent = 0, late = 0;
        
        for (const group of groupsWithCounts) {
          const attendance = await attendanceAPI.getByGroup(group.id);
          
          const filteredAttendance = attendance.filter(a => {
            const aDate = new Date(a.date);
            switch (period) {
              case 'day':
                return a.date === now.toISOString().split('T')[0];
              case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return aDate >= weekAgo;
              case 'month':
                return aDate.getMonth() === now.getMonth() && aDate.getFullYear() === now.getFullYear();
              default:
                return true;
            }
          });
          
          present += filteredAttendance.filter(a => a.status === 'present').length;
          absent += filteredAttendance.filter(a => a.status === 'absent').length;
          late += filteredAttendance.filter(a => a.status === 'late').length;
        }
        setTodayAttendance({ present, absent, late });
        
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (userData?.id) fetchData();
  }, [userData, period]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  const periodLabels = { day: 'Bugun', week: 'Bu hafta', month: 'Bu oy', all: 'Jami' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salom, {userData?.fullName}!</h1>
          <p className="text-gray-500">Darslaringiz va statistikangiz</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="day">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="month">Bu oy</option>
          <option value="all">Jami</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="p-5" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
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
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
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
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
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
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600">Kelmadi</p>
              <p className="text-2xl font-bold text-red-700">{todayAttendance.absent}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" /> Guruhlarim
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <div key={group.id} className="p-4 bg-gray-50 rounded-xl border hover:border-primary-300 transition">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{group.name}</h4>
                <Badge variant="primary">{group.studentsCount || 0} o'quvchi</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{group.schedule?.days} • {group.schedule?.time}</p>
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
            <p className="text-gray-500 col-span-2 text-center py-8">Sizga guruh biriktirilmagan</p>
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

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const students = await studentsAPI.getAll();
        console.log('All students:', students);
        console.log('Current userData:', userData);
        
        let student;
        
        // Email va telefonni normallashtirish
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const userPhone = normalizePhone(userData?.phone);
        const userEmail = userData?.email?.toLowerCase();
        
        if (isParent) {
          // Ota-ona - parentPhone yoki childId orqali
          student = students.find(s => {
            const studentParentPhone = normalizePhone(s.parentPhone);
            return (
              s.parentPhone === userData?.phone ||
              studentParentPhone === userPhone ||
              userData?.childId === s.id
            );
          });
        } else {
          // O'quvchi - email yoki telefon orqali
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
        
        console.log('Found student:', student);
        
        if (student) {
          setStudentData(student);
          
          // O'quvchi guruhlarini topish
          const allGroups = await groupsAPI.getAll();
          console.log('All groups:', allGroups);
          
          // groupId yoki studentIds orqali
          const studentGroups = allGroups.filter(g => 
            g.id === student.groupId || 
            g.studentIds?.includes(student.id)
          );
          console.log('Student groups:', studentGroups);
          
          setGroups(studentGroups);
          
          if (studentGroups.length > 0) {
            setSelectedGroupId(studentGroups[0].id);
          }
          
          // To'lovlar
          const allPayments = await paymentsAPI.getAll();
          setPayments(allPayments.filter(p => p.studentId === student.id));
        }
      } catch (err) { console.error('StudentDashboard error:', err); }
      finally { setLoading(false); }
    };
    
    if (userData) fetchStudentData();
  }, [userData, isParent]);

  useEffect(() => {
    const fetchGradesAndAttendance = async () => {
      if (!selectedGroupId || !studentData) return;
      
      try {
        const [gradesData, attendanceData] = await Promise.all([
          gradesAPI.getByGroup(selectedGroupId),
          attendanceAPI.getByGroup(selectedGroupId)
        ]);
        
        // Faqat bu o'quvchining ma'lumotlari
        const myGrades = gradesData.filter(g => g.studentId === studentData.id);
        const myAttendance = attendanceData.filter(a => a.studentId === studentData.id);
        
        // Period bo'yicha filter
        const now = new Date();
        const filterByPeriod = (date) => {
          if (!date || period === 'all') return true;
          const d = date?.toDate ? date.toDate() : new Date(date);
          if (isNaN(d.getTime())) return true;
          
          switch (period) {
            case 'day':
              return d.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return d >= weekAgo;
            case 'month':
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        };
        
        setGrades(myGrades.filter(g => filterByPeriod(g.createdAt)));
        setAttendance(myAttendance.filter(a => filterByPeriod(a.date)));
      } catch (err) { console.error(err); }
    };
    
    fetchGradesAndAttendance();
  }, [selectedGroupId, studentData, period]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  if (!studentData) {
    return (
      <div className="text-center py-12">
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
    : 100;

  const paymentStats = {
    paid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);
  const periodLabels = { day: 'Bugun', week: 'Bu hafta', month: 'Bu oy', all: 'Jami' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isParent ? `${studentData?.fullName} natijalari` : 'Mening natijalarim'}
          </h1>
          <p className="text-gray-500">{selectedGroup?.name || 'Guruh tanlanmagan'}</p>
        </div>
        
        <div className="flex items-center gap-2">
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
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="day">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="all">Jami</option>
          </select>
        </div>
      </div>

      {/* Statistika kartalari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="p-5" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Percent className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{gradeStats.average}%</p>
            <p className="text-sm text-blue-600">O'rtacha ball</p>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-green-700">{attendancePercent}%</p>
            <p className="text-sm text-green-600">Davomat</p>
          </div>
        </Card>
        
        <Card padding="p-5" className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-center">
            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-purple-700">{gradeStats.total}</p>
            <p className="text-sm text-purple-600">Baholar ({periodLabels[period]})</p>
          </div>
        </Card>
        
        <Card padding="p-5" className={`bg-gradient-to-br ${paymentStats.pending > 0 ? 'from-red-50 to-red-100' : 'from-emerald-50 to-emerald-100'}`}>
          <div className="text-center">
            <div className={`w-14 h-14 ${paymentStats.pending > 0 ? 'bg-red-500' : 'bg-emerald-500'} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
              <CreditCard className="w-7 h-7 text-white" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Oxirgi baholar */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" /> Oxirgi baholar
            </h3>
            <Link to="/grades" className="text-primary-600 text-sm hover:underline">Barchasi</Link>
          </div>
          {grades.length > 0 ? (
            <div className="space-y-3">
              {grades.slice(-5).reverse().map(grade => {
                const percent = Math.round((grade.grade / grade.maxGrade) * 100);
                return (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
            <p className="text-gray-500 text-center py-8">Baholar yo'q</p>
          )}
        </Card>

        {/* Davomat */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" /> Davomat ({periodLabels[period]})
            </h3>
            <Link to="/attendance" className="text-primary-600 text-sm hover:underline">Barchasi</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{attendanceStats.present}</p>
              <p className="text-sm text-green-600">Keldi</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{attendanceStats.absent}</p>
              <p className="text-sm text-red-600">Kelmadi</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{attendanceStats.late}</p>
              <p className="text-sm text-yellow-600">Kechikdi</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tezkor havolalar */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Tezkor havolalar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/grades" className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-700">Baholarim</p>
          </Link>
          <Link to="/attendance" className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-700">Davomatim</p>
          </Link>
          <Link to="/payments" className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition">
            <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-purple-700">To'lovlarim</p>
          </Link>
          <Link to="/messages" className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition">
            <Bell className="w-8 h-8 text-orange-600 mx-auto mb-2" />
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
