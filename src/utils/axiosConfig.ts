import axios from 'axios';
import env from '../config/env';
import authService from '../features/auth/api/authService';

const baseUrl = env.API_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Request interceptor для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок токена
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и мы еще не пытались обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await authService.refreshToken();

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если обновить токен не удалось, редиректим на логин
        await authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
