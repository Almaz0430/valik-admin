import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../features/auth';
import type { Supplier } from '../types/auth';
import { AuthContext } from './AuthContextBase';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // При инициализации пытаемся восстановить сессию через refresh токен (куки)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const vendorId = localStorage.getItem('vendorId');
        if (vendorId) {
          // Пытаемся обновить токен доступа
          const token = await authService.refreshToken();
          const currentSupplier = await authService.getCurrentUser();

          if (token && currentSupplier) {
            setAccessToken(token);
            setSupplier(currentSupplier);
          }
        }
      } catch (error) {
        console.error('Ошибка при восстановлении сессии:', error);
        // При ошибке очищаем всё
        setAccessToken(null);
        setSupplier(null);
        localStorage.removeItem('vendorId');
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const setAuthData = (supplier: Supplier, token: string) => {
    setSupplier(supplier);
    setAccessToken(token);
    // supplier инфо можно кэшировать в localStorage для быстрой отрисовки,
    // но токен теперь строго в памяти.
    localStorage.setItem('supplier', JSON.stringify(supplier));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setSupplier(null);
      setAccessToken(null);
      localStorage.removeItem('vendorId');
      localStorage.removeItem('supplier');
    }
  };

  const value = {
    supplier,
    accessToken,
    isAuthenticated: !!accessToken,
    setAuthData,
    logout,
  };

  // Если инициализация не завершена, показываем загрузку
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
