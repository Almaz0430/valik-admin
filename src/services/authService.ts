/**
 * Сервис для работы с API аутентификации поставщиков
 */
import type { AuthResponse, LoginCredentials, Supplier } from '../types/auth';

/**
 * Базовый URL API
 */
const API_URL = 'http://localhost:8080';

/**
 * Интерфейс для структуры ошибок API
 */
interface ApiError {
  errors?: Array<{
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }>;
  message?: string;
}

/**
 * Класс для работы с API аутентификации
 */
class AuthService {
  /**
   * Вход поставщика
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    this.validateCredentials(credentials);
    
    try {
      const response = await fetch(`${API_URL}/suppliers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Обработка ошибок API
        const apiError = data as ApiError;
        
        // Если API вернул структуру с массивом errors
        if (apiError.errors && apiError.errors.length > 0) {
          // Проверяем, есть ли ошибка о ненайденном пользователе
          const loginError = apiError.errors.find(err => 
            err.path === 'login' && err.msg.includes('Пользователь не найден')
          );
          
          if (loginError) {
            throw new Error('Неверный логин или пароль');
          }
          
          // Если есть другие ошибки, берем первую
          throw new Error(apiError.errors[0].msg || 'Произошла ошибка при входе');
        }
        
        // Если структура ошибки другая
        throw new Error(apiError.message || 'Произошла ошибка при входе');
      }
      
      const authResponse = data as AuthResponse;
      
      // Сохранение токена в localStorage
      localStorage.setItem('accessToken', authResponse.accessToken);
      
      return authResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла ошибка при подключении к серверу');
    }
  }
  
  /**
   * Валидация учетных данных
   */
  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.login || credentials.login.length < 4) {
      throw new Error('Логин должен содержать минимум 4 символа');
    }
    
    if (!credentials.password || credentials.password.length < 8) {
      throw new Error('Пароль должен содержать минимум 8 символов');
    }
  }
  
  /**
   * Выход поставщика
   */
  logout(): void {
    localStorage.removeItem('accessToken');
  }
  
  /**
   * Получение текущего поставщика
   */
  async getCurrentUser(): Promise<Supplier | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/suppliers/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        this.logout();
        return null;
      }
      
      const data = await response.json();
      return data.supplier;
    } catch (error) {
      this.logout();
      return null;
    }
  }
  
  /**
   * Проверка авторизации пользователя
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  /**
   * Получение токена из localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService(); 