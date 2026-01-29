const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book'); // Cần import Book để trừ tồn kho
const { v4: uuidv4 } = require('uuid'); // Dùng tạo mã giao dịch

// @desc    Tạo đơn hàng mới (Hỗ trợ Tách đơn & Transaction)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  // 1. Khởi tạo Transaction (Bắt buộc dùng trên MongoDB Atlas)
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

    // 2. Tạo mã tham chiếu chung cho cả chùm đơn hàng này
    const transactionRef = `TRANS_${uuidv4()}`; 

    // 3. Gom nhóm sản phẩm theo Shop ID (Logic Tách đơn)
    // Kết quả: { 'shopID_A': [sách1], 'shopID_B': [sách2, sách3] }
    const itemsByShop = orderItems.reduce((acc, item) => {
      const shopId = item.shop; // Lưu ý: Frontend phải gửi kèm field 'shop'
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(item);
      return acc;
    }, {});

    const createdOrders = [];

    // 4. Duyệt qua từng Shop để tạo đơn hàng con
    for (const shopId of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopId];

      // Tính toán lại giá trị cho từng đơn con
      const itemsPrice = shopItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = 30000; // Phí ship mặc định (có thể update logic sau)
      const taxPrice = 0;
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const order = new Order({
        user: req.user._id,
        shop_id: shopId,
        transaction_ref: transactionRef, // Gắn mã chung
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
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // Lưu đơn hàng (kèm session để rollback nếu lỗi)
      const savedOrder = await order.save({ session });
      createdOrders.push(savedOrder);

      // 5. Trừ tồn kho (Inventory Update)
      for (const item of shopItems) {
        const book = await Book.findById(item.product).session(session);
        if (!book) {
          throw new Error(`Sách không tồn tại: ${item.name}`);
        }
        if (book.stock_quantity < item.qty) {
          throw new Error(`Sách ${item.name} không đủ số lượng tồn kho`);
        }
        
        book.stock_quantity -= item.qty;
        await book.save({ session });
      }
    }

    // 6. Nếu mọi thứ OK -> Commit (Lưu chính thức vào DB)
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ 
      message: 'Đặt hàng thành công', 
      orders: createdOrders,
      transactionRef 
    });

  } catch (error) {
    // 7. Nếu có lỗi -> Rollback (Hủy toàn bộ thao tác)
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction Error:', error);
    res.status(500).json({ message: error.message || 'Lỗi xử lý đơn hàng' });
  }
};

// @desc    Lấy chi tiết 1 đơn hàng
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('shop_id', 'name email'); // Populate thêm thông tin Shop

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách đơn hàng của người mua
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

// Xuất khẩu thêm hàm mới nếu sau này cần
module.exports = { addOrderItems, getOrderById, getMyOrders };