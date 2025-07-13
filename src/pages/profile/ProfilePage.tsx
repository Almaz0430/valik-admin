/**
 * Страница профиля пользователя
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import authService from '../../services/authService';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { supplier } = useAuth();
  
  useEffect(() => {
    document.title = 'Профиль | Valik.kz';
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
            <p className="mt-1 text-sm text-gray-500">Управление учетной записью</p>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-6 py-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 shadow-sm mr-5">
                <UserCircleIcon className="h-14 w-14 text-orange-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Добро пожаловать,</div>
                <h2 className="text-xl font-medium text-gray-800">{supplier?.login || 'Загрузка...'}</h2>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Логин</div>
                <div className="text-base text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{supplier?.login || 'Загрузка...'}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Статус</div>
                <div className="text-base text-gray-800 bg-gray-50 px-4 py-3 rounded-lg flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Активный
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Безопасность</h2>
          </div>
          
          <div className="px-6 py-6">
            <button 
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              <span>Выйти из системы</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage; 