/**
 * Главный компонент приложения
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import CreateProductPage from './pages/products/CreateProductPage';
import OrdersPage from './pages/orders/OrdersPage';
import { useEffect, useState } from 'react';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);
  
  // Пока проверяем авторизацию, показываем загрузку
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-orange-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard/products" element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard/products/create" element={isAuthenticated ? <CreateProductPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
