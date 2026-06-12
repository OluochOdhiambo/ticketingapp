import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { customerName } from '../utils/customers';
import { ticketName } from '../utils/tickets';
import { formatCurrency } from '../utils/format';
import StatusBadge from '../components/StatusBadge';

function getOrder(orders, orderId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(orders.find((o) => o.id === orderId) ?? null), 700);
  });
}

function DetailSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-5 w-40 rounded bg-slate-200 animate-pulse-soft" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-slate-200 animate-pulse-soft" />
        ))}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const orders = useOrderStore((s) => s.orders);
  const [result, setResult] = useState({ id: null, order: null });

  const loading = result.id !== orderId;
  const order = result.order;

  useEffect(() => {
    let active = true;
    getOrder(orders, orderId).then((res) => {
      if (active) setResult({ id: orderId, order: res });
    });
    return () => {
      active = false;
    };
  }, [orderId, orders]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      {loading ? (
        <DetailSkeleton />
      ) : !order ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Order &ldquo;{orderId}&rdquo; was not found.</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h1 className="font-mono text-lg font-bold text-slate-900">{order.id}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {customerName(order.customerId)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="overflow-x-auto px-6 py-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-4 font-medium">Ticket</th>
                  <th className="py-2 px-4 text-right font-medium">Unit price</th>
                  <th className="py-2 px-4 text-right font-medium">Qty</th>
                  <th className="py-2 pl-4 text-right font-medium">Line total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {ticketName(item.ticketId)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {formatCurrency(item.unitPrice, item.currencyCode)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">{item.orderedQuantity}</td>
                    <td className="py-3 pl-4 text-right font-medium text-slate-900">
                      {formatCurrency(item.lineTotal, item.currencyCode)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
