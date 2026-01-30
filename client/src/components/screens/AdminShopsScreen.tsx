import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Lock, Unlock, MoreVertical, ExternalLink, Star, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import api from '../../services/api';

interface AdminShopsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Shop {
  _id: string;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  shop_info?: {
    shop_name?: string;
    shop_avatar?: string;
    rating?: number;
  };
  totalRevenue?: number;
  orderCount?: number;
  createdAt: string;
}

export function AdminShopsScreen({ onNavigate }: AdminShopsScreenProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Shop[]>('/admin/shops');
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch shops error:', err);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (shopId: string) => {
    setActionLoading(shopId);
    try {
      await api.put(`/admin/users/${shopId}/status`);
      await fetchShops();
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredShops = shops.filter(
    (s) =>
      (s.shop_info?.shop_name || s.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = shops.filter((s) => s.status === 'active').length;
  const bannedCount = shops.filter((s) => s.status === 'banned').length;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatRevenue = (amount?: number) => {
    if (!amount) return '0đ';
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(0)}K`;
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar onNavigate={onNavigate} activeScreen="admin-shops" />

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-slate-900">Quản lý Cửa hàng</h2>
           <div className="flex items-center gap-2">
              <div className="relative w-64">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                 <Input className="pl-9 bg-white" placeholder="Tìm kiếm shop..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Button variant="outline">Bộ lọc</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <Card className="bg-white">
             <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Tổng cửa hàng hoạt động</div>
                <div className="text-3xl font-bold text-[#008080]">{loading ? '...' : activeCount.toLocaleString()}</div>
                <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                   <span>+12%</span>
                   <span className="text-gray-400">so với tháng trước</span>
                </div>
             </CardContent>
           </Card>
           <Card className="bg-white">
             <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Tổng số Shop</div>
                <div className="text-3xl font-bold text-orange-600">{loading ? '...' : shops.length}</div>
                <div className="text-sm text-gray-400 mt-2">Tất cả người bán</div>
             </CardContent>
           </Card>
           <Card className="bg-white">
             <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Cửa hàng đã khóa</div>
                <div className="text-3xl font-bold text-red-600">{loading ? '...' : bannedCount}</div>
                <div className="text-sm text-gray-400 mt-2">Vi phạm chính sách</div>
             </CardContent>
           </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Danh sách Shop</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Thông tin Shop</th>
                  <th className="px-6 py-4">Đánh giá</th>
                  <th className="px-6 py-4">Doanh thu</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#008080] mx-auto" />
                    </td>
                  </tr>
                ) : filteredShops.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Không tìm thấy shop nào</td>
                  </tr>
                ) : (
                  filteredShops.map((shop) => {
                    const shopName = shop.shop_info?.shop_name || shop.name;
                    const shopAvatar = shop.shop_info?.shop_avatar || shop.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=008080&color=fff`;
                    const rating = shop.shop_info?.rating ?? 0;
                    return (
                      <tr key={shop._id} className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">#{shop._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={shopAvatar} className="w-10 h-10 rounded border border-gray-100 object-cover" alt={shopName} />
                            <div>
                               <div className="font-bold text-[#008080]">{shopName}</div>
                               <div className="text-xs text-gray-500">{shop.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-1 text-yellow-500 font-medium">
                              {rating.toFixed(1)} <Star className="h-3 w-3 fill-current" />
                           </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatRevenue(shop.totalRevenue)}</td>
                        <td className="px-6 py-4 text-slate-500">{formatDate(shop.createdAt)}</td>
                        <td className="px-6 py-4">
                           {shop.status === 'active' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Hoạt động</Badge>}
                           {shop.status === 'banned' && <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Đã khóa</Badge>}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button size="icon" variant="ghost" className="h-8 w-8" disabled={actionLoading === shop._id}>
                                    {actionLoading === shop._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                 <DropdownMenuItem className="gap-2"><ExternalLink className="h-4 w-4" /> Xem cửa hàng</DropdownMenuItem>
                                 {shop.status === 'active' ? (
                                    <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleToggleStatus(shop._id)}><Lock className="h-4 w-4" /> Khóa Shop</DropdownMenuItem>
                                 ) : (
                                    <DropdownMenuItem className="gap-2 text-green-600" onClick={() => handleToggleStatus(shop._id)}><Unlock className="h-4 w-4" /> Mở khóa</DropdownMenuItem>
                                 )}
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
