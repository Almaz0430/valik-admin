/**
 * Боковая панель навигации
 */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supplier, logout } = useAuth();
  
  const navItems = [
    { name: 'Главная', path: '/dashboard', icon: HomeIcon },
    { name: 'Товары', path: '/dashboard/products', icon: CubeIcon },
    { name: 'Заказы', path: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Справочник', path: '/dashboard/attributes', icon: BookOpenIcon },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Логотип */}
        <div className="p-5 border-b border-gray-100 flex justify-center items-center">
          <img src="/logo.svg" alt="Логотип" className="h-14 transition-all duration-300 hover:scale-110" />
        </div>
        
        {/* Навигация */}
        <div className="px-3 py-6">
          <h3 className="px-4 text-xs font-semibold text-orange-800 uppercase tracking-wider mb-3">
            Навигация
          </h3>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                  }`}
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    }
                  }}
                >
                  <Icon 
                    className={`mr-3 h-5 w-5 ${
                      active ? 'text-white' : 'text-orange-500 group-hover:text-orange-600'
                    }`} 
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Разделитель */}
        <div className="flex-1"></div>
        
        {/* Профиль пользователя */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="mb-3">
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 mr-1">Логин:</span>
              <span className="text-sm font-medium text-gray-800">{supplier ? supplier.login : ''}</span>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 