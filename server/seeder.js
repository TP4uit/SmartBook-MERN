/**
 * SmartBook Seeder - Nạp dữ liệu mẫu (Users, Books với embedding, Orders)
 * Chạy: node server/seeder.js
 * Cần: MONGO_URI, GEMINI_API_KEY trong .env
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
const { generateEmbedding } = require('./utils/ai');

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600';

async function seed() {
  try {
    await connectDB();

    // 1. Xóa sạch dữ liệu cũ (thứ tự: Order -> Book -> User)
    console.log('🗑️  Đang xóa dữ liệu cũ...');
    await Order.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});

    // 2. Tạo Users mẫu
    console.log('👤 Đang tạo Users...');
    const admin = await User.create({
      name: 'Admin SmartBook',
      email: 'admin@smartbook.vn',
      password: 'admin123',
      role: 'admin',
      phone: '0900000001',
      address: 'TP.HCM',
    });

    const sellerFahasa = await User.create({
      name: 'Fahasa',
      email: 'fahasa@smartbook.vn',
      password: 'fahasa123',
      role: 'seller',
      phone: '0900000002',
      address: 'TP.HCM',
      shop_info: { shop_name: 'Fahasa', rating: 4.8, follower_count: 15000 },
    });

    const sellerTiki = await User.create({
      name: 'Tiki Trading',
      email: 'tiki@smartbook.vn',
      password: 'tiki123',
      role: 'seller',
      phone: '0900000003',
      address: 'TP.HCM',
      shop_info: { shop_name: 'Tiki Trading', rating: 4.7, follower_count: 12000 },
    });

    const customer = await User.create({
      name: 'Nguyễn Văn Khách',
      email: 'khach@smartbook.vn',
      password: 'khach123',
      role: 'customer',
      phone: '0900000004',
      address: 'Hà Nội',
    });

    // 3. Tạo Sách mẫu (có embedding từ description)
    const booksData = [
      {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Tâm lý & Kỹ năng',
        description: 'Đắc Nhân Tâm là cuốn sách self-help kinh điển về nghệ thuật giao tiếp, thu phục lòng người và sống hạnh phúc. Dale Carnegie đưa ra các nguyên tắc vàng trong ứng xử, lắng nghe và thấu hiểu người khác.',
        price: 79000,
        original_price: 99000,
        stock_quantity: 500,
        sold_quantity: 12500,
        rating_average: 4.8,
        rating_count: 3200,
        is_best_seller: true,
        tags: ['Freeship Xtra', 'Đổi trả 7 ngày'],
        shop_id: sellerFahasa._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Văn học',
        description: 'Nhà Giả Kim kể về chàng chăn cừu Santiago đi tìm kho báu và ý nghĩa cuộc đời. Câu chuyện truyền cảm hứng về việc theo đuổi ước mơ, lắng nghe trái tim và khám phá định mệnh của mỗi con người.',
        price: 65000,
        original_price: 85000,
        stock_quantity: 800,
        sold_quantity: 8200,
        rating_average: 4.7,
        rating_count: 2100,
        is_best_seller: true,
        tags: ['Bán chạy'],
        shop_id: sellerFahasa._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Tâm lý & Kỹ năng',
        description: 'Tuổi Trẻ Đáng Giá Bao Nhiêu là cuốn sách dành cho người trẻ về cách sống có ý nghĩa, dám ước mơ và hành động. Rosie Nguyễn chia sẻ trải nghiệm du lịch, đọc sách và tự phát triển bản thân.',
        price: 89000,
        original_price: 110000,
        stock_quantity: 300,
        sold_quantity: 5600,
        rating_average: 4.6,
        rating_count: 1800,
        is_best_seller: false,
        tags: ['Đổi trả 7 ngày'],
        shop_id: sellerTiki._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Đời Thay Đổi Khi Chúng Ta Thay Đổi',
        author: 'Andrew Matthews',
        category: 'Tâm lý & Kỹ năng',
        description: 'Cuốn sách về tư duy tích cực và thay đổi bản thân. Andrew Matthews dùng câu chuyện và hình vẽ minh họa để truyền tải thông điệp: thái độ và suy nghĩ quyết định chất lượng cuộc sống của chúng ta.',
        price: 65000,
        original_price: 75000,
        stock_quantity: 400,
        sold_quantity: 4200,
        rating_average: 4.5,
        rating_count: 950,
        is_best_seller: false,
        tags: [],
        shop_id: sellerTiki._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Cà Phê Cùng Tony',
        author: 'Tony Buổi Sáng',
        category: 'Văn học',
        description: 'Tập tản văn nhẹ nhàng về lối sống, cách ứng xử và tư duy của giới trẻ. Tony Buổi Sáng gửi gắm bài học qua những câu chuyện đời thường, hài hước nhưng đầy ý nghĩa.',
        price: 55000,
        original_price: 69000,
        stock_quantity: 600,
        sold_quantity: 9800,
        rating_average: 4.7,
        rating_count: 2500,
        is_best_seller: true,
        tags: ['Freeship Xtra'],
        shop_id: sellerFahasa._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
        author: 'Nguyễn Nhật Ánh',
        category: 'Văn học',
        description: 'Truyện dài của Nguyễn Nhật Ánh kể về tuổi thơ với những trò chơi, kỷ niệm và ước mơ trong sáng. Cuốn sách gợi nhớ về quê hương, gia đình và những năm tháng đẹp đẽ đã qua.',
        price: 72000,
        original_price: 88000,
        stock_quantity: 350,
        sold_quantity: 6700,
        rating_average: 4.8,
        rating_count: 3100,
        is_best_seller: true,
        tags: ['Đổi trả 7 ngày'],
        shop_id: sellerTiki._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Sapiens - Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Kinh tế',
        description: 'Sapiens kể lại lịch sử nhân loại từ thời tiền sử đến hiện đại. Yuval Noah Harari phân tích cách Homo sapiens chinh phục thế giới nhờ ngôn ngữ, tưởng tượng và hợp tác quy mô lớn.',
        price: 159000,
        original_price: 199000,
        stock_quantity: 200,
        sold_quantity: 3400,
        rating_average: 4.6,
        rating_count: 1200,
        is_best_seller: false,
        tags: [],
        shop_id: sellerFahasa._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Khéo Ăn Khéo Nói Sẽ Có Được Thiên Hạ',
        author: 'Trác Nhã',
        category: 'Tâm lý & Kỹ năng',
        description: 'Sách kỹ năng giao tiếp và ứng xử trong công việc, gia đình và xã hội. Cung cấp các nguyên tắc nói chuyện khéo léo, lắng nghe và xây dựng mối quan hệ tốt đẹp.',
        price: 68000,
        original_price: 82000,
        stock_quantity: 450,
        sold_quantity: 5100,
        rating_average: 4.5,
        rating_count: 880,
        is_best_seller: false,
        tags: ['Đổi trả 7 ngày'],
        shop_id: sellerTiki._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Tôi Tài Giỏi Bạn Cũng Thế',
        author: 'Adam Khoo',
        category: 'Tâm lý & Kỹ năng',
        description: 'Cuốn sách về phương pháp học tập hiệu quả, quản lý thời gian và tư duy thành công dành cho học sinh sinh viên. Adam Khoo chia sẻ cách từ học sinh kém trở thành học sinh giỏi.',
        price: 95000,
        original_price: 115000,
        stock_quantity: 280,
        sold_quantity: 2900,
        rating_average: 4.7,
        rating_count: 1600,
        is_best_seller: false,
        tags: ['Freeship Xtra', 'Đổi trả 7 ngày'],
        shop_id: sellerFahasa._id,
        images: [PLACEHOLDER_IMAGE],
      },
      {
        title: 'Lược Sử Thời Gian',
        author: 'Stephen Hawking',
        category: 'Kinh tế',
        description: 'Cuốn sách khoa học phổ thông nổi tiếng về vũ trụ, thời gian, hố đen và nguồn gốc vũ trụ. Stephen Hawking giải thích các khái niệm vật lý phức tạp bằng ngôn ngữ dễ hiểu cho đại chúng.',
        price: 125000,
        original_price: 149000,
        stock_quantity: 150,
        sold_quantity: 1800,
        rating_average: 4.6,
        rating_count: 720,
        is_best_seller: false,
        tags: [],
        shop_id: sellerTiki._id,
        images: [PLACEHOLDER_IMAGE],
      },
    ];

    console.log('📚 Đang tạo sách và embedding vector (có thể mất vài phút)...');
    const createdBooks = [];
    for (const b of booksData) {
      let embedding_vector = [];
      try {
        embedding_vector = await generateEmbedding(b.description);
      } catch (err) {
        console.warn(`⚠️  Embedding thất bại cho "${b.title}":`, err.message);
      }
      const book = await Book.create({
        ...b,
        embedding_vector,
      });
      createdBooks.push(book);
      console.log(`   ✓ ${book.title}`);
    }

    // 4. Tạo vài đơn hàng mẫu (tùy chọn)
    console.log('📦 Đang tạo đơn hàng mẫu...');
    const txRef = 'TX-' + Date.now();
    await Order.create({
      user: customer._id,
      shop_id: sellerFahasa._id,
      transaction_ref: txRef,
      orderItems: [
        { name: createdBooks[0].title, qty: 2, image: createdBooks[0].images?.[0] || PLACEHOLDER_IMAGE, price: createdBooks[0].price, product: createdBooks[0]._id },
        { name: createdBooks[1].title, qty: 1, image: createdBooks[1].images?.[0] || PLACEHOLDER_IMAGE, price: createdBooks[1].price, product: createdBooks[1]._id },
      ],
      shippingAddress: { address: '123 Đường ABC', city: 'Hà Nội', postalCode: '100000', country: 'Việt Nam' },
      paymentMethod: 'COD',
      itemsPrice: createdBooks[0].price * 2 + createdBooks[1].price,
      shippingPrice: 20000,
      totalPrice: createdBooks[0].price * 2 + createdBooks[1].price + 20000,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: true,
      deliveredAt: new Date(),
      status: 'Delivered',
    });

    await Order.create({
      user: customer._id,
      shop_id: sellerTiki._id,
      transaction_ref: txRef,
      orderItems: [
        { name: createdBooks[2].title, qty: 1, image: createdBooks[2].images?.[0] || PLACEHOLDER_IMAGE, price: createdBooks[2].price, product: createdBooks[2]._id },
      ],
      shippingAddress: { address: '123 Đường ABC', city: 'Hà Nội', postalCode: '100000', country: 'Việt Nam' },
      paymentMethod: 'COD',
      itemsPrice: createdBooks[2].price,
      shippingPrice: 15000,
      totalPrice: createdBooks[2].price + 15000,
      isPaid: false,
      status: 'Pending',
    });

    console.log('\n✅ Seeder hoàn tất!');
    console.log('   - 1 Admin, 2 Sellers (Fahasa, Tiki), 1 Customer');
    console.log('   -', createdBooks.length, 'sách (đã có embedding_vector)');
    console.log('   - 2 đơn hàng mẫu');
    console.log('\n🔑 Tài khoản đăng nhập:');
    console.log('   Admin: admin@smartbook.vn / admin123');
    console.log('   Fahasa: fahasa@smartbook.vn / fahasa123');
    console.log('   Tiki: tiki@smartbook.vn / tiki123');
    console.log('   Khách: khach@smartbook.vn / khach123');
  } catch (error) {
    console.error('❌ Seeder lỗi:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n📴 Đã ngắt kết nối MongoDB.');
    process.exit(0);
  }
}

seed();
