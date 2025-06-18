/**
 * Утилиты для определения типа устройства
 */

/**
 * Проверяет, является ли устройство мобильным
 * @param mobileWidth Пороговая ширина для мобильных устройств (по умолчанию 768px)
 * @returns true, если устройство мобильное
 */
export const isMobileDevice = (mobileWidth: number = 768): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < mobileWidth;
};

/**
 * Проверяет, является ли устройство планшетом
 * @returns true, если устройство планшет
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Проверяет, является ли устройство десктопным
 * @returns true, если устройство десктопное
 */
export const isDesktopDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

/**
 * Проверяет, поддерживает ли устройство касание
 * @returns true, если устройство поддерживает касание
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Получает тип устройства
 * @returns Тип устройства: 'mobile', 'tablet' или 'desktop'
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};

export default {
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  isTouchDevice,
  getDeviceType
}; 