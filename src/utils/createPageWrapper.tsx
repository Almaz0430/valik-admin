/**
 * Утилита для создания компонентов-оберток с общей функциональностью
 */
import React from 'react';
import { lazy } from 'react';
import PageWrapper from '../pages/PageWrapper';

/**
 * Функция для создания компонента-обертки с автоматическим определением устройства
 * @param desktopPath
 * @param mobilePath 
 * @returns 
 */
export function createPageWrapper(
  desktopPath: string,
  mobilePath: string
): React.FC<Record<string, any>> {

  const DesktopComponent = lazy(() => import(
    /* webpackChunkName: "desktop" */
    /* @vite-ignore */
    `${desktopPath}`
  ));
  const MobileComponent = lazy(() => import(
    /* webpackChunkName: "mobile" */
    /* @vite-ignore */
    `${mobilePath}`
  ));

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