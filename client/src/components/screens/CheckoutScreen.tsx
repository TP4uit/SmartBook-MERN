import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import api from '../../services/api';

interface CheckoutScreenProps {
  onNavigate: (screen: string) => void;
}

export function CheckoutScreen({ onNavigate }: CheckoutScreenProps) {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState('KTX Khu B, ĐHQG');
  const [phone, setPhone] = useState('090xxxxxxx');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [postalCode, setPostalCode] = useState('700000');
  const [country, setCountry] = useState('Việt Nam');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('Giỏ hàng trống.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Gửi đúng cấu trúc Controller yêu cầu
      await api.post('/orders', {
        orderItems: cartItems.map((item) => ({
          name: item.title,
          image: item.image,
          price: item.price,
          product: item.bookId, // Controller đọc field 'product'
          shop: item.shopId,    // Quan trọng để tách đơn
          qty: item.quantity,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod: 'COD',
      });

      clearCart();
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Cảm ơn bạn đã mua sắm tại SmartBook. Đơn hàng của bạn đã được tách và gửi đến các Shop tương ứng.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => onNavigate('order-history')} variant="outline">Xem đơn hàng</Button>
          <Button onClick={() => onNavigate('home')} className="bg-[#008080] hover:bg-[#006666]">Tiếp tục mua sắm</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-[#008080] mb-6">Thanh toán</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* CỘT TRÁI: THÔNG TIN */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Địa chỉ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                <MapPin className="h-5 w-5 text-[#008080]" /> Địa chỉ nhận hàng
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Số điện thoại</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-gray-50 mt-1" />
                </div>
                <div>
                  <Label>Địa chỉ chi tiết</Label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-50 mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <Label>Thành phố</Label>
                      <Input value={city} onChange={e => setCity(e.target.value)} className="bg-gray-50 mt-1" />
                   </div>
                   <div>
                      <Label>Quốc gia</Label>
                      <Input value={country} onChange={e => setCountry(e.target.value)} className="bg-gray-50 mt-1" />
                   </div>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                <CreditCard className="h-5 w-5 text-[#008080]" /> Phương thức thanh toán
              </div>
              <div className="p-4 border border-[#008080] bg-[#008080]/5 rounded-lg flex items-center justify-between cursor-pointer">
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                <div className="w-4 h-4 rounded-full bg-[#008080]"></div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Đơn hàng ({cartItems.length} sản phẩm)</h3>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto text-sm">
                {cartItems.map(item => (
                  <div key={item.bookId} className="flex justify-between">
                    <span className="text-gray-600 line-clamp-1 flex-1 pr-2">{item.quantity}x {item.title}</span>
                    <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2 text-sm">
                 <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span>30.000đ</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#008080] pt-2 border-t mt-2">
                  <span>Tổng cộng</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(totalPrice + 30000)}đ</span>
                </div>
              </div>

              {errorMessage && (
                <p className="mt-4 text-sm text-red-600 text-center">{errorMessage}</p>
              )}
              <Button 
                className="w-full mt-6 bg-[#008080] hover:bg-[#006666] py-6 text-lg"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Đặt hàng ngay"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}