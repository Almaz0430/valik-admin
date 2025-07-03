/**
 * Страница управления товарами
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import productService from '../../services/productService';
import type { Product, ProductQueryParams } from '../../types/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
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
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete);
        
        // Обновляем список товаров после удаления
        setProducts(products.filter(product => product.id !== productToDelete));
        setTotalProducts(prev => prev - 1);
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении товара';
        alert(errorMessage);
        console.error(err);
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Открытие модального окна с детальной информацией о товаре
  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Получаем диапазон отображаемых товаров для информации
  const getDisplayRange = () => {
    const start = (queryParams.page! - 1) * queryParams.limit! + 1;
    const end = Math.min(start + products.length - 1, totalProducts);
    return `${start}-${end}`;
  };
  
  // Общее количество страниц
  const totalPages = Math.ceil(totalProducts / queryParams.limit!);
  
  // Функция для генерации массива страниц для пагинации
  const getPaginationRange = () => {
    const maxVisiblePages = 5;
    const currentPage = queryParams.page || 1;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const sidePages = Math.floor((maxVisiblePages - 3) / 2);
    
    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);
    
    if (currentPage - sidePages < 2) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }
    if (currentPage + sidePages > totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }
    
    const pages = [];
    
    pages.push(1);
    
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

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

  // Форматирование даты
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Не указано';
    const date = new Date(parseInt(dateString));
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Layout>
      <div className={`space-y-6 pb-16 lg:pb-0 ${isModalOpen || deleteModalOpen ? 'blur-sm' : ''}`}>
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
              <div className="col-span-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </div>
              <div className="hidden sm:block col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Артикул
              </div>
              <div className="col-span-3 sm:col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </div>
              <div className="hidden sm:block col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Рейтинг
              </div>
              <div className="col-span-3 sm:col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата создания
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
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title} 
                              className="h-10 w-10 object-cover rounded-md"
                            />
                          ) : (
                          <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{product.price.toLocaleString()} ₸</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block col-span-2">
                      <div className="text-sm text-gray-900">{product.article || 'Не указан'}</div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <div className="text-sm font-medium text-gray-900">{product.price.toLocaleString()} ₸</div>
                    </div>
                    <div className="hidden sm:block col-span-1">
                      <div className="text-sm text-gray-900">{product.rating || 0}</div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <div className="text-sm text-gray-900">{formatDate(product.created_at)}</div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-right flex justify-end items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => openProductDetails(product)}
                        title="Детали"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        className="text-orange-600 hover:text-orange-900"
                        onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                        title="Редактировать"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteClick(product.id)}
                        title="Удалить"
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
                    {getPaginationRange().map((page, index) => {
                      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                          <div 
                            key={`ellipsis-${index}`} 
                            className="px-3 py-1 text-gray-500 flex items-center justify-center"
                          >
                            ...
                          </div>
                        );
                      }
                      
                      return (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(Number(page))}
                          className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                            page === queryParams.page
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Удаление товара"
        message="Вы действительно хотите удалить этот товар? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />
      
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 overflow-y-auto z-[100]">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity z-[90]" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm" onClick={closeModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl md:max-w-2xl sm:w-full z-[110] relative">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Детали товара
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="sr-only">Закрыть</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">{selectedProduct.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedProduct.description || 'Описание отсутствует'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID товара</p>
                    <p className="text-sm text-gray-900">{selectedProduct.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Артикул</p>
                    <p className="text-sm text-gray-900">{selectedProduct.article || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Цена</p>
                    <p className="text-sm text-gray-900">{selectedProduct.price.toLocaleString()} ₸</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Рейтинг</p>
                    <p className="text-sm text-gray-900">{selectedProduct.rating || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID бренда</p>
                    <p className="text-sm text-gray-900">{selectedProduct.brand_id || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID категории</p>
                    <p className="text-sm text-gray-900">{selectedProduct.category_id || 'Не указана'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID единицы измерения</p>
                    <p className="text-sm text-gray-900">{selectedProduct.unit_id || 'Не указана'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID поставщика</p>
                    <p className="text-sm text-gray-900">{selectedProduct.supplier_id || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Дата создания</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedProduct.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Дата обновления</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedProduct.updated_at)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Габариты и вес</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Длина</p>
                      <p className="text-sm text-gray-900">{selectedProduct.length ? `${selectedProduct.length} см` : 'Не указана'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ширина</p>
                      <p className="text-sm text-gray-900">{selectedProduct.width ? `${selectedProduct.width} см` : 'Не указана'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Высота</p>
                      <p className="text-sm text-gray-900">{selectedProduct.height ? `${selectedProduct.height} см` : 'Не указана'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Вес</p>
                      <p className="text-sm text-gray-900">{selectedProduct.weight ? `${selectedProduct.weight} кг` : 'Не указан'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Глубина</p>
                      <p className="text-sm text-gray-900">{selectedProduct.depth ? `${selectedProduct.depth} см` : 'Не указана'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Изображения</h4>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.images.map((image: string, index: number) => (
                        <div key={index} className="w-20 h-20 border rounded-md overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedProduct.title} - ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Изображения отсутствуют</p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => navigate(`/dashboard/products/edit/${selectedProduct.id}`)}
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductsPage; 