const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book');
const { v4: uuidv4 } = require('uuid');

// @desc    Tạo đơn hàng mới (Tách đơn theo shop: một Order document cho mỗi shop)
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
    const normalizedShipping = {
      address: String(shippingAddress.address),
      city: String(shippingAddress.city || ''),
      postalCode: String(shippingAddress.postalCode || ''),
      country: String(shippingAddress.country || 'Việt Nam'),
    };

    const transactionRef = `TRANS_${uuidv4()}`;

    // 1. Lấy thông tin Shop ID chuẩn từ DB
    const productIds = [...new Set(orderItems.map((item) => item.product || item.book).filter(Boolean))];
    const books = await Book.find({ _id: { $in: productIds } }).select('_id shop_id').session(session).lean();
    
    const productToShop = {};
    for (const b of books) {
      productToShop[b._id.toString()] = b.shop_id;
    }

    // 2. Gom nhóm sản phẩm theo Shop
    const itemsByShop = {};
    for (const item of orderItems) {
      const productId = item.product || item.book;
      if (!productId) continue;

      let shopId = item.shop;
      // Fallback: Nếu frontend thiếu shopId, lấy từ DB
      if (!shopId && productToShop[productId.toString()]) {
        shopId = productToShop[productId.toString()];
      }
      if (!shopId) continue;

      const shopKey = shopId.toString();
      if (!itemsByShop[shopKey]) itemsByShop[shopKey] = [];
      
      itemsByShop[shopKey].push({
        name: String(item.name),
        qty: Number(item.qty),
        image: String(item.image || ''),
        price: Number(item.price),
        product: productId,
      });
    }

    const createdOrders = [];

    // 3. Tạo Order cho từng Shop
    for (const shopKey of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopKey];
      if (!shopItems.length) continue;

      const itemsPrice = shopItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = 30000;
      const totalPrice = itemsPrice + shippingPrice;

      const order = new Order({
        user: req.user._id,
        shop: shopKey,
        shop_id: shopKey,
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

      // --- SỬA LỖI QUAN TRỌNG TẠI ĐÂY ---
      for (const item of shopItems) {
        const book = await Book.findById(item.product).session(session);
        if (!book) throw new Error(`Sách không tồn tại: ${item.name}`);
        
        // Dùng đúng biến countInStock khớp với Model Book.js
        const stock = Number(book.countInStock) || 0; 
        
        if (stock < item.qty) {
            throw new Error(`Sách "${item.name}" tạm hết hàng (Kho còn: ${stock})`);
        }
        
        // Trừ tồn kho
        book.countInStock = stock - item.qty;
        await book.save({ session });
      }
    }

    if (createdOrders.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Lỗi xác định Shop. Vui lòng thử lại.' });
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
    res.status(500).json({ message: error.message || 'Lỗi tạo đơn hàng' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('shop_id', 'name email shop_info');
    if (order) res.json(order);
    else res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
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
      if (order.shop_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền' });
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