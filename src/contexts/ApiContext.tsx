// providers/ApiProvider.tsx
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Интерсепторы теперь настраиваются глобально в utils/axiosConfig.ts
    // Это предотвращает двойное срабатывание и упрощает код
  }, [navigate]);

  return <>{children}</>;
};
