import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RefreshCw, 
  AlertTriangle,
  ExternalLink,
  Eye
} from 'lucide-react';

export default function KycModal({ kycItem, onClose, onApprove, onReject }) {
  if (!kycItem) return null;

  const [remarks, setRemarks] = useState(kycItem.remarks || 'All documents verified against official LDA & Nagar Nigam records.');
  const [activeDocTab, setActiveDocTab] = useState('aadhaar');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [rejectionPreset, setRejectionPreset] = useState('');

  const ownerName = kycItem.name || kycItem.ownerName;
  const ownerMobile = kycItem.mobile || kycItem.phone;
  const ownerEmail = kycItem.email;
  const aadhaar = kycItem.documents?.aadhaar || kycItem.aadhaarNumber || 'Not Provided';
  const pan = kycItem.documents?.pan || kycItem.panNumber || 'Not Provided';
  const registry = kycItem.documents?.registry || 'Not Provided';
  const isVerified = kycItem.kycStatus === 'Verified' || kycItem.status === 'Verified';

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://property-hub-backend-j0ea.onrender.com';

  const resolveDocUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return trimmed.startsWith('/') ? `${API_BASE}${trimmed}` : `${API_BASE}/${trimmed}`;
  };

  const uploadedDocUrl = 
    activeDocTab === 'aadhaar' ? (kycItem.aadhaarUrl || kycItem.documents?.aadhaarUrl) :
    activeDocTab === 'pan' ? (kycItem.panUrl || kycItem.documents?.panUrl) :
    (kycItem.registryUrl || kycItem.deedDocUrl || kycItem.documents?.registryUrl);

  const realUrl = resolveDocUrl(uploadedDocUrl);
  const isPdf = realUrl.toLowerCase().includes('.pdf') || realUrl.startsWith('data:application/pdf');

  const docSamples = {
    aadhaar: {
      title: 'Government Aadhaar Card (Masked UID)',
      docNumber: aadhaar,
      issuer: 'UIDAI — Unique Identification Authority of India',
      status: 'UIDAI e-KYC Verified',
      date: '14 Jan 2026',
      sampleUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
      type: 'Identity Proof',
      badge: '✓ Aadhaar OTP Matched'
    },
    pan: {
      title: 'Permanent Account Number (PAN Card)',
      docNumber: pan,
      issuer: 'Income Tax Department of India (NSDL)',
      status: 'ITD Active Record',
      date: '02 Feb 2026',
      sampleUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80',
      type: 'Financial / Tax ID',
      badge: '✓ ITD Validated'
    },
    registry: {
      title: 'LDA Registered Sale Deed / House Tax Assessment',
      docNumber: 'REG-UP-LKO-2024/99182',
      issuer: 'Lucknow Development Authority & Nagar Nigam',
      status: 'Ownership Title Verified',
      date: '10 Nov 2024',
      sampleUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80',
      type: 'Property Ownership Title',
      badge: '✓ Municipality Registered'
    }
  };

  const currentDoc = docSamples[activeDocTab];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const handleApplyPreset = (reason) => {
    setRejectionPreset(reason);
    setRemarks(reason);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container max-w-4xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[2px] bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[130px] sm:max-w-none">
                  Owner KYC: {ownerName}
                </h3>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-[2px] border border-slate-300">
                  {kycItem.id}
                </span>
                <span className={`badge-pill ${isVerified ? 'badge-green' : 'badge-yellow'}`}>
                  {isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Contact: <strong className="text-slate-700">{ownerMobile}</strong> • Email: <strong className="text-slate-700">{ownerEmail}</strong>
              </div>
            </div>
          </div>
          <button className="btn-icon shrink-0" onClick={onClose} title="Close Modal">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body space-y-4">
          {/* Owner Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-[2px] border border-slate-300 text-xs">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Landlord / Owner</span>
              <span className="font-bold text-slate-900 truncate block">{ownerName}</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Mobile Verification</span>
              <span className="font-mono text-slate-700 truncate block">{ownerMobile}</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">PAN Number</span>
              <span className="font-mono font-bold text-slate-800">{pan}</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Aadhaar (UIDAI Masked)</span>
              <span className="font-mono text-slate-800">XXXX-XXXX-{aadhaar.slice(-4)}</span>
            </div>
          </div>

          {/* Document Inspector Section */}
          <div className="border border-slate-300 rounded-[2px] overflow-hidden">
            {/* Tabs for Document Switch */}
            <div className="bg-slate-100 border-b border-slate-300 flex items-center justify-between px-3 py-1.5">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => { setActiveDocTab('aadhaar'); handleResetView(); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-[2px] border transition-colors ${
                    activeDocTab === 'aadhaar'
                      ? 'bg-white border-slate-300 text-purple-700 shadow-xs'
                      : 'border-transparent text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  1. Aadhaar Card
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveDocTab('pan'); handleResetView(); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-[2px] border transition-colors ${
                    activeDocTab === 'pan'
                      ? 'bg-white border-slate-300 text-purple-700 shadow-xs'
                      : 'border-transparent text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  2. PAN Card
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveDocTab('registry'); handleResetView(); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-[2px] border transition-colors ${
                    activeDocTab === 'registry'
                      ? 'bg-white border-slate-300 text-purple-700 shadow-xs'
                      : 'border-transparent text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  3. Title Deed / Registry Proof
                </button>
              </div>

              {/* Inspector Zoom / Rotate Toolbar */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-mono text-slate-600 bg-white border border-slate-300 px-1.5 py-0.5 rounded-[2px] mr-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="btn-icon p-1"
                  title="Zoom In (+25%)"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="btn-icon p-1"
                  title="Zoom Out (-25%)"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="btn-icon p-1"
                  title="Rotate 90 Degrees"
                >
                  <RotateCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleResetView}
                  className="btn-icon p-1"
                  title="Reset View"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Document Preview Canvas */}
            <div className="bg-slate-900 p-4 min-h-[280px] max-h-[420px] overflow-auto flex items-center justify-center relative select-none">
              {realUrl ? (
                isPdf ? (
                  <div className="w-full max-w-xl bg-slate-950 p-2 border border-slate-700 rounded-[2px] space-y-2">
                    <div className="flex items-center justify-between text-xs text-white bg-slate-800 p-2 rounded-[2px]">
                      <span className="font-bold flex items-center gap-1.5 text-rose-400">
                        <FileText size={14} />
                        <span>Uploaded PDF Document ({activeDocTab.toUpperCase()})</span>
                      </span>
                      <button
                        type="button"
                        className="btn-classic text-xs py-0.5 px-2 bg-purple-600 hover:bg-purple-700 text-white border-purple-700 flex items-center gap-1 cursor-pointer"
                        onClick={() => window.open(realUrl, '_blank')}
                      >
                        <ExternalLink size={12} />
                        <span>Open PDF in New Tab</span>
                      </button>
                    </div>
                    <iframe 
                      src={realUrl} 
                      className="w-full h-80 rounded-[2px] bg-white border border-slate-700" 
                      title="Uploaded Document PDF"
                    />
                  </div>
                ) : (
                  <div 
                    className="transition-transform duration-200 shadow-2xl bg-white border border-slate-700 rounded-[2px] overflow-hidden max-w-lg w-full p-2 flex flex-col items-center"
                    style={{ 
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <div className="w-full flex items-center justify-between text-xs bg-slate-100 p-2 border-b border-slate-300 mb-2">
                      <span className="font-bold text-slate-800">{currentDoc.title}</span>
                      <button
                        type="button"
                        className="btn-classic text-xs py-0.5 px-2 text-purple-700 border-purple-300 hover:bg-purple-50 flex items-center gap-1 cursor-pointer"
                        onClick={() => window.open(realUrl, '_blank')}
                      >
                        <ExternalLink size={12} />
                        <span>Open Full</span>
                      </button>
                    </div>
                    <img 
                      src={realUrl} 
                      alt={currentDoc.title} 
                      className="max-h-72 w-auto object-contain rounded-[2px]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = currentDoc.sampleUrl;
                      }}
                    />
                  </div>
                )
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-[2px] p-8 max-w-md w-full text-center space-y-3 text-slate-300">
                  <div className="w-12 h-12 rounded-full bg-slate-700/60 text-amber-400 mx-auto flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-white">No {currentDoc.title} Uploaded</h4>
                  <p className="text-xs text-slate-400">
                    The landlord has not submitted an image or PDF file for this verification step.
                  </p>
                  <div className="text-xs font-mono bg-slate-900 py-1.5 px-3 rounded text-slate-300 border border-slate-700">
                    Provided ID: {currentDoc.docNumber || 'Not Provided'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Rejection Reasons */}
          {!isVerified && (
            <div className="bg-slate-50 p-2.5 rounded-[2px] border border-slate-300">
              <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-600" />
                <span>Quick Rejection Presets (Click to autofill notes):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Aadhaar name does not match Land Registry title deed',
                  'Uploaded photo / scan is blurry or unreadable',
                  'PAN card verification failed with Income Tax database',
                  'Missing municipal property tax receipt for current fiscal year'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-[2px] text-slate-700 text-left transition-colors"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verification Officer Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Verification Officer Remarks & Notes
            </label>
            <textarea 
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter specific verification notes or reasons for rejection..."
              className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer flex items-center justify-between flex-wrap gap-2">
          <button className="btn-secondary text-xs" onClick={onClose}>
            Close Dossier
          </button>
          
          <div className="flex items-center gap-2 flex-wrap">
            {!isVerified && (
              <button 
                type="button"
                className="btn-danger flex items-center gap-1.5"
                onClick={() => {
                  onReject(kycItem.id, remarks);
                  onClose();
                }}
              >
                <XCircle size={14} />
                <span>Reject KYC Application</span>
              </button>
            )}

            {!isVerified ? (
              <button 
                type="button"
                className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 flex items-center gap-1.5"
                onClick={() => {
                  onApprove(kycItem.id, remarks);
                  onClose();
                }}
              >
                <CheckCircle size={14} />
                <span>Approve & Grant Verified Badge</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle size={14} />
                <span>Already Approved & Verified</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
