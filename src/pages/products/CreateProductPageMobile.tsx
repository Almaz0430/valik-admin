/**
 * Мобильная версия страницы создания нового товара
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { 
  ArrowLeftIcon, 
  InformationCircleIcon, 
  CheckIcon 
} from '@heroicons/react/24/outline';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import productService from '../../services/productService';

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
  });
  
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
      await productService.createProduct(formData);
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
                  value={formData.brand_id?.toString() || ''}
                  onChange={(value) => handleChange('brand_id', value ? parseInt(value) : null)}
                  options={[
                    { value: '', label: 'Выберите бренд' },
                    ...mockBrands.map(brand => ({ value: brand.id, label: brand.name }))
                  ]}
                  error={errors.brand_id}
                  fullWidth
                  required
                />
              </div>
              
              {/* Категория */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Категория *
                </label>
                <Select
                  id="category"
                  value={formData.category_id?.toString() || ''}
                  onChange={(value) => handleChange('category_id', value ? parseInt(value) : null)}
                  options={[
                    { value: '', label: 'Выберите категорию' },
                    ...mockCategories.map(category => ({ value: category.id, label: category.name }))
                  ]}
                  error={errors.category_id}
                  fullWidth
                  required
                />
              </div>
              
              {/* Единица измерения */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Единица измерения *
                </label>
                <Select
                  id="unit"
                  value={formData.unit_id?.toString() || ''}
                  onChange={(value) => handleChange('unit_id', value ? parseInt(value) : null)}
                  options={[
                    { value: '', label: 'Выберите единицу' },
                    ...mockUnits.map(unit => ({ value: unit.id, label: unit.name }))
                  ]}
                  error={errors.unit_id}
                  fullWidth
                  required
                />
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