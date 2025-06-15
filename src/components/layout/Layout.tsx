/**
 * Основной макет приложения
 */
import React from 'react';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Сайдбар (только на десктопе) */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} />
      </div>
      
      {/* Нижняя навигационная панель (только на мобильных) */}
      <MobileNavbar />
      
      {/* Основной контент */}
      <div className="lg:pl-64 pb-16 lg:pb-0">
        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 