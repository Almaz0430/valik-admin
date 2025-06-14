/**
 * Страница входа в личный кабинет
 * Современный дизайн с использованием Tailwind CSS
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import type { AuthResponse } from '../../types/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  
  /**
   * Состояния для полей формы
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authData, setAuthData] = useState<AuthResponse | null>(null);

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await authService.login({
        email,
        password,
        rememberMe: false
      });
      
      setAuthData(response);
      
      // Принудительно перезагружаем страницу для обновления состояния аутентификации
      window.location.href = '/dashboard';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Карточка формы входа */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Верхняя часть с логотипом и заголовком */}
          <div className="p-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white p-2 mb-4">
              <img src="/logo.svg" alt="Логотип Valik.kz" className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold">Личный кабинет</h1>
            <p className="mt-2 text-orange-100">Войдите, чтобы получить доступ</p>
          </div>
          
          {/* Форма входа */}
          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Поле Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              {/* Поле Пароль */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              {/* Кнопка входа */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
            
            {/* Футер */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Нет аккаунта? <a href="#" className="font-medium text-orange-600 hover:text-orange-800">Зарегистрироваться</a></p>
            </div>
          </div>
        </div>
        
        {/* Футер */}
        <p className="mt-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Valik.kz
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 