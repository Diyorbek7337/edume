import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'increase',
  color = 'primary',
  subtitle,
}) => {
  const colors = {
    primary: {
      bg: 'bg-primary-500',
      light: 'bg-primary-50',
      text: 'text-primary-600',
      gradient: 'from-primary-500 to-primary-600',
    },
    accent: {
      bg: 'bg-accent-500',
      light: 'bg-accent-50',
      text: 'text-accent-600',
      gradient: 'from-accent-500 to-accent-600',
    },
    success: {
      bg: 'bg-green-500',
      light: 'bg-green-50',
      text: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
    },
    warning: {
      bg: 'bg-yellow-500',
      light: 'bg-yellow-50',
      text: 'text-yellow-600',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    danger: {
      bg: 'bg-red-500',
      light: 'bg-red-50',
      text: 'text-red-600',
      gradient: 'from-red-500 to-red-600',
    },
    info: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
    },
  };

  const colorConfig = colors[color] || colors.primary;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 font-display">
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorConfig.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {changeType === 'increase' ? (
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+{change}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-semibold">-{change}%</span>
              </div>
            )}
            <span className="text-sm text-gray-500">O'tgan oyga nisbatan</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
