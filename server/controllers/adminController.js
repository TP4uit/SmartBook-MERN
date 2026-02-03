const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Đếm tổng số lượng
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Book.countDocuments();

  // 2. Tính tổng doanh thu (Chỉ tính các đơn đã thanh toán hoặc đã giao)
  // Lưu ý: Nếu muốn tính cả đơn chưa thanh toán (COD), hãy bỏ $match isPaid
  const totalSalesData = await Order.aggregate([
    {
      $match: { isPaid: true } // Hoặc { status: 'Delivered' } tùy quy trình của bạn
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  // Nếu chưa có đơn nào thì mặc định 0
  const totalSales = totalSalesData.length > 0 ? totalSalesData[0].totalSales : 0;

  // 3. Lấy danh sách Shop (User có role seller)
  const totalShops = await User.countDocuments({ role: 'seller' });

  res.json({
    users: totalUsers,
    orders: totalOrders,
    products: totalProducts,
    sales: totalSales,
    shops: totalShops
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Không thể xóa tài khoản Admin');
    }
    await user.deleteOne();
    res.json({ message: 'Đã xóa người dùng thành công' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// @desc    Get all shops
// @route   GET /api/admin/shops
// @access  Private/Admin
const getAllShops = asyncHandler(async (req, res) => {
  const shops = await User.find({ role: 'seller' })
    .select('name email shop_info createdAt')
    .sort({ createdAt: -1 });
  res.json(shops);
});

module.exports = {
  getDashboardStats,
  getUsers,
  deleteUser,
  getAllShops
};