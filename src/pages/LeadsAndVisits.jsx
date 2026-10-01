import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Phone, 
  CheckCircle, 
  Clock, 
  XCircle, 
  User, 
  Download, 
  MapPin, 
  Sparkles,
  Calendar,
  Check,
  X,
  Trash2
} from 'lucide-react';
import { showToast, confirmDelete } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function LeadsAndVisits({ visits = [], onUpdateVisitStatus, onDeleteVisit, activeSubPage = 'all_visits' }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [leadTypeFilter, setLeadTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync subPage to statusFilter
  React.useEffect(() => {
    if (activeSubPage === 'confirmed_visits') setStatusFilter('Confirmed');
    else if (activeSubPage === 'completed_visits') setStatusFilter('Completed');
    else setStatusFilter('All');
  }, [activeSubPage]);

  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchesStatus = statusFilter === 'All' ? true : v.status === statusFilter;
      const matchesType = leadTypeFilter === 'All' ? true : v.leadType === leadTypeFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        (v.visitorName || '').toLowerCase().includes(term) ||
        (v.propertyTitle || '').toLowerCase().includes(term) ||
        (v.ownerName || '').toLowerCase().includes(term) ||
        (v.visitorPhone || '').includes(term) ||
        (v.locality || '').toLowerCase().includes(term) ||
        (v.customId || v.id || '').toLowerCase().includes(term);
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [visits, statusFilter, leadTypeFilter, searchTerm]);

  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVisits.slice(start, start + pageSize);
  }, [filteredVisits, currentPage, pageSize]);

  const handleExportCsv = () => {
    const cols = [
      { label: 'Booking ID', accessor: 'customId' },
      { label: 'Property Title', accessor: 'propertyTitle' },
      { label: 'Locality', accessor: 'locality' },
      { label: 'Visitor Name', accessor: 'visitorName' },
      { label: 'Visitor Phone', accessor: 'visitorPhone' },
      { label: 'Assigned Owner', accessor: 'ownerName' },
      { label: 'Slot Date', accessor: 'slotDate' },
      { label: 'Slot Time', accessor: 'slotTime' },
      { label: 'Lead Type', accessor: 'leadType' },
      { label: 'Pass Code', accessor: 'passCode' },
      { label: 'Status', accessor: 'status' }
    ];
    exportToCsv('Property_Site_Visits_Leads', filteredVisits, cols);
    showToast(`Exported ${filteredVisits.length} site visit bookings to CSV.`, 'info');
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmed = await confirmDelete(
      `Update Visit Status to "${newStatus}"?`,
      `The booking pass status will be electronically updated for both tenant and landlord.`
    );
    if (confirmed && onUpdateVisitStatus) {
      onUpdateVisitStatus(id, newStatus);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete(
      `Delete Visit Booking ${id}?`,
      `Are you sure you want to permanently remove this visit record from database?`
    );
    if (confirmed && onDeleteVisit) {
      onDeleteVisit(id);
    }
  };

  const confirmedCount = visits.filter(v => v.status === 'Confirmed').length;
  const completedCount = visits.filter(v => v.status === 'Completed').length;
  const pendingCount = visits.filter(v => v.status === 'Pending').length;

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Site Visits</span>
            <div className="w-7 h-7 rounded-[2px] bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <CalendarCheck size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{visits.length} Bookings</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            MongoDB Atlas Live Sync
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Confirmed Slots</span>
            <div className="w-7 h-7 rounded-[2px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{confirmedCount} Active Slots</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Digital visit passes issued
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Site Visits</span>
            <div className="w-7 h-7 rounded-[2px] bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Clock size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{completedCount} Visited</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            Converted to tenant reviews
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Landlord Confirmation</span>
            <div className="w-7 h-7 rounded-[2px] bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Calendar size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{pendingCount} Awaiting Response</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Auto-escalated in 2 hrs
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-300 rounded-[2px] shadow-2xs">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search visitor, phone, locality, property..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input-field text-xs pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded-[2px]"
            />
          </div>

          <select 
            className="filter-select-input text-xs border border-slate-300 rounded-[2px] py-1.5 px-2 bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Visit Statuses</option>
            <option value="Confirmed">Confirmed Slots</option>
            <option value="Completed">Completed Visits</option>
            <option value="Pending">Pending Confirmation</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select 
            className="filter-select-input text-xs border border-slate-300 rounded-[2px] py-1.5 px-2 bg-white"
            value={leadTypeFilter}
            onChange={(e) => {
              setLeadTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Lead Types</option>
            <option value="Direct Bachelor">Direct Bachelor</option>
            <option value="Family / Couple">Family / Couple</option>
            <option value="Corporate Tenant">Corporate Tenant</option>
            <option value="Buyer / Investor">Buyer / Investor</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handleExportCsv}
            className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3 border border-slate-300 rounded-[2px] bg-white hover:bg-slate-50 text-slate-700"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Visits Table */}
      <div className="classic-card p-0 overflow-hidden">
        <div className="table-container border-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Target Property</th>
                <th>Visitor Contact</th>
                <th>Assigned Owner</th>
                <th>Scheduled Slot</th>
                <th>Lead Type</th>
                <th>Pass Code</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVisits.map((v) => {
                const visitId = v.customId || v.id || v._id;
                return (
                  <tr key={visitId}>
                    <td className="font-mono text-xs font-bold text-purple-700">
                      {visitId}
                    </td>
                    <td>
                      <div className="font-bold text-xs text-slate-800">{v.propertyTitle}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-slate-400" />
                        <span>{v.locality}, {v.city || 'Lucknow'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-slate-800">{v.visitorName}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Phone size={10} className="text-slate-400" />
                        <span>{v.visitorPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-slate-800">{v.ownerName}</div>
                      {v.ownerPhone && (
                        <div className="text-[10px] text-slate-400 font-mono">{v.ownerPhone}</div>
                      )}
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-800">{v.slotDate}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{v.slotTime}</div>
                    </td>
                    <td>
                      <span className="badge-pill badge-purple text-[10px]">{v.leadType}</span>
                    </td>
                    <td>
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-[2px] border border-slate-300 font-semibold">
                        {v.passCode || 'PH-VIS'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-pill text-[10px] ${
                        v.status === 'Confirmed' ? 'badge-green' :
                        v.status === 'Completed' ? 'badge-blue' :
                        v.status === 'Cancelled' ? 'badge-red' : 'badge-yellow'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {v.status !== 'Completed' && (
                          <button
                            type="button"
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-[2px] border border-emerald-300"
                            title="Mark Visit as Completed"
                            onClick={() => handleStatusChange(visitId, 'Completed')}
                          >
                            <CheckCircle size={13} />
                          </button>
                        )}
                        {v.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded-[2px] border border-rose-300"
                            title="Cancel Booking"
                            onClick={() => handleStatusChange(visitId, 'Cancelled')}
                          >
                            <XCircle size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded-[2px] border border-slate-200"
                          title="Purge Record"
                          onClick={() => handleDelete(visitId)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedVisits.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-xs text-slate-400">
                    No site visits found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination 
          totalItems={filteredVisits.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
