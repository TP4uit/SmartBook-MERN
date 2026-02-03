const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

// 2. DỮ LIỆU MẪU - SÁCH (ẢNH REAL + CATEGORY TIẾNG VIỆT)
const books = [
  // --- CÔNG NGHỆ (Technology) ---
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    image: 'https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg',
    description: 'Cuốn sách kinh điển về lập trình. Hướng dẫn cách viết code sạch, dễ bảo trì và dễ hiểu. Phù hợp cho mọi lập trình viên muốn nâng cao tay nghề.',
    category: 'Công nghệ',
    price: 350000,
    countInStock: 10,
    rating: 4.8,
    numReviews: 12,
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    image: 'https://m.media-amazon.com/images/I/51W1sBPO7tL._SL1000_.jpg',
    description: 'Hành trình từ thợ code trở thành nghệ nhân phần mềm. Sách cung cấp các lời khuyên thực tế về quy trình phát triển phần mềm chuyên nghiệp.',
    category: 'Công nghệ',
    price: 420000,
    countInStock: 7,
    rating: 4.9,
    numReviews: 8,
  },
  {
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen',
    image: 'https://m.media-amazon.com/images/I/61Mw06xul8L._SL1000_.jpg',
    description: 'Sách gối đầu giường về Thuật toán và Cấu trúc dữ liệu. Cần thiết cho sinh viên CNTT và kỹ sư phần mềm muốn nắm vững nền tảng khoa học máy tính.',
    category: 'Công nghệ',
    price: 850000,
    countInStock: 5,
    rating: 4.7,
    numReviews: 20,
  },
  {
    title: 'React Up & Running',
    author: 'Stoyan Stefanov',
    image: 'https://m.media-amazon.com/images/I/91t43-d9iUL._SL1500_.jpg',
    description: 'Hướng dẫn xây dựng ứng dụng web hiện đại với ReactJS. Phù hợp cho người mới bắt đầu tìm hiểu về Frontend Development.',
    category: 'Công nghệ',
    price: 150000,
    countInStock: 20,
    rating: 4.5,
    numReviews: 5,
  },

  // --- KINH TẾ (Business) ---
  {
    title: 'Dạy Con Làm Giàu (Rich Dad Poor Dad)',
    author: 'Robert Kiyosaki',
    image: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._SL1500_.jpg',
    description: 'Thay đổi tư duy về tiền bạc. Sự khác biệt trong suy nghĩ giữa người giàu và người nghèo về tài sản và tiêu sản.',
    category: 'Kinh tế',
    price: 120000,
    countInStock: 15,
    rating: 4.6,
    numReviews: 100,
  },
  {
    title: 'Nhà Đầu Tư Thông Minh',
    author: 'Benjamin Graham',
    image: 'https://m.media-amazon.com/images/I/919mmNctaaL._SL1500_.jpg',
    description: 'Kinh thánh của đầu tư giá trị. Cuốn sách gối đầu giường của Warren Buffett về thị trường chứng khoán và quản lý tài chính.',
    category: 'Kinh tế',
    price: 250000,
    countInStock: 8,
    rating: 4.7,
    numReviews: 45,
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    image: 'https://m.media-amazon.com/images/I/71uAI28kJuL._SL1500_.jpg',
    description: 'Làm thế nào để xây dựng tương lai. Những bài học về khởi nghiệp (Startup) và cách tạo ra những sản phẩm đột phá từ con số 0.',
    category: 'Kinh tế',
    price: 180000,
    countInStock: 12,
    rating: 4.5,
    numReviews: 30,
  },

  // --- VĂN HỌC (Literature) ---
  {
    title: 'Nhà Giả Kim (The Alchemist)',
    author: 'Paulo Coelho',
    image: 'https://m.media-amazon.com/images/I/51Z0nLAfL6L._SL1000_.jpg',
    description: 'Tiểu thuyết kinh điển về hành trình theo đuổi ước mơ. Một cuốn sách nhẹ nhàng nhưng đầy triết lý sâu sắc về vận mệnh con người.',
    category: 'Văn học',
    price: 79000,
    countInStock: 50,
    rating: 4.9,
    numReviews: 200,
  },
  {
    title: 'Rừng Na Uy',
    author: 'Haruki Murakami',
    image: 'https://m.media-amazon.com/images/I/817+1o8+eNL._SL1500_.jpg',
    description: 'Câu chuyện tình yêu và nỗi cô đơn của tuổi trẻ Nhật Bản những năm 1960. Một tác phẩm u sầu nhưng đẹp đẽ và ám ảnh.',
    category: 'Văn học',
    price: 110000,
    countInStock: 10,
    rating: 4.4,
    numReviews: 60,
  },
  {
    title: 'Harry Potter và Hòn Đá Phù Thủy',
    author: 'J.K. Rowling',
    image: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._SL1500_.jpg',
    description: 'Mở đầu cuộc phiêu lưu của cậu bé phù thủy Harry Potter. Thế giới phép thuật kỳ diệu dành cho mọi lứa tuổi.',
    category: 'Văn học',
    price: 155000,
    countInStock: 25,
    rating: 5.0,
    numReviews: 500,
  },
  {
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    image: 'https://m.media-amazon.com/images/I/71OZyqvkzKL._SL1500_.jpg',
    description: 'Cuốn sách dành cho trẻ em nhưng lại chứa đựng những bài học sâu sắc cho người lớn về tình yêu, tình bạn và bản chất con người.',
    category: 'Văn học',
    price: 65000,
    countInStock: 30,
    rating: 4.8,
    numReviews: 150,
  },

  // --- KỸ NĂNG SỐNG (Self-help) ---
  {
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    image: 'https://m.media-amazon.com/images/I/71vK0WV8SBL._SL1500_.jpg',
    description: 'Nghệ thuật thu phục lòng người. Cuốn sách self-help bán chạy nhất mọi thời đại về kỹ năng giao tiếp và ứng xử.',
    category: 'Kỹ năng sống',
    price: 86000,
    countInStock: 100,
    rating: 4.8,
    numReviews: 300,
  },
  {
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    author: 'Rosie Nguyễn',
    image: 'https://salt.tikicdn.com/cache/w1200/ts/product/2e/7c/4a/a5905c1ea7f113a34a8163f9d5040660.jpg',
    description: 'Cuốn sách truyền cảm hứng cho giới trẻ Việt Nam. Khuyến khích tự học, trải nghiệm và sống hết mình với đam mê.',
    category: 'Kỹ năng sống',
    price: 90000,
    countInStock: 40,
    rating: 4.5,
    numReviews: 80,
  },

  // --- TÂM LÝ (Psychology) ---
  {
    title: 'Thinking, Fast and Slow (Tư Duy Nhanh và Chậm)',
    author: 'Daniel Kahneman',
    image: 'https://m.media-amazon.com/images/I/61fdrEuPJwL._SL1500_.jpg',
    description: 'Khám phá hai hệ thống tư duy chi phối nhận thức của chúng ta. Hiểu về các sai lầm trong ra quyết định và cách khắc phục.',
    category: 'Tâm lý',
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

    console.log('Da xoa du lieu cu (Data Destroyed)...');

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
        shop_id: index % 2 === 0 ? seller1 : seller2, 
        user: adminUser, 
      };
    });

    await Book.insertMany(sampleBooks);

    console.log('Da nhap du lieu mau voi anh xinh lung linh! (Data Imported)');
    process.exit();
  } catch (error) {
    console.error(`Loi: ${error}`);
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

    console.log('Da xoa sach du lieu!');
    process.exit();
  } catch (error) {
    console.error(`Loi: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}