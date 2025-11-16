/**
 * Утилита для создания компонентов-оберток с общей функциональностью
 */
import React, { lazy, type ComponentType } from 'react';
import PageWrapper from '../components/layout/PageWrapper';

type LazyComponent = () => Promise<{ default: ComponentType<Record<string, unknown>> }>;

const desktopComponentsMap: Record<string, LazyComponent> = {
  ProductsPage: () => import('../pages/products/ProductsPage'),
  CreateProductPage: () => import('../pages/products/CreateProductPage'),
};

const mobileComponentsMap: Record<string, LazyComponent> = {
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
): React.FC<Record<string, unknown>> {
  const DesktopComponent = lazy(desktopComponentsMap[desktopKey]);
  const MobileComponent = lazy(mobileComponentsMap[mobileKey]);

  const WrappedComponent: React.FC<Record<string, unknown>> = (props) => {
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
