/**
 * Компонент формы создания/редактирования товара
 */
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Название товара *"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Введите название товара"
            error={errors.title}
            fullWidth
            required
          />
          
          <Input
            label="Артикул"
            value={formData.article?.toString() || ''}
            onChange={(e) => handleNumberChange('article', e.target.value)}
            placeholder="Введите артикул товара"
            type="number"
            fullWidth
          />
        </div>
        
        <div className="mt-4">
          <TextArea
            label="Описание товара *"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Введите описание товара"
            rows={4}
            error={errors.description}
            fullWidth
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Select
            label="Бренд *"
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
          
          <Select
            label="Единица измерения *"
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
          
          <Select
            label="Категория *"
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
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Габариты и вес</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Длина (см)"
            value={formData.length?.toString() || ''}
            onChange={(e) => handleNumberChange('length', e.target.value)}
            placeholder="0.0"
            type="number"
            step="0.1"
            fullWidth
          />
          
          <Input
            label="Ширина (см)"
            value={formData.width?.toString() || ''}
            onChange={(e) => handleNumberChange('width', e.target.value)}
            placeholder="0.0"
            type="number"
            step="0.1"
            fullWidth
          />
          
          <Input
            label="Высота (см)"
            value={formData.height?.toString() || ''}
            onChange={(e) => handleNumberChange('height', e.target.value)}
            placeholder="0.0"
            type="number"
            step="0.1"
            fullWidth
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input
            label="Вес (кг)"
            value={formData.weight?.toString() || ''}
            onChange={(e) => handleNumberChange('weight', e.target.value)}
            placeholder="0.0"
            type="number"
            step="0.1"
            fullWidth
          />
          
          <Input
            label="Глубина (см)"
            value={formData.depth?.toString() || ''}
            onChange={(e) => handleNumberChange('depth', e.target.value)}
            placeholder="0.0"
            type="number"
            step="0.1"
            fullWidth
          />
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Цена</h2>
        
        <Input
          label="Цена (₸)"
          value={formData.price.toString()}
          onChange={(e) => handleNumberChange('price', e.target.value)}
          placeholder="0"
          type="number"
          step="1"
          error={errors.price}
          fullWidth
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button 
          variant="secondary" 
          type="button"
          onClick={() => window.history.back()}
        >
          Отмена
        </Button>
        <Button 
          variant="primary" 
          type="submit"
          isLoading={isLoading}
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default ProductForm; 