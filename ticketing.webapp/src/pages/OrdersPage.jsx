import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { customerName } from '../utils/customers';
import { formatCurrency } from '../utils/format';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 5;

// --- Real API call — OrderService.GetPaginatedOrders ----------------------
// (disabled — swap in once the ASP.NET gRPC backend is live. The live version
// doesn't need the store snapshot; the server owns the order list.)
// import { BASE_API_URL } from '../utils/apiUrl';
//
// async function getPaginatedOrders(pageNumber, pageSize) {
//   const res = await fetch(`${BASE_API_URL}/OrderService/GetPaginatedOrders`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ pageNumber, pageSize }),
//   });
//   if (!res.ok) throw new Error('Failed to load orders');
//   return res.json(); // { orders, totalCount, pageNumber, pageSize }
// }

// Simulated OrderService.GetPaginatedOrders — reads the current order "database"
// snapshot from the store and returns a page after a short delay.
function getPaginatedOrders(orders, pageNumber, pageSize) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      resolve({
        orders: orders.slice(start, start + pageSize),
        totalCount: orders.length,
        pageNumber,
        pageSize,
      });
    }, 900);
  });
}

function SkeletonRows() {
  return Array.from({ length: PAGE_SIZE }).map((_, i) => (
    <tr key={i} className="border-b border-slate-100 last:border-0">
      {Array.from({ length: 5 }).map((__, j) => (
        <td key={j} className="px-4 py-3">
          <div className="h-4 w-full max-w-[10rem] rounded bg-slate-200 animate-pulse-soft" />
        </td>
      ))}
    </tr>
  ));
}

export default function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ orders: [], totalCount: 0, pageNumber: 0 });

  // Loading == the page we're showing isn't the page that was requested yet.
  const loading = data.pageNumber !== page;

  useEffect(() => {
    let active = true;
    getPaginatedOrders(orders, page, PAGE_SIZE).then((res) => {
      if (active) setData(res);
    });
    return () => {
      active = false;
    };
  }, [page, orders]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">All bookings and their payment status.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : (
                data.orders.map((o) => {
                  const itemCount = o.items.reduce((sum, i) => sum + i.orderedQuantity, 0);
                  return (
                    <tr key={o.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link
                          to={`/orders/${o.id}`}
                          className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-900 hover:underline"
                        >
                          {o.id}
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{customerName(o.customerId)}</td>
                      <td className="px-4 py-3 text-slate-600">{itemCount}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatCurrency(o.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  );
                })
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
