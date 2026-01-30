import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateLogin: () => void;
}

export function RegisterScreen({ onRegister, onNavigateLogin }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      
      // Auto login sau khi đăng ký thành công
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));

      onRegister(); // Chuyển về Home hoặc Login
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
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

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required className="bg-gray-50 border-gray-200"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-gray-50 border-gray-200"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-gray-50 border-gray-200"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-gray-50 border-gray-200"/>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 text-lg shadow-lg shadow-[#008080]/20 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" /> : <>Tiếp tục <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>

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