/**
 * Страница управления категории
 */
import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import categoryService from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Select, { type SingleValue } from 'react-select';

interface CategoriesPageProps {
  isStandalone?: boolean;
}

interface SelectOption {
  value: number;
  label: string;
}

const selectStyles = {
  control: (base: any) => ({
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
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '0.875rem',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#ffedd5' : null,
    color: state.isSelected ? 'white' : '#111827',
    ':active': {
      backgroundColor: state.isSelected ? '#f97316' : '#ffedd5',
    },
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
  input: (base: any) => ({
    ...base,
    fontSize: '0.875rem',
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: '0.875rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#6b7280',
    ':hover': {
      color: '#4b5563',
    },
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: '#6b7280',
    ':hover': {
      color: '#4b5563',
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 99999,
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  menuPortal: (base: any) => ({
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
        const response = await categoryService.getCategories({});
        
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
        title: newCategoryTitle.trim(), 
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
            <h1 className="text-2xl font-bold text-gray-900">Управление Категориями</h1>
            <p className="mt-1 text-sm text-gray-500">Всего категорий: {totalCategories}</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        {!isStandalone && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Категорий</h2>
            <p className="mt-1 text-sm text-gray-500">Всего категорий: {totalCategories}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4">
          {/* Кнопка создания */}
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 inline-flex items-center justify-center w-full sm:w-auto"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить категорию
          </button>
        </div>
      </div>
      
      {/* Блок категорий с состоянием загрузки и ошибками */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Заголовок таблицы */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </div>
            <div className="col-span-5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </div>
            <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата создания
            </div>
            <div className="col-span-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  categoryService.getCategories({})
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
          <div className="divide-y divide-gray-200">
            {categories.length === 0 && (
              <div className="py-20 px-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-500 mb-6">
                  <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-xl text-gray-800 font-medium mb-2">Категории не найдены</p>
                <p className="text-gray-500 text-base max-w-md mx-auto">Добавьте новую категорию или измените параметры поиска</p>
              </div>
            )}
            
            {categories.map((category) => (
              <div key={category.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <div className="text-sm text-gray-900">{category.id}</div>
                  </div>
                  <div className="col-span-5">
                    <div className="text-sm font-medium text-gray-900">{category.title}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm text-gray-900">{formatDate(category.created_at)}</div>
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Создание новой категории</h3>
                <div className="mt-2">
                  <input
                    type="text"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    placeholder="Название категории"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="mt-2">
                  <Select
                    id="category_id"
                    options={(categories || []).map(u => ({ value: u.id, label: u.title }))}
                    value={selectedCategory}
                    onChange={(option) => handleSelectChange('category_id', option)}
                    placeholder="Выберите родительскую категорию"
                    isClearable
                    classNamePrefix="react-select"
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Создание...' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Отмена
                </button>
              </div>
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