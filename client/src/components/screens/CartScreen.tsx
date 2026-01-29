import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Trash2, Store, Ticket } from 'lucide-react';

interface CartScreenProps {
  onNavigate: (screen: string) => void;
}

export function CartScreen({ onNavigate }: CartScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar onNavigate={onNavigate} activeScreen="cart" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-[#008080] mb-6">Giỏ hàng của bạn</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            
            {/* Package 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Checkbox />
                <Store className="h-4 w-4 text-gray-500" />
                <span className="font-bold text-gray-900">Gói hàng 1 - Shop Fahasa</span>
              </div>
              
              <div className="p-4 space-y-6">
                 <CartItem title="Nhà Giả Kim" price={79000} originalPrice={105000} image="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200" />
                 <CartItem title="Đắc Nhân Tâm" price={86000} originalPrice={120000} image="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200" />
              </div>
              
              <div className="px-4 py-3 border-t border-gray-100 bg-[#F5F5DC]/10 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-sm text-[#008080]">
                    <Ticket className="h-4 w-4" />
                    <span>Giảm 15k phí vận chuyển</span>
                 </div>
              </div>
            </div>

            {/* Package 2 */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Checkbox />
                <Store className="h-4 w-4 text-gray-500" />
                <span className="font-bold text-gray-900">Gói hàng 2 - Shop Bamboo Books</span>
              </div>
              
              <div className="p-4 space-y-6">
                 <CartItem title="Tuổi Trẻ Đáng Giá Bao Nhiêu" price={90000} originalPrice={110000} image="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=200" />
              </div>
            </div>

          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-96 h-fit sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Thanh toán</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span>255.000đ</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Giảm giá</span>
                  <span className="text-green-600">-25.000đ</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>30.000đ</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#008080]">260.000đ</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input placeholder="Mã giảm giá" className="bg-gray-50" />
                <Button 
                    className="w-full bg-[#008080] hover:bg-[#006666] text-white h-12 text-lg"
                    onClick={() => onNavigate('checkout')}
                >
                  Mua hàng (3)
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function CartItem({ title, price, originalPrice, image }: { title: string, price: number, originalPrice: number, image: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center h-full">
         <Checkbox />
      </div>
      <img src={image} className="w-20 h-28 object-cover rounded border border-gray-100 bg-gray-100" />
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 line-clamp-2">{title}</h3>
          <button className="text-gray-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
           <span className="font-bold text-[#008080]">{price.toLocaleString()}đ</span>
           <span className="text-xs text-gray-400 line-through">{originalPrice.toLocaleString()}đ</span>
        </div>
        <div className="flex items-center">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-l hover:bg-gray-50">-</button>
          <input className="w-10 h-8 border-y border-gray-200 text-center text-sm" value="1" readOnly />
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-r hover:bg-gray-50">+</button>
        </div>
      </div>
    </div>
  );
}
