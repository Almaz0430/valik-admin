/**
 * Страница профиля пользователя
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { authService } from '../../features/auth';
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
            <h1 className="text-2xl font-bold text-gray-900">Настройки профиля</h1>
            <p className="mt-1 text-sm text-gray-500">
              Основная информация об аккаунте и выход из системы
            </p>
          </div>
        </div>

        {/* Основная информация об аккаунте */}
        <section className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Аккаунт</h2>
            <p className="mt-1 text-sm text-gray-500">
              Базовые данные, которые используются в системе
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Логин</p>
                <p className="text-xs text-gray-500">Используется для входа в панель</p>
              </div>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md min-w-[160px] text-right sm:text-left">
                {supplier?.login || 'Загрузка...'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">ID поставщика</p>
                <p className="text-xs text-gray-500">Технический идентификатор в системе</p>
              </div>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md min-w-[160px] text-right sm:text-left">
                {supplier?.id ?? '—'}
              </p>
            </div>
          </div>
        </section>

        {/* Безопасность и выход */}
        <section className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Сессия и безопасность</h2>
            <p className="mt-1 text-sm text-gray-500">
              Управление текущей сессией и выход из аккаунта
            </p>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-500">
              <p>Если вы пользуетесь общим устройством, выходите из аккаунта после работы.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              <span>Выйти из системы</span>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage; 
