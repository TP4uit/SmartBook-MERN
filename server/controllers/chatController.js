const Book = require('../models/Book');
const { generateChatResponse } = require('../utils/ai');

// @desc    Chat với AI (có ngữ cảnh sách)
// @route   POST /api/chat
// @access  Public (Hoặc Private tùy nhu cầu)
const chatWithAI = async (req, res) => {
  try {
    const { message, history, productId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Vui lòng nhập tin nhắn' });
    }

    let bookContext = null;

    // Nếu đang xem sách, lấy thông tin sách để AI hiểu ngữ cảnh
    if (productId) {
      bookContext = await Book.findById(productId).select('title author price description');
    }

    // Chuẩn bị lịch sử chat
    const chatHistory = history || [];
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    // Gọi AI
    const aiReply = await generateChatResponse(chatHistory, bookContext);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAI };