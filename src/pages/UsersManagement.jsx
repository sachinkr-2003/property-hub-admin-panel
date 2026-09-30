import React, { useState } from 'react';
import { Users, Search, ShieldCheck, ShieldAlert, UserX, UserCheck } from 'lucide-react';

export default function UsersManagement({ users, onToggleUserStatus }) {
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    return matchesRole && matchesSearch;
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
              placeholder="Search user by name, email, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All User Roles</option>
            <option value="Owner">Direct Owners</option>
            <option value="Tenant">Tenants / Buyers</option>
            <option value="Broker">Brokers & Agencies</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Total Registered Users: <strong>{users.length}</strong>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name & Email</th>
                <th>Role</th>
                <th>KYC Status</th>
                <th>Active Plan</th>
                <th>Listings</th>
                <th>Status</th>
                <th>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{u.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email} • {u.phone}</div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      color: u.role === 'Owner' ? 'var(--accent-primary)' : u.role === 'Tenant' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${
                      u.kycStatus === 'Verified' ? 'pill-verified' :
                      u.kycStatus === 'Pending' ? 'pill-pending' : 'pill-rejected'
                    }`}>
                      {u.kycStatus}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{u.subscription}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{u.propertiesListed}</td>
                  <td>
                    <span className={`status-pill ${u.status === 'Active' ? 'pill-active' : 'pill-suspended'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`header-btn ${u.status === 'Active' ? '' : 'btn-primary'}`}
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.75rem',
                        color: u.status === 'Active' ? 'var(--accent-rose)' : '#fff'
                      }}
                      onClick={() => onToggleUserStatus(u.id)}
                    >
                      {u.status === 'Active' ? (
                        <>
                          <UserX size={14} />
                          <span>Suspend</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={14} />
                          <span>Unban</span>
                        </>
                      )}
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
