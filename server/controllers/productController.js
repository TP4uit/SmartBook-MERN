const User = require('../models/User'); // Import model User để lấy thông tin user khi cần
const axios = require('axios'); // Thêm axios để gọi AI Microservice
const Book = require('../models/Book');
const { analyzeBookSearch } = require('../utils/ai'); // Import hàm AI

// @desc    Fetch all products (Giữ nguyên)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};
      
    const category = req.query.category ? { category: req.query.category } : {};
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 100000000;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    const count = await Book.countDocuments({ ...keyword, ...category, ...priceFilter });
    const books = await Book.find({ ...keyword, ...category, ...priceFilter })
      .populate('shop_id', 'shop_info.shop_name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- HÀM HELPER TÍNH TUỔI ---
const calculateAge = (dateOfBirth) => {
  // Nếu user chưa cập nhật ngày sinh, lấy mặc định 22 tuổi cho AI
  if (!dateOfBirth) return 22; 
  
  const diff_ms = Date.now() - new Date(dateOfBirth).getTime();
  const age_dt = new Date(diff_ms); 
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

// @desc    Fetch single product (Giữ nguyên)
const getProductById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('shop_id', 'shop_info.shop_name shop_info.shop_avatar');

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Giữ nguyên)
const createProduct = async (req, res) => {
  try {
    const { title, price, image, author, category, countInStock, description } = req.body;

    if (!title || !author || !price) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sách' });
    }

    const book = new Book({
      title,
      price,
      user: req.user._id,
      shop_id: req.user._id,
      image: image || '/images/sample.jpg',
      author,
      category,
      countInStock,
      description,
      numReviews: 0,
      rating: 0,
      ai_keywords: [category.toLowerCase(), 'new book'],
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Giữ nguyên)
const updateProduct = async (req, res) => {
  try {
    const { title, price, description, image, author, category, countInStock } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      if (book.shop_id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
          return res.status(403).json({ message: 'Bạn không có quyền sửa sách này' });
      }

      book.title = title || book.title;
      book.price = price || book.price;
      book.description = description || book.description;
      book.image = image || book.image;
      book.author = author || book.author;
      book.category = category || book.category;
      book.countInStock = countInStock || book.countInStock;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Giữ nguyên)
const deleteProduct = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (book) {
        if (book.shop_id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa sách này' });
        }
        await book.deleteOne();
        res.json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// --- TÍNH NĂNG MỚI: AI SEARCH ---
// @desc    Search products using AI Context
// @route   POST /api/products/ai-search
// @access  Public
const searchProductsAI = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Vui lòng nhập nội dung tìm kiếm' });

    // 1. Lấy dữ liệu sách rút gọn (để tiết kiệm token AI)
    // Chỉ lấy 50 sách mới nhất để demo (Production sẽ dùng Vector Search)
    const allBooks = await Book.find({})
      .select('_id title author category description price') 
      .sort({ createdAt: -1 })
      .limit(50); 

    // 2. Gửi cho AI phân tích
    const matchedIds = await analyzeBookSearch(query, allBooks);

    // 3. Lấy thông tin đầy đủ của các sách được AI chọn
    let results = [];
    if (matchedIds && matchedIds.length > 0) {
      results = await Book.find({ _id: { $in: matchedIds } })
        .populate('shop_id', 'shop_info.shop_name');
    }

    res.json(results);
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({ message: 'Lỗi khi xử lý AI Search' });
  }
};

// @desc    Lấy danh sách sách gợi ý từ AI Microservice
// @route   GET /api/products/recommendations
// @access  Public
const getRecommendedBooks = async (req, res) => {
  try {
    // 1. Xác định User (Giả sử route này đã đi qua middleware protect, có req.user)
    // Nếu user chưa đăng nhập (khách vãng lai), ta có thể truyền ID giả hoặc gán age/location mặc định
    let userId = "guest";
    let age = 22;
    let location = "vietnam";
    let alpha = req.query.alpha ? parseFloat(req.query.alpha) : 0.5; // Cho phép đổi alpha từ Frontend để demo

    if (req.user) {
      // Tìm lại thông tin user từ DB để chắc chắn có field location và dateOfBirth
      const currentUser = await User.findById(req.user._id);
      if (currentUser) {
        userId = currentUser._id.toString();
        age = calculateAge(currentUser.dateOfBirth);
        // Đảm bảo location gửi sang Python luôn viết thường và không dấu (nếu dictionary yêu cầu)
        location = currentUser.location ? currentUser.location.toLowerCase() : "vietnam";
      }
    }

    // 2. Gửi payload hoàn chỉnh sang AI Service (FastAPI đang chạy ở cổng 8000)
    const aiResponse = await axios.post('http://localhost:8000/api/recommend', {
      user_id: userId,
      age: age,
      location: location,
      alpha: alpha 
    });

    if (aiResponse.data.status === 500 || !aiResponse.data.recommended_isbns) {
      console.error("Lỗi chi tiết từ Python AI:", aiResponse.data.error);
      return res.status(500).json({ success: false, message: 'Lỗi mô hình AI', error: aiResponse.data.error });
    }

    // 3. AI trả về mảng ISBN. Nhiệm vụ của Node.js là lấy mảng ISBN này quét DB để lấy data sách thật
    const recommendedISBNs = aiResponse.data.recommended_isbns;
    
    // Tìm các cuốn sách khớp với mã ISBN trả về
    const books = await Book.find({ ISBN: { $in: recommendedISBNs } });

    // Sắp xếp lại danh sách books cho đúng với thứ tự mảng ISBN mà AI đã xếp hạng cao xuống thấp
    const sortedBooks = recommendedISBNs
      .map(isbn => books.find(b => b.ISBN === isbn))
      .filter(b => b !== undefined);

    // 4. Trả kết quả về cho Frontend
    res.json({
      success: true,
      type: aiResponse.data.type, // Gửi kèm "Cold Start" hay "Hybrid" để Frontend hiển thị nhãn demo
      books: sortedBooks
    });

  } catch (error) {
    console.error('Lỗi khi gọi AI Recommendation:', error.message);
    res.status(500).json({ message: 'Lỗi server khi phân tích gợi ý sách' });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      // Kiểm tra xem user này đã đánh giá cuốn sách này chưa
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bạn đã đánh giá cuốn sách này rồi' });
      }

      // Tạo review mới
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      book.reviews.push(review);
      book.numReviews = book.reviews.length;
      
      // Tính lại điểm trung bình
      book.rating =
        book.reviews.reduce((acc, item) => item.rating + acc, 0) /
        book.reviews.length;

      await book.save();
      res.status(201).json({ message: 'Đã thêm đánh giá thành công!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const exportRatingsCSV = async (req, res) => {
  try {
    const books = await Book.find({}).populate('reviews.user', '_id');
    let csvData = "User-ID,ISBN,Book-Rating\n"; // Header chuẩn của Kaggle

    books.forEach(book => {
      if (book.reviews && book.reviews.length > 0) {
        book.reviews.forEach(review => {
          // Ghi từng dòng: ID_NguoiDung, Mã_Sách, Điểm
          csvData += `${review.user._id},${book.ISBN},${review.rating}\n`;
        });
      }
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('smartbook_new_ratings.csv');
    return res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xuất dữ liệu' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAI, // Export thêm hàm này
  getRecommendedBooks, // Export hàm gợi ý sách
  createProductReview // Export hàm tạo đánh giá sách
};