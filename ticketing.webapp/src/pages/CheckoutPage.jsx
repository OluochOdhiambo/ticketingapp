import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  Loader2,
  ArrowLeft,
  AlertCircle,
  UserRound,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useCustomerStore } from '../store/customerStore';
import { CURRENCY } from '../utils/tickets';
import { formatCurrency } from '../utils/format';

const METHODS = [
  { id: 'card', label: 'Credit Card', hint: 'Instant confirmation', Icon: CreditCard },
  { id: 'qr', label: 'QR Scan', hint: 'Pending ~8s after scan', Icon: QrCode },
];

//Transaction.proto sends paymentMethod as an int
const PAYMENT_METHOD = { card: 1, qr: 2 };
const METHOD_LABEL = { 1: 'Credit Card', 2: 'QR Scan' };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = (prefix) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

//CreateOrderItemModel(order.proto).
function buildItem(orderId, line) {
  return {
    id: uid('itm'),
    orderId,
    ticketId: line.ticketId,
    orderedQuantity: line.orderedQuantity,
    currencyCode: CURRENCY,
    unitPrice: line.unitPrice,
    lineTotal: line.unitPrice * line.orderedQuantity,
  };
}

// --- Real API calls (disabled — swap in once the ASP.NET gRPC backend is live)
// import { BASE_API_URL } from '../utils/apiUrl';
//
// // Step 1 — POST the order: BookTicket creates it with the first line,
// // AddOrderLine appends the rest, InitiatePayment kicks off the payment.
// async function placeOrder(customerId, lines, paymentMethod) {
//   const booked = await fetch(`${BASE_API_URL}/OrderService/BookTicket`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ customerId, orderLine: lines[0] }),
//   });
//   if (!booked.ok) throw new Error('BookTicket failed');
//   let { order } = await booked.json(); // BookTicketResponse { order }
//
//   for (const orderLine of lines.slice(1)) {
//     const added = await fetch(`${BASE_API_URL}/OrderService/AddOrderLine`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ orderId: order.id, orderLine }),
//     });
//     if (!added.ok) throw new Error('AddOrderLine failed');
//     ({ order } = await added.json()); // AddOrderLineResponse { order }
//   }
//
//   // TransactionService.InitiatePayment (paymentMethod int: 1 = card, 2 = QR)
//   const paid = await fetch(`${BASE_API_URL}/TransactionService/InitiatePayment`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ orderId: order.id, paymentMethod }),
//   });
//   if (!paid.ok) throw new Error('InitiatePayment failed');
//   const { transaction } = await paid.json(); // InitiatePaymentResponse { transaction }
//   return { order, transaction };
// }
//
// // Step 2 — after the ~8s gateway callback, re-query the order by id to learn
// // whether the payment succeeded or failed (OrderService.GetOrder).
// async function checkOrderStatus(orderId) {
//   const res = await fetch(`${BASE_API_URL}/OrderService/GetOrder`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ orderId }),
//   });
//   if (!res.ok) throw new Error('GetOrder failed');
//   const data = await res.json();
//   return data.order; // OrderModel { ..., status: 'Paid' | 'Failed' }
// }

// --- Simulated gRPC services (no backend yet) -------------------------------

// OrderService.BookTicket — creates a new order with its first line.
async function bookTicket(customerId, orderLine) {
  await delay(500);
  const id = uid('ord');
  const items = [buildItem(id, orderLine)];
  return { id, customerId, items, totalPrice: items[0].lineTotal, status: 'Pending' };
}

// OrderService.AddOrderLine — appends a line to an existing order.
async function addOrderLine(order, orderLine) {
  await delay(400);
  const items = [...order.items, buildItem(order.id, orderLine)];
  const totalPrice = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { ...order, items, totalPrice };
}

// TransactionService.InitiatePayment — kicks off the payment and returns a
// transaction. Confirmation happens asynchronously via the callback below.
async function initiatePayment(orderId, paymentMethod, amount) {
  await delay(500);
  return {
    id: uid('txn'),
    orderId,
    paymentMethod: METHOD_LABEL[paymentMethod] ?? 'Unknown',
    amount,
    transactionDate: new Date().toISOString(),
  };
}

// Step 1 — POST the order (BookTicket + AddOrderLine) and initiate payment.
async function placeOrder(customerId, lines, paymentMethod) {
  let order = await bookTicket(customerId, lines[0]);
  for (const line of lines.slice(1)) {
    order = await addOrderLine(order, line);
  }
  const transaction = await initiatePayment(order.id, paymentMethod, order.totalPrice);
  return { order: { ...order, status: 'Processing' }, transaction };
}

