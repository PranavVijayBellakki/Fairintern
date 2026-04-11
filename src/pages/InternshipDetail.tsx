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
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to internships
      </button>

      {/* Main Internship Description */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-slate-100 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              {internship.source}
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">{internship.role}</h1>
            <div className="flex flex-wrap items-center gap-5 text-slate-600 font-medium">
              <span className="flex items-center gap-1.5"><Building2 className="w-5 h-5 text-slate-400" /> {internship.company}</span>
              <span className="flex items-center gap-1.5"><IndianRupee className="w-5 h-5 text-slate-400" /> {internship.stipend}</span>
              {internship.startDate && (
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Calendar className="w-5 h-5 text-indigo-400" /> 
                  {internship.startDate} to {internship.endDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none mb-10">
          <h3 className="text-lg font-bold text-slate-900 mb-3">About the Role</h3>
          <p className="text-slate-600 leading-relaxed font-medium">{internship.description}</p>
        </div>


      </div>

      {/* Action Area for Application Flow */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Apply for this Internship</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-xl mx-auto">
          To ensure fairness, all candidates must complete a brief skill-assessment task before submitting a resume.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {taskScore === null ? (
            <button 
              onClick={() => setIsRulesOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" /> Start Task
            </button>
          ) : (
            <div className="w-full sm:w-auto px-8 py-3.5 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Task Completed (Score: {taskScore}/10)
            </div>
          )}

          <button 
            disabled={taskScore === null}
            onClick={() => setIsApplyOpen(true)}
            className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl transition-all ${taskScore === null ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-transparent' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'}`}
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Rules & Regulations Modal */}
      <Modal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} title="Assessment Rules & Regulations">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm font-medium">
            Please read the following instructions carefully before starting the assessment.
          </div>
          <ul className="space-y-3 text-sm text-slate-600 font-medium">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              This is a proctored environment. Tab switching is strictly prohibited.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              Copy and Paste functionality has been disabled to ensure academic integrity.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              You have one attempt to complete this task. Closing the window will void your progress.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              Ensure you have a stable internet connection before proceeding.
            </li>
          </ul>
          <div className="pt-4">
            <button 
              onClick={startSecureSession}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <Lock className="w-5 h-5" /> Enable Proctoring & Start
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
        <form onSubmit={submitApplication} className="space-y-5 p-2">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Key Skills</label>
            <input 
              type="text" 
              required
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="React, Python, Figma..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Past Projects / Portfolio (Brief)</label>
            <textarea 
              required
              value={projects}
              onChange={e => setProjects(e.target.value)}
              placeholder="Describe tools built, Hackathons won, etc."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Resume</label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${resumeUploaded ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}
                 onClick={() => setResumeUploaded(true)}>
              {resumeUploaded ? (
                 <div className="text-green-700 font-bold flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> Resume_Final.pdf Uploaded</div>
              ) : (
                 <div className="text-slate-500 font-semibold flex flex-col items-center gap-2"><Upload className="w-6 h-6"/> Click to simulate upload (.pdf)</div>
              )}
            </div>
          </div>
          <button type="submit" className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl mt-4 hover:bg-slate-800">
            Submit Application
          </button>
        </form>
      </Modal>

    </div>
  );
}
