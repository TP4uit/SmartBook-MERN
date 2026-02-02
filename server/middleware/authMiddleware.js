const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy user từ DB, loại bỏ password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('Không tìm thấy người dùng.');
      }

      // KIỂM TRA PHIÊN BẢN TOKEN (SINGLE SESSION)
      // Nếu tokenVersion trong token cũ hơn trong DB -> User đã đăng nhập nơi khác
      if (decoded.tokenVersion !== user.tokenVersion) {
        res.status(401);
        throw new Error('Phiên đăng nhập hết hạn hoặc tài khoản đã đăng nhập ở nơi khác.');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      // Thông báo lỗi cụ thể để Frontend bắt được
      throw new Error('Not authorized, token failed'); 
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'shop' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a seller');
  }
};

module.exports = { protect, admin, seller };