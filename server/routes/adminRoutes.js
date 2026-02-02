const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllShops,
  getAdminStats,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Tất cả route admin cần protect + admin middleware
router.use(protect, admin);

// User management
router.route('/users').get(getAllUsers);
router.route('/users/:id/status').put(toggleUserStatus);
router.route('/users/:id').delete(deleteUser);

// Shop management
router.route('/shops').get(getAllShops);

// Stats
router.route('/stats').get(getAdminStats);
router.route('/dashboard').get(getDashboardStats);

module.exports = router;
