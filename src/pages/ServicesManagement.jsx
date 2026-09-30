import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Wrench, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Phone,
  Layers,
  FileCheck,
  AlertTriangle,
  Check,
  X,
  Download,
  ArrowUpDown,
  UserCheck,
  UserX,
  Plus,
  Briefcase
} from 'lucide-react';
import { showToast, confirmDelete } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';
import { bachelorCategories, initialServiceComplaints } from '../data/mockData';

export default function ServicesManagement({ services, onToggleServiceStatus, activeSubPage = 'all_providers' }) {
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState(initialServiceComplaints);
  const [categories, setCategories] = useState(bachelorCategories);

  // Sorting state
  const [sortField, setSortField] = useState('orders');
  const [sortOrder, setSortOrder] = useState('desc');

  // Checkbox multi-select state
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [verificationQueue, setVerificationQueue] = useState([
    { id: 'VER-SRV-01', provider: 'Suresh Kashyap (SpeedyWash)', category: 'Laundry', phone: '+91 94150 22334', aadhar: 'Aadhaar Verified', policeCheck: 'Cleared (Lucknow City Police)', status: 'Pending Approval' },
    { id: 'VER-SRV-02', provider: 'Manoj Tiwari (Annapurna Tiffin)', category: 'Tiffin / Mess', phone: '+91 98399 11001', aadhar: 'Aadhaar Verified', policeCheck: 'FSSAI License #21098271 Attached', status: 'Pending Approval' }
  ]);

  // Filtering & Sorting
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCat = filterCat === 'All' || s.category.toLowerCase().includes(filterCat.toLowerCase());
      const matchesStatus = filterStatus === 'All' || (filterStatus === 'Active' ? s.status === 'Active' : s.status !== 'Active');
      const matchesSearch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesStatus && matchesSearch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });
  }, [services, filterCat, filterStatus, searchTerm, sortField, sortOrder]);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedServiceIds.length === paginatedServices.length && paginatedServices.length > 0) {
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(paginatedServices.map(s => s.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportCsv = (data = filteredServices, filename = 'Service_Partners_Directory') => {
    const cols = [
      { label: 'Service ID', accessor: 'id' },
      { label: 'Business / Service Name', accessor: 'name' },
      { label: 'Category', accessor: 'category' },
      { label: 'Lead Contact', accessor: 'provider' },
      { label: 'Phone', accessor: 'phone' },
      { label: 'Base Pricing', accessor: 'priceStarts' },
      { label: 'Jobs Completed', accessor: 'orders' },
      { label: 'Rating', accessor: 'rating' },
      { label: 'Complaints', accessor: 'complaints' },
      { label: 'Status', accessor: 'status' }
    ];
    exportToCsv(filename, data, cols);
    showToast(`Exported ${data.length} service partners to CSV.`, 'info');
  };

  const handleResolveComplaint = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    showToast('Customer complaint marked as resolved.', 'success');
  };

  const handleApproveProvider = (item) => {
    setVerificationQueue(prev => prev.filter(v => v.id !== item.id));
    showToast(`Partner "${item.provider}" verified and published live!`, 'success');
  };

  const handleTogglePartnerStatus = async (service) => {
    const isDeactivating = service.status === 'Active';
    const confirmed = await confirmDelete(
      isDeactivating ? `Suspend Partner ${service.name}?` : `Reactivate Partner ${service.name}?`,
      isDeactivating 
        ? `This partner will be hidden from the BachelorHub service directory.`
        : `Partner listing will be restored with live lead dispatch.`
    );
    if (confirmed) {
      onToggleServiceStatus(service.id);
      showToast(isDeactivating ? `Partner suspended.` : `Partner reactivated.`, isDeactivating ? 'warning' : 'success');
    }
  };

  // ================= VIEW 1: 9 BACHELOR SERVICE CATEGORIES =================
  if (activeSubPage === 'categories') {
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-300 rounded-[2px] p-3 text-xs text-purple-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-purple-700" />
            <span>
              <strong>9 Bachelor Essential Service Verticals:</strong> Matching the platform architecture specification. Standard fees and lead commission take-rates.
            </span>
          </div>
          <span className="font-bold">9 Core Verticals Active</span>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          {categories.map((cat) => (
            <div key={cat.id} className="classic-card p-3.5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-[2px] border border-slate-300">
                    {cat.id}
                  </span>
                  <span className="badge-pill badge-green text-[10px]">{cat.status}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                
                <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-50 border border-slate-300 rounded-[2px] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Providers</span>
                    <span className="font-bold text-slate-800">{cat.providersCount} Partners</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Platform Take</span>
                    <span className="font-bold text-purple-700 font-mono">{cat.commission}</span>
                  </div>
                  <div className="col-span-2 pt-1.5 border-t border-slate-200">
                    <span className="text-[10px] text-slate-500">Benchmark Rate: </span>
                    <strong className="text-emerald-700 font-semibold">{cat.standardFee}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Demand: High</span>
                <button
                  type="button"
                  onClick={() => showToast(`Lead settings for "${cat.name}" updated.`, 'info')}
                  className="btn-secondary text-[11px] py-0.5 px-2"
                >
                  Configure Rates
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= VIEW 2: PROVIDER VERIFICATION QUEUE =================
  if (activeSubPage === 'service_verification') {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-300 rounded-[2px] p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck size={16} className="text-amber-700" />
            <span>
              <strong>Service Provider Verification Queue:</strong> Check ID proofs, police background verification, and FSSAI/trade licenses before granting lead access.
            </span>
          </div>
          <span className="font-bold">{verificationQueue.length} Pending Approval</span>
        </div>

        <div className="classic-card p-0 overflow-hidden">
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Technician / Business Name</th>
                  <th>Category</th>
                  <th>Contact Phone</th>
                  <th>Identity Proof</th>
                  <th>Police / Legal Clearances</th>
                  <th className="text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {verificationQueue.map((v) => (
                  <tr key={v.id}>
                    <td className="font-mono font-bold text-xs text-slate-600">{v.id}</td>
                    <td className="font-bold text-xs text-slate-800">{v.provider}</td>
                    <td>
                      <span className="badge-pill badge-purple">{v.category}</span>
                    </td>
                    <td className="font-mono text-xs text-slate-700">{v.phone}</td>
                    <td>
                      <span className="badge-pill badge-blue">✓ {v.aadhar}</span>
                    </td>
                    <td className="text-xs text-slate-700">{v.policeCheck}</td>
                    <td className="text-right">
                      <button 
                        type="button"
                        className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                        onClick={() => handleApproveProvider(v)}
                      >
                        <Check size={12} />
                        <span>Approve Partner</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {verificationQueue.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-xs text-slate-400">
                      All service partner applications have been reviewed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW 3: SERVICE COMPLAINTS & DISPUTES =================
  if (activeSubPage === 'service_complaints') {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-300 rounded-[2px] p-3 text-xs text-red-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-700" />
            <span>
              <strong>Customer Service Grievances & Disputes:</strong> Track tenant grievances regarding service delays, overcharging, or damage to personal belongings.
            </span>
          </div>
          <span className="font-bold">{complaints.length} Disputes Logged</span>
        </div>

        <div className="classic-card p-0 overflow-hidden">
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Service Provider</th>
                  <th>Complainant (Tenant)</th>
                  <th>Issue Details</th>
                  <th>Date Filed</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold text-xs text-slate-600">{c.id}</td>
                    <td className="font-bold text-xs text-slate-800">{c.service}</td>
                    <td className="text-xs text-slate-700">{c.customer}</td>
                    <td className="text-xs text-slate-800 max-w-sm">{c.issue}</td>
                    <td className="font-mono text-xs text-slate-500">{c.date}</td>
                    <td>
                      <span className={`badge-pill ${c.status.includes('Resolved') ? 'badge-green' : 'badge-yellow'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {!c.status.includes('Resolved') ? (
                        <button 
                          type="button"
                          className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-[11px] py-1 px-2.5"
                          onClick={() => handleResolveComplaint(c.id)}
                        >
                          Resolve & Clear
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1">
                          <CheckCircle size={12} />
                          <span>Resolved</span>
                        </span>
                      )}
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

  // ================= DEFAULT VIEW: ALL SERVICE PROVIDERS =================
  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="filter-toolbar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="search-input-wrap w-64">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search partner, service, category..." 
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
            value={filterCat}
            onChange={(e) => {
              setFilterCat(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All 9 Service Verticals</option>
            <option value="Tiffin">Tiffin / Mess</option>
            <option value="Laundry">Laundry & Dry Clean</option>
            <option value="Maid">Maid & Domestic Helpers</option>
            <option value="Cleaning">Deep Home Cleaning</option>
            <option value="Electrician">Electrician & AC Repair</option>
            <option value="Plumber">Plumber & Sanitary</option>
            <option value="Packers">Packers & Movers</option>
          </select>

          <select
            className="filter-select-input text-xs"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Partner Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => handleExportCsv(filteredServices)}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Download CSV of filtered service partners"
          >
            <Download size={13} />
            <span>Export Partners CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedServiceIds.length > 0 && (
        <div className="bg-purple-50 border border-purple-300 p-2.5 rounded-[2px] flex items-center justify-between text-xs text-purple-950 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-purple-700 text-white px-2 py-0.5 rounded-[2px] font-mono text-[11px]">
              {selectedServiceIds.length} Partners Selected
            </span>
            <span>Bulk actions applicable to checked partners:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const sel = services.filter(s => selectedServiceIds.includes(s.id));
                handleExportCsv(sel, 'Selected_Service_Partners');
              }}
              className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <Download size={12} />
              <span>Export Selected CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedServiceIds([])}
              className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Partners Table */}
      <div className="classic-card p-0 overflow-hidden">
        <div className="table-container border-0">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.length === paginatedServices.length && paginatedServices.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th onClick={() => handleSort('id')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>Service ID</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>Business / Provider Name</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th>Category</th>
                <th>Primary Contact</th>
                <th>Starting Fee</th>
                <th onClick={() => handleSort('orders')} className="cursor-pointer select-none text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Completed Jobs</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('rating')} className="cursor-pointer select-none text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Rating</span>
                    <ArrowUpDown size={11} className="text-slate-400" />
                  </div>
                </th>
                <th className="text-center">Verification</th>
                <th className="text-center">Moderation</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((s) => {
                const isSelected = selectedServiceIds.includes(s.id);
                return (
                  <tr key={s.id} className={isSelected ? 'bg-purple-50/50' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(s.id)}
                        className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="font-mono font-bold text-xs text-slate-600">{s.id}</td>
                    <td>
                      <div className="font-bold text-xs text-slate-900">{s.name}</div>
                    </td>
                    <td>
                      <span className="badge-pill badge-purple">{s.category}</span>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800 font-medium">{s.provider}</div>
                      <div className="text-[11px] font-mono text-slate-500">{s.phone}</div>
                    </td>
                    <td className="font-mono font-bold text-xs text-emerald-700">
                      {s.priceStarts}
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-slate-800">
                      {s.orders} jobs
                    </td>
                    <td className="text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-xs text-amber-600">
                        <Star size={12} fill="#d97706" />
                        <span>{s.rating}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      {s.verified ? (
                        <span className="badge-pill badge-green text-[10px]">✓ Verified</span>
                      ) : (
                        <span className="badge-pill badge-yellow text-[10px]">Unverified</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button 
                        type="button"
                        onClick={() => handleTogglePartnerStatus(s)}
                        className={`text-[11px] px-2.5 py-0.5 font-semibold rounded-[2px] border transition-colors ${
                          s.status === 'Active'
                            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                            : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {s.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedServices.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-xs text-slate-400">
                    No service partners found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          totalItems={filteredServices.length}
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
