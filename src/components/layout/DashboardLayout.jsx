import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, UsersRound, UserPlus, CreditCard,
  CalendarCheck, MessageSquare, BarChart3, Settings, LogOut, Menu, X,
  Bell, Search, ChevronDown, FileText, Send, Shield, Calendar, Star, AlertTriangle,
  BookOpen, FileQuestion, Download, Trophy, Video, Gift, Award, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_NAMES } from '../../utils/constants';
import { Avatar } from '../common';
import { messagesAPI, teachersAPI, studentsAPI, paymentsAPI } from '../../services/api';
import MobileNav from './MobileNav';
import { requestNotificationPermission } from '../../services/notifications';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose, unreadCount }) => {
  const { userData, role, signOut } = useAuth();
  const navigate = useNavigate();

  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', label: 'Bosh sahifa', icon: LayoutDashboard, path: '/dashboard' },
    ];

    // Direktor uchun
    if (role === ROLES.DIRECTOR) {
      items.push(
        { id: 'admins', label: 'Adminlar', icon: Shield, path: '/admins' },
        { id: 'students', label: "O'quvchilar", icon: Users, path: '/students' },
        { id: 'teachers', label: "O'qituvchilar", icon: GraduationCap, path: '/teachers' },
        { id: 'groups', label: 'Guruhlar', icon: UsersRound, path: '/groups' },
        { id: 'schedule', label: 'Dars jadvali', icon: Calendar, path: '/schedule' },
        { id: 'leads', label: 'Lidlar', icon: UserPlus, path: '/leads' },
        { id: 'payments', label: "To'lovlar", icon: CreditCard, path: '/payments' },
        { id: 'attendance', label: 'Davomat', icon: CalendarCheck, path: '/attendance' },
        { id: 'grades', label: 'Baholar', icon: FileText, path: '/grades' },
        { id: 'homework', label: 'Uy vazifalari', icon: BookOpen, path: '/homework' },
        { id: 'quizzes', label: 'Online testlar', icon: FileQuestion, path: '/quizzes' },
        { id: 'materials', label: 'Materiallar', icon: Video, path: '/materials' },
        { id: 'leaderboard', label: 'Reyting', icon: Trophy, path: '/leaderboard' },
        { id: 'rewards', label: "Sovg'alar", icon: Gift, path: '/rewards' },
        { id: 'certificates', label: 'Sertifikatlar', icon: Award, path: '/certificates' },
        { id: 'chat', label: 'Guruh chat', icon: Send, path: '/chat' },
        { id: 'pdf-reports', label: 'PDF Hisobotlar', icon: Download, path: '/pdf-reports' },
        { id: 'teacher-ratings', label: "O'qituvchi baholari", icon: Star, path: '/teacher-ratings' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
        { id: 'reports', label: 'Statistika', icon: BarChart3, path: '/reports' },
        { id: 'activity-log', label: 'Faoliyat tarixi', icon: Activity, path: '/activity-log' },
      );
    }

    // Admin uchun
    if (role === ROLES.ADMIN) {
      items.push(
        { id: 'students', label: "O'quvchilar", icon: Users, path: '/students' },
        { id: 'teachers', label: "O'qituvchilar", icon: GraduationCap, path: '/teachers' },
        { id: 'groups', label: 'Guruhlar', icon: UsersRound, path: '/groups' },
        { id: 'schedule', label: 'Dars jadvali', icon: Calendar, path: '/schedule' },
        { id: 'leads', label: 'Lidlar', icon: UserPlus, path: '/leads' },
        { id: 'payments', label: "To'lovlar", icon: CreditCard, path: '/payments' },
        { id: 'attendance', label: 'Davomat', icon: CalendarCheck, path: '/attendance' },
        { id: 'grades', label: 'Baholar', icon: FileText, path: '/grades' },
        { id: 'homework', label: 'Uy vazifalari', icon: BookOpen, path: '/homework' },
        { id: 'quizzes', label: 'Online testlar', icon: FileQuestion, path: '/quizzes' },
        { id: 'materials', label: 'Materiallar', icon: Video, path: '/materials' },
        { id: 'leaderboard', label: 'Reyting', icon: Trophy, path: '/leaderboard' },
        { id: 'rewards', label: "Sovg'alar", icon: Gift, path: '/rewards' },
        { id: 'certificates', label: 'Sertifikatlar', icon: Award, path: '/certificates' },
        { id: 'chat', label: 'Guruh chat', icon: Send, path: '/chat' },
        { id: 'pdf-reports', label: 'PDF Hisobotlar', icon: Download, path: '/pdf-reports' },
        { id: 'teacher-ratings', label: "O'qituvchi baholari", icon: Star, path: '/teacher-ratings' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
        { id: 'reports', label: 'Statistika', icon: BarChart3, path: '/reports' },
      );
    }

    // O'qituvchi uchun
    if (role === ROLES.TEACHER) {
      items.push(
        { id: 'groups', label: 'Guruhlar', icon: UsersRound, path: '/groups' },
        { id: 'schedule', label: 'Dars jadvali', icon: Calendar, path: '/schedule' },
        { id: 'attendance', label: 'Davomat', icon: CalendarCheck, path: '/attendance' },
        { id: 'grades', label: 'Baholar', icon: FileText, path: '/grades' },
        { id: 'homework', label: 'Uy vazifalari', icon: BookOpen, path: '/homework' },
        { id: 'quizzes', label: 'Online testlar', icon: FileQuestion, path: '/quizzes' },
        { id: 'materials', label: 'Materiallar', icon: Video, path: '/materials' },
        { id: 'leaderboard', label: 'Reyting', icon: Trophy, path: '/leaderboard' },
        { id: 'certificates', label: 'Sertifikatlar', icon: Award, path: '/certificates' },
        { id: 'chat', label: 'Guruh chat', icon: Send, path: '/chat' },
        { id: 'pdf-reports', label: 'PDF Hisobotlar', icon: Download, path: '/pdf-reports' },
        { id: 'payments', label: "To'lovlar", icon: CreditCard, path: '/payments' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
      );
    }

    // O'quvchi va Ota-ona uchun
    if (role === ROLES.STUDENT || role === ROLES.PARENT) {
      if (role === ROLES.PARENT) {
        items.push({ id: 'parent', label: 'Farzandlarim', icon: Users, path: '/parent' });
      }
      items.push(
        { id: 'grades', label: 'Baholarim', icon: FileText, path: '/grades' },
        { id: 'attendance', label: 'Davomatim', icon: CalendarCheck, path: '/attendance' },
        { id: 'homework', label: 'Uy vazifalari', icon: BookOpen, path: '/homework' },
        { id: 'quizzes', label: 'Online testlar', icon: FileQuestion, path: '/quizzes' },
        { id: 'materials', label: 'Materiallar', icon: Video, path: '/materials' },
        { id: 'leaderboard', label: 'Reyting', icon: Trophy, path: '/leaderboard' },
        { id: 'rewards', label: "Sovg'alar", icon: Gift, path: '/rewards' },
        { id: 'certificates', label: 'Sertifikatlarim', icon: Award, path: '/certificates' },
        { id: 'chat', label: 'Guruh chat', icon: Send, path: '/chat' },
        { id: 'schedule', label: 'Dars jadvali', icon: Calendar, path: '/schedule' },
        { id: 'payments', label: "To'lovlarim", icon: CreditCard, path: '/payments' },
        { id: 'teacher-ratings', label: "O'qituvchini baholash", icon: Star, path: '/teacher-ratings' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
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
            {!collapsed && <span className="font-medium">Sozlamalar</span>}
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
          {!collapsed && <span className="font-medium">Profil</span>}
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

const Header = ({ onMenuClick, unreadCount }) => {
  const { userData, centerData } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
            {centerData.subscription === 'trial' && (
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                Sinov muddati
              </span>
            )}
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

      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={isDark ? "Yorug' rejim" : "Qoʻngʻir rejim"}
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
  const { userData, role } = useAuth();
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
        const students = await studentsAPI.getAll();
        const payments = await paymentsAPI.getAll();
        
        // Foydalanuvchiga tegishli o'quvchilarni topish
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const userPhone = normalizePhone(userData?.phone);
        const userEmail = userData?.email?.toLowerCase();
        
        let myStudents = [];
        
        if (role === ROLES.PARENT) {
          const childIds = userData?.childIds || (userData?.childId ? [userData.childId] : []);
          myStudents = students.filter(s => {
            const studentParentPhone = normalizePhone(s.parentPhone);
            return s.parentPhone === userData?.phone ||
                   studentParentPhone === userPhone ||
                   childIds.includes(s.id);
          });
        } else {
          // O'quvchi
          const student = students.find(s => {
            const studentPhone = normalizePhone(s.phone);
            const studentEmail = s.email?.toLowerCase();
            return studentEmail === userEmail ||
                   s.phone === userData?.phone ||
                   studentPhone === userPhone;
          });
          if (student) myStudents = [student];
        }
        
        if (myStudents.length === 0) return;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        // To'lov holatini tekshirish
        const hasPaymentForMonth = (studentId, year, month) => {
          const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
          return payments.some(p => 
            p.studentId === studentId && 
            p.status === 'paid' && 
            p.month === monthStr
          );
        };
        
        let hasDebt = false;
        let hasPending = false;
        let debtStudents = [];
        let pendingStudents = [];
        
        for (const student of myStudents) {
          const startDate = student.startDate ? new Date(student.startDate) : null;
          const startedThisMonth = startDate && 
            startDate.getMonth() === currentMonth && 
            startDate.getFullYear() === currentYear;
          
          const hasPaidCurrent = hasPaymentForMonth(student.id, currentYear, currentMonth);
          const hasPaidLast = hasPaymentForMonth(student.id, lastMonthYear, lastMonth);
          
          if (!hasPaidCurrent) {
            if (!startedThisMonth && !hasPaidLast) {
              hasDebt = true;
              debtStudents.push(student.fullName);
            } else if (!startedThisMonth) {
              hasPending = true;
              pendingStudents.push(student.fullName);
            }
          }
        }
        
        if (hasDebt) {
          setPaymentAlert({
            type: 'danger',
            message: `⚠️ Qarzdorlik mavjud! ${debtStudents.join(', ')} uchun to'lov qilish kerak.`,
            action: () => navigate('/payments')
          });
        } else if (hasPending) {
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
      if (!userData?.id) return;
      
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
        
        <main className="p-4 lg:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileNav unreadCount={unreadCount} />
    </div>
  );
};

export default DashboardLayout;
