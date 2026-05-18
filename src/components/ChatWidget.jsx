import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getBotResponse } from '@/lib/chatKnowledgeBase';
import { Link } from 'react-router-dom';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋 I'm the BDO Assistant. How can I help you with your analytics journey today?", sender: 'bot', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsgText = inputValue.trim();
    const userMessage = { 
      id: Date.now(), 
      text: userMsgText, 
      sender: 'user',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMsgText);

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: botResponse, 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {(!isOpen || isMinimized) && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button 
              onClick={() => { setIsOpen(true); setIsMinimized(false); }}
              className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl flex items-center justify-center transition-transform hover:scale-110 border-2 border-white relative group"
            >
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
              <MessageSquare className="w-7 h-7 text-white group-hover:text-blue-100 transition-colors" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col h-[550px] max-h-[80vh]"
          >
            <div className="bg-white p-4 flex justify-between items-center text-slate-900 border-b border-slate-100 shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none mb-1">BDO Assistant</h3>
                  <p className="text-[10px] text-slate-500 leading-none">Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Minimize chat">
                  <Minus className="w-4 h-4 text-slate-600" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Close chat">
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative scroll-smooth">
              <div className="space-y-4">
                <div className="text-center text-xs text-slate-400 my-4 border-b border-slate-200 pb-4">
                  Chat session started
                </div>
                
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "p-3 text-sm leading-relaxed shadow-sm",
                        msg.sender === 'user' 
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                          : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm"
                      )}
                    >
                      {msg.text}
                      {msg.sender === 'bot' && msg.text.includes("consultation") && (
                        <div className="mt-3">
                          <Link to="/contact" className="inline-block bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg text-xs hover:bg-blue-100 transition-colors border border-blue-200">
                            Schedule Consultation
                          </Link>
                        </div>
                      )}
                      {msg.sender === 'bot' && msg.text.includes("demo") && !msg.text.includes("consultation") && (
                        <div className="mt-3">
                          <Link to="/book-demo" className="inline-block bg-emerald-50 text-emerald-600 font-medium px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-100 transition-colors border border-emerald-200">
                            Book a Demo
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col mr-auto max-w-[85%] items-start"
                  >
                    <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5 h-[42px]">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about OMIS..."
                className="flex-1 bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-slate-800"
              />
              <Button 
                type="submit" 
                size="icon" 
                className={cn(
                  "w-12 h-12 shrink-0 rounded-xl transition-all shadow-sm",
                  inputValue.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 text-slate-400"
                )}
                disabled={!inputValue.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;