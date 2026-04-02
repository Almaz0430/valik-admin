/**
 * Сервис для работы с товарами поставщика
 * Эндпоинты соответствуют реальному Django бэкенду
 */
import type {
  Product,
  CreateProductDTO,
  ImportProductsResponse,
  Category,
  SubCategory,
} from '../../../types/product';
import type { Brand, Unit } from '../../../types/attribute';
import { api } from '../../../utils/axiosConfig';

export type { Category, SubCategory };

/**
 * Класс для работы с API товаров поставщика
 */
class ProductService {
  /**
   * Получение списка товаров конкретного вендора
   * GET /product/vendor/<vendor_id>/products/
   */
  async getVendorProducts(vendorId: number): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>(`/product/vendor/${vendorId}/products/`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при запросе списка товаров:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при получении списка товаров');
      }
      throw new Error('Ошибка при получении списка товаров');
    }
  }

  /**
   * Получение информации о конкретном товаре
   * GET /product/optinfo/<id>/
   */
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get<Product>(`/product/optinfo/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении товара ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || `Товар с ID ${id} не найден`);
      }
      throw new Error(`Товар с ID ${id} не найден`);
    }
  }

  /**
   * Создание нового товара с изображением
   * POST /product/opt-products/
   * Content-Type: multipart/form-data
   * Поля: name, vendor, sub_category, brand, unit, description, image
   */
  async createProduct(data: CreateProductDTO): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('vendor', String(data.vendor));
      if (data.sub_category !== null && data.sub_category !== undefined) {
        formData.append('sub_category', String(data.sub_category));
      }
      if (data.brand !== null && data.brand !== undefined) {
        formData.append('brand', String(data.brand));
      }
      if (data.unit !== null && data.unit !== undefined) {
        formData.append('unit', String(data.unit));
      }
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.image) {
        formData.append('image', data.image);
      }
      if (data.article !== undefined && data.article !== null) {
        formData.append('article', String(data.article));
      }
      if (data.length !== undefined && data.length !== null) {
        formData.append('length', String(data.length));
      }
      if (data.width !== undefined && data.width !== null) {
        formData.append('width', String(data.width));
      }
      if (data.height !== undefined && data.height !== null) {
        formData.append('height', String(data.height));
      }
      if (data.weight !== undefined && data.weight !== null) {
        formData.append('weight', String(data.weight));
      }
      if (data.price !== undefined && data.price !== null) {
        formData.append('price', String(data.price));
      }

      const response = await api.post<Product>('/product/opt-products/create/', formData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: unknown } };
        const data = err.response?.data;
        // Обрабатываем детальные ошибки Django
        if (data && typeof data === 'object') {
          const messages = Object.entries(data as Record<string, string[]>)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          throw new Error(messages || 'Ошибка при создании товара');
        }
      }
      throw new Error('Ошибка при создании товара');
    }
  }

  /**
   * Получение списка всех категорий (с вложенными подкатегориями)
   * GET /product/category/
   * Ответ: [{id, name, sub_categories: [{id, name, category}]}]
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>('/product/category/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Ошибка при запросе списка категорий:', error);
      throw new Error('Ошибка при получении списка категорий');
    }
  }

  /**
   * Получение плоского списка всех подкатегорий
   * GET /product/subcategory/
   * Ответ: [{id, name, category}]
   */
  async getSubCategories(): Promise<SubCategory[]> {
    try {
      const response = await api.get<SubCategory[]>('/product/subcategory/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Ошибка при запросе подкатегорий:', error);
      throw new Error('Ошибка при получении подкатегорий');
    }
  }

  /**
   * Импорт товаров из CSV файла
   */
  async importProducts(file: File): Promise<ImportProductsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<ImportProductsResponse>('/product/import-csv/', formData);
      return this.normalizeImportResponse(response.data);
    } catch (error) {
      console.error('Ошибка при импорте товаров:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: ImportProductsResponse } };
        if (err.response?.data) {
          return this.normalizeImportResponse(err.response.data);
        }
      }
      throw new Error('Ошибка при отправке файла импорта');
    }
  }

  /**
   * Скачивание шаблона для импорта товаров
   * GET /product/import-csv/template/
   */
  async downloadImportTemplate(): Promise<void> {
    try {
      const response = await api.get('/product/import-csv/template/', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании шаблона:', error);
      throw new Error('Не удалось скачать шаблон для импорта');
    }
  }

  /**
   * Нормализуем разные варианты ответа бэкенда к единому формату
   */
  private normalizeImportResponse(raw: unknown): ImportProductsResponse {
    const data = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};

    const imported = typeof data.imported === 'number' ? data.imported : 0;
    const skipped = typeof data.skipped === 'number' ? data.skipped : 0;
    const errorsArray = Array.isArray(data.errors) ? data.errors : [];
    const failedRows = errorsArray.length;

    const rawStatus = (data as { status?: unknown }).status;
    const status: ImportProductsResponse['status'] =
      typeof rawStatus === 'string'
        ? (rawStatus as ImportProductsResponse['status'])
        : failedRows === 0
          ? 'success'
          : imported > 0
            ? 'partial'
            : 'failed';

    const message =
      typeof data.message === 'string'
        ? data.message
        : status === 'success'
          ? 'Импорт успешно завершен'
          : status === 'partial'
            ? 'Импорт завершен с ошибками'
            : 'Импорт не выполнен';

    return {
      message,
      status,
      total_rows: typeof data.total_rows === 'number' ? data.total_rows : imported + skipped + failedRows,
      processed_rows: typeof data.processed_rows === 'number' ? data.processed_rows : imported + skipped,
      created_products: typeof data.created_products === 'number' ? data.created_products : imported,
      failed_rows: typeof data.failed_rows === 'number' ? data.failed_rows : failedRows,
      errors: errorsArray as ImportProductsResponse['errors'],
      error: typeof data.error === 'string' ? data.error : undefined,
      import_id: typeof data.import_id === 'number' ? data.import_id : undefined,
      imported,
      skipped,
    };
  }

  /**
   * Получение списка брендов
   * GET /product/brands/
   */
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get<Brand[]>('/product/brands/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Ошибка при запросе брендов:', error);
      throw new Error('Ошибка при получении брендов');
    }
  }

  /**
   * Получение списка единиц измерения
   * GET /product/units/
   */
  async getUnits(): Promise<Unit[]> {
    try {
      const response = await api.get<Unit[]>('/product/units/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Ошибка при запросе единиц измерения:', error);
      throw new Error('Ошибка при получении единиц измерения');
    }
  }

  /**
   * Обновление существующего товара
   * PUT /product/opt-products/<id>/
   * Content-Type: multipart/form-data
   */
  async updateProduct(id: number, data: CreateProductDTO): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('vendor', String(data.vendor));
      if (data.sub_category !== null && data.sub_category !== undefined) {
        formData.append('sub_category', String(data.sub_category));
      }
      if (data.brand !== null && data.brand !== undefined) {
        formData.append('brand', String(data.brand));
      }
      if (data.unit !== null && data.unit !== undefined) {
        formData.append('unit', String(data.unit));
      }
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.image) {
        formData.append('image', data.image);
      }
      if (data.article !== undefined && data.article !== null) {
        formData.append('article', String(data.article));
      }
      if (data.length !== undefined && data.length !== null) {
        formData.append('length', String(data.length));
      }
      if (data.width !== undefined && data.width !== null) {
        formData.append('width', String(data.width));
      }
      if (data.height !== undefined && data.height !== null) {
        formData.append('height', String(data.height));
      }
      if (data.weight !== undefined && data.weight !== null) {
        formData.append('weight', String(data.weight));
      }
      if (data.price !== undefined && data.price !== null) {
        formData.append('price', String(data.price));
      }

      const response = await api.put<Product>(`/product/opt-products/${id}/`, formData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении товара ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: unknown } };
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          const messages = Object.entries(data as Record<string, string[]>)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          throw new Error(messages || 'Ошибка при обновлении товара');
        }
      }
      throw new Error('Ошибка при обновлении товара');
    }
  }

  /**
   * Удаление товара
   * DELETE /product/opt-products/<id>/delete/
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/product/opt-products/${id}/delete/`);
    } catch (error) {
      console.error(`Ошибка при удалении товара ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || `Не удалось удалить товар с ID ${id}`);
      }
      throw new Error(`Не удалось удалить товар с ID ${id}`);
    }
  }
}

const productService = new ProductService();

export default productService;
