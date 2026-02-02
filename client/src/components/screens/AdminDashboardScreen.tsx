import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Store, DollarSign, ShoppingCart, Lock, Unlock, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface AdminDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

interface Stats {
  totalUsers: number;
  totalSellers: number;
  activeSellers: number;
  bannedSellers: number;
  totalOrders: number;
  totalSales: number;
  totalProducts?: number;
}

interface ShopRow {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  shop_info?: { shop_name?: string };
  totalRevenue?: number;
  orderCount?: number;
}

function formatMoney(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} Tỷ`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} Triệu`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(n);
}

export function AdminDashboardScreen({ onNavigate }: AdminDashboardScreenProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [shops, setShops] = useState<ShopRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingShops, setLoadingShops] = useState(true);

  useEffect(() => {
    api.get<Stats>('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get<ShopRow[]>('/admin/shops')
      .then(({ data }) => setShops(Array.isArray(data) ? data : []))
      .catch(() => setShops([]))
      .finally(() => setLoadingShops(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar onNavigate={onNavigate} activeScreen="admin-dashboard" />

      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Quản Trị</h2>

        {/* Overview Cards - Dữ liệu thật từ API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng User</p>
                  <h3 className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats ? formatMoney(stats.totalUsers) : '—')}
                  </h3>
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
                  <h3 className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats ? String(stats.totalSellers) : '—')}
                  </h3>
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
                  <h3 className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats ? formatMoney(stats.totalSales)) : '—'}
                  </h3>
                </div>
              </CardContent>
           </Card>
        </div>

        {/* Thêm card Tổng đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                  <h3 className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats ? String(stats.totalOrders) : '—')}
                  </h3>
                </div>
              </CardContent>
           </Card>
        </div>

        {/* Shops Management Table - Dữ liệu thật từ GET /api/admin/shops */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Danh sách cửa hàng</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Tên Shop</th>
                  <th className="px-6 py-4">Chủ sở hữu</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4">Doanh thu</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingShops ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : shops.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Chưa có cửa hàng nào.</td></tr>
                ) : (
                  shops.map((shop) => (
                    <tr key={shop._id} className="bg-white hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-[#008080]">{shop.shop_info?.shop_name || shop.name}</td>
                      <td className="px-6 py-4">{shop.name}</td>
                      <td className="px-6 py-4">{shop.createdAt ? new Date(shop.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                      <td className="px-6 py-4">{shop.totalRevenue != null ? `${(shop.totalRevenue / 1e6).toFixed(1)} Triệu` : '—'}</td>
                      <td className="px-6 py-4">
                        {shop.status === 'active' ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Hoạt động</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Bị khóa</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Button size="icon" variant="ghost" className={shop.status === 'active' ? 'text-green-600' : 'text-red-600'} onClick={() => onNavigate('admin-shops')}>
                           {shop.status === 'active' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                         </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
