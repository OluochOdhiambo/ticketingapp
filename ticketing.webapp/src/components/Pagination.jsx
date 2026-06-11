import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Simple pager for the paginated gRPC lists (Orders, Customers). */
export default function Pagination({ pageNumber, pageSize, totalCount, onChange, disabled }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const to = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing {from}–{to} of {totalCount}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(pageNumber - 1)}
          disabled={disabled || pageNumber <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-slate-700">
          {pageNumber} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onChange(pageNumber + 1)}
          disabled={disabled || pageNumber >= totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
