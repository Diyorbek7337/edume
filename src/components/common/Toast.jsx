import { useNotification } from '../../contexts/NotificationContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

const Toast = ({ notification, onClose }) => {
  const Icon = icons[notification.type] || icons.info;
  const colorClasses = colors[notification.type] || colors.info;
  const iconColor = iconColors[notification.type] || iconColors.info;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg
        ${colorClasses}
        animate-slide-in-right
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className="font-semibold">{notification.title}</p>
        )}
        <p className={notification.title ? 'text-sm opacity-90' : ''}>
          {notification.message}
        </p>
      </div>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
