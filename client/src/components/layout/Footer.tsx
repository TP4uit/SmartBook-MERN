import React from 'react';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#008080]/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#008080] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#FFC107]" />
              </div>
              <span className="text-xl font-bold text-[#008080]">SmartBook</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nền tảng mua bán sách thông minh kết hợp AI, kết nối hàng triệu độc giả và nhà bán hàng uy tín.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#008080]">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-[#008080]">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-[#008080]">Điều khoản</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#008080]">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-[#008080]">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-[#008080]">Chính sách đổi trả</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: hotro@smartbook.vn</li>
              <li>Hotline: 1900 6060</li>
              <li>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          © 2026 SmartBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
