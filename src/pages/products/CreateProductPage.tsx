/**
 * Страница создания нового товара
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CreateProduct from '../../components/products/CreateProduct';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// Временные значения для тестирования
const defaultTestValues = {
  brand_id: 1,   
  unit_id: 1,    
  category_id: 1
  // Следующую строку использовать только как комментарий, не как код: Используйте 1 для тестирования
};

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Определение типа устройства
  const { isMobile, isReady } = useDeviceDetect();
  
  // Перенаправление на мобильную версию
  useEffect(() => {
    if (isReady && isMobile) {
      navigate('/dashboard/products/create/mobile', { replace: true });
    }
  }, [isMobile, isReady, navigate]);
  
  // Установка заголовка страницы при монтировании компонента
  useEffect(() => {
    document.title = 'Создание товара | Valik.kz';
    
    // Возвращаем функцию очистки, которая сбросит заголовок при размонтировании
    return () => {
      document.title = 'Valik.kz';
    };
  }, []);

  // Если идет перенаправление, показываем загрузку
  if (isReady && isMobile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CreateProduct defaultValues={defaultTestValues} />
    </Layout>
  );
};

export default CreateProductPage; 