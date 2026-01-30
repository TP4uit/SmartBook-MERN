import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]">
      <Navbar onNavigate={onNavigate} hideSearch activeScreen="home" />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-20 px-4 md:py-32 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#008080]/10 via-white to-white" />
          
          <div className="container mx-auto relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC107]/20 text-[#B38600] text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Trải nghiệm tìm sách bằng AI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#008080] mb-6 tracking-tight">
              Khám phá thế giới tri thức <br/> dành riêng cho bạn
            </h1>
            
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Nhập mô tả, cảm xúc hoặc chủ đề bạn quan tâm. AI của chúng tôi sẽ gợi ý những cuốn sách phù hợp nhất.
            </p>

            <div className="relative max-w-2xl mx-auto shadow-2xl shadow-[#008080]/10 rounded-2xl">
              <div className="flex items-center bg-white rounded-2xl p-2 border border-[#008080]/20 focus-within:ring-2 focus-within:ring-[#008080] transition-all">
                <Sparkles className="h-6 w-6 text-[#FFC107] ml-4 animate-pulse" />
                <Input 
                  className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg py-6 bg-transparent"
                  placeholder="Bạn đang tìm sách gì? (VD: sách chữa lành tâm hồn...)"
                />
                <Button className="bg-[#008080] hover:bg-[#006666] text-white rounded-xl px-8 py-6 h-auto text-lg font-medium">
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Suggestions (Horizontal Scroll) */}
        <section className="py-16 bg-[#F5F5DC]/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#008080]" />
                <h2 className="text-2xl font-bold text-[#008080]">Gợi ý từ AI dành cho bạn</h2>
              </div>
              <Button variant="ghost" className="text-[#008080]" onClick={() => onNavigate('marketplace')}>Xem tất cả <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[200px] md:min-w-[240px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer snap-start border border-transparent hover:border-[#008080]/30 group" onClick={() => onNavigate('product-detail')}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600`} 
                      alt="Book Cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-[#008080] flex items-center gap-1 shadow-sm">
                      <Sparkles className="h-3 w-3 text-[#FFC107]" /> 98% Match
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-[#008080]">Nhà Giả Kim</h3>
                  <p className="text-sm text-gray-500 mb-2">Paulo Coelho</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#008080]">79.000đ</span>
                    <div className="flex items-center text-xs text-yellow-500">
                      <Star className="h-3 w-3 fill-current" /> 4.9
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers (Grid) */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Sách bán chạy nhất tuần</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {['Đắc Nhân Tâm', 'Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Cây Cam Ngọt Của Tôi', 'Muôn Kiếp Nhân Sinh', 'Hành Trình Về Phương Đông', 'Tội Ác Và Hình Phạt', 'Sapiens', 'Chiến Binh Cầu Vồng', 'Hoàng Tử Bé', 'Mắt Biếc'].map((title, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#008080]/30 hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('product-detail')}>
                   <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img 
                      src={`https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600&random=${i}`} 
                      alt="Book Cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#008080]">{title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-current" />)}
                    </div>
                    <span className="text-xs text-gray-400">(128)</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg text-[#008080]">105.000đ</span>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white">
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
