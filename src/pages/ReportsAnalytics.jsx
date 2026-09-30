import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Home, 
  ShieldCheck, 
  CheckCircle2,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  Printer,
  Sparkles
} from 'lucide-react';
import { mockRevenueTrends } from '../data/mockData';
import { showToast } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';

export default function ReportsAnalytics({ activeSubPage = 'platform_analytics' }) {
  const [activeTab, setActiveTab] = useState('platform');
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'fy2026'

  useEffect(() => {
    if (activeSubPage === 'user_reports_analytics') setActiveTab('user');
    else if (activeSubPage === 'property_reports') setActiveTab('property');
    else if (activeSubPage === 'revenue_reports') setActiveTab('revenue');
    else setActiveTab('platform');
  }, [activeSubPage]);

  const userDemographics = [
    { cohort: 'Student Bachelors (Colleges / Universities)', count: '4,630', percent: '55.0%', avgRent: '₹ 8,500 / mo', retention: '92%', preferredLocalities: 'Gomti Nagar, Jankipuram' },
    { cohort: 'Working Professionals (IT / Corporate)', count: '2,526', percent: '30.0%', avgRent: '₹ 14,200 / mo', retention: '96%', preferredLocalities: 'Vibhuti Khand, Indira Nagar' },
    { cohort: 'Nuclear Families', count: '842', percent: '10.0%', avgRent: '₹ 22,000 / mo', retention: '98%', preferredLocalities: 'Aliganj, Mahanagar' },
    { cohort: 'Commercial / Co-working Offices', count: '422', percent: '5.0%', avgRent: '₹ 45,000 / mo', retention: '89%', preferredLocalities: 'Hazratganj, Shaheed Path' },
  ];

  const propertyVelocity = [
    { type: '1 BHK / Studio Flat', avgDaysToRent: '4.2 Days', demandIndex: 'Very High (18 inquiries/listing)', supplyCount: 320, rentalYield: '6.2%' },
    { type: '2 BHK Residential Apartment', avgDaysToRent: '8.6 Days', demandIndex: 'High (14 inquiries/listing)', supplyCount: 480, rentalYield: '5.4%' },
    { type: 'PG / Co-living Beds', avgDaysToRent: '3.1 Days', demandIndex: 'Extremely High (24 inquiries/bed)', supplyCount: 260, rentalYield: '8.8%' },
    { type: 'Independent Villa / House', avgDaysToRent: '14.8 Days', demandIndex: 'Moderate (6 inquiries/listing)', supplyCount: 110, rentalYield: '4.1%' },
    { type: 'Commercial Office Space', avgDaysToRent: '21.5 Days', demandIndex: 'Moderate (4 inquiries/listing)', supplyCount: 78, rentalYield: '7.5%' }
  ];

  const handleExportDemographics = () => {
    const cols = [
      { label: 'Demographic Cohort', accessor: 'cohort' },
      { label: 'Active User Count', accessor: 'count' },
      { label: 'Share (%)', accessor: 'percent' },
      { label: 'Avg Monthly Budget', accessor: 'avgRent' },
      { label: 'Retention Rate', accessor: 'retention' },
      { label: 'Top Localities', accessor: 'preferredLocalities' }
    ];
    exportToCsv('Tenant_Demographics_Audit', userDemographics, cols);
    showToast('Exported User Demographics to CSV.', 'info');
  };

  const handleExportVelocity = () => {
    const cols = [
      { label: 'Property Type', accessor: 'type' },
      { label: 'Avg Days To Rent', accessor: 'avgDaysToRent' },
      { label: 'Demand Index', accessor: 'demandIndex' },
      { label: 'Market Supply', accessor: 'supplyCount' },
      { label: 'Rental Yield', accessor: 'rentalYield' }
    ];
    exportToCsv('Property_Velocity_Audit', propertyVelocity, cols);
    showToast('Exported Property Velocity to CSV.', 'info');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'platform' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('platform')}
          >
            <Activity size={13} />
            <span>Platform Health & Velocity</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'user' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('user')}
          >
            <Users size={13} />
            <span>Tenant Demographics Reports</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'property' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('property')}
          >
            <Home size={13} />
            <span>Property Turnaround Velocity</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'revenue' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('revenue')}
          >
            <TrendingUp size={13} />
            <span>Revenue Growth & Projections</span>
          </button>
        </div>

        {/* Date Filter & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 border border-slate-300 rounded-[2px]">
            <button
              type="button"
              onClick={() => setDateRange('week')}
              className={`text-[11px] px-2 py-0.5 font-semibold rounded-[2px] transition-colors ${dateRange === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setDateRange('month')}
              className={`text-[11px] px-2 py-0.5 font-semibold rounded-[2px] transition-colors ${dateRange === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Sep 2026
            </button>
            <button
              type="button"
              onClick={() => setDateRange('quarter')}
              className={`text-[11px] px-2 py-0.5 font-semibold rounded-[2px] transition-colors ${dateRange === 'quarter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Q3 Run Rate
            </button>
            <button
              type="button"
              onClick={() => setDateRange('fy2026')}
              className={`text-[11px] px-2 py-0.5 font-semibold rounded-[2px] transition-colors ${dateRange === 'fy2026' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              FY 2026-27
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintSummary}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Print audit executive report"
          >
            <Printer size={13} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-4 gap-3.5">
        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly User Inflow</span>
            <div className="w-7 h-7 rounded-[2px] bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Users size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">+840 Users/mo</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} />
            <span>65% Bachelors • 35% Families</span>
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Listing Turnaround (Median)</span>
            <div className="w-7 h-7 rounded-[2px] bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Home size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">9.4 Days</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            From verified post to lease signed
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Legal Deed Pass Rate</span>
            <div className="w-7 h-7 rounded-[2px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">96.2% Clean</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Zero fraudulent deposits detected
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Annual Gross Run Rate</span>
            <div className="w-7 h-7 rounded-[2px] bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">₹ 58.2 Lakh</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} />
            <span>+24% projected Q4</span>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: PLATFORM HEALTH & VELOCITY ================= */}
      {(activeTab === 'platform' || activeTab === 'revenue') && (
        <div className="classic-card p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Recurring Revenue Velocity & Listing Influx
              </h3>
              <p className="text-xs text-slate-500">
                Revenue trajectory and new verified listing intake across H1-H2 2026.
              </p>
            </div>
            <span className="badge-pill badge-green text-[10px]">● Financial Audit Verified</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-between h-48 pt-4 pb-2 border-b border-slate-200 gap-3 px-4">
            {mockRevenueTrends.map((item, idx) => {
              const heightPercent = Math.round((item.revenue / 500000) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end gap-1.5 group cursor-pointer">
                  <span className="text-[11px] font-mono font-bold text-purple-800 opacity-90 group-hover:scale-110 transition-transform">
                    ₹{(item.revenue / 1000).toFixed(0)}k
                  </span>
                  <div 
                    className="w-full max-w-[42px] bg-purple-700 group-hover:bg-purple-800 transition-colors rounded-[2px] relative"
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.month}: ₹${item.revenue.toLocaleString('en-IN')} (${item.listings} listings)`}
                  />
                  <span className="text-xs font-semibold text-slate-600 mt-1">
                    {item.month}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.listings} listings
                  </span>
                </div>
              );
            })}
          </div>

          {/* System Health Specs Table */}
          <div className="table-container border-0 mt-2">
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="font-bold text-xs bg-slate-50 w-56 text-slate-700">Platform Cloud SLA</td>
                  <td><span className="badge-pill badge-green">99.98% High Availability</span></td>
                  <td className="font-bold text-xs bg-slate-50 w-56 text-slate-700">Average API Latency</td>
                  <td className="font-mono font-bold text-xs text-slate-800">42 ms (Asia-South1 Mumbai Edge)</td>
                </tr>
                <tr>
                  <td className="font-bold text-xs bg-slate-50 text-slate-700">Payment Webhook Health</td>
                  <td><span className="badge-pill badge-green">100% Reliable (Razorpay Live)</span></td>
                  <td className="font-bold text-xs bg-slate-50 text-slate-700">Push Notification Gateway</td>
                  <td className="text-xs text-slate-700">Firebase Cloud Messaging (FCM Dedicated High-Priority)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TENANT DEMOGRAPHICS ================= */}
      {activeTab === 'user' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registered Tenant Demographics & Budget Segments</h3>
              <p className="text-xs text-slate-500">
                Segment breakdown across universities, tech parks, and corporate hubs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportDemographics}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Demographics CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User Demographic Segment</th>
                    <th className="text-right">Active User Count</th>
                    <th className="text-center">Platform Share</th>
                    <th className="text-right">Average Budget</th>
                    <th className="text-center">Retention</th>
                    <th>High-Demand Localities</th>
                  </tr>
                </thead>
                <tbody>
                  {userDemographics.map((row, idx) => (
                    <tr key={idx}>
                      <td className="font-bold text-xs text-slate-900">{row.cohort}</td>
                      <td className="text-right font-mono font-bold text-xs text-slate-800">{row.count}</td>
                      <td className="text-center">
                        <span className="badge-pill badge-purple">{row.percent}</span>
                      </td>
                      <td className="text-right font-mono font-bold text-xs text-emerald-700">
                        {row.avgRent}
                      </td>
                      <td className="text-center">
                        <span className="badge-pill badge-green">{row.retention}</span>
                      </td>
                      <td className="text-xs text-slate-600 font-medium">{row.preferredLocalities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PROPERTY VELOCITY ================= */}
      {activeTab === 'property' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Property Rental Turnaround Velocity</h3>
              <p className="text-xs text-slate-500">
                Days taken from verified publication to successful tenant move-in and deposit clearance.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportVelocity}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Velocity CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Property Category</th>
                    <th className="text-right">Turnaround Speed</th>
                    <th>Inquiry Demand Velocity</th>
                    <th className="text-right">Active Catalog Supply</th>
                    <th className="text-center">Owner Rental Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyVelocity.map((p, idx) => (
                    <tr key={idx}>
                      <td className="font-bold text-xs text-slate-900">{p.type}</td>
                      <td className="text-right font-mono font-bold text-xs text-purple-700">
                        {p.avgDaysToRent}
                      </td>
                      <td>
                        <span className="badge-pill badge-green">{p.demandIndex}</span>
                      </td>
                      <td className="text-right font-mono font-bold text-xs text-slate-800">
                        {p.supplyCount} units
                      </td>
                      <td className="text-center font-mono font-bold text-xs text-emerald-700">
                        {p.rentalYield}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
