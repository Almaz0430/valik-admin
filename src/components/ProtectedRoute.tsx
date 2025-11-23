import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextBase';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Перенаправляем на страницу входа, если пользователь не авторизован
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован, возвращаем содержимое маршрута
  return <>{children}</>;
};

export default ProtectedRoute; 
