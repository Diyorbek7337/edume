import { getInitials, generateAvatarColor } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  online,
  ...props
}) => {
  const sizeClasses = sizes[size] || sizes.md;
  const initials = getInitials(name || alt);
  const bgColor = generateAvatarColor(name || alt);

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizeClasses} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div
          className={`
            ${sizeClasses} ${bgColor}
            rounded-full flex items-center justify-center
            font-semibold text-gray-500 ring-2 ring-blue-600
          `}
        >
          {initials}
        </div>
      )}
      
      {typeof online === 'boolean' && (
        <span
          className={`
            absolute bottom-0 right-0
            w-3 h-3 rounded-full border-2 border-white
            ${online ? 'bg-green-500' : 'bg-gray-900'}
          `}
        />
      )}
    </div>
  );
};

const AvatarGroup = ({ children, max = 4, size = 'md', className = '' }) => {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleCount = Math.min(childArray.length, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={`flex -space-x-3 ${className}`}>
      {childArray.slice(0, visibleCount).map((child, index) => (
        <div key={index} className="relative" style={{ zIndex: visibleCount - index }}>
          {child}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={`
            ${sizes[size]} bg-gray-200 rounded-full
            flex items-center justify-center
            font-semibold text-gray-600
            ring-2 ring-white
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

Avatar.Group = AvatarGroup;

export default Avatar;
