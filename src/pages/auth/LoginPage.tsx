/**
 * Страница входа поставщика
 * Использует shadcn/ui компоненты
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../features/auth';
import { useAuth } from '../../contexts/AuthContextBase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      if (response.access) {
        setAuthData(supplierData, response.access);
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 flex flex-col p-4 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />

      {/* Логотип */}
      <div className="absolute top-6 left-6 z-10">
        <img src="/logo.svg" alt="Valik.kz" className="h-16 w-auto" />
      </div>

      <div className="w-full max-w-md relative z-10 mx-auto my-auto">

        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>Введите ваши учетные данные</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Вход в систему...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Футер */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()} Valik.kz. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
