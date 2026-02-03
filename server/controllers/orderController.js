const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book');
const { v4: uuidv4 } = require('uuid');

// @desc    Tạo đơn hàng mới (Tách đơn theo shop & Bảo mật giá)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({ message: 'Thiếu địa chỉ giao hàng' });
    }

    // Chuẩn hóa địa chỉ
    const normalizedShipping = {
      address: String(shippingAddress.address),
      city: String(shippingAddress.city || ''),
      postalCode: String(shippingAddress.postalCode || ''),
      country: String(shippingAddress.country || 'Việt Nam'),
    };

    const transactionRef = `TRANS_${uuidv4()}`;

    // 1. Lấy danh sách ID sản phẩm từ giỏ hàng
    const productIds = [...new Set(orderItems.map((item) => item.product || item.book).filter(Boolean))];
    
    // 2. Fetch dữ liệu sách từ DB để lấy Giá chuẩn và Shop ID (Bảo mật)
    const books = await Book.find({ _id: { $in: productIds } })
      .select('_id shop_id price countInStock title image') // Lấy cả image để fallback
      .session(session);
    
    // Map nhanh dữ liệu từ DB
    const dbBooksMap = {};
    for (const b of books) {
      dbBooksMap[b._id.toString()] = b;
    }

    // 3. Gom nhóm sản phẩm theo Shop (Dùng dữ liệu DB làm chuẩn)
    const itemsByShop = {};

    for (const item of orderItems) {
      const productId = item.product || item.book;
      if (!productId) continue;

      const dbBook = dbBooksMap[productId.toString()];
      if (!dbBook) {
        throw new Error(`Sản phẩm không tồn tại hoặc đã bị xóa: ${productId}`);
      }

      // Kiểm tra tồn kho ngay lập tức
      if (dbBook.countInStock < item.qty) {
        throw new Error(`Sách "${dbBook.title}" tạm hết hàng (Kho còn: ${dbBook.countInStock})`);
      }

      const shopKey = dbBook.shop_id.toString();
      if (!itemsByShop[shopKey]) itemsByShop[shopKey] = [];
      
      // Đẩy vào mảng của Shop tương ứng
      // QUAN TRỌNG: Sử dụng dbBook.price thay vì item.price từ frontend để tránh hack giá
      itemsByShop[shopKey].push({
        name: dbBook.title,
        qty: Number(item.qty),
        image: item.image || dbBook.image, // Ưu tiên ảnh frontend gửi (nếu có logic chọn variant) hoặc ảnh gốc
        price: Number(dbBook.price),      // Lấy giá từ DB
        product: dbBook._id,
      });
    }

    const createdOrders = [];

    // 4. Tạo Order document cho từng Shop
    for (const shopKey of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopKey];
      if (!shopItems.length) continue;

      // Tính tổng tiền dựa trên giá DB
      const itemsPrice = shopItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = 30000; // Phí ship cố định hoặc logic dynamic sau này
      const totalPrice = itemsPrice + shippingPrice;

      const order = new Order({
        user: req.user._id,
        shop: shopKey,      // Reference User model (Seller)
        shop_id: shopKey,   // Reference User model (Seller) - Backup field
        transaction_ref: transactionRef,
        orderItems: shopItems,
        shippingAddress: normalizedShipping,
        paymentMethod: paymentMethod || 'COD',
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      const savedOrder = await order.save({ session });
      createdOrders.push(savedOrder);

      // Trừ tồn kho
      for (const item of shopItems) {
        const book = dbBooksMap[item.product.toString()];
        book.countInStock = book.countInStock - item.qty;
        await book.save({ session });
      }
    }

    if (createdOrders.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Không thể tạo đơn hàng. Vui lòng thử lại.' });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Đặt hàng thành công',
      orders: createdOrders,
      transactionRef,
    });

  } catch (error) {
    try { await session.abortTransaction(); } catch (_) {}
    session.endSession();
    console.error('Order Error:', error);
    res.status(500).json({ message: error.message || 'Lỗi xử lý đơn hàng' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('shop_id', 'name email shop_info');
    if (order) {
      // Security: Chỉ người mua hoặc người bán (chủ shop) hoặc admin mới xem được
      const isOwner = order.user._id.toString() === req.user._id.toString();
      const isSeller = order.shop_id._id.toString() === req.user._id.toString();
      
      if (isOwner || isSeller || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Không có quyền xem đơn hàng này' });
      }
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('shop_id', 'name shop_info')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByShop = async (req, res) => {
  try {
    // Tìm các đơn hàng mà shop_id trùng với user đang login
    const orders = await Order.find({
      $or: [{ shop: req.user._id }, { shop_id: req.user._id }],
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const order = await Order.findById(req.params.id);

    if (order) {
      // Chỉ Seller sở hữu đơn hàng mới được update
      if (order.shop_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền cập nhật đơn hàng này' });
      }

      order.status = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  addOrderItems, 
  getOrderById, 
  getMyOrders,
  getOrdersByShop,
  updateOrderStatus   
};