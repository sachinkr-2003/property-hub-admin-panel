import React, { useState } from 'react';
import { Save, Bell, Globe, Percent, ShieldCheck } from 'lucide-react';
import { showToast } from '../utils/alerts';

export default function SettingsPage() {
  const [appName, setAppName] = useState('Property Hub');
  const [supportPhone, setSupportPhone] = useState('+91 91510 00123');
  const [supportEmail, setSupportEmail] = useState('support@propertyhub.in');
  const [commissionRate, setCommissionRate] = useState('10');
  const [requireKycForListings, setRequireKycForListings] = useState(true);
  const [bannerAlert, setBannerAlert] = useState('Diwali Special: 0% Brokerage on all Lucknow Gomti Nagar Direct Owner listings!');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    showToast('Platform settings updated & synced across nodes!', 'success');
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <form onSubmit={handleSave}>
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <div className="card-title-row">
            <div>
              <h3>Core Platform Configuration</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Global parameters affecting Property Hub mobile app and web endpoints
              </p>
            </div>
            {savedMessage && (
              <span className="status-pill pill-active">
                ✓ Saved successfully!
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Platform Public Brand Name
                </label>
                <input 
                  type="text" 
                  value={appName} 
                  onChange={(e) => setAppName(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Customer Support Helpline
                </label>
                <input 
                  type="text" 
                  value={supportPhone} 
                  onChange={(e) => setSupportPhone(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Support Email Address
                </label>
                <input 
                  type="email" 
                  value={supportEmail} 
                  onChange={(e) => setSupportEmail(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Service Partner Commission (%)
                </label>
                <input 
                  type="number" 
                  value={commissionRate} 
                  onChange={(e) => setCommissionRate(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                In-App Promotional Broadcast Banner
              </label>
              <textarea 
                rows={2}
                value={bannerAlert} 
                onChange={(e) => setBannerAlert(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#fff', fontSize: '0.88rem', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Enforce KYC Verification Before Publishing</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require mandatory Aadhaar/PAN approval before listings appear in public search</div>
              </div>
              <input 
                type="checkbox" 
                checked={requireKycForListings} 
                onChange={(e) => setRequireKycForListings(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="header-btn btn-primary" style={{ padding: '10px 20px' }}>
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
