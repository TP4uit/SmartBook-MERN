import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MarketplaceScreen } from './components/screens/MarketplaceScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { CartScreen } from './components/screens/CartScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AddressBookScreen } from './components/screens/AddressBookScreen';
import { OrderHistoryScreen } from './components/screens/OrderHistoryScreen';
import { SellerDashboardScreen } from './components/screens/SellerDashboardScreen';
import { AddProductScreen } from './components/screens/AddProductScreen';
import { SellerOrdersScreen } from './components/screens/SellerOrdersScreen';
import { SellerFinanceScreen } from './components/screens/SellerFinanceScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { AdminUsersScreen } from './components/screens/AdminUsersScreen';
import { AdminShopsScreen } from './components/screens/AdminShopsScreen';
import { ChatWidget } from './components/widgets/ChatWidget';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';

const PATH_MAP: Record<string, string> = {
  home: '/home',
  login: '/login',
  register: '/register',
  marketplace: '/marketplace',
  cart: '/cart',
  checkout: '/checkout',
  profile: '/profile',
  'address-book': '/address-book',
  'order-history': '/order-history',
  'seller-dashboard': '/seller/dashboard',
  'add-product': '/seller/add-product',
  'seller-orders': '/seller/orders',
  'seller-finance': '/seller/finance',
  'admin-dashboard': '/admin/dashboard',
  'admin-users': '/admin/users',
  'admin-shops': '/admin/shops',
};

function getPath(screen: string, productId?: string): string {
  if (screen === 'product-detail' && productId) return `/product/${productId}`;
  return PATH_MAP[screen] ?? '/home';
}

function useNavigateHandler() {
  const navigate = useNavigate();
  return (screen: string, productId?: string) => {
    navigate(getPath(screen, productId));
  };
}

// --- PROTECTED ROUTES LOGIC ---

// Chỉ yêu cầu đăng nhập
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Yêu cầu Role là Seller hoặc Admin
function SellerRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userInfoStr = localStorage.getItem('userInfo');
  
  if (!token || !userInfoStr) return <Navigate to="/login" replace />;
  
  const userInfo = JSON.parse(userInfoStr);
  const role = userInfo.role || 'user';

  // SỬA Ở ĐÂY: Đổi 'shop' thành 'seller' để khớp với Database
  if (role === 'seller' || role === 'admin') {
    return <>{children}</>;
  }

  // Nếu là user thường -> Về Home
  return <Navigate to="/home" replace />;
}

// Yêu cầu Role là Admin
function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userInfoStr = localStorage.getItem('userInfo');

  if (!token || !userInfoStr) return <Navigate to="/login" replace />;

  const userInfo = JSON.parse(userInfoStr);
  const role = userInfo.role || 'user';

  if (role === 'admin') {
    return <>{children}</>;
  }

  return <Navigate to="/home" replace />;
}

function ProductDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const onNavigate = useNavigateHandler();
  return <ProductDetailScreen onNavigate={onNavigate} productId={id ?? null} />;
}

function NavButton({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between group w-full ${
        active ? 'bg-[#008080]/10 text-[#008080] font-bold' : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      {children}
      {active && <span className="w-2 h-2 rounded-full bg-[#008080] animate-pulse" />}
    </button>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = window.location.pathname;

  const onNavigate = useNavigateHandler();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userRole = userInfo.role;

  return (
    <div className="min-h-screen bg-[#F5F5DC] font-sans text-slate-900 relative">
      {/* <div className="fixed top-4 left-4 z-50">
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mở menu điều hướng"
            className="rounded-full bg-white shadow-lg border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {isMenuOpen && (
            <div className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1 animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
              <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Customer Journey</div>
              <NavButton to="/login" active={location === '/login'}>Đăng nhập</NavButton>
              <NavButton to="/register" active={location === '/register'}>Đăng ký</NavButton>
              <NavButton to="/home" active={location === '/home'}>Trang chủ</NavButton>
              <NavButton to="/marketplace" active={location === '/marketplace'}>Cửa hàng</NavButton>
              <NavButton to="/cart" active={location === '/cart'}>Giỏ hàng</NavButton>
              <NavButton to="/profile" active={location.startsWith('/profile')}>Tài khoản</NavButton>
              <NavButton to="/address-book" active={location === '/address-book'}>Sổ địa chỉ</NavButton>
              <NavButton to="/order-history" active={location === '/order-history'}>Đơn mua</NavButton>

              
              {(userRole === 'seller' || userRole === 'admin') && (
                <>
                  <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider mt-2">Seller Portal</div>
                  <NavButton to="/seller/dashboard" active={location === '/seller/dashboard'}>Dashboard Người bán</NavButton>
                  <NavButton to="/seller/add-product" active={location === '/seller/add-product'}>Đăng bán sách</NavButton>
                  <NavButton to="/seller/orders" active={location === '/seller/orders'}>Quản lý đơn hàng</NavButton>
                  <NavButton to="/seller/finance" active={location === '/seller/finance'}>Tài chính & Rút tiền</NavButton>
                </>
              )}

            
              {userRole === 'admin' && (
                <>
                  <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider mt-2">Admin</div>
                  <NavButton to="/admin/dashboard" active={location === '/admin/dashboard'}>Tổng quan</NavButton>
                  <NavButton to="/admin/shops" active={location === '/admin/shops'}>Quản lý Shop</NavButton>
                  <NavButton to="/admin/users" active={location === '/admin/users'}>Quản lý User</NavButton>
                </>
              )}
            </div>
          )}
        </div>
      </div> */}
      

      <main className="w-full h-full">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen onNavigate={onNavigate} />} />
          <Route path="/login" element={<LoginScreen onNavigateRegister={() => navigate('/register')} />} />
          <Route path="/register" element={<RegisterScreen onRegister={() => navigate('/profile')} onNavigateLogin={() => navigate('/login')} />} />
          <Route path="/marketplace" element={<MarketplaceScreen onNavigate={onNavigate} />} />
          <Route path="/product/:id" element={<ProductDetailRoute />} />
          <Route path="/cart" element={<CartScreen onNavigate={onNavigate} />} />

          <Route path="/profile" element={<ProtectedRoute><ProfileScreen onNavigate={onNavigate} /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen onNavigate={onNavigate} /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistoryScreen onNavigate={onNavigate} /></ProtectedRoute>} />
          <Route path="/address-book" element={<ProtectedRoute><AddressBookScreen onNavigate={onNavigate} /></ProtectedRoute>} />

          <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboardScreen onNavigate={onNavigate} /></SellerRoute>} />
          <Route path="/seller/orders" element={<SellerRoute><SellerOrdersScreen onNavigate={onNavigate} /></SellerRoute>} />
          <Route path="/seller/add-product" element={<SellerRoute><AddProductScreen onNavigate={onNavigate} /></SellerRoute>} />
          <Route path="/seller/finance" element={<SellerRoute><SellerFinanceScreen onNavigate={onNavigate} /></SellerRoute>} />

          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardScreen onNavigate={onNavigate} /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersScreen onNavigate={onNavigate} /></AdminRoute>} />
          <Route path="/admin/shops" element={<AdminRoute><AdminShopsScreen onNavigate={onNavigate} /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <ChatWidget productId={location.startsWith('/product/') ? location.split('/product/')[1]?.split('/')[0] ?? null : undefined} />
    </div>
  );
}