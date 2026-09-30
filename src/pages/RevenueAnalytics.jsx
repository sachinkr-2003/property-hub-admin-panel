import React from 'react';
import { CreditCard, TrendingUp, DollarSign, ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { mockRevenueTrends } from '../data/mockData';

export default function RevenueAnalytics() {
  const plans = [
    {
      name: "Owner Starter",
      price: "₹ 999",
      period: "per listing / 45 days",
      features: ["Up to 3 Property Listings", "Standard Search Placement", "Direct Tenant Inquiries", "Standard Support"],
      activeSubscribers: 184,
      color: "var(--accent-primary)"
    },
    {
      name: "Owner Gold Pro",
      price: "₹ 2,499",
      period: "per quarter",
      features: ["Unlimited Listings", "Featured Top Placement", "Verified Owner Badge", "Tenant Background Check", "WhatsApp Instant Leads"],
      activeSubscribers: 219,
      color: "var(--accent-indigo)",
      isPopular: true
    },
    {
      name: "Broker & Agency Suite",
      price: "₹ 7,999",
      period: "per month",
      features: ["50 Active Listings", "Dedicated Account Manager", "CRM & Lead Auto-Routing", "Virtual 360 Tour Hosting", "Bulk Export"],
      activeSubscribers: 33,
      color: "var(--accent-purple)"
    }
  ];

  return (
    <div>
      {/* Top Highlights */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-title">Total Platform Collections (MTD)</span>
          <div className="stat-value">₹ 4,85,200</div>
          <div className="stat-footer">
            <span className="stat-trend trend-up"><ArrowUpRight size={14} /> +22.4%</span>
            <span>vs previous month</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-title">Active Paid Subscriptions</span>
          <div className="stat-value">436</div>
          <div className="stat-footer">
            <span className="stat-trend trend-up"><ArrowUpRight size={14} /> +18</span>
            <span>new renewals</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-title">Featured Promotion Revenue</span>
          <div className="stat-value">₹ 1,12,000</div>
          <div className="stat-footer">
            <span className="stat-trend trend-up"><ArrowUpRight size={14} /> +15.1%</span>
            <span>premium badges</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-title">Home Services Commission</span>
          <div className="stat-value">₹ 64,800</div>
          <div className="stat-footer">
            <span className="stat-trend trend-up"><ArrowUpRight size={14} /> +29.0%</span>
            <span>10% take-rate</span>
          </div>
        </div>
      </div>

      {/* Revenue Trends Visualization */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <div className="card-title-row">
          <div>
            <h3>Monthly Platform Revenue Growth (H1-H2 2026)</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Historical recurring subscription and monetization streams
            </p>
          </div>
        </div>

        {/* CSS-based Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', padding: '20px 10px 10px', borderBottom: '1px solid var(--border-color)', gap: '16px' }}>
          {mockRevenueTrends.map((item, idx) => {
            const heightPercent = Math.round((item.revenue / 500000) * 100);
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  ₹{(item.revenue / 1000).toFixed(0)}k
                </span>
                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '48px', 
                    height: `${heightPercent}%`, 
                    background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  title={`Revenue: ₹ ${item.revenue.toLocaleString('en-IN')}`}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Tier Management */}
      <div className="glass-card">
        <div className="card-title-row">
          <div>
            <h3>Property Hub Monetization Packages</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Active plans offered to Owners, Landlords, and Real Estate Agents
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {plans.map((p, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)',
                border: p.isPopular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {p.isPopular && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  right: '20px', 
                  background: 'var(--accent-primary)', 
                  color: '#fff', 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  padding: '3px 10px', 
                  borderRadius: 'var(--radius-full)' 
                }}>
                  MOST POPULAR
                </span>
              )}

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h4>
                <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{p.price}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}> /{p.period}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {p.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={15} color="var(--accent-emerald)" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active Users: <strong>{p.activeSubscribers}</strong>
                </span>
                <button className="tab-btn active" style={{ fontSize: '0.75rem' }}>
                  Edit Tier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
