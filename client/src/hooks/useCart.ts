import { useState, useEffect } from 'react';

export interface CartItem {
  bookId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  shopId: string;
  shopName: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 1. Load giỏ hàng từ LocalStorage khi khởi động
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // 2. Lưu giỏ hàng mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // Trigger sự kiện để Navbar cập nhật badge số lượng (nếu cần real-time hơn)
    window.dispatchEvent(new Event('storage')); 
  }, [cartItems]);

  const addToCart = (product: {
    _id: string;
    title: string;
    price: number;
    image?: string;
    images?: string[];
    shop_id?: { _id?: string; name?: string };
  }) => {
    const shopId = typeof product.shop_id === 'object' && product.shop_id?._id
      ? String(product.shop_id._id)
      : 'unknown';
    const shopName = typeof product.shop_id === 'object' && product.shop_id?.name
      ? product.shop_id.name
      : 'Cửa hàng sách';
    const image = product.image ?? product.images?.[0] ?? 'https://via.placeholder.com/150';

    setCartItems((prev) => {
      const existing = prev.find((item) => item.bookId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.bookId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        bookId: product._id,
        title: product.title,
        price: product.price,
        image,
        quantity: 1,
        shopId,
        shopName,
      }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const updateQuantity = (bookId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.bookId === bookId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  // 3. Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // 4. Gom nhóm theo Shop (Logic quan trọng cho UI)
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, groupedItems };
}