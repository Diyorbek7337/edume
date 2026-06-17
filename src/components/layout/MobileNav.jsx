import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, CreditCard, MessageSquare,
  FileText, Users, UserPlus, UsersRound, GraduationCap, BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';

const TABS = {
  [ROLES.STUDENT]: [
    { to: '/dashboard',    icon: LayoutDashboard, label: 'Asosiy' },
    { to: '/attendance',   icon: CalendarCheck,   label: 'Davomat' },
    { to: '/grades',       icon: FileText,        label: 'Baholar' },
    { to: '/payments',     icon: CreditCard,      label: "To'lov" },
    { to: '/messages',     icon: MessageSquare,   label: 'Xabar' },
  ],
  [ROLES.PARENT]: [
    { to: '/dashboard',    icon: LayoutDashboard, label: 'Asosiy' },
    { to: '/parent',       icon: Users,           label: 'Farzand' },
    { to: '/attendance',   icon: CalendarCheck,   label: 'Davomat' },
    { to: '/payments',     icon: CreditCard,      label: "To'lov" },
    { to: '/messages',     icon: MessageSquare,   label: 'Xabar' },
  ],
  [ROLES.TEACHER]: [
    { to: '/dashboard',    icon: LayoutDashboard, label: 'Asosiy' },
    { to: '/groups',       icon: UsersRound,      label: 'Guruhlar' },
    { to: '/attendance',   icon: CalendarCheck,   label: 'Davomat' },
    { to: '/grades',       icon: FileText,        label: 'Baholar' },
    { to: '/messages',     icon: MessageSquare,   label: 'Xabar' },
  ],
  [ROLES.ADMIN]: [
    { to: '/dashboard',    icon: LayoutDashboard, label: 'Asosiy' },
    { to: '/students',     icon: Users,           label: "O'quvchi" },
    { to: '/payments',     icon: CreditCard,      label: "To'lov" },
    { to: '/leads',        icon: UserPlus,        label: 'Lidlar' },
    { to: '/messages',     icon: MessageSquare,   label: 'Xabar' },
  ],
  [ROLES.DIRECTOR]: [
    { to: '/dashboard',    icon: LayoutDashboard, label: 'Asosiy' },
    { to: '/students',     icon: Users,           label: "O'quvchi" },
    { to: '/payments',     icon: CreditCard,      label: "To'lov" },
    { to: '/leads',        icon: UserPlus,        label: 'Lidlar' },
    { to: '/messages',     icon: MessageSquare,   label: 'Xabar' },
  ],
};

const MobileNav = ({ unreadCount = 0 }) => {
  const { role } = useAuth();
  const tabs = TABS[role];
  if (!tabs) return null;

  return (
    <>
      <div className="h-16 md:hidden" aria-hidden="true" />
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition-colors ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    {to === '/messages' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={isActive ? 'font-semibold' : ''}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
