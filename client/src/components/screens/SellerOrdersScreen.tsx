import React, { useState } from 'react';
import { SellerSidebar } from '../layout/SellerSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Check, X, Eye, Truck, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';

interface SellerOrdersScreenProps {
  onNavigate: (screen: string) => void;
}

type OrderTab = 'new' | 'history';

export function SellerOrdersScreen({ onNavigate }: SellerOrdersScreenProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('new');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar onNavigate={onNavigate} activeScreen="seller-orders" />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <h2 className="font-bold text-gray-700">Quản lý đơn hàng</h2>
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">Xin chào, <span className="font-bold text-gray-900">BookStore Official</span></div>
             <img src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full border border-gray-200" />
           </div>
        </header>

        <main className="p-8 overflow-auto">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'new' ? 'bg-white text-[#008080] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đơn hàng mới
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'history' ? 'bg-white text-[#008080] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lịch sử đơn hàng
            </button>
          </div>

          {activeTab === 'new' ? (
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <Card key={order} className="overflow-hidden border border-gray-200 shadow-sm">
                  <div className="p-4 bg-yellow-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#008080]">#ORD-2026-NEW{order}</span>
                      <span className="text-sm text-gray-500">Đặt lúc: 10:30 15/06/2026</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-none hover:bg-yellow-200">Chờ xác nhận</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex gap-4 mb-4">
                      <img src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100&random=${order}`} className="w-16 h-20 object-cover rounded bg-gray-100" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Nhà Giả Kim (Tái bản 2026)</h4>
                        <div className="text-sm text-gray-500 mt-1">Số lượng: x1</div>
                        <div className="text-[#008080] font-bold mt-1">79.000đ</div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Người nhận: Nguyễn Văn A</div>
                        <div>SĐT: 0901234567</div>
                        <div className="text-xs text-gray-400 max-w-[200px] truncate">123 Đường Nguyễn Huệ, Q.1...</div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                       <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                         <X className="mr-2 h-4 w-4" /> Hủy đơn
                       </Button>
                       <Button className="bg-[#008080] hover:bg-[#006666]">
                         <Check className="mr-2 h-4 w-4" /> Xác nhận đơn hàng
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Mã đơn hàng</th>
                      <th className="px-6 py-4">Ngày đặt</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Tổng tiền</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">#ORD-2026-HIS{i}</td>
                        <td className="px-6 py-4 text-gray-500">12/06/2026</td>
                        <td className="px-6 py-4">Nguyễn Văn B</td>
                        <td className="px-6 py-4 font-medium">150.000đ</td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                             <CheckCircle className="h-3 w-3" /> Đã giao
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-[#008080]">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white">
                              <DialogHeader>
                                <DialogTitle>Chi tiết đơn hàng #ORD-2026-HIS{i}</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-8 py-4">
                                <div>
                                  <h4 className="font-bold mb-2 text-sm text-gray-900">Thông tin người nhận</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p>Họ tên: Nguyễn Văn B</p>
                                    <p>SĐT: 0987654321</p>
                                    <p>Địa chỉ: 456 Lê Văn Sỹ, Q.3, TP.HCM</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-bold mb-2 text-sm text-gray-900">Trạng thái vận chuyển</h4>
                                   <div className="text-sm text-gray-600 space-y-1">
                                    <p className="flex items-center gap-2"><Truck className="h-3 w-3" /> Giao hàng tiết kiệm</p>
                                    <p className="text-green-600 font-medium">Giao thành công 14:00 14/06/2026</p>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t border-gray-100 pt-4">
                                <h4 className="font-bold mb-3 text-sm text-gray-900">Sản phẩm</h4>
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span>Đắc Nhân Tâm x1</span>
                                  <span>86.000đ</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span>Cây Cam Ngọt Của Tôi x1</span>
                                  <span>64.000đ</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-lg text-[#008080] border-t border-gray-100 pt-2 mt-2">
                                  <span>Tổng cộng</span>
                                  <span>150.000đ</span>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}
