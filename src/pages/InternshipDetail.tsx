import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_INTERNSHIPS } from '@/src/mockData';
import { Building2, IndianRupee, ArrowLeft, Lock, Upload, PlayCircle, User, Calendar, Briefcase, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Modal } from '@/src/components/ui/Modal';
import { useProctoring } from '@/src/hooks/useProctoring';
import { useLockdown } from '@/src/hooks/useLockdown';
import { useStrikeManager, ViolationType } from '@/src/hooks/useStrikeManager';
import { ProctorOverlay } from '@/src/components/proctoring/ProctorOverlay';

export function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [taskScore, setTaskScore] = useState<number | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSecureEnvOpen, setIsSecureEnvOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isTaskActive, setIsTaskActive] = useState(false);

  // Strict Proctoring Logic
  const { stream, isAudioPeak, startMedia, stopMedia, isLive } = useProctoring();
  const { state: strikes, addStrike, resetStrikes } = useStrikeManager(3);

  // Security lockdown integration
  useLockdown((type) => {
    if (isLive && !strikes.isTerminated) {
      addStrike(type as ViolationType);
    }
  });

  // Audio peak monitoring
  useEffect(() => {
    if (isAudioPeak && isLive && !strikes.isTerminated) {
      addStrike('AUDIO_VIOLATION');
    }
  }, [isAudioPeak, isLive, addStrike, strikes.isTerminated]);

  // Terminal Auto-Submit logic
  useEffect(() => {
    if (strikes.isTerminated && isLive) {
      console.warn("CRITICAL: Test Terminated due to violations.");
      // In production, trigger POST /api/proctor/submit here
    }
  }, [strikes.isTerminated, isLive]);


  // Apply Form
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('all_internships');
    let list = MOCK_INTERNSHIPS;
    if (saved) {
      list = JSON.parse(saved);
    }
    const item = list.find(i => i.id === id);
    if (item) setInternship(item);
  }, [id]);

  const startSecureSession = async () => {
    const hardwareReady = await startMedia();
    if (!hardwareReady) {
      alert("Hardware Error: Camera and Microphone are mandatory for this assessment.");
      return;
    }

    try {
      await document.documentElement.requestFullscreen();
      setIsRulesOpen(false);
      setIsTaskActive(true);
    } catch (e) {
      console.error("Fullscreen Request Failed", e);
      alert("Please allow Fullscreen mode to continue.");
    }
  };

  const endSecureSession = () => {
    stopMedia();
    resetStrikes();
    setIsTaskActive(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const submitTask = () => {
    setTaskScore(Math.floor(Math.random() * 3) + 8); 
    endSecureSession();
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUploaded) return alert("Please upload a resume first!");
    alert("Application successfully submitted with Task Score: " + taskScore + "/10");
    setIsApplyOpen(false);
    navigate('/');
  };

  if (!internship) return <div className="p-8 text-center text-slate-500 font-medium">Internship not found or loading...</div>;



  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white mb-8 transition-colors glass-button px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to internships
      </button>

      {/* Main Internship Description */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 border-b border-white/10 pb-10 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border border-white/10">
              {internship.source}
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">{internship.role}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300 font-bold">
              <span className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary-400" /> {internship.company}</span>
              <span className="flex items-center gap-2"><IndianRupee className="w-5 h-5 text-emerald-400" /> {internship.stipend}</span>
              {internship.startDate && (
                <span className="flex items-center gap-2 text-primary-300">
                  <Calendar className="w-5 h-5 text-primary-400" /> 
                  {internship.startDate} to {internship.endDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-4 relative z-10">
          <h3 className="text-xl font-bold text-white mb-4">About the Role</h3>
          <p className="text-slate-300 leading-relaxed font-medium text-lg">{internship.description}</p>
        </div>


      </div>

      {/* Action Area for Application Flow */}
      <div className="glass-card rounded-[2.5rem] p-10 md:p-12 border border-white/10 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none" />
        <h2 className="text-3xl font-black text-white mb-4 relative z-10">Apply for this Internship</h2>
        <p className="text-slate-400 font-bold mb-10 max-w-xl mx-auto leading-relaxed relative z-10">
          To ensure fairness, all candidates must complete a brief skill-assessment task before submitting a resume.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
          {taskScore === null ? (
            <button 
              onClick={() => setIsRulesOpen(true)}
              className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/10 glass-button uppercase tracking-widest text-sm shadow-xl"
            >
              <PlayCircle className="w-5 h-5 text-primary-400" /> Start Task
            </button>
          ) : (
            <div className="w-full sm:w-auto px-10 py-5 bg-emerald-500/10 text-emerald-400 font-black rounded-2xl border border-emerald-500/20 flex items-center justify-center gap-3 shadow-lg uppercase tracking-widest text-sm">
              <CheckCircle2 className="w-5 h-5" /> Task Completed (Score: {taskScore}/10)
            </div>
          )}

          <button 
            disabled={taskScore === null}
            onClick={() => setIsApplyOpen(true)}
            className={`w-full sm:w-auto px-10 py-5 font-black rounded-2xl transition-all uppercase tracking-widest text-sm ${taskScore === null ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-[0_10px_40px_rgba(20,184,166,0.3)]'}`}
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Rules & Regulations Modal */}
      <Modal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} title="Assessment Rules & Regulations">
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl text-amber-200 text-sm font-bold leading-relaxed mb-4">
            <div className="flex items-center gap-2 mb-1 text-amber-400 uppercase tracking-widest text-xs">
               <AlertTriangle className="w-4 h-4" /> Warning
            </div>
            Please read the following instructions carefully before starting the assessment.
          </div>
          <ul className="space-y-4 text-sm text-slate-300 font-bold">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              This is a proctored environment. Tab switching is strictly prohibited.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
              Copy and Paste functionality has been disabled to ensure academic integrity.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
              You have one attempt to complete this task. Closing the window will void your progress.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
              Ensure you have a stable internet connection before proceeding.
            </li>
          </ul>
          <div className="pt-6">
            <button 
              onClick={startSecureSession}
              className="w-full py-5 bg-primary-600 text-white font-black rounded-[1.5rem] hover:bg-primary-700 transition-all shadow-[0_20px_40px_rgba(20,184,166,0.3)] uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
            >
              <Lock className="w-5 h-5 focus:animate-pulse" /> Enable Proctoring & Start
            </button>
          </div>
        </div>
      </Modal>

      {/* 4. Task Environment (Strict Anti-Cheat) */}
      {isTaskActive && (
        <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col pointer-events-auto overflow-y-auto">
          <ProctorOverlay 
            stream={stream}
            strikeCount={strikes.count}
            lastViolation={strikes.lastViolation}
            isTerminated={strikes.isTerminated}
            showWarning={strikes.showWarning}
            onExit={endSecureSession}
          />

          {!strikes.isTerminated && (
            <>
              <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] text-center py-2 flex items-center justify-center gap-3 shadow-lg z-10">
                <ShieldAlert className="w-3.5 h-3.5" /> High-Stakes Environment: Recording Status Active
              </div>

              <div className="bg-slate-800 border-b border-white/5 p-5 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Briefcase className="text-white w-5 h-5" />
                  </div>
                  <h2 className="font-black text-white uppercase tracking-tight">Practical Assessment</h2>
                </div>
                <button 
                  onClick={endSecureSession} 
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl transition-all uppercase text-xs tracking-widest"
                >
                  Quit Session
                </button>
              </div>

              <div className="flex-1 p-8 md:p-12 max-w-4xl mx-auto w-full text-slate-100">
                <div className="mb-10">
                  <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase leading-none">{internship.role}</h2>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-transparent rounded-full" />
                </div>

                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 mb-10 shadow-2xl font-medium leading-relaxed">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Task Instructions</h3>
                  {internship.task}
                </div>
                
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Interactive Console</label>
                  <textarea 
                    className="w-full h-80 bg-slate-950/80 border border-white/10 rounded-[2rem] p-8 text-slate-300 font-mono text-lg focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                    placeholder="// Your code or answer here...
// Note: OS-level clipboard is monitored."
                  />
                </div>
                
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={submitTask}
                    className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all uppercase tracking-widest"
                  >
                    Submit for Review
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Final Apply Form */}
      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Complete Application">
        <form onSubmit={submitApplication} className="space-y-6 p-2">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Key Skills</label>
            <input 
              type="text" 
              required
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="React, Python, Figma..."
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-white/20 font-bold text-white glass-input transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Past Projects / Portfolio (Brief)</label>
            <textarea 
              required
              value={projects}
              onChange={e => setProjects(e.target.value)}
              placeholder="Describe tools built, Hackathons won, etc."
              rows={3}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-white/20 font-bold text-white glass-input transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Resume</label>
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${resumeUploaded ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:bg-white/5 bg-white/3'}`}
                 onClick={() => setResumeUploaded(true)}>
              {resumeUploaded ? (
                 <div className="text-emerald-400 font-black flex items-center justify-center gap-3 uppercase tracking-wider"><CheckCircle2 className="w-6 h-6"/> Resume Uploaded</div>
              ) : (
                 <div className="text-slate-500 font-bold flex flex-col items-center gap-3"><Upload className="w-8 h-8 opacity-50"/> <span className="uppercase tracking-[0.2em] text-[10px]">Click to upload PDF</span></div>
              )}
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-primary-600 text-white font-black rounded-3xl mt-6 hover:bg-primary-700 shadow-xl shadow-primary-900/30 uppercase tracking-widest transition-all">
            Submit Final Application
          </button>
        </form>
      </Modal>

    </div>
  );
}
