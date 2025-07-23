/**
 * Страница управления атрибутами (бренды и единицы измерения)
 */
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import BrandsPage from './BrandsPage';
import UnitsPage from './UnitsPage';
import CategoriesPage from './CategoriesPage';

type TabType = 'brands' | 'units' | 'categories';

const AttributesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('brands');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        {/* Заголовок страницы */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление атрибутами</h1>
            <p className="mt-1 text-sm text-gray-500">Управление брендами и единицами измерения для товаров</p>
          </div>
        </div>
        
        {/* Табы */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('brands')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'brands'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Бренды
            </button>
            <button
              onClick={() => handleTabChange('units')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'units'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Единицы измерения
            </button>
            <button
              onClick={() => handleTabChange('categories')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'categories'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Категории
            </button>
          </nav>
        </div>
        
        {/* Контент активного таба */}
        <div>
          {activeTab === 'brands' && <BrandsPage isStandalone={false} />}
          {activeTab === 'units' && <UnitsPage isStandalone={false} />}
          {activeTab === 'categories' && <CategoriesPage isStandalone={false} />}
        </div>
      </div>
    </Layout>
  );
};

export default AttributesPage; 