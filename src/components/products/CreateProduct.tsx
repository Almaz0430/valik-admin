/**
 * Компонент создания/редактирования товара для десктопной версии.
 * Использует кастомный хук useProductForm для управления всей логикой.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useProductForm } from '../../features/products';
import {
  ArrowLeftIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import FileUploader from '../ui/FileUploader';
import type { SelectOption } from '../../features/products/hooks/useProductForm';

interface CreateProductProps {
  isEditMode?: boolean;
  productId?: number;
}

const selectStyles: StylesConfig<SelectOption, false> = {
  // Стили для react-select можно вынести в отдельный файл, если они используются где-то еще
  control: (base, state) => ({
    ...base,
    minHeight: '42px',
    border: state.isFocused ? '1px solid #f97316' : '1px solid #d1d5db',
    borderRadius: '0.5rem',
    boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#f97316' : '#9ca3af',
    },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#ffedd5' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    ':active': {
      ...base[':active'],
      backgroundColor: state.isSelected ? '#f97316' : '#ffedd5',
    },
  }),
  menu: base => ({ ...base, zIndex: 100 }),
};

const CreateProduct: React.FC<CreateProductProps> = ({ isEditMode = false, productId }) => {
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
  } = useProductForm({ isEditMode, productId });

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Загрузка данных...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Редактирование товара' : 'Создание нового товара'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode ? 'Измените информацию о товаре' : 'Заполните информацию о товаре'}
          </p>
        </div>
        <Link
          to="/dashboard/products"
          className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Вернуться к списку
        </Link>
      </div>

      {/* Уведомления */}
      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
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
                rows={5}
                resize="none"
                required
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Изображения</h3>
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

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Габариты (необязательно)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                id="length"
                label="Длина (см)"
                type="number"
                placeholder="0"
                value={formData.length || ''}
                onChange={(e) => handleNumberChange('length', e.target.value)}
              />
              <Input
                id="width"
                label="Ширина (см)"
                type="number"
                placeholder="0"
                value={formData.width || ''}
                onChange={(e) => handleNumberChange('width', e.target.value)}
              />
              <Input
                id="height"
                label="Высота (см)"
                type="number"
                placeholder="0"
                value={formData.height || ''}
                onChange={(e) => handleNumberChange('height', e.target.value)}
              />
              <Input
                id="weight"
                label="Вес (кг)"
                type="number"
                placeholder="0.0"
                value={formData.weight || ''}
                onChange={(e) => handleNumberChange('weight', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Правая колонка - Организация */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Организация</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
                <Select
                  value={selectedCategory}
                  onChange={(option) => handleSelectChange('category_id', option)}
                  options={categories}
                  styles={selectStyles}
                  placeholder="Выберите категорию"
                  isLoading={isDataLoading}
                />
                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Бренд *</label>
                <Select
                  value={selectedBrand}
                  onChange={(option) => handleSelectChange('brand_id', option)}
                  options={brands}
                  styles={selectStyles}
                  placeholder="Выберите бренд"
                  isLoading={isDataLoading}
                />
                {errors.brand_id && <p className="text-xs text-red-500 mt-1">{errors.brand_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ед. измерения *</label>
                <Select
                  value={selectedUnit}
                  onChange={(option) => handleSelectChange('unit_id', option)}
                  options={units}
                  styles={selectStyles}
                  placeholder="Выберите единицу"
                  isLoading={isDataLoading}
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Цена</h3>
            <Input
              id="price"
              label="Цена (₸) *"
              type="number"
              placeholder="0"
              value={formData.price || ''}
              onChange={(e) => handlePriceChange(e.target.value)}
              error={errors.price}
              required
            />
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Link
          to="/dashboard/products"
          className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-4 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center"
        >
          {isLoading && <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>}
          {isEditMode ? 'Сохранить изменения' : 'Создать товар'}
        </button>
      </div>
    </form>
  );
};

export default CreateProduct;
