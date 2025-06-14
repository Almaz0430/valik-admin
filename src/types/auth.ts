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
  role: UserRole;
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
  rememberMe?: boolean;
}

/**
 * Ответ при успешной аутентификации
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
} 