const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Book'); // Model sách tên là Book

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Create new user (User or Shop)
// @route   POST /api/admin/users
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, shopName, shopDescription } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email đã tồn tại');
  }

  // Chuẩn bị dữ liệu shop nếu role là shop
  let shopInfo = {};
  if (role === 'shop') {
    if (!shopName) {
      res.status(400);
      throw new Error('Tên cửa hàng là bắt buộc đối với tài khoản Shop');
    }
    shopInfo = {
      name: shopName,
      description: shopDescription || '',
    };
  }

  const user = await User.create({
    name,
    email,
    password, 
    role: role || 'user',
    shop_info: role === 'shop' ? shopInfo : undefined,
    tokenVersion: 0
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ');
  }
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role; 

    if (req.body.role === 'shop' && req.body.shopName) {
        user.shop_info = {
            name: req.body.shopName,
            description: req.body.shopDescription || user.shop_info?.description
        }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  
  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  res.json({
    usersCount,
    productsCount,
    ordersCount,
    totalRevenue
  });
});