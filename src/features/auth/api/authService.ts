/**
 * Сервис для работы с API аутентификации поставщиков
 */
import type { AuthResponse, LoginCredentials, Supplier, TokenRefreshResponse } from '../../../types/auth';
import { api } from '../../../utils/axiosConfig';

/**
 * Класс для работы с API аутентификации
 */
class AuthService {
  /**
   * Промис обновления токена (для предотвращения множественных запросов)
   */
  private refreshPromise: Promise<string> | null = null;

  /**
   * Вход поставщика
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/suppliers/login', credentials);
      const authResponse = response.data;
      
      if (!authResponse.accessToken) {
        throw new Error('Сервер не вернул токен доступа');
      }
      
      this.setToken(authResponse.accessToken);
      
      return authResponse;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
              errors?: Array<{ msg?: string }>;
            };
          };
        };

        const validationMessage = err.response?.data?.errors?.[0]?.msg;
        const apiMessage = err.response?.data?.message;

        throw new Error(
          validationMessage || apiMessage || 'Произошла ошибка при входе',
        );
      }
      throw new Error('Произошла ошибка при входе');
    }
  }
  
  /**
   * Регистрация поставщика
   */
  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/suppliers/registration', credentials);
      const authResponse = response.data;

      if (!authResponse.accessToken) {
        throw new Error('Сервер не вернул токен доступа');
      }

      this.setToken(authResponse.accessToken);
      
      return authResponse;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Произошла ошибка при регистрации');
      }
      throw new Error('Произошла ошибка при регистрации');
    }
  }
  
  /**
   * Обновление токена доступа
   */
  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await api.post<TokenRefreshResponse>('/suppliers/refresh');
        const { accessToken } = response.data;
        this.setToken(accessToken);
        return accessToken;
      } catch (error) {
        await this.logout();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();
    
    return this.refreshPromise;
  }
  
  /**
   * Установка токена
   */
  private setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }
  
  /**
   * Выход поставщика
   */
  async logout(): Promise<void> {
    try {
      await api.post('/suppliers/logout');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      localStorage.removeItem('accessToken');
    }
  }
  
  /**
   * Получение текущего поставщика
   */
  async getCurrentUser(): Promise<Supplier | null> {
    try {
      const response = await api.get<{ supplier: Supplier }>('/suppliers/me');
      return response.data.supplier;
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
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

const authService = new AuthService();

export default authService;
