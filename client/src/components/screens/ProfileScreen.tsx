import React, { useEffect, useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ProfileSidebar } from '../layout/ProfileSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import api from '../../services/api';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  fromRegister?: boolean;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  avatar?: string;
}

export function ProfileScreen({ onNavigate, fromRegister }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<UserProfile>('/auth/profile');
      setProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const { data } = await api.put<UserProfile & { token: string }>('/auth/profile', {
        name,
        phone,
        address,
      });
      // Cập nhật localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, name: data.name, phone: data.phone, address: data.address }));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setSuccessMsg('Cập nhật thành công!');
      await fetchProfile();
    } catch (err) {
      console.error('Update profile error:', err);
      alert('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const maskEmail = (email?: string) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (local.length <= 3) return email;
    return `${local.slice(0, 3)}****@${domain}`;
  };

  const maskPhone = (ph?: string) => {
    if (!ph || ph.length < 4) return ph || '';
    return '********' + ph.slice(-2);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar activeScreen="profile" />

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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#008080]" />
              </div>
            ) : (
              <div className="flex flex-col-reverse md:flex-row gap-12">
                <form className="flex-1 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                  <div className="grid gap-2">
                    <Label>Tên đăng nhập</Label>
                    <div className="text-gray-900 font-medium">{profile?.email?.split('@')[0] || '—'}</div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Input id="email" value={maskEmail(profile?.email)} disabled className="bg-gray-100 flex-1" />
                      <button type="button" className="text-sm text-[#008080] hover:underline">Thay đổi</button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="flex items-center gap-2">
                       <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-gray-50 flex-1" placeholder="Nhập số điện thoại" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-gray-50" placeholder="Nhập địa chỉ" />
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
                       <select title="Ngày sinh" aria-label="Ngày sinh" className="border border-gray-200 rounded-md p-2 text-sm flex-1 bg-gray-50">
                          <option>Ngày 1</option>
                       </select>
                        <select title="Tháng sinh" aria-label="Tháng sinh" className="border border-gray-200 rounded-md p-2 text-sm flex-1 bg-gray-50">
                          <option>Tháng 1</option>
                       </select>
                        <select title="Năm sinh" aria-label="Năm sinh" className="border border-gray-200 rounded-md p-2 text-sm flex-1 bg-gray-50">
                          <option>1990</option>
                       </select>
                    </div>
                  </div>

                  {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

                  <Button type="submit" className="bg-[#008080] hover:bg-[#006666] px-8" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Lưu thay đổi
                  </Button>
                </form>

                <div className="flex flex-col items-center gap-4 border-l border-gray-100 md:pl-12">
                  <Avatar className="h-32 w-32 border-4 border-gray-100">
                    <AvatarImage src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'U')}&background=008080&color=fff&size=300`} />
                    <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
