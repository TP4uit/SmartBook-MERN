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
        dateOfBirth: new Date('2002-01-01') 
      },
      {
        name: 'Người dùng Fan Kaggle (Demo Hybrid)',
        email: 'kaggle_fan@smartbook.com',
        password: hashedPassword,
        isAdmin: false,
        role: 'user',
        location: 'usa',
        dateOfBirth: new Date('1990-01-01') 
      }
    ]);

    const adminId = createdUsers[0]._id;
    const sellerId = createdUsers[1]._id;
    const normalUserId = createdUsers[2]._id;
    const kaggleFanId = createdUsers[3]._id; // Lấy thêm ID của user này để làm người đánh giá

    // 4. TẠO SÁCH MẪU VỚI DỮ LIỆU ĐÁNH GIÁ (REVIEWS, RATING, NUMREVIEWS)
    const sampleBooks = [
      {
        user: adminId, shop_id: sellerId,
        ISBN: "059035342X", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fantasy",
        price: 150000, countInStock: 50, image: "https://images.amazon.com/images/P/059035342X.01.LZZZZZZZ.jpg",
        description: "Khám phá thế giới phép thuật cùng cậu bé phù thủy Harry Potter. Cuốn sách nổi tiếng nhất thế giới.",
        rating: 4.5,
        numReviews: 2,
        reviews: [
          { name: createdUsers[2].name, rating: 5, comment: "Sách rất tuyệt vời, giao hàng bọc kỹ. Tôi đã đọc nó 3 lần rồi!", user: normalUserId },
          { name: createdUsers[3].name, rating: 4, comment: "Nội dung hay, tuy nhiên góc sách bị móp một chút xíu khi giao.", user: kaggleFanId }
        ]
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0345339703", title: "The Fellowship of the Ring (LOTR)", author: "J.R.R. Tolkien", category: "Fantasy",
        price: 180000, countInStock: 30, image: "https://images.amazon.com/images/P/0345339703.01.LZZZZZZZ.jpg",
        description: "Phần một của sử thi kinh điển Chúa tể những chiếc nhẫn.",
        rating: 5,
        numReviews: 1,
        reviews: [
          { name: createdUsers[0].name, rating: 5, comment: "Kiệt tác của thể loại Fantasy. Ai cũng nên đọc thử một lần.", user: adminId }
        ]
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0446605239", title: "The Notebook", author: "Nicholas Sparks", category: "Romance",
        price: 120000, countInStock: 100, image: "https://images.amazon.com/images/P/0446605239.01.LZZZZZZZ.jpg",
        description: "Câu chuyện tình yêu lãng mạn đã lấy đi nước mắt của hàng triệu độc giả.",
        rating: 4.0,
        numReviews: 3,
        reviews: [
          { name: createdUsers[2].name, rating: 5, comment: "Truyện quá cảm động, mình đã khóc sướt mướt.", user: normalUserId },
          { name: createdUsers[3].name, rating: 3, comment: "Cốt truyện hơi chậm, tuy nhiên kết thúc khá ấn tượng.", user: kaggleFanId },
          { name: createdUsers[1].name, rating: 4, comment: "Sách in đẹp, giấy thơm.", user: sellerId }
        ]
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0385504209", title: "The Da Vinci Code", author: "Dan Brown", category: "Thriller",
        price: 160000, countInStock: 45, image: "https://images.amazon.com/images/P/0385504209.01.LZZZZZZZ.jpg",
        description: "Tiểu thuyết trinh thám giải mã bí ẩn vĩ đại nhất lịch sử nghệ thuật.",
        rating: 4.5,
        numReviews: 2,
        reviews: [
          { name: createdUsers[3].name, rating: 5, comment: "Tình tiết logic, lôi cuốn, không thể đặt sách xuống được!", user: kaggleFanId },
          { name: createdUsers[2].name, rating: 4, comment: "Hay nhưng một số chỗ hơi khó hiểu với người mới.", user: normalUserId }
        ]
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0316666343", title: "The Lovely Bones", author: "Alice Sebold", category: "Fiction",
        price: 140000, countInStock: 20, image: "https://images.amazon.com/images/P/0316666343.01.LZZZZZZZ.jpg",
        description: "Một góc nhìn độc đáo từ thiên đường của một cô gái trẻ.",
        rating: 0, // Cố tình để 1 sách chưa có ai đánh giá để bạn test "Cold start / Trạng thái trống"
        numReviews: 0,
        reviews: []
      },
      {
        user: adminId, shop_id: sellerId,
        ISBN: "0971880107", title: "Wild Animus", author: "Rich Shapero", category: "Adventure",
        price: 90000, countInStock: 200, image: "https://images.amazon.com/images/P/0971880107.01.LZZZZZZZ.jpg",
        description: "Chuyến phiêu lưu tìm kiếm bản ngã hoang dã của con người.",
        rating: 3,
        numReviews: 1,
        reviews: [
          { name: createdUsers[2].name, rating: 3, comment: "Nội dung hơi khó hiểu so với kỳ vọng.", user: normalUserId }
        ]
      }
    ];

    await Book.insertMany(sampleBooks);

    console.log('✅ BƠM DỮ LIỆU ĐÁNH GIÁ THÀNH CÔNG RỰC RỠ!');
    process.exit();
  } catch (error) {
    console.error(`❌ LỖI: ${error.message}`);
    process.exit(1);
  }
};

importData();