import React, { useState } from 'react';
import { Users2, Search, CheckCircle, XCircle, MapPin, Tag, Heart } from 'lucide-react';

export default function RoommateManagement({ roommates, onUpdateRoommateStatus }) {
  const [filterGender, setFilterGender] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = roommates.filter((rm) => {
    const matchesGender = filterGender === 'All' || rm.lookingFor.toLowerCase() === filterGender.toLowerCase();
    const matchesSearch = 
      rm.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.targetLocality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.profession.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGender && matchesSearch;
  });

  return (
    <div>
      {/* Top Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-box" style={{ width: '280px' }}>
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search roommate by name, profession..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="All">All Roommate Preferences</option>
            <option value="Male">Looking for Male Flatmate</option>
            <option value="Female">Looking for Female Flatmate</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Active Co-living Requests: <strong>{roommates.length}</strong>
        </div>
      </div>

      {/* Roommates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((rm) => (
          <div key={rm.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={rm.userAvatar} 
                  alt={rm.userName} 
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-indigo)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{rm.userName}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rm.profession}</div>
                </div>
              </div>

              <span className={`status-pill ${rm.status === 'Active' ? 'pill-active' : 'pill-pending'}`}>
                {rm.status}
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget Share</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  ₹ {rm.budget.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <MapPin size={13} color="var(--accent-cyan)" />
                <span>{rm.targetLocality}, {rm.city}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              "{rm.bio}"
            </p>

            {/* Lifestyle Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {rm.tags.map((t, idx) => (
                <span key={idx} style={{ 
                  fontSize: '0.7rem', 
                  padding: '3px 8px', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  color: '#818cf8', 
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                  #{t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Seeking: <strong>{rm.lookingFor}</strong>
              </span>

              <div className="action-btn-group">
                {rm.status !== 'Active' ? (
                  <button 
                    className="header-btn btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--accent-emerald)' }}
                    onClick={() => onUpdateRoommateStatus(rm.id, 'Active')}
                  >
                    <CheckCircle size={14} />
                    <span>Approve Post</span>
                  </button>
                ) : (
                  <button 
                    className="header-btn" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                    onClick={() => onUpdateRoommateStatus(rm.id, 'Suspended')}
                  >
                    <XCircle size={14} />
                    <span>Take Down</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
