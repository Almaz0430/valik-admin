/**
 * Страница-редирект для перенаправления на мобильную или десктопную версию создания товара
 */
import React from 'react';
import DeviceRedirect from '../../components/common/DeviceRedirect';

const CreateProductRedirectPage: React.FC = () => {
  return (
    <DeviceRedirect 
      mobileRedirectPath="/dashboard/products/create/mobile"
      desktopRedirectPath="/dashboard/products/create"
    />
  );
};

export default CreateProductRedirectPage; 