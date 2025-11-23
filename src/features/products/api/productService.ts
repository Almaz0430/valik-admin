/**
 * Сервис для работы с товарами поставщика
 */
import type {
  Product,
  ProductQueryParams,
  ProductListResponse,
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ImportProductsResponse
} from '../../../types/product';
import { api } from '../../../utils/axiosConfig';

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
    try {
      const response = await api.get<{ products: Product[]; total: number }>('/suppliers/products', { params });
      const { products, total } = response.data;

      return {
        products,
        total,
        page: params.page || 1,
        limit: params.limit || 10
      };
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
   */
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get<Product>(`/suppliers/products/${id}`);
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
   * Создание нового товара
   */
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const response = await api.post<ProductResponse>('/suppliers/products', productData);
      return response.data.product;
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при создании товара');
      }
      throw new Error('Ошибка при создании товара');
    }
  }

  /**
   * Обновление существующего товара
   */
  async updateProduct(id: number, productData: UpdateProductDTO): Promise<Product> {
    try {
      const response = await api.patch<ProductResponse>(`/suppliers/products/${id}`, productData);
      return response.data.product;
    } catch (error) {
      console.error(`Ошибка при обновлении товара ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при обновлении товара с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при обновлении товара с ID ${id}`);
    }
  }

  /**
   * Удаление товара
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/suppliers/products/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении товара ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при удалении товара с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при удалении товара с ID ${id}`);
    }
  }

  /**
   * Получение списка категорий
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>('/categories');
      return response.data;
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
   * Получение списка брендов
   */
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get<Brand[]>('/brands');
      return response.data;
    } catch (error) {
      console.error('Ошибка при запросе списка брендов:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при получении списка брендов');
      }
      throw new Error('Ошибка при получении списка брендов');
    }
  }

  /**
   * Получение списка единиц измерения
   */
  async getUnits(): Promise<Unit[]> {
    try {
      const response = await api.get<Unit[]>('units');
      return response.data;
    } catch (error) {
      console.error('Ошибка при запросе списка единиц измерения:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || 'Ошибка при получении списка единиц измерения',
        );
      }
      throw new Error('Ошибка при получении списка единиц измерения');
    }
  }

  /**
   * Создание нового товара с изображениями
   */
  async createProductWithImages(formData: FormData): Promise<Product> {
    try {
      const response = await api.post<ProductResponse>('/suppliers/products', formData);
      return response.data.product;
    } catch (error) {
      console.error('Ошибка при создании товара с изображениями:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || 'Ошибка при создании товара с изображениями',
        );
      }
      throw new Error('Ошибка при создании товара с изображениями');
    }
  }

  /**
   * Обновление товара с изображениями
   */
  async updateProductWithImages(id: number, formData: FormData): Promise<Product> {
    try {
      const response = await api.patch<ProductResponse>(`/suppliers/products/${id}`, formData);
      return response.data.product;
    } catch (error) {
      console.error(`Ошибка при обновлении товара с ID ${id} с изображениями:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при обновлении товара с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при обновлении товара с ID ${id}`);
    }
  }

  /**
   * Добавление новых изображений к существующему товару
   */
  async addProductImages(id: number, files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      await api.post(`/suppliers/products/photos/add/${id}`, formData);
    } catch (error) {
      console.error(`Ошибка при добавлении изображений к товару ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message ||
          `Ошибка при добавлении изображений к товару с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при добавлении изображений к товару с ID ${id}`);
    }
  }

  /**
   * Удаление фотографии товара
   */
  async deleteProductImage(productId: number, imageUrl: string): Promise<void> {
    try {
      await api.post(`/suppliers/products/photos/delete/${productId}`, { link: imageUrl });
    } catch (error) {
      console.error('Ошибка при удалении фотографии:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при удалении фотографии');
      }
      throw new Error('Ошибка при удалении фотографии');
    }
  }
  /**
   * Импорт товаров из CSV файла
   */
  async importProducts(file: File): Promise<ImportProductsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<ImportProductsResponse>('/suppliers/products/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      import_id: typeof data.import_id === 'number' ? data.import_id : typeof data.importId === 'string' || typeof data.importId === 'number' ? Number(data.importId) : undefined,
      imported,
      skipped,
    };
  }
}

const productService = new ProductService();

export default productService;
