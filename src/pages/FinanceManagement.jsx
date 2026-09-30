import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle, 
  RefreshCcw, 
  Download, 
  ArrowDownLeft,
  Zap,
  RotateCcw,
  Check,
  X,
  Search,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Edit2,
  Calendar
} from 'lucide-react';
import { initialTransactions, earningModels, initialRefundRequests } from '../data/mockData';
import { showToast, confirmDelete } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function FinanceManagement({ activeSubPage = 'transactions' }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [refundRequests, setRefundRequests] = useState(initialRefundRequests);
  const [models, setModels] = useState(earningModels);
  const [activeTab, setActiveTab] = useState('transactions');

  // Search & Filter state for Transactions
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Checkbox selection state
  const [selectedTxnIds, setSelectedTxnIds] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Subscription / Rate Modal state
  const [editingModel, setEditingModel] = useState(null);
  const [newRate, setNewRate] = useState('');

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    { id: 'SUB-FREE', tier: '100% Free Public Launch Plan', price: 0, period: 'Forever Free', activeSubscribers: 542, features: 'Unlimited listings • Zero brokerage • Free direct tenant contacts • Verified Landlord badge • Free search placement • Zero platform fees' }
  ]);

  const mockBoostedProperties = [
    { id: 'BST-01', propertyId: 'PROP-1001', title: 'Premium 2 BHK Furnished Flat Gomti Nagar', owner: 'Vikramaditya Roy', duration: '30 Days', fee: 999, views: 2480, expires: '2026-10-25', status: 'Running' },
    { id: 'BST-02', propertyId: 'PROP-1002', title: 'Spacious Independent 3 BHK Villa with Garden', owner: 'Ananya Deshmukh', duration: '15 Days', fee: 499, views: 1190, expires: '2026-10-10', status: 'Running' },
    { id: 'BST-03', propertyId: 'PROP-1004', title: 'Fully Serviced Commercial Office Suite', owner: 'Harshvardhan Kapoor', duration: '30 Days', fee: 999, views: 3840, expires: '2026-10-27', status: 'Running' },
  ];

  useEffect(() => {
    if (activeSubPage === 'earning_models') setActiveTab('earning_models');
    else if (activeSubPage === 'subscriptions') setActiveTab('subscriptions');
    else if (activeSubPage === 'featured_boosts') setActiveTab('featured_boosts');
    else if (activeSubPage === 'refunds') setActiveTab('refunds');
    else setActiveTab('transactions');
  }, [activeSubPage]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
      const matchesSearch = 
        t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.paymentId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });
  }, [transactions, searchTerm, statusFilter, sortField, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedTxnIds.length === paginatedTransactions.length && paginatedTransactions.length > 0) {
      setSelectedTxnIds([]);
    } else {
      setSelectedTxnIds(paginatedTransactions.map(t => t.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedTxnIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // CSV Export functions
  const handleExportTransactions = (data = filteredTransactions) => {
    const cols = [
      { label: 'Transaction ID', accessor: 'id' },
      { label: 'Payer Name', accessor: 'userName' },
      { label: 'User Role', accessor: 'userRole' },
      { label: 'Payment Purpose', accessor: 'purpose' },
      { label: 'Amount (INR)', accessor: 'amount' },
      { label: 'Gateway', accessor: 'gateway' },
      { label: 'Payment Reference', accessor: 'paymentId' },
      { label: 'Status', accessor: 'status' },
      { label: 'Timestamp', accessor: 'date' }
    ];
    exportToCsv('Razorpay_Settled_Transactions', data, cols);
    showToast(`Exported ${data.length} transactions to CSV.`, 'info');
  };

  const handleExportRefunds = () => {
    const cols = [
      { label: 'Refund ID', accessor: 'id' },
      { label: 'Beneficiary', accessor: 'user' },
      { label: 'Amount (INR)', accessor: 'amount' },
      { label: 'Reason', accessor: 'reason' },
      { label: 'Date Requested', accessor: 'date' },
      { label: 'Settlement Status', accessor: 'status' }
    ];
    exportToCsv('Financial_Refund_Ledger', refundRequests, cols);
    showToast(`Exported ${refundRequests.length} refund records to CSV.`, 'info');
  };

  const handleProcessRefund = async (id, amount, userName) => {
    const confirmed = await confirmDelete(
      `Approve Refund for ${userName}?`,
      `Amount of ₹${amount} will be electronically refunded via Razorpay Payouts Gateway immediately.`
    );
    if (confirmed) {
      setRefundRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Refund Processed' } : r));
      showToast(`Refund of ₹${amount} issued to ${userName} via Razorpay.`, 'success');
    }
  };

  const handleSaveRateChange = (e) => {
    e.preventDefault();
    if (!editingModel || !newRate) return;
    setModels(prev => prev.map(m => m.id === editingModel.id ? { ...m, rate: newRate } : m));
    showToast(`Updated pricing rate for "${editingModel.name}" to ${newRate}.`, 'success');
    setEditingModel(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Financial KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Monthly Collections</span>
            <div className="w-7 h-7 rounded-[2px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">₹ 4,85,200</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight size={12} />
            <span>+22.4% vs last month</span>
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Free Landlord Memberships</span>
            <div className="w-7 h-7 rounded-[2px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CreditCard size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">542 Landlords</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% Free Lifetime Access
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Featured Boost Revenue</span>
            <div className="w-7 h-7 rounded-[2px] bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">₹ 89,400</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            198 active boosts running
          </div>
        </div>

        <div className="classic-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payment Gateway SLA</span>
            <div className="w-7 h-7 rounded-[2px] bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-300">
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">Razorpay API</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Daily T+1 Settlement at 23:59 IST
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'transactions' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            <CreditCard size={13} />
            <span>Live Payments & Ledger ({transactions.length})</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'subscriptions' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <Zap size={13} />
            <span>Landlord Subscriptions (100% Free Mode)</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'featured_boosts' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('featured_boosts')}
          >
            <TrendingUp size={13} />
            <span>Featured Boost Listings ({mockBoostedProperties.length})</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'earning_models' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('earning_models')}
          >
            <DollarSign size={13} />
            <span>10 Earning Channels</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'refunds' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('refunds')}
          >
            <RotateCcw size={13} />
            <span>Refund Management ({refundRequests.filter(r => r.status.includes('Pending')).length} Pending)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: LIVE TRANSACTIONS ================= */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="filter-toolbar flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <div className="search-input-wrap w-full sm:w-64">
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search payer, purpose, ID, ref..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs"
                />
              </div>

              <select 
                className="filter-select-input text-xs"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Transactions</option>
                <option value="Success">Success (Settled)</option>
                <option value="Refunded">Refunded Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => handleExportTransactions(filteredTransactions)}
                className="btn-secondary text-xs flex items-center gap-1.5"
                title="Download CSV statement of filtered payments"
              >
                <Download size={13} />
                <span>Export Statement CSV</span>
              </button>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedTxnIds.length > 0 && (
            <div className="bg-purple-50 border border-purple-300 p-2.5 rounded-[2px] flex items-center justify-between text-xs text-purple-950 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="font-bold bg-purple-700 text-white px-2 py-0.5 rounded-[2px] font-mono text-[11px]">
                  {selectedTxnIds.length} Transactions Selected
                </span>
                <span>Actions on checked payment records:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sel = transactions.filter(t => selectedTxnIds.includes(t.id));
                    handleExportTransactions(sel);
                  }}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Download size={12} />
                  <span>Export Selected Records CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTxnIds([])}
                  className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedTxnIds.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                        onChange={handleToggleSelectAll}
                        className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                        title="Select all on this page"
                      />
                    </th>
                    <th onClick={() => handleSort('id')} className="cursor-pointer select-none">
                      <div className="flex items-center gap-1">
                        <span>Transaction ID</span>
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('userName')} className="cursor-pointer select-none">
                      <div className="flex items-center gap-1">
                        <span>User / Payer</span>
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th>Payment Purpose</th>
                    <th onClick={() => handleSort('amount')} className="cursor-pointer select-none text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span>Amount (INR)</span>
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th>Gateway Ref ID</th>
                    <th onClick={() => handleSort('date')} className="cursor-pointer select-none">
                      <div className="flex items-center gap-1">
                        <span>Date & Time</span>
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((t) => {
                    const isSelected = selectedTxnIds.includes(t.id);
                    return (
                      <tr key={t.id} className={isSelected ? 'bg-purple-50/50' : ''}>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(t.id)}
                            className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="font-mono font-bold text-xs text-slate-600">
                          {t.id}
                        </td>
                        <td>
                          <div className="font-bold text-xs text-slate-800">{t.userName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{t.userRole}</div>
                        </td>
                        <td>
                          <div className="text-xs font-semibold text-slate-800">{t.purpose}</div>
                        </td>
                        <td className="text-right font-mono font-bold text-xs">
                          <span className={t.status === 'Refunded' ? 'text-red-700' : 'text-emerald-700'}>
                            ₹ {t.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <div className="font-semibold text-xs text-purple-700">{t.gateway}</div>
                          <div className="text-[11px] font-mono text-slate-500">{t.paymentId}</div>
                        </td>
                        <td className="font-mono text-xs text-slate-500">
                          {t.date}
                        </td>
                        <td className="text-center">
                          <span className={`badge-pill ${t.status === 'Success' ? 'badge-green' : 'badge-red'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedTransactions.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-xs text-slate-400">
                        No transactions matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <TablePagination
              totalItems={filteredTransactions.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      {/* ================= TAB 2: SUBSCRIPTION PLANS ================= */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          {/* 100% Free Public Launch Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-[2px] p-4 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-full text-emerald-700 shrink-0">
              <CheckCircle size={20} />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-emerald-900 text-sm">🎉 100% Free Public Launch Active</h4>
              <p className="text-emerald-800 mt-1 leading-relaxed">
                Property Hub is currently operating in <strong>100% Free Lifetime Mode</strong>. All subscription fees, listing charges, and brokerage commissions are completely waived (₹0) for all landlords, owners, and tenants. No payment gateway or paid checkout is required.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Landlord Membership & Plan Status</h3>
              <p className="text-xs text-slate-500">
                All property owners and landlords receive instant unlimited free listings and verified badges with zero charges.
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => showToast('100% Free tier verified across all client apps.', 'success')}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-xs shrink-0 self-start sm:self-auto"
            >
              Verify Free Status Across Apps
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="classic-card p-5 flex flex-col justify-between space-y-4 border-2 border-emerald-500">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-slate-900">{plan.tier}</h4>
                    <span className="badge-pill badge-green text-xs font-bold">● Active (100% Free)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-emerald-700 font-mono">₹{plan.price}</span>
                    <span className="text-sm text-slate-600 font-bold">/ {plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-emerald-50 p-3 rounded-[2px] border border-emerald-200 font-medium">
                    {plan.features}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Active Free Landlords</span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">{plan.activeSubscribers} Registered</span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-[2px]">
                    No Billing Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: FEATURED BOOST LISTINGS ================= */}
      {activeTab === 'featured_boosts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Featured Property Boosts</h3>
              <p className="text-xs text-slate-500">
                Top-of-feed paid sponsorships driving 3.5x more inquiries to landlords.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const cols = [
                  { label: 'Boost ID', accessor: 'id' },
                  { label: 'Property Title', accessor: 'title' },
                  { label: 'Owner', accessor: 'owner' },
                  { label: 'Duration', accessor: 'duration' },
                  { label: 'Fee Paid (INR)', accessor: 'fee' },
                  { label: 'Impressions', accessor: 'views' },
                  { label: 'Expires', accessor: 'expires' }
                ];
                exportToCsv('Featured_Boosts_Active', mockBoostedProperties, cols);
                showToast(`Exported ${mockBoostedProperties.length} active boosts to CSV.`, 'info');
              }}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Boosts CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Boost ID</th>
                    <th>Property Listing</th>
                    <th>Landlord / Advertiser</th>
                    <th>Boost Duration</th>
                    <th>Fee Paid</th>
                    <th>Discovery Impressions</th>
                    <th>Campaign Expiry</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBoostedProperties.map((b) => (
                    <tr key={b.id}>
                      <td className="font-mono font-bold text-xs text-slate-600">{b.id}</td>
                      <td>
                        <div className="font-bold text-xs text-slate-800">{b.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">ID: {b.propertyId}</div>
                      </td>
                      <td className="text-xs text-slate-700 font-medium">{b.owner}</td>
                      <td>
                        <span className="badge-pill badge-purple">{b.duration}</span>
                      </td>
                      <td className="font-mono font-bold text-xs text-emerald-700">
                        ₹ {b.fee}
                      </td>
                      <td className="font-mono font-bold text-xs text-slate-800">
                        {b.views.toLocaleString()} views
                      </td>
                      <td className="font-mono text-xs text-slate-500">{b.expires}</td>
                      <td className="text-center">
                        <span className="badge-pill badge-green">★ Running Live</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: 10 EARNING CHANNELS MATRIX ================= */}
      {activeTab === 'earning_models' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Platform Earning Channels & Monetization Matrix</h3>
              <p className="text-xs text-slate-500">
                10 distinct monetization streams defined in the Property Hub platform architecture.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const cols = [
                  { label: 'Channel ID', accessor: 'id' },
                  { label: 'Channel Name', accessor: 'name' },
                  { label: 'Rate / Price', accessor: 'rate' },
                  { label: 'Billing Unit', accessor: 'unit' },
                  { label: 'MTD Revenue', accessor: 'mtdRevenue' },
                  { label: 'Transactions', accessor: 'activeTransactions' }
                ];
                exportToCsv('Platform_10_Earning_Channels', models, cols);
                showToast('Exported 10 Earning Channels to CSV.', 'info');
              }}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Channels CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th>Earning Channel Specification</th>
                    <th>Configured Price / Rate</th>
                    <th>Billing Cadence</th>
                    <th className="text-right">MTD Gross Collection</th>
                    <th className="text-center">Transactions</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((em) => (
                    <tr key={em.id}>
                      <td className="font-mono font-bold text-xs text-slate-400">#{em.id}</td>
                      <td className="font-bold text-xs text-slate-900">{em.name}</td>
                      <td className="font-mono font-bold text-xs text-purple-700">{em.rate}</td>
                      <td className="text-xs text-slate-500">{em.unit}</td>
                      <td className="text-right font-mono font-bold text-xs text-emerald-700">
                        ₹ {em.mtdRevenue.toLocaleString('en-IN')}
                      </td>
                      <td className="text-center font-mono font-bold text-xs text-slate-800">
                        {em.activeTransactions}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingModel(em);
                            setNewRate(em.rate);
                          }}
                          className="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Edit2 size={11} />
                          <span>Configure</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: REFUNDS & DISPUTES ================= */}
      {activeTab === 'refunds' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Refund Requests & Disputed Payments</h3>
              <p className="text-xs text-slate-500">
                Process customer reversals through the automated Razorpay Payouts settlement gateway.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportRefunds}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Refunds CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Refund ID</th>
                    <th>Beneficiary Customer</th>
                    <th className="text-right">Reversal Amount</th>
                    <th>Reason / Dispute Narrative</th>
                    <th>Date Requested</th>
                    <th>Settlement Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {refundRequests.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono font-bold text-xs text-slate-600">{r.id}</td>
                      <td className="font-bold text-xs text-slate-800">{r.user}</td>
                      <td className="text-right font-mono font-bold text-xs text-red-700">
                        ₹ {r.amount}
                      </td>
                      <td className="text-xs text-slate-700 max-w-sm">{r.reason}</td>
                      <td className="font-mono text-xs text-slate-500">{r.date}</td>
                      <td>
                        <span className={`badge-pill ${r.status.includes('Processed') ? 'badge-green' : 'badge-yellow'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="text-right">
                        {!r.status.includes('Processed') ? (
                          <button 
                            type="button"
                            className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-[11px] py-1 px-2.5"
                            onClick={() => handleProcessRefund(r.id, r.amount, r.user)}
                          >
                            Approve & Pay API
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle size={12} />
                            <span>Settled</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rate / Configuration Modal */}
      {editingModel && (
        <div className="modal-overlay" onClick={() => setEditingModel(null)}>
          <div className="modal-container max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-sm font-bold text-slate-900">
                Configure Pricing: {editingModel.name}
              </h3>
              <button className="btn-icon" onClick={() => setEditingModel(null)}>
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleSaveRateChange}>
              <div className="modal-body space-y-3">
                <div className="text-xs text-slate-600">
                  Update active platform pricing or billing rate. This change takes effect immediately across all apps.
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Configured Pricing Rate *
                  </label>
                  <input
                    type="text"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="e.g. ₹99 - ₹299"
                    className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer flex items-center justify-end gap-2">
                <button type="button" className="btn-secondary" onClick={() => setEditingModel(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
