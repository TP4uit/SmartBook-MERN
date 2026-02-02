const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực User (Kiểm tra Token)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id).select('-password');
      if (!currentUser) {
        return res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
      }

      if (currentUser.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn hoặc đã đăng nhập ở thiết bị khác' });
      }

      req.user = currentUser;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy Token, ủy quyền thất bại' });
  }
};

// Middleware kiểm tra quyền Shop (seller)
const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'shop' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ dành cho tài khoản Shop / Người bán' });
  }
};

// Middleware kiểm tra quyền Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ dành cho Quản trị viên (Admin)' });
  }
};

module.exports = { protect, seller, admin };