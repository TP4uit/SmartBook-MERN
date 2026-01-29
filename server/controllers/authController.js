const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo Token JWT (Hết hạn sau 30 ngày)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Đăng ký tài khoản
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra user đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng' });
    }

    // 2. Tạo user mới
    const user = await User.create({
      name,
      email,
      password, // Password sẽ tự động được mã hóa nhờ middleware trong Model
    });

    // 3. Trả về kết quả
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Trả về token ngay để auto-login
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu user không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user theo email
    const user = await User.findOne({ email });

    // 2. Kiểm tra mật khẩu
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin User đang đăng nhập
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        shop_info: user.shop_info // Nếu là seller
      });
    } else {
      res.status(404).json({ message: 'User không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin User
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    console.log("Dữ liệu nhận được từ Postman:", req.body);

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      
      // Nếu có gửi password mới thì đổi, không thì thôi
      if (req.body.password) {
        user.password = req.body.password; 
        // Middleware 'pre save' trong Model User sẽ tự mã hóa
      }

      // Cập nhật thông tin Shop (nếu là Seller)
      if (user.role === 'seller' && req.body.shop_info) {
        user.shop_info = {
          ...user.shop_info,
          ...req.body.shop_info
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser._id), // Cấp lại token mới
      });
    } else {
      res.status(404).json({ message: 'User không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nhớ export thêm 2 hàm mới
module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };