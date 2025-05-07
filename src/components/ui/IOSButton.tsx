import React from 'react';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const IOSButton: React.FC<IOSButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg active:shadow-sm focus:ring-blue-500',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 active:bg-gray-50 focus:ring-gray-400',
  };
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IOSButton; 