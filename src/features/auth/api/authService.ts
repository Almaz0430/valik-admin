/**
 * Сервис для работы с API аутентификации поставщиков
 */
import type { AuthResponse, LoginCredentials, RegisterData, Supplier, TokenRefreshResponse } from '../../../types/auth';
import { api, registerRefreshTokenFn } from '../../../utils/axiosConfig';
import { getAccessToken, setAccessToken } from '../../../utils/tokenStorage';

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

      this.setTokens(authResponse.access);
      localStorage.setItem('vendorId', authResponse.id);

      return authResponse;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as {
          response?: {
            data?: Record<string, string | string[] | number | boolean>
          }
        };

        const data = err.response?.data;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if (data.message) return Promise.reject(new Error(this.translateError(String(data.message))));
          if (data.detail) return Promise.reject(new Error(this.translateError(String(data.detail))));

          for (const key in data) {
            const fieldError = data[key];
            if (Array.isArray(fieldError) && fieldError.length > 0) {
              return Promise.reject(new Error(this.translateError(fieldError[0])));
            } else if (typeof fieldError === 'string') {
              return Promise.reject(new Error(this.translateError(fieldError)));
            }
          }
        }
      }
      throw new Error('Произошла ошибка при входе');
    }
  }

  /**
   * Регистрация поставщика
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/vendor/register/', data);
      const authResponse = response.data;

      // Если бэкенд вернул токен сразу — сохраняем его
      if (authResponse.access) {
        this.setTokens(authResponse.access);
      }

      // Сохраняем ID вендора, если он есть в ответе
      if (authResponse.id) {
        localStorage.setItem('vendorId', authResponse.id.toString());
      }

      return authResponse;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as {
          response?: {
            data?: Record<string, string | string[] | number | boolean>
          }
        };

        const data = err.response?.data;

        // Если это объект с полями (типично для Django Rest Framework)
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if (data.message) return Promise.reject(new Error(this.translateError(String(data.message))));
          if (data.detail) return Promise.reject(new Error(this.translateError(String(data.detail))));

          // Извлекаем первую ошибку из любого поля
          for (const key in data) {
            const fieldError = data[key];
            if (Array.isArray(fieldError) && fieldError.length > 0) {
              return Promise.reject(new Error(this.translateError(fieldError[0])));
            } else if (typeof fieldError === 'string') {
              return Promise.reject(new Error(this.translateError(fieldError)));
            }
          }
        }

        throw new Error('Произошла ошибка при регистрации');
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
        // We no longer pass refresh token in body, backend reads it from cookies
        const response = await api.post<TokenRefreshResponse>('/vendor/token/refresh/', {});
        const { access } = response.data;
        this.setTokens(access);
        return access;
      } catch (error) {
        // If refresh fails, we're likely unauthorized
        setAccessToken(null);
        localStorage.removeItem('vendorId');
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
  private setTokens(access: string): void {
    setAccessToken(access);
  }

  /**
   * Выход поставщика
   */
  async logout(): Promise<void> {
    try {
      // Backend will clear the cookies
      await api.post('/vendor/logout/', {});
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem('vendorId');
      localStorage.removeItem('supplier'); // Clear cached supplier as well
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
   * Локализация ошибок бэкенда на русский язык
   */
  private translateError(msg: string): string {
    if (!msg) return 'Произошла неизвестная ошибка';

    const translations: Record<string, string> = {
      'This field is required.': 'Это поле обязательно для заполнения.',
      'Enter a valid email address.': 'Введите корректный адрес электронной почты.',
      'Ensure this field has at least 8 characters.': 'Пароль должен содержать не менее 8 символов.',
      'No refresh token available': 'Сессия истекла, войдите снова.',
      'Authentication credentials were not provided.': 'Требуется авторизация.',
    };

    let translated = translations[msg] || msg;

    // Специфично для Valik: если бэк пишет "vendor с таким email...", меняем на "поставщик"
    translated = translated.replace(/vendor/gi, 'Поставщик');

    return translated;
  }

  /**
   * Получение токена из памяти
   */
  getToken(): string | null {
    return getAccessToken();
  }
}

const authService = new AuthService();

// Регистрируем функцию refresh в axiosConfig (late binding, без циклического импорта)
registerRefreshTokenFn(authService.refreshToken.bind(authService));

export default authService;
