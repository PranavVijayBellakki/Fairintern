import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, Building2, MapPin, Briefcase, AlertCircle } from 'lucide-react';

interface Internship {
  company: string;
  role: string;
  description: string;
  location: string;
}

export function InternshipBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; content: string; internships?: Internship[] }[]>([
    { type: 'bot', content: "Hello! I am your AI Internship Discovery Agent. Ask me to find AI internships or for career advice!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { type: 'bot', content: data.error }]);
      } else if (data.reply) {
        setMessages(prev => [...prev, { type: 'bot', content: data.reply }]);
      } else if (data.internships) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: `I found ${data.internships.length} opportunities for you:`,
          internships: data.internships 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-all z-[999] group overflow-hidden"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Bot className="w-7 h-7" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden z-[1000] border border-slate-100"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest leading-none mb-1">Discovery Agent</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Search</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-sm font-medium whitespace-pre-wrap ${
                    msg.type === 'user' 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100'
                  }`}>
                    {msg.content}
                    
                    {/* Structured Internship List */}
                    {msg.internships && (
                      <div className="mt-4 space-y-3">
                        {msg.internships.map((intern, i) => (
                          <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                             <div className="flex items-center gap-2 mb-2">
                               <Building2 className="w-4 h-4 text-indigo-500" />
                               <span className="font-black text-xs uppercase tracking-tight text-slate-800">{intern.company}</span>
                             </div>
                             <div className="flex items-center gap-2 mb-3">
                               <Briefcase className="w-4 h-4 text-slate-400" />
                               <span className="font-bold text-slate-900">{intern.role}</span>
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed mb-3">{intern.description}</p>
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white w-fit px-2 py-1 rounded-lg border border-slate-100">
                               <MapPin className="w-3 h-3" /> {intern.location}
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about AI internships..."
                  className="w-full pl-5 pr-14 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900 transition-all placeholder-slate-400"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <Sparkles className="w-3 h-3 text-indigo-500" /> Powered by Discovery Agent
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
