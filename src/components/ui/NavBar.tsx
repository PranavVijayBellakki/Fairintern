import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User } from 'lucide-react';

export function NavBar() {
  const navigate = useNavigate();
  // Mock auth state
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  // Unauthenticated Minimal Header
  if (!token) {
    return (
      <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/10 !rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">FairIntern</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link 
                to="/auth?role=student" 
                className="text-sm font-black text-white px-5 py-2 glass-button rounded-xl border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated Header
  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/10 !rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">FairIntern</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-white hover:text-white transition-colors tracking-wide">Internships</Link>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              {user?.name && (
                <span className="text-sm font-medium text-white glass-card py-1 px-3 rounded-full hidden md:block border-white/10">
                  {user.role === 'recruiter' ? 'Recruiter: ' : ''}<strong className="text-white">{user.name}</strong>
                </span>
              )}
              {user?.role !== 'recruiter' && (
                <Link 
                  to="/profile" 
                  className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 bg-white/10 p-0.5 rounded-full" /> Profile
                </Link>
              )}

              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
