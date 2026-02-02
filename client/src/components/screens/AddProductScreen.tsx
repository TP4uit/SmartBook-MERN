import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SellerSidebar } from '../layout/SellerSidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

export function AddProductScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State chuẩn theo Model Book
  const [title, setTitle] = useState('');       // Thay cho name
  const [author, setAuthor] = useState('');     // Thay cho brand
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');       // URL ảnh
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  // Xử lý upload ảnh
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      // API upload trả về đường dẫn file
      const { data } = await api.post('/upload', formData, config);
      setImage(data); // Lưu đường dẫn (VD: /uploads/image-123.jpg)
      toast.success('Upload ảnh thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', {
        title,
        author,
        price: Number(price),
        image,
        category,
        countInStock: Number(countInStock),
        description,
      });
      toast.success('Đăng bán sách thành công!');
      navigate('/seller/products'); // Chuyển về danh sách sản phẩm
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar onNavigate={onNavigate} activeScreen="add-product" />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h2 className="font-bold text-gray-700">Đăng bán sách mới</h2>
        </header>

        <div className="p-8 overflow-auto flex-1">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={submitHandler} className="space-y-8">
              
              {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Tên sách</Label>
                  <Input 
                    id="title" 
                    placeholder="Nhập tên sách..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Input 
                    id="author" 
                    placeholder="Tên tác giả..." 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    required
                  />
                </div>

                <div className="space-y-2">
                   <Label htmlFor="price">Giá bán (VNĐ)</Label>
                   <Input 
                    id="price" 
                    type="number" 
                    placeholder="0" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required
                  />
                </div>
              </div>

              {/* PHẦN 2: HÌNH ẢNH */}
              <div className="space-y-2">
                <Label>Hình ảnh bìa sách</Label>
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-44 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                    {image ? (
                       // Helper hiển thị ảnh: Nếu là link online thì để nguyên, nếu local thì nối localhost
                       <img 
                        src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={uploadFileHandler}
                      />
                      <Label 
                        htmlFor="image-upload" 
                        className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Upload className="h-4 w-4" /> Tải ảnh lên
                      </Label>
                      <span className="text-sm text-gray-500">hoặc</span>
                      <Input 
                        placeholder="Dán đường dẫn ảnh online..." 
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa 5MB. Nên dùng ảnh tỉ lệ 2:3 (Bìa sách).
                    </p>
                  </div>
                </div>
              </div>

              {/* PHẦN 3: CHI TIẾT */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock">Số lượng trong kho</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="100" 
                    value={countInStock} 
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Văn học">Văn học</SelectItem>
                      <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                      <SelectItem value="Tâm lý & Kỹ năng">Tâm lý & Kỹ năng</SelectItem>
                      <SelectItem value="Thiếu nhi">Thiếu nhi</SelectItem>
                      <SelectItem value="Sách giáo khoa">Sách giáo khoa</SelectItem>
                      <SelectItem value="Truyện tranh">Truyện tranh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PHẦN 4: MÔ TẢ */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea 
                  id="description" 
                  className="min-h-[150px]" 
                  placeholder="Viết mô tả hấp dẫn về cuốn sách của bạn..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => navigate('/seller/products')}>Hủy bỏ</Button>
                <Button type="submit" disabled={loading} className="bg-[#008080] hover:bg-[#006666]">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng bán ngay
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}