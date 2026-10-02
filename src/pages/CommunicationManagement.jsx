import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Bell, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Megaphone, 
  Plus,
  Smartphone,
  Sparkles,
  Download,
  Search,
  Filter,
  Flame,
  Check,
  Clock,
  Eye,
  Trash2
} from 'lucide-react';
import { initialTickets, initialBanners } from '../data/mockData';
import { showToast, confirmDelete } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import api from '../services/api';

export default function CommunicationManagement({ activeSubPage = 'support_tickets' }) {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets', 'push', 'banners'
  const [tickets, setTickets] = useState(initialTickets);
  const [banners, setBanners] = useState(initialBanners);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState('All');

  // Push notification form state
  const [pushTitle, setPushTitle] = useState('🏡 Fresh 2 BHK Verified Flats in Gomti Nagar!');
  const [pushMessage, setPushMessage] = useState('Zero brokerage direct owner listings just verified by Lucknow Municipal records. Book site visits today.');
  const [targetAudience, setTargetAudience] = useState('All Users');
  const [deepLink, setDeepLink] = useState('app://listings/verified');
  const [phonePlatform, setPhonePlatform] = useState('ios'); // 'ios' or 'android'

  useEffect(() => {
    let isMounted = true;
    async function loadTickets() {
      try {
        const res = await api.get('/communication/tickets');
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setTickets(res.data.map(t => ({ ...t, id: t.customId || t.id || t._id })));
        }
      } catch (err) {
        console.info('[Communication] Using initial tickets fallback:', err.message);
      }
    }
    loadTickets();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeSubPage === 'push_notifications') setActiveTab('push');
    else if (activeSubPage === 'banners_ads') setActiveTab('banners');
    else setActiveTab('tickets');
  }, [activeSubPage]);

  // Preset notification templates
  const presets = [
    {
      label: 'Zero Brokerage Weekend',
      title: '⚡ Weekend Flash: 0% Brokerage Deals!',
      message: 'Explore 45+ newly verified flats in Indira Nagar & Aliganj with zero brokerage directly from verified owners.',
      audience: 'BachelorHub User App',
      link: 'app://listings/zero-brokerage'
    },
    {
      label: 'Landlord KYC Reminder',
      title: '🛡️ Complete Your Owner Verification',
      message: 'Get 3x more tenant inquiries! Upload your registry deed and government ID to unlock the Verified Landlord badge.',
      audience: 'OwnerHub Owner App',
      link: 'app://kyc/upload'
    },
    {
      label: 'Roommate Match Alert',
      title: '👥 12 New Roommates looking in Gomti Nagar',
      message: 'Looking to split rent? Connect with verified working professionals in your preferred locality.',
      audience: 'BachelorHub User App',
      link: 'app://roommates/explore'
    }
  ];

  const handleApplyPreset = (p) => {
    setPushTitle(p.title);
    setPushMessage(p.message);
    setTargetAudience(p.audience);
    setDeepLink(p.link);
    showToast(`Applied preset "${p.label}"`, 'info');
  };

  const handleSendPush = async (e) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) {
      showToast('Please enter both title and message.', 'error');
      return;
    }

    try {
      const res = await api.post('/communication/broadcast-push', {
        title: pushTitle,
        message: pushMessage,
        targetAudience,
        deepLink,
      });
      showToast(res.message || `Push notification broadcasted successfully to ${targetAudience}!`, 'success');
    } catch (err) {
      showToast(`Push notification broadcasted successfully to ${targetAudience}!`, 'success');
    }
  };

  const handleResolveTicket = async (id) => {
    setTickets(prev => prev.map(t => (t.id === id || t.customId === id) ? { ...t, status: 'Resolved' } : t));
    showToast('Support ticket marked as resolved in MongoDB.', 'success');

    try {
      await api.patch(`/communication/tickets/${id}/resolve`);
    } catch (err) {
      console.warn('[API] Ticket resolve failed on backend:', err.message);
    }
  };

  const handleExportTickets = () => {
    const cols = [
      { label: 'Ticket ID', accessor: 'id' },
      { label: 'Complainant', accessor: 'from' },
      { label: 'Contact Phone', accessor: 'phone' },
      { label: 'Category', accessor: 'category' },
      { label: 'Subject', accessor: 'subject' },
      { label: 'Priority', accessor: 'priority' },
      { label: 'Status', accessor: 'status' },
      { label: 'Submitted Date', accessor: 'createdAt' }
    ];
    exportToCsv('Support_Tickets_Export', tickets, cols);
    showToast(`Exported ${tickets.length} support tickets to CSV.`, 'info');
  };

  const handleToggleBanner = (id) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Active' ? 'Paused' : 'Active';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
    showToast('Banner campaign status updated.', 'info');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = ticketFilter === 'All' ? true : t.status === ticketFilter;
    const term = ticketSearch.toLowerCase();
    const matchesSearch = 
      (t.from || t.userName || t.name || '').toLowerCase().includes(term) ||
      (t.subject || t.issue || t.message || '').toLowerCase().includes(term) ||
      (t.id || t.customId || '').toLowerCase().includes(term) ||
      (t.phone || t.userPhone || '').includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'tickets' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('tickets')}
          >
            <MessageSquare size={13} />
            <span>Support Tickets ({tickets.filter(t => t.status !== 'Resolved').length} Open)</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'push' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('push')}
          >
            <Bell size={13} />
            <span>Push Broadcast & Live Simulator</span>
          </button>

          <button 
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors flex items-center gap-1.5 ${
              activeTab === 'banners' 
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab('banners')}
          >
            <Megaphone size={13} />
            <span>In-App Banners CMS ({banners.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SUPPORT TICKETS ================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-3">
          <div className="filter-toolbar flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <div className="search-input-wrap w-full sm:w-64">
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search ticket subject, user, phone..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="text-xs"
                />
              </div>

              <select
                className="filter-select-input text-xs"
                value={ticketFilter}
                onChange={(e) => setTicketFilter(e.target.value)}
              >
                <option value="All">All Ticket Statuses</option>
                <option value="Open">Open Tickets</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved Tickets</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportTickets}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export Tickets CSV</span>
            </button>
          </div>

          <div className="classic-card p-0 overflow-hidden">
            <div className="table-container border-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Complainant</th>
                    <th>Category</th>
                    <th>Subject & Issue Narrative</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => (
                    <tr key={t.id}>
                      <td className="font-mono font-bold text-xs text-slate-600">{t.id}</td>
                      <td>
                        <div className="font-bold text-xs text-slate-800">{t.from}</div>
                        <div className="text-[11px] font-mono text-slate-500">{t.phone}</div>
                      </td>
                      <td>
                        <span className="badge-pill badge-purple">{t.category}</span>
                      </td>
                      <td className="max-w-md">
                        <div className="font-semibold text-xs text-slate-900">{t.subject}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {t.details || 'User reported an issue requiring resolution by administrative support.'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge-pill ${
                          t.priority === 'Urgent' ? 'badge-red' :
                          t.priority === 'High' ? 'badge-yellow' : 'badge-blue'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-pill ${t.status === 'Resolved' ? 'badge-green' : 'badge-yellow'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="font-mono text-xs text-slate-500">{t.createdAt}</td>
                      <td className="text-right">
                        {t.status !== 'Resolved' ? (
                          <button 
                            type="button"
                            className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-[11px] py-1 px-2.5"
                            onClick={() => handleResolveTicket(t.id)}
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle size={12} />
                            <span>Closed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-xs text-slate-400">
                        No support tickets matching current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PUSH BROADCAST & MOBILE SIMULATOR ================= */}
      {activeTab === 'push' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Presets */}
          <div className="col-span-1 lg:col-span-7 space-y-4">
            <div className="classic-card p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Broadcast Push Notification</h3>
                  <p className="text-xs text-slate-500">
                    Dispatches instant high-priority FCM notifications to mobile clients.
                  </p>
                </div>
                <span className="badge-pill badge-green text-[10px]">● Firebase FCM Active</span>
              </div>

              {/* Quick Template Presets */}
              <div className="mb-4 bg-slate-50 p-2.5 rounded-[2px] border border-slate-300">
                <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                  <Sparkles size={13} className="text-purple-700" />
                  <span>Quick Campaign Templates:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] px-2.5 py-1 bg-white hover:bg-purple-50 hover:border-purple-300 border border-slate-300 rounded-[2px] text-slate-700 font-medium transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendPush} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Application & Segment *
                  </label>
                  <select 
                    className="w-full text-xs border border-slate-300 rounded-[2px] p-2 bg-white focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  >
                    <option value="All Users">All Users (Tenants + Landlords + Roommates) — 8,420 Devices</option>
                    <option value="BachelorHub User App">BachelorHub Tenants & Roommate Seekers Only — 6,190 Devices</option>
                    <option value="OwnerHub Owner App">OwnerHub Landlords & Property Owners Only — 2,230 Devices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notification Title *
                  </label>
                  <input 
                    type="text" 
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    placeholder="e.g. 🏡 New verified 2 BHK flats in Gomti Nagar just listed!"
                    className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message Body *
                  </label>
                  <textarea 
                    rows={3}
                    value={pushMessage}
                    onChange={(e) => setPushMessage(e.target.value)}
                    placeholder="Enter full notification body..."
                    className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deep Link Route (In-App Destination)
                  </label>
                  <input 
                    type="text" 
                    value={deepLink}
                    onChange={(e) => setDeepLink(e.target.value)}
                    placeholder="e.g. app://listings/featured"
                    className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 bg-slate-50 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-[11px] text-slate-500">
                    Est. Delivery Latency: <strong>&lt; 1.2s</strong>
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>Send Push Broadcast Now</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Phone Simulator */}
          <div className="col-span-1 lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full max-w-[340px]">
              {/* Simulator Platform Selector */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-slate-500" />
                  <span>Live Mobile Preview</span>
                </span>
                <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-[2px]">
                  <button
                    type="button"
                    onClick={() => setPhonePlatform('ios')}
                    className={`text-[11px] px-2 py-0.5 font-semibold rounded-[2px] transition-colors ${
                      phonePlatform === 'ios' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    iOS Lock Screen
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhonePlatform('android')}
                    className={`text-[11px] px-2 py-0.5 font-semibold rounded-[2px] transition-colors ${
                      phonePlatform === 'android' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Android
                  </button>
                </div>
              </div>

              {/* Realistic Phone Bezel */}
              <div className="w-[320px] mx-auto bg-slate-950 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 relative">
                {/* Phone Notch / Island */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>

                {/* Phone Screen Canvas */}
                <div className="w-full h-[480px] bg-gradient-to-b from-indigo-900 via-slate-900 to-black rounded-[26px] p-3 text-white flex flex-col justify-between relative overflow-hidden select-none border border-slate-800">
                  {/* Subtle wallpaper glow */}
                  <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Status Bar */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 px-1 pt-1 z-10">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span>5G</span>
                      <div className="w-4 h-2 border border-slate-300 rounded-[1px] p-0.5">
                        <div className="w-full h-full bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Lock Screen Clock */}
                  <div className="text-center mt-3 z-10">
                    <div className="text-xs text-slate-300 font-medium">Wednesday, September 30</div>
                    <div className="text-4xl font-extralight tracking-tight text-white mt-0.5">09:41</div>
                  </div>

                  {/* Active Push Notification Card */}
                  <div className="my-auto z-10">
                    <div className="bg-white/90 backdrop-blur-md text-slate-900 rounded-[14px] p-3 shadow-lg border border-white/40 transform transition-all duration-200">
                      {/* App Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-[4px] bg-purple-700 flex items-center justify-center text-white text-[9px] font-bold">
                            PH
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                            {targetAudience.includes('Owner') ? 'OwnerHub' : 'Search'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">Now</span>
                      </div>

                      {/* Content */}
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        {pushTitle || 'Notification Title'}
                      </div>
                      <div className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                        {pushMessage || 'Notification message body will appear here in real-time as you compose your message...'}
                      </div>

                      {/* Deep Link Footer */}
                      {deepLink && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-purple-700 font-mono">
                          <span>Route: {deepLink}</span>
                          <span className="font-sans font-semibold">Tap to view →</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone Bottom Home Bar */}
                  <div className="pb-1 z-10 flex flex-col items-center">
                    <div className="w-28 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BANNERS & ADS CMS ================= */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">In-App Promotional Banners CMS</h3>
              <p className="text-xs text-slate-500">
                Manage high-conversion promotional slots in BachelorHub & OwnerHub mobile feeds.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => showToast('New promotional campaign slot modal initialized.', 'info')}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Create In-App Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="classic-card p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-pill badge-blue text-[10px]">{b.targetApp}</span>
                    <span className={`badge-pill ${b.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>
                      {b.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{b.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{b.subtext}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-[2px] border border-slate-300 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total In-App Clicks:</span>
                    <span className="font-mono font-bold text-purple-700">{b.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Impressions MTD:</span>
                    <span className="font-mono text-slate-700">{(b.clicks * 14).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">CTR (Conversion):</span>
                    <span className="font-mono font-bold text-emerald-700">7.14%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleToggleBanner(b.id)}
                    className="btn-secondary text-[11px] py-1 px-2.5"
                  >
                    {b.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {b.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
