const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    // CẬP NHẬT: Thêm 'seller' vào danh sách cho phép
    role: { 
      type: String, 
      enum: ['user', 'admin', 'seller'], 
      default: 'user' 
    },
    shop_info: {
      shop_name: { type: String },
      shop_address: { type: String },
      shop_avatar: { type: String }
    }
  },
  { timestamps: true }
);

// Khớp mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;