import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { BASE_API_URL } from '../utils/apiUrl';
import { CURRENCY } from '../utils/tickets';
import { useCartStore } from '../store/cartStore';
import { useCustomerStore } from '../store/customerStore';
import TicketCard from '../components/TicketCard';
import TicketCardSkeleton from '../components/TicketCardSkeleton';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 6;

function mapTicketFromApi(ticket) {
  const ticketType = ticket.ticketType ?? 'Ticket';
  const quantityOnHand = Number(ticket.quantityOnHand ?? ticket.QuantityOnHand ?? 0);
  const quantityReserved = Number(ticket.quantityReserved ?? ticket.QuantityReserved ?? 0);
  const availableToSell = Number(ticket.availableToSell ?? ticket.AvailableToSell ?? 0);
  const amount = Number(ticket.amount ?? ticket.Amount ?? 0);
  const currency = ticket.currency ?? ticket.Currency ?? CURRENCY;

  return {
    id: ticket.id,
    ticketType,
    typeId: ticketType.toLowerCase(),
    name: ticketType,
    amount,
    price: amount,
    currency,
    quantityOnHand,
    quantityReserved,
    availableToSell,
    quota: availableToSell,
    raw: ticket,
  };
}

async function bookTicket({ customerId, ticketId, quantity = 1 }) {
  const res = await fetch(`${BASE_API_URL}/api/Order/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId,
      line: {
        ticketId,
        quantity,
      },
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? data?.title ?? 'Could not book this ticket.');
  }

  return data;
}

async function addOrderLine({ orderId, ticketId, quantity = 1 }) {
  const res = await fetch(`${BASE_API_URL}/api/Order/addorderline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      ticketId,
      quantity,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? data?.title ?? 'Could not add this ticket to the order.');
  }

  return data;
}

async function fetchTickets({ pageNumber = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({
    PageNumber: String(pageNumber),
    PageSize: String(pageSize),
  });

  const res = await fetch(`${BASE_API_URL}/api/Ticket?${params}`);
  if (!res.ok) throw new Error('Failed to load tickets');

  const data = await res.json();
  console.log('GET /api/Ticket response', data);

  return {
    items: (data.items ?? []).map(mapTicketFromApi),
    totalCount: data.totalCount ?? 0,
    pageNumber: data.pageNumber ?? pageNumber,
    pageSize: data.pageSize ?? pageSize,
  };
}

export default function TicketsPage() {
  const customer = useCustomerStore((s) => s.customer);

  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    items: [],
    totalCount: 0,
    pageNumber: 0,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const items = useCartStore((s) => s.items);
  const currentOrderId = useCartStore((s) => s.currentOrderId);
  const addItem = useCartStore((s) => s.addItem);
  const decrement = useCartStore((s) => s.decrement);
  const setCurrentOrderId = useCartStore((s) => s.setCurrentOrderId);
  const setCurrentOrder = useCartStore((s) => s.setCurrentOrder);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const [verifyingId, setVerifyingId] = useState(null);
  const [addErrors, setAddErrors] = useState({});
  const [addSuccesses, setAddSuccesses] = useState({});

  useEffect(() => {
    if (!customer) return;
    
    let active = true;
    setLoading(true);
    setError(null);

    fetchTickets({ pageNumber: page, pageSize: PAGE_SIZE })
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(err.message ?? 'Failed to load tickets.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [customer, page]);

  async function handleAdd(ticket) {
    setAddErrors((prev) => ({ ...prev, [ticket.id]: null }));
    setAddSuccesses((prev) => ({ ...prev, [ticket.id]: null }));
    setVerifyingId(ticket.id);
    try {
      const existingOrderId = items.length > 0 ? currentOrderId : null;
      const order = existingOrderId
        ? await addOrderLine({
            orderId: existingOrderId,
            ticketId: ticket.id,
            quantity: 1,
          })
        : await bookTicket({
            customerId: customer.id,
            ticketId: ticket.id,
            quantity: 1,
          });

      const orderId = order?.id ?? existingOrderId;
      if (!orderId) throw new Error('The booking response did not include an order id.');
      setCurrentOrderId(orderId);
      setCurrentOrder(order);

      addItem(ticket, orderId);
      setAddSuccesses((prev) => ({
        ...prev,
        [ticket.id]: `${ticket.name} was added to order ${orderId}.`,
      }));
    } catch (err) {
      setAddErrors((prev) => ({
        ...prev,
        [ticket.id]: err.message ?? 'Could not book this ticket.',
      }));
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Choose your experience
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Three tiers, one unforgettable event. Add tickets to your cart and check
          out in seconds.
        </p>
      </section>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <TicketCardSkeleton key={i} />)
          : data.items.map((ticket) => {
              const cartItem = items.find((i) => i.id === ticket.id);
              return (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  quantity={cartItem?.quantity ?? 0}
                  verifying={verifyingId === ticket.id}
                  error={addErrors[ticket.id]}
                  success={addSuccesses[ticket.id]}
                  onAdd={() => handleAdd(ticket)}
                  onIncrement={() => handleAdd(ticket)}
                  onDecrement={() => decrement(ticket.id)}
                />
              );
            })}
      </section>

      {!loading && data.items.length === 0 && !error && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          No tickets are available right now.
        </div>
      )}

      {!loading && data.totalCount > PAGE_SIZE && (
        <Pagination
          pageNumber={page}
          pageSize={data.pageSize || PAGE_SIZE}
          totalCount={data.totalCount}
          onChange={setPage}
          disabled={loading}
        />
      )}

      {!loading && totalItems > 0 && (
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700">
            {totalItems} ticket{totalItems === 1 ? '' : 's'} in your cart
          </p>
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Go to checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
