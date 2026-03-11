/**
 * Типы для товаров — соответствуют реальному Django бэкенду
 */

/**
 * Город
 */
export interface City {
  id: number;
  name: string;
}

/**
 * Категория (содержит список подкатегорий)
 */
export interface Category {
  id: number;
  name: string;
  sub_categories: SubCategory[];
}

/**
 * Подкатегория
 */
export interface SubCategory {
  id: number;
  name: string;
  category: number;
}

/**
 * Региональные настройки товара
 */
export interface ProductRegionSettings {
  id: number;
  city: number;
  price: string;
  price_shop: string;
  commission: string;
  measurement_type: string | null;
  quantity: number;
  is_active: boolean;
}

/**
 * Товар (OPTProduct) — реальные поля бэкенда
 */
export interface Product {
  id: number;
  vendor: number;
  sub_category: SubCategory | number | null;
  brand?: { id: number; name: string } | null;
  unit?: { id: number; name: string } | null;
  name: string;
  description?: string | null;
  image?: string | null;
  article?: number | null;
  length?: string | number | null;
  width?: string | number | null;
  height?: string | number | null;
  weight?: string | number | null;
  price: string | number;
  active: boolean;
  created_at?: string | null;
  region_settings?: ProductRegionSettings[];
}

/**
 * Интерфейс для создания нового товара
 */
export interface CreateProductDTO {
  vendor: number;
  sub_category: number | null;
  brand?: number | null;
  unit?: number | null;
  name: string;
  description?: string;
  image?: File;
  article?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  weight?: number | null;
  price?: number;
}

/**
 * Интерфейс для запроса списка товаров
 */
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Интерфейс для ответа со списком товаров
 */
export interface ProductListResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}

/**
 * Ошибка импорта строки
 */
export interface ImportProductError {
  row: number;
  article?: string;
  title?: string;
  errors?: string[];
}

/**
 * Ответ API при импорте товаров
 */
export interface ImportProductsResponse {
  message: string;
  import_id?: number;
  imported?: number;
  skipped?: number;
  status: 'success' | 'partial' | 'failed';
  total_rows?: number;
  processed_rows?: number;
  failed_rows?: number;
  created_products?: number;
  errors?: ImportProductError[];
  error?: string;
}
