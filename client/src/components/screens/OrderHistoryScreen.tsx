import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ProfileSidebar } from '../layout/ProfileSidebar';
import { Button } from '../ui/button';
import { Store, Truck, ShoppingBag, MessageCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface OrderHistoryScreenProps {
  onNavigate: (screen: string) => void;
}

type OrderStatus = 'all' | 'pending' | 'shipping' | 'completed' | 'cancelled';

export function OrderHistoryScreen({ onNavigate }: OrderHistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  const tabs: { id: OrderStatus, label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ thanh toán' },
    { id: 'shipping', label: 'Vận chuyển' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar onNavigate={onNavigate} activeScreen="profile" />

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
              {[1, 2, 3].map((order) => (
                <div key={order} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                       <Store className="h-4 w-4 text-gray-500" />
                       <span className="font-bold text-gray-900 text-sm">Fahasa Official</span>
                       <Button variant="outline" size="sm" className="h-6 text-xs border-gray-300">Xem Shop</Button>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#008080] flex items-center gap-1">
                        <Truck className="h-4 w-4" /> Giao hàng thành công
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-red-500 uppercase font-medium text-xs">Hoàn thành</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                     <div className="flex gap-4">
                        <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200" className="w-20 h-28 object-cover rounded border border-gray-100" />
                        <div className="flex-1">
                           <h3 className="font-medium text-gray-900 line-clamp-1">Nhà Giả Kim - Phiên bản đặc biệt</h3>
                           <p className="text-gray-500 text-xs mt-1">Phân loại: Bìa cứng</p>
                           <div className="flex items-center justify-between mt-2">
                              <span className="text-sm">x1</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 line-through">105.000đ</span>
                                <span className="text-[#008080] font-medium">79.000đ</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                     <div className="flex justify-end items-center gap-2 mb-4">
                        <span className="text-sm text-gray-600">Thành tiền:</span>
                        <span className="text-xl font-bold text-[#008080]">79.000đ</span>
                     </div>
                     <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-gray-200 text-gray-600">
                          Liên hệ người bán
                        </Button>
                         <Button className="bg-[#008080] hover:bg-[#006666]">
                          Mua lại
                        </Button>
                     </div>
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
