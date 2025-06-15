/**
 * Страница профиля пользователя
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import authService from '../../services/authService';
import Layout from '../../components/layout/Layout';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Профиль | Valik.kz';
  }, []);
  
  const handleLogout = () => {
    // Здесь будет логика выхода из системы
    authService.logout();
    navigate('/login');
  };
  
  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Личный профиль</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-orange-50 rounded-full p-3 mr-4">
              <UserCircleIcon className="h-12 w-12 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">Ваш профиль</h2>
              <p className="text-gray-500">Управление учетной записью</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center bg-gray-50 rounded-lg p-3">
                <span className="text-gray-800">user@valik.kz</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Безопасность</h2>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors duration-300"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            <span>Выйти из системы</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage; 