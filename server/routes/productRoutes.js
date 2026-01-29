const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct,
  searchSemantic,
  getMyProducts 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Route Search để lên đầu để tránh trùng với :id
router.get('/search/semantic', searchSemantic);

// Route cho Seller xem hàng của mình
router.get('/seller/my-products', protect, getMyProducts);

// Các route cơ bản
router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, updateProduct) // Thêm PUT để sửa
  .delete(protect, deleteProduct);

module.exports = router;