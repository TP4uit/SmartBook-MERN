const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAI,
  getRecommendedBooks, // Import hàm mới
  createProductReview // Import hàm tạo đánh giá
} = productController;

// Route AI Search (Phải đặt trước route /:id để tránh conflict)
router.post('/ai-search', searchProductsAI); 

// Route để lấy sách gợi ý từ AI
router.get('/recommendations', protect, getRecommendedBooks);

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

// Route để tạo đánh giá cho sách
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;