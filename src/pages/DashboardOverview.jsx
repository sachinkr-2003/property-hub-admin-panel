import React, { useState } from 'react';
import { 
  Users, 
  Home, 
  ShieldAlert, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Copy,
  DollarSign,
  TrendingUp,
  FileCheck,
  Download,
  BarChart3,
  Plus,
  Send,
  Zap,
  Activity
} from 'lucide-react';
import { earningModels, initialDuplicatePairs } from '../data/mockData';
import { exportToCsv } from '../utils/exportCsv';
import { showToast } from '../utils/alerts';

export default function DashboardOverview({ 
  metrics, 
  owners, 
  properties, 
  onSelectProperty, 
  onSelectKyc,
  setActiveTab,
  activeSubPage = 'overview'
}) {
  const [queueTab, setQueueTab] = useState('kyc'); // 'kyc', 'properties', 'duplicates'
  const [activeChartMode, setActiveChartMode] = useState('revenue');
  
  const pendingKyc = owners.filter(o => o.kycStatus === 'Pending');
  const pendingProps = properties.filter(p => p.status === 'Pending Verification');
  const duplicateProps = properties.filter(p => p.isDuplicate);

  // If subPage is queues
  if (activeSubPage === 'queues') {
    return (
      <div>
        {/* Verification Queues Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div className="classic-tabbar">
            <button 
              className={`tab-btn-pill ${queueTab === 'kyc' ? 'active' : ''}`}
              onClick={() => setQueueTab('kyc')}
            >
              Pending Landlord KYC ({pendingKyc.length})
            </button>
            <button 
              className={`tab-btn-pill ${queueTab === 'properties' ? 'active' : ''}`}
              onClick={() => setQueueTab('properties')}
            >
              Pending Property Listings ({pendingProps.length})
            </button>
            <button 
              className={`tab-btn-pill ${queueTab === 'duplicates' ? 'active' : ''}`}
              onClick={() => setQueueTab('duplicates')}
            >
              Duplicate Flagged Pairings ({initialDuplicatePairs.length})
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total pending moderation items: <strong>{pendingKyc.length + pendingProps.length + initialDuplicatePairs.length}</strong>
          </div>
        </div>

        {/* KYC Queue Table */}
        {queueTab === 'kyc' && (
          <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Owner ID</th>
                    <th>Landlord Name</th>
                    <th>Mobile & Contact</th>
                    <th>Govt ID Proof</th>
                    <th>Registry / Title Deed</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingKyc.map((owner) => (
                    <tr key={owner.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {owner.id}
                      </td>
                      <td style={{ fontWeight: 600 }}>{owner.name}</td>
                      <td style={{ fontSize: '0.78rem' }}>{owner.mobile}</td>
                      <td>
                        <span className="badge-pill badge-blue">{owner.documents?.pan ? `PAN: ${owner.documents.pan}` : (owner.documents?.aadhaar ? 'Aadhaar Card' : 'Govt ID Proof')}</span>
                      </td>
                      <td style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {owner.documents?.registry || 'Standard Deed Scan'}
                      </td>
                      <td>
                        <span className="badge-pill badge-yellow">Pending Review</span>
                      </td>
                      <td>
                        <button 
                          className="btn-classic" 
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          onClick={() => onSelectKyc(owner)}
                        >
                          Inspect Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingKyc.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        All owner KYC dossiers have been reviewed and approved.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Properties Queue Table */}
        {queueTab === 'properties' && (
          <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property ID</th>
                    <th>Title & Locality</th>
                    <th>Type & Specs</th>
                    <th>Expected Rent</th>
                    <th>Owner Contact</th>
                    <th>Safety Checks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProps.map((prop) => (
                    <tr key={prop.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {prop.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{prop.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{prop.locality}, {prop.city}</div>
                      </td>
                      <td>
                        <div>{prop.type} {prop.bhk ? `(${prop.bhk} BHK)` : ''}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{prop.furnishing}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>
                        ₹ {prop.price.toLocaleString('en-IN')} {prop.priceUnit}
                      </td>
                      <td>
                        <div>{prop.ownerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{prop.ownerPhone}</div>
                      </td>
                      <td>
                        {prop.isDuplicate ? (
                          <span className="badge-pill badge-red">
                            <Copy size={11} />
                            <span>Duplicate of {prop.duplicateOf}</span>
                          </span>
                        ) : (
                          <span className="badge-pill badge-yellow">Unverified</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn-classic" 
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          onClick={() => onSelectProperty(prop)}
                        >
                          Inspect & Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingProps.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        All property listings have been reviewed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Duplicates Tab */}
        {queueTab === 'duplicates' && (
          <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Flag ID</th>
                    <th>Original Verified Property</th>
                    <th>Flagged Duplicate Listing</th>
                    <th>Match Confidence</th>
                    <th>Address Similarity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {initialDuplicatePairs.map((dup) => (
                    <tr key={dup.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>{dup.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{dup.originalTitle}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {dup.originalId} • {dup.originalOwner}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#dc2626' }}>{dup.flaggedTitle}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {dup.flaggedId} • {dup.flaggedOwner}</div>
                      </td>
                      <td>
                        <span className="badge-pill badge-red">{dup.similarityScore}</span>
                      </td>
                      <td style={{ fontSize: '0.74rem' }}>{dup.addressMatch}</td>
                      <td>
                        <span className="badge-pill badge-yellow">{dup.status}</span>
                      </td>
                      <td>
                        <button 
                          className="btn-classic" 
                          style={{ fontSize: '0.74rem', padding: '3px 8px', color: '#dc2626' }}
                          onClick={() => setActiveTab('properties')}
                        >
                          Resolve in Duplicates
                        </button>
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

  // If subPage is earning_summary
  if (activeSubPage === 'earning_summary') {
    return (
      <div>
        {/* Earning Metrics Header */}
        <div className="metrics-row">
          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-label">MTD Gross Platform Collections</span>
              <div className="metric-icon-bubble" style={{ background: '#ecfdf5', color: '#047857' }}>
                <DollarSign size={16} />
              </div>
            </div>
            <div className="metric-number" style={{ color: '#047857' }}>
              ₹ {(metrics.revenueSummary / 100000).toFixed(2)} Lakh
            </div>
            <div className="metric-sub">
              <span className="trend-green"><ArrowUpRight size={12} /> {metrics.revenueChange}</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-label">Active Earning Channels</span>
              <div className="metric-icon-bubble" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <CreditCard size={16} />
              </div>
            </div>
            <div className="metric-number">10 Channels</div>
            <div className="metric-sub">
              <span className="trend-green">All configured & operational</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-label">Owner Subscriptions</span>
              <div className="metric-icon-bubble" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
                <Users size={16} />
              </div>
            </div>
            <div className="metric-number">{metrics.activeSubscriptions} Landlords</div>
            <div className="metric-sub">
              <span className="trend-green">₹ 1.45 Lakh recurring MTD</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-label">Payment Gateway Status</span>
              <div className="metric-icon-bubble" style={{ background: '#fffbeb', color: '#b45309' }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="metric-number">Razorpay API</div>
            <div className="metric-sub">
              <span>Daily Automated Settlement 23:59 IST</span>
            </div>
          </div>
        </div>

        {/* 10 Earning Channels Table */}
        <div className="classic-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                  <th>Monetization Stream (From Poster Spec)</th>
                  <th>Configured Price / Rate</th>
                  <th>Billing Unit</th>
                  <th>MTD Gross Collection</th>
                  <th>Active Operations</th>
                  <th>Settlement Policy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {earningModels.map((em) => (
                  <tr key={em.id}>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{em.id}</td>
                    <td style={{ fontWeight: 600 }}>{em.name}</td>
                    <td style={{ fontWeight: 700, color: '#4338ca' }}>{em.rate}</td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{em.unit}</td>
                    <td style={{ fontWeight: 700, color: '#047857' }}>
                      ₹ {em.mtdRevenue.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.76rem', fontWeight: 600 }}>{em.activeTransactions} ops</td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Immediate / Razorpay Webhook</td>
                    <td>
                      <span className="badge-pill badge-green">{em.status}</span>
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

  const monthlyGrowthData = [
    { month: 'Jan', rev: 1.85, listings: 420 },
    { month: 'Feb', rev: 2.30, listings: 530 },
    { month: 'Mar', rev: 2.90, listings: 690 },
    { month: 'Apr', rev: 3.20, listings: 780 },
    { month: 'May', rev: 3.75, listings: 890 },
    { month: 'Jun', rev: 4.05, listings: 980 },
    { month: 'Jul', rev: 4.30, listings: 1070 },
    { month: 'Aug', rev: 4.55, listings: 1160 },
    { month: 'Sep', rev: 4.85, listings: 1248 }
  ];

  // Default: Full Overview Screen
  return (
    <div>
      {/* Quick Action Shortcuts Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5 bg-white border border-slate-300 p-2.5 px-3.5 rounded-[2px] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-indigo-600" />
            Quick Admin Shortcuts:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            type="button" 
            className="btn-classic text-indigo-700 hover:text-indigo-800"
            onClick={() => setActiveTab('properties')}
          >
            <Plus size={13} />
            <span>Moderate Listings ({pendingProps.length})</span>
          </button>
          <button 
            type="button" 
            className="btn-classic text-amber-700 hover:text-amber-800"
            onClick={() => setActiveTab('owners')}
          >
            <FileCheck size={13} />
            <span>Review KYC ({pendingKyc.length})</span>
          </button>
          <button 
            type="button" 
            className="btn-classic text-sky-700 hover:text-sky-800"
            onClick={() => setActiveTab('communication')}
          >
            <Send size={13} />
            <span>Broadcast Push</span>
          </button>
          <button 
            type="button" 
            className="btn-classic bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
            onClick={() => {
              exportToCsv('PropertyHub_Platform_KPI_Report', [
                { Metric: 'Total Registered Users', Value: metrics.totalUsers, Growth: metrics.usersChange },
                { Metric: 'Total Active Properties', Value: metrics.totalProperties, Growth: metrics.propertiesChange },
                { Metric: 'Pending KYC Queues', Value: pendingKyc.length, Detail: 'Awaiting Title Deeds Review' },
                { Metric: 'Pending Properties Review', Value: pendingProps.length, Detail: 'Physical inspection compliance' },
                { Metric: 'Gross MTD Platform Revenue', Value: `Rs. ${(metrics.revenueSummary / 100000).toFixed(2)} Lakh`, Growth: metrics.revenueChange }
              ]);
              showToast('Platform KPI Summary exported to CSV successfully!', 'success');
            }}
          >
            <Download size={13} />
            <span>Export KPI CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Strict Square Metric KPI Tiles */}
      <div className="metrics-row">
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-label">Total Users</span>
            <div className="metric-icon-bubble" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="metric-number">{metrics.totalUsers.toLocaleString()}</div>
          <div className="metric-sub">
            <span className="trend-green"><ArrowUpRight size={12} /> {metrics.usersChange}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-label">Total Properties</span>
            <div className="metric-icon-bubble" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
              <Home size={16} />
            </div>
          </div>
          <div className="metric-number">{metrics.totalProperties.toLocaleString()}</div>
          <div className="metric-sub">
            <span className="trend-green"><ArrowUpRight size={12} /> {metrics.propertiesChange}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-label">Pending Verifications</span>
            <div className="metric-icon-bubble" style={{ background: '#fffbeb', color: '#b45309' }}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="metric-number" style={{ color: '#b45309' }}>
            {pendingKyc.length + pendingProps.length}
          </div>
          <div className="metric-sub">
            <span className="trend-amber">{pendingKyc.length} Landlord KYC • {pendingProps.length} Properties</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-label">Platform Revenue (MTD)</span>
            <div className="metric-icon-bubble" style={{ background: '#ecfdf5', color: '#047857' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div className="metric-number" style={{ color: '#047857' }}>
            ₹ {(metrics.revenueSummary / 100000).toFixed(2)} Lakh
          </div>
          <div className="metric-sub">
            <span className="trend-green"><ArrowUpRight size={12} /> {metrics.revenueChange}</span>
          </div>
        </div>
      </div>

      {/* Visual Growth & Revenue Analytics Chart Card */}
      <div className="classic-card">
        <div className="card-topbar flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-[2px] flex items-center justify-center shrink-0">
              <BarChart3 size={15} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Platform Growth & Velocity (2026 Run Rate)</h3>
              <p className="text-[11px] text-slate-500">Monthly trends for revenue collections and verified listing influx</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="classic-tabbar">
              <button
                type="button"
                className={`tab-btn-pill ${activeChartMode === 'revenue' ? 'active' : ''}`}
                onClick={() => setActiveChartMode('revenue')}
              >
                Revenue (₹ Lakhs)
              </button>
              <button
                type="button"
                className={`tab-btn-pill ${activeChartMode === 'listings' ? 'active' : ''}`}
                onClick={() => setActiveChartMode('listings')}
              >
                Catalog Influx
              </button>
            </div>

            <button
              type="button"
              className="btn-classic text-xs"
              onClick={() => {
                exportToCsv('Monthly_Growth_Run_Rate', monthlyGrowthData.map(d => ({
                  Month: d.month,
                  Revenue_Lakh: `₹ ${d.rev} L`,
                  Total_Listings: d.listings
                })));
                showToast('Monthly growth report exported to CSV.', 'info');
              }}
              title="Download Monthly Growth Data"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Visual Bar Chart with Horizontal Scroll for Mobile */}
        <div className="mt-4 pt-2 overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="h-44 flex items-end justify-between gap-3 border-b border-slate-300 pb-2 px-2">
              {monthlyGrowthData.map((d, idx) => {
                const maxVal = activeChartMode === 'revenue' ? 5.5 : 1400;
                const curVal = activeChartMode === 'revenue' ? d.rev : d.listings;
                const heightPct = Math.round((curVal / maxVal) * 100);
                const isPeak = idx === monthlyGrowthData.length - 1;

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded-[2px] whitespace-nowrap pointer-events-none shadow-md z-10">
                      {activeChartMode === 'revenue' ? `₹ ${d.rev} Lakh` : `${d.listings} Listings`}
                    </div>

                    {/* Value label above bar */}
                    <span className="text-[10px] font-mono text-slate-500 mb-1">
                      {activeChartMode === 'revenue' ? `${d.rev}L` : d.listings}
                    </span>

                    {/* Bar */}
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[42px] rounded-[2px] transition-all duration-300 cursor-pointer ${
                        isPeak 
                          ? 'bg-indigo-700 hover:bg-indigo-800' 
                          : 'bg-indigo-200 hover:bg-indigo-400'
                      }`}
                    />

                    {/* Month Label */}
                    <span className={`text-[11px] mt-2 font-medium ${isPeak ? 'text-indigo-700 font-bold' : 'text-slate-500'}`}>
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Grid under Chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2 text-xs border-t border-slate-100">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-[2px]">
              <div className="text-[11px] text-slate-500">MoM Revenue Velocity</div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">+22.4% Run Rate</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-[2px]">
              <div className="text-[11px] text-slate-500">KYC Turnaround Time</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">3.4 hrs (Median)</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-[2px]">
              <div className="text-[11px] text-slate-500">Platform SLA Uptime</div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">99.98% High Availability</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-[2px]">
              <div className="text-[11px] text-slate-500">Average Order Value</div>
              <div className="font-bold text-indigo-700 text-sm mt-0.5">₹ 1,420 / Tenant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Check Alert Notice */}
      {duplicateProps.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-[2px] p-2.5 sm:p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-rose-900">
            <AlertTriangle size={15} className="shrink-0 text-rose-700" />
            <span><strong>Duplicate Detection Alert:</strong> {duplicateProps.length} listing flagged with identical address/photos to an existing property.</span>
          </div>
          <button 
            className="btn-classic text-xs py-1 px-2.5 border-rose-300 text-rose-800 hover:bg-rose-100 shrink-0" 
            onClick={() => setActiveTab('properties')}
          >
            Review Duplicates
          </button>
        </div>
      )}

      {/* Two Column Grid with PROPER EXCEL LINING TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        
        {/* Pending Owner KYC Queue (Excel Sheet Table) */}
        <div className="classic-card">
          <div className="card-topbar">
            <div>
              <h3>Owner KYC Verification Queue</h3>
              <p>Government ID & Registry proof moderation</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                className="btn-classic text-[11px]" 
                onClick={() => {
                  exportToCsv('Pending_Owner_KYC_Queue', pendingKyc.map(o => ({
                    ID: o.id,
                    Name: o.name,
                    Mobile: o.mobile,
                    Document: o.documents?.pan ? `PAN: ${o.documents.pan}` : 'Aadhaar / ID',
                    Deed_Proof: o.documents?.registry || 'Standard Deed',
                    Status: o.kycStatus
                  })));
                  showToast('Pending Landlords KYC queue exported to CSV.', 'success');
                }}
                title="Export KYC Queue to CSV"
              >
                <Download size={12} />
                <span>Export CSV</span>
              </button>
              <button 
                className="btn-classic text-[11px]" 
                onClick={() => setActiveTab('owners')}
              >
                Open Module
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Owner Name</th>
                  <th>Contact</th>
                  <th>Title Proof</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingKyc.map((owner) => (
                  <tr key={owner.id}>
                    <td style={{ fontWeight: 600 }}>{owner.name}</td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{owner.mobile}</td>
                    <td style={{ fontSize: '0.74rem' }}>{owner.documents?.registry || 'Deed Scan'}</td>
                    <td>
                      <span className="badge-pill badge-yellow">Pending Review</span>
                    </td>
                    <td>
                      <button 
                        className="btn-classic" 
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        onClick={() => onSelectKyc(owner)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingKyc.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                      All owner dossiers verified.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Property Listing Queue (Excel Sheet Table) */}
        <div className="classic-card">
          <div className="card-topbar">
            <div>
              <h3>Pending Property Approvals</h3>
              <p>Physical inspection & price compliance check</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                className="btn-classic text-[11px]" 
                onClick={() => {
                  exportToCsv('Pending_Property_Approvals', pendingProps.map(p => ({
                    ID: p.id,
                    Title: p.title,
                    Locality: p.locality,
                    Rent: p.price,
                    Deposit: p.deposit,
                    Furnishing: p.furnishing,
                    Status: p.status
                  })));
                  showToast('Pending property approvals exported to CSV.', 'success');
                }}
                title="Export Properties to CSV"
              >
                <Download size={12} />
                <span>Export CSV</span>
              </button>
              <button 
                className="btn-classic text-[11px]" 
                onClick={() => setActiveTab('properties')}
              >
                Open Module
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property Title</th>
                  <th>Locality</th>
                  <th>Rent / Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingProps.map((prop) => (
                  <tr key={prop.id}>
                    <td style={{ fontWeight: 600, maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prop.title}
                    </td>
                    <td>{prop.locality}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      ₹ {prop.price.toLocaleString('en-IN')}
                    </td>
                    <td>
                      {prop.isDuplicate ? (
                        <span className="badge-pill badge-red">Duplicate</span>
                      ) : (
                        <span className="badge-pill badge-yellow">Pending</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn-classic" 
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        onClick={() => onSelectProperty(prop)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingProps.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                      All property listings approved.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Platform Earning Channels (Complete Excel Sheet Grid with full cell border lining) */}
      <div className="classic-card">
        <div className="card-topbar">
          <div>
            <h3>Platform Earning Channels & Monetization Matrix</h3>
            <p>10 Core revenue channels defined in architecture specification</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              className="btn-classic text-[11px]" 
              onClick={() => {
                exportToCsv('Platform_10_Earning_Channels', earningModels.map(em => ({
                  ID: em.id,
                  Stream: em.name,
                  Configured_Rate: em.rate,
                  Billing_Unit: em.unit,
                  MTD_Revenue: `Rs. ${em.mtdRevenue}`,
                  Active_Ops: em.activeTransactions,
                  Status: em.status
                })));
                showToast('10 Monetization channels matrix exported to CSV.', 'success');
              }}
              title="Export Earning Matrix to CSV"
            >
              <Download size={12} />
              <span>Export CSV</span>
            </button>
            <button 
              className="btn-classic text-[11px]" 
              onClick={() => setActiveTab('finance')}
            >
              View Live Transactions
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th>Monetization Stream</th>
                <th>Configured Price / Rate</th>
                <th>Billing Unit</th>
                <th>MTD Gross Collection</th>
                <th>Active Operations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {earningModels.map((em) => (
                <tr key={em.id}>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{em.id}</td>
                  <td style={{ fontWeight: 600 }}>{em.name}</td>
                  <td style={{ fontWeight: 700, color: '#4338ca' }}>{em.rate}</td>
                  <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{em.unit}</td>
                  <td style={{ fontWeight: 700, color: '#047857' }}>
                    ₹ {em.mtdRevenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ fontSize: '0.76rem' }}>{em.activeTransactions} ops</td>
                  <td>
                    <span className="badge-pill badge-green">{em.status}</span>
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
