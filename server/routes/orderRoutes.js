const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getMyOrders, 
  getOrderById, 
  getOrdersByShop, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Route tạo đơn hàng
router.route('/').post(protect, addOrderItems);

// Route lấy lịch sử đơn hàng của người mua (User)
router.route('/myorders').get(protect, getMyOrders);

// Route cho Seller quản lý đơn hàng
router.route('/seller/orders').get(protect, getOrdersByShop);

// Route xử lý chi tiết đơn hàng (Lấy ID, Update Status)
router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, updateOrderStatus);

module.exports = router;