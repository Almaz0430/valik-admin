/**
 * Компонент-обертка для страниц дашборда с автоматическим определением устройства
 */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Layout from '../layout/Layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  mobileRouteMap?: Record<string, string>;
  desktopRouteMap?: Record<string, string>;
}

/**
 * Компонент-обертка для страниц дашборда с автоматическим определением устройства
 * и перенаправлением на соответствующие мобильные/десктопные версии
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  mobileRouteMap = {},
  desktopRouteMap = {}
}) => {
  const { isMobile, isReady } = useDeviceDetect();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Автоматическое перенаправление при изменении устройства
  useEffect(() => {
    if (!isReady) return;
    
    // Проверяем, нужно ли перенаправление
    if (isMobile) {
      // Если текущий путь есть в маппинге для мобильных устройств
      const mobileRoutes = Object.keys(mobileRouteMap);
      for (const route of mobileRoutes) {
        if (currentPath === route) {
          navigate(mobileRouteMap[route], { replace: true });
          return;
        }
      }
    } else {
      // Если текущий путь есть в маппинге для десктопных устройств
      const desktopRoutes = Object.keys(desktopRouteMap);
      for (const route of desktopRoutes) {
        if (currentPath === route) {
          navigate(desktopRouteMap[route], { replace: true });
          return;
        }
      }
    }
  }, [isMobile, isReady, currentPath, navigate, mobileRouteMap, desktopRouteMap]);

  return <Layout>{children}</Layout>;
};

export default DashboardLayout; 