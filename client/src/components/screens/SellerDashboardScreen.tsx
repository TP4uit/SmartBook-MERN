import React, { useEffect, useState } from 'react';
import { SellerSidebar } from '../layout/SellerSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface SellerDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  status: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

export function SellerDashboardScreen({ onNavigate }: SellerDashboardScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    api.get<Order[]>('/orders/seller/orders')
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const todayRevenue = orders
    .filter((o) => o.status === 'Delivered' && o.createdAt?.startsWith(todayStr))
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const recentOrders = orders.slice(0, 5);

  const STATUS_BADGE: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipping: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const STATUS_LABEL: Record<string, string> = {
    Pending: 'Chờ xử lý',
    Processing: 'Đang xử lý',
    Shipping: 'Đang giao',
    Delivered: 'Đã giao',
    Cancelled: 'Đã hủy',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar onNavigate={onNavigate} activeScreen="seller-dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <h2 className="font-bold text-gray-700">Tổng quan shop</h2>
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">Xin chào, <span className="font-bold text-gray-900">{userInfo.shop_info?.shop_name || userInfo.name || 'Shop'}</span></div>
             <img src={userInfo.shop_info?.shop_avatar || "https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=100"} alt="Shop Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
           </div>
        </header>

        <main className="p-8 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Doanh thu hôm nay</p>
                  <h3 className="text-2xl font-bold text-blue-900">{loading ? '...' : `${todayRevenue.toLocaleString('vi-VN')}đ`}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-orange-50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Chờ xác nhận</p>
                  <h3 className="text-2xl font-bold text-orange-900">{loading ? '...' : `${pendingCount} Đơn`}</h3>
                </div>
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700">
                  <Clock className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium mb-1">Đã giao thành công</p>
                  <h3 className="text-2xl font-bold text-green-900">{loading ? '...' : `${deliveredCount} Đơn`}</h3>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table Mockup */}
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#008080]" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Chưa có đơn hàng nào</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="pb-3 font-medium">Mã đơn hàng</th>
                        <th className="pb-3 font-medium">Sản phẩm</th>
                        <th className="pb-3 font-medium">Tổng tiền</th>
                        <th className="pb-3 font-medium">Trạng thái</th>
                        <th className="pb-3 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map((order) => {
                        const itemSummary = order.orderItems.map((i) => `${i.name} x${i.qty}`).join(', ');
                        return (
                          <tr key={order._id} className="group hover:bg-gray-50">
                            <td className="py-4 text-[#008080]">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="py-4 text-gray-900 max-w-[200px] truncate">{itemSummary || '—'}</td>
                            <td className="py-4">{order.totalPrice?.toLocaleString('vi-VN')}đ</td>
                            <td className="py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                {STATUS_LABEL[order.status] || order.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <Button size="sm" variant="outline" className="h-8" onClick={() => onNavigate('seller-orders')}>Chi tiết</Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}


