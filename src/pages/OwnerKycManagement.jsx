import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function OwnerKycManagement({ 
  kycRequests, 
  onSelectKyc, 
  onApproveKyc, 
  onRejectKyc 
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKyc = kycRequests.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch = 
      item.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Notice Banner */}
      <div style={{ 
        background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Government ID & Registry Verification Portal</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Verified owners receive the verified trust badge on the Property Hub app, increasing buyer/tenant trust by 84%.
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-box" style={{ width: '280px' }}>
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by owner name, phone, KYC ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Verification Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Verified">Verified & Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredKyc.length}</strong> submission{filteredKyc.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* KYC Submissions Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>KYC ID</th>
                <th>Owner Details</th>
                <th>Aadhaar / PAN</th>
                <th>Property Registered</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredKyc.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {item.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={item.selfieUrl} 
                        alt={item.ownerName} 
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.ownerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
                      UID: <strong>{item.aadhaarNumber}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      PAN: {item.panNumber}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.propertyAddress}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                      {item.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{item.submittedAt}</div>
                  </td>
                  <td>
                    <span className={`status-pill ${
                      item.status === 'Verified' ? 'pill-verified' :
                      item.status === 'Pending' ? 'pill-pending' : 'pill-rejected'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button 
                        className="header-btn"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        onClick={() => onSelectKyc(item)}
                      >
                        <Eye size={14} />
                        <span>Inspect Dossier</span>
                      </button>

                      {item.status === 'Pending' && (
                        <>
                          <button 
                            className="icon-action-btn btn-approve"
                            title="Quick Approve"
                            onClick={() => onApproveKyc(item.id, 'Verified via fast-track admin approval')}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            className="icon-action-btn btn-reject"
                            title="Quick Reject"
                            onClick={() => onRejectKyc(item.id, 'Documents unclear or mismatch')}
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
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
