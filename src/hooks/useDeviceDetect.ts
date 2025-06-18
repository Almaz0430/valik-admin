/**
 * Хук для определения типа устройства (мобильное или десктопное)
 */
import { useState, useEffect } from 'react';

interface DeviceDetectOptions {
  mobileWidth?: number;
}

/**
 * Хук для определения типа устройства
 * @param options Опции для настройки определения устройства
 * @returns Объект с информацией об устройстве
 */
export function useDeviceDetect(options: DeviceDetectOptions = {}) {
  const { mobileWidth = 768 } = options;
  
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < mobileWidth);
      if (!isReady) setIsReady(true);
    };
    
    // Проверка при загрузке
    checkDevice();
    
    // Проверка при изменении размера окна
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [mobileWidth, isReady]);

  return { isMobile, isReady };
}

export default useDeviceDetect; 