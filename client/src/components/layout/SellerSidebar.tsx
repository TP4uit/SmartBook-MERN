import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp } from 'lucide-react';

interface SellerSidebarProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

export function SellerSidebar({ onNavigate, activeScreen }: SellerSidebarProps) {
  return (
    <aside className="w-64 bg-[#008080] text-white hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          SmartBook <span className="text-xs bg-[#FFC107] text-[#008080] px-1 rounded">Seller</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <SellerNavLink 
          active={activeScreen === 'seller-dashboard'} 
          icon={<LayoutDashboard className="h-4 w-4"/>} 
          label="Tổng quan" 
          onClick={() => onNavigate('seller-dashboard')}
        />
        <SellerNavLink 
          active={activeScreen === 'add-product'} 
          icon={<Package className="h-4 w-4"/>} 
          label="Sản phẩm" 
          onClick={() => onNavigate('add-product')} 
        />
        <SellerNavLink 
          active={activeScreen === 'seller-orders'} 
          icon={<ShoppingCart className="h-4 w-4"/>} 
          label="Đơn hàng" 
          onClick={() => onNavigate('seller-orders')}
        />
        <SellerNavLink 
          active={activeScreen === 'seller-finance'} 
          icon={<TrendingUp className="h-4 w-4"/>} 
          label="Tài chính" 
          onClick={() => onNavigate('seller-finance')}
        />
      </nav>
      <div className="p-4 border-t border-[#008080]/50">
         <button onClick={() => onNavigate('home')} className="text-sm text-[#F5F5DC] opacity-80 hover:opacity-100">
           &larr; Quay lại trang mua sắm
         </button>
      </div>
    </aside>
  );
}

function SellerNavLink({ active, icon, label, onClick }: { active?: boolean, icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
      active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
