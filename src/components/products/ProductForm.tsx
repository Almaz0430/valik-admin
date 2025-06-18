/**
 * Компонент формы создания/редактирования товара
 */
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface Brand {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductFormData {
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
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  brands: Brand[];
  units: Unit[];
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  brands,
  units,
  categories
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
    price: initialData?.price || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleChange = (field: keyof ProductFormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (field: keyof ProductFormData, value: string) => {
    if (value === '') {
      handleChange(field, undefined);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        handleChange(field, numValue);
      }
    }
  };

  // Специальный обработчик для цены, который не принимает отрицательные значения
  const handlePriceChange = (value: string) => {
    // Удаляем все символы, кроме цифр и точек
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

    // Проверка обязательных полей
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

    // Проверка, что цена не отрицательная
    if (formData.price < 0) {
      newErrors.price = 'Цена не может быть отрицательной';
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
              placeholder="Например: Цемент М500 Д0 ПЦ, 50 кг"
              error={errors.title}
              fullWidth
              required
            />
            {!errors.title && (
              <p className="mt-1 text-xs text-gray-500">Оптимальная длина: 50-70 символов</p>
            )}
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="article" className="block text-sm font-medium text-gray-700">Артикул</label>
              {renderTooltip('article', 'Уникальный код товара в вашей системе учета. Помогает быстро найти товар.')}
            </div>
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
          />
          {!errors.description && (
            <p className="mt-1 text-xs text-gray-500">Минимум 50 символов для хорошего описания</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-6 sm:gap-8">
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Бренд *</label>
              {renderTooltip('brand', 'Выберите производителя товара из списка.')}
            </div>
            <Select
              id="brand"
              value={formData.brand_id?.toString() || ''}
              onChange={(value) => handleChange('brand_id', value ? parseInt(value) : null)}
              options={[
                { value: '', label: 'Выберите бренд' },
                ...brands.map(brand => ({ value: brand.id, label: brand.name }))
              ]}
              error={errors.brand_id}
              fullWidth
              required
            />
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Единица измерения *</label>
              {renderTooltip('unit', 'Выберите единицу измерения, в которой продается товар (штуки, килограммы и т.д.).')}
            </div>
            <Select
              id="unit"
              value={formData.unit_id?.toString() || ''}
              onChange={(value) => handleChange('unit_id', value ? parseInt(value) : null)}
              options={[
                { value: '', label: 'Выберите единицу' },
                ...units.map(unit => ({ value: unit.id, label: unit.name }))
              ]}
              error={errors.unit_id}
              fullWidth
              required
            />
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Категория *</label>
              {renderTooltip('category', 'Выберите категорию, к которой относится товар. От этого зависит, где товар будет отображаться в каталоге.')}
            </div>
            <Select
              id="category"
              value={formData.category_id?.toString() || ''}
              onChange={(value) => handleChange('category_id', value ? parseInt(value) : null)}
              options={[
                { value: '', label: 'Выберите категорию' },
                ...categories.map(category => ({ value: category.id, label: category.name }))
              ]}
              error={errors.category_id}
              fullWidth
              required
            />
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
          Создать товар
        </Button>
      </div>
    </form>
  );
};

export default ProductForm; 