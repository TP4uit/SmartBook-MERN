const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Thiếu GOOGLE_API_KEY trong file .env");
}
// Đảm bảo bạn đã cài thư viện: npm install @google/generative-ai
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Lỗi tạo embedding:", error.message);
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

// QUAN TRỌNG: Phải dùng dấu ngoặc nhọn {}
module.exports = { getEmbedding };