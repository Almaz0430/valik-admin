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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Логотип */}
        <div className="p-6 flex justify-center items-center">
          <img src="/logo.svg" alt="Valik.kz" className="h-14 w-auto" />
        </div>

        <Separator className="mx-4" />

        {/* Навигация */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                )}
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <Separator className="mx-4" />

        {/* Футер */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Valik.kz
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 