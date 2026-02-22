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
    <div className={`bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className={`px-6 py-5 border-b border-slate-100 ${headerClassName}`}>
          {title && (
            typeof title === 'string'
              ? <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              : subtitle
          )}
        </div>
      )}

      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className={`px-6 py-4 bg-slate-50/50 border-t border-slate-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 