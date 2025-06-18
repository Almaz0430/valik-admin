/**
 * Компонент для автоматического определения мобильного устройства
 * и отображения соответствующего контента
 */
import React, { useEffect, useState } from 'react';
import { isMobileDevice } from '../../utils/deviceDetect';

interface MobileDetectorProps {
  mobileContent: React.ReactNode;
  desktopContent: React.ReactNode;
  mobileWidth?: number;
}

/**
 * Компонент для автоматического определения типа устройства и отображения
 * соответствующего контента
 */
const MobileDetector: React.FC<MobileDetectorProps> = ({
  mobileContent,
  desktopContent,
  mobileWidth = 768
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Функция для определения типа устройства
    const checkDevice = () => {
      setIsMobile(isMobileDevice(mobileWidth));
      if (!isReady) setIsReady(true);
    };
    
    // Проверка при монтировании
    checkDevice();
    
    // Добавление слушателя изменения размера окна
    window.addEventListener('resize', checkDevice);
    
    // Очистка слушателя при размонтировании
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [mobileWidth, isReady]);
  
  // Пока не определили тип устройства, показываем заглушку
  if (!isReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // Отображаем соответствующий контент в зависимости от типа устройства
  return <>{isMobile ? mobileContent : desktopContent}</>;
};

export default MobileDetector; 