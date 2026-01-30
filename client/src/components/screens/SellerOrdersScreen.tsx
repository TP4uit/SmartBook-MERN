import React, { useState, useEffect } from 'react';
import { SellerSidebar } from '../layout/SellerSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Check, X, Eye, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import api from '../../services/api';

interface SellerOrdersScreenProps {
  onNavigate: (screen: string) => void;
}

type OrderTab = 'new' | 'history';

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  user?: { name?: string; email?: string };
  status: string;
  orderItems: OrderItem[];
  shippingAddress?: { address?: string; city?: string };
  totalPrice: number;
  createdAt: string;
}

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  Pending: { className: 'bg-yellow-100 text-yellow-800 border-none hover:bg-yellow-200', label: 'Chờ xác nhận' },
  Processing: { className: 'bg-blue-100 text-blue-800 border-none hover:bg-blue-200', label: 'Đang xử lý' },
  Shipping: { className: 'bg-purple-100 text-purple-800 border-none hover:bg-purple-200', label: 'Đang giao' },
  Delivered: { className: 'bg-green-100 text-green-800 border-none hover:bg-green-200', label: 'Đã giao' },
  Cancelled: { className: 'bg-red-100 text-red-800 border-none hover:bg-red-200', label: 'Đã hủy' },
};

export function SellerOrdersScreen({ onNavigate }: SellerOrdersScreenProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('new');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Order[]>('/orders/seller/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch seller orders error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      console.error('Update status error:', err);
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const newOrders = orders.filter((o) => o.status === 'Pending');
  const historyOrders = orders.filter((o) => o.status !== 'Pending');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar onNavigate={onNavigate} activeScreen="seller-orders" />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <h2 className="font-bold text-gray-700">Quản lý đơn hàng</h2>
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">Xin chào, <span className="font-bold text-gray-900">{userInfo.shop_info?.shop_name || userInfo.name || 'Shop'}</span></div>
             <img src={userInfo.shop_info?.shop_avatar || "https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=100"} alt="Shop Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#008080]" />
                </div>
              ) : newOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Không có đơn hàng mới</div>
              ) : (
                newOrders.map((order) => (
                  <Card key={order._id} className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="p-4 bg-yellow-50/50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#008080]">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-sm text-gray-500">Đặt lúc: {formatDate(order.createdAt)}</span>
                      </div>
                      <Badge className={STATUS_BADGE[order.status]?.className || 'bg-gray-100'}>{STATUS_BADGE[order.status]?.label || order.status}</Badge>
                    </div>
                    <CardContent className="p-4">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 mb-4">
                          <img src={item.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100'} alt={item.name} className="w-16 h-20 object-cover rounded bg-gray-100" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <div className="text-sm text-gray-500 mt-1">Số lượng: x{item.qty}</div>
                            <div className="text-[#008080] font-bold mt-1">{item.price?.toLocaleString('vi-VN')}đ</div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>Người nhận: {order.user?.name || '—'}</div>
                            <div>Email: {order.user?.email || '—'}</div>
                            <div className="text-xs text-gray-400 max-w-[200px] truncate">{order.shippingAddress?.address || '—'}</div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                         <Button 
                           variant="outline" 
                           className="text-red-600 border-red-200 hover:bg-red-50"
                           disabled={actionLoading === order._id}
                           onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                         >
                           {actionLoading === order._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />} Hủy đơn
                         </Button>
                         <Button 
                           className="bg-[#008080] hover:bg-[#006666]"
                           disabled={actionLoading === order._id}
                           onClick={() => handleUpdateStatus(order._id, 'Processing')}
                         >
                           {actionLoading === order._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Xác nhận đơn hàng
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#008080]" />
                  </div>
                ) : historyOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Chưa có lịch sử đơn hàng</div>
                ) : (
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
                      {historyOrders.map((order) => {
                        const badge = STATUS_BADGE[order.status] || { className: 'bg-gray-100 text-gray-800', label: order.status };
                        return (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td className="px-6 py-4">{order.user?.name || '—'}</td>
                            <td className="px-6 py-4 font-medium">{order.totalPrice?.toLocaleString('vi-VN')}đ</td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                                 {order.status === 'Delivered' && <CheckCircle className="h-3 w-3" />} {badge.label}
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
                                    <DialogTitle>Chi tiết đơn hàng #{order._id.slice(-8).toUpperCase()}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-8 py-4">
                                    <div>
                                      <h4 className="font-bold mb-2 text-sm text-gray-900">Thông tin người nhận</h4>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p>Họ tên: {order.user?.name || '—'}</p>
                                        <p>Email: {order.user?.email || '—'}</p>
                                        <p>Địa chỉ: {order.shippingAddress?.address || '—'}, {order.shippingAddress?.city || ''}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-bold mb-2 text-sm text-gray-900">Trạng thái vận chuyển</h4>
                                       <div className="text-sm text-gray-600 space-y-1">
                                        <p className="flex items-center gap-2"><Truck className="h-3 w-3" /> Giao hàng tiết kiệm</p>
                                        <p className={order.status === 'Delivered' ? 'text-green-600 font-medium' : 'text-gray-600'}>{badge.label}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-t border-gray-100 pt-4">
                                    <h4 className="font-bold mb-3 text-sm text-gray-900">Sản phẩm</h4>
                                    {order.orderItems.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm mb-2">
                                        <span>{item.name} x{item.qty}</span>
                                        <span>{(item.price * item.qty)?.toLocaleString('vi-VN')}đ</span>
                                      </div>
                                    ))}
                                    <div className="flex items-center justify-between font-bold text-lg text-[#008080] border-t border-gray-100 pt-2 mt-2">
                                      <span>Tổng cộng</span>
                                      <span>{order.totalPrice?.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
             </div>
          )}

        </main>
      </div>
    </div>
  );
}
