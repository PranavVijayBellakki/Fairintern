import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, User, X, Sparkles, Building2, Calendar } from 'lucide-react';
import { MOCK_APPLICANTS } from '../mockData';

export function StudentDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('all_applicants');
    if (saved) {
      // Filter for current student's applications (mocked as 'Alex Johnson' for now)
      setSubmissions(JSON.parse(saved));
    } else {
      setSubmissions(MOCK_APPLICANTS);
      localStorage.setItem('all_applicants', JSON.stringify(MOCK_APPLICANTS));
    }
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      {/* Background glowing effects to match Home and Auth */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10"
      >
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Student Dashboard</h1>
        <p className="text-slate-400 mt-2 text-lg">Track your active applications and progress.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl overflow-hidden relative z-10"
      >
        <div className="px-6 py-5 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Your Applications</h2>
        </div>
        <div className="divide-y divide-white/5">
          {submissions.map(sub => (
            <div key={sub.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">{sub.role}</h3>
                <p className="text-sm text-slate-400 font-medium">
                  {sub.company} <span className="mx-2">•</span> Applied on {sub.date}
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    sub.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    sub.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    sub.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-white/10 text-slate-300 border border-white/20'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Task Score</p>
                  <span className={`text-xl font-black ${sub.taskScore !== null ? 'text-white' : 'text-slate-500'}`}>
                    {sub.taskScore !== null ? `${sub.taskScore}/10` : '-'}
                  </span>
                </div>
                {sub.mentorFeedback && (
                  <button 
                    onClick={() => setActiveFeedback(sub)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary-900/20"
                  >
                    <MessageSquare className="w-4 h-4" /> View Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {activeFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFeedback(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 relative z-10"
            >
              <div className="bg-slate-900 p-8 text-white relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">AI Career Mentor Feedback</h2>
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Review for Your Submission</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveFeedback(null)}
                  className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-lg font-medium text-slate-700 leading-relaxed italic">"{activeFeedback.mentorFeedback.openingMessage}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                      <h4 className="text-xs font-black text-green-700 uppercase tracking-widest mb-3">Your Strengths</h4>
                      <ul className="space-y-2">
                        {activeFeedback.mentorFeedback.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-sm font-bold text-green-800 flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                      <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Actionable Advice</h4>
                      <ul className="space-y-3">
                        {activeFeedback.mentorFeedback.actionableFeedback.map((f: string, i: number) => (
                          <li key={i} className="text-sm font-bold text-indigo-800 flex items-start gap-2 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-slate-500 font-medium">{activeFeedback.mentorFeedback.closingMessage}</p>
                    <button 
                      onClick={() => setActiveFeedback(null)}
                      className="mt-8 px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
