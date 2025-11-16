/**
 * Сервис для работы с брендами и единицами измерения
 */
import { api } from '../../../utils/axiosConfig';
import type {
  Brand,
  Unit,
  BrandListResponse,
  UnitListResponse,
  AttributeQueryParams,
} from '../../../types/attribute';

/**
 * Класс для работы с API брендов и единиц измерения
 */
class BrandUnitService {
  /**
   * Получение списка брендов с пагинацией и фильтрацией
   */
  async getBrands(params: AttributeQueryParams = { page: 1, limit: 10 }): Promise<BrandListResponse> {
    try {
      const response = await api.get<Brand[] | { brands: Brand[]; total: number }>('/brands', {
        params,
      });
      const data = response.data;

      const brands = Array.isArray(data) ? data : data.brands;
      const total = Array.isArray(data) ? data.length : data.total;

      return {
        brands: brands || [],
        total: total || 0,
        page: params.page || 1,
        limit: params.limit || 10,
      };
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
   * Получение информации о конкретном бренде
   */
  async getBrand(id: number): Promise<Brand> {
    try {
      const response = await api.get<Brand | { brand: Brand }>(`/brands/${id}`);
      const data = response.data;
      return 'brand' in data && data.brand ? data.brand : (data as Brand);
    } catch (error) {
      console.error(`Ошибка при получении бренда ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || `Бренд с ID ${id} не найден`);
      }
      throw new Error(`Бренд с ID ${id} не найден`);
    }
  }

  /**
   * Создание нового бренда
   */
  async createBrand(brandData: { title: string }): Promise<Brand> {
    try {
      const response = await api.post<Brand | { brand: Brand }>('/brands', brandData);
      const data = response.data;
      return 'brand' in data && data.brand ? data.brand : (data as Brand);
    } catch (error) {
      console.error('Ошибка при создании бренда:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Ошибка при создании бренда');
      }
      throw new Error('Ошибка при создании бренда');
    }
  }

  /**
   * Обновление существующего бренда
   */
  async updateBrand(id: number, brandData: { title: string }): Promise<Brand> {
    try {
      const response = await api.patch<Brand | { brand: Brand }>(`/brands/${id}`, brandData);
      const data = response.data;
      return 'brand' in data && data.brand ? data.brand : (data as Brand);
    } catch (error) {
      console.error(`Ошибка при обновлении бренда ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при обновлении бренда с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при обновлении бренда с ID ${id}`);
    }
  }

  /**
   * Удаление бренда
   */
  async deleteBrand(id: number): Promise<void> {
    try {
      await api.delete(`/brands/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении бренда ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || `Ошибка при удалении бренда с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при удалении бренда с ID ${id}`);
    }
  }

  /**
   * Получение списка единиц измерения с пагинацией и фильтрацией
   */
  async getUnits(params: AttributeQueryParams = { page: 1, limit: 10 }): Promise<UnitListResponse> {
    try {
      const response = await api.get<Unit[] | { units: Unit[]; total: number }>('/units', {
        params,
      });
      const data = response.data;

      const units = Array.isArray(data) ? data : data.units;
      const total = Array.isArray(data) ? data.length : data.total;

      return {
        units: units || [],
        total: total || 0,
        page: params.page || 1,
        limit: params.limit || 10,
      };
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
   * Получение информации о конкретной единицы измерения
   */
  async getUnit(id: number): Promise<Unit> {
    try {
      const response = await api.get<Unit | { unit: Unit }>(`/units/${id}`);
      const data = response.data;
      return 'unit' in data && data.unit ? data.unit : (data as Unit);
    } catch (error) {
      console.error(`Ошибка при получении единицы измерения ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message ||
            `Единица измерения с ID ${id} не найдена`,
        );
      }
      throw new Error(`Единица измерения с ID ${id} не найдена`);
    }
  }

  /**
   * Создание новой единицы измерения
   */
  async createUnit(unitData: { title: string }): Promise<Unit> {
    try {
      const response = await api.post<Unit | { unit: Unit }>('/units', unitData);
      const data = response.data;
      return 'unit' in data && data.unit ? data.unit : (data as Unit);
    } catch (error) {
      console.error('Ошибка при создании единицы измерения:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message || 'Ошибка при создании единицы измерения',
        );
      }
      throw new Error('Ошибка при создании единицы измерения');
    }
  }

  /**
   * Обновление существующей единицы измерения
   */
  async updateUnit(id: number, unitData: { title: string }): Promise<Unit> {
    try {
      const response = await api.patch<Unit | { unit: Unit }>(`/units/${id}`, unitData);
      const data = response.data;
      return 'unit' in data && data.unit ? data.unit : (data as Unit);
    } catch (error) {
      console.error(`Ошибка при обновлении единицы измерения ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message ||
            `Ошибка при обновлении единицы измерения с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при обновлении единицы измерения с ID ${id}`);
    }
  }

  /**
   * Удаление единицы измерения
   */
  async deleteUnit(id: number): Promise<void> {
    try {
      await api.delete(`/units/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении единицы измерения ${id}:`, error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
          err.response?.data?.message ||
            `Ошибка при удалении единицы измерения с ID ${id}`,
        );
      }
      throw new Error(`Ошибка при удалении единицы измерения с ID ${id}`);
    }
  }
}

const brandUnitService = new BrandUnitService();

export default brandUnitService;
