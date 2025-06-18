/**
 * Страница-редирект для перенаправления на мобильную или десктопную версию списка товаров
 */
import React from 'react';
import DeviceRedirect from '../../components/common/DeviceRedirect';

const ProductRedirectPage: React.FC = () => {
  return (
    <DeviceRedirect 
      mobileRedirectPath="/dashboard/products/mobile"
      desktopRedirectPath="/dashboard/products"
    />
  );
};

export default ProductRedirectPage; 