import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateLogin: () => void;
}

export function RegisterScreen({ onRegister, onNavigateLogin }: RegisterScreenProps) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left: Inspiring Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#008080]/20 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1543320996-542b8a0e022c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
          alt="Reading" 
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white p-6 bg-black/30 backdrop-blur-sm rounded-xl max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#FFC107]" />
            <span className="font-bold text-lg">SmartBook AI</span>
          </div>
          <p className="text-xl font-light leading-relaxed">
            "Tham gia cộng đồng đọc sách thông minh. Khám phá thế giới tri thức vô tận."
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F5F5DC]/30">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#008080] rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-[#FFC107]" />
            </div>
            <h2 className="text-3xl font-bold text-[#008080] mb-2">Đăng ký</h2>
            <p className="text-gray-500">Tạo tài khoản mới tại SmartBook</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" placeholder="Nguyễn Văn A" className="bg-gray-50 border-gray-200" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" className="bg-gray-50 border-gray-200" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" required className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input id="confirm-password" type="password" required className="bg-gray-50 border-gray-200" />
            </div>
            
            <Button type="submit" className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 text-lg shadow-lg shadow-[#008080]/20 flex items-center justify-center gap-2">
              Tiếp tục <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>

          <div className="text-center text-sm">
            Đã có tài khoản?{' '}
            <button onClick={onNavigateLogin} className="font-bold text-[#008080] hover:underline">
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
