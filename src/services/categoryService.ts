/**
 * Сервис для работы с категориями
 */
import { api } from '../utils/axiosConfig';

/**
 * Интерфейсы для категорий
 */
export interface Category {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Класс для работы с API категорий
 */
class CategoryService {
  /**
   * Получение списка категорий с пагинацией и фильтрацией
   */
  async getCategories(params: QueryParams = { page: 1, limit: 10 }): Promise<CategoryListResponse> {
    try {
      const response = await api.get<Category[] | { categories: Category[]; total: number }>('/categories', { params });
      const data = response.data;
      
      const categories = Array.isArray(data) ? data : [];
      const total = Array.isArray(data) ? data.length : data.total;

      return {
        categories: categories || [],
        total: total || 0,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error: any) {
      console.error('Ошибка при запросе списка категорий:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при получении списка категорий');
    }
  }

  /**
   * Получение информации о конкретной категории   
   */
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await api.get<Category>(`/categories/${id}`);
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error(`Ошибка при получении категорий ${id}:`, error);
      throw new Error(error.response?.data?.message || `Категория с ID ${id} не найдена`);
    }
  }

  /**
   * Создание новой категории
   */
  async createCategory(categoryData: { title: string, parent_id: number | null }): Promise<Category> {
    try {
      const response = await api.post<Category>('/categories', categoryData);
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error('Ошибка при создании категории:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при создании категории');
    }
  }

  /**
   * Обновление существующей категории
   */
  async updateCategory(id: number, categoryData: { title: string }): Promise<Category> {
    try {
      const response = await api.patch<Category>(`/categories/${id}`, categoryData);
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error(`Ошибка при обновлении категории ${id}:`, error);
      throw new Error(error.response?.data?.message || `Ошибка при обновлении категории с ID ${id}`);
    }
  }

  /**
   * Удаление категории
   */
  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error: any) {
      console.error(`Ошибка при удалении категории ${id}:`, error);
      throw new Error(error.response?.data?.message || `Ошибка при удалении категории с ID ${id}`);
    }
  }
}

export default new CategoryService(); 