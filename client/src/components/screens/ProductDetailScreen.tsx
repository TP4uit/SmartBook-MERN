import React, { useEffect, useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Star, MessageCircle, ShoppingCart, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../hooks/useCart';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';

interface ProductDetailScreenProps {
  onNavigate: (screen: string, productId?: string) => void;
  productId?: string | null;
}

interface BookDetail {
  _id: string;
  title: string;
  author?: string;
  description?: string;
  price: number;
  original_price?: number;
  image?: string;
  images?: string[];
  category?: string;
  rating?: number;
  rating_average?: number;
  numReviews?: number;
  rating_count?: number;
  sold_quantity?: number;
  shop_id?: { name?: string; shop_info?: unknown };
}

function getBookImage(book: BookDetail): string {
  return book.image ?? book.images?.[0] ?? PLACEHOLDER_IMAGE;
}

function getRating(book: BookDetail): number {
  return book.rating ?? book.rating_average ?? 0;
}

interface SimilarBook {
  _id: string;
  title: string;
  author?: string;
  price: number;
  image?: string;
  images?: string[];
}

export function ProductDetailScreen({ onNavigate, productId }: ProductDetailScreenProps) {
  const { addToCart } = useCart();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [similarBooks, setSimilarBooks] = useState<SimilarBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setBook(null);
      setSimilarBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api.get<BookDetail>(`/products/${productId}`)
      .then(({ data }) => setBook(data))
      .catch((err) => {
        setError(err.response?.data?.message ?? 'Không tải được sách');
        setBook(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  // Sách tương tự: Vector Search theo title của sách hiện tại
  useEffect(() => {
    if (!book?.title || !productId) {
      setSimilarBooks([]);
      return;
    }
    api.get<{ books: SimilarBook[] }>('/products', { params: { keyword: book.title, pageNumber: 1, pageSize: 6 } })
      .then(({ data }) => {
        const list = (data.books ?? []).filter((b) => b._id !== productId).slice(0, 3);
        setSimilarBooks(list);
      })
      .catch(() => setSimilarBooks([]));
  }, [book?.title, productId]);

  const mainImage = book ? getBookImage(book) : PLACEHOLDER_IMAGE;
  const thumbnails = book?.images?.length ? book.images : [mainImage];
  const rating = book ? getRating(book) : 0;
  const soldText = book?.sold_quantity != null ? (book.sold_quantity >= 1000 ? `${(book.sold_quantity / 1000).toFixed(1)}k` : String(book.sold_quantity)) : '—';

  if (!productId) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
        <Navbar activeScreen="product-detail" />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <p className="text-gray-500">Chọn một cuốn sách để xem chi tiết.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
        <Navbar activeScreen="product-detail" />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <p className="text-gray-500">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
        <Navbar activeScreen="product-detail" />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <p className="text-gray-500">{error ?? 'Không tìm thấy sách'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]/30">
      <Navbar activeScreen="product-detail" />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Trang chủ / Cửa hàng / {book.category ?? 'Văn học'} / <span className="text-[#008080] font-medium">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Left: Images */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                 <img 
                  src={mainImage} 
                  alt="Book Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {thumbnails.slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-100 cursor-pointer hover:ring-2 ring-[#008080] overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="md:col-span-7 lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="font-bold text-black mr-1">{rating || '—'}</span>
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Đã bán {soldText}</span>
                <span className="text-gray-400">|</span>
                <span className="text-[#008080]">Tác giả: {book.author ?? '—'}</span>
              </div>
            </div>

            <div className="bg-[#F5F5DC] p-4 rounded-xl">
              <div className="text-3xl font-bold text-[#008080]">{book.price?.toLocaleString('vi-VN')}đ</div>
              {book.original_price != null && book.original_price > 0 && (
                <div className="text-sm text-gray-500 line-through">{book.original_price.toLocaleString('vi-VN')}đ</div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Mô tả sách</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {book.description ?? 'Chưa có mô tả.'}
              </p>
            </div>

            <Separator />

            {/* SELLER INFO CARD (Crucial) */}
            <div className="bg-white border border-[#008080]/20 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1678542230173-8e2c3eb87c85?auto=format&fit=crop&q=80&w=100" 
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
                alt="Seller"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">{typeof book.shop_id === 'object' && book.shop_id?.name ? book.shop_id.name : 'Shop'}</h4>
                  <Badge variant="secondary" className="bg-[#008080]/10 text-[#008080] text-[10px]">Mall</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-current" /> {rating || '—'}</span>
                  <span>•</span>
                  <span>15k Người theo dõi</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white gap-2">
                <MessageCircle className="h-4 w-4" /> Chat ngay
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-[#008080] text-[#008080] hover:bg-[#008080]/5 text-lg"
                onClick={() => { addToCart(book); onNavigate('cart'); }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Thêm vào giỏ
              </Button>
              <Button 
                className="flex-1 h-12 bg-[#008080] hover:bg-[#006666] text-white text-lg shadow-lg shadow-[#008080]/20"
                onClick={() => { addToCart(book); onNavigate('checkout'); }}
              >
                Mua ngay
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-[#008080]" /> Đổi trả 7 ngày</span>
              <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-[#008080]" /> Freeship Xtra</span>
            </div>
          </div>

          {/* Right Column: AI Suggestion (Vector Search theo title) */}
          <div className="md:col-span-12 lg:col-span-3">
             <div className="bg-gradient-to-b from-[#008080]/5 to-transparent rounded-2xl p-6 border border-[#008080]/10">
                <div className="flex items-center gap-2 mb-4 text-[#008080] font-bold">
                  <Sparkles className="h-5 w-5 text-[#FFC107]" />
                  <h3>Sách tương tự (AI)</h3>
                </div>
                <div className="space-y-4">
                  {similarBooks.length ? similarBooks.map((sb) => (
                    <div key={sb._id} className="flex gap-3 group cursor-pointer" onClick={() => onNavigate('product-detail', sb._id)}>
                      <img src={sb.image ?? sb.images?.[0] ?? PLACEHOLDER_IMAGE} className="w-16 h-24 object-cover rounded-md bg-gray-200" alt="" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-[#008080]">{sb.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">{sb.author ?? '—'}</div>
                        <div className="text-[#008080] font-bold text-sm mt-1">{sb.price?.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">Chưa có gợi ý tương tự.</p>
                  )}
                </div>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
