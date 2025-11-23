/**
 * Страница регистрации поставщика
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../features/auth';
import { useAuth } from '../../contexts/AuthContextBase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  
  /**
   * Состояния для полей формы
   */
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await authService.register({
        login,
        password
      });
      
      // Сохраняем данные авторизации в контексте
      setAuthData(response.supplier, response.accessToken);
      
      // Перенаправляем на панель управления
      navigate('/dashboard');
      
    } catch (err) {
      // Обработка ошибок регистрации
      let errorMessage = 'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Логотип */}
      <div className="w-full bg-white py-8 flex justify-center border-b border-gray-100">
        <img src="/logo.svg" alt="Логотип Valik.kz" className="h-16" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full p-4">
        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Регистрация</h1>
        <p className="text-gray-500 text-sm mb-8">Создайте аккаунт для доступа к панели управления</p>
        
        {/* Форма регистрации */}
        <div className="w-full max-w-md">
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
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Поле Логин */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1.5">
                Логин
              </label>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:border-gray-300 focus:ring-0 focus:outline-none transition-colors"
                placeholder="Придумайте логин"
                required
                minLength={4}
              />
            </div>
            
            {/* Поле Пароль */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:border-gray-300 focus:ring-0 focus:outline-none transition-colors"
                placeholder="Придумайте пароль"
                required
                minLength={8}
              />
            </div>
            
            {/* Поле подтверждения пароля */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Подтверждение пароля
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:border-gray-300 focus:ring-0 focus:outline-none transition-colors"
                placeholder="Повторите пароль"
                required
                minLength={8}
              />
            </div>
            
            {/* Кнопка регистрации */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Регистрация...
                </>
              ) : (
                'Создать аккаунт'
              )}
            </button>
          </form>
          
          {/* Футер с ссылкой на вход */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Уже есть аккаунт? <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 transition-all">Войти</Link></p>
          </div>
        </div>
      </div>
      
      {/* Футер с копирайтом */}
      <div className="w-full py-4 border-t border-gray-100">
        <p className="text-center text-sm text-gray-400">
          © 2025 Valik.kz
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 
