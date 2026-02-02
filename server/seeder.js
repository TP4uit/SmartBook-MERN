/**
 * SmartBook Seeder - Nạp 3 user mẫu (admin, shop, user). Không dùng AI.
 * Chạy từ thư mục server: node seeder.js
 * Cần: MONGO_URI trong .env (đặt .env ở thư mục server hoặc root)
 */
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

async function seed() {
  try {
    await connectDB();

    console.log('🗑️  Đang xóa user cũ...');
    await User.deleteMany({});

    console.log('👤 Đang tạo 3 user mẫu...');

    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'Big Shop Partner',
      email: 'shop@partner.com',
      password: 'shop123',
      role: 'shop',
      shop_info: { shop_name: 'Partner Shop', rating: 5, follower_count: 1000 },
    });

    await User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('\n✅ Seeder hoàn tất. Database đã được cập nhật.');
    console.log('\n🔑 Tài khoản đăng nhập:');
    console.log('   Admin:  admin@example.com  / admin123');
    console.log('   Shop:   shop@partner.com   / shop123');
    console.log('   User:   user@example.com  / user123');
  } catch (error) {
    console.error('❌ Seeder lỗi:', error.message);
    if (error.message && error.message.includes('ECONNREFUSED')) {
      console.error('   Kiểm tra MONGO_URI trong file .env và đảm bảo MongoDB đang chạy.');
    }
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n📴 Đã ngắt kết nối MongoDB.');
    }
    process.exit(0);
  }
}

seed();
