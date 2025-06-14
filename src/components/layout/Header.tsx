/**
 * Главный заголовок сайта
 */
import React from 'react';
import { UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  companyName?: string;
}

const Header: React.FC<HeaderProps> = ({ companyName = 'ООО "СтройПоставка"' }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {companyName}</h1>
              <p className="mt-1 text-sm text-gray-500">Система управления товарами и заказами</p>
            </div>
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Уведомления
              <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                3
              </span>
            </button>
            
            <div className="flex items-center">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                <UserCircleIcon className="h-8 w-8 text-gray-400 mr-1" />
                <span className="hidden md:inline-block">Профиль</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 