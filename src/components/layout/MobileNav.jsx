/**
 * MobileNav — fixed bottom navigation bar for Student & Parent roles.
 * Only rendered on small screens (< md). Hidden on desktop.
 */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, BookOpen, CreditCard,
  MessageSquare, FileText, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';

const STUDENT_TABS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Asosiy' },
  { to: '/my-attendance', icon: CalendarCheck,    label: 'Davomat' },
  { to: '/my-grades',     icon: FileText,         label: 'Baholar' },
  { to: '/my-payments',   icon: CreditCard,       label: "To'lov" },
  { to: '/messages',      icon: MessageSquare,    label: 'Xabar' },
];

const PARENT_TABS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Asosiy' },
  { to: '/my-attendance', icon: CalendarCheck,   label: 'Davomat' },
  { to: '/my-grades',     icon: FileText,        label: 'Baholar' },
  { to: '/my-payments',  icon: CreditCard,       label: "To'lov" },
  { to: '/messages',     icon: MessageSquare,    label: 'Xabar' },
];

const MobileNav = ({ unreadCount = 0 }) => {
  const { role } = useAuth();

  const isStudent = role === ROLES.STUDENT;
  const isParent  = role === ROLES.PARENT;

  if (!isStudent && !isParent) return null;

  const tabs = isParent ? PARENT_TABS : STUDENT_TABS;

  return (
    <>
      {/* Spacer so content isn't hidden behind the nav */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    {/* Unread badge on messages */}
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
