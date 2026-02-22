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
    <div className="bg-white overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl h-full">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Заказы</h3>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <TruckIcon className="h-6 w-6" />
            </div>
            <button
              id={`tooltip-trigger-orders`}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => onShowTooltip?.('orders')}
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 font-medium">Управление заказами клиентов</p>
      </div>
      <div className="p-5 space-y-3">
        <button className="group w-full flex items-center justify-between px-5 py-3 text-base text-left text-slate-700 bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 rounded-xl transition-all duration-200 active:scale-[0.98]">
          <span className="flex items-center font-medium">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mr-3 group-hover:scale-110 transition-transform">{newOrders}</span>
            <span>Новые заказа</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </button>

        <button className="group w-full flex items-center justify-between px-5 py-3 text-base text-left text-slate-700 bg-white border border-slate-200 hover:border-amber-200 hover:bg-amber-50/50 rounded-xl transition-all duration-200 active:scale-[0.98]">
          <span className="flex items-center font-medium">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mr-3 group-hover:scale-110 transition-transform">{processingOrders}</span>
            <span>В обработке</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </button>

        <button className="group w-full flex items-center justify-between px-5 py-3 text-base text-left text-slate-700 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-xl transition-all duration-200 active:scale-[0.98]">
          <span className="flex items-center font-medium">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mr-3 group-hover:scale-110 transition-transform">{completedOrders}</span>
            <span>Завершенные</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
};

export default OrderManagement; 