import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Eye, 
  UserX, 
  UserCheck, 
  AlertTriangle,
  FileText,
  FileCheck,
  Phone,
  Mail,
  Home,
  Check,
  X,
  Download,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { confirmApproval, confirmDelete, showToast } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function OwnerManagement({ 
  owners, 
  onSelectKyc, 
  onApproveKyc, 
  onRejectKyc, 
  onToggleBlockOwner,
  activeSubPage = 'all_owners'
}) {
  const [filterKyc, setFilterKyc] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDossierOwner, setSelectedDossierOwner] = useState(owners[0] || null);

  // Sorting state
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Checkbox multi-select state
  const [selectedOwnerIds, setSelectedOwnerIds] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync filter with subpage
  useEffect(() => {
    if (activeSubPage === 'pending_kyc') {
      setFilterKyc('Pending');
    } else if (activeSubPage === 'blocked_owners') {
      setFilterKyc('Blocked');
    } else if (activeSubPage === 'kyc_dossiers') {
      setFilterKyc('Pending');
    } else {
      setFilterKyc('All');
    }
    if (owners.length > 0 && !selectedDossierOwner) {
      setSelectedDossierOwner(owners[0]);
    }
    setCurrentPage(1);
    setSelectedOwnerIds([]);
  }, [activeSubPage, owners]);

  const mockApproveRejectAuditLogs = [
    { id: 'LOG-KYC-01', ownerName: 'Vikramaditya Roy', ownerId: 'OWN-501', decision: 'Approved', documentType: 'UP Registry Deed & PAN', admin: 'Aarav Singhania', date: '2026-09-30 11:20', notes: 'Clear biometric match and certified registry document.' },
    { id: 'LOG-KYC-02', ownerName: 'Sanjay Dixit', ownerId: 'OWN-505', decision: 'Rejected', documentType: 'Electricity Bill', admin: 'Aarav Singhania', date: '2026-09-29 16:45', notes: 'Mismatch between electricity bill consumer name and registered landlord.' },
    { id: 'LOG-KYC-03', ownerName: 'Ananya Deshmukh', ownerId: 'OWN-503', decision: 'Approved', documentType: 'Aadhaar & Registry Deed', admin: 'Priya Narang', date: '2026-09-28 14:10', notes: 'Verified owner of Gomti Nagar residential property.' },
  ];

  const mockOwnerReports = [
    { id: 'REP-OWN-01', ownerName: 'Sanjay Dixit', ownerId: 'OWN-505', reportedBy: 'Aditya Verma (Tenant)', issue: 'Security deposit withholding without valid itemized repair bill', severity: 'High', date: '2026-09-28', status: 'Pending Investigation' },
    { id: 'REP-OWN-02', ownerName: 'Harshvardhan Kapoor', ownerId: 'OWN-502', reportedBy: 'Zaid Khan (Tenant)', issue: 'Delayed water motor repair for 4 consecutive days in PG flat', severity: 'Low', date: '2026-09-27', status: 'Resolved by Mediation' },
  ];

  // Filtering & Sorting
  const filteredOwners = useMemo(() => {
    return owners.filter((o) => {
      let matchesSub = true;
      if (activeSubPage === 'pending_kyc' || activeSubPage === 'kyc_dossiers') matchesSub = o.kycStatus === 'Pending';
      if (activeSubPage === 'blocked_owners') matchesSub = o.status === 'Blocked';

      const matchesKyc = filterKyc === 'All' 
        ? true 
        : filterKyc === 'Blocked' 
          ? o.status === 'Blocked' 
          : o.kycStatus.toLowerCase() === filterKyc.toLowerCase();

      const matchesRole = filterRole === 'All' ? true : o.role.toLowerCase().includes(filterRole.toLowerCase());

      const matchesSearch = 
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.mobile.includes(searchTerm) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSub && matchesKyc && matchesRole && matchesSearch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });
  }, [owners, activeSubPage, filterKyc, filterRole, searchTerm, sortField, sortOrder]);

  const paginatedOwners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOwners.slice(start, start + pageSize);
  }, [filteredOwners, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedOwnerIds.length === paginatedOwners.length && paginatedOwners.length > 0) {
      setSelectedOwnerIds([]);
    } else {
      setSelectedOwnerIds(paginatedOwners.map(o => o.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedOwnerIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleQuickApprove = async (owner) => {
    const confirmed = await confirmApproval(
      `Approve KYC for ${owner.name}?`,
      `Verified Owner trust badge will be granted across all listings.`
    );
    if (confirmed) {
      onApproveKyc(owner.id, "Fast-track approved via Owner Management");
    }
  };

  const handleQuickReject = async (owner) => {
    const confirmed = await confirmDelete(
      `Reject KYC for ${owner.name}?`,
      `Owner will be prompted to re-upload clear government proof.`
    );
    if (confirmed) {
      onRejectKyc(owner.id, "Documents unclear or information mismatch.");
    }
  };

  const handleExportCsv = (data = filteredOwners, filename = 'Landlords_Directory') => {
    const cols = [
      { label: 'Owner ID', accessor: 'id' },
      { label: 'Full Name', accessor: 'name' },
      { label: 'Mobile Number', accessor: 'mobile' },
      { label: 'Email Address', accessor: 'email' },
      { label: 'Landlord Type', accessor: 'role' },
      { label: 'Listings Count', accessor: 'propertiesCount' },
      { label: 'KYC Status', accessor: 'kycStatus' },
      { label: 'Account Status', accessor: 'status' },
      { label: 'Registration Date', accessor: 'createdAt' }
    ];
    exportToCsv(filename, data, cols);
    showToast(`Exported ${data.length} landlord records to CSV.`, 'info');
  };

  // Bulk Approve KYC
  const handleBulkApproveKyc = async () => {
    if (selectedOwnerIds.length === 0) return;
    const confirmed = await confirmApproval(
      `Bulk Approve ${selectedOwnerIds.length} Landlords?`,
      `Verified Owner trust badges will be granted to all selected accounts.`
    );
    if (confirmed) {
      selectedOwnerIds.forEach(id => onApproveKyc(id, "Bulk approved by administrator"));
      showToast(`${selectedOwnerIds.length} landlords verified.`, 'success');
      setSelectedOwnerIds([]);
    }
  };

  // ================= VIEW 1: KYC DOSSIERS AUDIT =================
  if (activeSubPage === 'kyc_dossiers') {
    return (
      <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-140px)]">
        {/* Left Side: Owner Selector */}
        <div className="col-span-4 classic-card p-0 flex flex-col h-full">
          <div className="p-3 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">KYC Dossier Applications</span>
            <span className="text-[11px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-[2px] border border-purple-200">
              {owners.filter(o => o.kycStatus === 'Pending').length} Pending
            </span>
          </div>

          <div className="p-2 border-b border-slate-200">
            <div className="search-input-wrap w-full">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter owner dossiers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-200 max-h-[620px]">
            {filteredOwners.map((o) => (
              <div 
                key={o.id}
                onClick={() => setSelectedDossierOwner(o)}
                className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedDossierOwner?.id === o.id ? 'bg-purple-50 border-l-4 border-l-purple-700' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{o.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{o.mobile}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{o.role} • {o.propertiesCount} listings</div>
                </div>
                <span className={`badge-pill text-[10px] ${o.kycStatus === 'Verified' ? 'badge-green' : 'badge-yellow'}`}>
                  {o.kycStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Owner Dossier Quick Inspector */}
        <div className="col-span-8 space-y-4">
          {selectedDossierOwner ? (
            <div className="classic-card p-4 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedDossierOwner.name}</h2>
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-[2px] border border-slate-300">
                      {selectedDossierOwner.id}
                    </span>
                    <span className={`badge-pill ${selectedDossierOwner.kycStatus === 'Verified' ? 'badge-green' : 'badge-yellow'}`}>
                      {selectedDossierOwner.kycStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Contact: <strong className="text-slate-800">{selectedDossierOwner.mobile}</strong> • Email: <strong className="text-slate-800">{selectedDossierOwner.email}</strong>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => onSelectKyc(selectedDossierOwner)}
                  className="btn-primary flex items-center gap-1.5"
                >
                  <Eye size={13} />
                  <span>Open Full KYC Inspector</span>
                </button>
              </div>

              {/* Submitted Docs Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px]">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">UIDAI Aadhaar</span>
                  <span className="font-mono font-bold text-xs text-slate-800 mt-1 block">
                    {selectedDossierOwner.documents?.aadhaar || '4521-8890-3412'}
                  </span>
                  <span className="badge-pill badge-green text-[10px] mt-2">✓ OTP Matched</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px]">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Income Tax PAN</span>
                  <span className="font-mono font-bold text-xs text-slate-800 mt-1 block">
                    {selectedDossierOwner.documents?.pan || 'ACUPR3498L'}
                  </span>
                  <span className="badge-pill badge-green text-[10px] mt-2">✓ ITD Validated</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px]">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Registry / Title Deed</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block truncate">
                    {selectedDossierOwner.documents?.registry || 'LDA Sale Deed (Book 1)'}
                  </span>
                  <span className="badge-pill badge-green text-[10px] mt-2">✓ Municipal Stamp</span>
                </div>
              </div>

              {/* Quick Actions */}
              {selectedDossierOwner.kycStatus === 'Pending' && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-[2px] flex items-center justify-between">
                  <div className="text-xs text-amber-900">
                    <strong>Pending Verification:</strong> Review documents or fast-track decision:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickReject(selectedDossierOwner)}
                      className="btn-danger text-xs py-1 px-2.5"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(selectedDossierOwner)}
                      className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-xs py-1 px-2.5"
                    >
                      Approve & Grant Badge
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="classic-card p-8 text-center text-slate-400 text-xs">
              Select an owner application from the left list.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= DEFAULT & PENDING KYC VIEW =================
  return (
    <div className="space-y-3">
      {/* Pending notice */}
      {activeSubPage === 'pending_kyc' && (
        <div className="bg-amber-50 border border-amber-300 rounded-[2px] p-2.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-700" />
            <span>
              <strong>Owner KYC Queue:</strong> Review government Aadhaar/PAN scans and LDA registry deeds to grant verified badges.
            </span>
          </div>
          <span className="font-bold">{filteredOwners.length} Pending Landlords</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="filter-toolbar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="search-input-wrap w-64">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search owner by name, mobile, ID..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs"
            />
          </div>

          <select 
            className="filter-select-input text-xs"
            value={filterKyc}
            onChange={(e) => {
              setFilterKyc(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Verification Statuses</option>
            <option value="Pending">Pending Verification Only</option>
            <option value="Verified">Verified Owners Only</option>
            <option value="Blocked">Blocked Landlords</option>
          </select>

          <select 
            className="filter-select-input text-xs"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Landlord Types</option>
            <option value="Direct Owner">Direct Owners</option>
            <option value="Broker">Brokers / Agents</option>
            <option value="Commercial">Commercial Owners</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => handleExportCsv(filteredOwners)}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Download CSV of filtered landlords"
          >
            <Download size={13} />
            <span>Export Landlords CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedOwnerIds.length > 0 && (
        <div className="bg-purple-50 border border-purple-300 p-2.5 rounded-[2px] flex items-center justify-between text-xs text-purple-950 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-purple-700 text-white px-2 py-0.5 rounded-[2px] font-mono text-[11px]">
              {selectedOwnerIds.length} Landlords Selected
            </span>
            <span>Bulk actions applicable to checked accounts:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkApproveKyc}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <CheckCircle size={12} />
              <span>Bulk Approve KYC</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const sel = owners.filter(o => selectedOwnerIds.includes(o.id));
                handleExportCsv(sel, 'Selected_Landlords');
              }}
              className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <Download size={12} />
              <span>Export Selected CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedOwnerIds([])}
              className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="classic-card p-0 overflow-hidden">
        <div className="table-container border-0">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOwnerIds.length === paginatedOwners.length && paginatedOwners.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th onClick={() => handleSort('id')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>Owner ID</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>Landlord Information</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th>Contact Details</th>
                <th>Landlord Type</th>
                <th onClick={() => handleSort('propertiesCount')} className="cursor-pointer select-none text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Listings</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th className="text-center">Trust Badge & KYC</th>
                <th className="text-center">Account Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOwners.map((o) => {
                const isSelected = selectedOwnerIds.includes(o.id);
                return (
                  <tr key={o.id} className={isSelected ? 'bg-purple-50/50' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(o.id)}
                        className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="font-mono font-bold text-xs text-slate-600">{o.id}</td>
                    <td>
                      <div className="font-bold text-xs text-slate-900">{o.name}</div>
                      <div className="text-[11px] text-slate-400">Registered: {o.createdAt}</div>
                    </td>
                    <td>
                      <div className="font-mono text-xs text-slate-800">{o.mobile}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{o.email}</div>
                    </td>
                    <td>
                      <span className="badge-pill badge-purple">{o.role}</span>
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-slate-800">
                      {o.propertiesCount} listings
                    </td>
                    <td className="text-center">
                      <span className={`badge-pill ${
                        o.kycStatus === 'Verified' ? 'badge-green' :
                        o.kycStatus === 'Pending' ? 'badge-yellow' : 'badge-red'
                      }`}>
                        {o.kycStatus === 'Verified' && <ShieldCheck size={11} />}
                        {o.kycStatus === 'Pending' && <ShieldAlert size={11} />}
                        <span>{o.kycStatus}</span>
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge-pill ${o.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          type="button"
                          className="btn-icon p-1 text-slate-600 hover:text-purple-700" 
                          title="Inspect Full KYC Dossier"
                          onClick={() => onSelectKyc(o)}
                        >
                          <Eye size={13} />
                        </button>

                        {o.kycStatus === 'Pending' && (
                          <>
                            <button 
                              type="button"
                              className="btn-icon p-1 text-emerald-700 hover:bg-emerald-50" 
                              title="Approve KYC"
                              onClick={() => handleQuickApprove(o)}
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button 
                              type="button"
                              className="btn-icon p-1 text-red-600 hover:bg-red-50" 
                              title="Reject KYC"
                              onClick={() => handleQuickReject(o)}
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}

                        <button 
                          type="button"
                          className={`btn-icon p-1 ${o.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-700 hover:bg-emerald-50'}`}
                          title={o.status === 'Active' ? 'Block Landlord' : 'Unblock Landlord'}
                          onClick={() => onToggleBlockOwner(o.id)}
                        >
                          {o.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedOwners.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-xs text-slate-400">
                    No landlord records found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          totalItems={filteredOwners.length}
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
