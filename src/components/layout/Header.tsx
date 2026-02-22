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
    <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Добро пожаловать, {companyName}</h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">Система управления товарами и заказами</p>
            </div>
            <div className="md:hidden">
              <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button className="inline-flex items-center px-3 py-2 border border-slate-200/80 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white/50 hover:bg-white hover:border-slate-300 transition-all active:scale-[0.98]">
              Уведомления
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-50 text-red-600 text-[11px] font-bold ring-1 ring-inset ring-red-500/10">
                3
              </span>
            </button>

            <div className="flex items-center pl-2 border-l border-slate-200">
              <button className="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 ring-1 ring-slate-200 group-hover:ring-slate-300 transition-all">
                  <UserCircleIcon className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
                </div>
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