import React, { useState, useMemo } from 'react';
import { 
  Users2, 
  Search, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Tag, 
  Heart, 
  Phone, 
  Briefcase, 
  Download,
  Trash2,
  Filter,
  Check,
  UserCheck
} from 'lucide-react';
import { showToast, confirmDelete } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function RoommateManagement({ 
  roommates = [], 
  onUpdateRoommateStatus, 
  onDeleteRoommate,
  activeSubPage = 'all_roommates' 
}) {
  const [filterGender, setFilterGender] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Sync subPage to filterGender
  React.useEffect(() => {
    if (activeSubPage === 'male_roommates') setFilterGender('Male');
    else if (activeSubPage === 'female_roommates') setFilterGender('Female');
    else setFilterGender('All');
  }, [activeSubPage]);

  const filteredRoommates = useMemo(() => {
    return roommates.filter((rm) => {
      const matchesGender = filterGender === 'All' ? true : rm.gender === filterGender || (rm.lookingFor || '').includes(filterGender);
      const matchesStatus = filterStatus === 'All' ? true : rm.status === filterStatus;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        (rm.userName || '').toLowerCase().includes(term) ||
        (rm.targetLocality || '').toLowerCase().includes(term) ||
        (rm.profession || '').toLowerCase().includes(term) ||
        (rm.lookingFor || '').toLowerCase().includes(term) ||
        (rm.phone || '').includes(term) ||
        (rm.customId || rm.id || '').toLowerCase().includes(term);
      return matchesGender && matchesStatus && matchesSearch;
    });
  }, [roommates, filterGender, filterStatus, searchTerm]);

  const paginatedRoommates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRoommates.slice(start, start + pageSize);
  }, [filteredRoommates, currentPage, pageSize]);

  const handleExportCsv = () => {
    const cols = [
      { label: 'Request ID', accessor: 'customId' },
      { label: 'Name', accessor: 'userName' },
      { label: 'Gender', accessor: 'gender' },
      { label: 'Seeking', accessor: 'lookingFor' },
      { label: 'Budget (INR/mo)', accessor: 'budget' },
      { label: 'Target Locality', accessor: 'targetLocality' },
      { label: 'Profession', accessor: 'profession' },
      { label: 'Contact Phone', accessor: 'phone' },
      { label: 'Status', accessor: 'status' }
    ];
    exportToCsv('Roommate_CoLiving_Requests', filteredRoommates, cols);
    showToast(`Exported ${filteredRoommates.length} roommate requests to CSV.`, 'info');
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmed = await confirmDelete(
      `Set Roommate Post to "${newStatus}"?`,
      `This will update the visibility of this co-living request on the BachelorHub mobile app.`
    );
    if (confirmed && onUpdateRoommateStatus) {
      onUpdateRoommateStatus(id, newStatus);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete(
      `Delete Roommate Listing ${id}?`,
      `Are you sure you want to permanently delete this co-living post from database?`
    );
    if (confirmed && onDeleteRoommate) {
      onDeleteRoommate(id);
    }
  };

  const maleCount = roommates.filter(r => r.gender === 'Male' || (r.lookingFor || '').includes('Male')).length;
  const femaleCount = roommates.filter(r => r.gender === 'Female' || (r.lookingFor || '').includes('Female')).length;
  const avgBudget = roommates.length > 0 
    ? Math.round(roommates.reduce((s, r) => s + (r.budget || 0), 0) / roommates.length)
    : 6500;

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Co-Living Requests</span>
            <div className="w-7 h-7 rounded-[2px] bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Users2 size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{roommates.length} Posts</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            MongoDB Live Active Pool
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Male Flatmate Requests</span>
            <div className="w-7 h-7 rounded-[2px] bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <UserCheck size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{maleCount} Profiles</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            Lucknow IT & Coaching Hubs
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Female Flatmate Requests</span>
            <div className="w-7 h-7 rounded-[2px] bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <Heart size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{femaleCount} Profiles</div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">
            Gated Societies Only
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Budget Share</span>
            <div className="w-7 h-7 rounded-[2px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Tag size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">₹ {avgBudget.toLocaleString('en-IN')}/mo</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Per person room split
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
              placeholder="Search roommate by name, profession, locality..." 
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
            value={filterGender}
            onChange={(e) => {
              setFilterGender(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Roommate Preferences</option>
            <option value="Male">Looking for Male Flatmate</option>
            <option value="Female">Looking for Female Flatmate</option>
          </select>

          <select 
            className="filter-select-input text-xs border border-slate-300 rounded-[2px] py-1.5 px-2 bg-white"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended / Hidden</option>
            <option value="Found Match">Found Match</option>
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

      {/* Roommates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {paginatedRoommates.map((rm) => {
          const rmId = rm.customId || rm.id || rm._id;
          return (
            <div key={rmId} className="classic-card p-4 flex flex-col justify-between space-y-3 hover:border-purple-300 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={rm.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'} 
                      alt={rm.userName} 
                      className="w-10 h-10 rounded-full object-cover border border-purple-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{rm.userName}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Briefcase size={10} className="text-slate-400" />
                        <span>{rm.profession}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`badge-pill text-[10px] ${rm.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>
                    {rm.status}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-[2px] p-2.5 mt-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Budget Share</span>
                    <span className="font-bold text-emerald-700 text-xs">
                      ₹ {(rm.budget || 0).toLocaleString('en-IN')} / mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin size={11} className="text-purple-600" />
                      <span>{rm.targetLocality}, {rm.city || 'Lucknow'}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{rm.phone}</span>
                  </div>
                </div>

                {rm.bio && (
                  <p className="text-[11px] text-slate-600 italic mt-2.5 line-clamp-2 leading-relaxed bg-white p-1 rounded-[2px]">
                    "{rm.bio}"
                  </p>
                )}

                {/* Lifestyle Tags */}
                {rm.tags && rm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {rm.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-[2px] border border-purple-200 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">
                  Seeking: <strong className="text-slate-800">{rm.lookingFor}</strong>
                </span>

                <div className="flex items-center gap-1">
                  {rm.status !== 'Active' ? (
                    <button 
                      type="button" 
                      className="btn-primary text-[10px] py-1 px-2 bg-emerald-700 hover:bg-emerald-800 border-emerald-800 inline-flex items-center gap-1"
                      onClick={() => handleStatusChange(rmId, 'Active')}
                    >
                      <CheckCircle size={11} />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-secondary text-[10px] py-1 px-2 text-rose-700 hover:bg-rose-50 border-rose-300 inline-flex items-center gap-1"
                      onClick={() => handleStatusChange(rmId, 'Suspended')}
                    >
                      <XCircle size={11} />
                      <span>Take Down</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-[2px]"
                    title="Delete Post"
                    onClick={() => handleDelete(rmId)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {paginatedRoommates.length === 0 && (
          <div className="col-span-full text-center py-12 text-xs text-slate-400 classic-card">
            No roommate co-living requests found matching your filter criteria.
          </div>
        )}
      </div>

      <div className="classic-card p-0 overflow-hidden">
        <TablePagination 
          totalItems={filteredRoommates.length}
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
