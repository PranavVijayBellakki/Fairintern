import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormInput } from '@/src/components/ui/FormInput';
import { GoogleAuthButton } from '@/src/components/ui/GoogleAuthButton';
import { createClient } from '@/src/utils/supabase/client';
import { Shield, Sparkles, User, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';

function Login3DBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-50 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#818cf8" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#34d399" />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={2} color="#94a3b8" />
        
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <Sphere args={[1.6, 64, 64]} position={[-3, 1, 0]}>
            <MeshDistortMaterial color="#4f46e5" attach="material" distort={0.5} speed={2} roughness={0.1} metalness={0.9} />
          </Sphere>
        </Float>
        
        <Float speed={2.5} rotationIntensity={3} floatIntensity={3.5}>
           <mesh position={[4, -1, -2]}>
             <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
             <meshStandardMaterial color="#14b8a6" roughness={0.1} metalness={0.8} emissive="#0d9488" emissiveIntensity={0.4} />
           </mesh>
        </Float>

        <Float speed={1.5} rotationIntensity={4} floatIntensity={2}>
           <mesh position={[-1, -3.5, -4]}>
             <icosahedronGeometry args={[1.5, 0]} />
             <meshStandardMaterial color="#f43f5e" roughness={0.2} metalness={0.5} wireframe />
           </mesh>
        </Float>
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
    </div>
  );
}

export function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student';
  const [authMode, setAuthMode] = useState<'student' | 'recruiter'>(initialMode);
  const [isLogin, setIsLogin] = useState(true);
  
  // Student states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  // Recruiter states
  const [recName, setRecName] = useState('');
  const [recCompany, setRecCompany] = useState('');
  const [recPhone, setRecPhone] = useState('');

  const navigate = useNavigate();

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        navigate(data.user.role === 'recruiter' ? '/recruiter' : '/');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/recruiter-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: recName, company: recCompany, phone: recPhone })
      });
      const data = await res.json();
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        navigate('/recruiter');
      } else {
        alert(data.error || 'Recruiter login failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${authMode}`,
          queryParams: {
            prompt: 'select_account' // This forces it to ask for the email/account
          }
        }
      });
      
      if (error) throw error;
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Google Auth failed');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        sessionStorage.setItem('token', event.data.token);
        const userRole = authMode === 'recruiter' ? 'recruiter' : 'student';
        sessionStorage.setItem('user', JSON.stringify({ email: 'google@user.com', role: userRole }));
        navigate(userRole === 'recruiter' ? '/recruiter' : '/');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, authMode]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <Login3DBackground />
      
      <div className="flex-1 flex items-center justify-start max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md shadow-2xl"
        >
          <div className="glass-card bg-white p-8 sm:p-10 rounded-3xl text-slate-900 shadow-xl border border-slate-200">
            
            {/* Top Toggle */}
            <div className="flex bg-slate-50 rounded-2xl p-1 mb-8 shadow-inner border border-slate-200">
              <button
                onClick={() => setAuthMode('student')}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${authMode === 'student' ? 'bg-primary-600 shadow-md text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <User className="w-4 h-4" /> Student
              </button>
              <button
                onClick={() => setAuthMode('recruiter')}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${authMode === 'recruiter' ? 'bg-indigo-600 shadow-md text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Briefcase className="w-4 h-4" /> Recruiter
              </button>
            </div>

            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 shadow-inner"
              >
                <Sparkles className="w-8 h-8 text-primary-500" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {authMode === 'recruiter' ? 'Company Portal' : (isLogin ? 'Welcome back' : 'Create Account')}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {authMode === 'recruiter' 
                  ? 'Access your recruiter dashboard' 
                  : (isLogin ? 'Sign in to access premium opportunities' : 'Join the revolution of fair internships')}
              </p>
            </div>

            {authMode === 'recruiter' ? (
              // Recruiter Login Form
              <form className="space-y-6" onSubmit={handleRecruiterSubmit}>
                <AnimatePresence mode="popLayout">
                  <motion.div layout className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Name / Email</label>
                      <input 
                        value={recName}
                        onChange={e => setRecName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 font-medium shadow-sm glass-input"
                        placeholder="E.g. Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Company Name</label>
                      <input 
                        type="text" 
                        required 
                        value={recCompany}
                        onChange={e => setRecCompany(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 font-medium shadow-sm glass-input"
                        placeholder="E.g. Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={recPhone}
                        onChange={e => setRecPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 font-medium shadow-sm glass-input"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase tracking-wider mt-4"
                >
                  Login as Recruiter
                </motion.button>
              </form>
            ) : (
              // Student Login / Signup Form
              <form className="space-y-6" onSubmit={handleStudentSubmit}>
                <AnimatePresence mode="popLayout">
                  <motion.div layout className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 font-medium shadow-sm glass-input"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Password</label>
                      <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 font-medium shadow-sm glass-input"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2"
                      >
                        <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Select Role</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`py-2 px-4 text-sm font-bold rounded-xl border transition-all ${role === 'student' ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                          >
                            Student
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('recruiter')}
                            className={`py-2 px-4 text-sm font-bold rounded-xl border transition-all ${role === 'recruiter' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                          >
                            Recruiter
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all uppercase tracking-wider"
                >
                  {isLogin ? 'Sign in to FairIntern' : 'Create Free Account'}
                </motion.button>
              </form>
            )}

            {/* Footer Auth Shared Components */}
            <>
              <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500 rounded-full text-xs uppercase tracking-widest font-bold">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={handleGoogleAuth}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 shadow-sm transition-all glass-button"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-slate-700 font-bold tracking-wide">Google</span>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    {isLogin ? "Don't have an account? Sign up today" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
