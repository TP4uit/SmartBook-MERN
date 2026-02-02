import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Star, MessageCircle, ShoppingCart, ShieldCheck, Truck, Sparkles, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { toast } from 'sonner';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';
const SERVER_URL = 'http://localhost:5000';

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
  shop_id?: { _id: string; name?: string; shop_info?: { shop_name?: string; shop_avatar?: string } } | string;
}

function getBookImage(book: BookDetail): string {
  const rawImage = book.image ?? book.images?.[0] ?? PLACEHOLDER_IMAGE;
  if (rawImage.startsWith('/uploads')) {
    return `${SERVER_URL}${rawImage}`;
  }
  return rawImage;
}

export function ProductDetailScreen({ onNavigate }: ProductDetailScreenProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarBooks, setSimilarBooks] = useState<BookDetail[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setBook(data);
        setSimilarBooks([]); 
      } catch (error) {
        console.error('Lỗi tải sách:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart({
        _id: book._id,
        title: book.title,
        price: book.price,
        image: getBookImage(book),
        shop_id: typeof book.shop_id === 'object' ? book.shop_id : { _id: String(book.shop_id) }, 
      });
      toast.success('Đã thêm vào giỏ hàng');
      // CẬP NHẬT: Tự động chuyển hướng sang màn hình Giỏ hàng
      onNavigate('cart'); 
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F5DC]">Đang tải...</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sách</div>;

  const shopName = typeof book.shop_id === 'object' && book.shop_id?.shop_info?.shop_name 
    ? book.shop_id.shop_info.shop_name 
    : 'Nhà sách uy tín';
  const shopAvatar = typeof book.shop_id === 'object' && book.shop_id?.shop_info?.shop_avatar 
    ? book.shop_id.shop_info.shop_avatar 
    : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100";

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5DC]">
      <Navbar activeScreen="marketplace" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <Button variant="ghost" className="mb-4 hover:bg-transparent pl-0 hover:text-[#008080]" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 mb-4 relative group">
                <img 
                  src={getBookImage(book)} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[getBookImage(book), ...(book.images?.slice(0,3) || [])].map((img, idx) => (
                  <div key={idx} className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer hover:border-[#008080]">
                    <img 
                      src={img.startsWith('/uploads') ? `${SERVER_URL}${img}` : img} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT GIỮA: THÔNG TIN */}
          <div className="md:col-span-7 lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[#008080] hover:bg-[#006666]">Yêu thích</Badge>
                <span className="text-sm text-gray-500">Tác giả: <span className="text-[#008080] font-medium">{book.author}</span></span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {book.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-yellow-500">
                  <span className="font-bold mr-1">{book.rating || 4.5}</span>
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-gray-500">{book.numReviews || 0} Đánh giá</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-gray-500">Đã bán {book.sold_quantity || 0}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-[#008080]">{book.price.toLocaleString('vi-VN')}đ</span>
                {book.original_price && <span className="text-gray-400 line-through mb-1">{book.original_price.toLocaleString('vi-VN')}đ</span>}
                {book.original_price && <Badge variant="destructive" className="mb-2">-20%</Badge>}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#008080] bg-[#008080]/5 p-2 rounded-lg w-fit">
                <Sparkles className="h-4 w-4" />
                <span>Rẻ hơn hoàn tiền</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
               <img src={shopAvatar} alt="Shop" className="w-12 h-12 rounded-full object-cover border border-gray-100" />
               <div className="flex-1">
                 <h4 className="font-bold text-gray-900">{shopName}</h4>
                 <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                   <span>Online 5 phút trước</span>
                   <span>•</span>
                   <span>Giao từ TP. HCM</span>
                 </div>
               </div>
               <Button variant="outline" size="sm" className="text-[#008080] border-[#008080] hover:bg-[#008080]/5">Xem Shop</Button>
            </div>

            <div className="flex gap-3">
               <Button 
                className="flex-1 bg-[#008080] hover:bg-[#006666] h-12 text-lg shadow-lg shadow-[#008080]/20"
                onClick={handleAddToCart}
               >
                 <ShoppingCart className="mr-2 h-5 w-5" /> Thêm vào giỏ
               </Button>
               <Button variant="outline" className="h-12 w-12 p-0 border-[#008080] text-[#008080]">
                 <MessageCircle className="h-5 w-5" />
               </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 bg-white p-4 rounded-xl border border-gray-100">
               <div className="flex flex-col items-center gap-1">
                 <Truck className="h-5 w-5 text-[#008080]" />
                 <span>Giao hàng miễn phí</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <ShieldCheck className="h-5 w-5 text-[#008080]" />
                 <span>Hàng chính hãng</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <Sparkles className="h-5 w-5 text-[#008080]" />
                 <span>Đổi trả 7 ngày</span>
               </div>
            </div>
            
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-3">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {book.description || 'Đang cập nhật...'}
              </p>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-3">
             <div className="bg-gradient-to-b from-[#008080]/5 to-transparent rounded-2xl p-6 border border-[#008080]/10">
                <div className="flex items-center gap-2 mb-4 text-[#008080] font-bold">
                  <Sparkles className="h-5 w-5 text-[#FFC107]" />
                  <h3>Sách tương tự (AI)</h3>
                </div>
                <div className="space-y-4">
                  {similarBooks.length > 0 ? similarBooks.map((sb) => (
                    <div key={sb._id} className="flex gap-3 group cursor-pointer" onClick={() => onNavigate('product-detail', sb._id)}>
                      <img src={getBookImage(sb)} className="w-16 h-24 object-cover rounded-md bg-gray-200" alt="" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-[#008080]">{sb.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">{sb.author ?? '—'}</div>
                        <div className="text-[#008080] font-bold text-sm mt-1">{sb.price?.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-gray-400 italic">Đang cập nhật gợi ý...</div>
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