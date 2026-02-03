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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAI, // Export thêm hàm này
};