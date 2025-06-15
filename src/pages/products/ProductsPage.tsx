/**
 * Страница управления товарами
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const ProductsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление товарами</h1>
            <p className="mt-1 text-sm text-gray-500">Всего товаров: 57</p>
          </div>
          <Link 
            to="/dashboard/products/create" 
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-flex items-center justify-center w-full sm:w-auto"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить товар
          </Link>
        </div>
        
        {/* Поле поиска вынесено за пределы блока товаров */}
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Поиск товаров..." 
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
        
        {/* Обновленный блок товаров */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Заголовок таблицы */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5 sm:col-span-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </div>
              <div className="hidden sm:block col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </div>
              <div className="col-span-3 sm:col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </div>
              <div className="hidden sm:block col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Остаток
              </div>
              <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </div>
              <div className="col-span-2 sm:col-span-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </div>
            </div>
          </div>
          
          {/* Список товаров */}
          <div className="divide-y divide-gray-200">
            {/* Товар 1 */}
            <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 sm:col-span-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">Цемент М500</div>
                      <div className="text-xs text-gray-500 sm:hidden">3 500 ₸</div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block col-span-2">
                  <div className="text-sm text-gray-900">Строительные материалы</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-sm font-medium text-gray-900">3 500 ₸</div>
                </div>
                <div className="hidden sm:block col-span-1">
                  <div className="text-sm text-gray-900">124 шт.</div>
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Активный
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 text-right">
                  <button className="text-orange-600 hover:text-orange-900 mr-2">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Товар 2 */}
            <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 sm:col-span-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">Кирпич облицовочный</div>
                      <div className="text-xs text-gray-500 sm:hidden">150 ₸</div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block col-span-2">
                  <div className="text-sm text-gray-900">Строительные материалы</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-sm font-medium text-gray-900">150 ₸</div>
                </div>
                <div className="hidden sm:block col-span-1">
                  <div className="text-sm text-gray-900">2 450 шт.</div>
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    На проверке
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 text-right">
                  <button className="text-orange-600 hover:text-orange-900 mr-2">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Пагинация и информация */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Показано <span className="font-medium">57</span> товаров
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  3
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage; 