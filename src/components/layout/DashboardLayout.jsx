import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, UsersRound, UserPlus, CreditCard, 
  CalendarCheck, MessageSquare, BarChart3, Settings, LogOut, Menu, X,
  Bell, Search, ChevronDown, FileText, Send, Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_NAMES } from '../../utils/constants';
import { Avatar } from '../common';
import { messagesAPI, teachersAPI } from '../../services/api';

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
        { id: 'leads', label: 'Lidlar', icon: UserPlus, path: '/leads' },
        { id: 'payments', label: "To'lovlar", icon: CreditCard, path: '/payments' },
        { id: 'attendance', label: 'Davomat', icon: CalendarCheck, path: '/attendance' },
        { id: 'grades', label: 'Baholar', icon: FileText, path: '/grades' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
        { id: 'reports', label: 'Hisobotlar', icon: BarChart3, path: '/reports' },
      );
    }

    // Admin uchun
    if (role === ROLES.ADMIN) {
      items.push(
        { id: 'students', label: "O'quvchilar", icon: Users, path: '/students' },
        { id: 'teachers', label: "O'qituvchilar", icon: GraduationCap, path: '/teachers' },
        { id: 'groups', label: 'Guruhlar', icon: UsersRound, path: '/groups' },
        { id: 'leads', label: 'Lidlar', icon: UserPlus, path: '/leads' },
        { id: 'payments', label: "To'lovlar", icon: CreditCard, path: '/payments' },
        { id: 'attendance', label: 'Davomat', icon: CalendarCheck, path: '/attendance' },
        { id: 'grades', label: 'Baholar', icon: FileText, path: '/grades' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
        { id: 'reports', label: 'Hisobotlar', icon: BarChart3, path: '/reports' },
      );
    }

    // O'qituvchi uchun
    if (role === ROLES.TEACHER) {
      items.push(
        { id: 'groups', label: 'Guruhlar', icon: UsersRound, path: '/groups' },
        { id: 'attendance', label: 'Davomat', icon: CalendarCheck, path: '/attendance' },
        { id: 'grades', label: 'Baholar', icon: FileText, path: '/grades' },
        { id: 'payments', label: "To'lovlar", icon: CreditCard, path: '/payments' },
        { id: 'messages', label: 'Xabarlar', icon: MessageSquare, path: '/messages', badge: unreadCount },
      );
    }

    // O'quvchi va Ota-ona uchun
    if (role === ROLES.STUDENT || role === ROLES.PARENT) {
      items.push(
        { id: 'grades', label: 'Baholarim', icon: FileText, path: '/grades' },
        { id: 'attendance', label: 'Davomatim', icon: CalendarCheck, path: '/attendance' },
        { id: 'payments', label: "To'lovlarim", icon: CreditCard, path: '/payments' },
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
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-xl text-gray-900">EduCenter</span>}
        </div>
        <button onClick={onMobileClose || onToggle} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
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
              ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}
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
      <div className="p-3 border-t border-gray-200">
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
        <div className={`flex items-center gap-3 p-2 bg-gray-50 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
          <Avatar name={userData?.fullName} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userData?.fullName}</p>
              <p className="text-xs text-gray-500">{ROLE_NAMES[role]}</p>
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
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 lg:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

const Header = ({ onMenuClick, unreadCount }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button 
          onClick={() => navigate('/messages')}
          className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    <div className="min-h-screen bg-gray-50">
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
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
