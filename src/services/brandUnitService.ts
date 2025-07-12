/**
 * Сервис для работы с брендами и единицами измерения
 */
import authService from './authService';

/**
 * Базовый URL API
 */
const API_URL = import.meta.env.VITE_NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : 'http://localhost:8080';

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
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const url = `${API_URL}/brands?${queryParams.toString()}`;
    console.log('Запрос списка брендов:', url);
    
    try {
      const response = await authService.fetchWithAuth(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении списка брендов:', response.status, errorText);
        throw new Error(`Ошибка при получении списка брендов: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные о брендах:', data);
      
      return {
        brands: data.brands || data,
        total: data.total || (data.brands ? data.brands.length : data.length),
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error) {
      console.error('Ошибка при запросе списка брендов:', error);
      throw error;
    }
  }

  /**
   * Получение информации о конкретном бренде
   */
  async getBrand(id: number): Promise<Brand> {
    console.log(`Запрос информации о бренде с ID ${id}`);
    
    const response = await authService.fetchWithAuth(`${API_URL}/brands/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка при получении бренда ${id}:`, response.status, errorText);
      throw new Error(`Бренд с ID ${id} не найден`);
    }
    
    try {
      const data = await response.json();
      console.log('Получены данные о бренде:', data);
      
      return data.brand || data;
    } catch (error) {
      console.error(`Ошибка при обработке данных бренда ${id}:`, error);
      throw new Error(`Ошибка при обработке данных бренда с ID ${id}`);
    }
  }

  /**
   * Создание нового бренда
   */
  async createBrand(brandData: { title: string }): Promise<Brand> {
    console.log('Отправка запроса на создание бренда:', brandData);
    
    const response = await authService.fetchWithAuth(`${API_URL}/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brandData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Ошибка при создании бренда:', error);
      throw new Error(error.message || 'Ошибка при создании бренда');
    }
    
    const data = await response.json();
    console.log('Бренд успешно создан:', data);
    return data.brand || data;
  }

  /**
   * Обновление существующего бренда
   */
  async updateBrand(id: number, brandData: { title: string }): Promise<Brand> {
    const response = await authService.fetchWithAuth(`${API_URL}/brands/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brandData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Ошибка при обновлении бренда с ID ${id}`);
    }
    
    const data = await response.json();
    return data.brand || data;
  }

  /**
   * Удаление бренда
   */
  async deleteBrand(id: number): Promise<void> {
    const response = await authService.fetchWithAuth(`${API_URL}/brands/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Ошибка при удалении бренда с ID ${id}`);
    }
  }

  /**
   * Получение списка единиц измерения с пагинацией и фильтрацией
   */
  async getUnits(params: QueryParams = { page: 1, limit: 10 }): Promise<UnitListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const url = `${API_URL}/units?${queryParams.toString()}`;
    console.log('Запрос списка единиц измерения:', url);
    
    try {
      const response = await authService.fetchWithAuth(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при получении списка единиц измерения:', response.status, errorText);
        throw new Error(`Ошибка при получении списка единиц измерения: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные о единицах измерения:', data);
      
      return {
        units: data.units || data,
        total: data.total || (data.units ? data.units.length : data.length),
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error) {
      console.error('Ошибка при запросе списка единиц измерения:', error);
      throw error;
    }
  }

  /**
   * Получение информации о конкретной единице измерения
   */
  async getUnit(id: number): Promise<Unit> {
    console.log(`Запрос информации о единице измерения с ID ${id}`);
    
    const response = await authService.fetchWithAuth(`${API_URL}/units/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка при получении единицы измерения ${id}:`, response.status, errorText);
      throw new Error(`Единица измерения с ID ${id} не найдена`);
    }
    
    try {
      const data = await response.json();
      console.log('Получены данные о единице измерения:', data);
      
      return data.unit || data;
    } catch (error) {
      console.error(`Ошибка при обработке данных единицы измерения ${id}:`, error);
      throw new Error(`Ошибка при обработке данных единицы измерения с ID ${id}`);
    }
  }

  /**
   * Создание новой единицы измерения
   */
  async createUnit(unitData: { title: string }): Promise<Unit> {
    console.log('Отправка запроса на создание единицы измерения:', unitData);
    
    const response = await authService.fetchWithAuth(`${API_URL}/units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unitData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Ошибка при создании единицы измерения:', error);
      throw new Error(error.message || 'Ошибка при создании единицы измерения');
    }
    
    const data = await response.json();
    console.log('Единица измерения успешно создана:', data);
    return data.unit || data;
  }

  /**
   * Обновление существующей единицы измерения
   */
  async updateUnit(id: number, unitData: { title: string }): Promise<Unit> {
    const response = await authService.fetchWithAuth(`${API_URL}/units/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unitData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Ошибка при обновлении единицы измерения с ID ${id}`);
    }
    
    const data = await response.json();
    return data.unit || data;
  }

  /**
   * Удаление единицы измерения
   */
  async deleteUnit(id: number): Promise<void> {
    const response = await authService.fetchWithAuth(`${API_URL}/units/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Ошибка при удалении единицы измерения с ID ${id}`);
    }
  }
}

export default new BrandUnitService(); 