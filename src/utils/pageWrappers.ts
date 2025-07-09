/**
 * Экспорт всех компонентов-оберток для страниц продуктов
 */
import { createPageWrapper } from './createPageWrapper';

export const ProductsPageWrapper = createPageWrapper('../pages/products/ProductsPage', '../pages/products/ProductsPageMobile');
export const CreateProductPageWrapper = createPageWrapper('../pages/products/CreateProductPage', '../pages/products/CreateProductPageMobile');

