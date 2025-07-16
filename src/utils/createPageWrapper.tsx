/**
 * Утилита для создания компонентов-оберток с общей функциональностью
 */
import React, { lazy } from 'react';
import PageWrapper from '../pages/PageWrapper';

const desktopComponentsMap: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  ProductsPage: () => import('../pages/products/ProductsPage'),
  CreateProductPage: () => import('../pages/products/CreateProductPage'),
};

const mobileComponentsMap: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  ProductsPageMobile: () => import('../pages/products/ProductsPageMobile'),
  CreateProductPageMobile: () => import('../pages/products/CreateProductPageMobile'),
};

/**
 * Функция для создания компонента-обертки с автоматическим определением устройства
 * @param desktopPath
 * @param mobilePath 
 * @returns 
 */
export function createPageWrapper(
  desktopKey: keyof typeof desktopComponentsMap,
  mobileKey: keyof typeof mobileComponentsMap
): React.FC<Record<string, any>> {
  const DesktopComponent = lazy(desktopComponentsMap[desktopKey]);
  const MobileComponent = lazy(mobileComponentsMap[mobileKey]);

  const WrappedComponent: React.FC<Record<string, any>> = (props) => {
    return (
      <PageWrapper 
        desktopComponent={DesktopComponent} 
        mobileComponent={MobileComponent} 
        componentProps={props} 
      />
    );
  };

  return WrappedComponent;
}

// Пример использования:
// export const ProductsPageWrapper = createPageWrapper('./ProductsPage', './ProductsPageMobile'); 