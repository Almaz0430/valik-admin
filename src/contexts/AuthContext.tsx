import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { Supplier } from '../types/auth';

interface AuthContextType {
  supplier: Supplier | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuthData: (supplier: Supplier, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // При инициализации проверяем наличие токена
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      // Получаем информацию о поставщике при наличии токена
      authService.getCurrentUser()
        .then(userData => {
          if (userData) {
            setSupplier(userData);
            setAccessToken(token);
          }
        })
        .catch(() => authService.logout());
    }
  }, []);

  const setAuthData = (supplier: Supplier, token: string) => {
    setSupplier(supplier);
    setAccessToken(token);
  };

  const logout = () => {
    authService.logout();
    setSupplier(null);
    setAccessToken(null);
  };

  const value = {
    supplier,
    accessToken,
    isAuthenticated: !!accessToken,
    setAuthData,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 