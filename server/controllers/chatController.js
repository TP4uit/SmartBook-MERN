const { generateChatResponse } = require('../utils/ai');
const Book = require('../models/Book');

// @desc    Chat với AI (có ngữ cảnh lịch sử & sản phẩm)
// @route   POST /api/chat
// @access  Public
const chatWithAI = async (req, res) => {
  try {
    const { message, history, productId } = req.body;
    // history: Danh sách tin nhắn cũ từ frontend
    // productId: ID sách đang xem (nếu có) để AI tư vấn chính xác

    if (!message) {
      return res.status(400).json({ message: 'Vui lòng nhập tin nhắn' });
    }

    // 1. Xây dựng ngữ cảnh (Context)
    let contextPrompt = message;
    
    // Nếu đang xem một cuốn sách cụ thể, lấy thông tin sách đó nhồi vào đầu AI
    if (productId) {
      const product = await Book.findById(productId).select('title author price description category rating');
      if (product) {
        contextPrompt = `
          [Ngữ cảnh: Người dùng đang xem cuốn sách "${product.title}" 
           - Tác giả: ${product.author}
           - Giá: ${product.price} đ
           - Đánh giá: ${product.rating} sao
           - Mô tả: ${product.description}]
           
          Câu hỏi của người dùng: "${message}"
          
          Hãy trả lời ngắn gọn, thân thiện, tập trung vào cuốn sách này.
        `;
      }
    }

    // 2. Chuẩn hóa lịch sử chat cho Gemini (Mapping)
    // Frontend thường gửi: { role: 'user/bot', content: '...' }
    // Gemini cần: { role: 'user/model', parts: [{ text: '...' }] }
    const geminiHistory = (history || []).map(msg => ({
      role: msg.role === 'bot' || msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.text || '' }]
    }));

    // 3. Gọi AI
    const reply = await generateChatResponse(geminiHistory, contextPrompt);

    res.json({ reply });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    // Trả về câu fallback nếu lỗi để không crash UI
    res.json({ reply: "Xin lỗi, hiện tại tôi đang bị quá tải. Bạn hãy hỏi lại sau một chút nhé!" });
  }
};

module.exports = { chatWithAI };