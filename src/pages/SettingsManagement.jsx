import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  UserPlus, 
  Save, 
  Activity, 
  FileText, 
  Lock, 
  Users, 
  Key,
  CheckSquare,
  Square,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { initialActivityLogs } from '../data/mockData';
import { showToast } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';

export default function SettingsManagement({ activeSubPage = 'app_settings' }) {
  const [activeTab, setActiveTab] = useState('app_settings');
  const [logs, setLogs] = useState(initialActivityLogs);
  const [logSearch, setLogSearch] = useState('');

  // Core App Settings Form
  const [platformName, setPlatformName] = useState('BachelorHub & OwnerHub Platform');
  const [supportPhone, setSupportPhone] = useState('+91 91510 00123');
  const [fraudThreshold, setFraudThreshold] = useState('3');
  const [requireKyc, setRequireKyc] = useState(true);
  const [require2FA, setRequire2FA] = useState(true);
  const [autoVerifySms, setAutoVerifySms] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Admin Team
  const [adminTeam, setAdminTeam] = useState([
    { id: 'ADM-01', name: 'Aarav Singhania', role: 'Super Administrator', email: 'aarav@propertyhub.in', status: 'Active', lastActive: '5 mins ago' },
    { id: 'ADM-02', name: 'Priya Narang', role: 'KYC & Legal Verification Lead', email: 'priya.kyc@propertyhub.in', status: 'Active', lastActive: '2 hours ago' },
    { id: 'ADM-03', name: 'Vikram Joshi', role: 'Marketplace Moderator', email: 'vikram.mkt@propertyhub.in', status: 'Active', lastActive: 'Yesterday' },
    { id: 'ADM-04', name: 'Rohan Mehra', role: 'Finance & Gateway Officer', email: 'rohan.fin@propertyhub.in', status: 'Active', lastActive: '3 hours ago' },
  ]);

  // Interactive Roles & Permissions Matrix
  const initialMatrix = {
    super_admin: {
      title: 'Super Administrator',
      badge: 'All Modules',
      permissions: {
        approveKyc: true,
        deleteListings: true,
        banUsers: true,
        issueRefunds: true,
        exportSensitiveData: true,
        modifyPricing: true,
        manageApiKeys: true
      }
    },
    kyc_officer: {
      title: 'KYC & Legal Verification Lead',
      badge: 'Owner & Verification Scope',
      permissions: {
        approveKyc: true,
        deleteListings: false,
        banUsers: true,
        issueRefunds: false,
        exportSensitiveData: false,
        modifyPricing: false,
        manageApiKeys: false
      }
    },
    property_moderator: {
      title: 'Property & Content Moderator',
      badge: 'Listings & Marketplace',
      permissions: {
        approveKyc: false,
        deleteListings: true,
        banUsers: false,
        issueRefunds: false,
        exportSensitiveData: false,
        modifyPricing: false,
        manageApiKeys: false
      }
    },
    finance_officer: {
      title: 'Finance & Gateway Officer',
      badge: 'Monetization & Payouts',
      permissions: {
        approveKyc: false,
        deleteListings: false,
        banUsers: false,
        issueRefunds: true,
        exportSensitiveData: true,
        modifyPricing: true,
        manageApiKeys: false
      }
    }
  };

  const [rolesMatrix, setRolesMatrix] = useState(initialMatrix);

  useEffect(() => {
    if (activeSubPage === 'activity_logs') setActiveTab('activity_logs');
    else if (activeSubPage === 'admin_users') setActiveTab('admin_users');
    else if (activeSubPage === 'permissions') setActiveTab('permissions');
    else if (activeSubPage === 'policies') setActiveTab('policies');
    else setActiveTab('app_settings');
  }, [activeSubPage]);

  const handleTogglePermission = (roleKey, permKey) => {
    if (roleKey === 'super_admin' && permKey === 'manageApiKeys') {
      showToast('Super Admin must retain API Gateway administration rights.', 'warning');
      return;
    }
    setRolesMatrix(prev => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        permissions: {
          ...prev[roleKey].permissions,
          [permKey]: !prev[roleKey].permissions[permKey]
        }
      }
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Platform security rules & system configurations updated!', 'success');
  };

  const handleSavePermissions = () => {
    showToast('Interactive Role-Based Access Control (RBAC) matrix synchronized!', 'success');
  };

  const handleExportLogs = () => {
    const cols = [
      { label: 'Log ID', accessor: 'id' },
      { label: 'Action Performed', accessor: 'action' },
      { label: 'Admin User', accessor: 'admin' },
      { label: 'Target Entity', accessor: 'target' },
      { label: 'Timestamp', accessor: 'time' }
    ];
    exportToCsv('Admin_Audit_Activity_Logs', logs, cols);
    showToast(`Exported ${logs.length} activity audit logs to CSV.`, 'info');
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.admin.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.target.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.id.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'app_settings' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('app_settings')}
          >
            <Settings size={13} />
            <span>Platform Rules & Security</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'permissions' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('permissions')}
          >
            <Key size={13} />
            <span>Roles & Permissions Matrix</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'admin_users' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('admin_users')}
          >
            <Users size={13} />
            <span>Staff & Admin Team ({adminTeam.length})</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'activity_logs' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('activity_logs')}
          >
            <Activity size={13} />
            <span>Audit Activity Logs ({logs.length})</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'policies' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('policies')}
          >
            <FileText size={13} />
            <span>Policies & Terms</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: APP SETTINGS & SECURITY RULES ================= */}
      {activeTab === 'app_settings' && (
        <div className="max-w-2xl space-y-4">
          <div className="classic-card p-4">
            <div className="pb-3 mb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Core Platform Security & Moderation Rules</h3>
              <p className="text-xs text-slate-500">
                Control automatic abuse filters, verification thresholds, and login enforcement.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Platform Ecosystem Brand Name
                </label>
                <input 
                  type="text" 
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Support Escalation Helpline
                  </label>
                  <input 
                    type="text" 
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Auto-Suspend Report Threshold
                  </label>
                  <input 
                    type="number" 
                    value={fraudThreshold}
                    onChange={(e) => setFraudThreshold(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-[2px] cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Mandatory Owner KYC Before Search Indexing</span>
                    <span className="text-[11px] text-slate-500">Properties stay hidden until Aadhaar & Title deed is verified by moderator</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={requireKyc}
                    onChange={(e) => setRequireKyc(e.target.checked)}
                    className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-[2px] cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Enforce Two-Factor Authentication (2FA) for Admin Staff</span>
                    <span className="text-[11px] text-slate-500">Require Google Authenticator / SMS OTP on every admin portal login</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-[2px] cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Automated Mobile Phone OTP Verification</span>
                    <span className="text-[11px] text-slate-500">Fast2SMS gateway instant OTP for tenant inquiry authentication</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoVerifySms}
                    onChange={(e) => setAutoVerifySms(e.target.checked)}
                    className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-300 rounded-[2px] cursor-pointer hover:bg-amber-100 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">Emergency Maintenance Mode</span>
                    <span className="text-[11px] text-amber-700">Puts mobile apps in read-only mode during major database upgrades</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="rounded-[2px] border-amber-400 text-amber-700 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-1.5">
                  <Save size={13} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ROLES & PERMISSIONS MATRIX ================= */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interactive Role-Based Access Control (RBAC) Matrix</h3>
              <p className="text-xs text-slate-500">
                Click checkboxes to toggle granular operational permissions for each administrative tier.
              </p>
            </div>
            <button 
              type="button"
              onClick={handleSavePermissions}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <Save size={13} />
              <span>Save Permissions Matrix</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-64">Administrative Capability</th>
                    <th className="text-center">Super Admin</th>
                    <th className="text-center">KYC Lead</th>
                    <th className="text-center">Property Moderator</th>
                    <th className="text-center">Finance Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'approveKyc', label: 'Approve / Reject Owner KYC & Title Deeds', desc: 'Grants blue check verified badge to landlords' },
                    { key: 'deleteListings', label: 'Delete & Flag Spam Property Listings', desc: 'Removes duplicate or fraudulent listings from app' },
                    { key: 'banUsers', label: 'Suspend / Ban Abusive User Accounts', desc: 'Blocks phone numbers and emails permanently' },
                    { key: 'issueRefunds', label: 'Issue Transaction Refunds & Void Payments', desc: 'Reverses payments through Razorpay gateway' },
                    { key: 'exportSensitiveData', label: 'Export Sensitive PII (CSV Downloads)', desc: 'Allows dumping tenant Aadhaar and phone registers' },
                    { key: 'modifyPricing', label: 'Modify Pricing Channels & Monetization Tiers', desc: 'Edits listing rates and subscription plans' },
                    { key: 'manageApiKeys', label: 'Manage Production API Keys & Webhooks', desc: 'Access to AWS, Firebase, and payment credentials' }
                  ].map((perm) => (
                    <tr key={perm.key}>
                      <td>
                        <div className="font-bold text-xs text-slate-800">{perm.label}</div>
                        <div className="text-[11px] text-slate-400">{perm.desc}</div>
                      </td>

                      {/* Super Admin */}
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={rolesMatrix.super_admin.permissions[perm.key]}
                          onChange={() => handleTogglePermission('super_admin', perm.key)}
                          className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* KYC Lead */}
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={rolesMatrix.kyc_officer.permissions[perm.key]}
                          onChange={() => handleTogglePermission('kyc_officer', perm.key)}
                          className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Property Moderator */}
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={rolesMatrix.property_moderator.permissions[perm.key]}
                          onChange={() => handleTogglePermission('property_moderator', perm.key)}
                          className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Finance Officer */}
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={rolesMatrix.finance_officer.permissions[perm.key]}
                          onChange={() => handleTogglePermission('finance_officer', perm.key)}
                          className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ADMIN USERS ================= */}
      {activeTab === 'admin_users' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Authorized Administrative Personnel</h3>
              <p className="text-xs text-slate-500">
                Staff accounts with privileged access to the Property Hub administration portal.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => showToast('Invite staff modal initialized.', 'info')}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <UserPlus size={13} />
              <span>Invite New Staff Member</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Admin ID</th>
                    <th>Official Name</th>
                    <th>Assigned Role</th>
                    <th>Official Email</th>
                    <th>Last Active</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminTeam.map((adm) => (
                    <tr key={adm.id}>
                      <td className="font-mono font-bold text-xs text-slate-600">{adm.id}</td>
                      <td className="font-bold text-xs text-slate-800">{adm.name}</td>
                      <td>
                        <span className="badge-pill badge-purple">{adm.role}</span>
                      </td>
                      <td className="font-mono text-xs text-slate-600">{adm.email}</td>
                      <td className="text-xs text-slate-500">{adm.lastActive}</td>
                      <td>
                        <span className="badge-pill badge-green">✓ Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: AUDIT ACTIVITY LOGS ================= */}
      {activeTab === 'activity_logs' && (
        <div className="space-y-3">
          <div className="filter-toolbar flex items-center justify-between">
            <div className="search-input-wrap w-72">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search audit action, admin, target..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleExportLogs}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Audit Logs CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Administrative Action</th>
                    <th>Responsible Operator</th>
                    <th>Target Record / ID</th>
                    <th>Execution Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((l) => (
                    <tr key={l.id}>
                      <td className="font-mono font-bold text-xs text-slate-600">{l.id}</td>
                      <td className="font-semibold text-xs text-slate-900">{l.action}</td>
                      <td>
                        <span className="badge-pill badge-blue">{l.admin}</span>
                      </td>
                      <td className="font-mono text-xs text-slate-700">{l.target}</td>
                      <td className="font-mono text-xs text-slate-500">{l.time}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-xs text-slate-400">
                        No activity logs matching query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: TERMS & POLICIES ================= */}
      {activeTab === 'policies' && (
        <div className="max-w-2xl space-y-4">
          <div className="classic-card p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Platform Policies & Legal Terms</h3>
                <p className="text-xs text-slate-500">
                  Published legal covenants for BachelorHub & OwnerHub mobile applications.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => showToast('Terms of service published to API CDN.', 'success')}
                className="btn-primary text-xs"
              >
                Publish Live Updates
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Terms of Service Agreement (v2.4)
                </label>
                <textarea 
                  rows={4}
                  defaultValue="Property Hub / BachelorHub operates as a direct owner-to-tenant discovery platform. No brokerage fees are collected from genuine bachelors or direct owners. All property listings are subject to LDA/municipal registry check."
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Privacy & Data Protection Covenant (AES-256 Encrypted)
                </label>
                <textarea 
                  rows={3}
                  defaultValue="User personal contact information is masked until physical visit scheduling is verified. Aadhaar numbers are stored using AES-256 SHA encryption."
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
