const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, seller, admin } = require('../middleware/authMiddleware'); // Giả sử bạn có middleware này

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct) // Thêm route Update
  .delete(protect, deleteProduct);     // Thêm route Delete (Seller/Admin đều xoá được logic trong controller)

router.route('/:id/reviews').post(protect, createProductReview); // Thêm route Review

module.exports = router;