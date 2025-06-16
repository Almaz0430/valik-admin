/**
 * Главная страница дашборда для поставщиков строительных товаров
 */
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ProductManagement from '../../components/dashboard/ProductManagement';
import OrderManagement from '../../components/dashboard/OrderManagement';
import RecentActivities from '../../components/dashboard/RecentActivities';
import HelpSection from '../../components/dashboard/HelpSection';
import Tooltip from '../../components/dashboard/Tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface Activity {
  id: number;
  action: string;
  product: string;
  time: string;
}

const DashboardPage = () => {
  const { supplier } = useAuth();
  
  // Имитация данных для дашборда
  const [stats] = useState({
    totalProducts: 157,
    activeProducts: 142,
    pendingProducts: 15,
    todaySales: 12,
    monthRevenue: 345600,
    popularCategory: 'Отделочные материалы'
  });

  // Имитация последних действий
  const [recentActivities] = useState<Activity[]>([
    { id: 1, action: 'Добавлен новый товар', product: 'Цемент М500', time: '15 минут назад' },
    { id: 2, action: 'Изменена цена', product: 'Кирпич облицовочный', time: '2 часа назад' },
    { id: 3, action: 'Обновлен остаток', product: 'Гипсокартон 12.5мм', time: '3 часа назад' },
    { id: 4, action: 'Товар продан', product: 'Утеплитель Rockwool', time: '5 часов назад' },
  ]);
  
  // Состояние для отображения подсказок
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Тексты подсказок
  const tooltipTexts: Record<string, string> = {
    products: 'Управляйте своим каталогом товаров: добавляйте новые товары, редактируйте существующие и отслеживайте их статус.',
    orders: 'Отслеживайте и управляйте заказами клиентов на разных этапах обработки.',
    activities: 'Здесь отображаются последние действия, выполненные в системе. Это помогает отслеживать изменения в вашем каталоге и заказах.'
  };

  const handleShowTooltip = (id: string) => {
    setActiveTooltip(id === activeTooltip ? null : id);
  };

  return (
    <Layout>
      {/* Заголовок страницы */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {supplier?.login || 'поставщик'}</h1>
        <p className="mt-1 text-sm text-gray-500">Панель управления товарами</p>
      </div>
      
      {/* Информация о пользователе */}
      {supplier && (
        <section className="mb-10">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-orange-50">
              <h2 className="text-lg font-medium text-gray-900">Информация о поставщике</h2>
              <p className="mt-1 text-sm text-gray-500">Основные данные вашего аккаунта</p>
            </div>
            <div className="border-t border-gray-200">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 p-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{supplier.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Логин</dt>
                  <dd className="mt-1 text-sm text-gray-900">{supplier.login}</dd>
                </div>
                
                {Object.entries(supplier)
                  .filter(([key]) => !['id', 'login'].includes(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </section>
      )}
      
      {/* Основной блок с карточками */}
      <div className="space-y-10">
        {/* Блок управления */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Управление</h2>
            <button 
              id={`tooltip-trigger-management`}
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setActiveTooltip(activeTooltip === 'management' ? null : 'management')}
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
            {activeTooltip === 'management' && (
              <Tooltip 
                id="management"
                text="Используйте эти карточки для быстрого доступа к основным функциям управления вашими товарами и заказами."
                isVisible={activeTooltip === 'management'}
                onClose={() => setActiveTooltip(null)}
              />
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <ProductManagement 
              pendingProducts={stats.pendingProducts}
              onShowTooltip={handleShowTooltip}
            />
            <OrderManagement 
              newOrders={3}
              processingOrders={5}
              completedOrders={12}
              onShowTooltip={handleShowTooltip}
            />
          </div>
        </section>

        {/* Последние активности */}
        <RecentActivities 
          activities={recentActivities}
          onShowTooltip={handleShowTooltip}
        />

        {/* Подсказка для новых пользователей */}
        <HelpSection 
          onOpenGuide={() => console.log('Открыть руководство')}
        />
      </div>
      
      {/* Отображение активной подсказки */}
      {activeTooltip && activeTooltip !== 'management' && (
        <Tooltip
          id={activeTooltip}
          text={tooltipTexts[activeTooltip] || ''}
          isVisible={!!activeTooltip}
          onClose={() => setActiveTooltip(null)}
        />
      )}
    </Layout>
  );
};

export default DashboardPage; 