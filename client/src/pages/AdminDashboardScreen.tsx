import React from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Store, DollarSign, Activity, Lock, Unlock } from 'lucide-react';

interface AdminDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminDashboardScreen({ onNavigate }: AdminDashboardScreenProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar onNavigate={onNavigate} activeScreen="admin-dashboard" />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Quản Trị</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng User</p>
                  <h3 className="text-2xl font-bold">24.5k</h3>
                </div>
              </CardContent>
           </Card>

           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng Shop</p>
                  <h3 className="text-2xl font-bold">1,204</h3>
                </div>
              </CardContent>
           </Card>

           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Doanh thu sàn</p>
                  <h3 className="text-2xl font-bold">2.4 Tỷ</h3>
                </div>
              </CardContent>
           </Card>
        </div>

        {/* Shops Management Table */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Danh sách cửa hàng</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Tên Shop</th>
                  <th className="px-6 py-4">Chủ sở hữu</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 1, name: 'Fahasa Official', owner: 'Công ty Fahasa', date: '01/01/2023', status: 'active' },
                  { id: 2, name: 'Tiki Trading', owner: 'Tiki Corp', date: '15/02/2023', status: 'active' },
                  { id: 3, name: 'Sách Cũ Giá Rẻ', owner: 'Nguyễn Văn B', date: '10/05/2024', status: 'banned' },
                  { id: 4, name: 'Nhã Nam', owner: 'Nhã Nam Pub', date: '20/03/2023', status: 'active' },
                  { id: 5, name: 'Alpha Books', owner: 'Alpha Corp', date: '12/04/2023', status: 'active' },
                ].map((shop) => (
                  <tr key={shop.id} className="bg-white hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">#{shop.id}</td>
                    <td className="px-6 py-4 font-bold text-[#008080]">{shop.name}</td>
                    <td className="px-6 py-4">{shop.owner}</td>
                    <td className="px-6 py-4">{shop.date}</td>
                    <td className="px-6 py-4">
                      {shop.status === 'active' ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Hoạt động</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Bị khóa</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button size="icon" variant="ghost" className={shop.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                         {shop.status === 'active' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                       </Button>
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
