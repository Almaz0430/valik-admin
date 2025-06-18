/**
 * Страница управления заказами
 */
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';

const OrdersPage: React.FC = () => {
  const [orders] = useState([
    { id: 1, number: "ORD-001", customer: "Иван Петров", date: "2023-08-15", status: "new", total: 25000 },
    { id: 2, number: "ORD-002", customer: "Анна Сидорова", date: "2023-08-14", status: "processing", total: 17500 },
    { id: 3, number: "ORD-003", customer: "Сергей Иванов", date: "2023-08-12", status: "shipped", total: 42000 },
    { id: 4, number: "ORD-004", customer: "Елена Кузнецова", date: "2023-08-10", status: "delivered", total: 9800 },
    { id: 5, number: "ORD-005", customer: "Алексей Смирнов", date: "2023-08-05", status: "completed", total: 63500 }
  ]);

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
        
        {/* Фильтры заказов */}
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Поиск заказов..." 
                className="pl-10 pr-4 py-2.5 bg-gray-50 shadow-sm rounded-md w-full focus:outline-none"
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
            
            <div className="w-full md:w-40">
              <select className="w-full px-4 py-2.5 bg-gray-50 shadow-sm rounded-md focus:outline-none">
                <option value="">Все статусы</option>
                <option value="new">Новые</option>
                <option value="processing">В обработке</option>
                <option value="shipped">Отправленные</option>
                <option value="delivered">Доставленные</option>
                <option value="completed">Завершенные</option>
              </select>
            </div>
            
            <div className="w-full md:w-48">
              <input 
                type="date" 
                className="w-full px-4 py-2.5 bg-gray-50 shadow-sm rounded-md focus:outline-none"
                placeholder="Фильтр по дате"
              />
            </div>
            
            <button className="px-4 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 md:ml-auto">
              Применить фильтры
            </button>
          </div>
        </div>
        
        {/* Таблица заказов */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
                Показано <span className="font-medium">1-5</span> из <span className="font-medium">12</span> заказов
              </div>
              <div className="flex space-x-1">
                <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                  Назад
                </button>
                <button className="px-3 py-1 border border-orange-500 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Далее
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage; 