const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  getAllShops
} = require('../controllers/adminController');

// Debug check
console.log('✅ Admin Routes Loaded');

// Tất cả các route dưới đây đều yêu cầu Login + Admin Role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/shops', getAllShops);
router.delete('/users/:id', deleteUser);

module.exports = router;