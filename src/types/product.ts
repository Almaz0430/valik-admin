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
 * Интерфейс товара
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  unit: ProductUnit;
  quantity: number;
  minOrderQuantity?: number;
  images: string[];
  status: ProductStatus;
  specifications?: Record<string, string>;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
  supplierId: string;
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