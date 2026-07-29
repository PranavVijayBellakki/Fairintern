import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Building2, 
  MapPin, 
  Calendar, 
  AlertCircle,
  Shield,
  Trash2,
  XCircle
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { useInternships } from '../context/InternshipContext';

const MOCK_INTERNSHIPS = [
  { id: '1', role: 'Frontend Developer Intern', company: 'Google', stipend: '$5,000/month', source: 'RECRUITER POSTED', startDate: '2024-06-01', endDate: '2024-08-31', description: 'Sample' },
  { id: '2', role: 'Social Media Marketing Intern', company: 'GrowthX', stipend: 'Unpaid', source: 'RECRUITER POSTED', startDate: '2024-05-15', endDate: '2024-07-15', description: 'Sample' },
  { id: '3', role: 'Graphic Design Intern', company: 'Local Agency', stipend: 'Not listed', source: 'RECRUITER POSTED', startDate: '2024-04-20', endDate: '2024-06-20', description: 'Sample' },
];

export function Home() {
  const { internships, refresh, clearInternships, deleteInternship } = useInternships();
  const [search, setSearch] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [intendedRole, setIntendedRole] = useState<'student' | 'recruiter'>('student');
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem('token');

  useEffect(() => {
    const saved = localStorage.getItem('all_internships');
    if (!saved) {
      localStorage.setItem('all_internships', JSON.stringify(MOCK_INTERNSHIPS));
      refresh();
    }
  }, []);

  const filteredInternships = internships.filter(i => 
    (i.role || '').toLowerCase().includes(search.toLowerCase()) || 
    (i.company || '').toLowerCase().includes(search.toLowerCase())
  );

  const displayInternships = isAuthenticated ? filteredInternships : filteredInternships.slice(0, 3);

  const handleActionClick = (role: 'student' | 'recruiter' = 'student') => {
    if (!isAuthenticated) {
      setIntendedRole(role);
      setIsAuthModalOpen(true);
    } else if (role === 'recruiter') {
      navigate('/recruiter');
    }
  };

  const handleCardClick = (id: string, source: string) => {
    if (!isAuthenticated) {
      setIntendedRole('student');
      setIsAuthModalOpen(true);
      return;
    }
    if (source === 'AI FETCHED') {
      const item = internships.find(i => i.id === id);
      if (item?.link) window.open(item.link, '_blank');
    } else {
      navigate(`/internships/${id}`);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {!isAuthenticated ? (
        /* --- Public Hero (Unauthenticated) --- */
        <section className="relative w-full overflow-hidden min-h-[75vh] md:min-h-[85vh] flex items-center justify-center">
          {/* Background Video (Mock or static image if not found) */}
          <div className="absolute inset-0 z-0 bg-slate-900">
            <video 
              src="/internship-video.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] md:text-xs font-black text-white mb-8 shadow-lg tracking-widest uppercase">
                <Shield className="w-4 h-4 text-emerald-400" />
                Internship Discovery Agent
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl uppercase">
                THE FUTURE OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">FAIR RECRUITMENT</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mb-12 leading-relaxed font-medium drop-shadow-md px-4">
                Find internships based on your skills, not your resume. Verified by assessment and real-time AI discovery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg justify-center px-4 mt-4">
                <button 
                  onClick={() => handleActionClick('student')}
                  className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white border-2 border-white/40 font-black rounded-full hover:bg-white/20 transition-all backdrop-blur-md text-sm uppercase tracking-widest scale-100 hover:scale-[1.05] active:scale-95 shadow-xl glass-button"
                >
                  Browse Internships
                </button>
                <button 
                  onClick={() => handleActionClick('recruiter')}
                  className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white border-2 border-white/40 font-black rounded-full hover:bg-white/20 transition-all backdrop-blur-md text-sm uppercase tracking-widest scale-100 hover:scale-[1.05] active:scale-95 shadow-xl glass-button"
                >
                  Post an Internship
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        /* --- Dashboard Hero (Authenticated) --- */
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-xs font-black text-primary-400 uppercase tracking-widest shadow-lg border border-primary-500/20">
              <Sparkles className="w-4 h-4" /> AI-Powered Discovery Active
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">CAREER HUB</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl font-medium">
              Explore tailored opportunities and monitor your application status.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-12">
              <input 
                type="text"
                placeholder="Search by role or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] focus:border-primary-500 outline-none text-white font-bold transition-all shadow-2xl glass-input pl-16 text-lg"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
            </div>
          </motion.div>
        </section>
      )}

      {/* Internship Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Active Opportunities</h2>
            <div className="h-1.5 w-20 bg-primary-600 rounded-full mt-2" />
          </div>
          <div className="flex items-center gap-4">
            {internships.length > 0 && (
              <button 
                onClick={clearInternships}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all glass-card"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
            {filteredInternships.some(i => i.source === 'AI FETCHED') && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                <AlertCircle className="w-4 h-4" />
                AI Discovery Engine Active
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayInternships.map((intern) => (
            <InternshipCard 
              key={intern.id} 
              {...intern} 
              onClick={() => handleCardClick(intern.id, intern.source)}
              onDelete={() => deleteInternship(intern.id)}
            />
          ))}
          {displayInternships.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 text-xl font-medium">No matching internships found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <Modal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Continue"
      >
        <div className="space-y-6">
          <p className="text-slate-300 font-medium text-center leading-relaxed">Please sign in as a {intendedRole} to access specialized features and exclusive opportunities.</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate(`/auth?role=${intendedRole}`)}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary-900/40 uppercase tracking-widest text-xs"
            >
              Sign In as {intendedRole}
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InternshipCard({ id, role, company, stipend, source, startDate, endDate, onClick, location, onDelete }: any) {
  const isAi = source.includes('AI FETCHED');

  return (
    <div 
      onClick={onClick}
      className={`glass-card p-8 cursor-pointer hover:-translate-y-2 transition-all duration-500 flex flex-col relative group overflow-hidden rounded-[2.5rem] border ${isAi ? 'border-primary-500/30' : 'border-white/10'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-700 opacity-0 group-hover:opacity-100 ${isAi ? 'from-primary-500/10 to-transparent' : 'from-white/5 to-transparent'}`} />
      
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onDelete();
           }}
           className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-xl border border-white/10 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
           title="Delete Internship"
         >
           <Trash2 className="w-4 h-4" />
         </button>
      </div>

      <div className={`absolute top-0 right-14 rounded-bl-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-b border-l transition-all duration-300 ${isAi ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/50 border-white/10'}`}>
        {source}
      </div>

      <div className="flex justify-between items-start mb-5 pt-2 relative z-10">
        <div className="pr-4 w-full">
          <h3 className={`text-xl font-black mb-1 leading-tight transition-colors duration-300 ${isAi ? 'text-primary-300' : 'text-white'} group-hover:text-primary-400`}>{role}</h3>
          <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest gap-2 flex-wrap mb-6">
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {company}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="text-emerald-400">{stipend || 'Unpaid'}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {location && (
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-red-500/60" /> {location}
              </div>
            )}
            {startDate && (
              <div className="flex items-center gap-1.5 text-[9px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-2.5 py-1.5 rounded-lg border border-primary-500/20">
                <Calendar className="w-3.5 h-3.5" /> {startDate} {endDate ? `to ${endDate}` : ''}
              </div>
            )}
          </div>
          
          {isAi && (
             <div className="mt-6 pt-4 border-t border-white/5 text-[9px] text-slate-500 italic font-black uppercase tracking-widest">
               AI DISCOVERY AGENT • VERIFY SOURCE
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
