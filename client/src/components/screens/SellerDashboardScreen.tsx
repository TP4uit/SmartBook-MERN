import React from 'react';
import { SellerSidebar } from '../layout/SellerSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface SellerDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function SellerDashboardScreen({ onNavigate }: SellerDashboardScreenProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar onNavigate={onNavigate} activeScreen="seller-dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <h2 className="font-bold text-gray-700">Tổng quan shop</h2>
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">Xin chào, <span className="font-bold text-gray-900">BookStore Official</span></div>
             <img src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full border border-gray-200" />
           </div>
        </header>

        <main className="p-8 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Doanh thu hôm nay</p>
                  <h3 className="text-2xl font-bold text-blue-900">1.250.000đ</h3>
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
                  <h3 className="text-2xl font-bold text-orange-900">12 Đơn</h3>
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
                  <h3 className="text-2xl font-bold text-green-900">158 Đơn</h3>
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
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="group hover:bg-gray-50">
                        <td className="py-4 text-[#008080]">#ORD-2026-{i}23</td>
                        <td className="py-4 text-gray-900">Đắc Nhân Tâm x1...</td>
                        <td className="py-4">86.000đ</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Chờ xử lý
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button size="sm" variant="outline" className="h-8">Chi tiết</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}


