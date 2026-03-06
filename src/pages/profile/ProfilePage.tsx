/**
 * Страница профиля пользователя
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { authService } from '../../features/auth';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContextBase';

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Настройки профиля</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Основная информация об аккаунте и выход из системы
            </p>
          </div>
        </div>

        {/* Основная информация об аккаунте */}
        <section className="bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl overflow-hidden box-border">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Аккаунт</h2>
            <p className="mt-1 text-sm text-slate-500">
              Базовые данные, которые используются в системе
            </p>
          </div>
          <div className="px-6 py-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-slate-100/80">
              <div>
                <p className="text-sm font-semibold text-slate-700">Email (Логин)</p>
                <p className="text-xs text-slate-500 mt-0.5">Используется для входа в панель</p>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center">
                <p className="text-base font-medium text-slate-900">
                  {supplier?.email || 'Загрузка...'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">ID поставщика</p>
                <p className="text-xs text-slate-500 mt-0.5">Технический идентификатор в системе</p>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center">
                <p className="text-base font-medium text-slate-900 font-mono">
                  {supplier?.id ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Безопасность и выход */}
        <section className="bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl overflow-hidden box-border">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Сессия и безопасность</h2>
            <p className="mt-1 text-sm text-slate-500">
              Управление текущей сессией и выход из аккаунта
            </p>
          </div>
          <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-600">
              <p>Если вы пользуетесь общим устройством, не забывайте выходить из аккаунта после завершения работы.</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-[0.98]"
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
