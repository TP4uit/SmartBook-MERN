const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware');

// Debug check
console.log('✅ Product Controller Loaded:', Object.keys(productController));

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = productController;

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct); // Chỉ Seller mới được tạo

router.route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct) // Chỉ Seller mới được sửa
  .delete(protect, seller, deleteProduct); // Chỉ Seller mới được xóa

module.exports = router;