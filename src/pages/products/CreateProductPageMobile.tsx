/**
 * Мобильная версия страницы создания нового товара
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from 'react-select';
import { useProductForm } from '../../hooks/useProductForm';

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
    }
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
    zIndex: 100,
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
};

/**
 * Компонент мобильного формы создания товара
 */
const CreateProductPageMobile: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    isLoading,
    isDataLoading,
    errors,
    brands,
    categories,
    units,
    selectedBrand,
    selectedCategory,
    selectedUnit,
    previewImages,
    fileInputRef,
    handleSelectChange,
    handleChange,
    handleNumberChange,
    handlePriceChange,
    handleFileChange,
    removeImage,
    handleSubmit,
  } = useProductForm({ isEditMode: false }); // Явно указываем, что это не режим редактирования

  // Установка заголовка страницы
  useEffect(() => {
    document.title = 'Создание товара | Valik.kz';
    return () => { document.title = 'Valik.kz'; };
  }, []);

  return (
    <Layout>
      {/* Шапка страницы с кнопкой возврата */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white shadow-sm flex items-center mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-3 text-gray-500"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-medium text-gray-900">Создание товара</h1>
      </div>

      {/* Основная форма */}
      <div className="pb-24">
        {/* Сообщение об успешном создании удалено, т.к. используется toast */}

        {/* Подсказка */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 mb-6 rounded-md">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-orange-500 flex-shrink-0 mr-2" />
            <p className="text-xs text-orange-700">
              Поля, отмеченные звездочкой (*), обязательны для заполнения
            </p>
          </div>
        </div>

        {/* Сообщение об ошибке при отправке формы */}
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-md">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Основная информация
            </h2>

            <div className="space-y-4">
              {/* Название */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Название товара *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Например: Цемент М500 Д0 ПЦ, 50 кг"
                  error={errors.title}
                  fullWidth
                  required
                />
              </div>

              {/* Описание */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Описание товара *
                </label>
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Опишите характеристики товара..."
                  rows={3}
                  error={errors.description}
                  fullWidth
                  required
                  resize="none"
                />
              </div>

              {/* Артикул */}
              <div>
                <label htmlFor="article" className="block text-sm font-medium text-gray-700 mb-1">
                  Артикул
                </label>
                <Input
                  id="article"
                  value={formData.article?.toString() || ''}
                  onChange={(e) => handleNumberChange('article', e.target.value)}
                  placeholder="Например: 12345"
                  type="number"
                  fullWidth
                />
              </div>

              {/* Бренд */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Бренд *
                </label>
                <Select
                  id="brand"
                  value={selectedBrand}
                  onChange={(option: any) => handleSelectChange('brand_id', option)}
                  options={brands}
                  placeholder={isDataLoading ? "Загрузка..." : "Выберите бренд"}
                  isClearable
                  isLoading={isDataLoading}
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
                {errors.brand_id && <p className="mt-1 text-xs text-red-500">{errors.brand_id}</p>}
              </div>

              {/* Категория */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Категория *
                </label>
                <Select
                  id="category"
                  value={selectedCategory}
                  onChange={(option: any) => handleSelectChange('category_id', option)}
                  options={categories}
                  placeholder={isDataLoading ? "Загрузка..." : "Выберите категорию"}
                  isClearable
                  isLoading={isDataLoading}
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
                {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
              </div>

              {/* Единица измерения */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Единица измерения *
                </label>
                <Select
                  id="unit"
                  value={selectedUnit}
                  onChange={(option: any) => handleSelectChange('unit_id', option)}
                  options={units}
                  placeholder={isDataLoading ? "Загрузка..." : "Выберите единицу"}
                  isClearable
                  isLoading={isDataLoading}
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
                {errors.unit_id && <p className="mt-1 text-xs text-red-500">{errors.unit_id}</p>}
              </div>
            </div>
          </div>

          {/* Блок цены */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Цена
            </h2>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Цена (₸) *
              </label>
              <Input
                id="price"
                value={formData.price.toString()}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                fullWidth
                error={errors.price}
                required
              />
            </div>
          </div>

          {/* Габариты (опциональные) */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Габариты
              <span className="ml-2 text-xs font-normal text-gray-500">(необязательно)</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                  Длина (см)
                </label>
                <Input
                  id="length"
                  value={formData.length?.toString() || ''}
                  onChange={(e) => handleNumberChange('length', e.target.value)}
                  placeholder="0"
                  type="number"
                  step="0.1"
                  fullWidth
                />
              </div>

              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                  Ширина (см)
                </label>
                <Input
                  id="width"
                  value={formData.width?.toString() || ''}
                  onChange={(e) => handleNumberChange('width', e.target.value)}
                  placeholder="0"
                  type="number"
                  step="0.1"
                  fullWidth
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Высота (см)
                </label>
                <Input
                  id="height"
                  value={formData.height?.toString() || ''}
                  onChange={(e) => handleNumberChange('height', e.target.value)}
                  placeholder="0"
                  type="number"
                  step="0.1"
                  fullWidth
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Вес (кг)
                </label>
                <Input
                  id="weight"
                  value={formData.weight?.toString() || ''}
                  onChange={(e) => handleNumberChange('weight', e.target.value)}
                  placeholder="0"
                  type="number"
                  step="0.1"
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Изображения товара */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Изображения товара *
            </h2>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-50">
                      <img
                        src={preview}
                        alt={`Предпросмотр ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md"
                >
                  <PhotoIcon className="h-6 w-6 text-gray-400" />
                  <span className="mt-1 text-xs text-gray-500">Добавить</span>
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                required
              />

              {errors.images ? (
                <p className="text-xs text-red-500">{errors.images}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  Загрузите хотя бы одно изображение товара
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Фиксированное нижнее меню с кнопками */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex z-20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 mr-2 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 bg-orange-600 text-white rounded-lg text-sm font-medium flex items-center justify-center disabled:opacity-50"
        >
          {isLoading && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>}
          {isLoading ? 'Создание...' : 'Создать товар'}
        </button>
      </div>
    </Layout>
  );
};

export default CreateProductPageMobile; 