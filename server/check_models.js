const https = require('https');
const dotenv = require('dotenv');

// Nạp biến môi trường
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Lỗi: Không tìm thấy GEMINI_API_KEY trong file .env");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`⏳ Đang kết nối đến Google API để lấy danh sách model...`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (json.error) {
        console.error("❌ API trả về lỗi:", JSON.stringify(json.error, null, 2));
      } else if (json.models) {
        console.log("\n✅ DANH SÁCH MODEL BẠN ĐƯỢC DÙNG:");
        console.log("------------------------------------------------");
        const chatModels = json.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        if (chatModels.length === 0) {
            console.log("⚠️ Tài khoản này không có model nào hỗ trợ Chat (generateContent).");
        }
        
        chatModels.forEach(model => {
          // Lấy tên rút gọn để dễ copy
          const shortName = model.name.replace('models/', '');
          console.log(`🔹 Tên chuẩn: ${shortName}`);
          console.log(`   (Mô tả: ${model.displayName})`);
        });
        console.log("------------------------------------------------");
        console.log("👉 Hãy chọn một trong các 'Tên chuẩn' ở trên để điền vào file server/utils/ai.js");
      } else {
        console.log("⚠️ Phản hồi lạ:", data);
      }
    } catch (error) {
      console.error("❌ Lỗi phân tích JSON:", error.message);
    }
  });

}).on('error', (err) => {
  console.error("❌ Lỗi kết nối mạng:", err.message);
});