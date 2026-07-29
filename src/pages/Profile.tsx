import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, GraduationCap, Edit2, Save, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLLEGES = [
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Technology (IIT) Madras",
  "Indian Institute of Technology (IIT) Kanpur",
  "Indian Institute of Technology (IIT) Kharagpur",
  "Birla Institute of Technology and Science (BITS) Pilani",
  "National Institute of Technology (NIT) Trichy",
  "International Institute of Information Technology (IIIT) Hyderabad",
  "Vellore Institute of Technology (VIT)",
  "SRM Institute of Science and Technology",
  "Delhi Technological University (DTU)",
  "National Institute of Technology (NIT) Surathkal",
  "Jadavpur University",
  "College of Engineering, Pune (COEP)",
  "Other"
];

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate('/auth?role=student');
    }
  }, [navigate]);
  
  // Load profile from sessionStorage or use defaults
  const [profile, setProfile] = useState(() => {
    const saved = sessionStorage.getItem('studentProfile');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      dob: '',
      aadhar: '',
      college: ''
    };
  });

  const [otherCollege, setOtherCollege] = useState('');

  useEffect(() => {
    if (profile.college && !COLLEGES.includes(profile.college)) {
      setOtherCollege(profile.college);
    }
  }, []);

  const handleSave = () => {
    const finalCollege = profile.college === 'Other' ? otherCollege : profile.college;
    const finalProfile = { ...profile, college: finalCollege };
    
    sessionStorage.setItem('studentProfile', JSON.stringify(finalProfile));
    setProfile(finalProfile);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="mb-12 relative z-10 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] shadow-sm mb-4">
          <BadgeCheck className="w-4 h-4 text-primary-400" />
          Verified Student Profile
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Your Profile</h1>
        <p className="text-slate-400 mt-3 text-lg font-medium">Manage your personal and academic details for fair internship matching.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <div className="glass-card p-8 md:p-10 text-white group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none">
            <User className="w-64 h-64 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <User className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Personal Data</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Identity Verification</p>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.button
                  key="save"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-900/20"
                >
                  <Save className="w-5 h-5" /> Save Changes
                </motion.button>
              ) : (
                <motion.button
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 glass-button"
                >
                  <Edit2 className="w-5 h-5" /> Edit Information
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              {isEditing ? (
                <input 
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="E.g. Rahul Sharma"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/20 outline-none text-white font-bold transition-all placeholder-white/20 shadow-inner glass-input"
                />
              ) : (
                <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-lg min-h-[60px] flex items-center">
                  {profile.name || <span className="text-slate-500 italic font-medium">Not provided</span>}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Date of Birth</label>
              {isEditing ? (
                <input 
                  name="dob"
                  type="date"
                  value={profile.dob}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/20 outline-none text-white font-bold transition-all shadow-inner glass-input"
                />
              ) : (
                <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-lg min-h-[60px] flex items-center">
                  {profile.dob || <span className="text-slate-500 italic font-medium">Not provided</span>}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Aadhar Number</label>
              {isEditing ? (
                <input 
                  name="aadhar"
                  value={profile.aadhar}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/20 outline-none text-white font-bold transition-all placeholder-white/20 shadow-inner glass-input"
                />
              ) : (
                <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-lg min-h-[60px] flex items-center tracking-widest">
                  {profile.aadhar ? profile.aadhar.replace(/.(?=.{4})/g, '•') : <span className="text-slate-500 italic font-medium tracking-normal">Not provided</span>}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">College / University</label>
              {isEditing ? (
                <div className="space-y-4">
                   <div className="relative">
                    <select
                      name="college"
                      value={COLLEGES.includes(profile.college) ? profile.college : (profile.college === '' ? '' : 'Other')}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/20 outline-none text-white font-bold transition-all appearance-none shadow-inner glass-input"
                    >
                      <option value="" className="bg-slate-900">Select your college</option>
                      {COLLEGES.map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <GraduationCap className="text-slate-400 w-5 h-5" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {(profile.college === 'Other' || (!COLLEGES.includes(profile.college) && profile.college !== '')) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <input 
                          type="text"
                          value={otherCollege}
                          onChange={(e) => setOtherCollege(e.target.value)}
                          placeholder="Please enter your college name"
                          className="w-full px-5 py-4 bg-white/5 border border-primary-500/50 rounded-2xl focus:border-primary-500 outline-none text-white font-bold shadow-lg shadow-primary-900/10 glass-input"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-lg min-h-[60px] flex items-center leading-tight">
                  {profile.college || <span className="text-slate-500 italic font-medium">Not provided</span>}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
