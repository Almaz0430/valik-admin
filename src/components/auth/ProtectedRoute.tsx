import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextBase';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Компонент для защиты маршрутов от неавторизованного доступа
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const hasToken =
          typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

        if (isAuthenticated && hasToken) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error('Ошибка при проверке доступа:', error);
        setIsAllowed(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated]);

  if (isChecking) {
    // Показываем индикатор загрузки при проверке
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return isAllowed ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute; 
