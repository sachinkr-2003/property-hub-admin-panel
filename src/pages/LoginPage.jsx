import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { showToast } from '../utils/alerts';

import api from '../services/api';

export default function LoginPage({ onLogin }) {
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both administrative email and password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/admin-login', { email, password });
      setIsLoading(false);
      if (res.success) {
        localStorage.setItem('property_admin_token', res.data.token);
        onLogin(res.data.admin);
        showToast('Login successful!', 'success');
      }
    } catch (error) {
      setIsLoading(false);
      showToast(error.message || 'Login failed', 'error');
    }
  };

  // Instant 1-Click Demo Login
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/admin-login', { email: 'aarav@propertyhub.in', password: 'admin123' });
      setIsLoading(false);
      if (res.success) {
        localStorage.setItem('property_admin_token', res.data.token);
        onLogin(res.data.admin);
      }
    } catch (error) {
      setIsLoading(false);
      showToast(error.message || 'Demo Login failed', 'error');
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-600/5 -skew-y-6 transform origin-top-left"></div>
      
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-10 border border-slate-100">
        {/* Brand Banner Header */}
        <div className="p-8 text-center flex flex-col items-center pb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-600/30">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AdminPanel</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Search Ecosystem Dashboard</p>
        </div>

        {/* Card Body */}
        <div className="px-8 pb-8 bg-white">
          {/* ================= MODE 1: LOGIN ================= */}
          <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center group">
                  <Mail size={18} className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@propertyhub.in"
                    required
                    className="w-full py-2.5 pr-4 pl-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                </div>

                <div className="relative flex items-center group">
                  <Lock size={18} className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full py-2.5 pr-10 pl-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 placeholder:text-slate-400"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors"
                    onClick={() => setShowPassword(prev => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                  <span className="font-medium">Remember me</span>
                </label>
              </div>

              <div className="flex flex-col gap-3 mt-3">
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-2.5 px-4 text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* 1-Click Demo Login */}
                <button 
                  type="button" 
                  className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all items-center gap-2"
                  onClick={handleQuickDemoLogin}
                  disabled={isLoading}
                >
                  <Zap size={16} className="text-amber-500" />
                  <span>Demo Login</span>
                </button>
              </div>
            </form>
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-slate-400 font-medium tracking-wide">
        Search Platform • © {new Date().getFullYear()} All rights reserved
      </div>
    </div>
  );
}
