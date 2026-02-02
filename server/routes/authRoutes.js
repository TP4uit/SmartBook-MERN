const express = require('express');
const router = express.Router();

// Import toàn bộ controller
const authController = require('../controllers/authController');

// Debug: In ra để kiểm tra xem server có đọc được file controller không
console.log('✅ Auth Controller Loaded:', Object.keys(authController));

const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = authController;

const { protect } = require('../middleware/authMiddleware');

// Route Đăng ký
router.post('/register', registerUser);

// Route Đăng nhập
router.post('/login', authUser);

// Route Profile
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;