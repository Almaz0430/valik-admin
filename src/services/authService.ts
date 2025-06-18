/**
 * Сервис для работы с API аутентификации поставщиков
 */
import type { AuthResponse, LoginCredentials, Supplier, TokenRefreshResponse } from '../types/auth';

/**
 * Базовый URL API
 */
const API_URL = 'http://localhost:8080';

/**
 * Время жизни токена в миллисекундах (предположим 10 минут)
 */
const TOKEN_TTL = 10 * 60 * 1000; // 10 минут

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
   * Время истечения текущего токена
   */
  private tokenExpirationTime: number = 0;
  
  /**
   * Промис обновления токена (для предотвращения множественных запросов)
   */
  private refreshPromise: Promise<string> | null = null;

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
        credentials: 'include', // Включаем передачу cookies
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
      
      // Проверяем, есть ли в ответе токен
      if (!authResponse.accessToken) {
        throw new Error('Сервер не вернул токен доступа');
      }
      
      // Сохранение токена в localStorage
      this.setToken(authResponse.accessToken);
      
      // Записываем в консоль для дебага, чтобы убедиться, что cookies получены
      console.log('Вход выполнен успешно. Токен доступа сохранен.');
      
      return authResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла ошибка при подключении к серверу');
    }
  }
  
  /**
   * Регистрация поставщика
   */
  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    this.validateCredentials(credentials);
    
    try {
      const response = await fetch(`${API_URL}/suppliers/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Включаем передачу cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Обработка ошибок API
        const apiError = data as ApiError;
        
        // Если API вернул структуру с массивом errors
        if (apiError.errors && apiError.errors.length > 0) {
          // Проверяем, есть ли ошибка о существующем пользователе
          const loginError = apiError.errors.find(err => 
            err.path === 'login' && err.msg.includes('уже существует')
          );
          
          if (loginError) {
            throw new Error('Поставщик с таким логином уже существует');
          }
          
          // Если есть другие ошибки, берем первую
          throw new Error(apiError.errors[0].msg || 'Произошла ошибка при регистрации');
        }
        
        // Если структура ошибки другая
        throw new Error(apiError.message || 'Произошла ошибка при регистрации');
      }
      
      const authResponse = data as AuthResponse;
      
      // Сохранение токена в localStorage
      this.setToken(authResponse.accessToken);
      
      return authResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла ошибка при подключении к серверу');
    }
  }
  
  /**
   * Обновление токена доступа
   */
  async refreshToken(): Promise<string> {
    // Если уже идет обновление токена, возвращаем существующий промис
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // Создаем промис для обновления токена
    this.refreshPromise = new Promise<string>(async (resolve, reject) => {
      try {
        // Если у нас нет текущего токена, нет смысла пытаться его обновить
        const currentToken = this.getToken();
        if (!currentToken) {
          reject(new Error('Отсутствует токен доступа'));
          return;
        }
        
        const response = await fetch(`${API_URL}/suppliers/refresh`, {
          method: 'POST',
          credentials: 'include', // Важно для получения и отправки cookies
        });
        
        if (!response.ok) {
          throw new Error('Не удалось обновить токен');
        }
        
        const data = await response.json() as TokenRefreshResponse;
        
        // Обновляем токен в хранилище
        this.setToken(data.accessToken);
        
        resolve(data.accessToken);
      } catch (error) {
        // В случае ошибки очищаем токены
        localStorage.removeItem('accessToken');
        this.tokenExpirationTime = 0;
        reject(error);
      } finally {
        // Сбрасываем промис обновления
        this.refreshPromise = null;
      }
    });
    
    return this.refreshPromise;
  }
  
  /**
   * Аутентифицированный запрос с автообновлением токена
   */
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    // Проверяем, нужно ли обновить токен
    await this.ensureTokenValid();
    
    const token = this.getToken();
    if (!token) {
      throw new Error('Пользователь не авторизован');
    }
    
    // Создаем заголовки с токеном авторизации
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    
    // Выполняем запрос
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    
    // Если получаем 401 (Unauthorized), пробуем обновить токен и повторить запрос
    if (response.status === 401) {
      try {
        // Обновляем токен
        const newToken = await this.refreshToken();
        
        // Повторяем запрос с новым токеном
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          },
          credentials: 'include',
        });
      } catch (error) {
        // Если не удалось обновить токен, выходим из системы
        await this.logout();
        throw new Error('Сессия истекла. Пожалуйста, войдите заново');
      }
    }
    
    return response;
  }
  
  /**
   * Проверка валидности токена и его обновление при необходимости
   */
  private async ensureTokenValid(): Promise<void> {
    // Если токен отсутствует или скоро истекает (меньше 30 секунд до истечения)
    if (this.isTokenExpiringSoon()) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.warn('Не удалось обновить токен:', error);
        // Если не удалось обновить токен, продолжаем с текущим
      }
    }
  }
  
  /**
   * Проверка скорого истечения срока токена
   */
  private isTokenExpiringSoon(): boolean {
    const currentTime = Date.now();
    const timeThreshold = 30 * 1000; // 30 секунд запас
    
    return !this.getToken() || (this.tokenExpirationTime - timeThreshold) < currentTime;
  }
  
  /**
   * Установка токена с фиксацией времени истечения
   */
  private setToken(token: string): void {
    localStorage.setItem('accessToken', token);
    // Устанавливаем примерное время истечения
    this.tokenExpirationTime = Date.now() + TOKEN_TTL;
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
  async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        await fetch(`${API_URL}/suppliers/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include', // Включаем передачу cookies
        });
      } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
      }
    }
    
    localStorage.removeItem('accessToken');
    this.tokenExpirationTime = 0;
  }
  
  /**
   * Получение текущего поставщика
   */
  async getCurrentUser(): Promise<Supplier | null> {
    try {
      const response = await this.fetchWithAuth(`${API_URL}/suppliers/me`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.supplier;
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

export default new AuthService(); 