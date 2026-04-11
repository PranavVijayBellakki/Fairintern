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
      <nav className="sticky top-0 z-50 w-full bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">FairIntern</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated Header
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">FairIntern</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors tracking-wide">Internships</Link>
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
              {user?.name && (
                <span className="text-sm font-medium text-slate-700 bg-slate-100 py-1 px-3 rounded-full border border-slate-200 hidden md:block">
                  {user.role === 'recruiter' ? 'Recruiter: ' : ''}<strong className="text-slate-900">{user.name}</strong>
                </span>
              )}
              {user?.role !== 'recruiter' && (
                <Link 
                  to="/profile" 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 bg-slate-100 p-0.5 rounded-full" /> Profile
                </Link>
              )}

              <button 
                onClick={handleLogout}
                className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors ml-2"
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
