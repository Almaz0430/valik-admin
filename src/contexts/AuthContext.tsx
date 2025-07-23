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
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // При инициализации проверяем наличие токена и данных пользователя в localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      const storedSupplier = localStorage.getItem('supplier');

      if (token && storedSupplier) {
        setAccessToken(token);
        setSupplier(JSON.parse(storedSupplier));
      }
    } catch (error) {
      console.error('Ошибка при инициализации авторизации:', error);
      // При ошибке очищаем состояние
      setAccessToken(null);
      setSupplier(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('supplier');
    } finally {
      // Помечаем инициализацию как завершенную
      setIsInitialized(true);
    }
  }, []);

  const setAuthData = (supplier: Supplier, token: string) => {
    setSupplier(supplier);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('supplier', JSON.stringify(supplier));
  };

  const logout = async () => {
    await authService.logout();
    setSupplier(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('supplier');
  };

  const value = {
    supplier,
    accessToken,
    isAuthenticated: !!accessToken,
    setAuthData,
    logout,
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