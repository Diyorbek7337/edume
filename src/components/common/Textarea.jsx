import { forwardRef } from 'react';

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

export default Textarea;
