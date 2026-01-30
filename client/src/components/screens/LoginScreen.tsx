import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner'; // Giả sử bạn đã cài sonner, hoặc dùng alert thường

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateRegister: () => void;
}

export function LoginScreen({ onLogin, onNavigateRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // 1. Lưu token và thông tin user
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // 2. Thông báo thành công
      // toast.success("Đăng nhập thành công!"); 
      
      // 3. Chuyển hướng (gọi callback về App.tsx)
      onLogin(); 

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left: Inspiring Image (Giữ nguyên UI cũ) */}
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
            "Sách là giấc mơ bạn cầm trên tay. Hãy để AI giúp bạn tìm thấy giấc mơ tiếp theo."
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
            <h2 className="text-3xl font-bold text-[#008080] mb-2">Đăng nhập</h2>
            <p className="text-gray-500">Chào mừng bạn trở lại với SmartBook</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="bg-gray-50 border-gray-200" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <a href="#" className="text-sm font-medium text-[#008080] hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-gray-50 border-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 text-lg shadow-lg shadow-[#008080]/20">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Đăng Nhập"}
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
            Chưa có tài khoản?{' '}
            <button onClick={onNavigateRegister} className="font-bold text-[#008080] hover:underline">
              Đăng ký tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}