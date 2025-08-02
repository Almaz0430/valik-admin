/**
 * Страница редактирования товара.
 * Использует компонент CreateProduct в режиме редактирования.
 */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CreateProduct from '../../components/products/CreateProduct';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : undefined;

  useEffect(() => {
    document.title = 'Редактирование товара | Valik.kz';
    return () => {
      document.title = 'Valik.kz';
    };
  }, []);

  if (!productId) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-red-500">Ошибка: ID товара не указан.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CreateProduct isEditMode={true} productId={productId} />
    </Layout>
  );
};

export default EditProductPage; 