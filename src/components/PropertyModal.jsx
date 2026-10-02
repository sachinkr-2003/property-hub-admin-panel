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
  FileCheck
} from 'lucide-react';

export default function PropertyModal({ property, onClose, onUpdateStatus, onToggleFeatured }) {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const resolveImgUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `https://property-hub-backend-j0ea.onrender.com${url}`;
    return `https://property-hub-backend-j0ea.onrender.com/${url}`;
  };

  const images = property.images && property.images.length > 0 
    ? property.images.map(resolveImgUrl) 
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'];

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
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
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
