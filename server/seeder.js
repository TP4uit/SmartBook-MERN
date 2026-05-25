const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Đang kết nối Database để bơm dữ liệu...');

    // 1. DỌN DẸP SẠCH DB CŨ
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    // 2. TẠO MẬT KHẨU CHUNG LÀ '123456'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // 3. TẠO NGƯỜI DÙNG (PERSONAS)
    const createdUsers = await User.insertMany([
      {
        name: 'Quản trị viên (Admin)',
        email: 'admin@smartbook.com',
        password: hashedPassword,
        isAdmin: true,
        role: 'admin',
        location: 'vietnam'
      },
      {
        name: 'Nhà sách Fahasa (Seller)',
        email: 'seller@smartbook.com',
        password: hashedPassword,
        isAdmin: false,
        role: 'seller',
        location: 'vietnam',
        shop_info: { shop_name: 'Fahasa Store', shop_address: 'Hồ Chí Minh' }
      },
      {
        name: 'Người dùng Mới (Demo Cold Start)',
        email: 'newuser@smartbook.com',
        password: hashedPassword,
        isAdmin: false,
        role: 'user',
        location: 'vietnam',
        dateOfBirth: new Date('2002-01-01') // Tuổi 22
      },
      {
        name: 'Người dùng Fan Kaggle (Demo Hybrid)',
        email: 'kaggle_fan@smartbook.com',
        password: hashedPassword,
        isAdmin: false,
        role: 'user',
        location: 'usa',
        dateOfBirth: new Date('1990-01-01') // Tuổi 34
      }
    ]);

    const adminId = createdUsers[0]._id;
    const sellerId = createdUsers[1]._id;
    const normalUserId = createdUsers[2]._id;

    // 4. TẠO SÁCH MẪU (Dùng 100% ISBN có thật từ Kaggle Dataset)
    const sampleBooks = [
      {
        user: adminId, shop_id: sellerId,
        ISBN: "059035342X", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fantasy",
        price: 150000, countInStock: 50, image: "https://images.amazon.com/images/P/059035342X.01.LZZZZZZZ.jpg",
        description: "Khám phá thế giới phép thuật cùng cậu bé phù thủy Harry Potter. Cuốn sách nổi tiếng nhất thế giới."
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0345339703", title: "The Fellowship of the Ring (LOTR)", author: "J.R.R. Tolkien", category: "Fantasy",
        price: 180000, countInStock: 30, image: "https://images.amazon.com/images/P/0345339703.01.LZZZZZZZ.jpg",
        description: "Phần một của sử thi kinh điển Chúa tể những chiếc nhẫn."
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0446605239", title: "The Notebook", author: "Nicholas Sparks", category: "Romance",
        price: 120000, countInStock: 100, image: "https://images.amazon.com/images/P/0446605239.01.LZZZZZZZ.jpg",
        description: "Câu chuyện tình yêu lãng mạn đã lấy đi nước mắt của hàng triệu độc giả."
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0385504209", title: "The Da Vinci Code", author: "Dan Brown", category: "Thriller",
        price: 160000, countInStock: 45, image: "https://images.amazon.com/images/P/0385504209.01.LZZZZZZZ.jpg",
        description: "Tiểu thuyết trinh thám giải mã bí ẩn vĩ đại nhất lịch sử nghệ thuật."
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0316666343", title: "The Lovely Bones", author: "Alice Sebold", category: "Fiction",
        price: 140000, countInStock: 20, image: "https://images.amazon.com/images/P/0316666343.01.LZZZZZZZ.jpg",
        description: "Một góc nhìn độc đáo từ thiên đường của một cô gái trẻ."
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0971880107", title: "Wild Animus", author: "Rich Shapero", category: "Adventure",
        price: 90000, countInStock: 200, image: "https://images.amazon.com/images/P/0971880107.01.LZZZZZZZ.jpg",
        description: "Chuyến phiêu lưu tìm kiếm bản ngã hoang dã của con người."
      }
    ];

    const createdBooks = await Book.insertMany(sampleBooks);

    // 5. BƠM THÊM 1 VÀI LƯỢT RATING MẪU CHO SÁCH ĐẦU TIÊN
    const firstBook = createdBooks[0];
    firstBook.reviews.push({
      name: createdUsers[2].name,
      rating: 5,
      comment: "Tuyệt vời! AI của tôi rất thích cuốn này.",
      user: normalUserId
    });
    firstBook.numReviews = 1;
    firstBook.rating = 5;
    await firstBook.save();

    console.log('✅ BƠM DỮ LIỆU THÀNH CÔNG RỰC RỠ!');
    process.exit();
  } catch (error) {
    console.error(`❌ LỖI: ${error.message}`);
    process.exit(1);
  }
};

importData();