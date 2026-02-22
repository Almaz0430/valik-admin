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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Управление атрибутами</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Управление брендами и единицами измерения для товаров</p>
          </div>
        </div>

        {/* Табы */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('brands')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'brands'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              Бренды
            </button>
            <button
              onClick={() => handleTabChange('units')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'units'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              Единицы измерения
            </button>
            <button
              onClick={() => handleTabChange('categories')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'categories'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
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