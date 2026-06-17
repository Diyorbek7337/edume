import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, UsersRound, UserPlus, CreditCard,
  CalendarCheck, MessageSquare, BarChart3, Settings, LogOut, Menu, X,
  Bell, Search, ChevronDown, FileText, Send, Shield, Calendar, Star, AlertTriangle,
  BookOpen, FileQuestion, Download, Trophy, Video, Gift, Award, Activity, TrendingDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_NAMES } from '../../utils/constants';
import { Avatar } from '../common';
import { messagesAPI, teachersAPI, studentsAPI, paymentsAPI } from '../../services/api';
import MobileNav from './MobileNav';
import InstallPrompt from '../common/InstallPrompt';
import { requestNotificationPermission } from '../../services/notifications';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trialDaysLeft, isTrialExpired } from '../../utils/subscriptions';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose, unreadCount }) => {
  const { userData, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    ];

    const n = (key) => t(`nav.${key}`);

    if (role === ROLES.DIRECTOR) {
      items.push(
        { id: 'admins',          label: n('admins'),         icon: Shield,        path: '/admins' },
        { id: 'students',        label: n('students'),        icon: Users,         path: '/students' },
        { id: 'teachers',        label: n('teachers'),        icon: GraduationCap, path: '/teachers' },
        { id: 'groups',          label: n('groups'),          icon: UsersRound,    path: '/groups' },
        { id: 'schedule',        label: n('schedule'),        icon: Calendar,      path: '/schedule' },
        { id: 'leads',           label: n('leads'),           icon: UserPlus,      path: '/leads' },
        { id: 'payments',        label: n('payments'),        icon: CreditCard,    path: '/payments' },
        { id: 'expenses',        label: n('expenses'),        icon: TrendingDown,  path: '/expenses' },
        { id: 'attendance',      label: n('attendance'),      icon: CalendarCheck, path: '/attendance' },
        { id: 'grades',          label: n('grades'),          icon: FileText,      path: '/grades' },
        { id: 'homework',        label: n('homework'),        icon: BookOpen,      path: '/homework' },
        { id: 'quizzes',         label: n('quizzes'),         icon: FileQuestion,  path: '/quizzes' },
        { id: 'materials',       label: n('materials'),       icon: Video,         path: '/materials' },
        { id: 'leaderboard',     label: n('leaderboard'),     icon: Trophy,        path: '/leaderboard' },
        { id: 'rewards',         label: n('rewards'),         icon: Gift,          path: '/rewards' },
        { id: 'certificates',    label: n('certificates'),    icon: Award,         path: '/certificates' },
        { id: 'chat',            label: n('chat'),            icon: Send,          path: '/chat' },
        { id: 'pdf-reports',     label: n('pdfReports'),      icon: Download,      path: '/pdf-reports' },
        { id: 'teacher-ratings', label: n('teacherRatings'),  icon: Star,          path: '/teacher-ratings' },
        { id: 'messages',        label: n('messages'),        icon: MessageSquare, path: '/messages', badge: unreadCount },
        { id: 'reports',         label: n('reports'),         icon: BarChart3,     path: '/reports' },
        { id: 'activity-log',    label: n('activityLog'),     icon: Activity,      path: '/activity-log' },
      );
    }

    if (role === ROLES.ADMIN) {
      items.push(
        { id: 'students',        label: n('students'),        icon: Users,         path: '/students' },
        { id: 'teachers',        label: n('teachers'),        icon: GraduationCap, path: '/teachers' },
        { id: 'groups',          label: n('groups'),          icon: UsersRound,    path: '/groups' },
        { id: 'schedule',        label: n('schedule'),        icon: Calendar,      path: '/schedule' },
        { id: 'leads',           label: n('leads'),           icon: UserPlus,      path: '/leads' },
        { id: 'payments',        label: n('payments'),        icon: CreditCard,    path: '/payments' },
        { id: 'expenses',        label: n('expenses'),        icon: TrendingDown,  path: '/expenses' },
        { id: 'attendance',      label: n('attendance'),      icon: CalendarCheck, path: '/attendance' },
        { id: 'grades',          label: n('grades'),          icon: FileText,      path: '/grades' },
        { id: 'homework',        label: n('homework'),        icon: BookOpen,      path: '/homework' },
        { id: 'quizzes',         label: n('quizzes'),         icon: FileQuestion,  path: '/quizzes' },
        { id: 'materials',       label: n('materials'),       icon: Video,         path: '/materials' },
        { id: 'leaderboard',     label: n('leaderboard'),     icon: Trophy,        path: '/leaderboard' },
        { id: 'rewards',         label: n('rewards'),         icon: Gift,          path: '/rewards' },
        { id: 'certificates',    label: n('certificates'),    icon: Award,         path: '/certificates' },
        { id: 'chat',            label: n('chat'),            icon: Send,          path: '/chat' },
        { id: 'pdf-reports',     label: n('pdfReports'),      icon: Download,      path: '/pdf-reports' },
        { id: 'teacher-ratings', label: n('teacherRatings'),  icon: Star,          path: '/teacher-ratings' },
        { id: 'messages',        label: n('messages'),        icon: MessageSquare, path: '/messages', badge: unreadCount },
        { id: 'reports',         label: n('reports'),         icon: BarChart3,     path: '/reports' },
      );
    }

    if (role === ROLES.TEACHER) {
      items.push(
        { id: 'groups',          label: n('groups'),          icon: UsersRound,    path: '/groups' },
        { id: 'schedule',        label: n('schedule'),        icon: Calendar,      path: '/schedule' },
        { id: 'attendance',      label: n('attendance'),      icon: CalendarCheck, path: '/attendance' },
        { id: 'grades',          label: n('grades'),          icon: FileText,      path: '/grades' },
        { id: 'homework',        label: n('homework'),        icon: BookOpen,      path: '/homework' },
        { id: 'quizzes',         label: n('quizzes'),         icon: FileQuestion,  path: '/quizzes' },
        { id: 'materials',       label: n('materials'),       icon: Video,         path: '/materials' },
        { id: 'leaderboard',     label: n('leaderboard'),     icon: Trophy,        path: '/leaderboard' },
        { id: 'certificates',    label: n('certificates'),    icon: Award,         path: '/certificates' },
        { id: 'chat',            label: n('chat'),            icon: Send,          path: '/chat' },
        { id: 'pdf-reports',     label: n('pdfReports'),      icon: Download,      path: '/pdf-reports' },
        { id: 'payments',        label: n('payments'),        icon: CreditCard,    path: '/payments' },
        { id: 'messages',        label: n('messages'),        icon: MessageSquare, path: '/messages', badge: unreadCount },
      );
    }

    if (role === ROLES.STUDENT || role === ROLES.PARENT) {
      if (role === ROLES.PARENT) {
        items.push({ id: 'parent', label: n('parent'), icon: Users, path: '/parent' });
      }
      items.push(
        { id: 'grades',          label: n('myGrades'),        icon: FileText,      path: '/grades' },
        { id: 'attendance',      label: n('myAttendance'),    icon: CalendarCheck, path: '/attendance' },
        { id: 'homework',        label: n('homework'),        icon: BookOpen,      path: '/homework' },
        { id: 'quizzes',         label: n('quizzes'),         icon: FileQuestion,  path: '/quizzes' },
        { id: 'materials',       label: n('materials'),       icon: Video,         path: '/materials' },
        { id: 'leaderboard',     label: n('leaderboard'),     icon: Trophy,        path: '/leaderboard' },
        { id: 'rewards',         label: n('rewards'),         icon: Gift,          path: '/rewards' },
        { id: 'certificates',    label: n('certificates'),    icon: Award,         path: '/certificates' },
        { id: 'chat',            label: n('chat'),            icon: Send,          path: '/chat' },
        { id: 'schedule',        label: n('schedule'),        icon: Calendar,      path: '/schedule' },
        { id: 'payments',        label: n('myPayments'),      icon: CreditCard,    path: '/payments' },
        { id: 'teacher-ratings', label: n('myRatings'),       icon: Star,          path: '/teacher-ratings' },
        { id: 'messages',        label: n('messages'),        icon: MessageSquare, path: '/messages', badge: unreadCount },
      );
    }

    return items;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-xl text-gray-900 dark:text-white">EduCenter</span>}
        </div>
        <button onClick={onMobileClose || onToggle} className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative
              ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium flex-1">{item.label}</span>}
            {item.badge > 0 && (
              <span className={`
                absolute ${collapsed ? 'top-0 right-0' : 'right-3'}
                min-w-[20px] h-5 px-1.5 flex items-center justify-center
                bg-red-500 text-white text-xs font-bold rounded-full
              `}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings & User */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {/* Sozlamalar - faqat Direktor uchun */}
        {role === ROLES.DIRECTOR && (
          <NavLink
            to="/settings"
            onClick={onMobileClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-2
              ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span className="font-medium">{t('nav.settings')}</span>}
          </NavLink>
        )}

        {/* Profil */}
        <NavLink
          to="/profile"
          onClick={onMobileClose}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-2
            ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <Users className="w-5 h-5" />
          {!collapsed && <span className="font-medium">{t('nav.profile')}</span>}
        </NavLink>

        {/* User info */}
        <div className={`flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
          <Avatar name={userData?.fullName} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userData?.fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{ROLE_NAMES[role]}</p>
            </div>
          )}
          <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Chiqish">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 lg:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

const LANGS = [
  { code: 'uz', label: "O'z", flag: '🇺🇿' },
  { code: 'ru', label: 'Ру', flag: '🇷🇺' },
  { code: 'en', label: 'En', flag: '🇬🇧' },
];

const Header = ({ onMenuClick, unreadCount }) => {
  const { userData, centerData } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Center name */}
        {centerData?.name && (
          <div className="hidden sm:block">
            <h2 className="font-semibold text-gray-900">{centerData.name}</h2>
            {centerData.subscription === 'trial' && (() => {
              const days = trialDaysLeft(centerData);
              const expired = isTrialExpired(centerData);
              if (expired) return (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                  ⚠️ Sinov muddati tugadi
                </span>
              );
              return (
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                  👑 VIP sinov — {days} kun qoldi
                </span>
              );
            })()}
          </div>
        )}
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Til tanlash */}
        <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {LANGS.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                i18n.language === code
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
              title={flag}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/messages')}
          className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <Avatar name={userData?.fullName} size="sm" />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

const DashboardLayout = () => {
  const { userData, role, centerId, centerData } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [paymentAlert, setPaymentAlert] = useState(null); // To'lov ogohlantirishlari
  const [alertDismissed, setAlertDismissed] = useState(false);

  // To'lov holatini tekshirish (O'quvchi va Ota-ona uchun)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!userData?.id || (role !== ROLES.STUDENT && role !== ROLES.PARENT)) return;
      if (alertDismissed) return;

      try {
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const userPhone = normalizePhone(userData?.phone);
        const userEmail = userData?.email?.toLowerCase();
        const childIds = userData?.childIds || (userData?.childId ? [userData.childId] : []);

        // O'quvchilarni topish
        let myStudents = [];
        if (role === ROLES.PARENT && childIds.length > 0) {
          const fetched = await Promise.all(childIds.map(id => studentsAPI.getById(id)));
          myStudents = fetched.filter(Boolean);
        } else {
          const allStudents = await studentsAPI.getAll();
          if (role === ROLES.PARENT) {
            myStudents = allStudents.filter(s => {
              const p = normalizePhone(s.parentPhone);
              return p === userPhone || childIds.includes(s.id);
            });
          } else {
            const s = allStudents.find(s =>
              s.email?.toLowerCase() === userEmail || normalizePhone(s.phone) === userPhone
            );
            if (s) myStudents = [s];
          }
        }

        if (myStudents.length === 0) return;

        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        let debtStudents = [];
        let pendingStudents = [];

        for (const student of myStudents) {
          if (student.isFree) continue;

          // monthly_bills dan joriy oy holatini olish
          const bills = await paymentsAPI.getMonthlyBillsByStudent(student.id);
          const currentBill = bills.find(b => b.month === currentMonthStr);

          if (!currentBill) {
            // Bill yo'q — faqat agar student shu oyda boshlamagan bo'lsa ogohlantir
            const startDate = student.startDate ? new Date(student.startDate) : null;
            const startMonth = startDate
              ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
              : null;
            if (startMonth && startMonth < currentMonthStr) {
              pendingStudents.push(student.fullName);
            }
          } else if (currentBill.status !== 'paid' && (currentBill.remainingAmount || 0) > 0) {
            // O'tgan oylar qarzi ham bormi?
            const pastDebt = bills
              .filter(b => b.month < currentMonthStr && (b.remainingAmount || 0) > 0)
              .reduce((s, b) => s + b.remainingAmount, 0);
            if (pastDebt > 0) {
              debtStudents.push(student.fullName);
            } else {
              pendingStudents.push(student.fullName);
            }
          }
        }

        if (debtStudents.length > 0) {
          setPaymentAlert({
            type: 'danger',
            message: `⚠️ Qarzdorlik mavjud! ${debtStudents.join(', ')} uchun to'lov qilish kerak.`,
            action: () => navigate('/payments')
          });
        } else if (pendingStudents.length > 0) {
          setPaymentAlert({
            type: 'warning',
            message: `💰 Bu oy uchun to'lov qilish vaqti keldi: ${pendingStudents.join(', ')}`,
            action: () => navigate('/payments')
          });
        }
      } catch (err) {
        console.error('Payment check error:', err);
      }
    };

    checkPaymentStatus();
  }, [userData, role, alertDismissed, navigate]);

  // Student/Parent uchun notification ruxsat so'rash
  useEffect(() => {
    if (role === ROLES.STUDENT || role === ROLES.PARENT) {
      requestNotificationPermission();
    }
  }, [role]);

  // Xabarlarni tekshirish
  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (!userData?.id || !centerId) return;
      
      try {
        const allMessages = await messagesAPI.getAll();
        const allTeachers = await teachersAPI.getAll();
        
        // O'qituvchi uchun teachers ID topish
        let myTeacherId = userData?.id;
        if (role === ROLES.TEACHER) {
          const myTeacherRecord = allTeachers.find(t => t.email === userData?.email);
          if (myTeacherRecord) {
            myTeacherId = myTeacherRecord.id;
          }
        }
        
        // O'qilmagan xabarlar sonini hisoblash
        const unread = allMessages.filter(msg => {
          if (msg.read) return false;
          if (msg.senderId === userData?.id) return false; // O'zining xabarlarini hisoblamaslik
          
          // Direktor adminga yo'llangan xabarlarni ham ko'radi
          if (role === ROLES.DIRECTOR && msg.recipientType === 'admins') {
            return true;
          }
          
          // Umumiy xabarlar
          if (msg.recipientType === 'all_students' && (role === ROLES.STUDENT || role === ROLES.PARENT)) {
            return true;
          }
          if (msg.recipientType === 'all_teachers' && role === ROLES.TEACHER) {
            return true;
          }
          
          // Shaxsiy xabarlar
          if (msg.recipientIds?.includes(userData?.id) || msg.recipientIds?.includes(myTeacherId)) {
            return true;
          }
          if (msg.recipientId === userData?.id) {
            return true;
          }
          
          return false;
        });
        
        setUnreadCount(unread.length);
      } catch (err) {
        console.error('Unread check error:', err);
      }
    };
    
    checkUnreadMessages();
    // Har 30 sekundda tekshirish
    const interval = setInterval(checkUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [userData, role]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        unreadCount={unreadCount}
      />
      
      <div className={`transition-all ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Header 
          onMenuClick={() => setMobileOpen(true)} 
          unreadCount={unreadCount}
        />
        
        {/* To'lov ogohlantirishlari */}
        {paymentAlert && !alertDismissed && (
          <div className={`mx-4 lg:mx-6 mt-4 p-4 rounded-lg flex items-center justify-between ${
            paymentAlert.type === 'danger' 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${
                paymentAlert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <span className={`font-medium ${
                paymentAlert.type === 'danger' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {paymentAlert.message}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={paymentAlert.action}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  paymentAlert.type === 'danger'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                To'lovga o'tish
              </button>
              <button
                onClick={() => setAlertDismissed(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        
        {import.meta.env.VITE_APP_ENV === 'staging' && (
          <div className="bg-amber-400 text-amber-900 text-center text-xs font-bold py-1 px-4">
            ⚠️ STAGING MUHITI — Bu yerda qilingan o'zgarishlar test uchun
          </div>
        )}
        {centerData && isTrialExpired(centerData) && (
          <div className="mx-4 lg:mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-red-800">30 kunlik VIP sinov muddati tugadi</p>
              <p className="text-sm text-red-600 mt-0.5">
                Tizimdan foydalanishni davom ettirish uchun tarifni tanlang.
                Asosiy: 99,000 so'm/oy · Pro: 249,000 so'm/oy
              </p>
            </div>
            <a
              href="https://t.me/Diyorbek7337"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
            >
              Tarifni tanlash
            </a>
          </div>
        )}
        <main className="p-4 lg:p-6 pb-24">
          <Outlet />
        </main>
      </div>

      <MobileNav unreadCount={unreadCount} />
      <InstallPrompt />
    </div>
  );
};

export default DashboardLayout;
