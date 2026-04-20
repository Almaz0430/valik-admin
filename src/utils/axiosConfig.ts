import axios from 'axios';
import env from '../config/env';
import { getAccessToken, setAccessToken } from './tokenStorage';

const baseUrl = env.API_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Late binding: authService регистрирует свою функцию refresh здесь,
// чтобы избежать циклической зависимости при импорте.
let _refreshTokenFn: (() => Promise<string>) | null = null;

export const registerRefreshTokenFn = (fn: () => Promise<string>) => {
  _refreshTokenFn = fn;
};

// Очищаем состояние без API вызова и редиректим на логин
const forceLogout = () => {
  setAccessToken(null);
  localStorage.removeItem('vendorId');
  localStorage.removeItem('supplier');
  window.location.href = '/login';
};

// Request interceptor для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
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

    const isRefreshEndpoint = originalRequest.url?.includes('/vendor/token/refresh/');
    const isLogoutEndpoint = originalRequest.url?.includes('/vendor/logout/');

    // Для refresh и logout эндпоинтов — не пытаемся рефрешить, сразу чистим и редиректим
    if (error.response?.status === 401 && (isRefreshEndpoint || isLogoutEndpoint)) {
      forceLogout();
      return Promise.reject(error);
    }

    // Для остальных запросов с 401 — пробуем обновить токен один раз
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!_refreshTokenFn) throw new Error('refreshTokenFn not registered');
        const newAccessToken = await _refreshTokenFn();

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
