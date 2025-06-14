/**
 * Сервис для работы с API аутентификации
 */
import type { AuthResponse, LoginCredentials, User } from '../types/auth';

/**
 * Базовый URL API
 */
const API_URL = '/api';

/**
 * Класс для работы с API аутентификации
 */
class AuthService {
  /**
   * Вход пользователя
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`${API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(credentials),
    // });
    
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Ошибка при входе');
    // }
    
    // const data = await response.json();
    // return data;
    
    // Имитация ответа от API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Проверка учетных данных (в реальном приложении это делается на сервере)
    if (credentials.email !== 'test@test.com' || credentials.password !== 'test') {
      throw new Error('Неверный email или пароль');
    }
    
    const authResponse: AuthResponse = {
      user: {
        id: '1',
        email: credentials.email,
        name: 'Администратор',
        role: 'admin' as any,
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refreshToken: 'refresh-token-example'
    };
    
    // Сохранение токена в localStorage
    if (credentials.rememberMe) {
      localStorage.setItem('token', authResponse.token);
    } else {
      sessionStorage.setItem('token', authResponse.token);
    }
    
    return authResponse;
  }
  
  /**
   * Выход пользователя
   */
  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
  
  /**
   * Получение текущего пользователя
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }
    
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`${API_URL}/auth/me`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });
    
    // if (!response.ok) {
    //   this.logout();
    //   return null;
    // }
    
    // const data = await response.json();
    // return data.user;
    
    // Имитация ответа от API
    return {
      id: '1',
      email: 'admin@example.com',
      name: 'Администратор',
      role: 'admin' as any,
      avatar: 'https://i.pravatar.cc/150?img=1'
    };
  }
  
  /**
   * Проверка авторизации пользователя
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  /**
   * Получение токена из localStorage или sessionStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
}

export default new AuthService(); 