const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' }, // Text index cho tìm kiếm thường
  author: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  original_price: { type: Number, min: 0 }, // Giá gốc để hiện gạch ngang
  
  images: [{ type: String }], // Array URL ảnh
  category: { type: String, required: true },
  
  // Thông tin kho và bán hàng (Khớp với UI)
  stock_quantity: { type: Number, required: true, default: 0 },
  sold_quantity: { type: Number, default: 0 }, // "Đã bán 5.2k"
  
  // Đánh giá (Khớp với UI "4.9 sao")
  rating_average: { type: Number, default: 0 },
  rating_count: { type: Number, default: 0 },

  // Badge hiển thị trên UI
  is_best_seller: { type: Boolean, default: false }, // Badge "Bán chạy"
  tags: [{ type: String }], // Ví dụ: ["Freeship Xtra", "Đổi trả 7 ngày"]

  // Liên kết người bán
  shop_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // --- PHẦN AI ---
  // Vector Embedding (768 chiều cho Gemini)
  embedding_vector: {
    type: [Number],
    select: false // Không trả về mặc định để nhẹ API
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);