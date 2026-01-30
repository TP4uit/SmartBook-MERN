import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

// Import Screens (Đảm bảo các file này cũng nên đổi đuôi thành .tsx dần nhé)
import { LoginScreen } from './pages/screens/LoginScreen';
import { RegisterScreen } from './pages/screens/RegisterScreen';
import { HomeScreen } from './pages/screens/HomeScreen';
import { ProfileScreen } from './pages/screens/ProfileScreen';
import { CartScreen } from './pages/screens/CartScreen';
import { CheckoutScreen } from './pages/screens/CheckoutScreen';
import { ProductDetailScreen } from './pages/screens/ProductDetailScreen';
import { MarketplaceScreen } from './pages/screens/MarketplaceScreen';
import { OrderHistoryScreen } from './pages/screens/OrderHistoryScreen';
import { AddressBookScreen } from './pages/screens/AddressBookScreen';

// Import Seller Screens
import { SellerDashboardScreen } from './pages/screens/SellerDashboardScreen';
import { AddProductScreen } from './pages/screens/AddProductScreen';
import { SellerOrdersScreen } from './pages/screens/SellerOrdersScreen';
import { SellerFinanceScreen } from './pages/screens/SellerFinanceScreen';

// Import Admin Screens (Nếu có)
import { AdminDashboardScreen } from './pages/screens/AdminDashboardScreen';
import { AdminUsersScreen } from './pages/screens/AdminUsersScreen';
import { AdminShopsScreen } from './pages/screens/AdminShopsScreen';

// Định nghĩa kiểu Props cho Component màn hình
// (Tất cả màn hình đều nhận prop onNavigate)
interface ScreenProps {
  onNavigate: (screen: string) => void;
}

// Định nghĩa Props cho Wrapper
interface NavigationHandlerProps {
  // Component truyền vào phải là một React Component nhận ScreenProps
  Component: React.ComponentType<ScreenProps>;
}

// Component điều hướng thông minh (Adapter)
const NavigationHandler: React.FC<NavigationHandlerProps> = ({ Component }) => {
  const navigate = useNavigate();

  // Hàm map từ khóa (screen name) sang URL thật
  const handleNavigate = (screen: string) => {
    // Bảng định tuyến (Routing Table)
    const routes: Record<string, string> = {
      'home': '/',
      'login': '/login',
      'register': '/register',
      'profile': '/profile',
      'cart': '/cart',
      'checkout': '/checkout',
      'marketplace': '/marketplace',
      'product-detail': '/product/1', // Demo ID
      'order-history': '/profile/orders',
      'address-book': '/profile/addresses',
      
      // Seller Routes
      'seller-dashboard': '/seller/dashboard',
      'add-product': '/seller/products/add',
      'seller-orders': '/seller/orders',
      'seller-finance': '/seller/finance',

      // Admin Routes
      'admin-dashboard': '/admin/dashboard',
      'admin-users': '/admin/users',
      'admin-shops': '/admin/shops',
    };

    const path = routes[screen] || '/'; // Mặc định về Home nếu không tìm thấy
    navigate(path);
  };

  // Render Component và truyền hàm handleNavigate xuống
  return <Component onNavigate={handleNavigate} />;
};

function App() {
  return (
    <Router>
      {/* Toaster để hiện thông báo đẹp */}
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<NavigationHandler Component={HomeScreen} />} />
        <Route path="/login" element={<NavigationHandler Component={LoginScreen} />} />
        <Route path="/register" element={<NavigationHandler Component={RegisterScreen} />} />
        <Route path="/marketplace" element={<NavigationHandler Component={MarketplaceScreen} />} />
        <Route path="/product/:id" element={<NavigationHandler Component={ProductDetailScreen} />} />
        
        {/* === User Routes (Cần Auth) === */}
        <Route path="/cart" element={<NavigationHandler Component={CartScreen} />} />
        <Route path="/checkout" element={<NavigationHandler Component={CheckoutScreen} />} />
        <Route path="/profile" element={<NavigationHandler Component={ProfileScreen} />} />
        <Route path="/profile/orders" element={<NavigationHandler Component={OrderHistoryScreen} />} />
        <Route path="/profile/addresses" element={<NavigationHandler Component={AddressBookScreen} />} />

        {/* === Seller Routes === */}
        <Route path="/seller/dashboard" element={<NavigationHandler Component={SellerDashboardScreen} />} />
        <Route path="/seller/products/add" element={<NavigationHandler Component={AddProductScreen} />} />
        <Route path="/seller/orders" element={<NavigationHandler Component={SellerOrdersScreen} />} />
        <Route path="/seller/finance" element={<NavigationHandler Component={SellerFinanceScreen} />} />

        {/* === Admin Routes === */}
        <Route path="/admin/dashboard" element={<NavigationHandler Component={AdminDashboardScreen} />} />
        <Route path="/admin/users" element={<NavigationHandler Component={AdminUsersScreen} />} />
        <Route path="/admin/shops" element={<NavigationHandler Component={AdminShopsScreen} />} />
      </Routes>
    </Router>
  );
}

export default App;