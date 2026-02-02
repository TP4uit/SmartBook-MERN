const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy user từ DB
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401);
        throw new Error('Không tìm thấy người dùng');
      }

      // === SINGLE SESSION LOGIC ===
      // So sánh version. Nếu DB lớn hơn Token -> Token cũ -> Chặn.
      if (decoded.tokenVersion !== user.tokenVersion) {
        res.status(401);
        throw new Error('Phiên đăng nhập hết hạn. Tài khoản đã đăng nhập ở nơi khác.');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error(error.message === 'jwt expired' ? 'Token hết hạn' : 'Phiên đăng nhập không hợp lệ');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Không có token, vui lòng đăng nhập');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Không có quyền Admin');
  }
};

const seller = (req, res, next) => {
    if (req.user && (req.user.role === 'shop' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(401);
      throw new Error('Không có quyền Seller');
    }
  };

module.exports = { protect, admin, seller };