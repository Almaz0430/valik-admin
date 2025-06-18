/**
 * Страница управления товарами
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import productService from '../../services/productService';
import type { Product, ProductQueryParams } from '../../types/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    limit: 10
  });
  
  // Определение типа устройства
  const { isMobile, isReady } = useDeviceDetect();
  
  // Перенаправление на мобильную версию
  useEffect(() => {
    if (isReady && isMobile) {
      navigate('/dashboard/products/mobile', { replace: true });
    }
  }, [isMobile, isReady, navigate]);

  // Загрузка товаров при монтировании компонента и при изменении параметров
  useEffect(() => {
    // Если будет перенаправление, не загружаем данные
    if (isReady && isMobile) return;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await productService.getProducts({
          ...queryParams,
          search: searchTerm || undefined
        });
        
        setProducts(response.products);
        setTotalProducts(response.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке товаров';
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [queryParams, searchTerm, isMobile, isReady]);

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };
  
  // Обработчик поиска по товарам
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // При поиске сбрасываем страницу на первую
    setQueryParams(prev => ({ ...prev, page: 1 }));
  };

  // Обработчик удаления товара
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Вы действительно хотите удалить этот товар?')) {
      try {
        await productService.deleteProduct(id);
        
        // Обновляем список товаров после удаления
        setProducts(products.filter(product => product.id !== id));
        setTotalProducts(prev => prev - 1);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении товара';
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  // Получаем диапазон отображаемых товаров для информации
  const getDisplayRange = () => {
    const start = (queryParams.page! - 1) * queryParams.limit! + 1;
    const end = Math.min(start + products.length - 1, totalProducts);
    return `${start}-${end}`;
  };
  
  // Общее количество страниц
  const totalPages = Math.ceil(totalProducts / queryParams.limit!);
  
  // Если идет перенаправление, показываем загрузку
  if (isReady && isMobile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление товарами</h1>
            <p className="mt-1 text-sm text-gray-500">Всего товаров: {totalProducts}</p>
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
        
        {/* Поле поиска */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Поиск товаров..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white shadow-sm rounded-md w-full focus:outline-none"
          />
          <button type="submit" className="absolute left-3 top-3 h-5 w-5 text-gray-400">
            <svg 
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
          </button>
        </form>
        
        {/* Блок товаров с состоянием загрузки и ошибками */}
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
          
          {/* Состояние загрузки */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-500">Загрузка товаров...</p>
            </div>
          )}
          
          {/* Сообщение об ошибке */}
          {error && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => {
                    productService.getProducts(queryParams)
                      .then(response => {
                        setProducts(response.products);
                        setTotalProducts(response.total);
                        setIsLoading(false);
                      })
                      .catch(err => {
                        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке товаров';
                        setError(errorMessage);
                        setIsLoading(false);
                      });
                  }, 500);
                }}
                className="mt-3 text-orange-600 hover:text-orange-800"
              >
                Попробовать снова
              </button>
            </div>
          )}
          
          {/* Список товаров */}
          {!isLoading && !error && (
            <div className="divide-y divide-gray-200">
              {products.length === 0 && (
                <div className="py-20 px-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-500 mb-6">
                    <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-xl text-gray-800 font-medium mb-2">Товары не найдены</p>
                  <p className="text-gray-500 text-base max-w-md mx-auto">Добавьте новый товар или измените параметры поиска</p>
                </div>
              )}
              
              {products.map((product) => (
                <div key={product.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 sm:col-span-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{product.price.toLocaleString()} ₸</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block col-span-2">
                      <div className="text-sm text-gray-900">{product.category_name || 'Не указана'}</div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <div className="text-sm font-medium text-gray-900">{product.price.toLocaleString()} ₸</div>
                    </div>
                    <div className="hidden sm:block col-span-1">
                      <div className="text-sm text-gray-900">{product.stock || 0} шт.</div>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'Активный' : 
                         product.status === 'pending' ? 'На проверке' : 
                         product.status === 'draft' ? 'Черновик' : 
                         'Неактивный'}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-right">
                      <button 
                        className="text-orange-600 hover:text-orange-900 mr-2"
                        onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Пагинация и информация */}
          {!isLoading && !error && products.length > 0 && (
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                  Показано <span className="font-medium">{getDisplayRange()}</span> из <span className="font-medium">{totalProducts}</span> товаров
                </div>
                {totalPages > 1 && (
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                          page === queryParams.page
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage; 