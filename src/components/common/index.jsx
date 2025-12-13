import { forwardRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

// ==================== BUTTON ====================
export const Button = forwardRef(({
  children, variant = 'primary', size = 'md', loading, icon: Icon, className = '', ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
});

// ==================== INPUT ====================
export const Input = forwardRef(({ label, error, type = 'text', icon: Icon, className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input
          ref={ref}
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${Icon ? 'pl-10' : ''} ${type === 'password' ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

// ==================== SELECT ====================
export const Select = forwardRef(({ label, error, options = [], placeholder = 'Tanlang...', className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

// ==================== TEXTAREA ====================
export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

// ==================== CARD ====================
export const Card = ({ children, className = '', padding = 'p-6', ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${padding} ${className}`} {...props}>
    {children}
  </div>
);

// ==================== BADGE ====================
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
};

// ==================== AVATAR ====================
export const Avatar = ({ name, src, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];

  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-semibold text-white ${className}`}>
      {getInitials(name)}
    </div>
  );
};

// ==================== MODAL ====================
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
      <div className={`${sizes[size]} w-full bg-white rounded-xl shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

// ==================== TABLE ====================
export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className={`w-full ${className}`}>{children}</table>
  </div>
);

Table.Head = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
Table.Body = ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>;
Table.Row = ({ children, onClick, className = '' }) => (
  <tr className={`hover:bg-gray-50 transition ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>{children}</tr>
);
Table.Header = ({ children, className = '' }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase ${className}`}>{children}</th>
);
Table.Cell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>
);

// ==================== LOADING ====================
export const Loading = ({ fullScreen, text }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      {text && <p className="text-gray-500">{text}</p>}
    </div>
  );
  if (fullScreen) return <div className="fixed inset-0 flex items-center justify-center bg-white z-50">{content}</div>;
  return content;
};

// ==================== EMPTY STATE ====================
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && <Icon className="w-12 h-12 text-gray-300 mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    {description && <p className="text-gray-500 mb-4">{description}</p>}
    {action}
  </div>
);

// ==================== STATS CARD ====================
export const StatsCard = ({ title, value, icon: Icon, change, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% o'tgan oyga nisbatan
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

// ==================== TABS ====================
export const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
          activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
