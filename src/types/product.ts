/**
 * Типы для товаров строительной сферы
 */

/**
 * Категория товара
 */
export enum ProductCategory {
  BUILDING_MATERIALS = 'building_materials',
  TOOLS = 'tools',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  HARDWARE = 'hardware',
  PAINT = 'paint',
  FLOORING = 'flooring',
  ROOFING = 'roofing',
  LUMBER = 'lumber',
  OTHER = 'other'
}

/**
 * Единица измерения товара
 */
export enum ProductUnit {
  PIECE = 'piece',
  KILOGRAM = 'kg',
  METER = 'm',
  SQUARE_METER = 'm2',
  CUBIC_METER = 'm3',
  LITER = 'l',
  SET = 'set',
  ROLL = 'roll',
  PACK = 'pack'
}

/**
 * Статус товара
 */
export enum ProductStatus {
  ACTIVE = 'active',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  COMING_SOON = 'coming_soon'
}

/**
 * Типы для работы с товарами
 */

/**
 * Тип данных товара
 */
export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  brand_id?: number;
  brand_name?: string;
  unit_id?: number;
  unit_name?: string;
  category_id?: number;
  category_name?: string;
  article?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  depth?: number;
  status?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
  supplier_id?: number;
}

/**
 * Интерфейс для создания нового товара
 */
export interface CreateProductDTO {
  title: string;
  description?: string;
  brand_id?: number;
  unit_id?: number;
  category_id?: number;
  article?: number;
  price: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  depth?: number;
}

/**
 * Интерфейс для обновления товара
 */
export interface UpdateProductDTO {
  title?: string;
  description?: string;
  brand_id?: number;
  unit_id?: number;
  category_id?: number;
  article?: number;
  price?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  depth?: number;
  status?: string;
}

/**
 * Интерфейс для запроса списка товаров
 */
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  status?: string;
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
 * Интерфейс для ответа с конкретным товаром
 */
export interface ProductResponse {
  product: Product;
}

/**
 * Данные для создания товара
 */
export type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Данные для обновления товара
 */
export type UpdateProductData = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Параметры для фильтрации товаров
 */
export interface ProductFilterParams {
  search?: string;
  category?: ProductCategory;
  subcategory?: string;
  brand?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  supplierId?: string;
}

/**
 * Параметры для сортировки товаров
 */
export interface ProductSortParams {
  field: keyof Product;
  direction: 'asc' | 'desc';
} 