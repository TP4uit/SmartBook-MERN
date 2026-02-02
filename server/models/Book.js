const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const bookSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    shop_id: { // Thêm shop_id để tách đơn hàng seller
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true 
    },
    title: { type: String, required: true },
    image: { type: String, required: true }, // Ảnh đại diện chính (Thumbnail)
    images: [{ type: String }], // Mảng ảnh chi tiết (Carousel)
    author: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    
    // --- CÁC TRƯỜNG DÀNH CHO AI (FUTURE PROOF) ---
    ai_embedding: { 
      type: [Number], // Mảng vector (ví dụ 1536 chiều từ OpenAI)
      default: [],
      select: false // Mặc định không load để nhẹ API
    }, 
    ai_keywords: { type: [String], default: [] }, // Từ khóa AI trích xuất
    ai_summary: { type: String }, // Tóm tắt sách do AI viết
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;