// providers/ApiProvider.tsx
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/axiosConfig';
import authService from '@/services/authService';

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 400) {
          // TODO: show user-friendly notification
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const accessToken = await authService.refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError: any) {
            if (refreshError?.response?.status === 401) {
              await authService.logout();
              // TODO: show session expired message
            }
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.status === 500) {
          navigate('/');
          // TODO: show server error notification
        }

        return Promise.reject(error);
      }
    );

    // Очистка интерсепторов при размонтировании
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return <>{children}</>;
};
