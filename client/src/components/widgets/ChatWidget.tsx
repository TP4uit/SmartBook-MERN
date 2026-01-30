import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#008080] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#FFC107]" />
              </div>
              <div className="font-bold text-sm">Trợ lý ảo SmartBook</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1" aria-label="Đóng chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-80 bg-gray-50 p-4 overflow-y-auto space-y-4">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-[#008080] flex-shrink-0 flex items-center justify-center">
                 <Sparkles className="h-4 w-4 text-[#FFC107]" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm border border-gray-100">
                Chào bạn, tôi là trợ lý AI của SmartBook. Tôi có thể giúp bạn tìm sách, gợi ý quà tặng hoặc giải đáp thắc mắc về đơn hàng. Bạn cần giúp gì không?
              </div>
            </div>
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
             <div className="relative">
                <Input 
                  className="pr-10 bg-gray-50 border-gray-200 focus-visible:ring-[#008080]" 
                  placeholder="Nhập tin nhắn..." 
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#008080] hover:bg-[#008080]/10 rounded p-1" aria-label="Gửi tin nhắn">
                  <Send className="h-4 w-4" />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${isOpen ? 'bg-gray-400 rotate-90' : 'bg-[#008080] hover:bg-[#006666]'}`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
