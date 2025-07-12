/**
 * Компонент текстовой области
 */
import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    fullWidth = false, 
    className = '',
    rows = 3,
    resize,
    ...props 
  }, ref) => {
    const textareaClasses = `
      block px-4 py-2 w-full rounded-md border-gray-300 shadow-sm 
      focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
      ${resize ? `resize-${resize}` : ''}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaClasses}
          rows={rows}
          style={resize === 'none' ? { resize: 'none' } : undefined}
          {...props}
        />
        
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea; 