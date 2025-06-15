/**
 * Страница управления заказами
 */
import React from 'react';
import Layout from '../../components/layout/Layout';

const OrdersPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
            <p className="mt-1 text-sm text-gray-500">Всего заказов: 32</p>
          </div>
        </div>
        
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Поиск заказов..." 
            className="pl-10 pr-4 py-2.5 bg-white shadow-sm rounded-md w-full focus:outline-none"
          />
          <svg 
            className="absolute left-3 top-3 h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                № Заказа
              </div>
              <div className="hidden sm:block col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Клиент
              </div>
              <div className="col-span-3 sm:col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </div>
              <div className="col-span-3 sm:col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </div>
              <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </div>
              <div className="col-span-2 sm:col-span-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900">#ORD-1542</div>
                </div>
                <div className="hidden sm:block col-span-3">
                  <div className="text-sm text-gray-900">ТОО "СтройМастер"</div>
                  <div className="text-sm text-gray-500">г. Алматы</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-sm text-gray-900">15.06.2023</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-sm font-medium text-gray-900">125 000 ₸</div>
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Доставлен
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 text-right">
                  <button className="text-orange-600 hover:text-orange-900">
                    <svg className="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900">#ORD-1543</div>
                </div>
                <div className="hidden sm:block col-span-3">
                  <div className="text-sm text-gray-900">ИП "Строитель"</div>
                  <div className="text-sm text-gray-500">г. Нур-Султан</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-sm text-gray-900">16.06.2023</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-sm font-medium text-gray-900">78 500 ₸</div>
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    В обработке
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 text-right">
                  <button className="text-orange-600 hover:text-orange-900">
                    <svg className="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Показано <span className="font-medium">32</span> заказа
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage; 