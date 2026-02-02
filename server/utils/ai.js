/**
 * AI utilities - STABILITY MODE: Gemini/Vector disabled.
 * Mock exports so controllers don't break on import.
 * Re-enable by uncommenting the real implementation below.
 */

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv = require('dotenv');
// dotenv.config();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm tạo Vector Embedding - MOCK: trả về mảng rỗng ngay, không gọi Gemini
const generateEmbedding = async (text) => {
  // try {
  //   if (!text) return [];
  //   const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  //   const cleanText = text.substring(0, 1000);
  //   const result = await model.embedContent(cleanText);
  //   return result.embedding.values;
  // } catch (error) {
  //   console.error("Gemini Embedding Error:", error.message);
  //   throw error;
  // }
  return [];
};

// Hàm Chat - MOCK: trả về thông báo cố định, không gọi Gemini
const generateChatResponse = async (history, context) => {
  // try {
  //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  //   ...
  // } catch (error) { ... }
  return "Xin lỗi, tính năng trợ lý đang bảo trì. Vui lòng thử lại sau.";
};

module.exports = { generateEmbedding, generateChatResponse };
