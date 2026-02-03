const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token (Đăng nhập)
// @route   POST /api/auth/login
exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Tăng version token để invalidate các session cũ (nếu cần bảo mật cao)
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shop_info: user.shop_info, // Trả về shop_info để frontend check
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
    role: 'user', // Mặc định là user
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
      dateOfBirth: user.dateOfBirth || null, 
      gender: user.gender || 'Nam',          
      shop_info: user.shop_info || {}
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});

// @desc    Update user profile & Register Shop
// @route   PUT /api/auth/profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // 1. Cập nhật thông tin cá nhân cơ bản
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.dateOfBirth) {
      user.dateOfBirth = req.body.dateOfBirth;
    }
    if (req.body.gender) {
      user.gender = req.body.gender;
    }
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    // 2. LOGIC MỚI: Cập nhật thông tin Shop & Nâng cấp Role
    // Nếu request có gửi shop_name hoặc shop_address -> User muốn bán hàng
    if (req.body.shop_name || req.body.shop_address) {
      user.shop_info = {
        shop_name: req.body.shop_name || user.shop_info?.shop_name,
        shop_address: req.body.shop_address || user.shop_info?.shop_address,
        shop_avatar: req.body.shop_avatar || user.shop_info?.shop_avatar,
      };

      // Tự động nâng role lên 'seller' nếu chưa phải
      if (user.role === 'user') {
        user.role = 'seller';
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      shop_info: updatedUser.shop_info,
      token: generateToken(updatedUser._id, updatedUser.tokenVersion),
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});