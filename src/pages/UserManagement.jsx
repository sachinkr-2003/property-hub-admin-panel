import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  UserX, 
  UserCheck, 
  AlertCircle, 
  Eye, 
  ShieldAlert, 
  CheckCircle, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  ArrowUpDown,
  Download,
  CheckSquare,
  Square,
  Users,
  UserPlus,
  RefreshCw,
  Clock,
  Send,
  MessageSquare,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Activity,
  Briefcase,
  DollarSign,
  Award,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { confirmDelete, showToast } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function UserManagement({ 
  users = [], 
  onToggleBlockUser, 
  onUpdateUser, 
  onDeleteUser, 
  activeSubPage = 'all_users' 
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(users[0] || null);
  
  // Modal states
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [activeDossierTab, setActiveDossierTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Tenant',
    status: 'Active',
    city: 'Lucknow',
    locality: 'Gomti Nagar',
    occupation: '',
    budget: '',
    kycStatus: 'Verified'
  });

  // User activities loaded from backend
  const [userActivities, setUserActivities] = useState({
    visits: [],
    roommates: [],
    usedItems: [],
    tickets: []
  });
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Admin internal notes per user
  const [adminNotes, setAdminNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('property_admin_user_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [newNoteText, setNewNoteText] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Multi-select bulk state
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync with subPage from dropdown
  useEffect(() => {
    if (activeSubPage === 'suspended_users') {
      setFilterStatus('Suspended');
    } else if (activeSubPage === 'user_reports') {
      setFilterStatus('Reported');
    } else {
      setFilterStatus('All');
    }
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
    setCurrentPage(1);
    setSelectedIds([]);
  }, [activeSubPage, users]);

  // Open comprehensive dossier modal and fetch backend activities
  const handleOpenDossier = async (user) => {
    setSelectedUser(user);
    setIsDossierModalOpen(true);
    setActiveDossierTab('overview');
    setIsLoadingActivities(true);

    try {
      const res = await api.get(`/users/${user.id || user.customId}`);
      if (res?.data?.activities) {
        setUserActivities(res.data.activities);
      } else {
        setUserActivities({ visits: [], roommates: [], usedItems: [], tickets: [] });
      }
    } catch {
      // Fallback empty activities gracefully
      setUserActivities({ visits: [], roommates: [], usedItems: [], tickets: [] });
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Open Edit User modal
  const handleOpenEditModal = (user) => {
    setEditFormData({
      id: user.id || user.customId,
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      role: user.role || 'Tenant',
      status: user.status || 'Active',
      city: user.city || 'Lucknow',
      locality: user.locality || 'Gomti Nagar',
      occupation: user.occupation || '',
      budget: user.budget || '',
      kycStatus: user.kycStatus || 'Verified',
      enquiriesSent: user.enquiriesSent ?? 0
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Form
  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.mobile) {
      showToast('Name and mobile number are required.', 'warning');
      return;
    }

    if (onUpdateUser) {
      onUpdateUser(editFormData.id, editFormData);
    }
    
    // Update local selected user if currently viewed
    if (selectedUser && (selectedUser.id === editFormData.id || selectedUser.customId === editFormData.id)) {
      setSelectedUser(prev => ({ ...prev, ...editFormData }));
    }

    setIsEditModalOpen(false);
    showToast(`User details for ${editFormData.name} updated successfully.`, 'success');
  };

  // Create User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!createFormData.name || !createFormData.mobile) {
      showToast('Please provide user full name and 10-digit mobile number.', 'warning');
      return;
    }

    const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    const newUser = {
      ...createFormData,
      id: newId,
      customId: newId,
      reportsCount: 0,
      enquiriesSent: 0,
      createdAt: new Date().toISOString().split('T')[0],
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    if (onUpdateUser) {
      onUpdateUser(newId, newUser);
    }

    setIsCreateModalOpen(false);
    showToast(`New user ${newUser.name} registered successfully.`, 'success');
    handleOpenDossier(newUser);
  };

  // Add internal admin note
  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedUser) return;
    const userId = selectedUser.id || selectedUser.customId;
    const note = {
      id: Date.now(),
      text: newNoteText.trim(),
      author: 'Super Admin',
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    const updated = {
      ...adminNotes,
      [userId]: [note, ...(adminNotes[userId] || [])]
    };
    setAdminNotes(updated);
    try {
      localStorage.setItem('property_admin_user_notes', JSON.stringify(updated));
    } catch {}
    setNewNoteText('');
    showToast('Admin note recorded securely.', 'success');
  };

  // Delete User handler
  const handleDeleteUserAction = async (user) => {
    const confirmed = await confirmDelete(
      `Delete User ${user.name}?`,
      `Permanent action: This user record (${user.id}) will be removed from MongoDB along with associated listings.`
    );

    if (confirmed) {
      if (onDeleteUser) {
        onDeleteUser(user.id || user.customId);
      }
      if (selectedUser?.id === user.id) {
        setIsDossierModalOpen(false);
      }
      showToast(`User ${user.name} has been removed.`, 'info');
    }
  };

  const mockUserReports = [
    { 
      id: 'REP-01', 
      reportedUser: 'Alok Aggarwal', 
      reportedId: 'USR-106', 
      reporter: 'Pooja Sharma (Tenant)', 
      reason: 'Demanded advance booking amount outside the app for room sharing', 
      date: '2026-09-28', 
      severity: 'High', 
      status: 'Pending Review' 
    },
    { 
      id: 'REP-02', 
      reportedUser: 'Rohan Tripathi', 
      reportedId: 'USR-103', 
      reporter: 'Aarav Singhania (Admin)', 
      reason: 'Multiple rapid inquiry pings flagged as automated scraping bot', 
      date: '2026-09-29', 
      severity: 'Medium', 
      status: 'Under Observation' 
    }
  ];

  // Filtering & Sorting
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      let matchesSub = true;
      if (activeSubPage === 'suspended_users') matchesSub = u.status === 'Suspended';
      if (activeSubPage === 'user_reports') matchesSub = (u.reportsCount || 0) > 0;
      if (activeSubPage === 'block_unblock') matchesSub = true;

      const matchesStatus = filterStatus === 'All' 
        ? true 
        : filterStatus === 'Reported' 
          ? (u.reportsCount || 0) > 0 
          : (u.status || 'Active').toLowerCase() === filterStatus.toLowerCase();

      const matchesRole = filterRole === 'All'
        ? true
        : (u.role || 'Tenant').toLowerCase().includes(filterRole.toLowerCase());

      const matchesSearch = 
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.mobile || '').includes(searchTerm) ||
        (u.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.customId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.locality || '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSub && matchesStatus && matchesRole && matchesSearch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? ((valA || 0) - (valB || 0)) : ((valB || 0) - (valA || 0));
    });
  }, [users, activeSubPage, filterStatus, filterRole, searchTerm, sortField, sortOrder]);

  // Paginated slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map(u => u.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Block / Unblock action
  const handleBlockAction = async (user) => {
    const isBlocking = user.status === 'Active';
    const confirmed = await confirmDelete(
      isBlocking ? `Suspend User ${user.name}?` : `Unblock User ${user.name}?`,
      isBlocking 
        ? `This user (${user.id}) will immediately lose access to search, messaging, and flat inquiries.` 
        : `This user's account will be restored with full platform access.`
    );

    if (confirmed) {
      onToggleBlockUser(user.id || user.customId);
      if (selectedUser && (selectedUser.id === user.id || selectedUser.customId === user.id)) {
        setSelectedUser(prev => ({ ...prev, status: isBlocking ? 'Suspended' : 'Active' }));
      }
      showToast(isBlocking ? `User ${user.name} has been suspended.` : `User ${user.name} restored to Active.`, isBlocking ? 'warning' : 'success');
    }
  };

  // Bulk Suspend / Activate
  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      const u = users.find(user => user.id === id || user.customId === id);
      if (u && ((newStatus === 'Suspended' && u.status === 'Active') || (newStatus === 'Active' && u.status === 'Suspended'))) {
        onToggleBlockUser(id);
      }
    });
    showToast(`${selectedIds.length} accounts updated to ${newStatus}.`, 'success');
    setSelectedIds([]);
  };

  // Export CSV
  const handleExportCsv = (dataToExport = filteredUsers, filename = 'Platform_Users_Directory') => {
    const columns = [
      { label: 'User ID', accessor: 'id' },
      { label: 'Full Name', accessor: 'name' },
      { label: 'Email Address', accessor: 'email' },
      { label: 'Mobile Number', accessor: 'mobile' },
      { label: 'Role / Profile', accessor: 'role' },
      { label: 'Locality', accessor: 'locality' },
      { label: 'City', accessor: 'city' },
      { label: 'Occupation', accessor: 'occupation' },
      { label: 'Budget', accessor: 'budget' },
      { label: 'Enquiries Sent', accessor: 'enquiriesSent' },
      { label: 'Abuse Reports', accessor: 'reportsCount' },
      { label: 'Account Status', accessor: 'status' },
      { label: 'Registration Date', accessor: 'createdAt' }
    ];
    exportToCsv(filename, dataToExport, columns);
    showToast(`Exported ${dataToExport.length} user records to CSV.`, 'info');
  };

  const handleDismissReport = (repId) => {
    showToast(`Report ${repId} dismissed after review.`, 'info');
  };

  const handleIssueWarning = (userName) => {
    showToast(`Official policy warning notification sent to ${userName}.`, 'warning');
  };

  return (
    <div className="space-y-4">
      {/* Notice Banner for Suspended view */}
      {activeSubPage === 'suspended_users' && (
        <div className="bg-amber-50 border border-amber-300 rounded-[2px] p-2.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-700" />
            <span>
              <strong>Account Access & Suspensions Console:</strong> Manage platform lockouts, review identity appeals, and toggle access permissions.
            </span>
          </div>
          <span className="font-bold">{filteredUsers.length} Filtered Accounts</span>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="classic-card p-3 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total App Users</span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{users.length}</div>
          </div>
          <div className="w-8 h-8 rounded-[2px] bg-purple-50 text-purple-700 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="classic-card p-3 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Accounts</span>
            <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
              {users.filter(u => u.status === 'Active').length}
            </div>
          </div>
          <div className="w-8 h-8 rounded-[2px] bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle size={18} />
          </div>
        </div>

        <div className="classic-card p-3 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Suspended / Flagged</span>
            <div className="text-lg font-bold text-red-600 font-mono mt-0.5">
              {users.filter(u => u.status === 'Suspended' || (u.reportsCount || 0) > 0).length}
            </div>
          </div>
          <div className="w-8 h-8 rounded-[2px] bg-red-50 text-red-700 flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
        </div>

        <div className="classic-card p-3 bg-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Enquiries</span>
            <div className="text-lg font-bold text-blue-700 font-mono mt-0.5">
              {users.reduce((acc, u) => acc + (u.enquiriesSent || 0), 0)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-[2px] bg-blue-50 text-blue-700 flex items-center justify-center">
            <Activity size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-toolbar flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="search-input-wrap w-full sm:w-64">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search name, phone, email, locality..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs w-full"
            />
          </div>

          {/* Status Filter */}
          <select 
            className="filter-select-input text-xs"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended</option>
            <option value="Reported">Reported Accounts</option>
          </select>

          {/* Role Filter */}
          <select 
            className="filter-select-input text-xs"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Roles</option>
            <option value="Tenant">Tenants</option>
            <option value="Bachelor">Bachelors</option>
            <option value="Roommate">Roommate Seekers</option>
            <option value="Family">Family Tenants</option>
          </select>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 border-purple-800"
          >
            <UserPlus size={13} />
            <span>Add User</span>
          </button>

          <button
            type="button"
            onClick={() => handleExportCsv(filteredUsers, 'All_Users_Directory')}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Download CSV of current filtered list"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are checked) */}
      {selectedIds.length > 0 && (
        <div className="bg-purple-50 border border-purple-300 p-2.5 rounded-[2px] flex items-center justify-between text-xs text-purple-950 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-purple-700 text-white px-2 py-0.5 rounded-[2px] font-mono text-[11px]">
              {selectedIds.length} Selected
            </span>
            <span>Bulk actions applicable to checked accounts:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkStatusChange('Suspended')}
              className="btn-danger text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <UserX size={13} />
              <span>Suspend Selected</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange('Active')}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <UserCheck size={13} />
              <span>Reactivate Selected</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const selectedData = users.filter(u => selectedIds.includes(u.id));
                handleExportCsv(selectedData, 'Selected_Users');
              }}
              className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Users Data Table */}
      <div className="classic-card p-0 overflow-hidden">
        <div className="table-container border-0 overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th onClick={() => handleSort('id')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>User ID</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>User Profile</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th>Role & Contact</th>
                <th>Locality / City</th>
                <th onClick={() => handleSort('enquiriesSent')} className="cursor-pointer select-none text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Enquiries</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('reportsCount')} className="cursor-pointer select-none text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Abuse Flags</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th>Status</th>
                <th className="text-center">Admin Controls</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => {
                const isSelected = selectedIds.includes(u.id);
                return (
                  <tr 
                    key={u.id || u.customId} 
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-50/50' : 'hover:bg-slate-50'
                    }`}
                    onClick={(e) => {
                      // Prevent modal if clicking checkbox or action buttons
                      if (e.target.closest('input[type="checkbox"]') || e.target.closest('button') || e.target.closest('a')) return;
                      handleOpenDossier(u);
                    }}
                  >
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(u.id)}
                        className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="font-mono font-bold text-xs text-slate-700">
                      {u.id || u.customId}
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                          alt={u.name || 'User'} 
                          className="w-8 h-8 rounded-[2px] object-cover border border-slate-300"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900 hover:text-purple-700 transition-colors">
                            {u.name || 'User'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{u.email || 'No email registered'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill badge-blue">{u.role || 'Tenant'}</span>
                      <div className="text-[11px] font-mono text-slate-700 mt-0.5">{u.mobile}</div>
                    </td>
                    <td className="text-xs text-slate-700">
                      {u.locality || 'Locality'}, <span className="text-slate-500">{u.city || 'Lucknow'}</span>
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-slate-800">
                      {u.enquiriesSent ?? 0} sent
                    </td>
                    <td className="text-center">
                      {(u.reportsCount || 0) > 0 ? (
                        <span className="badge-pill badge-red inline-flex items-center gap-1" title="Reported violations">
                          <AlertCircle size={10} />
                          <span>{u.reportsCount} Reports</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
                          <Check size={12} /> Clean
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-pill ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          type="button"
                          className="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1 text-purple-700 hover:bg-purple-50 border-purple-200" 
                          title="View Complete User Dossier"
                          onClick={() => handleOpenDossier(u)}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        <button 
                          type="button"
                          className="btn-icon p-1 text-slate-600 hover:text-purple-700 hover:bg-slate-100" 
                          title="Edit User Profile"
                          onClick={() => handleOpenEditModal(u)}
                        >
                          <Edit size={13} />
                        </button>

                        <button 
                          type="button"
                          className={`btn-icon p-1 ${u.status === 'Active' ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'}`}
                          title={u.status === 'Active' ? 'Suspend Account' : 'Reactivate User'}
                          onClick={() => handleBlockAction(u)}
                        >
                          {u.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>

                        <button 
                          type="button"
                          className="btn-icon p-1 text-red-600 hover:bg-red-50"
                          title="Delete User Record"
                          onClick={() => handleDeleteUserAction(u)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-xs text-slate-400">
                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                    No user records matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ================= MODAL: 360-DEGREE USER DOSSIER ================= */}
      {isDossierModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[4px] border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-300 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={selectedUser.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-[2px] object-cover border border-slate-300 shadow-xs"
                  />
                  {selectedUser.status === 'Active' && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Active"></span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">{selectedUser.name || 'Unnamed User'}</h2>
                    <span className="font-mono text-[11px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-[2px]">
                      {selectedUser.id || selectedUser.customId}
                    </span>
                    <span className={`badge-pill text-[10px] ${selectedUser.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                      {selectedUser.status || 'Active'}
                    </span>
                    <span className="badge-pill badge-blue text-[10px]">
                      {selectedUser.role || 'Tenant'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-mono font-medium text-slate-700">{selectedUser.mobile}</span>
                    <span>•</span>
                    <span>{selectedUser.email || 'No Email'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin size={11} /> {selectedUser.locality || 'Locality'}, {selectedUser.city || 'Lucknow'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedUser.mobile && (
                  <>
                    <a 
                      href={`tel:${selectedUser.mobile}`} 
                      className="btn-secondary text-xs flex items-center gap-1 py-1 px-2.5 text-slate-700 hover:text-emerald-700"
                      title="Direct Phone Call"
                    >
                      <Phone size={13} />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                    <a 
                      href={`https://wa.me/${selectedUser.mobile.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-secondary text-xs flex items-center gap-1 py-1 px-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300"
                      title="Open WhatsApp Chat"
                    >
                      <MessageSquare size={13} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </>
                )}
                {selectedUser.email && (
                  <a 
                    href={`mailto:${selectedUser.email}`} 
                    className="btn-secondary text-xs flex items-center gap-1 py-1 px-2.5 text-slate-700 hover:text-blue-700"
                    title="Send Email"
                  >
                    <Mail size={13} />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                )}
                <button 
                  type="button" 
                  onClick={() => handleOpenEditModal(selectedUser)}
                  className="btn-secondary text-xs flex items-center gap-1 py-1 px-2.5 text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-300"
                  title="Edit User Profile"
                >
                  <Edit size={13} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDossierModalOpen(false)}
                  className="btn-icon p-1.5 text-slate-400 hover:text-slate-700 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 bg-slate-100 border-b border-slate-300 text-xs">
              <button 
                onClick={() => setActiveDossierTab('overview')}
                className={`px-3 py-2 font-bold border-b-2 transition-colors ${
                  activeDossierTab === 'overview' 
                    ? 'border-purple-700 text-purple-800 bg-white' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Profile & Contact Dossier
              </button>
              <button 
                onClick={() => setActiveDossierTab('activities')}
                className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeDossierTab === 'activities' 
                    ? 'border-purple-700 text-purple-800 bg-white' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Live Activities</span>
                <span className="bg-purple-100 text-purple-800 font-mono text-[10px] px-1.5 rounded-full font-bold">
                  {(userActivities.visits?.length || 0) + (userActivities.roommates?.length || 0) + (userActivities.usedItems?.length || 0) + (selectedUser.enquiriesSent || 0)}
                </span>
              </button>
              <button 
                onClick={() => setActiveDossierTab('safety')}
                className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeDossierTab === 'safety' 
                    ? 'border-purple-700 text-purple-800 bg-white' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Safety & Reports</span>
                {(selectedUser.reportsCount || 0) > 0 && (
                  <span className="bg-red-100 text-red-700 font-mono text-[10px] px-1.5 rounded-full font-bold">
                    {selectedUser.reportsCount} Flags
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveDossierTab('notes')}
                className={`px-3 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeDossierTab === 'notes' 
                    ? 'border-purple-700 text-purple-800 bg-white' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Admin Notes</span>
                {(adminNotes[selectedUser.id || selectedUser.customId]?.length || 0) > 0 && (
                  <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded-full">
                    {adminNotes[selectedUser.id || selectedUser.customId].length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: OVERVIEW & CONTACT */}
              {activeDossierTab === 'overview' && (
                <div className="space-y-4">
                  {/* Quick Stat Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                      <span className="text-[11px] text-slate-500 block uppercase font-medium">Inquiries Submitted</span>
                      <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                        {selectedUser.enquiriesSent ?? 0} Listings
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                      <span className="text-[11px] text-slate-500 block uppercase font-medium">Visits Booked</span>
                      <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                        {userActivities.visits?.length || 0} Visits
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                      <span className="text-[11px] text-slate-500 block uppercase font-medium">KYC Verification</span>
                      <span className="text-base font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <ShieldCheck size={15} /> {selectedUser.kycStatus || 'Verified'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                      <span className="text-[11px] text-slate-500 block uppercase font-medium">Phone Verification</span>
                      <span className="text-base font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle size={15} /> OTP Verified
                      </span>
                    </div>
                  </div>

                  {/* Primary Details Card */}
                  <div className="border border-slate-200 rounded-[2px] p-4 bg-white space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Personal & Contact Metadata
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Full Legal Name</span>
                        <span className="font-bold text-slate-900">{selectedUser.name || 'Not Specified'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Primary Mobile Number</span>
                        <span className="font-mono font-bold text-slate-900">{selectedUser.mobile}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Email Address</span>
                        <span className="font-mono font-bold text-slate-900">{selectedUser.email || 'No Email on record'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Current City & Locality</span>
                        <span className="font-bold text-slate-900">
                          {selectedUser.locality || 'Gomti Nagar'}, {selectedUser.city || 'Lucknow'}, Uttar Pradesh
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Occupation / Employer</span>
                        <span className="font-medium text-slate-800">{selectedUser.occupation || 'Working Professional / Student'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Monthly Rent Budget Range</span>
                        <span className="font-medium text-purple-800 font-mono">{selectedUser.budget || '₹ 8,000 - ₹ 15,000 / mo'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Account Registration Date</span>
                        <span className="font-mono text-slate-700">{selectedUser.createdAt || '2026-09-15'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[2px]">
                        <span className="text-slate-500 block text-[11px]">Account ID & System UUID</span>
                        <span className="font-mono text-slate-700">{selectedUser.id || selectedUser.customId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-[2px] flex-wrap">
                    <div className="text-xs text-slate-600">
                      <strong>Moderation Status:</strong> User currently has <strong>{selectedUser.status}</strong> access.
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleBlockAction(selectedUser)}
                        className={`text-xs px-3 py-1.5 font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
                          selectedUser.status === 'Active' 
                            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                            : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {selectedUser.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        <span>{selectedUser.status === 'Active' ? 'Suspend Account' : 'Reactivate Access'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUserAction(selectedUser)}
                        className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Delete User</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PLATFORM ACTIVITIES */}
              {activeDossierTab === 'activities' && (
                <div className="space-y-4">
                  {isLoadingActivities ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      <RefreshCw size={18} className="animate-spin mx-auto text-purple-700 mb-2" />
                      Loading live activity logs from MongoDB...
                    </div>
                  ) : (
                    <>
                      {/* Scheduled Visits Section */}
                      <div className="border border-slate-200 rounded-[2px] p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={13} className="text-purple-700" />
                            <span>Scheduled Site Visits ({userActivities.visits?.length || 0})</span>
                          </h4>
                        </div>
                        {userActivities.visits && userActivities.visits.length > 0 ? (
                          <div className="divide-y divide-slate-100 text-xs">
                            {userActivities.visits.map((v, i) => (
                              <div key={v.id || i} className="py-2 flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-slate-800">{v.propertyTitle || 'Property Visit'}</span>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    Slot: {v.visitDate || v.date} • {v.timeSlot || '11:00 AM'}
                                  </div>
                                </div>
                                <span className="badge-pill badge-green text-[10px]">{v.status || 'Confirmed'}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 py-3 text-center">
                            No property site visits scheduled yet.
                          </div>
                        )}
                      </div>

                      {/* Roommate Postings Section */}
                      <div className="border border-slate-200 rounded-[2px] p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Users size={13} className="text-blue-700" />
                            <span>Roommate Postings ({userActivities.roommates?.length || 0})</span>
                          </h4>
                        </div>
                        {userActivities.roommates && userActivities.roommates.length > 0 ? (
                          <div className="divide-y divide-slate-100 text-xs">
                            {userActivities.roommates.map((rm, i) => (
                              <div key={rm.id || i} className="py-2 flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-slate-800">{rm.title || 'Roommate Request'}</span>
                                  <div className="text-[11px] text-slate-500">{rm.locality}, {rm.city} • ₹{rm.rent}/mo</div>
                                </div>
                                <span className="badge-pill badge-blue text-[10px]">{rm.status || 'Active'}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 py-3 text-center">
                            No roommate postings created by this user.
                          </div>
                        )}
                      </div>

                      {/* Used Items Listed */}
                      <div className="border border-slate-200 rounded-[2px] p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <DollarSign size={13} className="text-emerald-700" />
                            <span>Used Items Marketplace ({userActivities.usedItems?.length || 0})</span>
                          </h4>
                        </div>
                        {userActivities.usedItems && userActivities.usedItems.length > 0 ? (
                          <div className="divide-y divide-slate-100 text-xs">
                            {userActivities.usedItems.map((item, i) => (
                              <div key={item.id || i} className="py-2 flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-slate-800">{item.title}</span>
                                  <div className="text-[11px] text-slate-500">₹{item.price} • {item.condition}</div>
                                </div>
                                <span className="badge-pill badge-green text-[10px]">{item.status || 'Active'}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 py-3 text-center">
                            No used items listed in marketplace.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: SAFETY & REPORTS */}
              {activeDossierTab === 'safety' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-[2px] text-xs text-amber-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-amber-700" />
                      <span>
                        Platform Safety Profile: <strong>{selectedUser.reportsCount > 0 ? 'Policy Caution' : 'Good Standing'}</strong>
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleIssueWarning(selectedUser.name)}
                      className="btn-secondary text-[11px] py-1 px-2.5 bg-white text-amber-800"
                    >
                      Issue Policy Warning
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-[2px] p-3 bg-white">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Reported Abuse Flags & Incidents
                    </h4>
                    {mockUserReports.filter(r => r.reportedId === selectedUser.id || r.reportedUser === selectedUser.name).length > 0 ? (
                      <div className="divide-y divide-slate-100 text-xs">
                        {mockUserReports.filter(r => r.reportedId === selectedUser.id || r.reportedUser === selectedUser.name).map((rep) => (
                          <div key={rep.id} className="py-2.5 flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-red-700">{rep.id}</span>
                                <span className="badge-pill badge-red text-[9px]">{rep.severity}</span>
                                <span className="text-slate-400 text-[11px]">{rep.date}</span>
                              </div>
                              <p className="text-slate-800 mt-1">{rep.reason}</p>
                              <div className="text-[11px] text-slate-500 mt-0.5">Complainant: {rep.reporter}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDismissReport(rep.id)}
                              className="btn-secondary text-[10px] py-0.5 px-2"
                            >
                              Dismiss
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">
                        <CheckCircle size={28} className="mx-auto text-emerald-600 mb-1" />
                        0 active abuse reports filed against this user. Account is clean!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ADMIN NOTES */}
              {activeDossierTab === 'notes' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-[2px] p-3 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Add Internal Moderation Note
                    </h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Write a private note regarding this user..." 
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                        className="text-xs flex-1"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddNote}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <Send size={12} />
                        <span>Add Note</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs mt-3">
                      {(adminNotes[selectedUser.id || selectedUser.customId] || []).length > 0 ? (
                        adminNotes[selectedUser.id || selectedUser.customId].map((note) => (
                          <div key={note.id} className="py-2.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-bold text-purple-800">{note.author}</span>
                              <span className="font-mono">{note.date}</span>
                            </div>
                            <p className="text-slate-800 mt-1">{note.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-slate-400">
                          No internal notes recorded for this user yet. Add one above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[4px] border border-slate-300 shadow-2xl w-full max-w-lg p-5 animate-slideUp">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit size={15} className="text-purple-700" />
                <span>Edit User Profile ({editFormData.id})</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn-icon p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input 
                    type="text" 
                    value={editFormData.mobile}
                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    className="w-full text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Persona</label>
                  <select 
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full text-xs"
                  >
                    <option value="Tenant">Tenant</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Roommate">Roommate</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality</label>
                  <input 
                    type="text" 
                    value={editFormData.locality}
                    onChange={(e) => setEditFormData({ ...editFormData, locality: e.target.value })}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input 
                    type="text" 
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Occupation</label>
                  <input 
                    type="text" 
                    value={editFormData.occupation}
                    onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget</label>
                  <input 
                    type="text" 
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary text-xs py-1.5 px-3 bg-purple-700 hover:bg-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE USER ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[4px] border border-slate-300 shadow-2xl w-full max-w-lg p-5 animate-slideUp">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus size={15} className="text-purple-700" />
                <span>Register New User / Tenant</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="btn-icon p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vikramaditya Rathore"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +91 98765 43210"
                    value={createFormData.mobile}
                    onChange={(e) => setCreateFormData({ ...createFormData, mobile: e.target.value })}
                    className="w-full text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. vikram@gmail.com"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    className="w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Persona</label>
                  <select 
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                    className="w-full text-xs"
                  >
                    <option value="Tenant">Tenant</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Roommate">Roommate</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select 
                    value={createFormData.status}
                    onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                    className="w-full text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Gomti Nagar"
                    value={createFormData.locality}
                    onChange={(e) => setCreateFormData({ ...createFormData, locality: e.target.value })}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input 
                    type="text" 
                    placeholder="Lucknow"
                    value={createFormData.city}
                    onChange={(e) => setCreateFormData({ ...createFormData, city: e.target.value })}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary text-xs py-1.5 px-3 bg-purple-700 hover:bg-purple-800"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
