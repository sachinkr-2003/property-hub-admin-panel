import React, { useState } from 'react';
import { Wrench, ShoppingBag, Star, CheckCircle, XCircle, Tag, Phone } from 'lucide-react';

export default function ServicesMarketplace({ services, usedItems, onUpdateItemStatus }) {
  const [subTab, setSubTab] = useState('marketplace'); // 'marketplace' or 'services'

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="tab-nav">
          <button 
            className={`tab-btn ${subTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setSubTab('marketplace')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShoppingBag size={15} />
              <span>Used Furniture & Appliances ({usedItems.length})</span>
            </div>
          </button>
          <button 
            className={`tab-btn ${subTab === 'services' ? 'active' : ''}`}
            onClick={() => setSubTab('services')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={15} />
              <span>Home Services & Moving ({services.length})</span>
            </div>
          </button>
        </div>
      </div>

      {subTab === 'marketplace' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {usedItems.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '180px', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className={`status-pill ${item.status === 'Approved' ? 'pill-active' : 'pill-pending'}`} style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  {item.status}
                </span>
              </div>

              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    ₹ {item.price.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    ₹ {item.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.4' }}>
                  {item.title}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Seller: <strong>{item.sellerName}</strong> ({item.locality})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Category: {item.category}</span>

                  <div className="action-btn-group">
                    {item.status !== 'Approved' ? (
                      <button 
                        className="header-btn btn-primary"
                        style={{ padding: '5px 10px', fontSize: '0.75rem', background: 'var(--accent-emerald)' }}
                        onClick={() => onUpdateItemStatus(item.id, 'Approved')}
                      >
                        <CheckCircle size={14} />
                        <span>Approve</span>
                      </button>
                    ) : (
                      <button 
                        className="header-btn"
                        style={{ padding: '5px 10px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                        onClick={() => onUpdateItemStatus(item.id, 'Under Review')}
                      >
                        <XCircle size={14} />
                        <span>Suspend</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Home Services Providers Table */
        <div className="glass-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Partner Name & Service</th>
                  <th>Category</th>
                  <th>Contact Person</th>
                  <th>Customer Rating</th>
                  <th>Completed Orders</th>
                  <th>Base Pricing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {s.id}</div>
                    </td>
                    <td>{s.category}</td>
                    <td>
                      <div>{s.provider}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
                        <Star size={14} fill="#fbbf24" />
                        <span>{s.rating} / 5.0</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{s.orders} jobs</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{s.priceStarts}</td>
                    <td>
                      <span className="status-pill pill-active">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
