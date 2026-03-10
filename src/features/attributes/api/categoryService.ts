/**
 * Сервис для работы с категориями
 */
import { api } from '../../../utils/axiosConfig';
import type {
  Category,
  CategoryListResponse,
  AttributeQueryParams,
} from '../../../types/attribute';

/**
 * Класс для работы с API категорий
 */
class CategoryService {
  /**
   * Получение списка категорий с пагинацией и фильтрацией
   */
  async getCategories(
    params: AttributeQueryParams = { page: 1, limit: 10 },
  ): Promise<CategoryListResponse> {
    try {
      const response = await api.get<Category[] | { categories: Category[]; total: number }>(
        '/product/category/',
        { params },
      );
      const data = response.data;

      const categories = Array.isArray(data) ? data : data.categories || [];
      const total = Array.isArray(data) ? data.length : data.total || 0;

      return {
        categories: categories || [],
        total: total || 0,
        page: params.page || 1,
        limit: params.limit || 10,
      };
    } catch (error) {
      console.error('Ошибка при запросе списка категорий:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при получении списка категорий');
      }
      throw new Error('Ошибка при получении списка категорий');
    }
  }

  /**
   * Получение информации о конкретной категории
   */
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await api.get<Category>(`/product/category/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении категорий ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || `Категория с ID ${id} не найдена`);
      }
      throw new Error(`Категория с ID ${id} не найдена`);
    }
  }

  /**
   * Создание новой категории
   */
  async createCategory(categoryData: {
    name: string;
    parent_id: number | null;
  }): Promise<Category> {
    try {
      const response = await api.post<Category>('/product/category/', categoryData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при создании категории');
      }
      throw new Error('Ошибка при создании категории');
    }
  }

  /**
   * Обновление существующей категории
   */
  async updateCategory(id: number, categoryData: { name: string }): Promise<Category> {
    try {
      const response = await api.patch<Category>(`/product/category/${id}/`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении категории ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при обновлении категории с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при обновлении категории с ID ${id}`);
    }
  }

  /**
   * Удаление категории
   */
  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/product/category/${id}/`);
    } catch (error) {
      console.error(`Ошибка при удалении категории ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при удалении категории с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при удалении категории с ID ${id}`);
    }
  }
}

const categoryService = new CategoryService();

export default categoryService;
