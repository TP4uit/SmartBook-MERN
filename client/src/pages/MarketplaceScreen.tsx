import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Star, Filter, ShoppingBag } from 'lucide-react';

interface MarketplaceScreenProps {
  onNavigate: (screen: string) => void;
}

export function MarketplaceScreen({ onNavigate }: MarketplaceScreenProps) {
  const [priceRange, setPriceRange] = useState([0, 500000]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar onNavigate={onNavigate} activeScreen="marketplace" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar (Filters) */}
          <aside className="w-full md:w-64 space-y-8 h-fit sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg text-[#008080]">
              <Filter className="h-5 w-5" />
              <h2>Bộ lọc</h2>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Danh mục</h3>
              <div className="space-y-2">
                {['Văn học', 'Kinh tế', 'Tâm lý & Kỹ năng', 'Thiếu nhi', 'Sách giáo khoa', 'Truyện tranh'].map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Checkbox id={cat} />
                    <Label htmlFor={cat} className="text-sm text-gray-600 font-normal cursor-pointer">{cat}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Khoảng giá</h3>
              <Slider 
                defaultValue={[0, 500000]} 
                max={1000000} 
                step={10000} 
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{priceRange[0].toLocaleString()}đ</span>
                <span>{priceRange[1].toLocaleString()}đ</span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Đánh giá</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((star) => (
                  <div key={star} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <div className="flex text-yellow-400">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < star ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">trở lên</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Nhà bán hàng</h3>
              <div className="space-y-2">
                {['Tiki Trading', 'Fahasa', 'Nhã Nam', 'Alpha Books'].map((shop) => (
                  <div key={shop} className="flex items-center gap-2">
                    <Checkbox id={shop} />
                    <Label htmlFor={shop} className="text-sm text-gray-600 font-normal cursor-pointer">{shop}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-[#008080] hover:bg-[#006666]">Áp dụng</Button>
          </aside>

          {/* Right Grid (Books) */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Tất cả sách</h1>
              <div className="text-sm text-gray-500">Hiển thị 24/1256 kết quả</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col" onClick={() => onNavigate('product-detail')}>
                   <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600&random=${i+10}`} 
                      alt="Book Cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {i % 3 === 0 && (
                      <div className="absolute top-0 left-0 bg-[#FFC107] text-[#856404] text-[10px] font-bold px-2 py-1 rounded-br-lg">
                        BÁN CHẠY
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center gap-1 mb-1">
                      <ShoppingBag className="h-3 w-3 text-[#008080]" />
                      <span className="text-xs text-gray-500 truncate">Shop: Tiki Trading</span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-[#008080] transition-colors">
                      {['Đắc Nhân Tâm', 'Nhà Giả Kim', 'Cây Cam Ngọt Của Tôi', 'Muôn Kiếp Nhân Sinh'][i % 4]}
                    </h3>
                  </div>
                  
                  <div className="mt-auto pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex text-yellow-400">
                        {Array(5).fill(0).map((_, idx) => <Star key={idx} className="h-3 w-3 fill-current" />)}
                      </div>
                      <span className="text-xs text-gray-400">(45)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#008080]">86.000đ</span>
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
