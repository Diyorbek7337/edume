import { Loader2 } from 'lucide-react';

const Loading = ({ 
  size = 'md', 
  text = '', 
  fullScreen = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} text-primary-500 animate-spin`} />
      {text && <p className="text-gray-500 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};

const LoadingSkeleton = ({ className = '', rounded = 'md' }) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div 
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
    />
  );
};

Loading.Skeleton = LoadingSkeleton;

export default Loading;
