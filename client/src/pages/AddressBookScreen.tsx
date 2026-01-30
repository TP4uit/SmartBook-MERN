import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ProfileSidebar } from '../layout/ProfileSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2, Edit2, CheckCircle, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';

interface AddressBookScreenProps {
  onNavigate: (screen: string) => void;
}

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export function AddressBookScreen({ onNavigate }: AddressBookScreenProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', isDefault: true },
    { id: 2, name: 'Văn Phòng Cty', phone: '0901234567', address: 'Tòa nhà Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh', isDefault: false },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar onNavigate={onNavigate} activeScreen="profile" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          
          <ProfileSidebar onNavigate={onNavigate} activeScreen="address-book" />

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-xl font-bold text-gray-900">Sổ địa chỉ</h2>
                 <p className="text-sm text-gray-500">Quản lý địa chỉ giao hàng</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#008080] hover:bg-[#006666]">
                    <Plus className="mr-2 h-4 w-4" /> Thêm địa chỉ mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Họ và tên</Label>
                          <Input placeholder="Nhập họ tên" className="bg-gray-50" />
                       </div>
                       <div className="space-y-2">
                          <Label>Số điện thoại</Label>
                          <Input placeholder="Nhập số điện thoại" className="bg-gray-50" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)</Label>
                      <Input placeholder="Ví dụ: TP.HCM, Quận 1, Phường Bến Nghé" className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ cụ thể (Số nhà, Tên đường)</Label>
                      <Input placeholder="Ví dụ: 123 Đường Lê Lợi" className="bg-gray-50" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" id="default-addr" className="rounded text-[#008080] focus:ring-[#008080]" />
                      <Label htmlFor="default-addr" className="font-normal cursor-pointer">Đặt làm địa chỉ mặc định</Label>
                    </div>
                    <Button className="w-full bg-[#008080] hover:bg-[#006666] mt-2">Lưu địa chỉ</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-gray-200 rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#008080]/50 transition-colors bg-gray-50/50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 border-r border-gray-300 pr-3">{addr.name}</span>
                      <span className="text-gray-500 text-sm">{addr.phone}</span>
                    </div>
                    <div className="text-gray-600 text-sm flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {addr.address}
                    </div>
                    {addr.isDefault && (
                      <Badge variant="outline" className="border-[#008080] text-[#008080] bg-[#008080]/5 font-normal">
                        Mặc định
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {!addr.isDefault && (
                       <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#008080]">
                         Thiết lập mặc định
                       </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!addr.isDefault && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
