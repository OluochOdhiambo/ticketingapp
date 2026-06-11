import { Link, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, CreditCard, QrCode, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { ticketName } from '../utils/tickets';
import { customerName } from '../utils/customers';
import { formatCurrency, formatTimestamp } from '../utils/format';
import StatusBadge from '../components/StatusBadge';

export default function SuccessPage() {
  const lastOrder = useCartStore((s) => s.lastOrder);

  // No order to show (e.g. direct navigation / reload after clearing) -> home.
  if (!lastOrder) {
    return <Navigate to="/" replace />;
  }

  const { transaction, order } = lastOrder;
  const isQr = transaction.paymentMethod.includes('QR');
  const MethodIcon = isQr ? QrCode : CreditCard;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Confirmation header */}
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle className="h-9 w-9" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Payment successful
        </h1>
        <p className="mt-1 text-slate-600">
          Your tickets are confirmed. A copy of this receipt has been simulated.
        </p>
      </div>

      {/* Transaction details */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Transaction ID
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {transaction.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Timestamp
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">
                {formatTimestamp(transaction.transactionDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment method
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <MethodIcon className="h-4 w-4" />
                {transaction.paymentMethod}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Amount paid
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(transaction.amount)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Order summary */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{order.id}</p>
              <p className="mt-0.5 text-sm text-slate-500">{customerName(order.customerId)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Line items */}
        <div className="px-6 py-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">Tickets</p>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-slate-600">
                <span>
                  {ticketName(item.ticketId)} &times; {item.orderedQuantity}
                </span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(item.lineTotal, item.currencyCode)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          View order
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Link>
      </div>
    </div>
  );
}
