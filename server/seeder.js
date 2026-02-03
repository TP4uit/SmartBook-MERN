const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors'); // Đã comment lại để bạn đỡ bị lỗi thiếu thư viện
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Import Models
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');

// Kết nối DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// 1. DỮ LIỆU MẪU - NGƯỜI DÙNG
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123',
    role: 'admin',
  },
  {
    name: 'Nhà Sách Tiki (Seller)',
    email: 'seller1@example.com',
    password: '123',
    role: 'seller',
  },
  {
    name: 'Fahasa Online (Seller)',
    email: 'seller2@example.com',
    password: '123',
    role: 'seller',
  },
  {
    name: 'Nguyễn Văn A (Customer)',
    email: 'user@example.com',
    password: '123',
    role: 'user',
  },
];

// 2. DỮ LIỆU MẪU - SÁCH
const books = [
  // --- CÔNG NGHỆ & LẬP TRÌNH ---
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    image: 'https://placehold.co/400x600/png?text=Clean+Code',
    description: 'Cuốn sách kinh điển về lập trình. Hướng dẫn cách viết code sạch, dễ bảo trì và dễ hiểu. Phù hợp cho mọi lập trình viên muốn nâng cao tay nghề.',
    category: 'Technology',
    price: 350000,
    countInStock: 10,
    rating: 4.8,
    numReviews: 12,
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    image: 'https://placehold.co/400x600/png?text=Pragmatic+Programmer',
    description: 'Hành trình từ thợ code trở thành nghệ nhân phần mềm. Sách cung cấp các lời khuyên thực tế về quy trình phát triển phần mềm chuyên nghiệp.',
    category: 'Technology',
    price: 420000,
    countInStock: 7,
    rating: 4.9,
    numReviews: 8,
  },
  {
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen',
    image: 'https://placehold.co/400x600/png?text=Algorithms',
    description: 'Sách gối đầu giường về Thuật toán và Cấu trúc dữ liệu. Cần thiết cho sinh viên CNTT và kỹ sư phần mềm muốn nắm vững nền tảng khoa học máy tính.',
    category: 'Technology',
    price: 850000,
    countInStock: 5,
    rating: 4.7,
    numReviews: 20,
  },
  {
    title: 'React Up & Running',
    author: 'Stoyan Stefanov',
    image: 'https://placehold.co/400x600/png?text=React+Book',
    description: 'Hướng dẫn xây dựng ứng dụng web hiện đại với ReactJS. Phù hợp cho người mới bắt đầu tìm hiểu về Frontend Development.',
    category: 'Technology',
    price: 150000,
    countInStock: 20,
    rating: 4.5,
    numReviews: 5,
  },

  // --- KINH TẾ & KINH DOANH ---
  {
    title: 'Dạy Con Làm Giàu (Rich Dad Poor Dad)',
    author: 'Robert Kiyosaki',
    image: 'https://placehold.co/400x600/png?text=Rich+Dad',
    description: 'Thay đổi tư duy về tiền bạc. Sự khác biệt trong suy nghĩ giữa người giàu và người nghèo về tài sản và tiêu sản.',
    category: 'Business',
    price: 120000,
    countInStock: 15,
    rating: 4.6,
    numReviews: 100,
  },
  {
    title: 'Nhà Đầu Tư Thông Minh',
    author: 'Benjamin Graham',
    image: 'https://placehold.co/400x600/png?text=Investor',
    description: 'Kinh thánh của đầu tư giá trị. Cuốn sách gối đầu giường của Warren Buffett về thị trường chứng khoán và quản lý tài chính.',
    category: 'Business',
    price: 250000,
    countInStock: 8,
    rating: 4.7,
    numReviews: 45,
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    image: 'https://placehold.co/400x600/png?text=Zero+to+One',
    description: 'Làm thế nào để xây dựng tương lai. Những bài học về khởi nghiệp (Startup) và cách tạo ra những sản phẩm đột phá từ con số 0.',
    category: 'Business',
    price: 180000,
    countInStock: 12,
    rating: 4.5,
    numReviews: 30,
  },

  // --- VĂN HỌC & TIỂU THUYẾT ---
  {
    title: 'Nhà Giả Kim (The Alchemist)',
    author: 'Paulo Coelho',
    image: 'https://placehold.co/400x600/png?text=Alchemist',
    description: 'Tiểu thuyết kinh điển về hành trình theo đuổi ước mơ. Một cuốn sách nhẹ nhàng nhưng đầy triết lý sâu sắc về vận mệnh con người.',
    category: 'Literature',
    price: 79000,
    countInStock: 50,
    rating: 4.9,
    numReviews: 200,
  },
  {
    title: 'Rừng Na Uy',
    author: 'Haruki Murakami',
    image: 'https://placehold.co/400x600/png?text=Norwegian+Wood',
    description: 'Câu chuyện tình yêu và nỗi cô đơn của tuổi trẻ Nhật Bản những năm 1960. Một tác phẩm u sầu nhưng đẹp đẽ và ám ảnh.',
    category: 'Literature',
    price: 110000,
    countInStock: 10,
    rating: 4.4,
    numReviews: 60,
  },
  {
    title: 'Harry Potter và Hòn Đá Phù Thủy',
    author: 'J.K. Rowling',
    image: 'https://placehold.co/400x600/png?text=Harry+Potter',
    description: 'Mở đầu cuộc phiêu lưu của cậu bé phù thủy Harry Potter. Thế giới phép thuật kỳ diệu dành cho mọi lứa tuổi.',
    category: 'Literature',
    price: 155000,
    countInStock: 25,
    rating: 5.0,
    numReviews: 500,
  },
  {
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    image: 'https://placehold.co/400x600/png?text=Little+Prince',
    description: 'Cuốn sách dành cho trẻ em nhưng lại chứa đựng những bài học sâu sắc cho người lớn về tình yêu, tình bạn và bản chất con người.',
    category: 'Literature',
    price: 65000,
    countInStock: 30,
    rating: 4.8,
    numReviews: 150,
  },

  // --- TÂM LÝ & KỸ NĂNG SỐNG ---
  {
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    image: 'https://placehold.co/400x600/png?text=Dac+Nhan+Tam',
    description: 'Nghệ thuật thu phục lòng người. Cuốn sách self-help bán chạy nhất mọi thời đại về kỹ năng giao tiếp và ứng xử.',
    category: 'Self-help',
    price: 86000,
    countInStock: 100,
    rating: 4.8,
    numReviews: 300,
  },
  {
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    author: 'Rosie Nguyễn',
    image: 'https://placehold.co/400x600/png?text=Tuoi+Tre',
    description: 'Cuốn sách truyền cảm hứng cho giới trẻ Việt Nam. Khuyến khích tự học, trải nghiệm và sống hết mình với đam mê.',
    category: 'Self-help',
    price: 90000,
    countInStock: 40,
    rating: 4.5,
    numReviews: 80,
  },
  {
    title: 'Thinking, Fast and Slow (Tư Duy Nhanh và Chậm)',
    author: 'Daniel Kahneman',
    image: 'https://placehold.co/400x600/png?text=Thinking',
    description: 'Khám phá hai hệ thống tư duy chi phối nhận thức của chúng ta. Hiểu về các sai lầm trong ra quyết định và cách khắc phục.',
    category: 'Psychology',
    price: 220000,
    countInStock: 10,
    rating: 4.6,
    numReviews: 25,
  },
];

// HÀM NHẬP DỮ LIỆU
const importData = async () => {
  try {
    await connectDB();

    // 1. Xóa dữ liệu cũ
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');

    // 2. Tạo User mới
    const usersWithHashedPass = users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));

    const createdUsers = await User.insertMany(usersWithHashedPass);

    const adminUser = createdUsers[0]._id;
    const seller1 = createdUsers[1]._id; // Tiki
    const seller2 = createdUsers[2]._id; // Fahasa

    // 3. Gán sách cho Seller (Chia đều sách cho 2 seller)
    const sampleBooks = books.map((book, index) => {
      return {
        ...book,
        // *** SỬA Ở ĐÂY: Dùng shop_id thay vì shop ***
        shop_id: index % 2 === 0 ? seller1 : seller2, 
        user: adminUser, 
      };
    });

    await Book.insertMany(sampleBooks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// HÀM XÓA DỮ LIỆU
const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}