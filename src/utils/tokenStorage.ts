const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

const readToken = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
};

let accessToken: string | null = readToken(accessTokenKey);
let refreshToken: string | null = readToken(refreshTokenKey);

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
    accessToken = token;
    if (typeof window === 'undefined') return;

    if (token) {
        window.localStorage.setItem(accessTokenKey, token);
    } else {
        window.localStorage.removeItem(accessTokenKey);
    }
};

export const getRefreshToken = () => refreshToken;
export const setRefreshToken = (token: string | null) => {
    refreshToken = token;
    if (typeof window === 'undefined') return;

    if (token) {
        window.localStorage.setItem(refreshTokenKey, token);
    } else {
        window.localStorage.removeItem(refreshTokenKey);
    }
};

export const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
};
