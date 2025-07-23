/**
 * Компонент создания/редактирования товара
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from './ProductForm';
import { 
  InformationCircleIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import productService from '../../services/productService';
// import type { CreateProductDTO, UpdateProductDTO } from '../../types/product';
import type { Brand, Category, Unit } from '../../services/productService';

// Импортируем интерфейс ProductFormData из файла формы
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
  images?: File[];
}

interface CreateProductProps {
  defaultValues?: Partial<ProductFormData>;
  isEditMode?: boolean;
  productId?: number;
}

const CreateProduct: React.FC<CreateProductProps> = ({ defaultValues, isEditMode = false, productId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(!isEditMode);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        // Параллельная загрузка всех справочников
        const [categoriesData, brandsData, unitsData] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
          productService.getUnits()
        ]);
        
        console.log(categoriesData);
        
        setCategories(categoriesData);
        setBrands(brandsData);
        setUnits(unitsData);
      } catch (err) {
        console.error('Ошибка при загрузке справочных данных:', err);
        setError('Не удалось загрузить справочные данные. Пожалуйста, обновите страницу.');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isEditMode && productId) {
        try {
          // Режим редактирования - отправляем PATCH запрос
          // Создаем объект FormData для отправки multipart/form-data
          const formDataToSend = new FormData();
          
          // Добавляем все текстовые поля
          formDataToSend.append('title', formData.title);
          formDataToSend.append('description', formData.description);
          formDataToSend.append('price', formData.price.toString());
          
          // Добавляем необязательные поля, заменяя undefined и null на пустую строку
          if (formData.brand_id !== null && formData.brand_id !== undefined) {
            formDataToSend.append('brand_id', formData.brand_id.toString());
          }
          
          if (formData.unit_id !== null && formData.unit_id !== undefined) {
            formDataToSend.append('unit_id', formData.unit_id.toString());
          }
          
          if (formData.category_id !== null && formData.category_id !== undefined) {
            formDataToSend.append('category_id', formData.category_id.toString());
          }
          
          if (formData.article !== null && formData.article !== undefined) {
            formDataToSend.append('article', formData.article.toString());
          }
          
          if (formData.length !== null && formData.length !== undefined) {
            formDataToSend.append('length', formData.length.toString());
          }
          
          if (formData.width !== null && formData.width !== undefined) {
            formDataToSend.append('width', formData.width.toString());
          }
          
          if (formData.height !== null && formData.height !== undefined) {
            formDataToSend.append('height', formData.height.toString());
          }
          
          if (formData.weight !== null && formData.weight !== undefined) {
            formDataToSend.append('weight', formData.weight.toString());
          }
          
          if (formData.depth !== null && formData.depth !== undefined) {
            formDataToSend.append('depth', formData.depth.toString());
          }
          
          // Добавляем все изображения в поле files
          if (formData.images && formData.images.length > 0) {
            formData.images.forEach(image => {
              formDataToSend.append('files', image);
            });
          }
          
          // Вызываем метод API для обновления товара с изображениями
          const updatedProduct = await productService.updateProductWithImages(productId, formDataToSend);
          
          if (updatedProduct && updatedProduct.id) {
            console.log('Товар успешно обновлен:', updatedProduct);
            setSuccess(`Товар "${updatedProduct.title}" успешно обновлен`);
            
            // Не перенаправляем пользователя, чтобы он мог увидеть сообщение об успехе
            setTimeout(() => {
              setSuccess(null);
            }, 5000);
          } else {
            // Если сервер вернул успех, но нет данных о товаре
            console.log('Товар обновлен, но данные не получены');
            setSuccess('Товар успешно обновлен');
            
            setTimeout(() => {
              setSuccess(null);
            }, 5000);
          }
        } catch (updateError: any) {
          // Обрабатываем ошибки при обновлении товара
          console.error('Ошибка при обновлении товара:', updateError);
          
          // Проверяем тип ошибки
          if (updateError.message && updateError.message.includes('не относится к поставщику')) {
            setError('Вы не можете редактировать этот товар, так как он не принадлежит вашему аккаунту.');
          } else {
            setError('Произошла ошибка при обновлении товара: ' + (updateError.message || 'Неизвестная ошибка'));
          }
        }
      } else {
        // Режим создания - отправляем POST запрос
        // Создаем объект FormData для отправки multipart/form-data
        const formDataToSend = new FormData();
        
        // Добавляем все текстовые поля
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price.toString());
        
        // Добавляем необязательные поля, заменяя undefined и null на пустую строку
        if (formData.brand_id !== null && formData.brand_id !== undefined) {
          formDataToSend.append('brand_id', formData.brand_id.toString());
        }
        
        if (formData.unit_id !== null && formData.unit_id !== undefined) {
          formDataToSend.append('unit_id', formData.unit_id.toString());
        }
        
        if (formData.category_id !== null && formData.category_id !== undefined) {
          formDataToSend.append('category_id', formData.category_id.toString());
        }
        
        if (formData.article !== null && formData.article !== undefined) {
          formDataToSend.append('article', formData.article.toString());
        }
        
        if (formData.length !== null && formData.length !== undefined) {
          formDataToSend.append('length', formData.length.toString());
        }
        
        if (formData.width !== null && formData.width !== undefined) {
          formDataToSend.append('width', formData.width.toString());
        }
        
        if (formData.height !== null && formData.height !== undefined) {
          formDataToSend.append('height', formData.height.toString());
        }
        
        if (formData.weight !== null && formData.weight !== undefined) {
          formDataToSend.append('weight', formData.weight.toString());
        }
        
        if (formData.depth !== null && formData.depth !== undefined) {
          formDataToSend.append('depth', formData.depth.toString());
        }
        
        // Добавляем все изображения в поле files
        if (formData.images && formData.images.length > 0) {
          formData.images.forEach(image => {
            formDataToSend.append('files', image);
          });
        }
        
        // Вызываем метод API для создания товара с изображениями
        const createdProduct = await productService.createProductWithImages(formDataToSend);
      
      console.log('Товар успешно создан:', createdProduct);
      navigate('/dashboard/products');
      }
    } catch (err) {
      console.error('Ошибка при ' + (isEditMode ? 'обновлении' : 'создании') + ' товара:', err);
      setError('Произошла ошибка при ' + (isEditMode ? 'обновлении' : 'создании') + ' товара. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      {/* Навигационная цепочка */}
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Link to="/dashboard" className="hover:text-orange-600">Главная</Link>
        <span className="mx-2">›</span>
        <Link to="/dashboard/products" className="hover:text-orange-600">Товары</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{isEditMode ? 'Редактирование товара' : 'Создание товара'}</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Редактирование товара' : 'Создание нового товара'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode 
              ? 'Измените информацию о товаре и нажмите "Сохранить изменения"' 
              : 'Заполните информацию о товаре для добавления в каталог'
            }
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
      
      {/* Сообщение об успешном обновлении */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Подсказки для заполнения формы */}
      {showTips && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Советы по заполнению формы</h3>
              <div className="mt-2 text-sm text-orange-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Поля, отмеченные звездочкой (*), обязательны для заполнения</li>
                  <li>Добавьте точное описание товара для улучшения его видимости в поиске</li>
                  <li>Указывайте точные размеры и вес для правильного расчета доставки</li>
                </ul>
              </div>
              <div className="mt-3">
                <button 
                  type="button"
                  onClick={() => setShowTips(false)}
                  className="text-sm font-medium text-orange-800 hover:text-orange-600"
                >
                  Скрыть подсказки
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
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
      
      {isDataLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Загрузка данных...</span>
        </div>
      ) : (
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          brands={brands}
          units={units}
          categories={categories}
          initialData={defaultValues as ProductFormData}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default CreateProduct; 