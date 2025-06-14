/**
 * Страница управления заказами
 */
import React from 'react';
import Layout from '../../components/layout/Layout';

const OrdersPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
            <p className="mt-1 text-sm text-gray-500">Всего заказов: 32</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Экспорт
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
              Создать заказ
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Поиск заказов..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
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
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="">Статус заказа</option>
                <option value="new">Новый</option>
                <option value="processing">В обработке</option>
                <option value="shipped">Отправлен</option>
                <option value="delivered">Доставлен</option>
                <option value="cancelled">Отменен</option>
              </select>
              <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="">Период</option>
                <option value="today">Сегодня</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="year">За год</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № Заказа
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Пример заказа */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#ORD-2023-1542</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ТОО "СтройМастер"</div>
                    <div className="text-sm text-gray-500">г. Алматы</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">15.06.2023</div>
                    <div className="text-sm text-gray-500">14:32</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">125 000 ₸</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Доставлен
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900">Подробнее</button>
                  </td>
                </tr>
                
                {/* Пример заказа */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#ORD-2023-1543</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ИП "Строитель"</div>
                    <div className="text-sm text-gray-500">г. Нур-Султан</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">16.06.2023</div>
                    <div className="text-sm text-gray-500">09:15</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">78 500 ₸</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      В обработке
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900">Подробнее</button>
                  </td>
                </tr>
                
                {/* Пример заказа */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#ORD-2023-1544</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ТОО "СтройДом"</div>
                    <div className="text-sm text-gray-500">г. Шымкент</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">16.06.2023</div>
                    <div className="text-sm text-gray-500">11:45</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">245 300 ₸</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      Новый
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900">Подробнее</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано <span className="font-medium">1-10</span> из <span className="font-medium">32</span> заказов
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Назад
              </button>
              <button className="px-3 py-1 border border-orange-500 rounded-md text-sm font-medium text-white bg-orange-500">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Вперёд
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage; 