/**
 * Сервис для работы с брендами и единицами измерения
 */
import { api } from '../utils/axiosConfig';

/**
 * Интерфейсы для брендов и единиц измерения
 */
export interface Brand {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface Unit {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface BrandListResponse {
  brands: Brand[];
  total: number;
  page: number;
  limit: number;
}

export interface UnitListResponse {
  units: Unit[];
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
 * Класс для работы с API брендов и единиц измерения
 */
class BrandUnitService {
  /**
   * Получение списка брендов с пагинацией и фильтрацией
   */
  async getBrands(params: QueryParams = { page: 1, limit: 10 }): Promise<BrandListResponse> {
    try {
      const response = await api.get<Brand[] | { brands: Brand[]; total: number }>('/brands', { params });
      const data = response.data;
      
      const brands = Array.isArray(data) ? data : data.brands;
      const total = Array.isArray(data) ? data.length : data.total;

      return {
        brands: brands || [],
        total: total || 0,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error: any) {
      console.error('Ошибка при запросе списка брендов:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при получении списка брендов');
    }
  }

  /**
   * Получение информации о конкретном бренде
   */
  async getBrand(id: number): Promise<Brand> {
    try {
      const response = await api.get<Brand | { brand: Brand }>(`/brands/${id}`);
      const data = response.data;
      return 'brand' in data && data.brand ? data.brand : data as Brand;
    } catch (error: any) {
      console.error(`Ошибка при получении бренда ${id}:`, error);
      throw new Error(error.response?.data?.message || `Бренд с ID ${id} не найден`);
    }
  }

  /**
   * Создание нового бренда
   */
  async createBrand(brandData: { title: string }): Promise<Brand> {
    try {
      const response = await api.post<Brand | { brand: Brand }>('/brands', brandData);
      const data = response.data;
      return 'brand' in data && data.brand ? data.brand : data as Brand;
    } catch (error: any) {
      console.error('Ошибка при создании бренда:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при создании бренда');
    }
  }

  /**
   * Обновление существующего бренда
   */
  async updateBrand(id: number, brandData: { title: string }): Promise<Brand> {
    try {
      const response = await api.patch<Brand | { brand: Brand }>(`/brands/${id}`, brandData);
      const data = response.data;
      return 'brand' in data && data.brand ? data.brand : data as Brand;
    } catch (error: any) {
      console.error(`Ошибка при обновлении бренда ${id}:`, error);
      throw new Error(error.response?.data?.message || `Ошибка при обновлении бренда с ID ${id}`);
    }
  }

  /**
   * Удаление бренда
   */
  async deleteBrand(id: number): Promise<void> {
    try {
      await api.delete(`/brands/${id}`);
    } catch (error: any) {
      console.error(`Ошибка при удалении бренда ${id}:`, error);
      throw new Error(error.response?.data?.message || `Ошибка при удалении бренда с ID ${id}`);
    }
  }

  /**
   * Получение списка единиц измерения с пагинацией и фильтрацией
   */
  async getUnits(params: QueryParams = { page: 1, limit: 10 }): Promise<UnitListResponse> {
    try {
      const response = await api.get<Unit[] | { units: Unit[]; total: number }>('/units', { params });
      const data = response.data;
      
      const units = Array.isArray(data) ? data : data.units;
      const total = Array.isArray(data) ? data.length : data.total;
      
      return {
        units: units || [],
        total: total || 0,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error: any) {
      console.error('Ошибка при запросе списка единиц измерения:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при получении списка единиц измерения');
    }
  }

  /**
   * Получение информации о конкретной единице измерения
   */
  async getUnit(id: number): Promise<Unit> {
    try {
      const response = await api.get<Unit | { unit: Unit }>(`/units/${id}`);
      const data = response.data;
      return 'unit' in data && data.unit ? data.unit : data as Unit;
    } catch (error: any) {
      console.error(`Ошибка при получении единицы измерения ${id}:`, error);
      throw new Error(error.response?.data?.message || `Единица измерения с ID ${id} не найдена`);
    }
  }

  /**
   * Создание новой единицы измерения
   */
  async createUnit(unitData: { title: string }): Promise<Unit> {
    try {
      const response = await api.post<Unit | { unit: Unit }>('/units', unitData);
      const data = response.data;
      return 'unit' in data && data.unit ? data.unit : data as Unit;
    } catch (error: any) {
      console.error('Ошибка при создании единицы измерения:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при создании единицы измерения');
    }
  }

  /**
   * Обновление существующей единицы измерения
   */
  async updateUnit(id: number, unitData: { title: string }): Promise<Unit> {
    try {
      const response = await api.patch<Unit | { unit: Unit }>(`/units/${id}`, unitData);
      const data = response.data;
      return 'unit' in data && data.unit ? data.unit : data as Unit;
    } catch (error: any) {
      console.error(`Ошибка при обновлении единицы измерения ${id}:`, error);
      throw new Error(error.response?.data?.message || `Ошибка при обновлении единицы измерения с ID ${id}`);
    }
  }

  /**
   * Удаление единицы измерения
   */
  async deleteUnit(id: number): Promise<void> {
    try {
      await api.delete(`/units/${id}`);
    } catch (error: any) {
      console.error(`Ошибка при удалении единицы измерения ${id}:`, error);
      throw new Error(error.response?.data?.message || `Ошибка при удалении единицы измерения с ID ${id}`);
    }
  }
}

export default new BrandUnitService(); 