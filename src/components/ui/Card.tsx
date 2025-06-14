/**
 * Компонент карточки для отображения информации
 */
import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          {title && (
            typeof title === 'string' 
              ? <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              : subtitle
          )}
        </div>
      )}
      
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-3 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 