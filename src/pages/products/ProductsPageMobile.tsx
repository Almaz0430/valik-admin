/**
 * Мобильная версия страницы управления товарами
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { productService, useProducts } from '../../features/products';
import type { Product } from '../../types/product';
import { Package, Plus, RefreshCw, Pencil, Trash2, Search } from 'lucide-react';
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
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 mb-4 overflow-hidden transition-all active:scale-[0.98]">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-14 w-14 bg-slate-100/80 rounded-xl flex-shrink-0 flex items-center justify-center ring-1 ring-slate-200 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <Package className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 leading-tight mb-1 truncate">{product.title}</h3>
            <p className="text-xs font-medium text-slate-500">Арт: {product.article || 'Не указан'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Цена</p>
            <p className="font-bold text-slate-900">{product.price.toLocaleString()} ₸</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Категория</p>
            <p className="font-semibold text-slate-900 truncate">{product.category_name || 'Не указана'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg ring-1 ring-inset ${product.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
            product.status === 'pending' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
              product.status === 'draft' ? 'bg-slate-50 text-slate-700 ring-slate-600/20' :
                'bg-slate-50 text-slate-700 ring-slate-600/20'
            }`}>
            {product.status === 'active' ? 'Активный' :
              product.status === 'pending' ? 'На проверке' :
                product.status === 'draft' ? 'Черновик' :
                  'Неактивный'}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(product.id); }}
              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              <Pencil className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <Trash2 className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPageMobile: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    total,
    isLoading,
    error,
    queryParams,
    searchTerm,
    setSearchTerm,
    refetch,
    handlePageChange,
    resetToFirstPage,
  } = useProducts({ initialParams: { page: 1, limit: 10 } });
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    resetToFirstPage();
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
  const totalPages = Math.ceil(total / queryParams.limit!);
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
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Товары</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">Управление ассортиментом. Всего: {total}</p>
        </div>

        {/* Панель действий */}
        <div className="flex justify-between gap-3 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-slate-900 placeholder-slate-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
          </form>

          <Link
            to="/dashboard/products/create"
            className="flex items-center justify-center w-[42px] h-[42px] bg-orange-600 text-white rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.6)] hover:bg-orange-700 active:scale-[0.98] transition-all flex-shrink-0"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
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
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 p-6 text-center mt-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-500 mb-4 ring-1 ring-red-100">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-800 font-medium mb-4">{error}</p>
            <button
              onClick={() => {
                refetch();
              }}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" strokeWidth={2} />
              Повторить
            </button>
          </div>
        )}

        {/* Список товаров */}
        {!isLoading && !error && (
          <>
            {products.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 p-8 text-center mt-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 mb-4 ring-1 ring-slate-200/60">
                  <Package className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <p className="text-lg text-slate-900 font-bold mb-2 tracking-tight">Товары не найдены</p>
                <p className="text-slate-500 text-sm mb-6">Добавьте новый товар или измените параметры поиска</p>
                <Link
                  to="/dashboard/products/create"
                  className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-700 shadow-[0_2px_8px_-2px_rgba(249,115,22,0.6)] transition-all active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
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
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-xl border border-slate-200/60 text-sm font-medium transition-colors ${currentPage === 1 ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                      }`}
                  >
                    &laquo;
                  </button>

                  {paginationItems.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border-y border-r border-slate-200/60 text-sm font-medium transition-colors ${page === currentPage
                        ? 'z-10 bg-orange-500 border-y-orange-500 border-r-orange-500 text-white shadow-[0_2px_8px_-2px_rgba(249,115,22,0.6)]'
                        : 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-xl border-y border-r border-slate-200/60 text-sm font-medium transition-colors ${currentPage === totalPages ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100'
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
