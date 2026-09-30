import React, { useState } from 'react';
import { X, Plus, Building2 } from 'lucide-react';
import { showToast } from '../utils/alerts';

export default function AddPropertyModal({ isOpen, onClose, onAddProperty }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    type: 'Flat',
    listingType: 'Rent',
    price: '',
    priceUnit: '/month',
    deposit: '',
    bhk: 2,
    areaSqFt: 1200,
    address: '',
    locality: '',
    city: 'Lucknow',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    ownerName: '',
    ownerPhone: '',
    ownerRole: 'Direct Owner',
    furnishing: 'Semi-Furnished',
    targetTenant: 'Family & Working Professionals',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.locality || !formData.ownerName) {
      showToast('Please fill out all required fields (Title, Price, Locality, Owner Name).', 'error');
      return;
    }

    const newProperty = {
      id: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      type: formData.type,
      listingType: formData.listingType,
      price: Number(formData.price),
      priceUnit: formData.priceUnit,
      deposit: formData.deposit ? Number(formData.deposit) : undefined,
      bhk: Number(formData.bhk),
      areaSqFt: Number(formData.areaSqFt),
      address: formData.address || `${formData.locality}, ${formData.city}`,
      locality: formData.locality,
      city: formData.city,
      images: [
        formData.imageUrl,
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80'
      ],
      isVerified: true,
      isFeatured: false,
      isDuplicate: false,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone || '+91 98000 00000',
      ownerRole: formData.ownerRole,
      amenities: ['Power Backup', 'Security', 'Water Supply', 'Lift'],
      furnishing: formData.furnishing,
      targetTenant: formData.targetTenant,
      description: formData.description || 'Newly added verified listing on Property Hub.',
      postedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      reportsCount: 0,
    };

    onAddProperty(newProperty);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container max-w-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[2px] bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
              <Building2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Verified Property Listing</h3>
              <p className="text-[11px] text-slate-500">Admin direct property publishing wizard</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close Modal">
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property Title *
              </label>
              <input 
                type="text"
                placeholder="e.g. Elegant 3 BHK Flat in Gomti Nagar"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property Type
                </label>
                <select 
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 bg-white focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Flat">Flat / Apartment</option>
                  <option value="House">Independent House / Villa</option>
                  <option value="PG">Hostel / PG</option>
                  <option value="Office">Commercial Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Listing Type
                </label>
                <select 
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 bg-white focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value, priceUnit: e.target.value === 'Rent' ? '/month' : 'Total' })}
                >
                  <option value="Rent">For Rent</option>
                  <option value="Buy">For Sale / Buy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  BHK Config
                </label>
                <input 
                  type="number"
                  min="0"
                  max="10"
                  value={formData.bhk}
                  onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Price (INR) *
                </label>
                <input 
                  type="number"
                  placeholder="e.g. 25000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deposit (INR)
                </label>
                <input 
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area (Sq. Ft)
                </label>
                <input 
                  type="number"
                  value={formData.areaSqFt}
                  onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Locality / Neighborhood *
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Vibhuti Khand, Gomti Nagar"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  required
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City
                </label>
                <input 
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Full Name *
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                  className="w-full text-xs border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Mobile
                </label>
                <input 
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Featured Photo URL
              </label>
              <input 
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full text-xs font-mono border border-slate-300 rounded-[2px] p-2 focus:ring-1 focus:ring-purple-700 focus:border-purple-700 outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer flex items-center justify-end gap-2 flex-wrap">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-1.5">
              <Plus size={14} />
              <span>Publish Property</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
