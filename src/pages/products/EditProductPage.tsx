/**
 * Страница редактирования товара
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProductForm, { type ProductFormData } from '../../components/products/ProductForm';
import productService from '../../services/productService';
import type { Product } from '../../types/product';
import type { Brand, Category, Unit } from '../../services/productService';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError('ID товара не указан');
        setIsLoading(false);
        return;
      }

      try {
        const productId = parseInt(id);
        
        // Параллельно загружаем данные товара и справочники
        const [productData, brandsData, unitsData, categoriesData] = await Promise.all([
          productService.getProduct(productId),
          productService.getBrands(),
          productService.getUnits(),
          productService.getCategories()
        ]);
        
        const foundProduct = productData.hasOwnProperty('product') 
          ? (productData as any).product 
          : productData;
        
        setProduct(foundProduct);
        setBrands(brandsData);
        setUnits(unitsData);
        setCategories(categoriesData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных';
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);
  
  const handleUpdateProduct = async (formData: ProductFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Исключаем 'images' из данных перед отправкой
      const { images, ...productData } = formData;

      // Преобразуем null в undefined для соответствия UpdateProductDTO
      const payload = Object.fromEntries(
        Object.entries(productData).map(([key, value]) => [key, value === null ? undefined : value])
      );
      
      await productService.updateProduct(parseInt(id), payload);
      
      // Показываем сообщение об успехе и перенаправляем
      alert('Товар успешно обновлен!');
      navigate('/dashboard/products');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить товар';
      setSubmitError(errorMessage);
      console.error('Ошибка при обновлении товара:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Преобразуем данные товара в формат, понятный для компонента ProductForm
  const getInitialData = () => {
    if (!product) return undefined;

    return {
      title: product.title,
      description: product.description || '',
      brand_id: product.brand_id || null,
      unit_id: product.unit_id || null,
      category_id: product.category_id || null,
      article: product.article,
      length: product.length,
      width: product.width,
      height: product.height,
      weight: product.weight,
      depth: product.depth,
      price: product.price,
      images: [] // Изображения управляются отдельно внутри формы
    };
  };

  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Загрузка данных товара...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => navigate('/dashboard/products')}
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Вернуться к списку товаров
                </button>
              </div>
            </div>
          </div>
        ) : product ? (
          <>
            {submitError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}
            <ProductForm
              initialData={getInitialData()} 
              onSubmit={handleUpdateProduct}
              isLoading={isSubmitting}
              brands={brands}
              units={units}
              categories={categories}
              isEditMode={true}
              productId={parseInt(id!)}
            />
          </>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Товар не найден</p>
                <button 
                  onClick={() => navigate('/dashboard/products')}
                  className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600"
                >
                  Вернуться к списку товаров
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditProductPage; 