import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trash2, 
  Copy, 
  AlertTriangle, 
  Grid, 
  List,
  MapPin,
  FileCheck,
  FileText,
  ShieldCheck,
  Check,
  X,
  ArrowUpDown,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';
import { confirmApproval, confirmDelete, showToast } from '../utils/alerts';
import { initialDuplicatePairs } from '../data/mockData';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

const FALLBACK_PROPERTY_IMG = 'https://placehold.co/800x600/f8fafc/64748b?text=No+Photo+Uploaded';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://property-hub-backend-j0ea.onrender.com';

const resolveImgUrl = (url) => {
  if (!url || typeof url !== 'string') return FALLBACK_PROPERTY_IMG;
  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_PROPERTY_IMG;
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('file:') || trimmed.includes(':\\') || trimmed.startsWith('/data/') || trimmed.startsWith('/storage/')) {
    return FALLBACK_PROPERTY_IMG;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return trimmed.startsWith('/') ? `${API_BASE}${trimmed}` : `${API_BASE}/${trimmed}`;
};

export default function PropertyManagement({ 
  properties, 
  onSelectProperty, 
  onUpdateStatus, 
  onToggleFeatured, 
  onDeleteProperty, 
  onAddNewClick,
  activeSubPage = 'all_properties'
}) {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Sorting, Pagination & Bulk Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (activeSubPage === 'pending_properties') setActiveSubTab('pending');
    else if (activeSubPage === 'duplicate_check') setActiveSubTab('duplicates');
    else if (activeSubPage === 'reported_properties') setActiveSubTab('reported');
    else if (activeSubPage === 'suspended_properties') setActiveSubTab('suspended');
    else if (activeSubPage === 'property_docs') setActiveSubTab('docs');
    else setActiveSubTab('all');
    setCurrentPage(1);
  }, [activeSubPage]);

  const filtered = properties.filter((p) => {
    let matchesTab = true;
    if (activeSubTab === 'pending') matchesTab = p.status === 'Pending Verification';
    if (activeSubTab === 'duplicates') matchesTab = p.isDuplicate;
    if (activeSubTab === 'reported') matchesTab = p.reportsCount > 0;
    if (activeSubTab === 'suspended') matchesTab = p.status === 'Suspended';
    if (activeSubTab === 'docs') matchesTab = true;

    const matchesType = typeFilter === 'All' || (p.type || '').toLowerCase() === typeFilter.toLowerCase();
    const matchesSearch = 
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.locality || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesType && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === 'price') {
      return ((a.price || 0) - (b.price || 0)) * (sortOrder === 'asc' ? 1 : -1);
    }
    if (typeof aVal === 'string') {
      return (aVal || '').localeCompare(bVal || '') * (sortOrder === 'asc' ? 1 : -1);
    }
    return ((aVal || 0) - (bVal || 0)) * (sortOrder === 'asc' ? 1 : -1);
  });

  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    selectedIds.forEach(id => onUpdateStatus(id, 'Active'));
    showToast(`${selectedIds.length} properties approved successfully!`, 'success');
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    selectedIds.forEach(id => onUpdateStatus(id, 'Rejected'));
    showToast(`${selectedIds.length} properties marked rejected.`, 'warning');
    setSelectedIds([]);
  };

  const handleApprove = async (prop) => {
    const confirmed = await confirmApproval(
      `Approve Listing ${prop.id}?`,
      `"${prop.title}" will now be discoverable on BachelorHub User App.`
    );
    if (confirmed) {
      onUpdateStatus(prop.id, 'Active');
    }
  };

  const handleReject = async (prop) => {
    const confirmed = await confirmDelete(
      `Reject Listing ${prop.id}?`,
      `Owner will be notified to correct information or pricing.`
    );
    if (confirmed) {
      onUpdateStatus(prop.id, 'Rejected');
    }
  };

  // Dedicated View 1: Duplicate Detection Engine
  if (activeSubPage === 'duplicate_check') {
    return (
      <div>
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-square)', padding: '10px 14px', marginBottom: '16px', fontSize: '0.82rem', color: '#9f1239', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Copy size={16} />
            <span><strong>Automated Duplicate Property Detection Engine:</strong> Identifies reposted properties using address NLP similarity and computer vision photo hashing to eliminate duplicate broker spam.</span>
          </div>
          <span style={{ fontWeight: 700 }}>{initialDuplicatePairs.length} Pairings Flagged</span>
        </div>

        {initialDuplicatePairs.map((pair) => {
          const original = properties.find(p => p.id === pair.originalId) || properties[0];
          const duplicate = properties.find(p => p.id === pair.flaggedId) || properties[1];

          return (
            <div key={pair.id} className="classic-card" style={{ marginBottom: '16px' }}>
              <div className="card-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge-pill badge-red" style={{ fontWeight: 700 }}>{pair.id}</span>
                  <h3 style={{ fontSize: '0.95rem' }}>{pair.similarityScore}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Flagged: {pair.detectedAt}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-classic" 
                    style={{ color: '#dc2626', borderColor: '#fecdd3' }}
                    onClick={() => {
                      onUpdateStatus(duplicate.id, 'Suspended');
                      showToast(`Duplicate listing ${duplicate.id} rejected and taken down.`, 'success');
                    }}
                  >
                    Reject Duplicate ({duplicate.id})
                  </button>
                  <button 
                    className="btn-classic"
                    onClick={() => showToast(`Duplicate report ${pair.id} cleared.`, 'info')}
                  >
                    Dismiss Flag
                  </button>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Original Listing */}
                <div style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', padding: '14px', borderRadius: 'var(--radius-square)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge-pill badge-green">✓ Original Verified Listing</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.78rem' }}>{original?.id}</span>
                  </div>
                  <img 
                    src={resolveImgUrl(original?.images?.[0])} 
                    alt={original?.title} 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_PROPERTY_IMG; }}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-square)', marginBottom: '8px' }} 
                  />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{original?.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{original?.address}, {original?.locality}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginTop: '6px' }}>₹ {original?.price?.toLocaleString('en-IN')} {original?.priceUnit}</div>
                  <div style={{ fontSize: '0.74rem', marginTop: '6px', color: 'var(--text-secondary)' }}>Owner: <strong>{original?.ownerName}</strong> ({original?.ownerPhone})</div>
                </div>

                {/* Flagged Duplicate Listing */}
                <div style={{ border: '1px solid #fecdd3', background: '#fff1f2', padding: '14px', borderRadius: 'var(--radius-square)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge-pill badge-red">⚠ Flagged Duplicate Listing</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.78rem' }}>{duplicate?.id}</span>
                  </div>
                  <img 
                    src={resolveImgUrl(duplicate?.images?.[0])} 
                    alt={duplicate?.title} 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_PROPERTY_IMG; }}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-square)', marginBottom: '8px' }} 
                  />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9f1239' }}>{duplicate?.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{duplicate?.address}, {duplicate?.locality}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginTop: '6px' }}>₹ {duplicate?.price?.toLocaleString('en-IN')} {duplicate?.priceUnit}</div>
                  <div style={{ fontSize: '0.74rem', marginTop: '6px', color: 'var(--text-secondary)' }}>Uploader: <strong>{duplicate?.ownerName}</strong> ({duplicate?.ownerPhone})</div>
                </div>
              </div>

              <div style={{ marginTop: '12px', padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-cell)', borderRadius: 'var(--radius-square)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Analysis: <strong>{pair.addressMatch}</strong>. Property images have 96% perceptual hash match with existing database entry.
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Dedicated View 2: Title Deeds & Documents
  if (activeSubPage === 'property_docs') {
    return (
      <div>
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-square)', padding: '10px 14px', marginBottom: '14px', fontSize: '0.82rem', color: '#5b21b6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={16} />
            <span><strong>Property Title Deeds & Registry Documents:</strong> Verification registry papers, electricity connection records, and possession certificates.</span>
          </div>
          <span style={{ fontWeight: 700 }}>{properties.length} Listings Tracked</span>
        </div>

        <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property ID</th>
                  <th>Listing Title</th>
                  <th>Owner Name</th>
                  <th>Uploaded Document Proof</th>
                  <th>Deed Status</th>
                  <th>Verification Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.locality}, {p.city}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.ownerName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.ownerPhone}</div>
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {p.deedDocument || 'Sale Deed Registry Document (PDF attached)'}
                    </td>
                    <td>
                      <span className={`badge-pill ${p.isVerified ? 'badge-green' : 'badge-yellow'}`}>
                        {p.isVerified ? '✓ Deed Verified' : 'Under Legal Review'}
                      </span>
                    </td>
                    <td>
                      <span className="badge-pill badge-purple">Level 2 (Registry & Electricity)</span>
                    </td>
                    <td>
                      <button 
                        className="btn-classic"
                        style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                        onClick={() => onSelectProperty(p)}
                      >
                        Inspect Deed
                      </button>
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

  // Dedicated View 3: Reported Properties
  if (activeSubPage === 'reported_properties') {
    const reportedProps = properties.filter(p => p.reportsCount > 0);

    return (
      <div>
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-square)', padding: '10px 14px', marginBottom: '14px', fontSize: '0.82rem', color: '#9f1239', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span><strong>Reported Listings Queue:</strong> Properties flagged by tenants for inaccurate rent, broker posing as owner, or fake photos.</span>
          </div>
          <span style={{ fontWeight: 700 }}>{reportedProps.length} Flagged Listings</span>
        </div>

        <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property ID</th>
                  <th>Listing Details</th>
                  <th>Landlord / Broker</th>
                  <th>Reports Count</th>
                  <th>Flagged Reason</th>
                  <th>Current Status</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportedProps.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.locality}, {p.city} • ₹{p.price.toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                      <div>{p.ownerName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.ownerPhone}</div>
                    </td>
                    <td>
                      <span className="badge-pill badge-red" style={{ fontWeight: 700 }}>
                        {p.reportsCount} Reports
                      </span>
                    </td>
                    <td style={{ fontSize: '0.76rem', color: '#dc2626', maxWidth: '240px' }}>
                      {p.description || 'Tenants reported unauthorized broker fee demanded upon visiting.'}
                    </td>
                    <td>
                      <span className={`badge-pill ${p.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-classic"
                          style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#dc2626' }}
                          onClick={() => {
                            onUpdateStatus(p.id, 'Suspended');
                            showToast(`Listing ${p.id} suspended immediately.`, 'warning');
                          }}
                        >
                          Suspend
                        </button>
                        <button 
                          className="btn-classic"
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                          onClick={() => onDeleteProperty(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reportedProps.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No reported properties currently under review.
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

  // Dedicated View 4: Suspended & Expired Properties
  if (activeSubPage === 'suspended_properties') {
    const suspendedProps = properties.filter(p => p.status === 'Suspended');

    return (
      <div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-square)', padding: '10px 14px', marginBottom: '14px', fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span><strong>Suspended & Expired Listings:</strong> Inactive properties taken down due to policy violations, lease completions, or extended inactivity.</span>
          </div>
          <span style={{ fontWeight: 700 }}>{suspendedProps.length} Suspended</span>
        </div>

        <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property ID</th>
                  <th>Listing Title</th>
                  <th>Locality & City</th>
                  <th>Rent / Price</th>
                  <th>Owner Name</th>
                  <th>Suspension Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suspendedProps.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>{p.id}</td>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td>{p.locality}, {p.city}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>₹ {p.price.toLocaleString('en-IN')}</td>
                    <td>{p.ownerName} ({p.ownerPhone})</td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {p.description || 'Listing suspended pending owner document verification.'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-classic"
                          style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#059669' }}
                          onClick={() => {
                            onUpdateStatus(p.id, 'Active');
                            showToast(`Listing ${p.id} restored to live catalogue.`, 'success');
                          }}
                        >
                          Restore Listing
                        </button>
                        <button 
                          className="btn-classic"
                          style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#dc2626' }}
                          onClick={() => onDeleteProperty(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {suspendedProps.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No suspended property listings on platform.
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

  // Default: All Properties & Pending Properties View
  return (
    <div>
      {/* Sub Tabs based on poster specifications */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="classic-tabbar">
          <button 
            className={`tab-btn-pill ${activeSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('all')}
          >
            All Properties ({properties.length})
          </button>
          <button 
            className={`tab-btn-pill ${activeSubTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pending')}
          >
            Pending Verification ({properties.filter(p => p.status === 'Pending Verification').length})
          </button>
          <button 
            className={`tab-btn-pill ${activeSubTab === 'duplicates' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('duplicates')}
          >
            Duplicate Flagged ({properties.filter(p => p.isDuplicate).length})
          </button>
          <button 
            className={`tab-btn-pill ${activeSubTab === 'reported' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('reported')}
          >
            Reported / Disputed ({properties.filter(p => p.reportsCount > 0).length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="classic-tabbar">
            <button 
              className={`tab-btn-pill ${viewMode === 'table' ? 'active' : ''}`} 
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={14} />
            </button>
            <button 
              className={`tab-btn-pill ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode('grid')}
              title="Grid Cards"
            >
              <Grid size={14} />
            </button>
          </div>

          <button 
            className="btn-classic btn-primary-purple"
            onClick={onAddNewClick}
          >
            <Plus size={14} />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ width: '280px' }}>
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, locality, ID, owner..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select 
            className="filter-select-input"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Property Types</option>
            <option value="Plot">Plots / Lands (Plot)</option>
            <option value="Flat">Flats / Apartments</option>
            <option value="House">Independent Houses / Villas</option>
            <option value="Room">Rooms / 1 RK</option>
            <option value="PG">Hostels & PGs</option>
            <option value="Office">Commercial Offices</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="btn-classic text-xs" 
            onClick={() => {
              exportToCsv('Property_Catalog_Export', filtered.map(p => ({
                ID: p.id,
                Title: p.title,
                Type: p.type,
                BHK: p.bhk,
                Locality: p.locality,
                City: p.city,
                Price: p.price,
                Owner: p.ownerName,
                Phone: p.ownerPhone,
                Status: p.status,
                Featured: p.isFeatured ? 'Yes' : 'No',
                Deed_Verified: p.isVerified ? 'Yes' : 'No'
              })));
              showToast(`Exported ${filtered.length} properties to CSV successfully!`, 'success');
            }}
            title="Download CSV of current listings"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Total: <strong>{filtered.length}</strong> listings
          </div>
        </div>
      </div>

      {/* Bulk Selection Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2.5 px-3.5 mb-3 bg-indigo-50 border border-indigo-200 rounded-[2px] text-xs">
          <div className="flex items-center gap-2 font-semibold text-indigo-950">
            <CheckSquare size={15} className="text-indigo-700" />
            <span>{selectedIds.length} properties selected for batch operation</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="btn-classic bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 text-xs py-1 px-2.5"
              onClick={handleBulkApprove}
            >
              <Check size={13} />
              <span>Approve All</span>
            </button>
            <button 
              type="button" 
              className="btn-classic bg-rose-600 text-white border-rose-700 hover:bg-rose-700 text-xs py-1 px-2.5"
              onClick={handleBulkReject}
            >
              <X size={13} />
              <span>Reject All</span>
            </button>
            <button 
              type="button" 
              className="btn-classic text-xs py-1 px-2.5"
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* View: Table View */}
      {viewMode === 'table' ? (
        <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '38px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filtered.length && filtered.length > 0} 
                      onChange={toggleSelectAll}
                      className="cursor-pointer" 
                      title="Select / Deselect All"
                    />
                  </th>
                  <th className="cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      <span>Property ID</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      <span>Property Details & Location</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th>Type & Size</th>
                  <th className="cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">
                      <span>Rent / Price</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th>Owner Name</th>
                  <th>Safety & Checks</th>
                  <th>Status</th>
                  <th className="sticky right-0 bg-slate-100 z-10 border-l border-slate-300 min-w-[120px] text-center shadow-[-2px_0_4px_rgba(0,0,0,0.04)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} className={selectedIds.includes(p.id) ? 'bg-indigo-50/40' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(p.id)} 
                        onChange={() => toggleSelect(p.id)}
                        className="cursor-pointer" 
                      />
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {p.id}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={resolveImgUrl(p.images?.[0])} 
                          alt={p.title} 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_PROPERTY_IMG;
                          }}
                          style={{ width: '44px', height: '34px', borderRadius: 'var(--radius-square)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {p.locality}, {p.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{p.type} {p.bhk > 0 ? `(${p.bhk} BHK)` : ''}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.areaSqFt} sq.ft • {p.furnishing}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      ₹ {p.price.toLocaleString('en-IN')} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.priceUnit}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.ownerName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.ownerPhone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {p.isDuplicate && (
                          <span className="badge-pill badge-red" title="Duplicate address detected">
                            <Copy size={11} />
                            <span>Duplicate of {p.duplicateOf}</span>
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="badge-pill badge-yellow">★ Featured Boost</span>
                        )}
                        {p.isVerified && (
                          <span className="badge-pill badge-green">✓ Deed Verified</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`badge-pill ${
                          p.status === 'Active' ? 'badge-green' :
                          p.status === 'Pending Verification' ? 'badge-yellow' : 'badge-red'
                        }`}>
                          {p.status}
                        </span>
                        {p.status === 'Pending Verification' && (
                          <div className="flex items-center gap-1 mt-1">
                            <button 
                              type="button" 
                              className="btn-classic text-[11px] py-0.5 px-2 bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 font-bold flex items-center gap-1 shadow-xs cursor-pointer rounded-[2px]"
                              onClick={() => handleApprove(p)}
                              title="Verify and Approve listing live"
                            >
                              <CheckCircle size={12} />
                              <span>Verify Now</span>
                            </button>
                            <button 
                              type="button" 
                              className="btn-classic text-[11px] py-0.5 px-1.5 bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1 font-semibold cursor-pointer rounded-[2px]"
                              onClick={() => handleReject(p)}
                              title="Reject listing"
                            >
                              <XCircle size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="sticky right-0 bg-white z-10 border-l border-slate-200 shadow-[-2px_0_4px_rgba(0,0,0,0.04)]">
                      <div className="table-actions">
                        <button 
                          className="btn-icon-sm" 
                          title="Inspect Details & Deed"
                          onClick={() => onSelectProperty(p)}
                        >
                          <Eye size={14} />
                        </button>

                        {p.status !== 'Active' ? (
                          <button 
                            className="btn-icon-sm approve" 
                            title="Approve Listing"
                            onClick={() => handleApprove(p)}
                          >
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <button 
                            className="btn-icon-sm reject" 
                            title="Reject Listing"
                            onClick={() => handleReject(p)}
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        <button 
                          className={`btn-icon-sm ${p.isFeatured ? 'featured' : ''}`}
                          title={p.isFeatured ? 'Remove Featured Boost' : 'Promote to Featured Boost'}
                          onClick={() => onToggleFeatured(p.id)}
                        >
                          <Star size={14} fill={p.isFeatured ? '#d97706' : 'none'} color={p.isFeatured ? '#d97706' : 'currentColor'} />
                        </button>

                        <button 
                          className="btn-icon-sm delete" 
                          title="Delete Listing"
                          onClick={() => onDeleteProperty(p.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No properties found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Controls */}
          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.ceil(filtered.length / pageSize) || 1}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      ) : (
        /* View: Grid Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
          {filtered.map((p) => (
            <div key={p.id} className="classic-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', position: 'relative' }}>
                <img 
                  src={resolveImgUrl(p.images?.[0])} 
                  alt={p.title} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_PROPERTY_IMG;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                  <span className={`badge-pill ${
                    p.status === 'Active' ? 'badge-green' :
                    p.status === 'Pending Verification' ? 'badge-yellow' : 'badge-red'
                  }`}>
                    {p.status}
                  </span>
                  {p.isFeatured && <span className="badge-pill badge-yellow">★ Boost</span>}
                </div>
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#059669' }}>
                  ₹ {p.price.toLocaleString('en-IN')} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.priceUnit}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.locality}, {p.city}</div>

                <div style={{ borderTop: '1px solid var(--border-cell)', paddingTop: '10px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Owner: {p.ownerName}</span>
                  <div className="table-actions">
                    <button className="btn-icon-sm" onClick={() => onSelectProperty(p)}>
                      <Eye size={13} />
                    </button>
                    {p.status !== 'Active' ? (
                      <button className="btn-icon-sm approve" onClick={() => handleApprove(p)}>
                        <CheckCircle size={13} />
                      </button>
                    ) : (
                      <button className="btn-icon-sm reject" onClick={() => handleReject(p)}>
                        <XCircle size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
