/**
 * Компонент создания/редактирования товара.
 * Поля соответствуют реальной модели OPTProduct бэкенда:
 * name, description, sub_category (через выбор категории → подкатегории), image
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useProductForm } from '../../features/products';
import {
  ArrowLeftIcon,
  XCircleIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FormField } from '../ui/FormField';
import { Label } from '@/components/ui/label';
import TextArea from '../ui/TextArea';
import ImageEditor from '../ui/ImageEditor';
import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import type { SelectOption } from '../../features/products/hooks/useProductForm';

interface CreateProductProps {
  isEditMode?: boolean;
  productId?: number;
}

const selectStyles: StylesConfig<SelectOption, false> = {
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
    categories,
    subCategories,
    brands,
    units,
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedUnit,
    imagePreview,
    fileInputRef,
    isImageEditorOpen,
    tempImageForEdit,
    tempImageFileName,
    handleChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleBrandChange,
    handleUnitChange,
    handleFileChange,
    handleImageEditSave,
    handleImageEditCancel,
    removeImage,
    handleSubmit,
  } = useProductForm({ isEditMode, productId });

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
        <span className="ml-3 text-gray-600">Загрузка данных...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24 md:pb-0">
      {/* Шапка — Десктоп */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Редактирование товара' : 'Создание нового товара'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Поля, отмеченные *, обязательны для заполнения
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

      {/* Шапка — Мобилка */}
      <div className="md:hidden sticky top-0 z-30 -mx-4 -mt-8 px-4 py-3.5 bg-white/80 backdrop-blur-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border-b border-slate-200/50 flex items-center mb-6">
        <Link
          to="/dashboard/products"
          className="mr-3 p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {isEditMode ? 'Редактирование' : 'Создание товара'}
        </h1>
      </div>

      {/* Ошибка отправки */}
      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Основная информация */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
            <div className="space-y-4">
              <FormField
                id="name"
                label="Название товара *"
                placeholder="Введите название товара"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
              />
              <TextArea
                id="description"
                label="Описание"
                placeholder="Опишите характеристики и особенности товара"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
                rows={5}
                resize="none"
              />
            </div>
          </div>

          {/* Цена и логистика */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Цена и характеристики</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="article"
                label="Артикул"
                type="number"
                placeholder="1001"
                value={formData.article}
                onChange={(e) => handleChange('article', e.target.value)}
                error={errors.article}
              />
              <FormField
                id="price"
                label="Цена *"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                error={errors.price}
                required
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <FormField
                id="length"
                label="Длина (см)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.length}
                onChange={(e) => handleChange('length', e.target.value)}
              />
              <FormField
                id="width"
                label="Ширина (см)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.width}
                onChange={(e) => handleChange('width', e.target.value)}
              />
              <FormField
                id="height"
                label="Высота (см)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
              <FormField
                id="weight"
                label="Вес (кг)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
          </div>

          {/* Изображение */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Изображение товара
            </h3>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Превью товара"
                  className="w-48 h-48 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                  title="Удалить изображение"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${errors.image ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50/30'
                  }`}
              >
                <PhotoIcon className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-600">Нажмите для выбора изображения</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP до 10 МБ</p>
                <p className="text-xs text-orange-500 mt-2 font-medium">или нажмите Ctrl+V для вставки из буфера</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {errors.image && (
              <p className="text-xs text-red-500 mt-2">{errors.image}</p>
            )}

            {!imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Выбрать файл
              </button>
            )}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="lg:col-span-1 space-y-6">
          {/* Организация */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Организация</h3>
            <div className="space-y-4">
              {/* Категория (для фильтрации подкатегорий) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория *
                </label>
                <Select<SelectOption, false>
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  options={categories}
                  styles={selectStyles}
                  placeholder="Сначала выберите категорию..."
                  isClearable
                  isDisabled={isDataLoading}
                />
                <p className="text-xs text-slate-400 mt-1">Обязательно для заполнения</p>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Подкатегория */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Подкатегория
                </label>
                <Select<SelectOption, false>
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  options={subCategories}
                  styles={selectStyles}
                  placeholder="Выберите подкатегорию"
                  isDisabled={isDataLoading}
                  noOptionsMessage={() => 'Нет подкатегорий'}
                />
                {errors.sub_category && (
                  <p className="text-xs text-red-500 mt-1">{errors.sub_category}</p>
                )}
              </div>

              {/* Бренд */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Бренд
                </label>
                <Select<SelectOption, false>
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  options={brands}
                  styles={selectStyles}
                  placeholder="Выберите бренд (опционально)"
                  isClearable
                  isDisabled={isDataLoading}
                  noOptionsMessage={() => 'Нет брендов'}
                />
              </div>

              {/* Единица измерения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Единица измерения
                </label>
                <Select<SelectOption, false>
                  value={selectedUnit}
                  onChange={handleUnitChange}
                  options={units}
                  styles={selectStyles}
                  placeholder="Выберите единицу (опционально)"
                  isClearable
                  isDisabled={isDataLoading}
                  noOptionsMessage={() => 'Нет единиц измерения'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки — Десктоп */}
      <div className="hidden md:flex justify-end gap-3 pt-5 border-t border-slate-200/60 mt-8">
        <Link
          to="/dashboard/products"
          className="py-2 px-5 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Отмена
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-5 bg-orange-600 text-white rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.6)] text-sm font-medium hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center"
        >
          {isLoading && (
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
          )}
          {isEditMode ? 'Сохранить изменения' : 'Создать товар'}
        </button>
      </div>

      {/* Кнопки — Мобилка */}
      <div className={`md:hidden fixed bottom-16 sm:bottom-20 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 p-4 flex z-30 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.08)] transition-opacity duration-200 ${isImageEditorOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Link
          to="/dashboard/products"
          className="flex-1 mr-3 py-3 px-4 border border-slate-200/60 bg-slate-50 text-slate-700 rounded-xl text-center text-sm font-medium hover:bg-slate-100 transition-colors"
        >
          Отмена
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-[2] py-3 px-4 bg-orange-600 text-white rounded-xl shadow-[0_2px_12px_-4px_rgba(249,115,22,0.6)] text-sm font-medium flex items-center justify-center hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading && (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          )}
          {isEditMode ? 'Сохранить' : 'Создать товар'}
        </button>
      </div>

      {/* Image Editor Modal */}
      {isImageEditorOpen && tempImageForEdit && (
        <ImageEditor
          imageUrl={tempImageForEdit}
          onSave={handleImageEditSave}
          onCancel={handleImageEditCancel}
          fileName={tempImageFileName}
        />
      )}
    </form>
  );
};

export default CreateProduct;
