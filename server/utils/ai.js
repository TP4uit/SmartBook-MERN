const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Thiếu GOOGLE_API_KEY trong file .env");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// --- CẤU HÌNH MODEL AN TOÀN NHẤT ---
// Dùng alias "gemini-flash-latest" để Google tự điều hướng sang bản ổn định
const CHAT_MODEL_NAME = "gemini-flash-latest"; 
const EMBEDDING_MODEL_NAME = "text-embedding-004"; 

// 1. Hàm tạo Vector
const getEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error(`[Lỗi Embedding] Model '${EMBEDDING_MODEL_NAME}':`, error.message);
    return [];
  }
};

// 2. Hàm Chatbot
const generateChatResponse = async (chatHistory, bookContext) => {
  try {
    const model = genAI.getGenerativeModel({ model: CHAT_MODEL_NAME });

    let systemInstruction = "Bạn là trợ lý ảo của nhà sách SmartBook. Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt.";
    
    if (bookContext) {
      systemInstruction += `\n\nSách đang xem:\n- Tên: ${bookContext.title}\n- Tác giả: ${bookContext.author}\n- Giá: ${bookContext.price}đ`;
    }

    // Format history dạng text để tránh lỗi
    const historyText = chatHistory.map(msg => 
      `${msg.role === 'user' ? 'Khách' : 'Bot'}: ${msg.parts[0].text}`
    ).join('\n');

    const lastMsg = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].parts[0].text : "Xin chào";
    
    // Prompt
    const prompt = `${systemInstruction}\n\nLịch sử chat:\n${historyText}\n\nKhách hỏi: ${lastMsg}\nBot trả lời:`;
    
    const result = await model.generateContent(prompt);
    
    return result.response.text();
  } catch (error) {
    console.error(`[Lỗi Chatbot] Model '${CHAT_MODEL_NAME}':`, error.message);
    
    if (error.message.includes("429")) {
        return "Xin lỗi, hệ thống đang quá tải. Bạn vui lòng đợi 1 phút rồi thử lại nhé!";
    }
    return "Xin lỗi, AI đang gặp sự cố. Bạn hãy thử lại sau.";
  }
};

module.exports = { getEmbedding, generateChatResponse };