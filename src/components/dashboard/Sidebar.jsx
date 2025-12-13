import { NavLink, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  LogOut, 
  Settings,
  LayoutDashboard,
  Users,
  UsersRound,
  UserPlus,
  CreditCard,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  FileText,
  TrendingUp,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getMenuItems, USER_ROLES } from '../../utils/constants';
import { Avatar } from '../common';

const iconMap = {
  LayoutDashboard,
  Users,
  UsersRound,
  UserPlus,
  CreditCard,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  FileText,
  TrendingUp,
  Send,
  GraduationCap,
};

const Sidebar = ({ collapsed, onToggle }) => {
  const { userData, signOut, role } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = getMenuItems(role);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-40
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl font-display gradient-text">
              EduCenter
            </span>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className={`
            p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500
            ${collapsed ? 'absolute -right-3 top-6 bg-white border border-gray-200 shadow-sm' : ''}
          `}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
        {/* Settings */}
        {(role === USER_ROLES.DIRECTOR || role === USER_ROLES.ADMIN) && (
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2
              transition-all duration-200
              ${isActive 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? 'Sozlamalar' : undefined}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Sozlamalar</span>}
          </NavLink>
        )}

        {/* User Info */}
        <div 
          className={`
            flex items-center gap-3 p-2 rounded-xl bg-gray-50
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <Avatar 
            name={userData?.fullName} 
            size="sm"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userData?.fullName || 'Foydalanuvchi'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email}
              </p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
