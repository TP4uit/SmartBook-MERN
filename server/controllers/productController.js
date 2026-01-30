const Book = require('../models/Book');
const { generateEmbedding } = require('../utils/ai'); 

// @desc    Lấy tất cả sách (Có lọc, tìm kiếm keyword, phân trang)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // Filter cơ bản
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    
    // Filter theo Shop
    const shop = req.query.shopId ? { shop_id: req.query.shopId } : {};

    // Filter theo Giá
    let priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const price = (req.query.minPrice || req.query.maxPrice) ? { price: priceFilter } : {};

    const query = { ...keyword, ...category, ...price, ...shop };

    const count = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('shop_id', 'name email shop_info')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ books, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết 1 cuốn sách
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('shop_id', 'name shop_info');

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo sách mới (Kèm tạo Vector AI)
// @route   POST /api/products
// @access  Private (Seller)
const createProduct = async (req, res) => {
  try {
    const { title, price, description, image, category, stock_quantity, author } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
    }

    // 1. Tạo Vector Embedding
    let embedding_vector = [];
    try {
      if (description) {
        embedding_vector = await generateEmbedding(description);
      }
    } catch (aiError) {
      console.error("Lỗi tạo AI Vector (Create):", aiError.message);
      // Vẫn cho tạo sách nhưng log lỗi
    }

    const book = new Book({
      shop_id: req.user._id,
      title,
      price,
      description,
      image,
      category,
      stock_quantity,
      author,
      embedding_vector,
      reviews: [],
      rating: 0,
      numReviews: 0
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật sách (Quan trọng: Cập nhật lại Vector nếu đổi mô tả)
// @route   PUT /api/products/:id
// @access  Private (Seller)
const updateProduct = async (req, res) => {
  try {
    const { title, price, description, image, category, stock_quantity, author } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      // Kiểm tra quyền sở hữu
      if (book.shop_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền sửa sách này' });
      }

      // LOGIC AI QUAN TRỌNG:
      // Nếu mô tả thay đổi -> Cần tạo lại Vector mới để việc tìm kiếm ngữ nghĩa vẫn đúng
      if (description && description !== book.description) {
         try {
           console.log("Mô tả thay đổi, đang cập nhật lại Vector AI...");
           book.embedding_vector = await generateEmbedding(description);
         } catch (aiError) {
           console.error("Lỗi cập nhật AI Vector:", aiError.message);
           // Không chặn update, giữ vector cũ hoặc null tuỳ logic
         }
      }

      book.title = title || book.title;
      book.price = price || book.price;
      book.description = description || book.description;
      book.image = image || book.image;
      book.category = category || book.category;
      book.stock_quantity = stock_quantity || book.stock_quantity;
      book.author = author || book.author;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa sách
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
const deleteProduct = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      if (book.shop_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền xóa sách này' });
      }
      await book.deleteOne();
      res.json({ message: 'Đã xóa sách' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo đánh giá sản phẩm (Review)
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      // Kiểm tra xem user đã review chưa
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bạn đã đánh giá sách này rồi' });
      }

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
      res.status(201).json({ message: 'Đã thêm đánh giá' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};