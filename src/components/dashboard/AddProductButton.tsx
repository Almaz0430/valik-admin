/**
 * Компонент кнопки добавления товара
 */
import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface AddProductButtonProps {
  onClick?: () => void;
  className?: string;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      onClick={onClick}
    >
      <PlusCircleIcon className="h-6 w-6 mr-2" />
      Добавить товар
    </button>
  );
};

export default AddProductButton; 