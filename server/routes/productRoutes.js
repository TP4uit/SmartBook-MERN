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
} = productController;

// Route AI Search (Phải đặt trước route /:id để tránh conflict)
router.post('/ai-search', searchProductsAI); 

// Route để lấy sách gợi ý từ AI
router.get('/recommendations', getRecommendedBooks);

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

module.exports = router;