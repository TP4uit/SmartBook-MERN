import React, { useState, useEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ProfileSidebar } from '../layout/ProfileSidebar';
import { Button } from '../ui/button';
import { Store, Truck, MessageCircle, Loader2 } from 'lucide-react';
import api, { getMyOrders } from '../../services/api';

interface OrderHistoryScreenProps {
  onNavigate: (screen: string) => void;
}

type OrderStatus = 'all' | 'pending' | 'shipping' | 'completed' | 'cancelled';

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  shop_id: { name?: string } | string;
  status: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt?: string;
}

const STATUS_LABEL: Record<string, string> = {
  Pending: 'Chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang giao',
  Delivered: 'Hoàn thành',
  Cancelled: 'Đã hủy',
};

function getStatusStyle(status: string): { bg: string; text: string } {
  switch (status) {
    case 'Delivered': return { bg: 'bg-green-100', text: 'text-green-700' };
    case 'Cancelled': return { bg: 'bg-red-100', text: 'text-red-600' };
    case 'Pending': return { bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'Processing':
    case 'Shipping': return { bg: 'bg-blue-100', text: 'text-blue-700' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

export function OrderHistoryScreen({ onNavigate }: OrderHistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { id: OrderStatus, label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ thanh toán' },
    { id: 'shipping', label: 'Vận chuyển' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'Pending';
    if (activeTab === 'shipping') return order.status === 'Processing' || order.status === 'Shipping';
    if (activeTab === 'completed') return order.status === 'Delivered';
    if (activeTab === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  const shopName = (order: Order) =>
    typeof order.shop_id === 'object' && order.shop_id?.name ? order.shop_id.name : 'Shop';

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar activeScreen="profile" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          
          <ProfileSidebar onNavigate={onNavigate} activeScreen="order-history" />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="flex overflow-x-auto scrollbar-hide">
                 {tabs.map(tab => (
                   <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-[#008080] text-[#008080]' 
                        : 'border-transparent text-gray-500 hover:text-[#008080]'
                    }`}
                   >
                     {tab.label}
                   </button>
                 ))}
               </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#008080]" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                  Chưa có đơn hàng nào.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  const label = STATUS_LABEL[order.status] ?? order.status;
                  const isDelivered = order.status === 'Delivered';
                  return (
                    <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-gray-500" />
                          <span className="font-bold text-gray-900 text-sm">{shopName(order)}</span>
                          <Button variant="outline" size="sm" className="h-6 text-xs border-gray-300">Xem Shop</Button>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-[#008080] flex items-center gap-1">
                            <Truck className="h-4 w-4" /> {isDelivered ? 'Giao hàng thành công' : 'Đơn hàng'}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className={`uppercase font-medium text-xs px-2 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text}`}>
                            {label}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <img src={item.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200'} alt="" className="w-20 h-28 object-cover rounded border border-gray-100" />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm">x{item.qty}</span>
                                <span className="text-[#008080] font-medium">{item.price?.toLocaleString('vi-VN')}đ</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <div className="flex justify-end items-center gap-2 mb-4">
                          <span className="text-sm text-gray-600">Thành tiền:</span>
                          <span className="text-xl font-bold text-[#008080]">{order.totalPrice?.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" className="border-gray-200 text-gray-600">
                            Liên hệ người bán
                          </Button>
                          <Button className="bg-[#008080] hover:bg-[#006666]" onClick={() => onNavigate('marketplace')}>
                            Mua lại
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
