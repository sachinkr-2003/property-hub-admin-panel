import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Package, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  RefreshCw,
  Download,
  ArrowUpDown,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';
import { confirmDelete, showToast } from '../utils/alerts';
import { exportToCsv } from '../utils/exportCsv';
import TablePagination from '../components/TablePagination';

export default function UsedItemsManagement({ 
  usedItems, 
  onRemoveItem, 
  onApproveItem,
  activeSubPage = 'all_items'
}) {
  const [filterReported, setFilterReported] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Sorting state
  const [sortField, setSortField] = useState('postedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Checkbox selection state
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (activeSubPage === 'reported_items') setFilterReported('Reported');
    else if (activeSubPage === 'remove_item') setFilterReported('All');
    else setFilterReported('All');
    setCurrentPage(1);
    setSelectedItemIds([]);
  }, [activeSubPage]);

  // Filtering & Sorting
  const filteredItems = useMemo(() => {
    return usedItems.filter((item) => {
      let matchesTab = true;
      if (filterReported === 'Reported' || activeSubPage === 'reported_items') matchesTab = item.reported;
      if (filterReported === 'Active') matchesTab = !item.reported && item.status === 'Active';

      const matchesCat = filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());

      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.locality && item.locality.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesTab && matchesCat && matchesSearch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });
  }, [usedItems, filterReported, filterCategory, activeSubPage, searchTerm, sortField, sortOrder]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === paginatedItems.length && paginatedItems.length > 0) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(paginatedItems.map(i => i.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportCsv = (data = filteredItems, filename = 'Used_Items_Marketplace') => {
    const cols = [
      { label: 'Item ID', accessor: 'id' },
      { label: 'Product Title', accessor: 'title' },
      { label: 'Category', accessor: 'category' },
      { label: 'Asking Price (INR)', accessor: 'price' },
      { label: 'Original Price (INR)', accessor: 'originalPrice' },
      { label: 'Seller Name', accessor: 'sellerName' },
      { label: 'Seller Phone', accessor: 'phone' },
      { label: 'Locality', accessor: 'locality' },
      { label: 'Condition Note', accessor: 'condition' },
      { label: 'Disputed', accessor: 'reported' },
      { label: 'Status', accessor: 'status' },
      { label: 'Listed Date', accessor: 'postedAt' }
    ];
    exportToCsv(filename, data, cols);
    showToast(`Exported ${data.length} used items to CSV.`, 'info');
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmDelete(
      `Take Down Listing ${item.id}?`,
      `"${item.title}" will be permanently purged from the student marketplace.`
    );
    if (confirmed) {
      onRemoveItem(item.id);
      showToast('Item listing purged from marketplace.', 'success');
    }
  };

  const handleBulkRemove = async () => {
    if (selectedItemIds.length === 0) return;
    const confirmed = await confirmDelete(
      `Purge ${selectedItemIds.length} Marketplace Listings?`,
      `The selected items will be removed permanently from the marketplace feed.`
    );
    if (confirmed) {
      selectedItemIds.forEach(id => onRemoveItem(id));
      showToast(`${selectedItemIds.length} listings purged.`, 'success');
      setSelectedItemIds([]);
    }
  };

  // ================= VIEW 1: REPORTED ITEMS QUEUE =================
  if (activeSubPage === 'reported_items') {
    const reportedList = usedItems.filter(i => i.reported);

    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-300 rounded-[2px] p-3 text-xs text-red-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-700" />
            <span>
              <strong>Reported Used Marketplace Queue:</strong> Listings flagged by buyers for undisclosed physical damage, pricing disputes, or fraudulent condition notes.
            </span>
          </div>
          <span className="font-bold">{reportedList.length} Disputed Items</span>
        </div>

        <div className="classic-card p-0 overflow-hidden">
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Product Details</th>
                  <th>Seller Contact</th>
                  <th>Condition Claimed</th>
                  <th className="text-right">Price</th>
                  <th>Report Violation Note</th>
                  <th className="text-right">Moderation</th>
                </tr>
              </thead>
              <tbody>
                {reportedList.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono font-bold text-xs text-slate-600">{item.id}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-10 h-10 rounded-[2px] object-cover border border-slate-300 shadow-xs" 
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900">{item.title}</div>
                          <span className="badge-pill badge-purple text-[10px] mt-0.5">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-800">{item.sellerName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.phone}</div>
                    </td>
                    <td className="text-xs text-slate-700 font-medium">{item.condition}</td>
                    <td className="text-right font-mono font-bold text-xs text-emerald-700">
                      ₹ {item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="text-xs text-red-700 font-medium max-w-xs">
                      Buyer reported physical defect / scratch not disclosed in uploaded photos.
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          type="button"
                          className="btn-primary bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                          onClick={() => onApproveItem(item.id)}
                        >
                          <Check size={12} />
                          <span>Clear Flag</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-danger text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                          onClick={() => handleRemove(item)}
                        >
                          <Trash2 size={12} />
                          <span>Take Down</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reportedList.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-xs text-slate-400">
                      No disputed or reported used items in the marketplace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ================= DEFAULT & REMOVE ITEMS VIEW =================
  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="filter-toolbar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="search-input-wrap w-64">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search used items, category, seller..." 
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
            value={filterReported}
            onChange={(e) => {
              setFilterReported(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Marketplace Inventory</option>
            <option value="Active">Clean Items Only</option>
            <option value="Reported">Reported / Disputed Only</option>
          </select>

          <select 
            className="filter-select-input text-xs"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            <option value="Furniture">Furniture</option>
            <option value="Appliances">Appliances</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 border border-slate-300 rounded-[2px]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-[2px] transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-500'}`}
              title="Table Spreadsheet View"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-[2px] transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-500'}`}
              title="Visual Card Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button 
            type="button"
            onClick={() => handleExportCsv(filteredItems)}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Download CSV catalog of items"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedItemIds.length > 0 && (
        <div className="bg-purple-50 border border-purple-300 p-2.5 rounded-[2px] flex items-center justify-between text-xs text-purple-950 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-purple-700 text-white px-2 py-0.5 rounded-[2px] font-mono text-[11px]">
              {selectedItemIds.length} Items Selected
            </span>
            <span>Batch actions on selected marketplace listings:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkRemove}
              className="btn-danger text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <Trash2 size={12} />
              <span>Purge Selected Items</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const sel = usedItems.filter(i => selectedItemIds.includes(i.id));
                handleExportCsv(sel, 'Selected_Used_Items');
              }}
              className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <Download size={12} />
              <span>Export Selected CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedItemIds([])}
              className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Table Spreadsheet View */}
      {viewMode === 'table' ? (
        <div className="classic-card p-0 overflow-hidden">
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.length === paginatedItems.length && paginatedItems.length > 0}
                      onChange={handleToggleSelectAll}
                      className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                      title="Select all on this page"
                    />
                  </th>
                  <th onClick={() => handleSort('id')} className="cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Item ID</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('title')} className="cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Product Title</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th>Category</th>
                  <th onClick={() => handleSort('price')} className="cursor-pointer select-none text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Listed Price</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th>Seller Contact</th>
                  <th>Condition</th>
                  <th onClick={() => handleSort('postedAt')} className="cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      <span>Posted Date</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <tr key={item.id} className={isSelected ? 'bg-purple-50/50' : ''}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(item.id)}
                          className="rounded-[2px] border-slate-300 text-purple-700 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="font-mono font-bold text-xs text-slate-600">{item.id}</td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-8 h-8 rounded-[2px] object-cover border border-slate-300 shadow-xs" 
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900">{item.title}</div>
                            <div className="text-[11px] text-slate-500">{item.locality}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-pill badge-purple">{item.category}</span>
                      </td>
                      <td className="text-right">
                        <div className="font-mono font-bold text-xs text-emerald-700">
                          ₹ {item.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹ {item.originalPrice.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td>
                        <div className="text-xs font-semibold text-slate-800">{item.sellerName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{item.phone}</div>
                      </td>
                      <td className="text-xs text-slate-700">{item.condition}</td>
                      <td className="font-mono text-xs text-slate-500">{item.postedAt}</td>
                      <td className="text-center">
                        <span className={`badge-pill ${item.reported ? 'badge-red' : 'badge-green'}`}>
                          {item.reported ? 'Disputed' : item.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {item.reported && (
                            <button
                              type="button"
                              className="btn-icon p-1 text-emerald-700 hover:bg-emerald-50"
                              title="Clear Disputed Flag"
                              onClick={() => onApproveItem(item.id)}
                            >
                              <CheckCircle size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-icon p-1 text-red-600 hover:bg-red-50"
                            title="Purge Listing"
                            onClick={() => handleRemove(item)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedItems.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-8 text-xs text-slate-400">
                      No marketplace items matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <TablePagination
            totalItems={filteredItems.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      ) : (
        /* Visual Card Grid View */
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {paginatedItems.map((item) => (
              <div key={item.id} className="classic-card p-0 overflow-hidden flex flex-col justify-between">
                <div className="h-40 relative bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className={`badge-pill ${item.reported ? 'badge-red' : 'badge-green'}`}>
                      {item.reported ? 'Disputed' : item.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 font-mono text-[10px] bg-slate-900/80 text-white px-1.5 py-0.5 rounded-[2px]">
                    {item.id}
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-emerald-700 font-mono">
                        ₹ {item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹ {item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">{item.title}</h4>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin size={11} />
                      <span>{item.locality || 'Lucknow'}</span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 border border-slate-300 rounded-[2px] text-[11px] space-y-0.5">
                    <div><span className="text-slate-500">Seller:</span> <strong>{item.sellerName}</strong></div>
                    <div><span className="text-slate-500">Phone:</span> <span className="font-mono">{item.phone}</span></div>
                    <div><span className="text-slate-500">Condition:</span> <span>{item.condition}</span></div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="badge-pill badge-purple text-[10px]">{item.category}</span>
                    <div className="flex items-center gap-1">
                      {item.reported && (
                        <button
                          type="button"
                          className="btn-secondary text-[11px] py-1 px-2 text-emerald-700"
                          onClick={() => onApproveItem(item.id)}
                        >
                          Clear Flag
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-danger text-[11px] py-1 px-2 flex items-center gap-1"
                        onClick={() => handleRemove(item)}
                      >
                        <Trash2 size={11} />
                        <span>Purge</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Pagination */}
          <div className="classic-card p-0">
            <TablePagination
              totalItems={filteredItems.length}
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
    </div>
  );
}
