const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String }, 
    phone: { type: String },   
    dateOfBirth: { type: Date }, 
    gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Nam' },
    isAdmin: { type: Boolean, required: true, default: false },
    role: { 
      type: String, 
      enum: ['user', 'admin', 'seller'], 
      default: 'user' 
    },
    tokenVersion: { type: Number, default: 0 }, 
    
    shop_info: {
      shop_name: { type: String },
      shop_address: { type: String },
      shop_avatar: { type: String }
    }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;