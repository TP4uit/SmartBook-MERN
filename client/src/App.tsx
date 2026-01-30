import React, { useState } from 'react';
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

// Color Palette Definition
// Primary: #008080 (Deep Teal)
// Secondary: #F5F5DC (Warm Paper White)
// Accent: #FFC107 (Amber)

type Screen = 
  | 'login'
  | 'register'
  | 'home' 
  | 'marketplace' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout'
  | 'profile'
  | 'profile-from-register' 
  | 'address-book'
  | 'order-history'
  | 'seller-dashboard' 
  | 'add-product' 
  | 'seller-orders'
  | 'seller-finance'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-shops';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleNavigate = (screen: string, productId?: string) => {
    if (screen === 'product-detail' && productId) {
      setSelectedProductId(productId);
    } else {
      setSelectedProductId(null);
    }
    setCurrentScreen(screen as Screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <LoginScreen onLogin={() => setCurrentScreen('home')} onNavigateRegister={() => setCurrentScreen('register')} />;
      case 'register': return <RegisterScreen onRegister={() => setCurrentScreen('profile-from-register')} onNavigateLogin={() => setCurrentScreen('login')} />;
      
      // Sử dụng handleNavigate cho các screen còn lại để tránh lỗi Type Mismatch
      case 'home': return <HomeScreen onNavigate={handleNavigate} />;
      case 'marketplace': return <MarketplaceScreen onNavigate={handleNavigate} />;
      case 'product-detail': return <ProductDetailScreen onNavigate={handleNavigate} productId={selectedProductId} />;
      case 'cart': return <CartScreen onNavigate={handleNavigate} />;
      case 'checkout': return <CheckoutScreen onNavigate={handleNavigate} />;
      case 'profile': return <ProfileScreen onNavigate={handleNavigate} />;
      case 'profile-from-register': return <ProfileScreen onNavigate={handleNavigate} fromRegister={true} />;
      case 'address-book': return <AddressBookScreen onNavigate={handleNavigate} />;
      case 'order-history': return <OrderHistoryScreen onNavigate={handleNavigate} />;
      case 'seller-dashboard': return <SellerDashboardScreen onNavigate={handleNavigate} />;
      case 'add-product': return <AddProductScreen onNavigate={handleNavigate} />;
      case 'seller-orders': return <SellerOrdersScreen onNavigate={handleNavigate} />;
      case 'seller-finance': return <SellerFinanceScreen onNavigate={handleNavigate} />;
      case 'admin-dashboard': return <AdminDashboardScreen onNavigate={handleNavigate} />;
      case 'admin-users': return <AdminUsersScreen onNavigate={handleNavigate} />;
      case 'admin-shops': return <AdminShopsScreen onNavigate={handleNavigate} />;
      default: return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] font-sans text-slate-900 relative">
      {/* Dev Navigation Bar for Prototype */}
      <div className="fixed top-4 left-4 z-50">
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            aria-label="Mở menu điều hướng" // Đã thêm aria-label sửa lỗi Button
            className="rounded-full bg-white shadow-lg border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {isMenuOpen && (
            <div className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1 animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
              <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Customer Journey</div>
              <NavButton active={currentScreen === 'login'} onClick={() => { setCurrentScreen('login'); setIsMenuOpen(false); }}>Đăng nhập</NavButton>
              <NavButton active={currentScreen === 'register'} onClick={() => { setCurrentScreen('register'); setIsMenuOpen(false); }}>Đăng ký</NavButton>
              <NavButton active={currentScreen === 'home'} onClick={() => { setCurrentScreen('home'); setIsMenuOpen(false); }}>Trang chủ</NavButton>
              <NavButton active={currentScreen === 'marketplace'} onClick={() => { setCurrentScreen('marketplace'); setIsMenuOpen(false); }}>Cửa hàng</NavButton>
              <NavButton active={currentScreen === 'product-detail'} onClick={() => { setCurrentScreen('product-detail'); setIsMenuOpen(false); }}>Chi tiết sách</NavButton>
              <NavButton active={currentScreen === 'cart'} onClick={() => { setCurrentScreen('cart'); setIsMenuOpen(false); }}>Giỏ hàng</NavButton>
              <NavButton active={currentScreen === 'profile'} onClick={() => { setCurrentScreen('profile'); setIsMenuOpen(false); }}>Tài khoản</NavButton>
              <NavButton active={currentScreen === 'address-book'} onClick={() => { setCurrentScreen('address-book'); setIsMenuOpen(false); }}>Sổ địa chỉ</NavButton>
              <NavButton active={currentScreen === 'order-history'} onClick={() => { setCurrentScreen('order-history'); setIsMenuOpen(false); }}>Đơn mua</NavButton>
              
              <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider mt-2">Seller Portal</div>
              <NavButton active={currentScreen === 'seller-dashboard'} onClick={() => { setCurrentScreen('seller-dashboard'); setIsMenuOpen(false); }}>Dashboard Người bán</NavButton>
              <NavButton active={currentScreen === 'add-product'} onClick={() => { setCurrentScreen('add-product'); setIsMenuOpen(false); }}>Đăng bán sách</NavButton>
              <NavButton active={currentScreen === 'seller-orders'} onClick={() => { setCurrentScreen('seller-orders'); setIsMenuOpen(false); }}>Quản lý đơn hàng</NavButton>
              <NavButton active={currentScreen === 'seller-finance'} onClick={() => { setCurrentScreen('seller-finance'); setIsMenuOpen(false); }}>Tài chính & Rút tiền</NavButton>
              
              <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider mt-2">Admin</div>
              <NavButton active={currentScreen === 'admin-dashboard'} onClick={() => { setCurrentScreen('admin-dashboard'); setIsMenuOpen(false); }}>Tổng quan</NavButton>
              <NavButton active={currentScreen === 'admin-shops'} onClick={() => { setCurrentScreen('admin-shops'); setIsMenuOpen(false); }}>Quản lý Shop</NavButton>
              <NavButton active={currentScreen === 'admin-users'} onClick={() => { setCurrentScreen('admin-users'); setIsMenuOpen(false); }}>Quản lý User</NavButton>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full h-full">
        {renderScreen()}
      </main>

      {/* Chat Widget (Global) */}
      <ChatWidget />
    </div>
  );
}

function NavButton({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between group ${
        active 
          ? 'bg-[#008080]/10 text-[#008080] font-bold' 
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      {children}
      {active && <span className="w-2 h-2 rounded-full bg-[#008080] animate-pulse" />}
    </button>
  );
}