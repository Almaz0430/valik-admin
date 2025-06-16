/**
 * Страница входа поставщика
 * Современный минималистичный дизайн с использованием Tailwind CSS
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  
  /**
   * Состояния для полей формы
   */
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await authService.login({
        login,
        password
      });
      
      // Сохраняем данные авторизации в контексте
      setAuthData(response.supplier, response.accessToken);
      
      // Перенаправляем на панель управления
      navigate('/dashboard');
      
    } catch (err) {
      // Обработка ошибок авторизации
      let errorMessage = 'Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.';
      
      if (err instanceof Error) {
        if (err.message.includes('Неверный логин или пароль') || 
            err.message.includes('Пользователь не найден')) {
          errorMessage = 'Неверный логин или пароль';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md relative">
        {/* Декоративные элементы */}
        <div className="fixed top-0 right-0 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="fixed bottom-0 left-0 w-60 h-60 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Карточка формы входа */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative z-10">
          {/* Верхняя часть с логотипом */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center pt-10 pb-12 px-8 rounded-b-[40px]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white p-2 mb-4 shadow-lg">
              <img src="/logo.svg" alt="Логотип Valik.kz" className="w-14 h-14 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">Личный кабинет</h1>
            <p className="mt-1 text-orange-100 text-sm">Войдите в систему для доступа к панели управления</p>
          </div>
          
          {/* Форма входа */}
          <div className="p-8 pt-2">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Поле Логин */}
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Логин
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="pl-10 block w-full border-0 rounded-lg focus:ring-orange-500 focus:outline-none shadow-sm py-3 bg-gray-50"
                    placeholder="Введите логин"
                    required
                    minLength={4}
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
              
              {/* Поле Пароль */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Пароль
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full border-0 rounded-lg focus:ring-orange-500 focus:outline-none shadow-sm py-3 bg-gray-50"
                    placeholder="Введите пароль"
                    required
                    minLength={8}
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
              
              {/* Кнопка входа */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all ${
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
                  'Войти в систему'
                )}
              </button>
            </form>
            
            {/* Футер с ссылкой на регистрацию */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Нет аккаунта? <a href="#" className="font-medium text-orange-600 hover:text-orange-500 transition-all">Зарегистрироваться</a></p>
            </div>
          </div>
        </div>
        
        {/* Футер */}
        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Valik.kz
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 