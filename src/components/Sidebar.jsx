import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Home, 
  Wrench, 
  Package, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  FileCheck, 
  Copy, 
  Lock,
  ChevronRight,
  ChevronDown,
  KeyRound,
  LogOut,
  X,
  CalendarCheck,
  Users2
} from 'lucide-react';

export default function Sidebar({ 
  activeModule, 
  activeSubPage, 
  onNavigate,
  expandedModules, 
  onToggleExpand,
  pendingKycCount = 0, 
  pendingPropertiesCount = 0,
  openTicketsCount = 0,
  isCollapsed = false,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
  adminUser
}) {
  // Modules & Sub-pages mapped directly from the purple AdminPanel poster
  const menuConfig = [
    {
      id: 'dashboard',
      label: 'Dashboard (1)',
      icon: LayoutDashboard,
      subPages: [
        { id: 'overview', label: 'Overview & KPI Metrics' },
        { id: 'queues', label: 'Verification Queues' },
        { id: 'earning_summary', label: 'Earning Summary' }
      ]
    },
    {
      id: 'users',
      label: 'User Management (6)',
      icon: Users,
      countBadge: '8.4k',
      subPages: [
        { id: 'all_users', label: 'All Users' },
        { id: 'user_details', label: 'User Details Dossier' },
        { id: 'block_unblock', label: 'Block / Unblock' },
        { id: 'user_reports', label: 'User Abuse Reports' },
        { id: 'suspended_users', label: 'Suspended Users' }
      ]
    },
    // [TEMPORARILY COMMENTED OUT - CAN BE RE-ENABLED LATER]
    /*
    {
      id: 'roommates',
      label: 'Roommate Finder (3)',
      icon: Users2,
      subPages: [
        { id: 'all_roommates', label: 'All Co-Living Requests' },
        { id: 'male_roommates', label: 'Male Flatmates' },
        { id: 'female_roommates', label: 'Female Flatmates' }
      ]
    },
    */
    {
      id: 'owners',
      label: 'Owner Management (6)',
      icon: UserCheck,
      alertBadge: pendingKycCount > 0 ? `${pendingKycCount} KYC` : null,
      subPages: [
        { id: 'all_owners', label: 'All Owners' },
        { id: 'pending_kyc', label: `Pending Verification (${pendingKycCount})` },
        { id: 'kyc_dossiers', label: 'Owner KYC & Deeds' },
        { id: 'approve_reject', label: 'Approve / Reject Log' },
        { id: 'blocked_owners', label: 'Blocked Landlords' },
        { id: 'owner_reports', label: 'Owner Reports' }
      ]
    },
    {
      id: 'properties',
      label: 'Property Management (12)',
      icon: Home,
      alertBadge: pendingPropertiesCount > 0 ? `${pendingPropertiesCount} Review` : null,
      subPages: [
        { id: 'all_properties', label: 'All Properties' },
        { id: 'pending_properties', label: `Pending Properties (${pendingPropertiesCount})` },
        { id: 'property_docs', label: 'Title Deeds & Documents' },
        { id: 'duplicate_check', label: 'Duplicate Detection Engine' },
        { id: 'reported_properties', label: 'Reported Properties' },
        { id: 'suspended_properties', label: 'Suspended / Expired' }
      ]
    },
    {
      id: 'visits',
      label: 'Site Visits & Leads (3)',
      icon: CalendarCheck,
      subPages: [
        { id: 'all_visits', label: 'All Scheduled Visits' },
        { id: 'confirmed_visits', label: 'Confirmed Slots' },
        { id: 'completed_visits', label: 'Completed Visits' }
      ]
    },
    {
      id: 'services',
      label: 'Services Management (4)',
      icon: Wrench,
      subPages: [
        { id: 'all_providers', label: 'Service Providers' },
        { id: 'categories', label: '9 Bachelor Categories' },
        { id: 'service_verification', label: 'Provider Verification' },
        { id: 'service_complaints', label: 'Complaints & Disputes' }
      ]
    },
    {
      id: 'used_items',
      label: 'Used Items (3)',
      icon: Package,
      subPages: [
        { id: 'all_items', label: 'Item Listings' },
        { id: 'reported_items', label: 'Reported Items' },
        { id: 'remove_item', label: 'Remove / Moderation' }
      ]
    },
    {
      id: 'communication',
      label: 'Communication & Support (6)',
      icon: MessageSquare,
      alertBadge: openTicketsCount > 0 ? `${openTicketsCount} Open` : null,
      subPages: [
        { id: 'push_notifications', label: 'Push Notifications' },
        { id: 'support_tickets', label: 'Complaints & Tickets' },
        { id: 'banners_ads', label: 'Banners / Ads CMS' }
      ]
    },
    // [TEMPORARILY COMMENTED OUT - CAN BE RE-ENABLED LATER]
    /*
    {
      id: 'finance',
      label: 'Finance (7)',
      icon: CreditCard,
      subPages: [
        { id: 'transactions', label: 'Razorpay Live Payments' },
        { id: 'subscriptions', label: 'Owner Subscriptions' },
        { id: 'featured_boosts', label: 'Featured Boost Listings' },
        { id: 'earning_models', label: '10 Earning Channels' },
        { id: 'refunds', label: 'Refund Management' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Analytics (4)',
      icon: BarChart3,
      subPages: [
        { id: 'user_reports_analytics', label: 'User Reports' },
        { id: 'property_reports', label: 'Property Reports' },
        { id: 'revenue_reports', label: 'Revenue Reports' },
        { id: 'platform_analytics', label: 'Platform Analytics' }
      ]
    },
    {
      id: 'settings',
      label: 'System Settings (7)',
      icon: Settings,
      subPages: [
        { id: 'admin_users', label: 'Admin Users & Roles' },
        { id: 'permissions', label: 'Roles & Permissions' },
        { id: 'app_settings', label: 'App Settings & Fraud Rules' },
        { id: 'policies', label: 'Terms & Privacy Policy' },
        { id: 'activity_logs', label: 'Audit Activity Logs' }
      ]
    },
    {
      id: 'auth',
      label: 'Authentication (1)',
      icon: KeyRound,
      subPages: [
        { id: 'admin_login', label: 'Admin Login Status' },
        { id: 'otp_verification', label: '2FA / OTP Verification' },
        { id: 'password_reset', label: 'Password & Security' }
      ]
    }
    */
  ];

  return (
    <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#1e1b4b] text-slate-200 border-r border-[#2e2a72] transition-transform duration-200 lg:transition-all overflow-x-hidden ${
      isOpenMobile ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 ${isCollapsed ? 'lg:w-16' : 'lg:w-[270px]'} w-[270px]`}>
      {/* Brand Header matching Poster */}
      <div className={`p-4 flex items-center justify-between border-b border-[#2e2a72] bg-black/25 shrink-0 ${isCollapsed ? 'lg:justify-center py-3.5 px-0' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 bg-indigo-600 border border-white/20 rounded-[2px] flex items-center justify-center text-white shrink-0">
            <ShieldCheck size={20} />
          </div>
          {(!isCollapsed || isOpenMobile) && (
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">AdminPanel</h2>
              <p className="text-xs text-indigo-300 font-medium">Complete Platform Control</p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button 
            type="button" 
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
            title="Close Menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Security Trust Badges Bar (Direct from poster) */}
      {!isCollapsed && (
        <div className="py-1.5 px-2.5 bg-black/35 flex items-center justify-around border-b border-[#2e2a72] text-[10px] text-slate-300 shrink-0">
          <div className="flex flex-col items-center gap-0.5 text-center" title="Fraud Detection Active">
            <ShieldAlert size={13} className="text-sky-400" />
            <span>Fraud Check</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center" title="Document Verification Engine">
            <FileCheck size={13} className="text-sky-400" />
            <span>Docs Verify</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center" title="Duplicate Property Check">
            <Copy size={13} className="text-sky-400" />
            <span>Duplicate</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center" title="User Safety & Trust">
            <Lock size={13} className="text-sky-400" />
            <span>User Safety</span>
          </div>
        </div>
      )}

      {/* Navigation List with clean accordion dropdowns */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1">
        {!isCollapsed && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 px-2.5 pt-1.5 pb-1">
            Platform Modules & Sub-Screens
          </div>
        )}
        
        {menuConfig.map((item) => {
          const Icon = item.icon;
          const isModuleActive = activeModule === item.id;
          const isExpanded = Boolean(expandedModules[item.id]);

          return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Parent Accordion Button */}
              <button
                type="button"
                className={`flex items-center justify-between w-full py-2 px-2.5 min-h-[34px] rounded-[2px] text-xs font-medium cursor-pointer text-left transition-colors duration-150 ${isCollapsed ? 'justify-center py-2 px-0' : ''} ${isModuleActive ? 'bg-indigo-700 text-white font-semibold border border-white/20' : 'text-slate-300 bg-transparent border border-transparent hover:bg-white/10 hover:text-white'}`}
                onClick={() => {
                  if (isModuleActive) {
                    onToggleExpand(item.id);
                  } else {
                    const firstSub = item.subPages && item.subPages.length > 0 ? item.subPages[0].id : 'overview';
                    onNavigate(item.id, firstSub);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} color={isModuleActive ? '#ffffff' : '#94a3b8'} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.alertBadge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[2px] font-semibold bg-rose-600 text-white">
                        {item.alertBadge}
                      </span>
                    )}
                    {item.countBadge && !item.alertBadge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[2px] font-semibold bg-white/10 text-slate-100 opacity-70">
                        {item.countBadge}
                      </span>
                    )}
                    {item.subPages && item.subPages.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={isExpanded ? "Collapse section" : "Expand section"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleExpand(item.id);
                        }}
                        className="inline-flex items-center justify-center p-0.5 cursor-pointer rounded-[2px] transition-colors hover:bg-white/15"
                      >
                        <ChevronRight 
                          size={14} 
                          className={`transition-transform duration-200 text-slate-400 ${isExpanded ? 'rotate-90 text-white' : ''}`} 
                        />
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Accordion Sub-pages dropdown */}
              {!isCollapsed && isExpanded && item.subPages && item.subPages.length > 0 && (
                <div className="flex flex-col gap-0.5 pl-3 my-1 border-l-2 border-indigo-400/40 ml-4.5 accordion-submenu">
                  {item.subPages.map((sub) => {
                    const isSubActive = isModuleActive && activeSubPage === sub.id;
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        className={`flex items-center justify-between w-full py-1.5 px-2 rounded-[2px] text-xs cursor-pointer text-left transition-colors duration-150 ${isSubActive ? 'text-white bg-indigo-500/25 font-semibold' : 'text-slate-400 bg-transparent hover:text-white hover:bg-white/5'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(item.id, sub.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                      >
                        <span>{sub.label}</span>
                        {isSubActive && (
                          <div style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#818cf8' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Admin Profile Footer */}
      <div className={`p-2.5 px-3.5 border-t border-[#2e2a72] bg-black/30 flex items-center justify-between shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <img 
            src={adminUser?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
            alt={adminUser?.name || "Super Admin"} 
            className="w-7.5 h-7.5 rounded-[2px] border border-indigo-500 object-cover"
          />
          {!isCollapsed && (
            <div>
              <h4 className="text-xs font-semibold text-white leading-tight">{adminUser?.name || 'Super Admin'}</h4>
              <p className="text-[10px] text-slate-400">{adminUser?.role || 'Super Administrator'}</p>
            </div>
          )}
        </div>

        {!isCollapsed && onLogout && (
          <button 
            type="button"
            className="bg-white/10 border border-white/15 text-rose-400 w-6.5 h-6.5 rounded-[2px] flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0 hover:bg-rose-600 hover:text-white hover:border-rose-500"
            title="Sign Out Session"
            onClick={onLogout}
          >
            <LogOut size={13} />
          </button>
        )}
      </div>
    </aside>
  );
}
