// Центральная точка входа для фичи "products"
// Здесь собираем все, что относится к товарам:
// типы, сервисы, хуки и т.д.

export { default as productService } from './api/productService';
export * from '../../types/product';
export { useProductForm } from './hooks/useProductForm';
export { useProducts } from './hooks/useProducts';
