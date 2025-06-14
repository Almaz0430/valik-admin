/**
 * Компонент управления товарами
 */
import React from 'react';
import { 
  PlusCircleIcon, 
  CubeIcon, 
  ClockIcon, 
  ArrowRightIcon, 
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';

interface ProductManagementProps {
  pendingProducts: number;
  onShowTooltip?: (id: string) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  pendingProducts,
  onShowTooltip
}) => {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Товары</h3>
          <div className="flex items-center space-x-2">
            <CubeIcon className="h-8 w-8 text-orange-500" />
            <button 
              id={`tooltip-trigger-products`}
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onShowTooltip?.('products')}
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-gray-600">Управление каталогом товаров</p>
      </div>
      <div className="p-6 space-y-4">
        <button className="w-full flex items-center justify-between px-4 py-3 text-base text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
          <span className="flex items-center">
            <PlusCircleIcon className="h-6 w-6 mr-3 text-green-500" />
            <span>Добавить новый товар</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-4 py-3 text-base text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
          <span className="flex items-center">
            <CubeIcon className="h-6 w-6 mr-3 text-orange-500" />
            <span>Просмотр всех товаров</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-4 py-3 text-base text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
          <span className="flex items-center">
            <ClockIcon className="h-6 w-6 mr-3 text-yellow-500" />
            <span>Ожидающие проверки</span>
          </span>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
              {pendingProducts}
            </span>
            <ArrowRightIcon className="ml-2 h-5 w-5 text-gray-400" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductManagement; 