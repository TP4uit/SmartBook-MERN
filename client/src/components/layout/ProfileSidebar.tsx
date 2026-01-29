import React from 'react';
import { User, MapPin, ShoppingBag, Store, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ProfileSidebarProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

export function ProfileSidebar({ onNavigate, activeScreen }: ProfileSidebarProps) {
  return (
    <aside className="w-full md:w-64 space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
        <Avatar className="h-12 w-12 border-2 border-[#008080]">
          <AvatarImage src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=200" />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold text-gray-900">Nguyễn Văn A</div>
          <div className="text-xs text-gray-500">Thành viên Bạc</div>
        </div>
      </div>

      <nav className="space-y-1">
        <MenuLink 
          active={activeScreen === 'profile'} 
          icon={<User className="h-4 w-4"/>} 
          label="Hồ sơ của tôi" 
          onClick={() => onNavigate('profile')}
        />
        <MenuLink 
          active={activeScreen === 'address-book'} 
          icon={<MapPin className="h-4 w-4"/>} 
          label="Sổ địa chỉ" 
          onClick={() => onNavigate('address-book')}
        />
        <MenuLink 
          active={activeScreen === 'order-history'} 
          icon={<ShoppingBag className="h-4 w-4"/>} 
          label="Đơn mua" 
          onClick={() => onNavigate('order-history')}
        />
        <div className="pt-4 mt-4 border-t border-gray-200">
          <button 
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#FFC107] hover:bg-[#FFC107]/10 rounded-lg transition-colors"
            onClick={() => onNavigate('seller-dashboard')}
          >
            <Store className="h-4 w-4" />
            <span>Kênh người bán</span>
          </button>
        </div>
        <div className="pt-2">
           <button 
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => onNavigate('login')}
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

function MenuLink({ active, icon, label, onClick }: { active?: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      active ? 'bg-[#008080]/10 text-[#008080]' : 'text-gray-600 hover:bg-gray-50'
    }`}>
      <span className={active ? 'text-[#008080]' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
