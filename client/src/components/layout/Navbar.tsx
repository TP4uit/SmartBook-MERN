import React from 'react';
import { ShoppingCart, User, Bell, Search, Sparkles, Store } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface NavbarProps {
  onNavigate: (screen: any) => void;
  hideSearch?: boolean;
  activeScreen?: string;
}

export function Navbar({ onNavigate, hideSearch = false, activeScreen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#008080]/10 bg-[#F5F5DC]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#008080] flex items-center justify-center transition-transform group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-[#FFC107]" />
          </div>
          <span className="text-xl font-bold text-[#008080] tracking-tight">SmartBook</span>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink 
            label="Trang chủ" 
            isActive={activeScreen === 'home'} 
            onClick={() => onNavigate('home')} 
          />
          <NavLink 
            label="Cửa hàng" 
            isActive={activeScreen === 'marketplace' || activeScreen === 'product-detail'} 
            onClick={() => onNavigate('marketplace')} 
          />
          {/* "Đơn hàng" link removed as requested */}
        </nav>

        {/* Search Bar (Optional) */}
        {!hideSearch && (
          <div className="hidden lg:flex items-center relative max-w-md w-full mx-4">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <Input 
              className="pl-9 bg-white border-[#008080]/20 focus-visible:ring-[#008080]" 
              placeholder="Tìm kiếm sách..." 
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-[#008080] hover:bg-[#008080]/10"
            onClick={() => onNavigate('seller-dashboard')}
          >
            <Store className="h-5 w-5" />
            <span>Kênh người bán</span>
          </Button>

          <div className="h-6 w-px bg-gray-200 hidden md:block" />

          <Button 
            variant="ghost" 
            size="icon" 
            className={`transition-colors ${activeScreen === 'cart' ? 'bg-[#008080]/10 text-[#008080]' : 'hover:bg-[#008080]/10 hover:text-[#008080]'}`} 
            onClick={() => onNavigate('cart')}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#008080]/10 hover:text-[#008080]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full overflow-hidden transition-all ${activeScreen === 'profile' ? 'ring-2 ring-[#008080]' : 'hover:ring-2 hover:ring-[#008080]/20'}`}
            onClick={() => onNavigate('profile')}
          >
            <img 
              src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100" 
              alt="User" 
              className="h-8 w-8 object-cover"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`text-sm font-medium transition-all relative py-2 ${
        isActive ? 'text-[#008080]' : 'text-gray-600 hover:text-[#008080]'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#008080] rounded-full animate-in zoom-in duration-300" />
      )}
    </button>
  );
}
