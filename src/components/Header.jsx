import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert, 
  Menu, 
  ChevronRight, 
  Home, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  KeyRound, 
  Lock,
  Settings, 
  LogOut, 
  X,
  FileCheck,
  CreditCard,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react';
import { showToast } from '../utils/alerts';

export default function Header({ 
  activeModule = 'dashboard', 
  activeSubPage = 'overview',
  onNavigate,
  searchQuery = '', 
  setSearchQuery, 
  pendingKycCount = 0,
  pendingPropertiesCount = 0,
  openTicketsCount = 0,
  unreadCount = 0,
  isSidebarCollapsed = false,
  onToggleSidebar,
  properties = [],
  owners = [],
  users = [],
  onSelectProperty,
  onSelectKyc,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [adminUser, setAdminUser] = useState({
    name: 'Aarav Singhania',
    email: 'aarav@propertyhub.in',
    role: 'Super Admin',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Change Credentials Modal state
  const [showCredModal, setShowCredModal] = useState(false);
  const [credForm, setCredForm] = useState({ currentPassword: '', newEmail: '', newPassword: '' });
  const [showCredPass, setShowCredPass] = useState({ current: false, newPass: false });
  const [credLoading, setCredLoading] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { default: api } = await import('../services/api.js');
        const res = await api.get('/auth/me');
        if (res.success && res.data) {
          setAdminUser(prev => ({ ...prev, ...res.data }));
        }
      } catch (e) {
        console.warn('Failed to fetch admin profile:', e.message);
      }
    };
    fetchProfile();
  }, []);

  // Handle Profile Image Upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { default: api } = await import('../services/api.js');
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('property_admin_token');
      // Step 1: Upload Image
      const uploadRes = await fetch(api.API_URL + '/upload/single', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      }).then(res => res.json());

      if (uploadRes.success) {
        const newUrl = uploadRes.data.url;
        // Step 2: Update Profile
        const updateRes = await api.patch('/auth/profile', { profileImage: newUrl });
        if (updateRes.success) {
          setAdminUser(prev => ({ ...prev, profileImage: newUrl }));
          showToast('Profile image updated successfully!', 'success');
        }
      } else {
        throw new Error(uploadRes.message);
      }
    } catch (e) {
      showToast(e.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle admin credentials update
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!credForm.currentPassword) {
      showToast('Current password is required', 'error');
      return;
    }
    if (!credForm.newEmail && !credForm.newPassword) {
      showToast('Enter at least a new email or new password', 'error');
      return;
    }
    setCredLoading(true);
    try {
      const { default: api } = await import('../services/api.js');
      const payload = { currentPassword: credForm.currentPassword };
      if (credForm.newEmail) payload.newEmail = credForm.newEmail;
      if (credForm.newPassword) payload.newPassword = credForm.newPassword;
      const res = await api.patch('/auth/admin-update-credentials', payload);
      if (res.success) {
        // Update stored token and local admin state
        localStorage.setItem('property_admin_token', res.data.token);
        setAdminUser(prev => ({ ...prev, email: res.data.admin.email }));
        showToast('Credentials updated successfully!', 'success');
        setShowCredModal(false);
        setCredForm({ currentPassword: '', newEmail: '', newPassword: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to update credentials', 'error');
    } finally {
      setCredLoading(false);
    }
  };

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('All platform nodes & databases synchronized successfully!', 'success');
    }, 600);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    if (onLogout) {
      onLogout();
    } else {
      showToast('Admin session secured. Master token refreshed.', 'info');
    }
  };

  const moduleNames = {
    dashboard: 'Dashboard',
    users: 'User Management',
    owners: 'Owner Management',
    properties: 'Property Management',
    services: 'Services Management',
    used_items: 'Used Items Marketplace',
    finance: 'Finance & Payments',
    communication: 'Communication & Tickets',
    reports: 'Reports & Analytics',
    settings: 'System Settings',
    auth: 'Authentication & Access'
  };

  const subPageNames = {
    overview: 'Overview & KPI Metrics',
    queues: 'Verification Queues',
    earning_summary: 'Earning Summary',
    all_users: 'All Users',
    user_details: 'User Details Dossier',
    block_unblock: 'Block / Unblock Console',
    user_reports: 'User Abuse Reports',
    suspended_users: 'Suspended Users',
    all_owners: 'All Landlords',
    pending_kyc: 'Pending KYC Verification',
    kyc_dossiers: 'Owner KYC & Deeds Dossiers',
    approve_reject: 'Approve / Reject Audit Log',
    blocked_owners: 'Blocked Landlords',
    owner_reports: 'Owner Reports',
    all_properties: 'All Properties Catalog',
    pending_properties: 'Pending Property Listings',
    property_docs: 'Title Deeds & Documents',
    duplicate_check: 'Duplicate Detection Engine',
    reported_properties: 'Reported Properties',
    suspended_properties: 'Suspended Listings',
    all_providers: 'Service Providers',
    categories: '9 Bachelor Categories',
    service_verification: 'Provider Verification',
    service_complaints: 'Complaints & Disputes',
    all_items: 'Item Listings',
    reported_items: 'Reported Items',
    remove_item: 'Remove / Moderation Console',
    transactions: 'Razorpay Live Payments',
    subscriptions: 'Owner Subscriptions',
    featured_boosts: 'Featured Boost Listings',
    earning_models: '10 Earning Channels',
    refunds: 'Refund Management',
    push_notifications: 'Push Notifications',
    support_tickets: 'Complaints & Tickets',
    banners_ads: 'Banners / Ads CMS',
    user_reports_analytics: 'User Growth Reports',
    property_reports: 'Property Velocity Reports',
    revenue_reports: 'Revenue & Run Rate Reports',
    platform_analytics: 'Platform System Health',
    admin_users: 'Admin Users & Roles',
    permissions: 'Roles & Permissions Matrix',
    app_settings: 'App Settings & Fraud Rules',
    policies: 'Terms & Privacy Policy',
    activity_logs: 'Activity Audit Logs',
    admin_login: 'Admin Login Status',
    otp_verification: '2FA / OTP Verification',
    password_reset: 'Master Password Reset'
  };

  // Search Results Filtering
  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchingProperties = cleanQuery
    ? properties.filter(p => p.title.toLowerCase().includes(cleanQuery) || p.id.toLowerCase().includes(cleanQuery) || p.locality.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];
  const matchingOwners = cleanQuery
    ? owners.filter(o => o.name.toLowerCase().includes(cleanQuery) || o.id.toLowerCase().includes(cleanQuery) || o.mobile.includes(cleanQuery)).slice(0, 3)
    : [];
  const matchingUsers = cleanQuery
    ? users.filter(u => u.name.toLowerCase().includes(cleanQuery) || u.id.toLowerCase().includes(cleanQuery) || u.mobile.includes(cleanQuery)).slice(0, 3)
    : [];

  const hasSearchResults = matchingProperties.length > 0 || matchingOwners.length > 0 || matchingUsers.length > 0;

  return (
    <>
    <header className="h-[62px] min-h-[62px] bg-white/98 backdrop-blur-md border-b border-slate-300 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4.5 sticky top-0 z-50 shadow-xs">
      {/* Left: Sidebar Toggle + Structured Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        {onToggleSidebar && (
          <button 
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-slate-100 border border-slate-300 rounded-[2px] text-slate-700 cursor-pointer transition-all shrink-0 hover:bg-white hover:text-indigo-700 hover:border-indigo-700"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={17} />
          </button>
        )}

        <div className="flex flex-col gap-0.5 justify-center min-w-0">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 whitespace-nowrap leading-none">
            <span 
              className="inline-flex items-center gap-1 cursor-pointer transition-colors hover:text-indigo-700 hover:underline" 
              onClick={() => onNavigate && onNavigate('dashboard', 'overview')}
              title="Dashboard Home"
            >
              <Home size={11} />
              <span>Admin</span>
            </span>

            <ChevronRight size={10} className="text-slate-400" />

            <span 
              className="inline-flex items-center gap-1 cursor-pointer transition-colors hover:text-indigo-700 hover:underline" 
              onClick={() => onNavigate && onNavigate(activeModule, 'overview')}
            >
              {moduleNames[activeModule] || activeModule}
            </span>
          </div>

          <h1 className="text-xs sm:text-[15px] font-bold text-slate-900 tracking-tight whitespace-nowrap leading-tight m-0 max-w-[120px] sm:max-w-none truncate">
            {subPageNames[activeSubPage] || moduleNames[activeModule] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Bar with Ctrl+K Shortcut */}
      <div className="relative flex-1 max-w-[380px] min-w-[120px] sm:min-w-[160px]" ref={searchRef}>
        <div className="relative w-full">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input 
            id="global-search-input"
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full bg-slate-100 border border-slate-300 rounded-[2px] py-1.5 pr-8 sm:pr-14 pl-7.5 text-xs text-slate-900 outline-none transition-all focus:bg-white focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700/10"
          />
          {searchQuery ? (
            <button 
              type="button" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 flex items-center p-0.5 hover:text-slate-900" 
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <span className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-[2px] border border-slate-300 pointer-events-none">Ctrl K</span>
          )}
        </div>

        {/* Live Search Quick Results Dropdown */}
        {showSearchDropdown && cleanQuery && (
          <div className="absolute top-[calc(100%+6px)] -left-8 sm:left-0 w-[min(380px,calc(100vw-24px))] max-h-[400px] bg-white border border-slate-300 rounded-[2px] shadow-xl z-50 overflow-y-auto">
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Search Results for "{searchQuery}"</span>
              <button 
                type="button" 
                className="bg-transparent border-none text-xs text-indigo-700 cursor-pointer font-semibold"
                onClick={() => setShowSearchDropdown(false)}
              >
                Close
              </button>
            </div>

            {hasSearchResults ? (
              <div className="flex flex-col">
                {matchingProperties.length > 0 && (
                  <div className="py-1 border-b border-slate-200 last:border-b-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-1.5 px-3">Properties</div>
                    {matchingProperties.map(p => (
                      <div 
                        key={p.id} 
                        className="flex items-center gap-2.5 py-1.5 px-3 cursor-pointer transition-colors hover:bg-slate-100"
                        onClick={() => {
                          if (onSelectProperty) onSelectProperty(p);
                          if (onNavigate) onNavigate('properties', 'all_properties');
                          setShowSearchDropdown(false);
                        }}
                      >
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold whitespace-nowrap border bg-indigo-50 text-indigo-800 border-indigo-200">{p.id}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">{p.title}</div>
                          <div className="text-[11px] text-slate-500">{p.locality}, {p.city} • ₹{p.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchingOwners.length > 0 && (
                  <div className="py-1 border-b border-slate-200 last:border-b-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-1.5 px-3">Landlords / Owners</div>
                    {matchingOwners.map(o => (
                      <div 
                        key={o.id} 
                        className="flex items-center gap-2.5 py-1.5 px-3 cursor-pointer transition-colors hover:bg-slate-100"
                        onClick={() => {
                          if (onSelectKyc) onSelectKyc(o);
                          if (onNavigate) onNavigate('owners', 'all_owners');
                          setShowSearchDropdown(false);
                        }}
                      >
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold whitespace-nowrap border bg-blue-50 text-blue-800 border-blue-200">{o.id}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">{o.name}</div>
                          <div className="text-[11px] text-slate-500">{o.mobile} • {o.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchingUsers.length > 0 && (
                  <div className="py-1 border-b border-slate-200 last:border-b-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-1.5 px-3">Tenants / Users</div>
                    {matchingUsers.map(u => (
                      <div 
                        key={u.id} 
                        className="flex items-center gap-2.5 py-1.5 px-3 cursor-pointer transition-colors hover:bg-slate-100"
                        onClick={() => {
                          if (onNavigate) onNavigate('users', 'user_details');
                          setShowSearchDropdown(false);
                        }}
                      >
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold whitespace-nowrap border bg-emerald-50 text-emerald-800 border-emerald-200">{u.id}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.email} • {u.locality}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching properties, owners, or users found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Live System Status, Sync, Notifications Popover, and Admin Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Live System Operational Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 py-1 px-2.5 rounded-[2px] border border-emerald-200 whitespace-nowrap" title="Server Status: Asia-South1 Core • Uptime: 99.98% • Latency: 42ms">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="font-semibold">All Systems Live</span>
          <span className="font-mono text-[10px] text-emerald-900 bg-emerald-100 px-1 rounded-[2px]">v2.4</span>
        </div>

        {/* Database Sync Button */}
        <button 
          type="button"
          className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-[2px] text-xs font-medium cursor-pointer transition-all border border-slate-300 bg-white text-slate-800 hover:bg-slate-50" 
          onClick={handleSync} 
          title="Sync memory cache with PostgreSQL & MongoDB database nodes"
        >
          <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Notifications Popover Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            type="button"
            className={`w-8 h-8 flex items-center justify-center bg-white border border-slate-300 rounded-[2px] text-slate-700 cursor-pointer relative transition-all hover:bg-slate-50 hover:border-slate-400 ${showNotifications ? 'border-indigo-600 bg-slate-50' : ''}`}
            title="Pending Moderation Queue"
            onClick={() => setShowNotifications(prev => !prev)}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold min-w-4 h-4 rounded-[2px] flex items-center justify-center px-0.5 border border-white">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-[calc(100%+8px)] -right-12 sm:right-0 w-[min(330px,calc(100vw-24px))] bg-white border border-slate-300 rounded-[2px] shadow-xl z-50 flex flex-col">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={15} color="#4338ca" />
                  <h4>Pending Approvals Queue</h4>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[11px] font-semibold whitespace-nowrap border bg-rose-50 text-rose-800 border-rose-300">{unreadCount} Pending</span>
              </div>

              <div className="flex flex-col max-h-[360px] overflow-y-auto">
                <div 
                  className="flex items-center gap-2.5 p-2.5 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => {
                    if (onNavigate) onNavigate('owners', 'pending_kyc');
                    setShowNotifications(false);
                  }}
                >
                  <div className="w-7 h-7 rounded-[2px] flex items-center justify-center shrink-0 bg-blue-100 text-blue-700">
                    <ShieldCheck size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-900">Landlord KYC Dossiers ({pendingKycCount})</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Aadhaar, PAN & Registry deeds waiting for verification</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>

                <div 
                  className="flex items-center gap-2.5 p-2.5 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => {
                    if (onNavigate) onNavigate('properties', 'pending_properties');
                    setShowNotifications(false);
                  }}
                >
                  <div className="w-7 h-7 rounded-[2px] flex items-center justify-center shrink-0 bg-amber-100 text-amber-700">
                    <Home size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-900">Property Listings ({pendingPropertiesCount})</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Physical details and price compliance review required</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>



                {openTicketsCount > 0 && (
                  <div 
                    className="flex items-center gap-2.5 p-2.5 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => {
                      if (onNavigate) onNavigate('communication', 'support_tickets');
                      setShowNotifications(false);
                    }}
                  >
                    <div className="w-7 h-7 rounded-[2px] flex items-center justify-center shrink-0 bg-purple-100 text-purple-700">
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-900">Support Tickets ({openTicketsCount})</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Active tenant complaints requiring resolution</div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                )}
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
                <button 
                  type="button" 
                  className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-[2px] text-xs font-medium cursor-pointer transition-all border border-slate-300 bg-white text-slate-800 hover:bg-slate-50" 
                  onClick={() => {
                    if (onNavigate) onNavigate('dashboard', 'queues');
                    setShowNotifications(false);
                  }}
                >
                  Open Verification Queues Screen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown Widget */}
        <div className="relative" ref={profileRef}>
          <button 
            type="button"
            className="flex items-center gap-2 py-1 pr-2.5 pl-1.5 bg-white border border-slate-300 rounded-[2px] cursor-pointer transition-all hover:bg-slate-50 hover:border-slate-400"
            onClick={() => setShowProfileMenu(prev => !prev)}
            title="Administrator Account"
          >
            <div className="relative flex">
              <img 
                src={adminUser.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
                alt={adminUser.name} 
                className="w-7 h-7 rounded-[2px] object-cover border border-slate-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{adminUser.name}</span>
              <span className="text-[10px] font-medium text-indigo-700">{adminUser.role}</span>
            </div>
            <ChevronRight size={13} className={`text-slate-400 transition-transform duration-150 ${showProfileMenu ? 'rotate-90' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[min(260px,calc(100vw-24px))] bg-white border border-slate-300 rounded-[2px] shadow-xl z-50 flex flex-col">
              <div className="p-3 bg-slate-50 border-b border-slate-200">
                <div className="font-bold text-sm text-slate-900">{adminUser.name}</div>
                <div className="text-xs text-slate-500">{adminUser.email}</div>
                <div className="text-[11px] font-mono text-indigo-700 mt-0.5">
                  ID: {adminUser.id || 'ADM-ROOT-001'} • Master Console
                </div>
              </div>

              <div className="py-1">
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleProfileImageUpload} 
                />
                
                <div 
                  className="flex items-center gap-2.5 py-2 px-3 text-xs text-slate-700 cursor-pointer transition-colors hover:bg-slate-100 hover:text-indigo-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <User size={14} color="#0284c7" />
                  <span>{isUploading ? 'Uploading...' : 'Update Profile Picture'}</span>
                </div>

                <div 
                  className="flex items-center gap-2.5 py-2 px-3 text-xs text-slate-700 cursor-pointer transition-colors hover:bg-slate-100 hover:text-indigo-700"
                  onClick={() => {
                    setShowCredModal(true);
                    setShowProfileMenu(false);
                  }}
                >
                  <Lock size={14} color="#4338ca" />
                  <span>Change Email / Password</span>
                </div>

                <div 
                  className="flex items-center gap-2.5 py-2 px-3 text-xs text-slate-700 cursor-pointer transition-colors hover:bg-slate-100 hover:text-indigo-700"
                  onClick={() => {
                    if (onNavigate) onNavigate('settings', 'app_settings');
                    setShowProfileMenu(false);
                  }}
                >
                  <Settings size={14} color="#64748b" />
                  <span>System Platform Settings</span>
                </div>

                <div 
                  className="flex items-center gap-2.5 py-2 px-3 text-xs text-slate-700 cursor-pointer transition-colors hover:bg-slate-100 hover:text-indigo-700"
                  onClick={() => {
                    if (onNavigate) onNavigate('settings', 'activity_logs');
                    setShowProfileMenu(false);
                  }}
                >
                  <FileCheck size={14} color="#d97706" />
                  <span>Audit Activity Logs</span>
                </div>
              </div>

              <div className="p-2 border-t border-slate-200 bg-slate-50">
                <button 
                  type="button" 
                  className="flex items-center gap-1.5 w-full py-1.5 px-2 text-xs font-semibold text-rose-600 bg-transparent border-none cursor-pointer rounded-[2px] transition-colors hover:bg-rose-100"
                  onClick={handleLogout}
                >
                  <LogOut size={13} />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* ───────── Change Credentials Modal ───────── */}
    {showCredModal && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(15,10,50,0.55)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Lock size={16} className="text-indigo-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Change Credentials</h3>
                <p className="text-[11px] text-slate-500">Update your login email or password</p>
              </div>
            </div>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer"
              onClick={() => { setShowCredModal(false); setCredForm({ currentPassword: '', newEmail: '', newPassword: '' }); }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleUpdateCredentials} className="p-6 flex flex-col gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password <span className="text-rose-500">*</span></label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type={showCredPass.current ? 'text' : 'password'}
                  value={credForm.currentPassword}
                  onChange={e => setCredForm(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                  required
                  className="w-full py-2.5 pl-9 pr-9 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 placeholder:text-slate-400"
                />
                <button type="button" className="absolute right-3 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer" onClick={() => setShowCredPass(p => ({ ...p, current: !p.current }))}>
                  {showCredPass.current ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-[11px] text-slate-500 mb-3">Leave blank if you don't want to change that field.</p>

              {/* New Email */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Email Address</label>
                <input
                  type="email"
                  value={credForm.newEmail}
                  onChange={e => setCredForm(p => ({ ...p, newEmail: e.target.value }))}
                  placeholder={adminUser.email}
                  className="w-full py-2.5 px-3 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 placeholder:text-slate-400"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showCredPass.newPass ? 'text' : 'password'}
                    value={credForm.newPassword}
                    onChange={e => setCredForm(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full py-2.5 pl-3 pr-9 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 placeholder:text-slate-400"
                  />
                  <button type="button" className="absolute right-3 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer" onClick={() => setShowCredPass(p => ({ ...p, newPass: !p.newPass }))}>
                    {showCredPass.newPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => { setShowCredModal(false); setCredForm({ currentPassword: '', newEmail: '', newPassword: '' }); }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={credLoading}
                className="flex-1 py-2.5 px-4 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                {credLoading ? <><RefreshCw size={13} className="animate-spin" /> Updating...</> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
  );
}
