import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ShoppingCart, User, Search, Store, LogOut, ShoppingBag, Shield } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NavbarProps {
  onNavigate: (screen: string) => void;
  hideSearch?: boolean;
  activeScreen?: string;
}

export function Navbar({ onNavigate, hideSearch, activeScreen }: NavbarProps) {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    onNavigate('home');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        
        {/* 1. LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-[#008080] rounded-xl flex items-center justify-center shadow-lg shadow-[#008080]/20">
            <Store className="h-6 w-6 text-[#FFC107]" />
          </div>
          <span className="text-2xl font-bold text-[#008080] hidden md:block tracking-tight">
            SmartBook
          </span>
        </div>

        {/* 2. SEARCH BAR */}
        {!hideSearch && (
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-[#008080] py-5 rounded-xl"
                placeholder="Tìm kiếm sách..."
              />
            </div>
          </div>
        )}

        {/* 3. RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          
          <Button variant="ghost" className="text-gray-500 hover:text-[#008080] font-medium" onClick={() => onNavigate('marketplace')}>
            Cửa hàng
          </Button>

          <div className="h-6 w-px bg-gray-200"></div>

          {userInfo ? (
            // === ĐÃ ĐĂNG NHẬP ===
            <>
              {/* Giỏ hàng: Đã fix cứng khung bao icon để Badge không bị lệch */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:text-[#008080] overflow-visible" // overflow-visible để chấm đỏ không bị cắt
                onClick={() => onNavigate('cart')}
              >
                {/* Khung relative có size cố định bằng icon (w-6 h-6) */}
                <div className="relative w-6 h-6">
                  <ShoppingCart className="w-6 h-6" /> 
                  {/* Badge treo ở góc trên-phải (-top-1 -right-1) */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                    <Avatar className="h-9 w-9 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#008080]/20 transition-all">
                      <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                      <AvatarFallback className="bg-[#008080] text-white font-bold">
                        {userInfo.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userInfo.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => onNavigate('profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('order-history')} className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Đơn mua
                  </DropdownMenuItem>

                  {userInfo.role === 'admin' && (
                    <DropdownMenuItem onClick={() => onNavigate('admin-dashboard')} className="cursor-pointer text-purple-600">
                      <Shield className="mr-2 h-4 w-4" /> Quản trị viên
                    </DropdownMenuItem>
                  )}

                  {userInfo.role === 'seller' && (
                     <DropdownMenuItem onClick={() => onNavigate('seller-dashboard')} className="cursor-pointer text-blue-600">
                      <Store className="mr-2 h-4 w-4" /> Kênh người bán
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // === CHƯA ĐĂNG NHẬP ===
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => onNavigate('login')} className="font-medium text-gray-600">
                Đăng nhập
              </Button>
              <Button 
                className="bg-[#008080] hover:bg-[#006666] text-white shadow-md shadow-[#008080]/20"
                onClick={() => onNavigate('register')}
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}