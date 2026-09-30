import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PropertyModal from './components/PropertyModal';
import KycModal from './components/KycModal';
import AddPropertyModal from './components/AddPropertyModal';

import DashboardOverview from './pages/DashboardOverview';
import UserManagement from './pages/UserManagement';
import OwnerManagement from './pages/OwnerManagement';
import PropertyManagement from './pages/PropertyManagement';
import ServicesManagement from './pages/ServicesManagement';
import UsedItemsManagement from './pages/UsedItemsManagement';
import FinanceManagement from './pages/FinanceManagement';
import CommunicationManagement from './pages/CommunicationManagement';
import ReportsAnalytics from './pages/ReportsAnalytics';
import SettingsManagement from './pages/SettingsManagement';
import AuthManagement from './pages/AuthManagement';
import LoginPage from './pages/LoginPage';

import { 
  mockDashboardMetrics, 
  initialUsers, 
  initialOwners, 
  initialProperties, 
  initialServices, 
  initialUsedItems,
  initialTickets
} from './data/mockData';
import { showToast, confirmDelete } from './utils/alerts';

export default function App() {
  // Authentication session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('property_admin_auth');
    return saved !== null ? saved === 'true' : true;
  });

  // Navigation state: parent module + specific sub-page
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeSubPage, setActiveSubPage] = useState('overview');
  const [expandedModules, setExpandedModules] = useState({
    dashboard: true,
    properties: true,
    owners: true
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Domain states
  const [metrics, setMetrics] = useState(mockDashboardMetrics);
  const [users, setUsers] = useState(initialUsers);
  const [owners, setOwners] = useState(initialOwners);
  const [properties, setProperties] = useState(initialProperties);
  const [services, setServices] = useState(initialServices);
  const [usedItems, setUsedItems] = useState(initialUsedItems);
  const [tickets, setTickets] = useState(initialTickets);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  // Authentication Handlers
  const handleLogin = (adminData) => {
    setIsAuthenticated(true);
    localStorage.setItem('property_admin_auth', 'true');
    showToast(`Welcome back, ${adminData.name}! Admin session authorized.`, 'success');
  };

  const handleLogout = async () => {
    const confirmed = await confirmDelete(
      'Sign Out from AdminPanel?',
      'Your administrative master session tokens will be invalidated and logged.'
    );
    if (confirmed) {
      setIsAuthenticated(false);
      localStorage.setItem('property_admin_auth', 'false');
      showToast('You have been signed out securely.', 'info');
    }
  };

  // Accordion Toggle
  const handleToggleExpand = (moduleId) => {
    setExpandedModules(prev => {
      const isCurrentlyExpanded = prev[moduleId] !== undefined ? prev[moduleId] : (activeModule === moduleId);
      return {
        ...prev,
        [moduleId]: !isCurrentlyExpanded
      };
    });
  };

  // Router navigation
  const handleNavigate = (moduleId, subPageId) => {
    setActiveModule(moduleId);
    setActiveSubPage(subPageId);
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: true
    }));
  };

  // Property Handlers
  const handleUpdatePropertyStatus = (id, newStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (newStatus === 'Active') {
      showToast('Property listing approved and published live!', 'success');
    } else if (newStatus === 'Rejected') {
      showToast('Property listing rejected.', 'error');
    } else {
      showToast(`Property status updated to ${newStatus}`, 'info');
    }
  };

  const handleTogglePropertyFeatured = (id) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.isFeatured;
        showToast(nextState ? 'Marked as Featured Boost listing ★' : 'Removed from Featured Boost listings', 'info');
        return { ...p, isFeatured: nextState };
      }
      return p;
    }));
  };

  const handleDeleteProperty = async (id) => {
    const isConfirmed = await confirmDelete(
      'Delete Property Listing?', 
      `Are you sure you want to permanently remove listing ${id} from platform?`
    );
    if (isConfirmed) {
      setProperties(prev => prev.filter(p => p.id !== id));
      setMetrics(prev => ({ ...prev, totalProperties: Math.max(0, prev.totalProperties - 1) }));
      showToast('Property listing deleted successfully.', 'success');
    }
  };

  const handleAddProperty = (newProperty) => {
    setProperties(prev => [newProperty, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalProperties: prev.totalProperties + 1,
    }));
    showToast('New verified property published successfully!', 'success');
  };

  // Owner KYC Handlers
  const handleApproveKyc = (id, remarks) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, kycStatus: 'Verified', verificationStatus: 'Approved' } : o));
    showToast('Owner KYC verified and official trust badge granted!', 'success');
  };

  const handleRejectKyc = (id, remarks) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, kycStatus: 'Rejected', verificationStatus: 'Rejected' } : o));
    showToast('Owner KYC dossier rejected.', 'error');
  };

  const handleToggleBlockOwner = (id) => {
    setOwners(prev => prev.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'Active' ? 'Blocked' : 'Active';
        showToast(`Owner ${o.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // User Handlers
  const handleToggleBlockUser = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Services Handlers
  const handleToggleServiceStatus = (id) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`Service partner is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Used Items Handlers
  const handleRemoveUsedItem = (id) => {
    setUsedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApproveUsedItem = (id) => {
    setUsedItems(prev => prev.map(item => item.id === id ? { ...item, reported: false, status: 'Active' } : item));
    showToast('Report cleared, item restored to marketplace.', 'success');
  };

  const pendingKycCount = owners.filter(o => o.kycStatus === 'Pending').length;
  const pendingPropsCount = properties.filter(p => p.status === 'Pending Verification').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const moduleTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Platform KPI Metrics, Verification Queues & Revenue Summary' },
    users: { title: 'User Management', subtitle: 'All Users, Roles, Suspension Controls & Abuse Reports' },
    owners: { title: 'Owner Management', subtitle: 'All Landlords, Title Deed KYC Verification & Trust Badges' },
    properties: { title: 'Property Management', subtitle: 'Catalog, Pending Moderation, Duplicate Check & Approvals' },
    services: { title: 'Services Management', subtitle: 'Tiffin, Laundry, Maid, Maintenance & Relocation Providers' },
    used_items: { title: 'Used Items Marketplace', subtitle: 'Furniture & Appliances Moderation, Take-Down & Disputes' },
    finance: { title: 'Finance & Subscriptions', subtitle: 'Razorpay Live Payments, 10 Earning Models & Revenue Tracking' },
    communication: { title: 'Communication & Tickets', subtitle: 'Firebase Push Broadcast, Banners/Ads CMS & Support Tickets' },
    reports: { title: 'Reports & Analytics', subtitle: 'Growth Velocity, Turnaround Time & Financial Reports' },
    settings: { title: 'System Settings', subtitle: 'Admin Governance, Fraud Limits & Activity Audit Trail' },
    auth: { title: 'Authentication & Access', subtitle: 'Admin Login Session, OTP Verification & Master Credentials' }
  };

  const currentModule = moduleTitles[activeModule] || { title: 'AdminPanel', subtitle: 'Enterprise Platform Console' };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen w-full relative bg-[#f4f6f9]">
      {/* Sidebar with dropdown sub-pages matching poster */}
      <Sidebar 
        activeModule={activeModule}
        activeSubPage={activeSubPage}
        onNavigate={handleNavigate}
        expandedModules={expandedModules}
        onToggleExpand={handleToggleExpand}
        pendingKycCount={pendingKycCount}
        pendingPropertiesCount={pendingPropsCount}
        openTicketsCount={openTicketsCount}
        isCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Layout Area */}
      <div className={`flex-1 flex flex-col min-w-0 relative transition-all duration-200 min-h-screen ${isSidebarCollapsed ? 'ml-16' : 'ml-[270px]'}`}>
        <Header 
          activeModule={activeModule}
          activeSubPage={activeSubPage}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingKycCount={pendingKycCount}
          pendingPropertiesCount={pendingPropsCount}
          openTicketsCount={openTicketsCount}
          unreadCount={pendingKycCount + pendingPropsCount}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          properties={properties}
          owners={owners}
          users={users}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onSelectKyc={(owner) => setSelectedKyc(owner)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-5 min-h-[calc(100vh-62px)] flex flex-col">
          {activeModule === 'dashboard' && (
            <DashboardOverview 
              metrics={metrics}
              owners={owners}
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onSelectKyc={(owner) => setSelectedKyc(owner)}
              setActiveTab={(tab) => handleNavigate(tab, 'overview')}
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'users' && (
            <UserManagement 
              users={users}
              onToggleBlockUser={handleToggleBlockUser}
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'owners' && (
            <OwnerManagement 
              owners={owners}
              onSelectKyc={(owner) => setSelectedKyc(owner)}
              onApproveKyc={handleApproveKyc}
              onRejectKyc={handleRejectKyc}
              onToggleBlockOwner={handleToggleBlockOwner}
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'properties' && (
            <PropertyManagement 
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onUpdateStatus={handleUpdatePropertyStatus}
              onToggleFeatured={handleTogglePropertyFeatured}
              onDeleteProperty={handleDeleteProperty}
              onAddNewClick={() => setIsAddPropertyOpen(true)}
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'services' && (
            <ServicesManagement 
              services={services}
              onToggleServiceStatus={handleToggleServiceStatus}
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'used_items' && (
            <UsedItemsManagement 
              usedItems={usedItems}
              onRemoveItem={handleRemoveUsedItem}
              onApproveItem={handleApproveUsedItem}
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'finance' && (
            <FinanceManagement 
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'communication' && (
            <CommunicationManagement 
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'reports' && (
            <ReportsAnalytics 
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'settings' && (
            <SettingsManagement 
              activeSubPage={activeSubPage}
            />
          )}

          {activeModule === 'auth' && (
            <AuthManagement 
              activeSubPage={activeSubPage}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <PropertyModal 
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onUpdateStatus={handleUpdatePropertyStatus}
        onToggleFeatured={handleTogglePropertyFeatured}
      />

      <KycModal 
        kycItem={selectedKyc}
        onClose={() => setSelectedKyc(null)}
        onApprove={handleApproveKyc}
        onReject={handleRejectKyc}
      />

      <AddPropertyModal 
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onAddProperty={handleAddProperty}
      />
    </div>
  );
}
