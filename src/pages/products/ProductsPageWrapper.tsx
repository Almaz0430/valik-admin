/**
 * Компонент-обертка для страницы продуктов
 */
import React, { Suspense, lazy } from 'react';
import MobileDetector from '../../components/common/MobileDetector';
import Layout from '../../components/layout/Layout';

// Ленивая загрузка компонентов для оптимизации
const ProductsPage = lazy(() => import('./ProductsPage'));
const ProductsPageMobile = lazy(() => import('./ProductsPageMobile'));

/**
 * Компонент-обертка для страницы продуктов, который автоматически
 * определяет тип устройства и отображает соответствующую версию страницы
 */
const ProductsPageWrapper: React.FC = () => {
  // Компонент загрузки для Suspense
  const LoadingFallback = () => (
    <Layout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    </Layout>
  );

  return (
    <MobileDetector
      mobileContent={
        <Suspense fallback={<LoadingFallback />}>
          <ProductsPageMobile />
        </Suspense>
      }
      desktopContent={
        <Suspense fallback={<LoadingFallback />}>
          <ProductsPage />
        </Suspense>
      }
    />
  );
};

export default ProductsPageWrapper; 