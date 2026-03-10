/**
 * Страница управления категории
 */
import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { categoryService, type Category } from '../../features/attributes';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Select, { type SingleValue, type StylesConfig } from 'react-select';

interface CategoriesPageProps {
  isStandalone?: boolean;
}

interface SelectOption {
  value: number;
  label: string;
}

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base) => ({
    ...base,
    minHeight: '42px',
    border: 'none',
    borderColor: 'transparent',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '&:hover': {
      borderColor: 'transparent',
    },
    borderRadius: '0.375rem',
    backgroundColor: '#fff',
    padding: '1px',
    transition: 'box-shadow 0.15s ease-in-out',
    '&:focus-within': {
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: 'none',
      borderColor: 'transparent',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '0.875rem',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#ffedd5' : base.backgroundColor,
    color: state.isSelected ? 'white' : '#111827',
    ':active': {
      backgroundColor: state.isSelected ? '#f97316' : '#ffedd5',
    },
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
  input: (base) => ({
    ...base,
    fontSize: '0.875rem',
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: '0.875rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#6b7280',
    ':hover': {
      color: '#4b5563',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#6b7280',
    ':hover': {
      color: '#4b5563',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 99999,
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isStandalone = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);

  // Загрузка категории при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await categoryService.getCategories({ limit: 1000 }); // Получаем все категории

        setCategories(response.categories);
        setTotalCategories(response.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке категорий';
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Обработчик удаления категории
  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.deleteCategory(categoryToDelete);

        // Обновляем список категорий после удаления
        setCategories(categories.filter(category => category.id !== categoryToDelete));
        setTotalCategories(prev => prev - 1);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении категории';
        alert(errorMessage);
        console.error(err);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Обработчики для создания категории
  const openCreateModal = () => {
    setNewCategoryTitle('');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewCategoryTitle('');
  };

  const handleSelectChange = (field: string, selectedOption: SingleValue<SelectOption>) => {
    if (field === 'category_id') {
      setSelectedCategory(selectedOption);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim()) {
      alert('Название категории не может быть пустым');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('parent_id', selectedCategory?.value);
      const newCategory = await categoryService.createCategory({
        name: newCategoryTitle.trim(),
        parent_id: selectedCategory?.value ?? null
      });

      // Добавляем новую категорию в список и обновляем общее количество
      setCategories(prev => [newCategory, ...prev]);
      setTotalCategories(prev => prev + 1);

      closeCreateModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при создании категории';
      alert(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Не указано';

    let date: Date;

    if (/^\d+$/.test(dateString)) {
      const timestamp = Number(dateString);

      if (dateString.length === 10) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const content = (
    <div className="space-y-6 pb-16 lg:pb-0">
      {isStandalone && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Управление Категориями</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Всего категорий: {totalCategories}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        {!isStandalone && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Категории</h2>
            <p className="mt-1 text-sm text-slate-500 font-medium">Всего категорий: {totalCategories}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {/* Кнопка создания */}
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] hover:bg-orange-700 transition-all font-medium active:scale-[0.98] inline-flex items-center justify-center w-full sm:w-auto"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить категорию
          </button>
        </div>
      </div>

      {/* Блок категорий с состоянием загрузки и ошибками */}
      <div className="bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl overflow-hidden box-border">
        {/* Заголовок таблицы */}
        <div className="bg-slate-50/50 px-4 sm:px-6 py-4 border-b border-slate-100/80">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ID
            </div>
            <div className="col-span-8 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Название
            </div>
            <div className="col-span-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Действия
            </div>
          </div>
        </div>

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-gray-500">Загрузка категорий...</p>
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
                  categoryService.getCategories({ limit: 1000 })
                    .then(response => {
                      setCategories(response.categories);
                      setTotalCategories(response.total);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке категорий';
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

        {/* Список категорий */}
        {!isLoading && !error && (
          <div className="divide-y divide-slate-100">
            {categories.length === 0 && (
              <div className="py-20 px-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-50 text-slate-400 mb-6 shadow-sm ring-1 ring-slate-200/50">
                  <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-xl text-slate-800 font-semibold tracking-tight mb-2">Категории не найдены</p>
                <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">Добавьте новую категорию или измените параметры поиска</p>
              </div>
            )}

            {categories.map((category) => (
              <React.Fragment key={category.id}>
                {/* Родительская категория */}
                <div className="px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors bg-slate-50/30">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="text-sm font-bold text-slate-900">{category.id}</div>
                    </div>
                    <div className="col-span-8">
                      <div className="text-sm font-bold text-slate-900">{category.name}</div>
                    </div>
                    <div className="col-span-3 text-right flex justify-end items-center space-x-2">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteClick(category.id)}
                        title="Удалить"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Подкатегории */}
                {category.sub_categories && category.sub_categories.length > 0 && (
                  category.sub_categories.map((subCategory) => (
                    <div key={subCategory.id} className="px-4 sm:px-6 py-3 hover:bg-slate-50 transition-colors border-l-2 border-slate-200 bg-slate-50/50">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className="text-sm text-slate-500 pl-4">{subCategory.id}</div>
                        </div>
                        <div className="col-span-8">
                          <div className="text-sm text-slate-600 pl-6">
                            {subCategory.name}
                          </div>
                        </div>
                        <div className="col-span-3 text-right flex justify-end items-center space-x-2">
                          <button
                            className="text-red-600 hover:text-red-900 opacity-70"
                            onClick={() => handleDeleteClick(subCategory.id)}
                            title="Удалить подкатегорию"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Удаление категории"
        message="Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />

      {/* Модальное окно создания категории */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 custom-scrollbar">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity z-[90]"
            aria-hidden="true"
            onClick={closeCreateModal}
          ></div>

          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/50 rounded-3xl overflow-visible flex flex-col transform transition-all z-[110]">

            <div className="flex justify-between items-start p-6 border-b border-slate-100/80 bg-white/50 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Создание новой категории</h3>
                <p className="mt-1 text-sm text-slate-500 font-medium">Заполните данные ниже</p>
              </div>
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                onClick={closeCreateModal}
              >
                <span className="sr-only">Закрыть</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Название категории *</label>
                  <input
                    type="text"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    placeholder="Например: Смартфоны"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Родительская категория</label>
                  <Select
                    id="category_id"
                    options={(categories || []).map(u => ({ value: u.id, label: u.name }))}
                    value={selectedCategory}
                    onChange={(option) => handleSelectChange('category_id', option)}
                    placeholder="Выберите родительскую категорию (опционально)"
                    isClearable
                    className="text-sm font-medium"
                    classNamePrefix="react-select"
                    styles={{
                      ...selectStyles,
                      control: (base, state) => ({
                        ...base,
                        minHeight: '46px',
                        background: '#ffffff',
                        borderColor: state.isFocused ? '#f97316' : '#e2e8f0',
                        boxShadow: state.isFocused ? '0 0 0 2px rgba(249, 115, 22, 0.2)' : 'none',
                        borderRadius: '0.75rem',
                        '&:hover': {
                          borderColor: state.isFocused ? '#f97316' : '#cbd5e1'
                        }
                      })
                    }}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:px-6 border-t border-slate-100/80 bg-slate-50/50 flex flex-col sm:flex-row-reverse sm:justify-start gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isSubmitting}
                className={`w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none active:scale-[0.98] transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Создание...' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-white border border-slate-200 shadow-sm px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none active:scale-[0.98] transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  if (isStandalone) {
    return <Layout>{content}</Layout>;
  }

  return content;
};

export default CategoriesPage; 
