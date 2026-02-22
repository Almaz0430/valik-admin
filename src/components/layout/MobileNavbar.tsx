/**
 * Нижняя навигационная панель для мобильных устройств
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  User,
  BookOpen
} from 'lucide-react';

const MobileNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Главная', path: '/dashboard', icon: Home },
    { name: 'Товары', path: '/dashboard/products', icon: Package },
    { name: 'Справочники', path: '/dashboard/attributes', icon: BookOpen },
    { name: 'Заказы', path: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Профиль', path: '/dashboard/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200/50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:hidden z-[90] pb-safe">
      <div className="flex justify-around items-center h-16 sm:h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full relative group transition-colors ${active ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {active && (
                <span className="absolute top-0 w-8 h-1 bg-orange-500 rounded-b-full shadow-[0_2px_8px_-2px_rgba(249,115,22,0.6)]"></span>
              )}
              <div className={`p-1.5 rounded-xl mb-1 transition-all ${active ? 'bg-orange-50 text-orange-600' : 'group-hover:bg-slate-100'}`}>
                <Icon strokeWidth={active ? 2.5 : 2} className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${active ? 'scale-110' : 'scale-100'}`} />
              </div>
              <span className={`text-[10px] sm:text-xs font-medium transition-all ${active ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;