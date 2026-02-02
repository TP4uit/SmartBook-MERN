const Book = require('../models/Book');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // Build Keyword & Filter Query
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
      
    const category = req.query.category ? { category: req.query.category } : {};
    
    // Price Filter
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 100000000;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    const count = await Book.countDocuments({ ...keyword, ...category, ...priceFilter });
    const books = await Book.find({ ...keyword, ...category, ...priceFilter })
      .populate('shop_id', 'shop_info.shop_name') // Populate tên Shop
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    // Trả về Array trực tiếp như Frontend yêu cầu
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('shop_id', 'shop_info.shop_name shop_info.shop_avatar'); // Lấy info Shop để hiển thị

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Seller)
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      image,
      author,
      category,
      countInStock,
      description,
    } = req.body;

    // Validate
    if (!title || !author || !price) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sách' });
    }

    const book = new Book({
      title,
      price,
      user: req.user._id,
      shop_id: req.user._id, // QUAN TRỌNG: Gán sách này thuộc về Shop của user đang login
      image: image || '/images/sample.jpg',
      author,
      category,
      countInStock,
      description,
      numReviews: 0,
      rating: 0,
      ai_keywords: [category.toLowerCase(), 'new book'], // Tạo keyword mặc định cho AI sau này
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      image,
      author,
      category,
      countInStock,
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
      // Check quyền sở hữu: Chỉ chủ shop mới được sửa sách của mình
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};