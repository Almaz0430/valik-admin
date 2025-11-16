/**
 * Универсальный компонент-обертка для страниц продуктов
 */
import React, { Suspense, type ComponentType } from 'react';
import MobileDetector from '@components/common/MobileDetector';
import Layout from '@components/layout/Layout';

interface PageWrapperProps {
  // Компоненты для разных устройств
  desktopComponent: ComponentType<Record<string, unknown>>;
  mobileComponent: ComponentType<Record<string, unknown>>;
  // Дополнительные пропсы для передачи компонентам
  componentProps?: Record<string, unknown>;
}

/**
 * Универсальный компонент-обертка для страниц, который автоматически
 * определяет тип устройства и отображает соответствующую версию страницы
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ 
  desktopComponent, 
  mobileComponent,
  componentProps = {} 
}) => {
  const DesktopComponent = desktopComponent;
  const MobileComponent = mobileComponent;

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
          <MobileComponent {...componentProps} />
        </Suspense>
      }
      desktopContent={
        <Suspense fallback={<LoadingFallback />}>
          <DesktopComponent {...componentProps} />
        </Suspense>
      }
    />
  );
};

export default PageWrapper; 
