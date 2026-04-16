import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  icon: Icon,
  className = '',
  containerClassName = '',
  helperText,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const baseInputClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
    focus:outline-none focus:ring-0
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    dark:text-gray-100
    disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
  `;

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 bg-red-50/50 dark:bg-red-900/20'
    : 'border-gray-200 dark:border-gray-600 focus:border-primary-500 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500';

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            ${baseInputClasses}
            ${stateClasses}
            ${Icon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
