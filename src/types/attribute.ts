/**
 * Типы для атрибутов товаров: бренды, категории, единицы измерения
 */

export interface Brand {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Unit {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  sub_categories?: SubCategory[]; // Подкатегории
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

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface AttributeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

