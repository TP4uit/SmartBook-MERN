import React, { useState } from 'react';
import { SellerSidebar } from '../layout/SellerSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DollarSign, CreditCard, ArrowRight, History, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';

interface SellerFinanceScreenProps {
  onNavigate: (screen: string) => void;
}

export function SellerFinanceScreen({ onNavigate }: SellerFinanceScreenProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleWithdraw = () => {
    // Mock API call
    setIsSuccessOpen(true);
    setWithdrawAmount('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar onNavigate={onNavigate} activeScreen="seller-finance" />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <h2 className="font-bold text-gray-700">Tài chính & Doanh thu</h2>
           <div className="flex items-center gap-4">
             <div className="text-sm text-gray-500">Xin chào, <span className="font-bold text-gray-900">BookStore Official</span></div>
             <img src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full border border-gray-200" />
           </div>
        </header>

        <main className="p-8 overflow-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-[#008080] to-[#005555] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <DollarSign className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                 <p className="text-white/80 font-medium mb-2">Số dư khả dụng</p>
                 <h2 className="text-4xl font-bold mb-6">5.250.000đ</h2>
                 <div className="flex gap-4">
                    <Dialog>
                       <DialogTrigger asChild>
                         <Button className="bg-white text-[#008080] hover:bg-gray-100 font-bold px-6 border border-[#008080]/20 shadow-sm">
                           <CreditCard className="mr-2 h-4 w-4" /> Thêm TK Ngân hàng
                         </Button>
                       </DialogTrigger>
                       <DialogContent className="bg-white">
                         <DialogHeader>
                           <DialogTitle>Thêm tài khoản ngân hàng</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4 py-4">
                           <div className="space-y-2">
                               <Label>Ngân hàng</Label>
                               <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                 <option>Vietcombank</option>
                                 <option>Techcombank</option>
                                 <option>MB Bank</option>
                                 <option>ACB</option>
                               </select>
                           </div>
                           <div className="space-y-2">
                               <Label>Số tài khoản</Label>
                               <Input placeholder="Nhập số tài khoản" />
                           </div>
                           <div className="space-y-2">
                               <Label>Tên chủ tài khoản</Label>
                               <Input placeholder="VIET HOA IN HOA KHONG DAU" />
                           </div>
                         </div>
                         <DialogFooter>
                           <Button className="w-full bg-[#008080] hover:bg-[#006666]">Lưu tài khoản</Button>
                         </DialogFooter>
                       </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#F5F5DC] text-[#008080] hover:bg-[#F5F5DC]/90 font-bold px-6">
                           Rút tiền ngay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Yêu cầu rút tiền</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                               <CreditCard className="h-5 w-5 text-[#008080]" />
                            </div>
                            <div>
                               <div className="font-bold text-sm">Vietcombank</div>
                               <div className="text-xs text-gray-500">**** **** **** 9876</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                             <Label>Số tiền muốn rút</Label>
                             <div className="relative">
                               <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="pl-8 bg-white" 
                                  value={withdrawAmount}
                                  onChange={(e) => setWithdrawAmount(e.target.value)}
                                />
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₫</span>
                             </div>
                             <p className="text-xs text-gray-500">Phí rút tiền: 0đ</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button className="w-full bg-[#008080] hover:bg-[#006666]" onClick={handleWithdraw}>
                            Xác nhận rút tiền
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                 </div>
               </div>
            </div>

            {/* Income Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tổng quan doanh thu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                   <div className="text-sm text-gray-500">Doanh thu tháng này</div>
                   <div className="font-bold text-xl text-gray-900">12.500.000đ</div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                   <div className="text-sm text-gray-500">Đơn hàng đã giao</div>
                   <div className="font-bold text-xl text-gray-900">145</div>
                </div>
                <div className="flex justify-between items-center">
                   <div className="text-sm text-gray-500">Tỷ lệ hoàn hàng</div>
                   <div className="font-bold text-xl text-green-600">1.2%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                   <History className="h-5 w-5 text-gray-500" /> Lịch sử giao dịch
                </CardTitle>
                <Button variant="link" className="text-[#008080]">Xem tất cả</Button>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                               <ArrowRight className="h-5 w-5 -rotate-45" />
                            </div>
                            <div>
                               <div className="font-bold text-gray-900 text-sm">Rút tiền về Vietcombank</div>
                               <div className="text-xs text-gray-500">10:30 12/06/2026</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="font-bold text-gray-900">- 2.000.000đ</div>
                            <div className="text-xs text-green-600">Thành công</div>
                         </div>
                      </div>
                   ))}
                   <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                             <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                             <div className="font-bold text-gray-900 text-sm">Thu nhập từ đơn hàng #ORD-123</div>
                             <div className="text-xs text-gray-500">09:15 12/06/2026</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="font-bold text-green-600">+ 150.000đ</div>
                          <div className="text-xs text-green-600">Hoàn tất</div>
                       </div>
                    </div>
                </div>
             </CardContent>
          </Card>

        </main>

        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
           <DialogContent className="bg-white sm:max-w-sm">
             <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                   <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Yêu cầu thành công</h3>
                <p className="text-gray-500 text-sm mb-6">
                   Yêu cầu rút tiền của bạn đang được xử lý. Tiền sẽ về tài khoản trong 24h làm việc.
                </p>
                <Button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200" onClick={() => setIsSuccessOpen(false)}>
                   Đóng
                </Button>
             </div>
           </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
