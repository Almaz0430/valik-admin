/**
 * Типы для аутентификации
 */

/**
 * Данные пользователя
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

/**
 * Роли пользователей
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager'
}

/**
 * Данные для входа
 */
export interface LoginCredentials {
  login: string;
  password: string;
}

/**
 * Данные поставщика
 */
export interface Supplier {
  id: number;
  login: string;
  [key: string]: any; // для других полей поставщика
}

/**
 * Ответ при успешной аутентификации
 */
export interface AuthResponse {
  message: string;
  supplier: Supplier;
  accessToken: string;
}

/**
 * Ответ при обновлении токена
 */
export interface TokenRefreshResponse {
  message: string;
  accessToken: string;
} 