const variants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-primary-100 text-primary-800 border-primary-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  accent: 'bg-accent-100 text-accent-800 border-accent-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full mr-1.5
            ${variant === 'success' ? 'bg-green-500' : ''}
            ${variant === 'warning' ? 'bg-yellow-500' : ''}
            ${variant === 'danger' ? 'bg-red-500' : ''}
            ${variant === 'info' ? 'bg-blue-500' : ''}
            ${variant === 'primary' ? 'bg-primary-500' : ''}
            ${variant === 'default' ? 'bg-gray-500' : ''}
          `}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
