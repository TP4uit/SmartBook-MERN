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
    enum: ['customer', 'seller', 'admin'], 
    default: 'customer' 
  },
  // Nếu là Seller thì có thêm thông tin Shop
  shop_info: {
    shop_name: String,
    shop_avatar: String,
    rating: { type: Number, default: 0 },
    follower_count: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Middleware mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);