/**
 * Компонент управления заказами
 */
import React from 'react';
import { TruckIcon, ArrowRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface OrderManagementProps {
  newOrders: number;
  processingOrders: number;
  completedOrders: number;
  onShowTooltip?: (id: string) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({
  newOrders = 3,
  processingOrders = 5,
  completedOrders = 12,
  onShowTooltip
}) => {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Заказы</h3>
          <div className="flex items-center space-x-2">
            <TruckIcon className="h-8 w-8 text-orange-500" />
            <button 
              id={`tooltip-trigger-orders`}
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onShowTooltip?.('orders')}
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-gray-600">Управление заказами клиентов</p>
      </div>
      <div className="p-6 space-y-4">
        <button className="w-full flex items-center justify-between px-4 py-3 text-base text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
          <span className="flex items-center">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mr-3">{newOrders}</span>
            <span>Новые заказы</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-4 py-3 text-base text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
          <span className="flex items-center">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium mr-3">{processingOrders}</span>
            <span>В обработке</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-4 py-3 text-base text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
          <span className="flex items-center">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-100 text-green-800 text-sm font-medium mr-3">{completedOrders}</span>
            <span>Завершенные</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default OrderManagement; 