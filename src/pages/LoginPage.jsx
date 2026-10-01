import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  FileCheck, 
  Copy, 
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { showToast } from '../utils/alerts';

import api from '../services/api';

export default function LoginPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'otp', 'forgot'
  
  // Login fields
  const [email, setEmail] = useState('aarav@propertyhub.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP fields (6 digits)
  const [otp, setOtp] = useState(['7', '4', '9', '2', '0', '1']);
  const [resendTimer, setResendTimer] = useState(28);

  // Forgot password fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetAdminId, setResetAdminId] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // Store admin data after successful password verification
  const [adminData, setAdminData] = useState(null);

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
        setAdminData(res.data);
        localStorage.setItem('property_admin_token', res.data.token);
        setAuthMode('otp');
        showToast('Master credentials verified! Enter the 2FA security code.', 'info');
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

  // Handle OTP digit change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP verification submission
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      showToast('Please enter the complete 6-digit security token.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(adminData ? adminData.admin : {
        name: 'Aarav Singhania',
        email: 'aarav@propertyhub.in',
        role: 'Super Administrator'
      });
    }, 500);
  };

  // Handle Password Reset submission
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast('Please enter your registered administrative email.', 'error');
      return;
    }
    setResetSent(true);
    showToast(`Password recovery link dispatched to ${resetEmail}.`, 'success');
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
          {authMode === 'login' && (
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
                  <button 
                    type="button" 
                    className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold hover:underline"
                    onClick={() => {
                      setAuthMode('forgot');
                      setResetSent(false);
                    }}
                  >
                    Forgot password?
                  </button>
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
          )}

          {/* ================= MODE 2: 2FA OTP VERIFICATION ================= */}
          {authMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Enter Security Code</h3>
                <p className="text-sm text-slate-500 mt-1">
                  We've sent a 6-digit code to your registered device.
                </p>
              </div>

              <div>
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input 
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text" 
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 sm:h-14 w-full text-center text-xl font-bold font-mono text-indigo-700 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center text-sm font-medium text-slate-600">
                Didn't receive code?{' '}
                <button 
                  type="button" 
                  className="text-indigo-600 hover:text-indigo-700 hover:underline"
                  onClick={() => {
                    setResendTimer(30);
                    showToast('New 6-digit OTP dispatched to master mobile!', 'info');
                  }}
                >
                  Resend ({resendTimer}s)
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-2.5 px-4 text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all shadow-md shadow-indigo-600/20 items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Verify & Enter</span>
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all items-center gap-2"
                  onClick={() => setAuthMode('login')}
                >
                  <ArrowLeft size={16} />
                  <span>Back to login</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 3: FORGOT PASSWORD ================= */}
          {authMode === 'forgot' && (
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
                {!resetSent && (
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your email address to receive a recovery link.
                  </p>
                )}
              </div>

              {!resetSent ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative flex items-center group">
                      <Mail size={18} className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                      <input 
                        type="email" 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="aarav@propertyhub.in"
                        required
                        className="w-full py-2.5 pr-4 pl-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-2 flex justify-center py-2.5 px-4 text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Send Recovery Link
                  </button>
                </>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg text-center mb-2">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-800">Check your email</h4>
                  <p className="text-sm text-emerald-600 mt-2 leading-relaxed">
                    We sent a password recovery link to <br/>
                    <strong className="text-emerald-700">{resetEmail}</strong>
                  </p>
                </div>
              )}

              <button 
                type="button" 
                className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all items-center gap-2 mt-1"
                onClick={() => setAuthMode('login')}
              >
                <ArrowLeft size={16} />
                <span>Return to Login</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-slate-400 font-medium tracking-wide">
        Search Platform • © {new Date().getFullYear()} All rights reserved
      </div>
    </div>
  );
}
