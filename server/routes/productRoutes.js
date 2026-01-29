const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct,
  deleteProduct,
  searchSemantic 
} = require('../controllers/productController');

// Định nghĩa các đường dẫn
router.get('/search/semantic', searchSemantic);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(deleteProduct);

module.exports = router;