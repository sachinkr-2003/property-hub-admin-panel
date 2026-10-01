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

  // Handle Login submission
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both administrative email and password.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Move to 2FA OTP step as per poster architecture
      setAuthMode('otp');
      showToast('Master credentials verified! Enter the 2FA security code.', 'info');
    }, 500);
  };

  // Instant 1-Click Demo Login
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: 'Aarav Singhania',
        email: 'aarav@propertyhub.in',
        role: 'Super Administrator'
      });
    }, 400);
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
      onLogin({
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
    <div 
      className="min-h-screen w-full bg-[#0f0d2b] flex flex-col items-center justify-center p-6 relative overflow-x-clip"
      style={{
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(67, 56, 202, 0.25) 0px, transparent 50%)'
      }}
    >
      <div className="w-full max-w-[440px] bg-white border border-indigo-950 rounded-[2px] shadow-2xl overflow-hidden z-10">
        {/* Brand Banner Header */}
        <div className="bg-[#1e1b4b] text-white p-5 text-center border-b border-[#2e2a72] flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-600 border border-white/25 rounded-[2px] flex items-center justify-center text-white mb-2.5 shadow-md">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">AdminPanel</h2>
          <p className="text-[11px] text-indigo-200 font-medium mt-0.5">Complete Platform Control • Enterprise Console</p>
          <div className="mt-2.5 inline-block bg-white/10 border border-white/15 py-0.5 px-2.5 rounded-[2px] text-[10px] text-indigo-200">
            <span>Search & BachelorHub Ecosystem</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5.5 bg-white">
          {/* ================= MODE 1: LOGIN ================= */}
          {authMode === 'login' && (
            <form onSubmit={handleSubmitLogin} className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between mb-1 pb-2.5 border-b border-slate-200">
                <h3 className="text-[15px] font-bold text-slate-900">Super Admin Login</h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold whitespace-nowrap border bg-indigo-50 text-indigo-800 border-indigo-200">Port 443 (SSL)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative Email / User ID
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@propertyhub.in"
                    required
                    className="w-full py-2 pr-9 pl-8 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-[2px] outline-none transition-all focus:bg-white focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/10"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label className="block text-xs font-semibold text-slate-700 mb-0">
                    Master Security Password
                  </label>
                  <button 
                    type="button" 
                    className="bg-transparent border-none text-indigo-700 text-xs font-semibold cursor-pointer hover:underline"
                    onClick={() => {
                      setAuthMode('forgot');
                      setResetSent(false);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full py-2 pr-9 pl-8 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-[2px] outline-none transition-all focus:bg-white focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/10"
                  />
                  <button 
                    type="button" 
                    className="absolute right-2.5 bg-transparent border-none text-slate-400 cursor-pointer flex items-center p-0.5 hover:text-slate-900"
                    onClick={() => setShowPassword(prev => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', color: '#475569' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <span>Remember session for 30 days</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="submit" 
                  className="w-full justify-center py-2.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 rounded-[2px] cursor-pointer transition-all border border-indigo-800 bg-indigo-700 text-white hover:bg-indigo-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Verifying Master Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to 2FA Authentication</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* 1-Click Demo Login */}
                <button 
                  type="button" 
                  className="w-full justify-center py-2 px-3 text-xs inline-flex items-center gap-1.5 rounded-[2px] cursor-pointer transition-all bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
                  onClick={handleQuickDemoLogin}
                  disabled={isLoading}
                >
                  <Zap size={14} color="#d97706" />
                  <span>1-Click Instant Demo Login (Super Admin)</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 2: 2FA OTP VERIFICATION ================= */}
          {authMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between mb-1 pb-2.5 border-b border-slate-200">
                <h3 className="text-[15px] font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold whitespace-nowrap border bg-emerald-50 text-emerald-800 border-emerald-200">SMS Token Active</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-indigo-50 border border-indigo-200 rounded-[2px]">
                <Smartphone size={18} color="#4338ca" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>Passcode Sent via Firebase Cloud SMS</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Enter the 6-digit security code sent to <strong>+91 98390 •••••</strong>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-center mb-2.5">
                  Enter 6-Digit Verification Code (Demo: 749201)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {otp.map((digit, idx) => (
                    <input 
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text" 
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 text-center text-xl font-bold font-mono text-indigo-700 bg-slate-50 border border-slate-300 rounded-[2px] outline-none transition-all focus:bg-white focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/15"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
                <span>Didn't receive passcode?</span>
                <button 
                  type="button" 
                  className="bg-transparent border-none text-indigo-700 text-xs font-semibold cursor-pointer hover:underline"
                  onClick={() => {
                    setResendTimer(30);
                    showToast('New 6-digit OTP dispatched to master mobile!', 'info');
                  }}
                >
                  Resend OTP ({resendTimer}s)
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="submit" 
                  className="w-full justify-center py-2.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 rounded-[2px] cursor-pointer transition-all border border-indigo-800 bg-indigo-700 text-white hover:bg-indigo-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Validating Security Key...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Authorize & Enter AdminPanel</span>
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-medium cursor-pointer transition-all border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                  onClick={() => setAuthMode('login')}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Credentials Login</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 3: FORGOT PASSWORD ================= */}
          {authMode === 'forgot' && (
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between mb-1 pb-2.5 border-b border-slate-200">
                <h3 className="text-[15px] font-bold text-slate-900">Master Password Recovery</h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold whitespace-nowrap border bg-amber-50 text-amber-800 border-amber-200">Level 3 Security</span>
              </div>

              {!resetSent ? (
                <>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                    Enter your official administrative email address. A time-limited cryptographically signed recovery token will be sent.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Administrative Email</label>
                    <div className="relative flex items-center">
                      <Mail size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                      <input 
                        type="email" 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="aarav@propertyhub.in"
                        required
                        className="w-full py-2 pr-9 pl-8 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-[2px] outline-none transition-all focus:bg-white focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Employee / Admin ID</label>
                    <div className="relative flex items-center">
                      <KeyRound size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={resetAdminId}
                        onChange={(e) => setResetAdminId(e.target.value)}
                        placeholder="ADM-ROOT-001"
                        className="w-full py-2 pr-9 pl-8 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-[2px] outline-none transition-all focus:bg-white focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/10"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full justify-center py-2.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 rounded-[2px] cursor-pointer transition-all border border-indigo-800 bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    Send Recovery Token
                  </button>
                </>
              ) : (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '2px', textAlign: 'center' }}>
                  <CheckCircle2 size={28} color="#059669" style={{ margin: '0 auto 8px' }} />
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#065f46' }}>Recovery Dispatch Sent!</h4>
                  <p style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px' }}>
                    Instructions have been sent to <strong>{resetEmail}</strong>. Valid for 15 minutes.
                  </p>
                </div>
              )}

              <button 
                type="button" 
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-medium cursor-pointer transition-all border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 mt-1"
                onClick={() => setAuthMode('login')}
              >
                <ArrowLeft size={13} />
                <span>Return to Login Screen</span>
              </button>
            </form>
          )}
        </div>

        {/* Security Trust Badges Bar (Direct from Poster) */}
        <div className="py-2.5 px-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-around text-[10px] text-slate-500">
          <div className="flex flex-col items-center gap-0.5 text-center" title="Fraud Detection Active">
            <ShieldAlert size={14} className="text-sky-500" />
            <span>Fraud Check</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center" title="Document Verification Engine">
            <FileCheck size={14} className="text-sky-500" />
            <span>Docs Verify</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center" title="Duplicate Property Check">
            <Copy size={14} className="text-sky-500" />
            <span>Duplicate Engine</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center" title="256-Bit SSL Encrypted">
            <Lock size={14} className="text-sky-500" />
            <span>256-Bit SSL</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-400 text-center tracking-wide">
        Search & BachelorHub Admin Portal • Version 2.4.1 Production Node • IP Restricted Logging
      </div>
    </div>
  );
}
