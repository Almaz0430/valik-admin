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
  BookOpenIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Главная', path: '/dashboard', icon: HomeIcon },
    { name: 'Товары', path: '/dashboard/products', icon: CubeIcon },
    { name: 'Заказы', path: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Справочник', path: '/dashboard/attributes', icon: BookOpenIcon },
    { name: 'Профиль', path: '/dashboard/profile', icon: UserCircleIcon },
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
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-neutral-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Логотип */}
        <div className="p-6 flex justify-center items-center">
          <img src="/logo.svg" alt="Логотип" className="h-16 opacity-90 hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Навигация */}
        <div className="px-4 py-6">          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                    active
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-neutral-100 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    }
                  }}
                >
                  <Icon 
                    className={`mr-3 h-[18px] w-[18px] ${
                      active ? 'text-orange-500' : 'text-gray-400'
                    }`} 
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 