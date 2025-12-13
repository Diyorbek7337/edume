import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, Badge } from '../common';
import { ROLE_NAMES } from '../../utils/constants';

const Header = ({ onMenuClick }) => {
  const { userData, signOut, role } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications
  const notifications = [
    { id: 1, title: "Yangi o'quvchi qo'shildi", time: "5 daqiqa oldin", unread: true },
    { id: 2, title: "To'lov qabul qilindi", time: "1 soat oldin", unread: true },
    { id: 3, title: "Yangi xabar", time: "2 soat oldin", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Bildirishnomalar</h3>
                  <Badge variant="primary" size="sm">{unreadCount} yangi</Badge>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${
                        notification.unread ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900 font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Barchasini ko'rish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Avatar name={userData?.fullName} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {userData?.fullName || 'Foydalanuvchi'}
                </p>
                <p className="text-xs text-gray-500">
                  {ROLE_NAMES[role]}
                </p>
              </div>
            </button>

            {/* Profile dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">
                    {userData?.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Sozlamalar</span>
                  </button>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Chiqish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
