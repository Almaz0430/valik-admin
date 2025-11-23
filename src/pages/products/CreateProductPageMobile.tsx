/**
 * Мобильная версия страницы создания нового товара
 */
import React, { useEffect } from 'react';
import FileUploader from '../../components/ui/FileUploader';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  ArrowLeftIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select, { type StylesConfig } from 'react-select';
import { useProductForm } from '../../features/products';
import type { SelectOption } from '../../features/products/hooks/useProductForm';

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
    }
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
    handlePasteFiles,
    removeImage,
    editImage,
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Основная информация */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">Основная информация</h2>
            <div className="space-y-4">
              <Input
                id="title"
                label="Название товара *"
                placeholder="Введите название товара"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                required
              />
              <TextArea
                id="description"
                label="Описание *"
                placeholder="Опишите характеристики и особенности товара"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
                rows={4}
                resize="none"
                required
              />
            </div>
          </div>

          {/* Изображения */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">Изображения</h2>
            <FileUploader
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              previewImages={previewImages}
              onFileChange={handleFileChange}
              onRemoveImage={removeImage}
              onEditImage={editImage}
              onPasteFiles={handlePasteFiles}
              error={errors.images}
            />
          </div>

          {/* Организация */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">Организация</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
                <Select<SelectOption, false>
                  value={selectedCategory}
                  onChange={(option) => handleSelectChange('category_id', option)}
                  options={categories}
                  styles={selectStyles}
                  placeholder="Выберите категорию"
                  isLoading={isDataLoading}
                  isDisabled={isDataLoading}
                />
                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Бренд *</label>
                <Select<SelectOption, false>
                  value={selectedBrand}
                  onChange={(option) => handleSelectChange('brand_id', option)}
                  options={brands}
                  styles={selectStyles}
                  placeholder="Выберите бренд"
                  isLoading={isDataLoading}
                  isDisabled={isDataLoading}
                />
                {errors.brand_id && <p className="text-xs text-red-500 mt-1">{errors.brand_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ед. измерения *</label>
                <Select<SelectOption, false>
                  value={selectedUnit}
                  onChange={(option) => handleSelectChange('unit_id', option)}
                  options={units}
                  styles={selectStyles}
                  placeholder="Выберите единицу"
                  isLoading={isDataLoading}
                  isDisabled={isDataLoading}
                />
                {errors.unit_id && <p className="text-xs text-red-500 mt-1">{errors.unit_id}</p>}
              </div>
              <Input
                id="article"
                label="Артикул"
                placeholder="Введите артикул товара"
                value={formData.article || ''}
                onChange={(e) => handleNumberChange('article', e.target.value)}
              />
            </div>
          </div>

          {/* Цена */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">Цена</h2>
            <Input
              id="price"
              label="Цена (₸) *"
              value={formData.price.toString()}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              error={errors.price}
              required
            />
          </div>

          {/* Габариты */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">Габариты</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="length"
                label="Длина (см)"
                value={formData.length?.toString() || ''}
                onChange={(e) => handleNumberChange('length', e.target.value)}
                placeholder="0"
                type="number"
              />
              <Input
                id="width"
                label="Ширина (см)"
                value={formData.width?.toString() || ''}
                onChange={(e) => handleNumberChange('width', e.target.value)}
                placeholder="0"
                type="number"
              />
              <Input
                id="height"
                label="Высота (см)"
                value={formData.height?.toString() || ''}
                onChange={(e) => handleNumberChange('height', e.target.value)}
                placeholder="0"
                type="number"
              />
              <Input
                id="weight"
                label="Вес (кг)"
                value={formData.weight?.toString() || ''}
                onChange={(e) => handleNumberChange('weight', e.target.value)}
                placeholder="0"
                type="number"
              />
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
