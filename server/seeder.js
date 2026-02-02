const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users'); // Bạn có thể giữ file data/users.js cũ hoặc hardcode user ở dưới
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Dữ liệu mẫu chuẩn (Hardcode để bạn không cần file data/products.js)
const products = [
  {
    title: 'Nhà Giả Kim',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Tiểu thuyết nổi tiếng của Paulo Coelho về hành trình theo đuổi ước mơ.',
    author: 'Paulo Coelho',
    category: 'Văn học',
    price: 79000,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    title: 'Đắc Nhân Tâm',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'],
    description: 'Nghệ thuật thu phục lòng người.',
    author: 'Dale Carnegie',
    category: 'Kỹ năng',
    price: 85000,
    countInStock: 7,
    rating: 4.8,
    numReviews: 10,
  },
  {
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800'],
    description: 'Cuốn sách truyền cảm hứng cho giới trẻ.',
    author: 'Rosie Nguyễn',
    category: 'Kỹ năng',
    price: 90000,
    countInStock: 5,
    rating: 4.0,
    numReviews: 5,
  },
  {
    title: 'Harry Potter và Hòn Đá Phù Thủy',
    image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a3123c?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1626618012641-bfbca5a3123c?auto=format&fit=crop&q=80&w=800'],
    description: 'Tập đầu tiên trong bộ truyện Harry Potter huyền thoại.',
    author: 'J.K. Rowling',
    category: 'Thiếu nhi',
    price: 150000,
    countInStock: 20,
    rating: 5.0,
    numReviews: 100,
  },
  {
    title: 'Dạy Con Làm Giàu - Tập 1',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800'],
    description: 'Để không có tiền vẫn tạo ra tiền.',
    author: 'Robert Kiyosaki',
    category: 'Kinh tế',
    price: 110000,
    countInStock: 15,
    rating: 4.2,
    numReviews: 8,
  },
  {
    title: 'Sherlock Holmes Toàn Tập',
    image: 'https://images.unsplash.com/photo-1585859359392-54b4131df33a?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1585859359392-54b4131df33a?auto=format&fit=crop&q=80&w=800'],
    description: 'Tuyển tập các vụ án của thám tử lừng danh Sherlock Holmes.',
    author: 'Arthur Conan Doyle',
    category: 'Văn học',
    price: 200000,
    countInStock: 3,
    rating: 4.9,
    numReviews: 45,
  }
];

const importData = async () => {
  try {
    // 1. Xóa sạch dữ liệu cũ
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');

    // 2. Tạo User chuẩn
    // Password hash sẵn (123456)
    const hashPassword = '$2a$10$d/f./tJ8q.m.s/././././././././././././././././././.'; // Ví dụ hash, thực tế Mongoose pre-save sẽ hash lại nếu bạn dùng User model đúng
    // LƯU Ý: Ở đây ta tạo mảng object thô để insertMany, nếu User model có pre('save') hash password thì nên dùng loop create
    
    // Tốt nhất là dùng create để trigger middleware hash password
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123',
      isAdmin: true,
      role: 'admin'
    });

    const sellerUser = await User.create({
      name: 'Nhà sách Fahasa',
      email: 'seller@example.com',
      password: '123',
      isAdmin: false,
      role: 'seller', // Đảm bảo role seller để test Dashboard
      shop_info: {
        shop_name: 'Fahasa Official',
        shop_address: 'Quận 1, TP.HCM',
        shop_avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200'
      }
    });

    const customerUser = await User.create({
      name: 'Nguyễn Văn Khách',
      email: 'user@example.com',
      password: '123',
      isAdmin: false,
      role: 'user'
    });

    console.log(`Users Created: Admin(${adminUser._id}), Seller(${sellerUser._id})`);

    // 3. Gán sách cho Seller
    const sampleProducts = products.map((product) => {
      return { 
        ...product, 
        user: sellerUser._id,
        shop_id: sellerUser._id, // Quan trọng: Gán shop_id để Seller Dashboard nhìn thấy
        ai_embedding: [], // Placeholder cho AI
        ai_keywords: [product.category.toLowerCase(), 'book', 'hot'], 
      };
    });

    await Book.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}