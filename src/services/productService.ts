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
const API_URL = 'http://localhost:8080';

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
}

export default new ProductService(); 