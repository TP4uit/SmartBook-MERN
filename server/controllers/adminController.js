const User = require('../models/User');
const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Lấy danh sách tất cả users (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Khóa/Mở khóa tài khoản user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Không cho phép khóa admin
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể khóa tài khoản Admin' });
    }

    user.status = user.status === 'active' ? 'banned' : 'active';
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản Admin' });
    }

    await user.deleteOne();
    res.json({ message: 'Đã xóa user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tất cả sellers (shops)
// @route   GET /api/admin/shops
// @access  Private (Admin)
const getAllShops = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Tính thêm thông tin doanh thu cho mỗi shop
    const shopsWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const orders = await Order.find({ shop_id: seller._id, status: 'Delivered' });
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return {
          ...seller.toObject(),
          totalRevenue,
          orderCount: orders.length,
        };
      })
    );

    res.json(shopsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thống kê tổng quan cho Admin Dashboard (dữ liệu thật từ DB)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalSellers, activeSellers, bannedSellers, totalOrders, ordersForSales, totalProducts] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'seller' }),
      User.countDocuments({ role: 'seller', status: 'active' }),
      User.countDocuments({ role: 'seller', status: 'banned' }),
      Order.countDocuments({}),
      Order.find({ status: 'Delivered' }).select('totalPrice'),
      Book.countDocuments({}),
    ]);

    const totalSales = ordersForSales.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    res.json({
      totalUsers,
      totalSellers,
      activeSellers,
      bannedSellers,
      totalOrders,
      totalSales,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllShops,
  getAdminStats,
};
