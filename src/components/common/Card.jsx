const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer' : ''}
        ${paddingClasses[padding] ?? padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-gray-900 font-display ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-500 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
