import React from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Lock, Unlock, MoreVertical, ExternalLink, Star } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface AdminShopsScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminShopsScreen({ onNavigate }: AdminShopsScreenProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar onNavigate={onNavigate} activeScreen="admin-shops" />

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-slate-900">Quản lý Cửa hàng</h2>
           <div className="flex items-center gap-2">
              <div className="relative w-64">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                 <Input className="pl-9 bg-white" placeholder="Tìm kiếm shop..." />
              </div>
              <Button variant="outline">Bộ lọc</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <Card className="bg-white">
             <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Tổng cửa hàng hoạt động</div>
                <div className="text-3xl font-bold text-[#008080]">1,240</div>
                <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                   <span>+12%</span>
                   <span className="text-gray-400">so với tháng trước</span>
                </div>
             </CardContent>
           </Card>
           <Card className="bg-white">
             <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Cửa hàng chờ duyệt</div>
                <div className="text-3xl font-bold text-orange-600">45</div>
                <div className="text-sm text-gray-400 mt-2">Cần xử lý ngay</div>
             </CardContent>
           </Card>
           <Card className="bg-white">
             <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Cửa hàng bị báo cáo</div>
                <div className="text-3xl font-bold text-red-600">3</div>
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
                {[
                  { id: 101, name: 'Fahasa Official', owner: 'Công ty Fahasa', img: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=100', rating: 4.9, revenue: '1.2B', date: '01/01/2023', status: 'active' },
                  { id: 102, name: 'Tiki Trading', owner: 'Tiki Corp', img: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&q=80&w=100', rating: 4.8, revenue: '3.5B', date: '15/02/2023', status: 'active' },
                  { id: 103, name: 'Sách Cũ Giá Rẻ', owner: 'Nguyễn Văn B', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=100', rating: 3.2, revenue: '15M', date: '10/05/2024', status: 'reported' },
                  { id: 104, name: 'SkyBooks', owner: 'SkyBooks Inc', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100', rating: 4.7, revenue: '500M', date: '20/03/2023', status: 'active' },
                  { id: 105, name: 'Tiệm Sách Cũ Hà Nội', owner: 'Trần C', img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&q=80&w=100', rating: 2.1, revenue: '2M', date: '01/06/2026', status: 'banned' },
                ].map((shop) => (
                  <tr key={shop.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{shop.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={shop.img} className="w-10 h-10 rounded border border-gray-100 object-cover" alt={shop.name} />
                        <div>
                           <div className="font-bold text-[#008080]">{shop.name}</div>
                           <div className="text-xs text-gray-500">{shop.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1 text-yellow-500 font-medium">
                          {shop.rating} <Star className="h-3 w-3 fill-current" />
                       </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{shop.revenue}</td>
                    <td className="px-6 py-4 text-slate-500">{shop.date}</td>
                    <td className="px-6 py-4">
                       {shop.status === 'active' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Hoạt động</Badge>}
                       {shop.status === 'reported' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">Bị báo cáo</Badge>}
                       {shop.status === 'banned' && <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Đã khóa</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                             <DropdownMenuItem className="gap-2"><ExternalLink className="h-4 w-4" /> Xem cửa hàng</DropdownMenuItem>
                             {shop.status === 'active' ? (
                                <DropdownMenuItem className="gap-2 text-red-600"><Lock className="h-4 w-4" /> Khóa Shop</DropdownMenuItem>
                             ) : (
                                <DropdownMenuItem className="gap-2 text-green-600"><Unlock className="h-4 w-4" /> Mở khóa</DropdownMenuItem>
                             )}
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
