const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book');
const { v4: uuidv4 } = require('uuid');

// @desc    Tạo đơn hàng mới (Hỗ trợ Tách đơn & Transaction)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    // Mã giao dịch chung cho các đơn hàng được tách
    const transactionRef = `TRANS_${uuidv4()}`; 

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({ message: 'Thiếu địa chỉ giao hàng' });
    }
    const { address, city, postalCode, country } = shippingAddress;
    if (!address) {
      return res.status(400).json({ message: 'Vui lòng nhập địa chỉ giao hàng' });
    }
    const normalizedShipping = {
      address: String(address),
      city: city != null ? String(city) : '',
      postalCode: postalCode != null ? String(postalCode) : '',
      country: country != null ? String(country) : 'Việt Nam',
    };

    // Gom nhóm item theo shop
    const itemsByShop = orderItems.reduce((acc, item) => {
      const shopId = item.shop;
      if (!shopId) return acc;
      if (!acc[shopId]) acc[shopId] = [];
      const productId = item.product || item.book;
      if (!productId || !item.name || item.qty == null || item.price == null) return acc;
      acc[shopId].push({
        name: String(item.name),
        qty: Number(item.qty),
        image: item.image && String(item.image).trim() ? String(item.image) : 'https://via.placeholder.com/150',
        price: Number(item.price),
        product: productId,
      });
      return acc;
    }, {});

    const createdOrders = [];

    for (const shopId of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopId];
      if (!shopItems.length) continue;

      const itemsPrice = shopItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = 30000;
      const totalPrice = itemsPrice + shippingPrice;

      const order = new Order({
        user: req.user._id,
        shop_id: shopId,
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

      for (const item of shopItems) {
        const book = await Book.findById(item.product).session(session);
        if (!book) throw new Error(`Sách không tồn tại: ${item.name}`);
        const stock = Number(book.stock_quantity) || 0;
        if (stock < item.qty) throw new Error(`Sách ${item.name} hết hàng`);
        book.stock_quantity = stock - item.qty;
        await book.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ 
      message: 'Đặt hàng thành công', 
      orders: createdOrders,
      transactionRef 
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction Error:', error);
    res.status(500).json({ message: error.message || 'Lỗi tạo đơn hàng' });
  }
};

// @desc    Lấy chi tiết 1 đơn hàng
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('shop_id', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy lịch sử mua hàng của User
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('shop_id', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- MỚI: API CHO SELLER (Nguyên nhân lỗi của bạn là thiếu phần này) ---

// @desc    Lấy danh sách đơn hàng KHÁCH ĐẶT tại Shop mình
// @route   GET /api/orders/seller/orders
// @access  Private (Seller)
const getOrdersByShop = async (req, res) => {
  try {
    // Tìm các đơn hàng mà shop_id trùng với ID người đang login
    const orders = await Order.find({ shop_id: req.user._id })
      .populate('user', 'name email') // Lấy thông tin khách mua
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (Duyệt/Giao/Hủy)
// @route   PUT /api/orders/:id/status
// @access  Private (Seller)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const order = await Order.findById(req.params.id);

    if (order) {
      // Bảo mật: Chỉ chủ shop mới được sửa đơn của mình
      if (order.shop_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Bạn không có quyền xử lý đơn hàng này' });
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
  getOrdersByShop,    // <-- Đã có hàm này, lỗi sẽ hết
  updateOrderStatus   
};