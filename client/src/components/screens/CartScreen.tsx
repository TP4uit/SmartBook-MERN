import React from 'react';
import { Button } from '../ui/button';
import { Trash2, Store, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

interface CartScreenProps {
  onNavigate: (screen: string) => void;
}

export function CartScreen({ onNavigate }: CartScreenProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, groupedItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-[#008080]/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-[#008080]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">Bạn chưa thêm cuốn sách nào vào giỏ.</p>
        <Button onClick={() => onNavigate('marketplace')} className="bg-[#008080] text-white">
          Dạo một vòng xem sao
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-[#008080] mb-8">Giỏ hàng của bạn</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LIST SẢN PHẨM (Gom theo Shop) */}
          <div className="flex-1 space-y-6">
            {Object.entries(groupedItems).map(([shopName, items]) => (
              <div key={shopName} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* Header Shop */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Store className="h-5 w-5 text-[#008080]" />
                  <span className="font-bold text-gray-800">{shopName}</span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.bookId} className="flex gap-4">
                      <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                          <button onClick={() => removeFromCart(item.bookId)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-[#008080] font-bold mt-1">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                        
                        {/* Bộ tăng giảm số lượng */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.bookId, -1)}
                              className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                            >-</button>
                            <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.bookId, 1)}
                              className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* THANH TOÁN (Sidebar) */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#008080]/10 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Thanh toán</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Giảm giá</span>
                  <span className="text-green-600">-0đ</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-[#008080]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 text-lg shadow-lg shadow-[#008080]/20"
                onClick={() => onNavigate('checkout')}
              >
                Mua hàng ({cartItems.length}) <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}