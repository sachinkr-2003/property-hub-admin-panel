import React, { useState } from 'react';
import { CalendarCheck, Search, Filter, Phone, CheckCircle, Clock, XCircle, User } from 'lucide-react';

export default function LeadsAndVisits({ visits, onUpdateVisitStatus }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = visits.filter((v) => {
    const matchesStatus = statusFilter === 'All' || v.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch = 
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.visitorPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-box" style={{ width: '280px' }}>
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search visitor, phone, property..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Visit Statuses</option>
            <option value="Confirmed">Confirmed Slots</option>
            <option value="Completed">Completed Visits</option>
            <option value="Pending">Pending Confirmation</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Total Bookings: <strong>{visits.length}</strong>
        </div>
      </div>

      {/* Visits Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Target Property</th>
                <th>Visitor Contact</th>
                <th>Assigned Owner</th>
                <th>Visit Date & Time</th>
                <th>Lead Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {v.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{v.propertyTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.locality}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{v.visitorName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v.visitorPhone}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{v.ownerName}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{v.slotDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>{v.slotTime}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {v.leadType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${
                      v.status === 'Confirmed' ? 'pill-confirmed' :
                      v.status === 'Completed' ? 'pill-active' : 'pill-pending'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      {v.status !== 'Completed' && (
                        <button 
                          className="icon-action-btn btn-approve"
                          title="Mark Completed"
                          onClick={() => onUpdateVisitStatus(v.id, 'Completed')}
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {v.status !== 'Cancelled' && (
                        <button 
                          className="icon-action-btn btn-reject"
                          title="Cancel Booking"
                          onClick={() => onUpdateVisitStatus(v.id, 'Cancelled')}
                        >
                          <XCircle size={14} />
                        </button>
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
