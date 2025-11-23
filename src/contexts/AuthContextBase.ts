import { createContext, useContext } from 'react';
import type { Supplier } from '../types/auth';

export interface AuthContextType {
  supplier: Supplier | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuthData: (supplier: Supplier, token: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

