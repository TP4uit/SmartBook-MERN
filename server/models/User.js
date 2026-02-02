const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin', 'shop'],
    default: 'user',
  },
  tokenVersion: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },
  avatar: { type: String },
  // Thông tin mở rộng cho Seller
  shop_info: {
    shop_name: String,
    shop_avatar: String,
    rating: { type: Number, default: 0 },
    follower_count: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Middleware: Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);