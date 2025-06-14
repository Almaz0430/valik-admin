/**
 * Боковая панель навигации
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Главная', path: '/dashboard', icon: HomeIcon },
    { name: 'Товары', path: '/dashboard/products', icon: CubeIcon },
    { name: 'Заказы', path: '/dashboard/orders', icon: ShoppingCartIcon },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 w-56 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-center">
          <img src="/logo.svg" alt="Логотип" className="h-12" />
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md group ${
                  isActive(item.path)
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => {
                  if (onClose && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <Icon 
                  className={`mr-3 h-6 w-6 ${
                    isActive(item.path) ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-medium text-gray-700">user@valik.kz</p>
            </div>
            <button 
              className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
              onClick={() => console.log('Выход из системы')}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 