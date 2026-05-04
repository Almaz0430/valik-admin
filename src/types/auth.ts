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
  iik?: string;
  bik?: string;
  bank_name?: string;
  kbe?: string;
  knp?: string;
  city?: number | string | City | null;
  address?: string;
  logo?: string;
  // Дополнительные поля поставщика
  [key: string]: string | number | boolean | City | null | undefined;
}

export interface City {
  id: number;
  name: string;
}

export interface SupplierProfileUpdatePayload {
  iin: string;
  name: string;
  phone: string;
  iik: string;
  bik: string;
  bank_name: string;
  kbe: string;
  knp: string;
  city: number;
  address: string;
}

/**
 * Данные для регистрации
 */
export interface RegisterData {
  email: string;
  password?: string;
  iin: string;
  name: string;
  phone: string;
  city?: number | '';
  address?: string;
}

/**
 * Ответ при успешной аутентификации
 */
export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  access?: string;
  refresh?: string;
}

/**
 * Ответ при обновлении токена
 */
export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
} 
