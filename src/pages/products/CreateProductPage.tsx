/**
 * Страница создания нового товара
 */
import React from 'react';
import Layout from '../../components/layout/Layout';
import CreateProduct from '../../components/products/CreateProduct';

const CreateProductPage: React.FC = () => {
  return (
    <Layout>
      <CreateProduct />
    </Layout>
  );
};

export default CreateProductPage; 