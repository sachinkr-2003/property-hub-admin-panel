import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Lock, Smartphone, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';
import { showToast } from '../utils/alerts';

export default function AuthManagement({ activeSubPage = 'admin_login' }) {
  const [activeTab, setActiveTab] = useState('admin_login');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (activeSubPage === 'otp_verification') setActiveTab('otp_verification');
    else if (activeSubPage === 'password_reset') setActiveTab('password_reset');
    else setActiveTab('admin_login');
  }, [activeSubPage]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter both current and new password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }
    showToast('Admin password updated successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Subpage Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div className="classic-tabbar">
          <button 
            className={`tab-btn-pill ${activeTab === 'admin_login' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin_login')}
          >
            Admin Login Session Status
          </button>
          <button 
            className={`tab-btn-pill ${activeTab === 'otp_verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('otp_verification')}
          >
            2FA / OTP Security Configuration
          </button>
          <button 
            className={`tab-btn-pill ${activeTab === 'password_reset' ? 'active' : ''}`}
            onClick={() => setActiveTab('password_reset')}
          >
            Master Password & Credentials
          </button>
        </div>
      </div>

      {/* Subpage 1: Admin Login Session Status */}
      {activeTab === 'admin_login' && (
        <div className="classic-card">
          <div className="card-topbar">
            <div>
              <h3>Super Admin Master Authentication Session</h3>
              <p>Active security session tokens and multi-factor authentication controls</p>
            </div>
            <span className="badge-pill badge-green">✓ Secure JWT Active</span>
          </div>

          <div className="table-container" style={{ marginBottom: '16px', border: 'none' }}>
            <table className="data-table">
              <tbody>
                <tr>
                  <td style={{ width: '180px', fontWeight: 600, background: '#f8fafc' }}>Master Admin ID</td>
                  <td style={{ fontWeight: 600 }}>ADM-ROOT-001 (Aarav Singhania)</td>
                  <td style={{ width: '180px', fontWeight: 600, background: '#f8fafc' }}>Access Level</td>
                  <td><span className="badge-pill badge-purple">Super Administrator</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc' }}>Session Lifetime</td>
                  <td>8 Hours (Auto-Renew on Activity)</td>
                  <td style={{ fontWeight: 600, background: '#f8fafc' }}>Node Gateway IP</td>
                  <td>192.168.1.1 (Lucknow Hub Core Node)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, background: '#f8fafc' }}>JWT Algorithm</td>
                  <td>RS256 (2048-bit Private Key)</td>
                  <td style={{ fontWeight: 600, background: '#f8fafc' }}>2FA Verification</td>
                  <td><span className="badge-pill badge-green">✓ Active via Firebase SMS</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-classic" 
              style={{ color: '#dc2626' }}
              onClick={() => showToast('All active admin sessions invalidated and re-authenticated.', 'warning')}
            >
              Invalidate Other Sessions
            </button>
          </div>
        </div>
      )}

      {/* Subpage 2: 2FA / OTP Verification Setting */}
      {activeTab === 'otp_verification' && (
        <div className="classic-card">
          <div className="card-topbar">
            <div>
              <h3>Two-Factor Authentication (Firebase Cloud SMS)</h3>
              <p>Require OTP confirmation on registered master mobile when modifying critical records</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: 'var(--radius-square)', border: '1px solid var(--border-cell)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Smartphone size={24} color="#4338ca" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Two-Factor Mobile Authentication</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>6-digit OTP sent to +91 98390 XXXXX for financial payouts, admin role creation, and property deletions</div>
              </div>
            </div>

            <input 
              type="checkbox" 
              checked={twoFactorEnabled} 
              onChange={(e) => {
                setTwoFactorEnabled(e.target.checked);
                showToast(`2FA is now ${e.target.checked ? 'Enabled' : 'Disabled'}`, e.target.checked ? 'success' : 'warning');
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Security Notice: Disabling 2FA will require confirmation email sent to master account. Payout approvals over ₹ 10,000 will continue to require secondary confirmation.
          </div>
        </div>
      )}

      {/* Subpage 3: Password Reset Form */}
      {activeTab === 'password_reset' && (
        <div className="classic-card">
          <div className="card-topbar">
            <div>
              <h3>Reset Master Admin Password</h3>
              <p>Update master console administrative credentials</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Current Master Password *
              </label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-square)', padding: '7px 12px', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  New Master Password *
                </label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-square)', padding: '7px 12px', fontSize: '0.84rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  Confirm New Password *
                </label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-square)', padding: '7px 12px', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button type="submit" className="btn-classic btn-primary-purple">
                <Lock size={14} />
                <span>Update Master Password</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
