/**
 * Сервис для работы с товарами поставщика
 */
import authService from './authService';
import type { 
  Product, 
  ProductQueryParams, 
  ProductListResponse, 
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO
} from '../types/product';

/**
 * Базовый URL API
 */
const API_URL = import.meta.env.VITE_NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : 'https://api.valik.kz'

/**
 * Интерфейсы для категорий, брендов и единиц измерения
 */
export interface Category {
  id: number;
  title: string;
}

export interface Brand {
  id: number;
  title: string;
}

export interface Unit {
  id: number;
  title: string;
}

/**
 * Класс для работы с API товаров поставщика
 */
class ProductService {
  /**
   * Получение списка товаров поставщика с пагинацией и фильтрацией
   */
  async getProducts(params: ProductQueryParams = { page: 1, limit: 10 }): Promise<ProductListResponse> {
    // Собираем query-параметры
    const queryParams = new URLSearchParams();
    
    // Добавляем параметры в URL, если они заданы
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.search) queryParams.append('search', params.search);
    if (params.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params.status) queryParams.append('status', params.status);
    
    const url = `${API_URL}/suppliers/products?${queryParams.toString()}`;
    console.log('Запрос списка товаров:', url);
    
    try {
      const token = authService.getToken();
      console.log('Токен доступа:', token ? 'Присутствует' : 'Отсутствует');
      
      const response = await authService.fetchWithAuth(url);
      console.log('Статус ответа:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении списка товаров:', response.status, errorText);
        throw new Error(`Ошибка при получении списка товаров: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные о товарах:', data);
      
      // Проверка структуры ответа
      if (!data.products || !Array.isArray(data.products)) {
        console.error('Неверная структура ответа API:', data);
        throw new Error('Неверная структура ответа API');
      }
      
      // Адаптация под структуру ProductListResponse
      return {
        products: data.products,
        total: data.total || data.products.length,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error) {
      console.error('Ошибка при запросе списка товаров:', error);
      throw error;
    }
  }
  
  /**
   * Получение информации о конкретном товаре
   */
  async getProduct(id: number): Promise<Product> {
    console.log(`Запрос информации о товаре с ID ${id}`);
    
    const response = await authService.fetchWithAuth(`${API_URL}/suppliers/products/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка при получении товара ${id}:`, response.status, errorText);
      throw new Error(`Товар с ID ${id} не найден`);
    }
    
    const data = await response.json() as ProductResponse;
    console.log('Получены данные о товаре:', data);
    return data.product;
  }
  
  /**
   * Создание нового товара
   */
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    console.log('Отправка запроса на создание товара:', productData);
    
    const response = await authService.fetchWithAuth(`${API_URL}/suppliers/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Ошибка при создании товара:', error);
      throw new Error(error.message || 'Ошибка при создании товара');
    }
    
    const data = await response.json() as ProductResponse;
    console.log('Товар успешно создан:', data);
    return data.product;
  }
  
  /**
   * Обновление существующего товара
   */
  async updateProduct(id: number, productData: UpdateProductDTO): Promise<Product> {
    const response = await authService.fetchWithAuth(`${API_URL}/suppliers/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Ошибка при обновлении товара с ID ${id}`);
    }
    
    const data = await response.json() as ProductResponse;
    return data.product;
  }
  
  /**
   * Удаление товара
   */
  async deleteProduct(id: number): Promise<void> {
    const response = await authService.fetchWithAuth(`${API_URL}/suppliers/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Ошибка при удалении товара с ID ${id}`);
    }
  }

  /**
   * Получение списка категорий
   */
  async getCategories(): Promise<Category[]> {
    console.log('Запрос списка категорий');
    
    try {
      const response = await authService.fetchWithAuth(`${API_URL}/categories`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении списка категорий:', response.status, errorText);
        throw new Error(`Ошибка при получении списка категорий: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные о категориях:', data);
      
      return data.categories || data;
    } catch (error) {
      console.error('Ошибка при запросе списка категорий:', error);
      throw error;
    }
  }

  /**
   * Получение списка брендов
   */
  async getBrands(): Promise<Brand[]> {
    console.log('Запрос списка брендов');
    
    try {
      const response = await authService.fetchWithAuth(`${API_URL}/brands`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении списка брендов:', response.status, errorText);
        throw new Error(`Ошибка при получении списка брендов: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные о брендах:', data);
      
      return data.brands || data;
    } catch (error) {
      console.error('Ошибка при запросе списка брендов:', error);
      throw error;
    }
  }

  /**
   * Получение списка единиц измерения
   */
  async getUnits(): Promise<Unit[]> {
    console.log('Запрос списка единиц измерения');
    
    try {
      const response = await authService.fetchWithAuth(`${API_URL}/units`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении списка единиц измерения:', response.status, errorText);
        throw new Error(`Ошибка при получении списка единиц измерения: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные о единицах измерения:', data);
      
      return data.units || data;
    } catch (error) {
      console.error('Ошибка при запросе списка единиц измерения:', error);
      throw error;
    }
  }

  /**
   * Создание нового товара с изображениями
   */
  async createProductWithImages(formData: FormData): Promise<Product> {
    console.log('Отправка запроса на создание товара с изображениями');
    
    const response = await authService.fetchWithAuth(`${API_URL}/suppliers/products`, {
      method: 'POST',
      // Не указываем Content-Type, чтобы браузер автоматически установил правильный заголовок с boundary
      body: formData,
    });
    
    if (!response.ok) {
      let errorMessage = 'Ошибка при создании товара';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Если не удалось распарсить JSON, используем текст ошибки
        errorMessage = await response.text() || errorMessage;
      }
      console.error('Ошибка при создании товара:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json() as ProductResponse;
    console.log('Товар с изображениями успешно создан:', data);
    return data.product;
  }

  /**
   * Обновление товара с изображениями
   * 
   * Использует эндпоинт PATCH /suppliers/products/:id для обновления информации о товаре
   * Эндпоинт проверяет принадлежность товара авторизованному поставщику
   * и обновляет только те поля, которые были переданы в запросе
   * 
   * @param id ID товара для обновления
   * @param formData Данные товара в формате FormData (multipart/form-data)
   * @returns Обновленный товар
   */
  async updateProductWithImages(id: number, formData: FormData): Promise<Product> {
    console.log(`Отправка запроса на обновление товара с ID ${id} с изображениями`);
    
    // Используем эндпоинт для обновления товара поставщика
    const response = await authService.fetchWithAuth(`${API_URL}/suppliers/products/${id}`, {
      method: 'PATCH',
      // Не указываем Content-Type, чтобы браузер автоматически установил правильный заголовок с boundary
      body: formData,
    });
    
    if (!response.ok) {
      let errorMessage = `Ошибка при обновлении товара с ID ${id}`;
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Если не удалось распарсить JSON, используем текст ошибки
        errorMessage = await response.text() || errorMessage;
      }
      console.error('Ошибка при обновлении товара:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json() as ProductResponse;
    console.log('Товар с изображениями успешно обновлен:', data);
    
    // Проверяем структуру ответа
    if (!data || !data.product) {
      console.warn('Сервер вернул успешный ответ, но структура ответа не соответствует ожидаемой:', data);
      // Если структура ответа не соответствует ожидаемой, но запрос успешен,
      // возвращаем данные как есть, предполагая, что сервер вернул сам продукт, а не обертку
      return data as unknown as Product;
    }
    
    return data.product;
  }
}

export default new ProductService(); 