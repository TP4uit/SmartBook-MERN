import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { MapPin, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

interface CheckoutScreenProps {
  onNavigate: (screen: string) => void;
}

export function CheckoutScreen({ onNavigate }: CheckoutScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleOrder = () => {
    setIsSuccessOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar onNavigate={onNavigate} activeScreen="checkout" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-[#008080] mb-6 flex items-center gap-2">
          Thanh toán
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Address Selection */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="flex items-center gap-2 text-[#008080]">
                  <MapPin className="h-5 w-5" /> Địa chỉ nhận hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="font-bold text-gray-900">Nguyễn Văn A <span className="font-normal text-gray-500 ml-2">| (+84) 901 234 567</span></p>
                      <p className="text-gray-600 mt-1">123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                      <span className="inline-block mt-2 px-2 py-0.5 border border-[#008080] text-[#008080] text-xs rounded">Mặc định</span>
                   </div>
                   <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Thay đổi</Button>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="border-none shadow-sm">
               <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base text-gray-700">Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                 <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100" className="w-16 h-20 object-cover rounded border border-gray-100" alt="Nhà Giả Kim" />
                    <div className="flex-1">
                       <h4 className="font-medium text-gray-900">Nhà Giả Kim</h4>
                       <p className="text-sm text-gray-500">Số lượng: 1</p>
                       <p className="text-[#008080] font-bold">79.000đ</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100" className="w-16 h-20 object-cover rounded border border-gray-100" alt="Đắc Nhân Tâm" />
                    <div className="flex-1">
                       <h4 className="font-medium text-gray-900">Đắc Nhân Tâm</h4>
                       <p className="text-sm text-gray-500">Số lượng: 1</p>
                       <p className="text-[#008080] font-bold">86.000đ</p>
                    </div>
                 </div>
                  <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=100" className="w-16 h-20 object-cover rounded border border-gray-100" alt="Tuổi Trẻ Đáng Giá Bao Nhiêu" />
                    <div className="flex-1">
                       <h4 className="font-medium text-gray-900">Tuổi Trẻ Đáng Giá Bao Nhiêu</h4>
                       <p className="text-sm text-gray-500">Số lượng: 1</p>
                       <p className="text-[#008080] font-bold">90.000đ</p>
                    </div>
                 </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="flex items-center gap-2 text-[#008080]">
                  <CreditCard className="h-5 w-5" /> Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                 <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#008080] bg-[#008080]/5' : 'border-gray-200 hover:border-[#008080]/50'}`} onClick={() => setPaymentMethod('cod')}>
                       <div className="flex items-center gap-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="cursor-pointer font-medium">Thanh toán khi nhận hàng (COD)</Label>
                       </div>
                       <Truck className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'banking' ? 'border-[#008080] bg-[#008080]/5' : 'border-gray-200 hover:border-[#008080]/50'}`} onClick={() => setPaymentMethod('banking')}>
                       <div className="flex items-center gap-3">
                          <RadioGroupItem value="banking" id="banking" />
                          <Label htmlFor="banking" className="cursor-pointer font-medium">Chuyển khoản ngân hàng (QR Code)</Label>
                       </div>
                       <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                 </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 h-fit sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Chi tiết thanh toán</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tổng tiền hàng</span>
                  <span>255.000đ</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>30.000đ</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Giảm giá vận chuyển</span>
                  <span className="text-green-600">-15.000đ</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Voucher giảm giá</span>
                  <span className="text-green-600">-10.000đ</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#008080]">260.000đ</span>
                </div>
                <p className="text-xs text-right text-gray-500">(Đã bao gồm VAT nếu có)</p>
              </div>

              <Button className="w-full bg-[#008080] hover:bg-[#006666] text-white h-12 text-lg font-bold shadow-lg shadow-[#008080]/20" onClick={handleOrder}>
                Đặt hàng
              </Button>
              <div className="mt-4 text-xs text-gray-500 text-center px-4">
                 Bằng việc đặt hàng, bạn đồng ý với <a href="#" className="text-[#008080] underline">Điều khoản sử dụng</a> của SmartBook.
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-white sm:max-w-md">
           <DialogTitle className="sr-only">Thông báo đặt hàng thành công</DialogTitle>
           <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                 <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
              <p className="text-gray-500 mb-8 max-w-[280px] mx-auto">
                 Cảm ơn bạn đã mua sắm tại SmartBook. Đơn hàng của bạn đang được xử lý.
              </p>
              <div className="flex flex-col w-full gap-3">
                 <Button className="w-full bg-[#008080] hover:bg-[#006666]" onClick={() => onNavigate('order-history')}>
                    Xem đơn hàng của tôi
                 </Button>
                 <Button variant="outline" className="w-full" onClick={() => onNavigate('home')}>
                    Tiếp tục mua sắm
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
