/**
 * Страница управления заказами
 */
import React from 'react';
import Layout from '../../components/layout/Layout';
import { useOrders } from '../../features/orders';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const OrdersPage: React.FC = () => {
  const {
    orders,
    total,
    isFilterExpanded,
    setIsFilterExpanded,
    searchTerm,
    setSearchTerm,
  } = useOrders();

  // Функция для отображения статуса заказа
  const getStatusLabel = (status: string) => {
    switch (status) {
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Управление заказами</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Всего заказов: {total}</p>
          </div>
        </div>

        {/* Фильтры заказов - новый дизайн */}
        <div className="mb-6 space-y-4">
          {/* Основная строка поиска */}
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Поиск по номеру заказа или клиенту..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white border-slate-200 shadow-sm rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:border-slate-300"
              />
              <button type="button" className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 hover:text-orange-500 transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`flex items-center justify-center gap-2 px-5 py-3 bg-white border-slate-200 shadow-sm rounded-xl transition-all hover:border-slate-300 font-medium whitespace-nowrap ${isFilterExpanded
                  ? 'text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                  : 'text-slate-700'
                  }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Фильтры</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Расширенные фильтры */}
          {isFilterExpanded && (
            <div className="p-5 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Статус заказа</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors">
                      Новый
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      В обработке
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      Отправлен
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      Доставлен
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      Завершен
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Период</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <select className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none text-slate-700 font-medium">
                      <option value="all">Все время</option>
                      <option value="today">Сегодня</option>
                      <option value="yesterday">Вчера</option>
                      <option value="week">За неделю</option>
                      <option value="month">За месяц</option>
                      <option value="quarter">За квартал</option>
                      <option value="year">За год</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Сумма заказа</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="От"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700"
                      />
                    </div>
                    <span className="text-slate-400 font-medium">—</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="До"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-sm font-medium transition-colors">
                  <XMarkIcon className="h-4 w-4" />
                  Сбросить
                </button>
                <button
                  onClick={() => setIsFilterExpanded(false)}
                  className="bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] hover:bg-orange-700 transition-all flex items-center gap-2 text-sm font-medium active:scale-[0.98]"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>Применить</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Таблица заказов */}
        <div className="bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl overflow-hidden mt-6">
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
