/**
 * Компонент-обертка для страницы создания товара
 */
import React, { Suspense, lazy } from 'react';
import MobileDetector from '../../components/common/MobileDetector';
import Layout from '../../components/layout/Layout';

// Ленивая загрузка компонентов для оптимизации
const CreateProductPage = lazy(() => import('./CreateProductPage'));
const CreateProductPageMobile = lazy(() => import('./CreateProductPageMobile'));

/**
 * Компонент-обертка для страницы создания товара, который автоматически
 * определяет тип устройства и отображает соответствующую версию страницы
 */
const CreateProductPageWrapper: React.FC = () => {
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
          <CreateProductPageMobile />
        </Suspense>
      }
      desktopContent={
        <Suspense fallback={<LoadingFallback />}>
          <CreateProductPage />
        </Suspense>
      }
    />
  );
};

export default CreateProductPageWrapper; 