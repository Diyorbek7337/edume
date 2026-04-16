import { useState, useEffect } from 'react';
import {
  Users, Award, Calendar, CreditCard, Clock, CheckCircle, XCircle,
  AlertTriangle, Bell, BookOpen, TrendingUp, ChevronRight, Phone,
  MessageSquare, CalendarCheck, Percent
} from 'lucide-react';
import { Card, Badge, Avatar, Loading, Button } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import {
  studentsAPI, groupsAPI, gradesAPI, attendanceAPI, paymentsAPI, scheduleAPI
} from '../services/api';
import { formatMoney, formatDate, toISODateString } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DAYS = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

const ParentPortal = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [childData, setChildData] = useState(null); // { student, groups, grades, attendance, payments, schedule }

  // Step 1: load all children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const students = await studentsAPI.getAll();
        const normalizePhone = (p) => p?.replace(/\D/g, '') || '';
        const userPhone = normalizePhone(userData?.phone);
        const childIds = userData?.childIds || (userData?.childId ? [userData.childId] : []);

        const myChildren = students.filter(s => {
          const parentPhone = normalizePhone(s.parentPhone);
          return (
            s.parentPhone === userData?.phone ||
            (userPhone && parentPhone === userPhone) ||
            childIds.includes(s.id)
          );
        });

        setChildren(myChildren);
        if (myChildren.length > 0) {
          setSelectedChildId(myChildren[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('ParentPortal fetchChildren error:', err);
        setLoading(false);
      }
    };
    if (userData) fetchChildren();
  }, [userData]);

  // Step 2: load selected child's data
  useEffect(() => {
    if (!selectedChildId) return;
    const fetchChildData = async () => {
      setLoading(true);
      try {
        const student = children.find(c => c.id === selectedChildId);
        if (!student) return;

        const allGroups = await groupsAPI.getAll();
        const studentGroups = allGroups.filter(g =>
          g.id === student.groupId || g.studentIds?.includes(student.id)
        );

        const primaryGroupId = studentGroups[0]?.id;

        const [grades, attendance, allPayments, schedule] = await Promise.all([
          primaryGroupId ? gradesAPI.getByGroup(primaryGroupId) : Promise.resolve([]),
          primaryGroupId ? attendanceAPI.getByGroup(primaryGroupId) : Promise.resolve([]),
          paymentsAPI.getAll(),
          scheduleAPI.getAll(),
        ]);

        const myGrades = grades.filter(g => g.studentId === student.id);
        const myAttendance = attendance.filter(a => a.studentId === student.id);
        const myPayments = allPayments.filter(p => p.studentId === student.id);

        // Only show schedule for student's groups
        const groupIds = new Set(studentGroups.map(g => g.id));
        const mySchedule = schedule.filter(s => groupIds.has(s.groupId));

        setChildData({ student, groups: studentGroups, grades: myGrades, attendance: myAttendance, payments: myPayments, schedule: mySchedule });
      } catch (err) {
        console.error('ParentPortal fetchChildData error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildData();
  }, [selectedChildId, children]);

  if (loading) return <Loading text="Yuklanmoqda..." />;

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Farzand topilmadi</h2>
        <p className="text-gray-500 max-w-sm">
          Sizning farzandingiz hali tizimga qo'shilmagan. Administrator bilan bog'laning.
        </p>
      </div>
    );
  }

  const { student, groups, grades, attendance, payments, schedule } = childData || {};

  // Stats
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const totalDebt = payments?.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0) || 0;
  const hasPaidThisMonth = payments?.some(p => p.status === 'paid' && p.month === currentMonthStr);
  const paidTotal = payments?.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0) || 0;

  const avgGrade = grades?.length > 0
    ? Math.round(grades.reduce((s, g) => s + (g.maxGrade > 0 ? (g.grade / g.maxGrade) * 100 : 0), 0) / grades.length)
    : null;

  const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
  const absentCount = attendance?.filter(a => a.status === 'absent').length || 0;
  const lateCount = attendance?.filter(a => a.status === 'late').length || 0;
  const totalAttendance = (presentCount + absentCount + lateCount) || 0;
  const attendancePercent = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : null;

  // Monthly grades chart (last 4 months)
  const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  const gradesByMonth = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthPrefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthGrades = grades?.filter(g => {
      const ds = toISODateString(g.date || g.createdAt);
      return ds?.startsWith(monthPrefix);
    }) || [];
    const avg = monthGrades.length > 0
      ? Math.round(monthGrades.reduce((s, g) => s + (g.maxGrade > 0 ? (g.grade / g.maxGrade) * 100 : 0), 0) / monthGrades.length)
      : 0;
    gradesByMonth.push({ name: monthNames[d.getMonth()], avg });
  }

  // Today's schedule
  // Schedule dayOfWeek: 1=Dush...6=Shan, 7=Yak. JS getDay(): 0=Sun,1=Mon...6=Sat
  const todayDow = now.getDay() || 7; // convert Sun(0) → 7
  const todaySchedule = schedule?.filter(s => {
    const days = s.daysOfWeek || (s.dayOfWeek !== undefined ? [s.dayOfWeek] : []);
    return days.includes(todayDow) && s.status !== 'cancelled';
  }).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')) || [];

  // Upcoming week schedule (next 7 days)
  const upcomingClasses = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dow = d.getDay() || 7; // convert Sun(0) → 7
    const dayClasses = schedule?.filter(s => {
      const days = s.daysOfWeek || (s.dayOfWeek !== undefined ? [s.dayOfWeek] : []);
      return days.includes(dow) && s.status !== 'cancelled';
    }) || [];
    dayClasses.forEach(cls => upcomingClasses.push({ ...cls, date: new Date(d) }));
  }

  // Payment history (last 6)
  const recentPayments = [...(payments || [])].sort((a, b) => {
    const da = a.paidAt?.toDate ? a.paidAt.toDate() : new Date(a.paidAt || a.createdAt || 0);
    const db2 = b.paidAt?.toDate ? b.paidAt.toDate() : new Date(b.paidAt || b.createdAt || 0);
    return db2 - da;
  }).slice(0, 6);

  // Recent grades (last 8)
  const recentGrades = [...(grades || [])].sort((a, b) => {
    const da = new Date(toISODateString(a.date || a.createdAt) || 0);
    const db2 = new Date(toISODateString(b.date || b.createdAt) || 0);
    return db2 - da;
  }).slice(0, 8);

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ota-ona kabineti</h1>
          <p className="text-gray-500 dark:text-gray-400">Farzandingizning o'quv jarayoni</p>
        </div>
        <Link to="/messages">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            O'qituvchiga xabar
          </Button>
        </Link>
      </div>

      {/* Child selector */}
      {children.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all flex-shrink-0 ${
                selectedChildId === child.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Avatar name={child.fullName} size="sm" />
              <div className="text-left">
                <p className={`font-semibold text-sm ${selectedChildId === child.id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {child.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{child.groupName || 'Guruh yo\'q'}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Child profile card */}
      {selectedChild && (
        <Card padding="p-5" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {selectedChild.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold">{selectedChild.fullName}</h2>
              <p className="text-blue-200 text-sm">{selectedChild.groupName || groups?.[0]?.name || '—'}</p>
              {selectedChild.phone && (
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3 text-blue-300" />
                  <span className="text-blue-200 text-xs">{selectedChild.phone}</span>
                </div>
              )}
            </div>
            <div className="text-right hidden md:block">
              <p className="text-blue-200 text-xs">Guruh</p>
              <p className="font-semibold">{groups?.[0]?.name || '—'}</p>
              {groups?.[0]?.schedule && (
                <p className="text-blue-200 text-xs mt-1">{groups[0].schedule.days}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Payment alerts */}
      {totalDebt > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-800 dark:text-red-300">Qarzdorlik mavjud!</p>
            <p className="text-sm text-red-600 dark:text-red-400">Jami qarz: <span className="font-bold">{formatMoney(totalDebt)}</span></p>
          </div>
          <Link to="/my-payments">
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white border-0">To'lash</Button>
          </Link>
        </div>
      )}

      {!hasPaidThisMonth && totalDebt === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-yellow-800 dark:text-yellow-300">Bu oyga to'lov kutilmoqda</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              {now.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })} uchun to'lov qilinmagan
            </p>
          </div>
          <Link to="/my-payments">
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">To'lash</Button>
          </Link>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="p-5" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Percent className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {avgGrade !== null ? `${avgGrade}%` : '—'}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">O'rtacha ball</p>
          </div>
        </Card>

        <Card padding="p-5" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {attendancePercent !== null ? `${attendancePercent}%` : '—'}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">Davomat</p>
          </div>
        </Card>

        <Card padding="p-5" className={`bg-gradient-to-br border ${totalDebt > 0 ? 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-200 dark:border-red-800' : 'from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'}`}>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${totalDebt > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <p className={`text-lg font-bold ${totalDebt > 0 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
              {totalDebt > 0 ? formatMoney(totalDebt) : "Qarz yo'q"}
            </p>
            <p className={`text-xs ${totalDebt > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {totalDebt > 0 ? 'Qarzdorlik' : 'To\'lov holati'}
            </p>
          </div>
        </Card>

        <Card padding="p-5" className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{grades?.length || 0}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Jami baholar</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <TrendingUp className="w-5 h-5 text-primary-600" /> Oylik o'rtacha ball
            </h3>
            <Link to="/my-grades" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              Barchasi <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {gradesByMonth.some(m => m.avg > 0) ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={v => [`${v}%`, "O'rtacha"]} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {gradesByMonth.map((entry, i) => (
                      <Cell key={i} fill={entry.avg >= 80 ? '#10B981' : entry.avg >= 60 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-10">Baholar mavjud emas</p>
          )}
        </Card>

        {/* Attendance summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Calendar className="w-5 h-5 text-primary-600" /> Davomat
            </h3>
            <Link to="/my-attendance" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
              Barchasi <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{presentCount}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Keldi</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{absentCount}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Kelmadi</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-center">
              <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{lateCount}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Kechikdi</p>
            </div>
          </div>
          {/* Progress bar */}
          {totalAttendance > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Davomat foizi</span>
                <span className={`font-bold ${attendancePercent >= 80 ? 'text-green-600' : attendancePercent >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {attendancePercent}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${attendancePercent >= 80 ? 'bg-green-500' : attendancePercent >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent grades */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Award className="w-5 h-5 text-primary-600" /> Oxirgi baholar
            </h3>
            <Link to="/my-grades" className="text-primary-600 text-sm hover:underline">Barchasi</Link>
          </div>
          {recentGrades.length > 0 ? (
            <div className="space-y-2">
              {recentGrades.map(grade => {
                const percent = grade.maxGrade > 0 ? Math.round((grade.grade / grade.maxGrade) * 100) : 0;
                return (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{grade.topic}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(grade.date || grade.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`px-2 py-1 rounded-lg text-sm font-bold ${
                        percent >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        percent >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {grade.grade}/{grade.maxGrade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">Baholar yo'q</p>
          )}
        </Card>

        {/* Today's schedule + upcoming */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Clock className="w-5 h-5 text-primary-600" /> Bugungi darslar
            </h3>
            <Link to="/schedule" className="text-primary-600 text-sm hover:underline">Jadval</Link>
          </div>
          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.map(cls => (
                <div key={cls.id} className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{cls.groupName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cls.startTime}–{cls.endTime}
                      {cls.room ? ` • ${cls.room}` : ''}
                    </p>
                    {cls.teacherName && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">{cls.teacherName}</p>
                    )}
                  </div>
                  <Badge variant="primary" className="flex-shrink-0 text-xs">Bugun</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Bugun dars yo'q</p>
            </div>
          )}

          {/* Upcoming this week */}
          {upcomingClasses.filter(c => {
            const d = c.date;
            return d.toDateString() !== now.toDateString();
          }).slice(0, 3).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Kelasi darslar</p>
              <div className="space-y-2">
                {upcomingClasses.filter(c => c.date.toDateString() !== now.toDateString()).slice(0, 3).map((cls, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {DAYS[cls.date.getDay()]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-gray-900 dark:text-gray-100">{cls.groupName}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{cls.startTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Payment history */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <CreditCard className="w-5 h-5 text-primary-600" /> To'lovlar tarixi
          </h3>
          <Link to="/my-payments" className="text-primary-600 text-sm hover:underline">Barchasi</Link>
        </div>
        {recentPayments.length > 0 ? (
          <div className="space-y-2">
            {recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    payment.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {payment.status === 'paid'
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : <AlertTriangle className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payment.month || formatDate(payment.paidAt || payment.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {payment.status === 'paid' ? formatDate(payment.paidAt || payment.createdAt) : 'Kutilmoqda'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${payment.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatMoney(payment.amount)}
                  </p>
                  <Badge variant={payment.status === 'paid' ? 'success' : 'danger'} className="text-xs">
                    {payment.status === 'paid' ? "To'langan" : 'Qarz'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">To'lovlar yo'q</p>
        )}
      </Card>

      {/* Quick actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tezkor havolalar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/my-grades" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
            <Award className="w-7 h-7 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-700 dark:text-blue-300 text-sm">Baholar</p>
          </Link>
          <Link to="/my-attendance" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center hover:bg-green-100 dark:hover:bg-green-900/40 transition">
            <CalendarCheck className="w-7 h-7 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-700 dark:text-green-300 text-sm">Davomat</p>
          </Link>
          <Link to="/my-payments" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center hover:bg-purple-100 dark:hover:bg-purple-900/40 transition">
            <CreditCard className="w-7 h-7 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-purple-700 dark:text-purple-300 text-sm">To'lovlar</p>
          </Link>
          <Link to="/messages" className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center hover:bg-orange-100 dark:hover:bg-orange-900/40 transition">
            <MessageSquare className="w-7 h-7 text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-orange-700 dark:text-orange-300 text-sm">Xabar</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ParentPortal;
