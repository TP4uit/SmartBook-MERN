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

  // State quản lý form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(''); // Lưu URL ảnh sau khi upload
  const [brand, setBrand] = useState('');
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

      // Gọi API Upload backend
      const { data } = await api.post('/upload', formData, config);
      
      // Backend trả về đường dẫn tương đối (ví dụ: /uploads/abc.jpg)
      // Ta cần ghép với BaseURL để hiển thị được ngay
      // Nhưng lưu vào DB thì cứ lưu đường dẫn tương đối cũng được, hoặc tuyệt đối tùy logic
      // Ở đây tôi lưu đường dẫn mà backend trả về
      setImage(data);
      toast.success('Upload ảnh thành công');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  // Xử lý submit form
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (!name || !price || !image || !category) {
        toast.error('Vui lòng điền đầy đủ thông tin và upload ảnh');
        return;
    }

    setLoading(true);
    try {
      await api.post('/products', {
        name,
        price: Number(price),
        image,
        brand: brand || 'No Brand',
        category,
        countInStock: Number(countInStock),
        description,
      });

      toast.success('Đăng bán sản phẩm thành công!');
      navigate('/seller/dashboard'); // Quay về dashboard sau khi xong
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SellerSidebar onNavigate={onNavigate} activeScreen="add-product" />
      
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Đăng Bán Sách Mới</h2>
            <p className="text-slate-500 text-sm mt-1">Điền thông tin chi tiết để sản phẩm của bạn tiếp cận người mua</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={submitHandler} className="space-y-8">
              
              {/* PHẦN 1: HÌNH ẢNH */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Hình ảnh sản phẩm</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
                  
                  {image ? (
                    // Nếu đã có ảnh thì hiện ảnh
                    <div className="relative inline-block">
                        <img 
                           // Nếu ảnh bắt đầu bằng http thì dùng nguyên, nếu không thì nối với localhost server
                           src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                           alt="Preview" 
                           className="max-h-64 rounded-md shadow-md" 
                        />
                        <button 
                            type="button"
                            onClick={() => setImage('')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                  ) : (
                    // Chưa có ảnh thì hiện nút upload
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            {uploading ? <Loader2 className="h-6 w-6 text-slate-400 animate-spin" /> : <Upload className="h-6 w-6 text-slate-400" />}
                        </div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-[#008080] font-medium hover:underline">Tải ảnh lên</span>
                            <span className="text-slate-500"> hoặc kéo thả vào đây</span>
                            <Input 
                                id="image-upload" 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={uploadFileHandler}
                                disabled={uploading}
                            />
                        </label>
                        <p className="text-xs text-slate-400 mt-2">PNG, JPG, WEBP tối đa 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PHẦN 2: THÔNG TIN CƠ BẢN */}
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Tên sách</Label>
                  <Input 
                    id="name" 
                    placeholder="VD: Nhà Giả Kim - Paulo Coelho" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Giá bán (VNĐ)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="VD: 79000" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Số lượng kho</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="VD: 100" 
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Tác giả / NXB</Label>
                  <Input 
                    id="brand" 
                    placeholder="VD: NXB Trẻ" 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thể loại</Label>
                  <Select onValueChange={(val) => setCategory(val)} value={category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tểu thuyết">Tiểu thuyết</SelectItem>
                      <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                      <SelectItem value="Kỹ năng sống">Kỹ năng sống</SelectItem>
                      <SelectItem value="Thiếu nhi">Thiếu nhi</SelectItem>
                      <SelectItem value="Ngoại văn">Ngoại văn</SelectItem>
                      <SelectItem value="Giáo khoa">Giáo khoa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PHẦN 3: MÔ TẢ */}
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
                <Button variant="outline" type="button" onClick={() => navigate('/seller/dashboard')}>Hủy bỏ</Button>
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