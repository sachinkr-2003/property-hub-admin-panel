import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Star, 
  MapPin, 
  User, 
  Shield, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  FileCheck,
  FileText,
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';

const FALLBACK_PROPERTY_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

export default function PropertyModal({ property, onClose, onUpdateStatus, onToggleFeatured }) {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showDeedFull, setShowDeedFull] = useState(false);

  const resolveImgUrl = (url) => {
    if (!url || typeof url !== 'string') return FALLBACK_PROPERTY_IMG;
    const trimmed = url.trim();
    if (!trimmed) return FALLBACK_PROPERTY_IMG;
    if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) return trimmed;
    if (trimmed.startsWith('file:') || trimmed.includes(':\\') || trimmed.startsWith('/data/') || trimmed.startsWith('/storage/')) {
      return FALLBACK_PROPERTY_IMG;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const base = 'https://property-hub-backend-j0ea.onrender.com';
    return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
  };

  const resolveDocUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const base = 'https://property-hub-backend-j0ea.onrender.com';
    return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
  };

  const rawImages = (property.images && Array.isArray(property.images) && property.images.length > 0)
    ? property.images
    : [FALLBACK_PROPERTY_IMG];

  const images = rawImages.map(resolveImgUrl);

  const deedUrl = property.deedDocUrl || property.deedDocument || '';
  const resolvedDeedUrl = resolveDocUrl(deedUrl);
  const isDeedPdf = deedUrl.toLowerCase().includes('.pdf') || deedUrl.startsWith('data:application/pdf');

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-container ${isZoomed ? 'max-w-4xl' : 'max-w-2xl'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <span className="font-mono font-bold text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-[2px] border border-slate-300">
              {property.id}
            </span>
            <span className={`badge-pill ${
              property.status === 'Active' ? 'badge-green' :
              property.status === 'Pending Verification' ? 'badge-yellow' : 'badge-red'
            }`}>
              {property.status}
            </span>
            {property.isFeatured && (
              <span className="badge-pill badge-yellow">★ Featured</span>
            )}
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 ml-1 truncate max-w-[120px] sm:max-w-xs">
              {property.title}
            </h3>
          </div>
          <button 
            type="button" 
            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-300 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer" 
            onClick={onClose}
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body space-y-4">
          {/* Multi-Photo Carousel Box */}
          <div className="relative bg-slate-950 rounded-[2px] overflow-hidden border border-slate-300 group">
            <div className={`w-full overflow-hidden flex items-center justify-center ${isZoomed ? 'h-96' : 'h-64'}`}>
              <img 
                src={images[activeImageIndex]} 
                alt={`${property.title} photo ${activeImageIndex + 1}`} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_PROPERTY_IMG;
                }}
                className="w-full h-full object-cover transition-all duration-200"
              />
            </div>

            {/* Prev / Next Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[2px] bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all border border-white/20"
                  title="Previous Photo"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[2px] bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all border border-white/20"
                  title="Next Photo"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Zoom Toggle Button */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-2 right-2 p-1.5 rounded-[2px] bg-black/60 hover:bg-black/80 text-white cursor-pointer border border-white/20"
              title={isZoomed ? "Exit Expanded View" : "Expand Photo View"}
            >
              {isZoomed ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            {/* Photo Counter Indicator */}
            <span className="absolute bottom-2 left-2 text-[10px] font-mono font-semibold bg-black/70 text-white px-2 py-0.5 rounded-[2px] border border-white/20">
              {activeImageIndex + 1} / {images.length} Photos
            </span>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-[2px] overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                    idx === activeImageIndex 
                      ? 'border-indigo-700 ring-2 ring-indigo-700/20' 
                      : 'border-slate-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`thumb-${idx}`} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_PROPERTY_IMG;
                    }}
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}

          {/* Key Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 border border-slate-300 p-3 rounded-[2px]">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Rent / Price</div>
              <div className="text-base font-bold text-emerald-700">
                ₹ {property.price.toLocaleString('en-IN')} <span className="text-[10px] text-slate-500 font-normal">{property.priceUnit}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Security Deposit</div>
              <div className="text-sm font-semibold text-slate-900">
                {property.deposit ? `₹ ${property.deposit.toLocaleString('en-IN')}` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Configuration</div>
              <div className="text-sm font-semibold text-slate-900">
                {property.bhk > 0 ? `${property.bhk} BHK • ` : ''}{property.type}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">Carpet Area</div>
              <div className="text-sm font-semibold text-slate-900">
                {property.areaSqFt} Sq.Ft ({property.furnishing})
              </div>
            </div>
          </div>

          {/* Location & Target */}
          <div className="space-y-1.5 text-xs text-slate-700 bg-white border border-slate-300 p-3 rounded-[2px]">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-indigo-700 shrink-0" />
              <span><strong>Address:</strong> {property.address}, {property.locality}, {property.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-sky-700 shrink-0" />
              <span><strong>Allowed Tenants:</strong> {property.targetTenant}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Listing Overview & Amenities</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-300 p-3 rounded-[2px]">
              {property.description}
            </p>
          </div>

          {/* Landlord Contact & Verification Status */}
          <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-200 rounded-[2px]">
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-700">Landlord / Lister Contact</div>
              <div className="text-xs font-bold text-slate-900">{property.ownerName} ({property.ownerRole})</div>
              <div className="text-[11px] text-slate-600 font-mono">{property.ownerPhone}</div>
            </div>
            <span className={`badge-pill ${property.isVerified ? 'badge-green' : 'badge-yellow'}`}>
              <FileCheck size={11} />
              <span>{property.isVerified ? 'Deed Verified' : 'Deed Pending Verification'}</span>
            </span>
          </div>

          {/* Ownership Proof & Title Deed Document (PDF & Scanned Paper) */}
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-[2px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <FileCheck size={14} className="text-purple-700" />
                <span>Ownership Proof / Title Deed Document (Registry / Bill)</span>
              </div>
              {resolvedDeedUrl ? (
                <span className="badge-pill badge-green text-[10px]">Attached Proof Available</span>
              ) : (
                <span className="badge-pill badge-yellow text-[10px]">Proof Pending</span>
              )}
            </div>

            {resolvedDeedUrl ? (
              <div className="bg-white border border-slate-200 p-3 rounded-[2px] space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-[2px] flex items-center justify-center font-bold text-xs ${
                      isDeedPdf ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {isDeedPdf ? 'PDF' : 'IMG'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {property.deedDocName || (isDeedPdf ? 'Property Title Deed (PDF)' : 'Registry Photo Proof')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isDeedPdf ? 'Official PDF Registry / Sale Deed Document' : 'High-Resolution Document Scan'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="btn-classic text-xs py-1 px-2.5 flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 cursor-pointer"
                      onClick={() => window.open(resolvedDeedUrl, '_blank')}
                      title="Open Document in Full New Tab"
                    >
                      <ExternalLink size={12} />
                      <span>Open Document</span>
                    </button>
                    <button
                      type="button"
                      className="btn-classic text-xs py-1 px-2 flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowDeedFull(!showDeedFull)}
                      title="Toggle inline preview"
                    >
                      <FileText size={12} />
                      <span>{showDeedFull ? 'Hide Preview' : 'Preview'}</span>
                    </button>
                  </div>
                </div>

                {/* Inline Deed Preview if requested or default */}
                {showDeedFull && (
                  <div className="mt-2 border border-slate-200 rounded-[2px] overflow-hidden bg-slate-950 p-2">
                    {isDeedPdf ? (
                      <iframe 
                        src={resolvedDeedUrl} 
                        className="w-full h-80 rounded-[2px] bg-white border border-slate-700"
                        title="Property Title Deed PDF"
                      />
                    ) : (
                      <div className="max-h-80 overflow-auto flex items-center justify-center">
                        <img 
                          src={resolvedDeedUrl} 
                          alt="Ownership Registry Document" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_PROPERTY_IMG;
                          }}
                          className="max-h-72 w-auto object-contain rounded-[2px]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2.5 text-xs text-amber-800 bg-amber-50/60 border border-amber-200 rounded-[2px] flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-amber-600" />
                <span>Owner has not uploaded a digital registry deed/PDF yet. You can inspect contact details or contact owner to verify ownership before approving.</span>
              </div>
            )}
          </div>

          {/* Quick Verification Actions Bar for Pending Review */}
          {property.status === 'Pending Verification' && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-[2px] flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-700" />
                  <span>Pending Listing Verification Required</span>
                </div>
                <div className="text-[11px] text-amber-800">
                  Approve this listing to mark deed verified and publish live to mobile users.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-classic text-xs py-1.5 px-3 bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    onUpdateStatus(property.id, 'Active');
                    onClose();
                  }}
                >
                  <CheckCircle size={13} />
                  <span>Approve & Verify Listing</span>
                </button>
                <button
                  type="button"
                  className="btn-classic text-xs py-1.5 px-2.5 bg-rose-600 text-white border-rose-700 hover:bg-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    onUpdateStatus(property.id, 'Rejected');
                    onClose();
                  }}
                >
                  <XCircle size={13} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer">
          <button type="button" className="btn-classic text-xs" onClick={onClose}>
            Close
          </button>
          
          <button 
            type="button"
            className="btn-classic text-xs"
            onClick={() => onToggleFeatured(property.id)}
          >
            <Star size={13} fill={property.isFeatured ? '#d97706' : 'none'} color={property.isFeatured ? '#d97706' : 'currentColor'} />
            <span>{property.isFeatured ? 'Unfeature' : 'Feature Listing'}</span>
          </button>

          {property.status !== 'Active' && (
            <button 
              type="button"
              className="btn-classic btn-primary-purple text-xs"
              onClick={() => {
                onUpdateStatus(property.id, 'Active');
                onClose();
              }}
            >
              <CheckCircle size={13} />
              <span>Approve Listing</span>
            </button>
          )}

          {property.status !== 'Rejected' && (
            <button 
              type="button"
              className="btn-classic btn-danger text-xs"
              onClick={() => {
                onUpdateStatus(property.id, 'Rejected');
                onClose();
              }}
            >
              <XCircle size={13} />
              <span>Reject Listing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
