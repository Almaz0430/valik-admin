/**
 * Боковая панель навигации
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  BookOpen,
  User
} from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  // const navigate = useNavigate();
  // const { logout } = useAuth();

  const navItems = [
    { name: 'Главная', path: '/dashboard', icon: Home },
    { name: 'Товары', path: '/dashboard/products', icon: Package },
    { name: 'Заказы', path: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Справочник', path: '/dashboard/attributes', icon: BookOpen },
    { name: 'Профиль', path: '/dashboard/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Ошибка при выходе:', error);
  //   }
  // };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
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
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${active
                    ? 'bg-orange-50/80 text-orange-700 shadow-sm ring-1 ring-inset ring-orange-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]'
                    }`}
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    }
                  }}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'
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