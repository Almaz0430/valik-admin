/**
 * Страница управления заказами
 */
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const OrdersPage: React.FC = () => {
  const [orders] = useState<any[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  // Функция для отображения статуса заказа
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': 
        return { text: 'Новый', classes: 'bg-blue-100 text-blue-800' };
      case 'processing': 
        return { text: 'В обработке', classes: 'bg-yellow-100 text-yellow-800' };
      case 'shipped': 
        return { text: 'Отправлен', classes: 'bg-purple-100 text-purple-800' };
      case 'delivered': 
        return { text: 'Доставлен', classes: 'bg-green-100 text-green-800' };
      case 'completed': 
        return { text: 'Завершен', classes: 'bg-gray-100 text-gray-800' };
      default: 
        return { text: 'Неизвестно', classes: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
            <p className="mt-1 text-sm text-gray-500">Всего заказов: {orders.length}</p>
          </div>
        </div>
        
        {/* Фильтры заказов - новый дизайн */}
        <div className="bg-white rounded-xl shadow-sm box-border">
          {/* Основная строка поиска */}
          <div className="flex flex-col md:flex-row md:items-center p-4 gap-3 box-border">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по номеру заказа или клиенту..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent box-border"
              />
            </div>
            
            <div className="flex items-center gap-2 box-border">
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors box-border ${
                  isFilterExpanded 
                    ? 'bg-orange-50 text-orange-600 border-orange-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Фильтры</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              <button className="bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 box-border">
                <FunnelIcon className="h-5 w-5" />
                <span>Применить</span>
              </button>
            </div>
          </div>
          
          {/* Расширенные фильтры */}
          {isFilterExpanded && (
            <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl box-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 box-border">
                <div className="box-border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Статус заказа</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 box-border">
                      Новый
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 box-border">
                      В обработке
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 box-border">
                      Отправлен
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 box-border">
                      Доставлен
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 box-border">
                      Завершен
                    </button>
                  </div>
                </div>
                
                <div className="box-border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
                  <div className="relative box-border">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <select className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent box-border appearance-none">
                      <option value="all">Все время</option>
                      <option value="today">Сегодня</option>
                      <option value="yesterday">Вчера</option>
                      <option value="week">За неделю</option>
                      <option value="month">За месяц</option>
                      <option value="quarter">За квартал</option>
                      <option value="year">За год</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="box-border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Сумма заказа</label>
                  <div className="flex items-center gap-3 box-border">
                    <div className="relative flex-1 box-border">
                      <input
                        type="number"
                        placeholder="От"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent box-border"
                      />
                    </div>
                    <span className="text-gray-500 px-1">—</span>
                    <div className="relative flex-1 box-border">
                      <input
                        type="number"
                        placeholder="До"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent box-border"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 box-border">
                <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm box-border">
                  <XMarkIcon className="h-4 w-4" />
                  Сбросить все фильтры
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Таблица заказов */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {orders.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      № заказа
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const status = getStatusLabel(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.classes}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total.toLocaleString()} ₸
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-orange-600 hover:text-orange-900 mr-4">
                            Подробнее
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Печать
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Пагинация */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Показано <span className="font-medium">0-0</span> из <span className="font-medium">0</span> заказов
                  </div>
                  <div className="flex space-x-1">
                    <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                      Назад
                    </button>
                    <button className="px-3 py-1 border border-orange-500 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
                      1
                    </button>
                    <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                      Далее
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 px-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-500 mb-6">
                <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl text-gray-800 font-medium mb-2">Заказов пока нет</p>
              <p className="text-gray-500 text-base max-w-md mx-auto">Здесь будут отображаться заказы, когда они появятся в системе</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage; 