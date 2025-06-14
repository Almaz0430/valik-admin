/**
 * Страница управления товарами
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const ProductsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление товарами</h1>
            <p className="mt-1 text-sm text-gray-500">Всего товаров: 57</p>
          </div>
          <Link 
            to="/dashboard/products/create" 
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить товар
          </Link>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Поиск товаров..." 
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
                <option value="">Все категории</option>
                <option value="building">Строительные материалы</option>
                <option value="finishing">Отделочные материалы</option>
                <option value="tools">Инструменты</option>
              </select>
              <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="">Статус</option>
                <option value="active">Активные</option>
                <option value="pending">На проверке</option>
                <option value="archived">В архиве</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Остаток
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
                {/* Пример товара */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Цемент М500</div>
                        <div className="text-sm text-gray-500">Код: PRD-001</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Строительные материалы</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">3 500 ₸</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">124 шт.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Активный
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">Изменить</button>
                    <button className="text-red-600 hover:text-red-900">Удалить</button>
                  </td>
                </tr>
                
                {/* Пример товара */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Кирпич облицовочный</div>
                        <div className="text-sm text-gray-500">Код: PRD-002</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Строительные материалы</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">150 ₸</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2 450 шт.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      На проверке
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">Изменить</button>
                    <button className="text-red-600 hover:text-red-900">Удалить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <div className="text-sm text-gray-700">
              Показано <span className="font-medium">57</span> товаров
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage; 