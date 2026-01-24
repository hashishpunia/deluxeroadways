
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { Message, CompanyDetails } from '../types.ts';

interface GeminiAssistantProps {
  details: CompanyDetails;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ details }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Namaste! I am the ${details.name} Assistant. How can I help you with your logistics needs today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dynamicSystemInstruction = `
    You are the "${details.name} AI Assistant". 
    Core Knowledge:
    - Based in ${details.location}.
    - Established ${details.estd} as a Proprietor firm.
    - Proprietor: ${details.ceo}.
    - Company Full Address: ${details.address}.
    - Phone: ${details.phone}.
    - Email: ${details.email}.
    - Services: Mini Truck Logistics, Refrigerated Trucks, Heavy Truck Transportation, Garbage Truck Logistics, Tata Shaktee Service, and Box Truck Logistics.
    - Operations: We specialize in roadways/trucking across India.
    - Pickup: Primarily from ${details.location}/Haryana; Drop: Pan India.
    - Tone: Professional, authoritative, and helpful.
    - For all pricing/rate inquiries, direct the user to click the "Ask Price" button or fill out the inquiry form.
  `;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: dynamicSystemInstruction,
        }
      });

      const aiText = response.text || "I apologize, I'm having trouble connecting right now. Please call us at our office.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again later or contact us directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[200] ${isOpen ? 'inset-0 md:inset-auto' : ''}`}>
      {isOpen ? (
        <div className="bg-white w-full h-full md:w-[400px] md:h-[600px] md:shadow-2xl md:rounded-3xl flex flex-col overflow-hidden border-t md:border border-slate-200 animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-slate-950 p-4 md:p-5 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Bot className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant</h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-2 rounded-xl transition-colors active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-slate-950 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 md:p-6 border-t border-slate-100 bg-white pb-safe-area-bottom">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about rates, routes..."
                className="flex-1 text-sm md:text-base bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-slate-950 hover:bg-black text-white px-4 rounded-xl disabled:opacity-50 transition-colors active:scale-95"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">{details.name} AI</p>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-0">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-slate-950 hover:bg-black text-white p-4 md:p-5 rounded-full shadow-2xl group flex items-center gap-3 transition-all active:scale-90"
          >
            <MessageSquare size={24} />
            <span className="max-w-xs md:max-w-0 md:overflow-hidden md:group-hover:max-w-xs transition-all duration-300 font-bold text-sm md:text-base">Ask AI</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
