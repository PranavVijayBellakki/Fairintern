import React, { useRef, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, UserX, XCircle, Camera, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProctorOverlayProps {
  stream: MediaStream | null;
  strikeCount: number;
  lastViolation: string | null;
  isTerminated: boolean;
  showWarning: boolean;
  onExit: () => void;
}

export function ProctorOverlay({ stream, strikeCount, lastViolation, isTerminated, showWarning, onExit }: ProctorOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1001]">
      {/* 1. Camera Feed (Top Right) */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="relative w-48 h-36 bg-slate-900 rounded-2xl border-4 border-white/20 shadow-2xl overflow-hidden group">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">LIVE FEED</span>
          </div>
          <div className="absolute inset-0 border-2 border-primary-500/30 rounded-2xl pointer-events-none" />
        </div>
        <div className="mt-2 text-right">
          <div className="inline-flex items-center gap-1.5 bg-slate-900/10 backdrop-blur px-3 py-1 rounded-full border border-white/20 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             <ShieldAlert className="w-3 h-3 text-red-500" /> Active Proctoring
          </div>
        </div>
      </div>

      {/* 2. Warning Modal (Large Center) */}
      <AnimatePresence>
        {showWarning && !isTerminated && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center p-6 bg-red-950/40 backdrop-blur-sm pointer-events-auto"
          >
             <div className="glass-card max-w-lg w-full rounded-[3rem] p-12 border border-red-500/30 shadow-[0_0_100px_rgba(239,68,68,0.2)] text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10">
                   <AlertTriangle className="w-48 h-48 text-red-500 rotate-12" />
                </div>
                <div className="w-24 h-24 bg-red-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-lg border border-red-500/20">
                   <AlertTriangle className="w-12 h-12 text-red-400" />
                </div>
                <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase leading-none">VIOLATION DETECTED</h2>
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl font-black text-red-400 uppercase tracking-widest text-xs mb-10">
                   Issue Type: <span className="text-white">{lastViolation?.replace(/_/g, ' ') || 'SUSPICIOUS ACTIVITY'}</span>
                </div>
                
                <div className="flex justify-center gap-4 mb-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-5 h-16 rounded-full transition-all duration-700 ${strikeCount >= i ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-white/10'}`} />
                  ))}
                </div>

                <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-0 flex flex-col items-center gap-2">
                  Cumulative Strikes
                  <span className="text-white text-7xl block mt-2 font-black tracking-tighter">{strikeCount} <span className="text-2xl text-slate-600">/ 3</span></span>
                </p>
                <div className="mt-10 text-[10px] font-black text-red-400/60 tracking-[0.3em] uppercase animate-pulse">
                   Warning: Terminal Disqualification at Strike 3
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Termination Feed (Full Screen) */}
      <AnimatePresence>
        {isTerminated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950 pointer-events-auto p-6"
          >
             <div className="max-w-xl w-full text-center">
                <div className="w-32 h-32 bg-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-bounce">
                   <UserX className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-none">TEST TERMINATED</h1>
                <p className="text-red-400 text-xl font-bold mb-10 leading-relaxed uppercase tracking-widest">Strike Limit Reached: Final Security Protocol Enforced.</p>
                
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 text-left">
                   <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-4">Post-Analysis Incident Log</h3>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-red-300">
                         <span>Final Violation State</span>
                         <span className="bg-red-500/20 px-2 py-0.5 rounded">LOCKED</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-slate-300">
                         <span>Activity Logs</span>
                         <span className="text-slate-500 italic">Auto-submitted to examiner</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={onExit}
                  className="w-full py-5 bg-white text-slate-950 font-black rounded-3xl hover:bg-slate-100 transition-all shadow-xl uppercase tracking-widest"
                >
                   Exit Proctored Environment
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
