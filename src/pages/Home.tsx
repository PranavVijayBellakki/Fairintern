import React, { useState } from 'react';
import { MOCK_INTERNSHIPS } from '@/src/mockData';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Calendar } from 'lucide-react';
import { Modal } from '@/src/components/ui/Modal';

export function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem('token');
  const [internships, setInternships] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [intendedRole, setIntendedRole] = useState<'student' | 'recruiter'>('student');
  
  const [paidOnly, setPaidOnly] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('all_internships');
    if (saved) {
      setInternships(JSON.parse(saved));
    } else {
      setInternships(MOCK_INTERNSHIPS);
      localStorage.setItem('all_internships', JSON.stringify(MOCK_INTERNSHIPS));
    }
  }, []);
  
  const handleActionClick = (role: 'student' | 'recruiter' = 'student') => {
    if (!isAuthenticated) {
      setIntendedRole(role);
      setIsAuthModalOpen(true);
    }
  };



  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col items-center select-none">
        
        {/* Public Hero */}
        <section className="w-full max-w-5xl mx-auto px-4 py-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 mb-8 shadow-sm">
            <Shield className="w-4 h-4 text-primary-500" />
            INTERNSHIP DISCOVERY APP
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Find Internships.<br className="hidden md:block"/> Launch Your Career.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mb-10 leading-relaxed font-medium">
            Discover the latest internship opportunities specialized for tech and creative roles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap justify-center">
            <button 
              onClick={() => handleActionClick('student')}
              className="px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all shadow-lg"
            >
              Browse Internships
            </button>
            <button 
              onClick={() => handleActionClick('recruiter')}
              className="px-8 py-3.5 bg-white text-slate-900 border-2 border-slate-200 font-semibold rounded-full hover:bg-slate-50 transition-all"
            >
              Post an Internship
            </button>
          </div>
        </section>

        {/* Showcase exactly 3 */}
        <section className="w-full max-w-7xl mx-auto px-4 pb-24">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Sample Opportunities</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_INTERNSHIPS.slice(0, 3).map(internship => (
              <InternshipCard key={internship.id} {...internship} onClick={() => handleActionClick('student')} />
            ))}
          </div>
        </section>

        <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title="Sign In to Continue" className="max-w-sm text-center p-6">
          <p className="text-slate-600 mb-6">You must be signed in to view complete details, apply, or post roles.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/auth?role=${intendedRole}`)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
              Go to Login / Signup
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  // Authenticated State (Student/General Dashboard View)
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search roles, companies..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setPaidOnly(!paidOnly)}
              className={`px-5 py-2.5 border rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${paidOnly ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Stipend Only
            </button>

          </div>
        </div>

        {/* listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.filter(i => {
            const isUnpaid = i.stipend.toLowerCase().includes('unpaid') || i.stipend.toLowerCase().includes('not listed');
            if (paidOnly && isUnpaid) return false;
            return true;
          }).map(internship => (
            <InternshipCard 
              key={internship.id} 
              {...internship} 
              onClick={() => navigate(`/internships/${internship.id}`)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function InternshipCard(props: any) {
  const { role, company, stipend, source, startDate, endDate, onClick } = props;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
    >
      <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-2xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-l border-slate-200">
        {source}
      </div>

      <div className="flex justify-between items-start mb-5 pt-2">
        <div className="pr-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{role}</h3>
          <div className="flex items-center text-slate-500 text-sm font-medium gap-3">
            <span>{company}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-slate-700 font-semibold">{stipend}</span>
          </div>
          {startDate && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-fit">
              <Calendar className="w-3 h-3" /> {startDate} to {endDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
