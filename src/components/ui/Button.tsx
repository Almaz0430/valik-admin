/**
 * Компонент кнопки для использования в дашборде
 */
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'custom';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] shadow-sm disabled:active:scale-100 disabled:shadow-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/20 hover:shadow-md text-white focus:ring-orange-500',
    secondary: 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-400',
    success: 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/20 hover:shadow-md text-white focus:ring-emerald-500',
    danger: 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/20 hover:shadow-md text-white focus:ring-red-500',
    warning: 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/20 hover:shadow-md text-white focus:ring-amber-500',
    info: 'bg-sky-500 hover:bg-sky-600 hover:shadow-sky-500/20 hover:shadow-md text-white focus:ring-sky-500',
    light: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300',
    dark: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700',
    link: 'bg-transparent text-orange-600 hover:text-orange-800 hover:underline focus:ring-orange-500 p-0 shadow-none active:scale-100',
    custom: '',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-xs py-1 px-2',
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${variant !== 'link' ? sizeStyles[size] : ''}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}

      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 