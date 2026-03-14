/**
 * Сервис для работы с категориями
 */
import { api } from '../../../utils/axiosConfig';
import type {
  Category,
  SubCategory,
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
   * Получение списка всех подкатегорий
   */
  async getSubCategories(): Promise<SubCategory[]> {
    try {
      const response = await api.get<SubCategory[]>('/product/subcategory/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Ошибка при запросе подкатегорий:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при получении подкатегорий');
      }
      throw new Error('Ошибка при получении подкатегорий');
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
   * Создание новой категории или подкатегории
   */
  async createCategory(categoryData: {
    name: string;
    parent_id: number | null;
  }): Promise<Category | any> {
    try {
      // Если есть parent_id, создаем подкатегорию
      if (categoryData.parent_id) {
        const response = await api.post('/product/subcategory/', {
          name: categoryData.name,
          category: categoryData.parent_id,
        });
        return response.data;
      }

      // Иначе создаем обычную категорию
      const response = await api.post<Category>('/product/category/', {
        name: categoryData.name,
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при создании');
      }
      throw new Error('Ошибка при создании');
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
   * Удаление категории или подкатегории
   */
  async deleteCategory(id: number, isSubCategory: boolean = false): Promise<void> {
    try {
      const endpoint = isSubCategory ? `/product/subcategory/${id}/` : `/product/category/${id}/`;
      await api.delete(endpoint);
    } catch (error) {
      console.error(`Ошибка при удалении ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при удалении с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при удалении с ID ${id}`);
    }
  }
}

const categoryService = new CategoryService();

export default categoryService;
