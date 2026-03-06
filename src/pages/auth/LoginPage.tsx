/**
 * Страница входа поставщика
 * Современный минималистичный дизайн с использованием Tailwind CSS
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../features/auth';
import { useAuth } from '../../contexts/AuthContextBase';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  /**
   * Состояния для полей формы
   */
  const [email, setEmail] = useState('');
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
        email,
        password
      });

      const supplierData = {
        id: response.id,
        email: response.email,
        name: response.name,
      };

      // Сохраняем данные авторизации в контексте
      setAuthData(supplierData, response.access);

      // Перенаправляем на панель управления
      navigate('/dashboard');

    } catch (err) {
      let errorMessage = 'Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.';

      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center font-sans relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-orange-100/40 via-orange-50/20 to-transparent -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-[440px]">
          {/* Логотип и заголовок */}
          <div className="text-center mb-10">
            <img src="/logo.svg" alt="Логотип Valik.kz" className="h-[4.5rem] w-auto mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Добро пожаловать</h1>
            <p className="text-base text-slate-500 font-medium">Войдите для доступа к панели управления</p>
          </div>

          {/* Карточка формы */}
          <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200/60 rounded-3xl p-8 sm:p-10">
            {error && (
              <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-2xl text-sm flex items-center shadow-sm">
                <svg className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Поле Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white shadow-sm focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Введите email"
                  required
                />
              </div>

              {/* Поле Пароль */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Пароль
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3.5 bg-white shadow-sm focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Введите пароль"
                  required
                  minLength={8}
                />
              </div>

              {/* Кнопка входа */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all active:scale-[0.98] mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Вход в систему...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>

            {/* Футер с ссылкой на регистрацию */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Футер с копирайтом */}
      <div className="w-full py-6 mt-auto">
        <p className="text-center text-sm font-medium text-slate-400">
          © {new Date().getFullYear()} Valik.kz. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 
