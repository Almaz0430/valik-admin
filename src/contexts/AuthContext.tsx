import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { Supplier } from '../types/auth';

interface AuthContextType {
  supplier: Supplier | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuthData: (supplier: Supplier, token: string) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // При инициализации проверяем наличие токена
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Пытаемся получить информацию о поставщике с текущим токеном
          // без принудительного обновления токена
          const userData = await authService.getCurrentUser();
          if (userData) {
            setSupplier(userData);
            setAccessToken(token);
          } else {
            // Если не удалось получить данные, очищаем состояние
            await authService.logout();
            setAccessToken(null);
            setSupplier(null);
          }
        } else {
          // Если токен отсутствует, состояние и так пустое
        }
      } catch (error) {
        console.error('Ошибка при инициализации авторизации:', error);
        // При ошибке очищаем состояние
        await authService.logout();
        setAccessToken(null);
        setSupplier(null);
      } finally {
        // Помечаем инициализацию как завершенную
        setIsInitialized(true);
      }
    };
    
    initAuth();
  }, []);

  const setAuthData = (supplier: Supplier, token: string) => {
    setSupplier(supplier);
    setAccessToken(token);
  };

  const logout = async () => {
    await authService.logout();
    setSupplier(null);
    setAccessToken(null);
  };
  
  const refreshToken = async (): Promise<string> => {
    try {
      const newToken = await authService.refreshToken();
      setAccessToken(newToken);
      return newToken;
    } catch (error) {
      // Если не удалось обновить токен, очищаем состояние
      setAccessToken(null);
      setSupplier(null);
      throw error;
    }
  };

  const value = {
    supplier,
    accessToken,
    isAuthenticated: !!accessToken,
    setAuthData,
    logout,
    refreshToken
  };

  // Если инициализация не завершена, можно показать загрузку
  if (!isInitialized) {
    return null; // или компонент загрузки
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 