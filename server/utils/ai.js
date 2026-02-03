const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

// 1. Nạp biến môi trường
dotenv.config(); 

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ AI Error: Thiếu GEMINI_API_KEY trong file .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// --- SỬA TẠI ĐÂY: CHỌN MODEL MIỄN PHÍ ỔN ĐỊNH ---
// 'gemini-flash-latest' là model chuẩn cho Free Tier (thường là 1.5 Flash)
// Nó có trong danh sách bạn đã check được.
const MODEL_NAME = "gemini-flash-latest"; 
// ==========================================

// 1. Hàm tạo Vector Embedding
const generateEmbedding = async (text) => {
  try {
    if (!text) return [];
    // Model embedding chuẩn
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" }); 
    const cleanText = text.substring(0, 1000);
    const result = await model.embedContent(cleanText);
    return result.embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error.message);
    return []; 
  }
};

// 2. Hàm Chatbot
const generateChatResponse = async (history, context) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(context);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    return "Xin lỗi, AI đang bận. Vui lòng thử lại sau.";
  }
};

// 3. Hàm phân tích tìm kiếm sách (AI Search)
const analyzeBookSearch = async (query, booksData) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
      Bạn là chuyên gia sách. Người dùng tìm: "${query}".
      Dưới đây là dữ liệu sách (JSON): 
      ${JSON.stringify(booksData)}
      
      Nhiệm vụ: Chọn ra tối đa 5 cuốn sách phù hợp nhất.
      
      YÊU CẦU BẮT BUỘC:
      - CHỈ TRẢ VỀ MỘT MẢNG JSON chứa các ID. 
      - KHÔNG được viết thêm bất kỳ lời dẫn nào.
      - Ví dụ output chuẩn: ["65b123...", "65c456..."]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean JSON string
    const jsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    return [];
  }
};

module.exports = { generateEmbedding, generateChatResponse, analyzeBookSearch };