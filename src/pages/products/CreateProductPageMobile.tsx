/**
 * Мобильная версия страницы создания нового товара
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { 
  ArrowLeftIcon, 
  InformationCircleIcon, 
  CheckIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from 'react-select';
import productService from '../../services/productService';

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

// Заглушки для API, в реальном приложении заменить на реальные вызовы API
const mockBrands = [
  { id: 1, name: 'Knauf' },
  { id: 2, name: 'Ceresit' },
  { id: 3, name: 'Технониколь' },
  { id: 4, name: 'Волма' }
];

const mockUnits = [
  { id: 1, name: 'шт' },
  { id: 2, name: 'кг' },
  { id: 3, name: 'м²' },
  { id: 4, name: 'м³' },
  { id: 5, name: 'упак' }
];

const mockCategories = [
  { id: 1, name: 'Строительные смеси' },
  { id: 2, name: 'Отделочные материалы' },
  { id: 3, name: 'Инструменты' },
  { id: 4, name: 'Крепежные изделия' }
];

// Определяем тип для опций react-select
interface SelectOption {
  value: number;
  label: string;
}

// Временные значения для тестирования
const defaultTestValues = {
  brand_id: 1,   
  unit_id: 1,    
  category_id: 1
};

/**
 * Компонент мобильного формы создания товара
 */
const CreateProductPageMobile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand_id: defaultTestValues.brand_id,
    unit_id: defaultTestValues.unit_id,
    category_id: defaultTestValues.category_id,
    price: 0,
    article: 0,
    // Опциональные поля
    length: undefined as number | undefined,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    weight: undefined as number | undefined,
    images: [] as File[]
  });
  
  // Состояния для выбранных опций react-select
  const defaultBrand = mockBrands.find(b => b.id === defaultTestValues.brand_id);
  const defaultUnit = mockUnits.find(u => u.id === defaultTestValues.unit_id);
  const defaultCategory = mockCategories.find(c => c.id === defaultTestValues.category_id);

  const [selectedBrand, setSelectedBrand] = useState<SelectOption | null>(defaultBrand ? { value: defaultBrand.id, label: defaultBrand.name } : null);
  const [selectedUnit, setSelectedUnit] = useState<SelectOption | null>(defaultUnit ? { value: defaultUnit.id, label: defaultUnit.name } : null);
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(defaultCategory ? { value: defaultCategory.id, label: defaultCategory.name } : null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Создание товара | Valik.kz';
    return () => { document.title = 'Valik.kz'; };
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: string, selectedOption: SelectOption | null) => {
    handleChange(field, selectedOption ? selectedOption.value : null);

    if (field === 'brand_id') {
      setSelectedBrand(selectedOption);
    } else if (field === 'unit_id') {
      setSelectedUnit(selectedOption);
    } else if (field === 'category_id') {
      setSelectedCategory(selectedOption);
    }
  };
  
  const handleNumberChange = (field: string, value: string) => {
    if (value === '') {
      handleChange(field, undefined);
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
      // Преобразуем FileList в массив File
      const newFiles = Array.from(files);
      
      // Создаем URL для предпросмотра
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      // Обновляем состояние
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);

      // Очистка ошибки при добавлении изображений
      if (errors.images) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
    
    // Освобождаем URL для предотвращения утечек памяти
    URL.revokeObjectURL(previewImages[index]);
    
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Очистка URL-ов при размонтировании компонента
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Введите название';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Введите описание';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Укажите цену';
    }
    
    // Проверка наличия изображений
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = 'Загрузите хотя бы одно изображение товара';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Создаем объект FormData для отправки multipart/form-data
      const formDataToSend = new FormData();
      
      // Добавляем все текстовые поля
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('brand_id', formData.brand_id.toString());
      formDataToSend.append('unit_id', formData.unit_id.toString());
      formDataToSend.append('category_id', formData.category_id.toString());
      
      if (formData.article) {
        formDataToSend.append('article', formData.article.toString());
      }
      
      if (formData.length !== undefined) {
        formDataToSend.append('length', formData.length.toString());
      }
      
      if (formData.width !== undefined) {
        formDataToSend.append('width', formData.width.toString());
      }
      
      if (formData.height !== undefined) {
        formDataToSend.append('height', formData.height.toString());
      }
      
      if (formData.weight !== undefined) {
        formDataToSend.append('weight', formData.weight.toString());
      }
      
      // Добавляем все изображения в поле files
      formData.images.forEach(image => {
        formDataToSend.append('files', image);
      });
      
      await productService.createProductWithImages(formDataToSend);
      setSuccess(true);
      
      // Показываем сообщение об успехе и перенаправляем через 1.5 секунды
      setTimeout(() => {
        navigate('/dashboard/products/mobile');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при создании товара';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Сообщение об успешном создании */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-md">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-sm text-green-700">
                Товар успешно создан!
              </p>
            </div>
          </div>
        )}
        
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
                  options={mockBrands.map(brand => ({ value: brand.id, label: brand.name }))}
                  placeholder="Выберите бренд"
                  isClearable
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
                  options={mockCategories.map(category => ({ value: category.id, label: category.name }))}
                  placeholder="Выберите категорию"
                  isClearable
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
                  options={mockUnits.map(unit => ({ value: unit.id, label: unit.name }))}
                  placeholder="Выберите единицу"
                  isClearable
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
          disabled={isLoading || success}
          className="flex-1 py-2.5 px-4 bg-orange-600 text-white rounded-lg text-sm font-medium flex items-center justify-center"
        >
          {isLoading ? (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : success ? (
            <CheckIcon className="h-4 w-4 mr-1" />
          ) : null}
          {isLoading ? 'Создание...' : success ? 'Создано!' : 'Создать товар'}
        </button>
      </div>
    </Layout>
  );
};

export default CreateProductPageMobile; 