/**
 * Страница управления товарами
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { useProducts } from '../../features/products';
import productService from '../../features/products/api/productService';
import type { Product } from '../../types/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const ProductsPage: React.FC = () => {
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Определение типа устройства
  const { isMobile, isReady } = useDeviceDetect();

  // Перенаправление на мобильную версию
  useEffect(() => {
    if (isReady && isMobile) {
      navigate('/dashboard/products/mobile', { replace: true });
    }
  }, [isMobile, isReady, navigate]);

  // Обработчик поиска по товарам
  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetToFirstPage();
  }, [resetToFirstPage]);

  // Обработчик удаления товара
  const handleDeleteClick = useCallback((id: number) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      // Обновляем список товаров после удаления
      refetch();
      toast.success('Товар успешно удален');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Ошибка при удалении товара';
      toast.error(msg);
    }
  }, [productToDelete, refetch]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  }, []);

  // Открытие модального окна с детальной информацией о товаре
  const openProductDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  // Закрытие модального окна
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Получаем диапазон отображаемых товаров для информации
  const displayRange = useMemo(() => {
    const start = (queryParams.page! - 1) * queryParams.limit! + 1;
    const end = Math.min(start + products.length - 1, total);
    return `${start}-${end}`;
  }, [queryParams.page, queryParams.limit, products.length, total]);

  // Общее количество страниц
  const totalPages = useMemo(() => Math.ceil(total / queryParams.limit!), [total, queryParams.limit]);

  // Функция для генерации массива страниц для пагинации
  const paginationRange = useMemo(() => {
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
  }, [totalPages, queryParams.page]);

  // Форматирование даты
  const formatDate = useCallback((dateString: string | null | undefined) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Не указано';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

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
      <div className={`space-y-6 pb-16 lg:pb-0 ${isModalOpen || deleteModalOpen ? 'blur-sm' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Управление товарами</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Всего товаров: {total}</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Link
              to="/dashboard/products/import"
              className="px-4 py-2.5 bg-white border border-slate-200 shadow-sm text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium inline-flex items-center justify-center w-full sm:w-auto active:scale-[0.98]"
            >
              <svg className="w-5 h-5 mr-2 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Импорт CSV
            </Link>
            <Link
              to="/dashboard/products/create"
              className="px-4 py-2.5 bg-orange-600 shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] text-white rounded-xl hover:bg-orange-700 transition-all font-medium inline-flex items-center justify-center w-full sm:w-auto active:scale-[0.98]"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Добавить товар
            </Link>
          </div>
        </div>

        {/* Поле поиска */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-3 bg-white border-slate-200 shadow-sm rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:border-slate-300"
          />
          <button type="submit" className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 hover:text-orange-500 transition-colors">
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
        <div className="bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
          {/* Заголовок таблицы */}
          <div className="bg-slate-50/80 backdrop-blur-sm px-4 sm:px-6 py-4 border-b border-slate-100">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Название
              </div>
              <div className="hidden sm:block col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ID
              </div>
              <div className="hidden sm:block col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Подкат.
              </div>
              <div className="col-span-3 sm:col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Добавлен
              </div>
              <div className="col-span-5 sm:col-span-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                  refetch();
                }}
                className="mt-3 text-orange-600 hover:text-orange-800"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {/* Список товаров */}
          {!isLoading && !error && (
            <div className="divide-y divide-slate-100">
              {products.length === 0 && (
                <div className="py-20 px-8 text-center bg-slate-50/30">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 text-slate-400 mb-6 ring-1 ring-slate-200/50 shadow-sm">
                    <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-xl text-slate-800 font-semibold mb-2">Товары не найдены</p>
                  <p className="text-slate-500 text-base max-w-md mx-auto">Добавьте новый товар или измените параметры поиска</p>
                </div>
              )}

              {products.map((product) => (
                <div
                  key={product.id}
                  className="px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer"
                  onClick={() => openProductDetails(product)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center ring-1 ring-slate-200/50 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900 line-clamp-1">{product.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block col-span-2">
                      <div className="text-sm text-slate-600 font-medium">ID: {product.id}</div>
                    </div>
                    <div className="hidden sm:block col-span-2">
                      <div className="text-xs text-slate-500">
                        {typeof product.sub_category === 'object' && product.sub_category ? product.sub_category.name : product.sub_category ?? '—'}
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <div className="text-sm text-slate-500">{formatDate(product.created_at)}</div>
                    </div>
                    <div className="col-span-5 sm:col-span-2 text-right flex justify-end items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductDetails(product);
                        }}
                        title="Детали"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/products/edit/${product.id}`);
                        }}
                        title="Редактировать"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(product.id);
                        }}
                        title="Удалить"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            <div className="bg-slate-50/50 px-4 sm:px-6 py-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Показано <span className="font-semibold text-slate-900">{displayRange}</span> из <span className="font-semibold text-slate-900">{total}</span> товаров
                </div>
                {totalPages > 1 && (
                  <div className="flex space-x-1.5 bg-white p-1 rounded-lg border border-slate-200/60 shadow-sm">
                    {paginationRange.map((page, index) => {
                      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                          <div
                            key={`ellipsis-${index}`}
                            className="px-3 py-1.5 text-slate-400 flex items-center justify-center font-medium"
                          >
                            ...
                          </div>
                        );
                      }

                      return (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(Number(page))}
                          className={`min-w-[2rem] px-2 py-1.5 rounded-md text-sm font-semibold transition-colors ${page === queryParams.page
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 custom-scrollbar">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          ></div>

          <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/50 rounded-3xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] transform transition-all z-[110]">

            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-slate-100/80 bg-white/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Детали товара
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Окно быстрого просмотра</p>
              </div>
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                onClick={closeModal}
              >
                <span className="sr-only">Закрыть</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Info */}
                <div className="space-y-6">
                  {/* Name and Description */}
                  <div className="bg-slate-50/50 rounded-2xl p-5 ring-1 ring-slate-100 border border-slate-100/50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">О продукте</h4>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{selectedProduct.name}</h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                      {selectedProduct.description || 'Описание не заполнено производителем'}
                    </p>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">Подкатегория</p>
                      <p className="text-sm font-bold text-slate-900 text-center">
                        {typeof selectedProduct.sub_category === 'object' && selectedProduct.sub_category
                          ? selectedProduct.sub_category.name
                          : selectedProduct.sub_category ?? '—'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">Дата добавления</p>
                      <p className="text-sm font-bold text-slate-900 text-center">{formatDate(selectedProduct.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Image */}
                <div className="flex flex-col items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 w-full">Визуализация</h4>
                  {selectedProduct.image ? (
                    <div className="w-full aspect-square max-w-[280px] bg-slate-50 rounded-3xl overflow-hidden ring-1 ring-slate-200/50 border-4 border-white shadow-xl group">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square max-w-[280px] rounded-3xl bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 text-slate-400">
                      <svg className="w-12 h-12 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs font-bold">Изображение отсутствует</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100/80 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
                onClick={closeModal}
              >
                Закрыть
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] hover:bg-orange-700 transition-all active:scale-[0.98]"
                onClick={() => {
                  closeModal();
                  navigate(`/dashboard/products/edit/${selectedProduct.id}`);
                }}
              >
                Редактировать товар
              </button>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductsPage; 
