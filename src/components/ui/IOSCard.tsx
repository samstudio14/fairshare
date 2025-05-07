import React from 'react';

interface IOSCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const IOSCard: React.FC<IOSCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default IOSCard; 