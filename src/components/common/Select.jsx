import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Tanlang...',
  className = '',
  containerClassName = '',
  required = false,
  ...props
}, ref) => {
  const baseSelectClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
    focus:outline-none focus:ring-0
    appearance-none cursor-pointer
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
    : 'border-gray-200 focus:border-primary-500 bg-white hover:border-gray-300';

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`
            ${baseSelectClasses}
            ${stateClasses}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
