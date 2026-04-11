import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@/src/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'student';

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
        return;
      }

      if (data.session) {
        // Mock token for existing logic compat
        sessionStorage.setItem('token', data.session.access_token);
        sessionStorage.setItem('user', JSON.stringify({ 
          email: data.session.user.email, 
          role: roleFromUrl 
        }));
        
        // Redirect based on role
        navigate(roleFromUrl === 'recruiter' ? '/recruiter' : '/');
      } else {
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, roleFromUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Finalizing Authentication</h2>
        <p className="text-slate-500">Please wait while we secure your session...</p>
      </div>
    </div>
  );
}
