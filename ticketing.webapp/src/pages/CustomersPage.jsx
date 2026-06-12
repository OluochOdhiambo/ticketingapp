import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { CUSTOMERS } from '../utils/customers';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 6;

function getPaginatedCustomers(pageNumber, pageSize) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      resolve({
        customers: CUSTOMERS.slice(start, start + pageSize),
        totalCount: CUSTOMERS.length,
        pageNumber,
        pageSize,
      });
    }, 900);
  });
}

function SkeletonRows() {
  return Array.from({ length: PAGE_SIZE }).map((_, i) => (
    <tr key={i} className="border-b border-slate-100 last:border-0">
      {Array.from({ length: 4 }).map((__, j) => (
        <td key={j} className="px-4 py-3">
          <div className="h-4 w-full max-w-[12rem] rounded bg-slate-200 animate-pulse-soft" />
        </td>
      ))}
    </tr>
  ));
}

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ customers: [], totalCount: 0, pageNumber: 0 });

  // Loading == the page we're showing isn't the page that was requested yet.
  const loading = data.pageNumber !== page;

  useEffect(() => {
    let active = true;
    getPaginatedCustomers(page, PAGE_SIZE).then((res) => {
      if (active) setData(res);
    });
    return () => {
      active = false;
    };
  }, [page]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500">Registered ticket buyers.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : (
                data.customers.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {c.firstname} {c.lastname}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phoneNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        pageNumber={page}
        pageSize={PAGE_SIZE}
        totalCount={data.totalCount}
        onChange={setPage}
        disabled={loading}
      />
    </div>
  );
}
