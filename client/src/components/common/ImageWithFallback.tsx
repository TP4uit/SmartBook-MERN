import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react'; // Icon thay thế khi ảnh lỗi
import { cn } from '../../utils/utils'; // Hàm merge class của Shadcn (xem hướng dẫn tạo file này bên dưới nếu chưa có)

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string; // Ảnh thế mạng (nếu muốn dùng ảnh khác thay vì icon)
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackSrc,
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  // Reset lỗi khi đường dẫn src thay đổi (VD: chuyển trang detail khác)
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error) {
    // Trường hợp 1: Có ảnh fallback (VD: logo mặc định)
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={cn("object-cover w-full h-full", className)}
          {...props}
        />
      );
    }

    // Trường hợp 2: Không có ảnh fallback -> Hiện khung xám + Icon
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 text-gray-400 w-full h-full", className)}>
        <ImageOff className="w-1/3 h-1/3" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setError(true)}
      {...props}
    />
  );
}