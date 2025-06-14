/**
 * Основной макет приложения
 */
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Мобильная кнопка открытия/закрытия сайдбара */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          className="p-2 rounded-md bg-white shadow-md text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Затемнение фона при открытом сайдбаре на мобильных */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Сайдбар */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="lg:pl-56">
        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 