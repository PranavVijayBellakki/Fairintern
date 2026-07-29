import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, Building2, MapPin, Briefcase, AlertCircle, Calendar } from 'lucide-react';
import { useInternships, Internship as ContextInternship } from '../../context/InternshipContext';

interface Internship {
  company: string;
  role: string;
  description: string;
  location?: string;
  link?: string;
  stipend?: string;
  startDate?: string;
  endDate?: string;
  source?: 'RECRUITER POSTED' | 'AI FETCHED';
}

export function InternshipBot() {
  const location = useLocation();
  const isAuthenticated = !!sessionStorage.getItem('token');
  const { addInternships } = useInternships();
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
      } else {
        const reply = data.reply || "I've searched the web for you.";
        const botInternships = data.internships || [];
        
        if (botInternships.length > 0) {
          // Push to global context
          const formatted = botInternships.map((i: any) => {
            const role = i.role || i.title || 'Unknown Role';
            const company = i.company || i.organization || 'Unknown Company';
            return {
              ...i,
              role,
              company,
              id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              source: 'AI FETCHED',
              description: i.description || `Fetched from web: ${role} at ${company}`
            };
          });
          addInternships(formatted as ContextInternship[]);
          
          setMessages(prev => [...prev, { 
            type: 'bot', 
            content: `${reply}\n\n🚀 I've added ${botInternships.length} new opportunities to your Home dashboard!`,
            internships: botInternships.map(i => ({ ...i, source: 'AI FETCHED' })) 
          }]);
        } else {
          setMessages(prev => [...prev, { type: 'bot', content: reply }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // The chatbot is only displayed when the user is authenticated 
  // (i.e. on the dashboard/home screen where internships are displayed to logged-in users)
  if (!isAuthenticated && location.pathname === '/') {
    return null;
  }
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 glass-card bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[999] group overflow-hidden border border-white/10"
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
            className="fixed bottom-6 right-6 w-[400px] h-[600px] glass-card rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden z-[1000] border border-white/10"
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
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/3 custom-scrollbar"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.8rem] p-5 text-sm font-bold whitespace-pre-wrap ${
                    msg.type === 'user' 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30 ml-4' 
                      : 'bg-white/10 text-slate-200 shadow-sm border border-white/5 mr-4'
                  }`}>
                    {msg.content}
                    
                    {/* Structured Internship List */}
                    {msg.internships && (
                      <div className="mt-4 space-y-4">
                        {msg.internships.map((intern, i) => (
                          <div key={i} className="bg-white/5 rounded-[1.8rem] p-5 border border-white/10 group/card relative overflow-hidden">
                             <div className="absolute top-0 right-0 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-b border-l border-emerald-500/20">
                               AI FETCHED
                             </div>
                             <div className="flex items-center gap-2 mb-2">
                               <Building2 className="w-3.5 h-3.5 text-primary-400" />
                               <span className="font-black text-[9px] uppercase tracking-wider text-slate-400">{intern.company}</span>
                             </div>
                             <div className="mb-3">
                               <h4 className="font-black text-white text-sm leading-tight mb-1">{intern.role}</h4>
                               <div className="flex items-center gap-2">
                                 <span className="text-[10px] text-emerald-400 font-black">{intern.stipend || 'Unpaid'}</span>
                               </div>
                             </div>
                             {intern.startDate && (
                               <div className="flex items-center gap-1.5 text-[8px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 w-fit px-2 py-1 rounded-lg border border-primary-500/20 mb-3">
                                 <Calendar className="w-3 h-3" /> {intern.startDate} {intern.endDate ? `to ${intern.endDate}` : ''}
                               </div>
                             )}
                             <a 
                               href={intern.link} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="block w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black text-center rounded-xl transition-all uppercase tracking-widest border border-white/10"
                             >
                               View Original Listing
                             </a>
                          </div>
                        ))}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3 items-start mt-4 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                          <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-emerald-200/80 font-bold leading-relaxed italic">
                            ⚠️ INFO: These opportunities were discovered in real-time by AI. Please click "View Original" to verify details on the source website.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-[1.5rem] p-4 shadow-sm border border-white/5 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about AI internships..."
                  className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:border-white/20 font-bold text-white transition-all placeholder-white/20 glass-input"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-3 bg-primary-600 text-white rounded-[1.2rem] hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/40"
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
