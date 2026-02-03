const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Lấy model model-info để list
    // Lưu ý: SDK JS hiện tại không có hàm listModels trực tiếp dễ dùng ở level top,
    // ta test thử bằng cách gọi model cơ bản nhất
    console.log("🔑 Đang kiểm tra key:", process.env.GEMINI_API_KEY ? "OK" : "MISSING");
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Chào bạn, bạn có hoạt động không?");
    console.log("✅ Model 'gemini-pro' hoạt động tốt:", result.response.text());
    
    console.log("------------------------------------------------");
    
    const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultFlash = await modelFlash.generateContent("Test flash model");
    console.log("✅ Model 'gemini-1.5-flash' hoạt động tốt:", resultFlash.response.text());

  } catch (error) {
    console.error("❌ Lỗi Model:", error.message);
    if (error.message.includes("404")) {
      console.log("👉 Gợi ý: Model này chưa được hỗ trợ hoặc tên sai. Hãy dùng 'gemini-pro' thay thế.");
    }
  }
}

listModels();