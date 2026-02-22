/**
 * Компонент управления товарами
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircleIcon,
  CubeIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface ProductManagementProps {
  pendingProducts: number;
  onShowTooltip?: (id: string) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  onShowTooltip
}) => {
  return (
    <div className="bg-white overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Товары</h3>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <CubeIcon className="h-6 w-6" />
            </div>
            <button
              id={`tooltip-trigger-products`}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => onShowTooltip?.('products')}
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 font-medium">Управление каталогом товаров</p>
      </div>
      <div className="p-5 space-y-3">
        <Link
          to="/dashboard/products/create"
          className="group w-full flex items-center justify-between px-5 py-3.5 text-base text-left text-slate-700 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          <span className="flex items-center font-medium">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100/50 text-emerald-600 mr-3 group-hover:scale-110 transition-transform">
              <PlusCircleIcon className="h-5 w-5" />
            </div>
            <span>Добавить новый товар</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/dashboard/products"
          className="group w-full flex items-center justify-between px-5 py-3.5 text-base text-left text-slate-700 bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          <span className="flex items-center font-medium">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100/50 text-orange-600 mr-3 group-hover:scale-110 transition-transform">
              <CubeIcon className="h-5 w-5" />
            </div>
            <span>Просмотр всех товаров</span>
          </span>
          <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default ProductManagement; 