const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm tạo Vector Embedding từ văn bản
const generateEmbedding = async (text) => {
  try {
    if (!text) return [];
    
    // Sử dụng model embedding của Google
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    // Xử lý text (cắt bớt nếu quá dài để tránh lỗi token limit)
    const cleanText = text.substring(0, 1000); 

    const result = await model.embedContent(cleanText);
    const embedding = result.embedding;
    
    return embedding.values; // Trả về mảng số vector
  } catch (error) {
    console.error("Gemini Embedding Error:", error.message);
    throw error; // Ném lỗi để Controller xử lý fallback
  }
};

// Hàm sinh câu trả lời Chat (Dùng cho Chatbot)
const generateChatResponse = async (history, context) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let systemInstruction = "Bạn là trợ lý ảo của nhà sách SmartBook. Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt.";
        if (context) {
            systemInstruction += `\nĐây là thông tin cuốn sách khách đang xem:\nTên: ${context.title}\nTác giả: ${context.author}\nGiá: ${context.price}\nMô tả: ${context.description}`;
        }

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 200,
            },
            systemInstruction: {
                role: "system",
                parts: [{ text: systemInstruction }]
            }
        });

        // Lấy tin nhắn cuối cùng của user từ history để gửi (hoặc logic riêng tuỳ cách bạn truyền)
        // Ở đây giả sử history đã chứa tin nhắn user, ta chỉ cần gọi sendMessage với text rỗng hoặc prompt trigger
        // Tuy nhiên, google-generative-ai yêu cầu history là các tin nhắn TRƯỚC ĐÓ. Tin nhắn mới nhất phải gửi qua sendMessage.
        
        // Cách fix đơn giản cho controller chat:
        // Controller truyền: history (cũ) + message (mới). 
        // Ở đây ta đơn giản hoá: Giả sử message mới nằm cuối history.
        const lastMsg = history[history.length - 1];
        const prevHistory = history.slice(0, -1);
        
        const chatSession = model.startChat({
             history: prevHistory,
             systemInstruction: { role: "system", parts: [{ text: systemInstruction }] }
        });

        const result = await chatSession.sendMessage(lastMsg.parts[0].text);
        return result.response.text();

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Xin lỗi, AI đang quá tải. Vui lòng thử lại sau.";
    }
};

module.exports = { generateEmbedding, generateChatResponse };