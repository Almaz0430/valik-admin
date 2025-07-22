/**
 * Компонент формы создания/редактирования товара
 */
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import { QuestionMarkCircleIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

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

interface Brand {
  id: number;
  title: string;
}

interface Unit {
  id: number;
  title: string;
}

interface Category {
  id: number;
  title: string;
}

// Определяем тип для опций react-select
interface SelectOption {
  value: number;
  label: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  brand_id: number | null;
  unit_id: number | null;
  category_id: number | null;
  article?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  depth?: number;
  price: number;
  images?: (File | string)[];
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  brands: Brand[];
  units: Unit[];
  categories: Category[];
  isEditMode?: boolean;
  productId?: number;
  onDeleteImage?: (imageUrl: string) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  brands,
  units,
  categories,
  isEditMode = false,
  productId,
  onDeleteImage
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    brand_id: initialData?.brand_id || null,
    unit_id: initialData?.unit_id || null,
    category_id: initialData?.category_id || null,
    article: initialData?.article,
    length: initialData?.length,
    width: initialData?.width,
    height: initialData?.height,
    weight: initialData?.weight,
    depth: initialData?.depth,
    price: initialData?.price || 0,
    images: initialData?.images || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Новые состояния для выбранных опций react-select
  const [selectedBrand, setSelectedBrand] = useState<SelectOption | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SelectOption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (initialData) {
      // Обновляем все formData при изменении initialData
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        brand_id: initialData.brand_id || null,
        unit_id: initialData.unit_id || null,
        category_id: initialData.category_id || null,
        article: initialData.article,
        length: initialData.length,
        width: initialData.width,
        height: initialData.height,
        weight: initialData.weight,
        depth: initialData.depth,
        price: initialData.price || 0,
        images: initialData.images || []
      });
      
      // Обновляем предпросмотр изображений
      if (initialData.images && initialData.images.length > 0) {
        const existingImages = initialData.images.filter(
          (img): img is string => typeof img === 'string'
        );
        setPreviewImages(existingImages);
      } else {
        setPreviewImages([]);
      }
    }
  }, [initialData]);


  const handleChange = (field: keyof ProductFormData, value: string | number | null | (File | string)[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: keyof ProductFormData, selectedOption: SelectOption | null) => {
    handleChange(field, selectedOption ? selectedOption.value : null);

    if (field === 'brand_id') {
      setSelectedBrand(selectedOption);
    } else if (field === 'unit_id') {
      setSelectedUnit(selectedOption);
    } else if (field === 'category_id') {
      setSelectedCategory(selectedOption);
    }
  };

  const handleNumberChange = (field: keyof ProductFormData, value: string) => {
    if (value === '') {
      handleChange(field, null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        handleChange(field, numValue);
      }
    }
  };

  const handlePriceChange = (value: string) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    
    if (sanitized === '') {
      handleChange('price', 0);
    } else {
      const numValue = parseFloat(sanitized);
      if (!isNaN(numValue) && numValue >= 0) {
        handleChange('price', numValue);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      
      if (isEditMode && productId) {
        handleUploadImages(newFiles);
      } else {
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        
        handleChange('images', [...(formData.images || []), ...newFiles]);
        
        setPreviewImages(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const handleUploadImages = async (files: File[]) => {
    if (!productId || !isEditMode) return;
    
    setIsUploadingImages(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      const productService = (await import('../../services/productService')).default;
      
      const success = await productService.addProductImages(productId, files);
      
      if (success) {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        
        setPreviewImages(prev => [...prev, ...newPreviews]);
        setUploadSuccess(true);
        
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        setUploadError('Не удалось загрузить изображения. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      setUploadError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке изображений');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = (formData.images || [])[index];

    try {
      // Если это существующее изображение (строка URL), вызываем onDeleteImage
      if (typeof imageToRemove === 'string' && onDeleteImage) {
        await onDeleteImage(imageToRemove);
      }
      
      // Обновляем локальное состояние после удаления
      const newImages = [...(formData.images || [])];
      newImages.splice(index, 1);
      handleChange('images', newImages);

      const newPreviews = [...previewImages];
      newPreviews.splice(index, 1);
      setPreviewImages(newPreviews);
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название товара обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание товара обязательно';
    }

    if (!formData.brand_id) {
      newErrors.brand_id = 'Выберите бренд';
    }

    if (!formData.unit_id) {
      newErrors.unit_id = 'Выберите единицу измерения';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Выберите категорию';
    }

    if (formData.price < 0) {
      newErrors.price = 'Цена не может быть отрицательной';
    }

    if (!isEditMode && (!formData.images || formData.images.length === 0)) {
      newErrors.images = 'Загрузите хотя бы одно изображение товара';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const renderTooltip = (id: string, content: string) => {
    return (
      <button 
        type="button" 
        onClick={() => toggleTooltip(id)}
        className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" />
        
        {activeTooltip === id && (
          <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg p-3 border border-gray-200 text-left">
            <p className="text-xs text-gray-600">{content}</p>
          </div>
        )}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Основная информация
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Название товара *</label>
              {renderTooltip('title', 'Укажите полное название товара. Хорошее название должно включать тип товара, бренд и ключевые характеристики.')}
            </div>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Например: Цемент"
              error={errors.title}
              fullWidth
              required
            />
            {!errors.title && (
              <p className="mt-1 text-xs text-gray-500">Оптимальная длина: 10-15 символов</p>
            )}
          </div>
          
          <div className="sm:col-span-2 relative">
            <label htmlFor="article" className="block text-sm font-medium leading-6 text-gray-900">
              Артикул
            </label>
            <div className="mt-2">
              <Input
                id="article"
                value={formData.article?.toString() || ''}
                onChange={(e) => handleNumberChange('article', e.target.value)}
                placeholder="Например: 12345"
                type="number"
                fullWidth
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание товара *</label>
            {renderTooltip('description', 'Подробно опишите товар, его применение, преимущества и технические характеристики.')}
          </div>
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите характеристики и преимущества товара..."
            rows={4}
            error={errors.description}
            fullWidth
            required
            resize="none"
          />
          {!errors.description && (
            <p className="mt-1 text-xs text-gray-500">Минимум 50 символов для хорошего описания</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-6 sm:gap-8">
          <div className="sm:col-span-4 relative">
            <label htmlFor="brand_id" className="block text-sm font-medium leading-6 text-gray-900">
              Бренд <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <Select
                id="brand_id"
                options={brands.map(b => ({ value: b.id, label: b.title }))}
                value={selectedBrand}
                onChange={(option) => handleSelectChange('brand_id', option)}
                placeholder="Выберите бренд"
                isClearable
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            </div>
            {errors.brand_id && <p className="mt-2 text-sm text-red-600">{errors.brand_id}</p>}
          </div>

          <div className="sm:col-span-4 relative">
            <label htmlFor="unit_id" className="block text-sm font-medium leading-6 text-gray-900">
              Единица измерения <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <Select
                id="unit_id"
                options={units.map(u => ({ value: u.id, label: u.title }))}
                value={selectedUnit}
                onChange={(option) => handleSelectChange('unit_id', option)}
                placeholder="Выберите единицу измерения"
                isClearable
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            </div>
            {errors.unit_id && <p className="mt-2 text-sm text-red-600">{errors.unit_id}</p>}
          </div>

          <div className="sm:col-span-4 relative">
            <label htmlFor="category_id" className="block text-sm font-medium leading-6 text-gray-900">
              Категория <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <Select
                id="category_id"
                options={categories.map(c => ({ value: c.id, label: c.title }))}
                value={selectedCategory}
                onChange={(option) => handleSelectChange('category_id', option)}
                placeholder="Выберите категорию"
                isClearable
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            </div>
            {errors.category_id && <p className="mt-2 text-sm text-red-600">{errors.category_id}</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Габариты и вес
          <span className="ml-2 text-sm font-normal text-gray-500">(необязательно)</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">Длина (см)</label>
              {renderTooltip('dimensions', 'Укажите размеры товара в сантиметрах. Эта информация используется для расчета доставки.')}
            </div>
            <Input
              id="length"
              value={formData.length?.toString() || ''}
              onChange={(e) => handleNumberChange('length', e.target.value)}
              placeholder="0.0"
              type="number"
              step="0.1"
              fullWidth
            />
          </div>
          
          <div>
            <div className="mb-3">
              <label htmlFor="width" className="block text-sm font-medium text-gray-700">Ширина (см)</label>
            </div>
            <Input
              id="width"
              value={formData.width?.toString() || ''}
              onChange={(e) => handleNumberChange('width', e.target.value)}
              placeholder="0.0"
              type="number"
              step="0.1"
              fullWidth
            />
          </div>
          
          <div>
            <div className="mb-3">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Высота (см)</label>
            </div>
            <Input
              id="height"
              value={formData.height?.toString() || ''}
              onChange={(e) => handleNumberChange('height', e.target.value)}
              placeholder="0.0"
              type="number"
              step="0.1"
              fullWidth
            />
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Вес (кг)</label>
              {renderTooltip('weight', 'Укажите вес товара в килограммах. Эта информация важна для расчета стоимости доставки.')}
            </div>
            <Input
              id="weight"
              value={formData.weight?.toString() || ''}
              onChange={(e) => handleNumberChange('weight', e.target.value)}
              placeholder="0.0"
              type="number"
              step="0.1"
              fullWidth
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Цена
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Цена (₸) *</label>
              {renderTooltip('price', 'Укажите цену товара в тенге. Цена должна быть больше нуля.')}
            </div>
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
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Изображения товара *
        </h2>
        
        <div className="space-y-4">
          {isEditMode && uploadSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded-md">
              <p className="text-sm text-green-700">Изображения успешно загружены</p>
            </div>
          )}
          
          {isEditMode && uploadError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-md">
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="w-32 h-32 border rounded-md overflow-hidden bg-gray-50">
                  <img 
                    src={preview} 
                    alt={`Предпросмотр ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImages}
              className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 bg-gray-50 ${isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploadingImages ? (
                <>
                  <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  <span className="mt-2 text-sm text-gray-500">Загрузка...</span>
                </>
              ) : (
                <>
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Добавить фото</span>
                </>
              )}
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
            required={!isEditMode && (!formData.images || formData.images.length === 0)}
          />
          
          {errors.images ? (
            <p className="text-xs text-red-500">{errors.images}</p>
          ) : (
            <p className="text-xs text-gray-500">
              {isEditMode 
                ? 'Загрузите до 10 изображений в формате JPG или PNG. Максимальный размер каждого файла: 10 МБ.'
                : 'Загрузите до 10 изображений в формате JPG или PNG. Рекомендуемый размер: 1000x1000 пикселей.'
              }
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          fullWidth={window.innerWidth < 640}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth={window.innerWidth < 640}
        >
          {isEditMode ? 'Сохранить изменения' : 'Создать товар'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm; 