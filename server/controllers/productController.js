const Book = require('../models/Book');
const { getEmbedding } = require('../utils/ai');

// ... (Giữ nguyên các hàm getProducts, getProductById, createProduct, deleteProduct)

// @desc    Lấy tất cả sách
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const count = await Book.countDocuments({ ...keyword });
    const products = await Book.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết sách
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

// @desc    Tạo sách mới
const createProduct = async (req, res) => {
  try {
    const { 
      title, author, description, price, original_price, 
      category, stock_quantity, images, shop_id 
    } = req.body;

    const textToEmbed = `${title} ${description} ${author} ${category}`;
    const vector = await getEmbedding(textToEmbed);

    const book = new Book({
      title, author, description, price, original_price, 
      category, stock_quantity, images, shop_id,
      embedding_vector: vector,
      is_active: true
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa sách
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

// --- LOGIC SEARCH CẢI TIẾN ---
const searchSemantic = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Vui lòng nhập từ khóa' });

    let products = [];
    let searchMethod = 'AI Semantic';

    // 1. Tìm bằng AI Vector
    const queryVector = await getEmbedding(query);
    
    if (queryVector.length > 0) {
      products = await Book.aggregate([
        {
          "$vectorSearch": {
            "index": "vector_index",
            "path": "embedding_vector",
            "queryVector": queryVector,
            "numCandidates": 100, // Quét 100 ứng viên
            "limit": 20 // Lấy 20 kết quả tốt nhất
          }
        },
        {
          "$project": {
            title: 1, price: 1, images: 1, author: 1, description: 1, shop_id: 1,
            score: { $meta: "vectorSearchScore" }
          }
        },
        {
          // Lọc bớt kết quả nhiễu (dưới 0.75 coi như không liên quan)
          "$match": { "score": { $gte: 0.75 } } 
        }
      ]);
    }

    // --- CẢI TIẾN: RE-RANKING THỦ CÔNG ---
    // Vì AI đôi khi "ngáo" (như vụ Conan vs Huyền Vũ Bão), ta sẽ ưu tiên thủ công:
    // Nếu Tiêu đề hoặc Mô tả chứa chính xác từ khóa --> Đẩy lên đầu.
    if (products.length > 0) {
      const lowerQuery = query.toLowerCase();
      products.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(lowerQuery);
        const bTitleMatch = b.title.toLowerCase().includes(lowerQuery);
        const aDescMatch = a.description.toLowerCase().includes(lowerQuery);
        const bDescMatch = b.description.toLowerCase().includes(lowerQuery);

        // 1. Ưu tiên khớp Tiêu đề
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;

        // 2. Ưu tiên khớp Mô tả
        if (aDescMatch && !bDescMatch) return -1;
        if (!aDescMatch && bDescMatch) return 1;

        // 3. Nếu ngang nhau thì so điểm AI
        return b.score - a.score;
      });
    }

    // 2. Fallback: Nếu AI trả về rỗng (do lọc quá chặt hoặc lỗi), tìm bằng từ khóa thường
    if (products.length === 0) {
      searchMethod = 'Fallback (Keyword)';
      products = await Book.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } } // Tìm thêm trong mô tả cho chắc
        ]
      }).limit(10).select('title price images author description shop_id');
    }

    res.json({ method: searchMethod, count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách sách của User hiện tại (Seller Dashboard)
// @route   GET /api/products/seller/my-products
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    // Chỉ tìm sách có shop_id trùng với user đang login
    const products = await Book.find({ shop_id: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin sách
// @route   PUT /api/products/:id
// @access  Private (Chỉ chủ sách mới được sửa)
const updateProduct = async (req, res) => {
  try {
    const { title, price, description, stock_quantity, images, category } = req.body;
    
    const product = await Book.findById(req.params.id);

    if (product) {
      // Bảo mật: Kiểm tra xem người sửa có phải chủ sách không
      if (product.shop_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Bạn không có quyền sửa sách này' });
      }

      product.title = title || product.title;
      product.price = price || product.price;
      product.description = description || product.description;
      product.stock_quantity = stock_quantity || product.stock_quantity;
      product.images = images || product.images;
      product.category = category || product.category;

      // Lưu ý: Nếu sửa title/desc thì Vector cũ sẽ không còn đúng. 
      // Tuy nhiên để tối ưu hiệu năng, ta tạm thời KHÔNG tạo lại vector ngay lập tức 
      // (hoặc có thể tạo background job sau này).

      const updatedProduct = await product.save();
      res.json(updatedProduct);
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
  deleteProduct,
  searchSemantic,
  getMyProducts, // <-- Export hàm mới
  updateProduct  // <-- Export hàm mới
};