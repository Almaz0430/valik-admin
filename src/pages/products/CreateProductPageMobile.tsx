/**
 * Мобильная страница создания товара.
 * Переиспользует CreateProduct компонент (который сам адаптируется под мобилку).
 */
import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CreateProduct from '../../components/products/CreateProduct';

const CreateProductPageMobile: React.FC = () => {
  useEffect(() => {
    document.title = 'Создание товара | Valik.kz';
    return () => { document.title = 'Valik.kz'; };
  }, []);

  return (
    <Layout>
      <CreateProduct isEditMode={false} />
    </Layout>
  );
};

export default CreateProductPageMobile;
