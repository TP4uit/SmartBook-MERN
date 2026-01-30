import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import api from '../../services/api'; // Import api service vừa tạo

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // State quản lý tin nhắn & input
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Chào bạn, tôi là trợ lý AI của SmartBook. Tôi có thể giúp bạn tìm sách, gợi ý quà tặng hoặc giải đáp thắc mắc về đơn hàng. Bạn cần giúp gì không?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref để tự động cuộn xuống tin nhắn mới nhất
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // 1. Thêm tin nhắn của User vào UI ngay lập tức
    const userMsg: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage(''); // Clear input
    setIsLoading(true);

    try {
      // 2. Gọi API Backend (Endpoint đã có trong chatController.js)
      const response = await api.post('/chat', {
        message: userMsg.text,
        history: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })) // Gửi kèm lịch sử để AI nhớ ngữ cảnh
      });

      // 3. Thêm phản hồi của AI vào UI
      const botMsg: Message = {
        id: Date.now() + 1,
        text: response.data.reply, // Lấy text từ JSON trả về { reply: "..." }
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Lỗi chat:", error);
      // Thông báo lỗi nhẹ nhàng
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Expanded Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 flex flex-col max-h-[500px]">
          
          {/* Header */}
          <div className="bg-[#008080] p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[#FFC107]" />
              </div>
              <div>
                <div className="font-bold text-sm">Trợ lý ảo SmartBook</div>
                <div className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/> Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1.5 transition-colors" aria-label="Đóng chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4 min-h-[300px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar Bot */}
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-[#008080] flex-shrink-0 flex items-center justify-center shadow-sm">
                     <Sparkles className="h-4 w-4 text-[#FFC107]" />
                  </div>
                )}

                {/* Bong bóng chat */}
                <div className={`
                  p-3 rounded-2xl text-sm max-w-[80%] shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-[#008080] text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-[#008080] flex-shrink-0 flex items-center justify-center">
                     <Sparkles className="h-4 w-4 text-[#FFC107]" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center">
                    <Loader2 className="h-4 w-4 text-[#008080] animate-spin" />
                    <span className="text-xs text-gray-400 ml-2">AI đang trả lời...</span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
             <div className="relative flex items-center gap-2">
                <Input 
                  className="flex-1 pr-10 bg-gray-50 border-gray-200 focus-visible:ring-[#008080] focus-visible:ring-1" 
                  placeholder="Hỏi về sách, đơn hàng..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <Button 
                  size="icon"
                  className={`h-10 w-10 rounded-xl transition-all ${inputMessage.trim() ? 'bg-[#008080] hover:bg-[#006666]' : 'bg-gray-200 cursor-not-allowed'}`}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
             </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-400 rotate-90' : 'bg-[#008080] hover:bg-[#006666]'}`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}