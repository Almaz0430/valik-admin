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
  email: string;
  password: string;
}

/**
 * Данные поставщика
 */
export interface Supplier {
  id: string; // Django returns string ID in token
  email: string;
  name: string;
  iin?: string;
  phone?: string;
  city?: string;
  address?: string;
  logo?: string;
  // Дополнительные поля поставщика
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Ответ при успешной аутентификации
 */
export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  access: string;
  refresh: string;
}

/**
 * Ответ при обновлении токена
 */
export interface TokenRefreshResponse {
  access: string;
} 
