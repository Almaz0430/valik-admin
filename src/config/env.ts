/**
 * Валидация и типизация переменных окружения
 */

const fallbackApiUrl = 'https://api.valik.kz/';

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

// Проверка обязательных переменных при запуске
if (!apiUrl && !import.meta.env.DEV) {
    throw new Error(
        '[ENV] VITE_API_URL не определен. Добавьте переменную в .env файл: VITE_API_URL=http://localhost:8080'
    );
}

if (!apiUrl && import.meta.env.DEV) {
    console.warn(
        `[ENV] VITE_API_URL не определен. Используется локальный API по умолчанию: ${fallbackApiUrl}`
    );
}

const env = {
    API_URL: apiUrl ?? fallbackApiUrl,
} as const;

export default env as {
    readonly API_URL: string;
};
