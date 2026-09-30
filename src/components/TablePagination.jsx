import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  onPageSizeChange
}) {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers around current page
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 border-t border-slate-300 text-xs text-slate-600 flex-wrap gap-3">
      {/* Left: Entries Counter */}
      <div className="flex items-center gap-2">
        <span>
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] text-slate-500">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-[2px] px-1.5 py-0.5 text-xs text-slate-800 outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center justify-center w-7 h-7 rounded-[2px] border transition-all cursor-pointer ${
            currentPage <= 1
              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-indigo-700'
          }`}
          title="Previous Page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-[2px] border text-xs font-semibold cursor-pointer transition-all ${
              p === currentPage
                ? 'bg-indigo-700 text-white border-indigo-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-indigo-700'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center justify-center w-7 h-7 rounded-[2px] border transition-all cursor-pointer ${
            currentPage >= totalPages
              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-indigo-700'
          }`}
          title="Next Page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
