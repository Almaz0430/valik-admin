/**
 * Компонент создания нового товара
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';

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

// Имитация API запроса для создания товара
const createProductAPI = async (productData: any): Promise<any> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Создание товара:', productData);
  
  // Имитация успешного ответа
  return {
    id: Math.floor(Math.random() * 1000),
    ...productData,
    created_at: new Date().toISOString()
  };
};

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState(mockBrands);
  const [units, setUnits] = useState(mockUnits);
  const [categories, setCategories] = useState(mockCategories);
  const [error, setError] = useState<string | null>(null);

  // В реальном приложении здесь будет загрузка данных с сервера
  useEffect(() => {
    // Загрузка брендов, единиц измерения и категорий с сервера
    // setBrands(await fetchBrands());
    // setUnits(await fetchUnits());
    // setCategories(await fetchCategories());
  }, []);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const createdProduct = await createProductAPI(formData);
      navigate('/dashboard/products');
    } catch (err) {
      console.error('Ошибка при создании товара:', err);
      setError('Произошла ошибка при создании товара. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Создание нового товара</h1>
          <p className="mt-1 text-sm text-gray-500">Заполните информацию о товаре</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        brands={brands}
        units={units}
        categories={categories}
      />
    </div>
  );
};

export default CreateProduct; 