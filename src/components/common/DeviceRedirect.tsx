/**
 * Компонент для автоматического перенаправления на мобильную или десктопную версию страницы
 * в зависимости от размера экрана устройства
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DeviceRedirectProps {
  mobileWidth?: number;
  mobileRedirectPath: string;
  desktopRedirectPath: string;
}

/**
 * Компонент перенаправляет пользователя на соответствующую версию страницы
 * в зависимости от размера экрана устройства
 */
const DeviceRedirect: React.FC<DeviceRedirectProps> = ({
  mobileWidth = 768, // Порог ширины для мобильных устройств (по умолчанию 768px)
  mobileRedirectPath,
  desktopRedirectPath
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Проверяем ширину экрана и выполняем перенаправление
    const isMobile = window.innerWidth < mobileWidth;
    const redirectPath = isMobile ? mobileRedirectPath : desktopRedirectPath;
    
    navigate(redirectPath, { replace: true });
  }, [mobileWidth, mobileRedirectPath, desktopRedirectPath, navigate]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-orange-500">
        Перенаправление...
      </div>
    </div>
  );
};

export default DeviceRedirect; 