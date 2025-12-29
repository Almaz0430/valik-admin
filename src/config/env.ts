/**
 * Валидация и типизация переменных окружения
 */

const env = {
    API_URL: import.meta.env.VITE_API_URL as string | undefined,
} as const;

// Проверка обязательных переменных при запуске
if (!env.API_URL) {
    throw new Error(
        '[ENV] VITE_API_URL не определен. Добавьте переменную в .env файл: VITE_API_URL=http://localhost:8080'
    );
}

export default env as {
    readonly API_URL: string;
};
