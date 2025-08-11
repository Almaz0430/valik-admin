/**
 * Главный компонент приложения
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EditProductPage from './pages/products/EditProductPage';
import OrdersPage from './pages/orders/OrdersPage';
import ProfilePage from './pages/profile/ProfilePage';
import GuidePage from './pages/guide/GuidePage';
import { AttributesPage } from './pages/attributes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ProductsPageWrapper, CreateProductPageWrapper } from './utils/pageWrappers';
import { ApiProvider } from './contexts/ApiContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ApiProvider>
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Основной маршрут для товаров с автоопределением устройства */}
            <Route path="/dashboard/products" element={
              <ProtectedRoute>
                <ProductsPageWrapper />
              </ProtectedRoute>
            } />
            
            {/* Основной маршрут для создания товара с автоопределением устройства */}
            <Route path="/dashboard/products/create" element={
              <ProtectedRoute>
                <CreateProductPageWrapper />
              </ProtectedRoute>
            } />
            
            {/* Маршрут для редактирования товара */}
            <Route path="/dashboard/products/edit/:id" element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Маршрут для страницы руководства */}
            <Route path="/dashboard/guide" element={
              <ProtectedRoute>
                <GuidePage />
              </ProtectedRoute>
            } />
            
            {/* Маршрут для страницы атрибутов (бренды и единицы измерения) */}
            <Route path="/dashboard/attributes" element={
              <ProtectedRoute>
                <AttributesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ApiProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
