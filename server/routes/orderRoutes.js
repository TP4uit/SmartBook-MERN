const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getMyOrders, 
  getOrderById,
  getOrdersByShop, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Middleware xác thực

// --- Route cho Người mua ---
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// --- Route cho Người bán (Seller) ---
// 1. Xem danh sách đơn hàng của Shop
router.route('/seller/orders').get(protect, getOrdersByShop);

// 2. Cập nhật trạng thái đơn hàng
router.route('/:id/status').put(protect, updateOrderStatus);

// --- Route chung (Lấy chi tiết đơn) - Để cuối cùng để tránh trùng path ---
router.route('/:id').get(protect, getOrderById);

module.exports = router;