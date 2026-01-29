const Book = require('../models/Book');

// @desc    Lấy tất cả sách (Có lọc & phân trang)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12; // Số sách mỗi trang
    const page = Number(req.query.pageNumber) || 1;

    // Xử lý tìm kiếm từ khóa
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i', // Không phân biệt hoa thường
          },
        }
      : {};

    const count = await Book.countDocuments({ ...keyword });
    const products = await Book.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết 1 cuốn sách
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Book.findById(req.params.id).populate('shop_id', 'name email shop_info');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sách' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo sách mới (Seller)
// @route   POST /api/products
// @access  Private (Seller/Admin)
const createProduct = async (req, res) => {
  try {
    // Giả sử req.user.id đã có nhờ middleware auth (sẽ làm sau)
    // Tạm thời lấy shop_id từ body để test Postman
    const { 
      title, author, description, price, original_price, 
      category, stock_quantity, images, shop_id 
    } = req.body;

    const book = new Book({
      title,
      author,
      description,
      price,
      original_price,
      category,
      stock_quantity,
      images,
      shop_id, // Sau này sẽ là req.user._id
      is_active: true
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa sách
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Book.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Đã xóa sách thành công' });
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
  deleteProduct
};