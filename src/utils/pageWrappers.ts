/**
 * Экспорт всех компонентов-оберток для страниц продуктов
 */
import { createPageWrapper } from './createPageWrapper';

export const ProductsPageWrapper = createPageWrapper('ProductsPage', 'ProductsPageMobile');
export const CreateProductPageWrapper = createPageWrapper('CreateProductPage', 'CreateProductPageMobile');

