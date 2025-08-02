/**
 * Страница создания нового товара
 */
import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CreateProduct from '../../components/products/CreateProduct';

const CreateProductPage: React.FC = () => {
  // Установка заголовка страницы при монтировании компонента
  useEffect(() => {
    document.title = 'Создание товара | Valik.kz';
    
    // Возвращаем функцию очистки, которая сбросит заголовок при размонтировании
    return () => {
      document.title = 'Valik.kz';
    };
  }, []);

  return (
    <Layout>
      <CreateProduct />
    </Layout>
  );
};

export default CreateProductPage; 