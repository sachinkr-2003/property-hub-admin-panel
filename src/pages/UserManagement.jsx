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
  MessageSquare
} from 'lucide-react';
import { confirmDelete, showToast } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function UserManagement({ users, onToggleBlockUser, activeSubPage = 'all_users' }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(users[0] || null);
  
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

  const mockUserReports = [
    { 
      id: 'REP-01', 
      reportedUser: 'Mohit Aggarwal', 
      reportedId: 'USR-105', 
      reporter: 'Pooja Sharma (Tenant)', 
      reason: 'Demanded advance booking amount outside the app for room sharing', 
      date: '2026-09-28', 
      severity: 'High', 
      status: 'Pending Review' 
    },
    { 
      id: 'REP-02', 
      reportedUser: 'Zaid Khan', 
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
      if (activeSubPage === 'user_reports') matchesSub = u.reportsCount > 0;
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
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
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
      onToggleBlockUser(user.id);
      showToast(isBlocking ? `User ${user.name} has been suspended.` : `User ${user.name} restored to Active.`, isBlocking ? 'warning' : 'success');
    }
  };

  // Bulk Suspend / Activate
  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      const u = users.find(user => user.id === id);
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

  // ================= VIEW 1: USER DETAILS DOSSIER =================
  if (activeSubPage === 'user_details') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[calc(100vh-140px)]">
        {/* Left Side: User Selector List */}
        <div className="col-span-1 lg:col-span-4 classic-card p-0 flex flex-col h-auto max-h-[350px] lg:max-h-none lg:h-full">
          <div className="p-3 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">User Directory Directory</span>
            <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-300 px-1.5 py-0.5 rounded-[2px]">
              {users.length} Records
            </span>
          </div>

          <div className="p-2 border-b border-slate-200">
            <div className="search-input-wrap w-full">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-200 max-h-[300px] lg:max-h-[620px]">
            {filteredUsers.map((u) => (
              <div 
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`p-2.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedUser?.id === u.id ? 'bg-purple-50 border-l-4 border-l-purple-700' : 'hover:bg-slate-50'
                }`}
              >
                <img 
                  src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                  alt={u.name || 'User'} 
                  className="w-8 h-8 rounded-[2px] object-cover border border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">{u.name}</span>
                    <span className={`badge-pill text-[9px] ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                      {u.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{u.role}</span>
                    <span>•</span>
                    <span>{u.locality}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed User Dossier */}
        <div className="col-span-1 lg:col-span-8 space-y-4">
          {selectedUser ? (
            <>
              {/* Profile Card */}
              <div className="classic-card p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 flex-wrap">
                    <img 
                      src={selectedUser.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                      alt={selectedUser.name || 'User'} 
                      className="w-16 h-16 rounded-[2px] object-cover border border-slate-300 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-slate-900">{selectedUser.name}</h2>
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-[2px] border border-slate-300">
                          {selectedUser.id}
                        </span>
                        <span className={`badge-pill ${selectedUser.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 font-medium">{selectedUser.role}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {selectedUser.locality}, {selectedUser.city}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> Joined {selectedUser.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
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
                      onClick={() => handleIssueWarning(selectedUser.name)}
                      className="btn-secondary text-xs"
                    >
                      Issue Warning
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200">
                  <div className="bg-slate-50 p-2.5 rounded-[2px] border border-slate-300">
                    <span className="text-[11px] text-slate-500 block">Enquiries Submitted</span>
                    <span className="text-sm font-bold text-slate-900">{selectedUser.enquiriesSent} Listings</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-[2px] border border-slate-300">
                    <span className="text-[11px] text-slate-500 block">Direct Inquiries / Calls</span>
                    <span className="text-sm font-bold text-slate-900">18 Direct Calls</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-[2px] border border-slate-300">
                    <span className="text-[11px] text-slate-500 block">Reported Violations</span>
                    <span className={`text-sm font-bold ${selectedUser.reportsCount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                      {selectedUser.reportsCount} Policy Flags
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-[2px] border border-slate-300">
                    <span className="text-[11px] text-slate-500 block">Phone Verification</span>
                    <span className="text-sm font-bold text-emerald-700">✓ OTP Verified</span>
                  </div>
                </div>
              </div>

              {/* Activity & Communication History */}
              <div className="classic-card p-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Contact Information & Verification Metadata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-[2px]">
                    <span className="text-slate-500 block text-[11px]">Primary Phone</span>
                    <span className="font-mono font-bold text-slate-800">{selectedUser.mobile}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-[2px]">
                    <span className="text-slate-500 block text-[11px]">Email Address</span>
                    <span className="font-mono font-bold text-slate-800">{selectedUser.email}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-[2px]">
                    <span className="text-slate-500 block text-[11px]">Current Residence</span>
                    <span className="font-bold text-slate-800">{selectedUser.locality}, {selectedUser.city}, UP</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-[2px]">
                    <span className="text-slate-500 block text-[11px]">Registration Timestamp</span>
                    <span className="font-mono text-slate-800">{selectedUser.createdAt} 14:28 IST</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="classic-card p-8 text-center text-slate-500 text-xs">
              Select a user from the left column to view the complete administrative dossier.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= VIEW 2: USER ABUSE REPORTS =================
  if (activeSubPage === 'user_reports') {
    return (
      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-300 rounded-[2px] p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-700" />
            <span>
              <strong>Abuse & Harassment Incident Queue:</strong> Complaints registered by tenants, roommates, or property owners requiring administrative resolution.
            </span>
          </div>
          <span className="font-bold">{mockUserReports.length} Active Incident Reports</span>
        </div>

        <div className="classic-card p-0 overflow-hidden">
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Reported Account</th>
                  <th>Complainant</th>
                  <th>Violation Summary</th>
                  <th>Severity</th>
                  <th>Logged Date</th>
                  <th>Resolution Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockUserReports.map((rep) => (
                  <tr key={rep.id}>
                    <td className="font-mono font-bold text-slate-600">{rep.id}</td>
                    <td>
                      <div className="font-bold text-slate-800">{rep.reportedUser}</div>
                      <div className="text-[11px] font-mono text-slate-400">ID: {rep.reportedId}</div>
                    </td>
                    <td className="text-slate-700 text-xs">{rep.reporter}</td>
                    <td className="max-w-xs text-xs text-slate-800">{rep.reason}</td>
                    <td>
                      <span className={`badge-pill ${rep.severity === 'High' ? 'badge-red' : 'badge-yellow'}`}>
                        {rep.severity}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-slate-500">{rep.date}</td>
                    <td>
                      <span className="badge-pill badge-yellow">{rep.status}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button"
                          className="btn-secondary text-[11px] py-1 px-2 text-amber-700 hover:text-amber-800"
                          onClick={() => handleIssueWarning(rep.reportedUser)}
                        >
                          Warn
                        </button>
                        <button 
                          type="button"
                          className="btn-danger text-[11px] py-1 px-2"
                          onClick={() => {
                            const matched = users.find(u => u.id === rep.reportedId);
                            if (matched) handleBlockAction(matched);
                          }}
                        >
                          Suspend
                        </button>
                        <button 
                          type="button"
                          className="btn-secondary text-[11px] py-1 px-2"
                          onClick={() => handleDismissReport(rep.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ================= DEFAULT & SUSPENDED VIEW =================
  const isSuspendedView = activeSubPage === 'suspended_users' || activeSubPage === 'block_unblock';

  return (
    <div className="space-y-3">
      {/* Notice Banner for Suspended view */}
      {isSuspendedView && (
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

      {/* Filter and Search Bar */}
      <div className="filter-toolbar flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="search-input-wrap w-64">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search user name, email, phone, locality..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs"
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
            <option value="Suspended">Suspended Accounts</option>
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
            <option value="All">All User Roles</option>
            <option value="Tenant">Tenants</option>
            <option value="Roommate">Roommate Seekers</option>
            <option value="Family">Family Tenants</option>
          </select>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
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
              <span>Export Selected CSV</span>
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
        <div className="table-container border-0">
          <table className="data-table">
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
                <th>Role & Category</th>
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
                <th className="text-center">Moderation</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => {
                const isSelected = selectedIds.includes(u.id);
                return (
                  <tr key={u.id} className={isSelected ? 'bg-purple-50/50' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(u.id)}
                        className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="font-mono font-bold text-xs text-slate-600">
                      {u.id}
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                          alt={u.name || 'User'} 
                          className="w-8 h-8 rounded-[2px] object-cover border border-slate-300"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-800">{u.name || 'User'}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{u.email || u.mobile || 'Registered'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill badge-blue">{u.role}</span>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{u.mobile}</div>
                    </td>
                    <td className="text-xs text-slate-700">
                      {u.locality}, <span className="text-slate-500">{u.city}</span>
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-slate-800">
                      {u.enquiriesSent} sent
                    </td>
                    <td className="text-center">
                      {u.reportsCount > 0 ? (
                        <span className="badge-pill badge-red inline-flex items-center gap-1" title="Reported violations">
                          <AlertCircle size={10} />
                          <span>{u.reportsCount} Reports</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">0 Clean</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-pill ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          type="button"
                          className="btn-icon p-1 text-slate-600 hover:text-purple-700" 
                          title="View Full User Dossier"
                          onClick={() => setSelectedUser(u)}
                        >
                          <Eye size={13} />
                        </button>

                        <button 
                          type="button"
                          className={`btn-icon p-1 ${u.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-700 hover:bg-emerald-50'}`}
                          title={u.status === 'Active' ? 'Suspend Account' : 'Reactivate User'}
                          onClick={() => handleBlockAction(u)}
                        >
                          {u.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-xs text-slate-400">
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
    </div>
  );
}
