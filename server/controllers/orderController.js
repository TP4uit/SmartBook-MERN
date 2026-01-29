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

    // Gom nhóm item theo shop
    const itemsByShop = orderItems.reduce((acc, item) => {
      const shopId = item.shop;
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(item);
      return acc;
    }, {});

    const createdOrders = [];

    // Tạo đơn cho từng shop
    for (const shopId of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopId];

      const itemsPrice = shopItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = 30000; 
      const totalPrice = itemsPrice + shippingPrice;

      const order = new Order({
        user: req.user._id,
        shop_id: shopId,
        transaction_ref: transactionRef,
        orderItems: shopItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      const savedOrder = await order.save({ session });
      createdOrders.push(savedOrder);

      // Trừ tồn kho
      for (const item of shopItems) {
        const book = await Book.findById(item.product).session(session);
        if (!book) throw new Error(`Sách không tồn tại: ${item.name}`);
        if (book.stock_quantity < item.qty) throw new Error(`Sách ${item.name} hết hàng`);
        
        book.stock_quantity -= item.qty;
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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
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