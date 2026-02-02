const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Debug: Kiểm tra xem controller đã load đủ hàm chưa
console.log('✅ Admin Controller Loaded:', Object.keys(adminController));

const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  createUser,
  getDashboardStats
} = adminController;

// Tất cả routes dưới đây đều cần quyền Admin
router.use(protect);
router.use(admin);

// Route thống kê (Đặt lên đầu để tránh trùng với :id)
router.get('/stats', getDashboardStats);

// Route quản lý User
router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .delete(deleteUser)
    .get(getUserById)
    .put(updateUser);

module.exports = router;