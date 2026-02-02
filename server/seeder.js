const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Dữ liệu mẫu chuẩn
const products = [
  {
    title: 'Nhà Giả Kim',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    description: 'Tiểu thuyết nổi tiếng của Paulo Coelho về hành trình theo đuổi ước mơ.',
    author: 'Paulo Coelho',
    category: 'Văn học',
    price: 79000,
    countInStock: 10,
  },
  {
    title: 'Đắc Nhân Tâm',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    description: 'Nghệ thuật thu phục lòng người.',
    author: 'Dale Carnegie',
    category: 'Kỹ năng',
    price: 85000,
    countInStock: 7,
  },
  {
    title: 'Harry Potter và Hòn Đá Phù Thủy',
    image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a3123c?auto=format&fit=crop&q=80&w=800',
    description: 'Tập đầu tiên trong bộ truyện Harry Potter huyền thoại.',
    author: 'J.K. Rowling',
    category: 'Thiếu nhi',
    price: 150000,
    countInStock: 20,
  },
  {
    title: 'Dạy Con Làm Giàu - Tập 1',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800',
    description: 'Để không có tiền vẫn tạo ra tiền.',
    author: 'Robert Kiyosaki',
    category: 'Kinh tế',
    price: 110000,
    countInStock: 15,
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
      role: 'seller', 
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
        shop_id: sellerUser._id,
        ai_keywords: [product.category.toLowerCase(), 'book'], 
        rating: 4.5,
        numReviews: 0,
        images: [product.image]
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