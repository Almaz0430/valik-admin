/**
 * Компонент модального окна подтверждения действия
 */
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from './button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  // Определяем цвета в зависимости от типа
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-100',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          bg: 'bg-yellow-100',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          icon: 'text-red-600',
          bg: 'bg-red-100',
          button: 'bg-red-600 hover:bg-red-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 custom-scrollbar">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity z-[90]"
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/50 rounded-3xl overflow-hidden flex flex-col transform transition-all z-[110]">
        <div className="p-6 sm:p-8">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full ${colors.bg} sm:mx-0 sm:h-12 sm:w-12 ring-4 ring-white shadow-sm`}>
              <ExclamationTriangleIcon className={`h-6 w-6 ${colors.icon}`} />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:ml-5 sm:text-left">
              <h3 className="text-xl leading-6 font-bold text-slate-900 tracking-tight">{title}</h3>
              <div className="mt-3">
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{message}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/50 border-t border-slate-100/80 p-5 sm:px-6 flex flex-col sm:flex-row-reverse sm:justify-start gap-3 rounded-b-3xl">
          <Button
            type="button"
            variant="custom"
            className={`w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] px-5 py-2.5 text-sm font-semibold text-white ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'danger' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 active:scale-[0.98] transition-all`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-white border border-slate-200 shadow-sm px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none active:scale-[0.98] transition-all"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 