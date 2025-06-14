/**
 * Компонент статистики для дашборда
 */
import React from 'react';
import { CubeIcon, BanknotesIcon, ArrowRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface StatsProps {
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  todaySales: number;
  monthRevenue: number;
  onShowTooltip?: (id: string) => void;
}

const DashboardStats: React.FC<StatsProps> = ({
  totalProducts,
  activeProducts,
  pendingProducts,
  todaySales,
  monthRevenue,
  onShowTooltip
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ключевые показатели</h2>
        <div className="relative">
          <button 
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => onShowTooltip?.('stats')}
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-xl p-4">
              <CubeIcon className="h-10 w-10 text-blue-600" />
            </div>
            <div className="ml-6">
              <p className="text-lg font-medium text-gray-500">Товары</p>
              <div className="flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">{totalProducts}</p>
                <p className="ml-3 text-lg text-gray-500">
                  <span className="text-green-500 font-medium">{activeProducts} активных</span>
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">{pendingProducts} ожидают проверки</p>
            </div>
          </div>
          <div className="mt-6">
            <button className="inline-flex w-full justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Управление товарами
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-xl p-4">
              <BanknotesIcon className="h-10 w-10 text-green-600" />
            </div>
            <div className="ml-6">
              <p className="text-lg font-medium text-gray-500">Доход</p>
              <div className="flex items-baseline">
                <p className="text-4xl font-bold text-gray-900">{monthRevenue.toLocaleString()} ₸</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">За текущий месяц</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-base font-medium text-gray-700">Сегодня:</p>
                <p className="text-base font-bold text-gray-900">{todaySales} продаж</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardStats; 