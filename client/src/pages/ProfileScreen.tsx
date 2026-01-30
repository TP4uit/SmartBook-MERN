import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ProfileSidebar } from '../layout/ProfileSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Camera, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  fromRegister?: boolean;
}

export function ProfileScreen({ onNavigate, fromRegister }: ProfileScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar onNavigate={onNavigate} activeScreen="profile" />

      <main className="container mx-auto px-4 py-8 flex-1">
        {fromRegister && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 animate-in slide-in-from-top-4 duration-500">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                    <h4 className="font-bold text-sm">Đăng ký thành công!</h4>
                    <p className="text-xs mt-1 opacity-90">Vui lòng cập nhật đầy đủ thông tin hồ sơ để bắt đầu mua sắm dễ dàng hơn.</p>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          
          <ProfileSidebar onNavigate={onNavigate} activeScreen="profile" />

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">Hồ sơ cá nhân</h2>
              <p className="text-sm text-gray-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-12">
              <form className="flex-1 space-y-6">
                <div className="grid gap-2">
                  <Label>Tên đăng nhập</Label>
                  <div className="text-gray-900 font-medium">nguyenvana123</div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input id="fullname" defaultValue="Nguyễn Văn A" className="bg-gray-50" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input id="email" defaultValue="nguyen****@gmail.com" disabled className="bg-gray-100 flex-1" />
                    <button className="text-sm text-[#008080] hover:underline">Thay đổi</button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex items-center gap-2">
                     <Input id="phone" defaultValue="********89" disabled className="bg-gray-100 flex-1" />
                     <button className="text-sm text-[#008080] hover:underline">Thay đổi</button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Giới tính</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" defaultChecked className="text-[#008080] focus:ring-[#008080]" />
                      <span className="text-sm">Nam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" className="text-[#008080] focus:ring-[#008080]" />
                      <span className="text-sm">Nữ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" className="text-[#008080] focus:ring-[#008080]" />
                      <span className="text-sm">Khác</span>
                    </label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Ngày sinh</Label>
                  <div className="flex gap-2">
                     <select className="border border-gray-200 rounded-md p-2 text-sm flex-1 bg-gray-50">
                        <option>Ngày 1</option>
                     </select>
                      <select className="border border-gray-200 rounded-md p-2 text-sm flex-1 bg-gray-50">
                        <option>Tháng 1</option>
                     </select>
                      <select className="border border-gray-200 rounded-md p-2 text-sm flex-1 bg-gray-50">
                        <option>1990</option>
                     </select>
                  </div>
                </div>

                <Button className="bg-[#008080] hover:bg-[#006666] px-8">Lưu thay đổi</Button>
              </form>

              <div className="flex flex-col items-center gap-4 border-l border-gray-100 md:pl-12">
                <Avatar className="h-32 w-32 border-4 border-gray-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=300" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="border-gray-200 text-gray-600">
                  <Camera className="mr-2 h-4 w-4" /> Chọn ảnh
                </Button>
                <div className="text-xs text-gray-400 text-center">
                  Dụng lượng file tối đa 1 MB<br/>
                  Định dạng: .JPEG, .PNG
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
