const Book = require('../models/Book');
const { getEmbedding } = require('../utils/ai');

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
    const { 
      title, author, description, price, original_price, 
      category, stock_quantity, images, shop_id 
    } = req.body;

    // 1. Tạo chuỗi văn bản cần vector hóa (Kết hợp tên + mô tả + tác giả)
    const textToEmbed = `${title} ${description} ${author} ${category}`;
    
    // 2. Gọi AI tạo vector (Chờ một chút)
    const vector = await getEmbedding(textToEmbed);

    const book = new Book({
      title,
      author,
      description,
      price,
      original_price,
      category,
      stock_quantity,
      images,
      shop_id,
      embedding_vector: vector, // <-- Lưu vector vào DB
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


// @desc    Tìm kiếm bằng AI (Vector Search)
// @route   GET /api/products/search/semantic
const searchSemantic = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Vui lòng nhập từ khóa' });
    }

    // 1. Chuyển câu query của người dùng thành Vector
    const queryVector = await getEmbedding(query);

    // 2. Tìm kiếm trong MongoDB bằng Aggregation Pipeline
    const products = await Book.aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index", // Tên index bạn đã tạo trên Atlas (Giai đoạn 1)
          "path": "embedding_vector",
          "queryVector": queryVector,
          "numCandidates": 100, // Số lượng ứng viên quét qua
          "limit": 10 // Số kết quả trả về
        }
      },
      {
        "$project": {
          title: 1,
          price: 1,
          images: 1,
          author: 1,
          description: 1,
          shop_id: 1,
          score: { $meta: "vectorSearchScore" } // Trả về độ chính xác (0-1)
        }
      },
      {
  "$match": {
    "score": { $gte: 0.8 } // Chỉ lấy sách có độ giống >= 60%
    }
      }
    ]);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Nhớ export thêm hàm này
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  searchSemantic // <-- Thêm vào đây
};