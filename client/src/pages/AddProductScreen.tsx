import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Sparkles, ImagePlus, ChevronLeft, Trash2 } from 'lucide-react';

interface AddProductScreenProps {
  onNavigate: (screen: string) => void;
}

export function AddProductScreen({ onNavigate }: AddProductScreenProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('seller-dashboard')}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Đăng bán sản phẩm mới</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4">Thông tin cơ bản</h2>
              
              <div className="space-y-2">
                <Label>Tên sách</Label>
                <Input placeholder="Nhập tên sách..." className="bg-gray-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giá bán (đ)</Label>
                  <Input type="number" placeholder="0" className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Kho hàng</Label>
                  <Input type="number" placeholder="0" className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Mô tả sản phẩm</span>
                  <span className="flex items-center gap-1 text-xs text-[#008080] bg-[#008080]/10 px-2 py-1 rounded-full animate-pulse">
                    <Sparkles className="h-3 w-3" /> AI SEO Optimized
                  </span>
                </Label>
                <div className="relative">
                   <Textarea 
                    className="min-h-[200px] bg-gray-50 leading-relaxed" 
                    placeholder="Mô tả chi tiết về sách..."
                    defaultValue="Cuốn sách này kể về..."
                  />
                  <div className="absolute bottom-2 right-2">
                    <Button size="sm" variant="ghost" className="text-[#008080] hover:bg-[#008080]/10 text-xs h-7">
                      <Sparkles className="h-3 w-3 mr-1" /> Viết lại bằng AI
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  * Hệ thống AI sẽ tự động tối ưu từ khóa giúp sản phẩm dễ dàng được tìm thấy.
                </p>
              </div>
            </div>

            <Button className="w-full h-12 bg-[#008080] hover:bg-[#006666] text-lg">
              Đăng bán ngay
            </Button>
          </div>

          {/* Right Sidebar (Images & Category) */}
          <div className="space-y-6">
             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
                <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4">Hình ảnh</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#008080] hover:bg-[#008080]/5 transition-all">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <ImagePlus className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-[#008080]">Thêm hình ảnh</div>
                  <div className="text-xs text-gray-400 mt-1">Tối đa 5 ảnh. <br/>Dung lượng &lt; 2MB</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                        <img src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&random=${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="icon" variant="destructive" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-bold text-gray-900">Danh mục</h2>
                <select className="w-full p-2 border border-gray-200 rounded-md bg-gray-50">
                  <option>Văn học</option>
                  <option>Kinh tế</option>
                  <option>Thiếu nhi</option>
                </select>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}


