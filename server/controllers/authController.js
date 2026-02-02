const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// --- CÁCH VIẾT MỚI: Export trực tiếp ---

// @desc    Auth user & get token (Đăng nhập)
// @route   POST /api/auth/login
exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } else {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không đúng');
  }
});

// @desc    Register a new user (Đăng ký)
// @route   POST /api/auth/register
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email này đã được sử dụng');
  }

  const user = await User.create({
    name,
    email,
    password,
    tokenVersion: 0
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu không hợp lệ');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      shop_info: user.shop_info || {}
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.tokenVersion),
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});