// Step 2 — simulate the payment-gateway callback: re-query the order by id to
// learn whether it was confirmed (Paid) or rejected (Failed).
async function checkOrderStatus(orderId) {
  await delay(300);
  // The real callback decides this; the simulation always confirms success.
  return { id: orderId, status: 'Paid' };
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <ShoppingCart className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Your cart is empty</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Browse the available tickets and add a few to get started.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse tickets
      </Link>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const setLastOrder = useCartStore((s) => s.setLastOrder);

  const addOrder = useOrderStore((s) => s.addOrder);
  const updateOrder = useOrderStore((s) => s.updateOrder);

  const customer = useCustomerStore((s) => s.customer);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const currency = items[0]?.currency ?? CURRENCY;

  const [method, setMethod] = useState('card');
  const [status, setStatus] = useState('idle'); // idle | placing | confirming | error
  const [error, setError] = useState(null);

  const busy = status === 'placing' || status === 'confirming';

  async function handleCheckout() {
    setError(null);
    if (!customer) {
      setError('Please select a customer before paying.');
      return;
    }
    try {
      // Step 1 — POST the order (BookTicket + AddOrderLine + InitiatePayment).
      setStatus('placing');
      const lines = items.map((i) => ({
        ticketId: i.id,
        orderedQuantity: i.quantity,
        unitPrice: i.price,
      }));

      const { order, transaction } = await placeOrder(
        customer.id,
        lines,
        PAYMENT_METHOD[method]
      );
      addOrder(order); // persist as Processing so it appears under Orders

      // Step 2 — wait ~8s for the gateway callback, then check the order status.
      setStatus('confirming');
      await delay(8000);
      const result = await checkOrderStatus(order.id);

      if (result.status !== 'Paid') {
        updateOrder(order.id, { status: 'Failed' });
        setError('Payment was not confirmed. Please try again.');
        setStatus('error');
        return;
      }

      const paidOrder = { ...order, status: 'Paid' };
      updateOrder(order.id, { status: 'Paid' });

      // Double-entry recording (kept off-screen — recorded for the books only).
      console.info('Ledger entry', [
        { transactionId: transaction.id, account: 'Cash / Payment Gateway', type: 'debit', amount: transaction.amount },
        { transactionId: transaction.id, account: 'Ticket Sales Revenue', type: 'credit', amount: transaction.amount },
      ]);

      setLastOrder({ transaction, order: paidOrder });
      clearCart();
      navigate('/success');
    } catch (err) {
      setError(err.message ?? 'Checkout failed. Please try again.');
      setStatus('error');
    }
  }

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart items */}
        <section className="lg:col-span-2">
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(item.price, item.currency)} each
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1">
                    <button
                      type="button"
                      onClick={() => decrement(item.id)}
                      disabled={busy}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-40"
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(item.id)}
                      disabled={busy}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-40"
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="w-24 text-right font-semibold text-slate-900">
                    {formatCurrency(item.price * item.quantity, item.currency)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={busy}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={clearCart}
            disabled={busy}
            className="mt-4 text-sm font-medium text-slate-500 transition-colors hover:text-red-600 disabled:opacity-40"
          >
            Clear cart
          </button>
        </section>

        {/* Order summary */}
        <section className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Tickets</dt>
                <dd>{count}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(total, currency)}</dd>
              </div>
              <div className="my-3 border-t border-slate-200" />
              <div className="flex justify-between text-base font-semibold text-slate-900">
                <dt>Total</dt>
                <dd>{formatCurrency(total, currency)}</dd>
              </div>
            </dl>

            {/* Customer — chosen up front; the order is booked on their behalf. */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-slate-700">Customer</p>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-slate-900">
                  <UserRound className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">
                    {customer ? `${customer.firstname} ${customer.lastname}` : 'No customer'}
                  </span>
                </span>
                <Link
                  to="/select-customer"
                  className={`text-xs font-medium text-slate-500 hover:text-slate-900 ${busy ? 'pointer-events-none opacity-40' : ''}`}
                >
                  Change
                </Link>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-slate-700">Payment method</p>
              <div className="space-y-2">
                {METHODS.map(({ id, label, hint, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    disabled={busy}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors disabled:opacity-60 ${
                      method === id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className={`block text-xs ${method === id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Awaiting the payment-gateway callback (~8s) */}
            {status === 'confirming' && (
              <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                {method === 'qr' ? (
                  <QrCode className="h-16 w-16 text-slate-900" />
                ) : (
                  <CreditCard className="h-16 w-16 text-slate-900" />
                )}
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Awaiting payment confirmation…
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Order placed — waiting for the gateway callback.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={busy || !customer}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {status === 'placing' ? 'Placing order…' : 'Confirming payment…'}
                </>
              ) : (
                <>Pay {formatCurrency(total, currency)}</>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Simulated payment — no real charge is made.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
