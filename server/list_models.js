const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
// URL API chính chủ của Google để lấy danh sách model
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function getModels() {
  if (!API_KEY) {
    console.error("❌ LỖI: Chưa có GOOGLE_API_KEY trong file .env");
    return;
  }

  try {
    console.log("⏳ Đang kết nối tới Google để lấy danh sách Model...");
    const response = await fetch(URL);
    const data = await response.json();
    
    if (data.models) {
        console.log("\n✅ DANH SÁCH CÁC MODEL BẠN ĐƯỢC DÙNG:");
        console.log("---------------------------------------");
        
        // Lọc các model dùng để Chat (generateContent)
        const chatModels = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));
            
        console.log("🗣️  MODEL CHAT (Chọn 1 cái tên dưới đây):");
        chatModels.forEach(m => console.log(`   - "${m}"`));
        
        // Lọc các model dùng để Embedding (embedContent)
        const embedModels = data.models
            .filter(m => m.supportedGenerationMethods.includes("embedContent"))
            .map(m => m.name.replace("models/", ""));

        console.log("\n🔍 MODEL TÌM KIẾM (Chọn 1 cái tên dưới đây):");
        embedModels.forEach(m => console.log(`   - "${m}"`));
        console.log("---------------------------------------");

    } else {
        console.log("❌ Lỗi từ Google:", data);
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối:", error.message);
  }
}

getModels();