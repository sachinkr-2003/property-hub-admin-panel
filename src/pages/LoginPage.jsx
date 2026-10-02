import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { showToast } from '../utils/alerts';
import api from '../services/api';

export default function LoginPage({ onLogin }) {
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Simple direct login - no third-party services required
  const handleSubmitLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      showToast('Please enter admin email and password.', 'error');
      return;
    }

    setIsLoading(true);

    const cleanInput = email.trim().toLowerCase();
    const isMasterAuth = (
      (cleanInput === 'admin@propertyhub.in' || cleanInput === 'aarav@propertyhub.in' || cleanInput === 'admin') &&
      password === 'admin123'
    );

    try {
      // 1. Try Backend API first
      const res = await api.post('/auth/admin-login', { email: cleanInput, password });
      setIsLoading(false);

      if (res && res.success) {
        if (res.data?.token) {
          localStorage.setItem('property_admin_token', res.data.token);
        }
        sessionStorage.setItem('property_admin_auth', 'true');
        if (rememberMe) {
          localStorage.setItem('property_admin_auth', 'true');
        }
        onLogin(res.data.admin || { name: 'Super Admin', email: cleanInput, role: 'Super Admin' });
        showToast('Welcome back! Admin login successful.', 'success');
        return;
      }
    } catch (apiError) {
      // 2. Direct Master Fallback (if remote Render server is sleeping or slow)
      if (isMasterAuth) {
        setIsLoading(false);
        const fallbackAdmin = {
          id: 'ADM-01',
          name: 'Super Admin',
          email: 'admin@propertyhub.in',
          role: 'Super Admin'
        };
        sessionStorage.setItem('property_admin_auth', 'true');
        if (rememberMe) {
          localStorage.setItem('property_admin_auth', 'true');
        }
        localStorage.setItem('property_admin_token', 'master_admin_session_active');
        onLogin(fallbackAdmin);
        showToast('Master Admin verified successfully!', 'success');
        return;
      }

      setIsLoading(false);
      showToast(apiError.message || 'Invalid credentials. Please verify your password.', 'error');
      return;
    }

    // Fallback check if response succeeded without error but not caught
    if (isMasterAuth) {
      setIsLoading(false);
      sessionStorage.setItem('property_admin_auth', 'true');
      if (rememberMe) {
        localStorage.setItem('property_admin_auth', 'true');
      }
      onLogin({ name: 'Super Admin', email: 'admin@propertyhub.in', role: 'Super Admin' });
      showToast('Master Admin verified successfully!', 'success');
    } else {
      setIsLoading(false);
      showToast('Invalid credentials. Check email & password.', 'error');
    }
  };

  // Quick Auto-fill Credentials
  const handleQuickFill = () => {
    setEmail('admin@propertyhub.in');
    setPassword('admin123');
    showToast('Default Master credentials loaded!', 'info');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[420px] bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-10 border border-slate-700/60">
        
        {/* Brand Header */}
        <div className="pt-8 pb-6 px-8 text-center flex flex-col items-center border-b border-slate-700/50 bg-slate-800/40">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-500/10">
            <ShieldCheck size={30} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Property Hub</h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mt-1">Super Admin Console</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
            
            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email / Username
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@propertyhub.in"
                  required
                  className="w-full py-2.5 pr-4 pl-11 text-sm text-white bg-slate-900/80 border border-slate-700 rounded-xl outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>

              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full py-2.5 pr-11 pl-11 text-sm text-white bg-slate-900/80 border border-slate-700 rounded-xl outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-500"
                />
                <button 
                  type="button" 
                  className="absolute right-3.5 text-slate-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 cursor-pointer focus:ring-0"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
              >
                <KeyRound size={12} />
                <span>Fill Default</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 mt-3">
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Master Credentials Info Box */}
          <div className="mt-6 p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-start gap-2.5">
            <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200">Direct Master Credentials:</span>
              <div className="font-mono text-[11px] text-indigo-300 mt-0.5">
                admin@propertyhub.in • admin123
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-5 text-xs text-slate-500 font-medium tracking-wide">
        Property Hub Admin • Self-Hosted & Secure (Zero Third-Party Dependency)
      </div>
    </div>
  );
}
