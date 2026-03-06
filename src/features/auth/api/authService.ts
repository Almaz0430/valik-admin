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
      const response = await api.post<AuthResponse>('/vendor/login/', credentials);
      const authResponse = response.data;

      if (!authResponse.access) {
        throw new Error('Сервер не вернул токен доступа');
      }

      this.setTokens(authResponse.access, authResponse.refresh);
      localStorage.setItem('vendorId', authResponse.id);

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
      const response = await api.post<AuthResponse>('/vendor/register/', credentials);
      const authResponse = response.data;

      if (!authResponse.access) {
        throw new Error('Сервер не вернул токен доступа');
      }

      this.setTokens(authResponse.access, authResponse.refresh);
      if (authResponse.id) localStorage.setItem('vendorId', authResponse.id);

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
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) throw new Error('No refresh token available');

        const response = await api.post<TokenRefreshResponse>('/vendor/token/refresh/', { refresh });
        const { access } = response.data;
        this.setTokens(access, refresh); // Keep the old refresh or use new if returned
        return access;
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
  private setTokens(access: string, refresh?: string): void {
    localStorage.setItem('accessToken', access);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }
  }

  /**
   * Выход поставщика
   */
  async logout(): Promise<void> {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        await api.post('/vendor/logout/', { refresh });
      }
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('vendorId');
    }
  }

  /**
   * Получение текущего поставщика
   */
  async getCurrentUser(): Promise<Supplier | null> {
    try {
      const vendorId = localStorage.getItem('vendorId');
      if (!vendorId) return null;

      const response = await api.get<Supplier>(`/vendor/api/vendor/${vendorId}/`);
      return response.data;
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
