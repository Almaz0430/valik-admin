/**
 * Мобильная версия страницы управления товарами
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import productService from '../../services/productService';
import type { Product, ProductQueryParams } from '../../types/product';
import { CubeIcon, PlusIcon, ArrowPathIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

/**
 * Компонент карточки товара для мобильного отображения
 */
const ProductCard: React.FC<{
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-3 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 bg-orange-50 rounded-lg flex-shrink-0 flex items-center justify-center mr-3">
            <CubeIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-600">Арт: {product.article || 'Не указан'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Цена</p>
            <p className="font-medium">{product.price.toLocaleString()} ₸</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Категория</p>
            <p className="font-medium">{product.category_name || 'Не указана'}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
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
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(product.id)} 
              className="p-1.5 bg-orange-50 rounded-full text-orange-600"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(product.id)} 
              className="p-1.5 bg-red-50 rounded-full text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPageMobile: React.FC = () => {
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
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Загрузка товаров
  useEffect(() => {
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
  }, [queryParams, searchTerm]);

  // Обработчики
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
    // Прокрутка вверх при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryParams(prev => ({ ...prev, page: 1 }));
  };
  
  const handleEditProduct = (id: number) => {
    navigate(`/dashboard/products/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete);
        
        setProducts(products.filter(product => product.id !== productToDelete));
        setTotalProducts(prev => prev - 1);
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении товара';
        alert(errorMessage);
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Расчет данных для пагинации
  const totalPages = Math.ceil(totalProducts / queryParams.limit!);
  const paginationItems = [];
  const currentPage = queryParams.page || 1;
  
  // Показываем максимум 5 кнопок пагинации
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(i);
  }

  return (
    <Layout>
      <div className={`pb-20 ${deleteModalOpen ? 'blur-sm' : ''}`}>
        {/* Заголовок страницы */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">Товары</h1>
          <p className="text-sm text-gray-500">Всего: {totalProducts}</p>
        </div>

        {/* Панель действий */}
        <div className="flex justify-between mb-4">
          <form onSubmit={handleSearch} className="relative flex-1 mr-2">
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </form>
          
          <Link 
            to="/dashboard/products/create" 
            className="flex items-center justify-center w-12 h-10 bg-orange-600 text-white rounded-full shadow-md hover:bg-orange-700"
          >
            <PlusIcon className="h-5 w-5" />
          </Link>
        </div>
        
        {/* Состояние загрузки */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-500 text-center">Загрузка товаров...</p>
          </div>
        )}
        
        {/* Ошибка */}
        {error && (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium mb-2">{error}</p>
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
              className="flex items-center justify-center mx-auto px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1.5" />
              Повторить
            </button>
          </div>
        )}

        {/* Список товаров */}
        {!isLoading && !error && (
          <>
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <CubeIcon className="h-8 w-8" />
                </div>
                <p className="text-xl text-gray-800 font-medium mb-2">Товары не найдены</p>
                <p className="text-gray-500 text-sm mb-4">Добавьте новый товар или измените параметры поиска</p>
                <Link 
                  to="/dashboard/products/create"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Добавить товар
                </Link>
              </div>
            ) : (
              <div className="space-y-0.5 mb-4">
                {products.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product} 
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    &laquo;
                  </button>
                  
                  {paginationItems.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-orange-500 border-orange-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
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
    </Layout>
  );
};

export default ProductsPageMobile; 