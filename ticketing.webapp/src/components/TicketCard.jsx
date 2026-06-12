import { Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const accent = {
  gold: 'bg-amber-100 text-amber-800 ring-amber-200',
  premium: 'bg-sky-100 text-sky-800 ring-sky-200',
  vip: 'bg-violet-100 text-violet-800 ring-violet-200',
};

// Presentational only — renders the ticket it's given and reports clicks via
// callbacks. All data fetching / cart logic lives in the parent (TicketsPage).
export default function TicketCard({
  ticket,
  quantity = 0,
  verifying = false,
  error = null,
  success = null,
  onAdd,
  onIncrement,
  onDecrement,
}) {
  const amount = ticket.amount ?? ticket.price ?? 0;
  const currency = ticket.currency;
  const availableToSell = ticket.availableToSell ?? ticket.quota ?? 0;
  const quantityOnHand = ticket.quantityOnHand ?? ticket.quota ?? availableToSell;
  const quantityReserved = ticket.quantityReserved ?? 0;
  const ticketType = ticket.ticketType ?? ticket.name;
  const soldOut = availableToSell <= 0;
  const inCart = quantity > 0;
  const badgeClass =
    accent[ticket.typeId ?? ticket.id] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${badgeClass}`}
        >
          {ticket.name}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {soldOut ? 'Sold out' : `${availableToSell} available`}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-3xl font-bold text-slate-900">
          {formatCurrency(amount, currency)}
        </span>
        <span className="ml-1 text-sm text-slate-500">/ ticket</span>
      </div>

      <dl className="mt-4 flex-1 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">ticketType</dt>
          <dd className="font-medium text-slate-900">{ticketType}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">quantityOnHand</dt>
          <dd className="font-medium text-slate-900">{quantityOnHand}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">quantityReserved</dt>
          <dd className="font-medium text-slate-900">{quantityReserved}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">availableToSell</dt>
          <dd className="font-medium text-slate-900">{availableToSell}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">currency</dt>
          <dd className="font-medium text-slate-900">{currency}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">amount</dt>
          <dd className="font-medium text-slate-900">{amount}</dd>
        </div>
      </dl>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {success}
        </div>
      )}

      <div className="mt-6">
        {inCart ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-1.5">
            <button
              type="button"
              onClick={onDecrement}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
              aria-label={`Decrease ${ticket.name}`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center font-semibold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              disabled={verifying}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Increase ${ticket.name}`}
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={verifying}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking availability…
              </>
            ) : (
              'Add to cart'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
