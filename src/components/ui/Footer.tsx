import React from 'react';

export function Footer() {
  return (
    <footer className="glass-card border-t border-white/10 py-12 mt-auto !rounded-none relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tight">FairIntern</span>
            <span className="text-sm text-slate-400 font-bold ml-2">© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">About</a>
            <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
