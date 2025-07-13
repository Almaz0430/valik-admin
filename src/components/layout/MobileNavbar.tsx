/**
 * Нижняя навигационная панель для мобильных устройств
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingCartIcon,
  UserCircleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Главная', path: '/dashboard', icon: HomeIcon },
    { name: 'Товары', path: '/dashboard/products', icon: CubeIcon },
    { name: 'Справочник', path: '/dashboard/attributes', icon: BookOpenIcon },
    { name: 'Заказы', path: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Профиль', path: '/dashboard/profile', icon: UserCircleIcon },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-30">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                active ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'text-orange-500' : 'text-gray-500'}`} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar; 