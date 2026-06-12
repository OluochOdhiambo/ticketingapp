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
import { BASE_API_URL } from '../utils/apiUrl';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useCustomerStore } from '../store/customerStore';
import { CURRENCY } from '../utils/tickets';
import { formatCurrency } from '../utils/format';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit Card', hint: 'Card payment', Icon: CreditCard },
  { id: 'qr', label: 'QR Scan', hint: 'Scan to pay', Icon: QrCode },
];

const PAYMENT_METHOD_CODES = { card: 1, qr: 2 };
const PAYMENT_METHOD_LABELS = { 1: 'Credit Card', 2: 'QR Scan' };

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function initiateTransaction(orderId, paymentMethod) {
  const response = await fetch(`${BASE_API_URL}/api/Transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentMethod }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? data?.title ?? 'Transaction failed.');
  }

  return data;
}

async function fetchOrderDetails(orderId) {
  try {
    const response = await fetch(`${BASE_API_URL}/api/Order/${orderId}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function createOrderLineFromCartItem(orderId, item) {
  return {
    id: `${orderId}-${item.id}`,
    orderId,
    ticketId: item.id,
    ticketName: item.name,
    orderedQuantity: item.quantity,
    currencyCode: item.currency,
    unitPrice: item.price,
    lineTotal: item.price * item.quantity,
  };
}

function normalizeOrderDetails(order, cartItems, customer, status) {
  const orderId = order?.id;
  const orderLines = order?.orderLines ?? order?.items ?? [];
  const items =
    orderLines.length > 0
      ? orderLines.map((line) => ({
          id: line.id ?? `${orderId}-${line.ticketId}`,
          orderId: line.orderId ?? orderId,
          ticketId: line.ticketId,
          ticketName:
            cartItems.find((item) => item.id === line.ticketId)?.name ?? line.ticketName,
          orderedQuantity: line.orderedQuantity ?? line.quantity ?? 0,
          currencyCode: line.currencyCode ?? line.currency ?? CURRENCY,
          unitPrice: line.unitPrice ?? 0,
          lineTotal: line.lineTotal ?? 0,
        }))
      : cartItems.map((item) => createOrderLineFromCartItem(orderId, item));

  const totalPrice =
    order?.totalPrice ??
    order?.totalAmount ??
    items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: orderId,
    customerId: order?.customerId ?? customer.id,
    status,
    items,
    totalPrice,
  };
}

function normalizeTransaction(transaction, orderId, paymentMethod, amount) {
  const transactionAmount = Number(transaction?.amount ?? 0);

  return {
    id: transaction?.id ?? transaction?.transactionReference ?? orderId,
    orderId: transaction?.orderId ?? orderId,
    paymentMethod:
      typeof transaction?.paymentMethod === 'string'
        ? transaction.paymentMethod
        : PAYMENT_METHOD_LABELS[paymentMethod],
    transactionReference: transaction?.transactionReference,
    amount: transactionAmount > 0 ? transactionAmount : amount,
    status: transaction?.status,
    transactionDate: transaction?.transactionDate ?? new Date().toISOString(),
  };
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

  const items = useCartStore((state) => state.items);
  const currentOrderId = useCartStore((state) => state.currentOrderId);
  const currentOrder = useCartStore((state) => state.currentOrder);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const setLastOrder = useCartStore((state) => state.setLastOrder);

  const addOrder = useOrderStore((state) => state.addOrder);
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const customer = useCustomerStore((state) => state.customer);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const currency = items[0]?.currency ?? CURRENCY;

  const [method, setMethod] = useState('card');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const busy = status === 'paying' || status === 'confirming';

  async function handleCheckout() {
    setError(null);

    if (!customer) {
      setError('Please select a customer before paying.');
      return;
    }

    if (!currentOrderId) {
      setError('Please add a ticket to cart before paying.');
      return;
    }

    try {
      setStatus('paying');
      const paymentMethod = PAYMENT_METHOD_CODES[method];
      const transactionResponse = await initiateTransaction(currentOrderId, paymentMethod);
      const transaction = normalizeTransaction(
        transactionResponse,
        currentOrderId,
        paymentMethod,
        total
      );

      setStatus('confirming');
      await wait(8000);

      const refreshedOrder = await fetchOrderDetails(currentOrderId);
      const orderSource = refreshedOrder ?? currentOrder ?? {
        id: currentOrderId,
        customerId: customer.id,
      };
      const paidOrder = normalizeOrderDetails(orderSource, items, customer, 'Paid');

      addOrder(paidOrder);
      updateOrder(paidOrder.id, { status: 'Paid' });
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
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-slate-700">Payment method</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ id, label, hint, Icon }) => (
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

            {status === 'confirming' && (
              <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                {method === 'qr' ? (
                  <QrCode className="h-16 w-16 text-slate-900" />
                ) : (
                  <CreditCard className="h-16 w-16 text-slate-900" />
                )}
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting for payment confirmation...
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Checking the order again in a few seconds.
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
                  {status === 'paying' ? 'Starting transaction...' : 'Confirming payment...'}
                </>
              ) : (
                <>Pay {formatCurrency(total, currency)}</>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
