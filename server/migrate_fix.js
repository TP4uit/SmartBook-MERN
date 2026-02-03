const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartbook'); 
    // LƯU Ý: Nếu bạn dùng Mongo Atlas, hãy đảm bảo biến môi trường MONGO_URI trong file .env đã đúng
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    console.log('⏳ Đang quét dữ liệu sách cũ...');
    
    // 1. Tìm tất cả sách chưa có shop_id
    const books = await Book.find({ 
      $or: [
        { shop_id: { $exists: false } }, 
        { shop_id: null }
      ] 
    });

    console.log(`🔍 Tìm thấy ${books.length} cuốn sách cần cập nhật.`);

    if (books.length > 0) {
      let count = 0;
      for (const book of books) {
        // Logic: Lấy ID người tạo (user) gán làm ID chủ shop (shop_id)
        if (book.user) {
          book.shop_id = book.user;
          await book.save();
          count++;
          process.stdout.write(`.`); // Hiệu ứng loading
        }
      }
      console.log(`\n✅ Đã fix thành công ${count} cuốn sách!`);
      
      // Bonus: Cập nhật User thành Seller nếu họ đã có sách
      console.log('⏳ Đang đồng bộ quyền Seller cho User...');
      const userIds = [...new Set(books.map(b => b.user.toString()))];
      await User.updateMany(
        { _id: { $in: userIds }, role: 'user' },
        { $set: { role: 'seller' } }
      );
      console.log('✅ Đã cập nhật quyền Seller cho người dùng cũ.');
    } else {
      console.log('✅ Dữ liệu của bạn đã chuẩn, không cần fix!');
    }

    process.exit();
  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    process.exit(1);
  }
};

importData();