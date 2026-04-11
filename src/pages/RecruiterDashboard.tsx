import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_APPLICANTS, MOCK_INTERNSHIPS } from '@/src/mockData';
import { motion } from 'framer-motion';
import { Plus, Users, User, FileText, Check, X, ShieldAlert, Calendar, Trash2, Edit3, Briefcase } from 'lucide-react';

export function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<'review' | 'post' | 'manage'>('review');
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [internships, setInternships] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [activeFeedbackApp, setActiveFeedbackApp] = useState<any>(null);
  const [activeFeedback, setActiveFeedback] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate('/auth?role=recruiter');
    }
  }, [navigate]);
  
  // Load data from localStorage
  useEffect(() => {
    const savedInt = localStorage.getItem('all_internships');
    if (savedInt) {
      setInternships(JSON.parse(savedInt));
    } else {
      setInternships(MOCK_INTERNSHIPS);
      localStorage.setItem('all_internships', JSON.stringify(MOCK_INTERNSHIPS));
    }

    const savedApp = localStorage.getItem('all_applicants');
    if (savedApp) {
      setApplicants(JSON.parse(savedApp));
    } else {
      setApplicants(MOCK_APPLICANTS);
      localStorage.setItem('all_applicants', JSON.stringify(MOCK_APPLICANTS));
    }
  }, []);

  // Custom Post Form State
  const [formData, setFormData] = useState({
    title: '',
    stipend: '',
    description: '',
    customTask: '',
    startDate: '',
    endDate: '',
    isPaid: 'yes' as 'yes' | 'no'
  });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedList;
      if (editingId) {
        // Update existing
        updatedList = internships.map(item => item.id === editingId ? {
          ...item,
          role: formData.title,
          stipend: formData.stipend,
          description: formData.description,
          task: formData.customTask || item.task,
          startDate: formData.startDate,
          endDate: formData.endDate
        } : item);
        alert("Internship updated successfully!");
      } else {
        // Create new
        const newInternship = {
          id: "int-" + Math.random().toString(36).substr(2, 4),
          role: formData.title,
          company: "Your Company", 
          stipend: formData.isPaid === 'yes' ? formData.stipend : 'Unpaid',
          description: formData.description,
          source: "Recruiter Posted",
          task: formData.customTask || "Complete the technical assessment assigned by the team.",
          startDate: formData.startDate,
          endDate: formData.endDate,
        };
        updatedList = [...internships, newInternship];
        alert(`Internship successfully posted!`);
      }

      setInternships(updatedList);
      localStorage.setItem('all_internships', JSON.stringify(updatedList));
      setFormData({ title: '', stipend: '', description: '', customTask: '', startDate: '', endDate: '', isPaid: 'yes' });
      setEditingId(null);
      setActiveTab('manage');
    } catch (err) {
      console.error("Posting failed", err);
      alert("Something went wrong. Please try again.");
    } finally {
      // Done
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.role,
      stipend: item.stipend,
      description: item.description,
      customTask: item.task,
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      isPaid: item.stipend.toLowerCase() === 'unpaid' ? 'no' : 'yes'
    });
    setEditingId(item.id);
    setActiveTab('post');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this internship post?")) {
      const updated = internships.filter(i => i.id !== id);
      setInternships(updated);
      localStorage.setItem('all_internships', JSON.stringify(updated));
    }
  };

  const handleStatusChange = async (id: string, status: 'accepted' | 'rejected') => {
    const updated = applicants.map(app => app.id === id ? { ...app, status } : app);
    setApplicants(updated);
    localStorage.setItem('all_applicants', JSON.stringify(updated));
    
    // Auto-generate feedback if rejected
    if (status === 'rejected') {
      const app = applicants.find(a => a.id === id);
      const internship = internships.find(i => i.id === app?.internshipId);
      
      if (app && internship) {
        setIsGeneratingFeedback(true);
        setActiveFeedbackApp(app);
        
        try {
          const res = await fetch('/api/ai/mentor-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              taskDescription: internship.task,
              studentSubmission: app.submissionContent
            })
          });
          const data = await res.json();
          setActiveFeedback(data);
        } catch (err) {
          console.error("Feedback generation failed:", err);
        } finally {
          setIsGeneratingFeedback(false);
        }
      }
    }
  };

  const handlePostFeedback = () => {
    if (activeFeedbackApp && activeFeedback) {
      const updated = applicants.map(app => 
        app.id === activeFeedbackApp.id 
          ? { ...app, mentorFeedback: activeFeedback } 
          : app
      );
      setApplicants(updated);
      localStorage.setItem('all_applicants', JSON.stringify(updated));
      alert(`Constructive feedback posted for ${activeFeedbackApp.name}!`);
      setActiveFeedbackApp(null);
      setActiveFeedback(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-slate-50">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Recruiter Portal</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your postings and review skills-based applicants.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
        <button 
          onClick={() => { setActiveTab('review'); setEditingId(null); }}
          className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'review' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Users className="w-5 h-5" /> Applicant Review
        </button>
        <button 
          onClick={() => { setActiveTab('manage'); setEditingId(null); }}
          className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'manage' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Briefcase className="w-5 h-5" /> My Listings
        </button>
        <button 
          onClick={() => { setActiveTab('post'); setEditingId(null); setFormData({ title: '', stipend: '', description: '', customTask: '', startDate: '', endDate: '', isPaid: 'yes' }); }}
          className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'post' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Plus className="w-5 h-5" /> {editingId ? 'Edit Internship' : 'Post Internship'}
        </button>
      </div>

      {activeTab === 'review' && (
        <div className="grid grid-cols-1 gap-6">
          {applicants.map(app => (
             <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
               <div className="flex-1 space-y-4">
                 <div>
                   <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                     {app.name} 
                     {app.status === 'accepted' && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Accepted</span>}
                     {app.status === 'rejected' && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Rejected</span>}
                   </h3>
                   <span className="text-sm font-medium text-slate-500">Applying for Role ID: {app.internshipId}</span>
                 </div>
                 
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                   <div className="mb-2"><span className="font-bold text-slate-700">Skills:</span> <span className="text-slate-600">{app.skills}</span></div>
                   <div><span className="font-bold text-slate-700">Projects:</span> <span className="text-slate-600">{app.projects}</span></div>
                 </div>
                 
                 <button className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700">
                   <FileText className="w-4 h-4" /> View Resume
                 </button>
               </div>

               <div className="flex flex-col items-center sm:items-end gap-3 w-full md:w-auto p-4 bg-slate-50 md:bg-transparent rounded-xl">
                 <div className="text-center md:text-right">
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Task Score</div>
                   <div className="text-4xl font-black text-slate-900">{app.taskScore}<span className="text-2xl text-slate-400">/10</span></div>
                 </div>
                 {app.status === 'pending' && (
                   <div className="flex w-full md:w-auto gap-3 mt-2">
                     <button onClick={() => handleStatusChange(app.id, 'accepted')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-100 text-green-800 font-bold rounded-xl hover:bg-green-200 transition-colors border border-green-200"><Check className="w-4 h-4" /> Accept</button>
                     <button onClick={() => handleStatusChange(app.id, 'rejected')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-100 text-red-800 font-bold rounded-xl hover:bg-red-200 transition-colors border border-red-200"><X className="w-4 h-4" /> Reject</button>
                   </div>
                 )}
               </div>
             </div>
          ))}
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Manage Your Published Roles</h2>
          {internships.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
               <div>
                 <h3 className="text-lg font-black text-slate-900 mb-1">{item.role}</h3>
                 <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                   <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.startDate || 'No Start Date'} to {item.endDate || 'No End Date'}</span>
                   <span className="text-primary-600">ID: {item.id}</span>
                 </div>
               </div>
               <div className="flex gap-2 items-center">
                 <button 
                  onClick={() => handleEdit(item)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  title="Edit Post"
                 >
                   <Edit3 className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                  title="Delete Post"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
               </div>
            </div>
          ))}
          {internships.length === 0 && <div className="text-slate-500 font-medium text-center p-8">You haven't posted any internships yet.</div>}
        </div>
      )}

      {activeTab === 'post' && (
        <form onSubmit={handlePost} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-indigo-50 text-indigo-800 p-4 rounded-2xl border border-indigo-100 mb-8 font-bold text-sm">
              <Plus className="w-5 h-5 shrink-0" />
              {editingId ? "You are now editing an existing internship post." : "Post an internship for students to browse and apply."}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Internship Title</label>
                <input 
                  required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Start Date</label>
                <input 
                  type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">End Date</label>
                <input 
                  type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900 transition-all shadow-inner"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Is this a paid internship?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isPaid: 'yes'})}
                    className={`flex-1 py-4 px-6 rounded-2xl font-bold border transition-all ${formData.isPaid === 'yes' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Yes, it's Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isPaid: 'no'})}
                    className={`flex-1 py-4 px-6 rounded-2xl font-bold border transition-all ${formData.isPaid === 'no' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    No, Unpaid
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Stipend Amount (e.g. ₹15,000/month)</label>
                <input 
                  required={formData.isPaid === 'yes'}
                  disabled={formData.isPaid === 'no'}
                  value={formData.isPaid === 'no' ? 'Unpaid' : formData.stipend} 
                  onChange={e => setFormData({...formData, stipend: e.target.value})}
                  className={`w-full px-5 py-4 border rounded-2xl outline-none font-bold transition-all shadow-inner ${formData.isPaid === 'no' ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed opacity-60' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-slate-900'}`}
                  placeholder={formData.isPaid === 'no' ? 'Not applicable' : "Enter amount (e.g. ₹15,000/month)"}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Job Description</label>
                <textarea 
                  required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900 transition-all shadow-inner"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Custom Screening Task</label>
                <textarea 
                  value={formData.customTask} onChange={e => setFormData({...formData, customTask: e.target.value})}
                  rows={2}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-slate-900 font-bold text-slate-900 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                className="flex-1 py-5 text-white bg-slate-900 hover:bg-slate-800 font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {editingId ? 'Save Changes' : 'Confirm & Post'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setActiveTab('manage'); }} className="px-8 py-5 bg-slate-100 text-slate-900 font-bold rounded-2xl border border-slate-200 uppercase tracking-widest">
                  Cancel
                </button>
              )}
            </div>
        </form>
      )}
      {/* AI Feedback Modal */}
      {(isGeneratingFeedback || activeFeedback) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100"
          >
            <div className="bg-slate-900 p-8 text-white relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">AI Career Mentor Feedback</h2>
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Constructive Review for {activeFeedbackApp?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveFeedbackApp(null); setActiveFeedback(null); }}
                className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {isGeneratingFeedback ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold animate-pulse">Analyzing task and submission...</p>
                </div>
              ) : activeFeedback && (
                <div className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-lg font-medium text-slate-700 leading-relaxed italic">"{activeFeedback.openingMessage}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                      <h4 className="text-xs font-black text-green-700 uppercase tracking-widest mb-3">Key Strength</h4>
                      <ul className="space-y-2">
                        {activeFeedback.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-sm font-bold text-green-800 flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                      <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Tech Lead Advice</h4>
                      <ul className="space-y-3">
                        {activeFeedback.actionableFeedback.map((f: string, i: number) => (
                          <li key={i} className="text-sm font-bold text-indigo-800 flex items-start gap-2 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-slate-500 font-medium">{activeFeedback.closingMessage}</p>
                    <button 
                      onClick={handlePostFeedback}
                      className="mt-8 w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <Plus className="w-5 h-5" /> Post Feedback to Student
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
