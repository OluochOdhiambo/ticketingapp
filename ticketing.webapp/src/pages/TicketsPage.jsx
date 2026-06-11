import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { TICKETS } from '../utils/tickets';
import { useCartStore } from '../store/cartStore';
import TicketCard from '../components/TicketCard';
import TicketCardSkeleton from '../components/TicketCardSkeleton';

// --- Real API call (disabled — swap in once the backend is live) -----------
// import { BASE_API_URL } from '../utils/apiUrl';
//
// async function fetchTickets() {
//   const res = await fetch(`${BASE_API_URL}/tickets`);
//   if (!res.ok) throw new Error('Failed to load tickets');
//   return res.json(); // [{ id, name, price, currency, quota, perks }]
// }

// Simulated ticket fetch — resolves the dummy catalogue after a short delay
// so the page can show skeletons while "loading".
function fetchTickets() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TICKETS.map((t) => ({ ...t }))), 1200);
  });
}

// --- Real API call — verify availability for a ticket type ----------------
// (disabled — swap in once the backend is live)
// import { BASE_API_URL } from '../utils/apiUrl';
//
// async function verifyAvailability(ticketId) {
//   const res = await fetch(`${BASE_API_URL}/tickets/${ticketId}/availability`);
//   if (!res.ok) throw new Error('Could not verify availability');
//   return res.json(); // { available: boolean, remaining: number }
// }

// Simulated availability check — called when a ticket is placed in the cart,
// to confirm stock for that ticket type before committing the line.
function verifyAvailability(ticketId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const remaining = TICKETS.find((t) => t.id === ticketId)?.quota ?? 0;
      resolve({ available: remaining > 0, remaining });
    }, 700);
  });
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const [verifyingId, setVerifyingId] = useState(null);
  const [addErrors, setAddErrors] = useState({});

  useEffect(() => {
    let active = true;

    fetchTickets()
      .then((data) => {
        if (active) setTickets(data);
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
  }, []);

  // Verify there's stock for this ticket type, then add it to the cart.
  async function handleAdd(ticket) {
    setAddErrors((prev) => ({ ...prev, [ticket.id]: null }));
    setVerifyingId(ticket.id);
    try {
      const { available } = await verifyAvailability(ticket.id);
      if (available) {
        addItem(ticket);
      } else {
        setAddErrors((prev) => ({
          ...prev,
          [ticket.id]: 'Sold out — no tickets left for this type.',
        }));
      }
    } catch (err) {
      setAddErrors((prev) => ({
        ...prev,
        [ticket.id]: err.message ?? 'Could not verify availability.',
      }));
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Choose your experience
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Three tiers, one unforgettable event. Add tickets to your cart and check
          out in seconds.
        </p>
      </section>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tickets grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <TicketCardSkeleton key={i} />)
          : tickets.map((ticket) => {
              const cartItem = items.find((i) => i.id === ticket.id);
              return (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  quantity={cartItem?.quantity ?? 0}
                  verifying={verifyingId === ticket.id}
                  error={addErrors[ticket.id]}
                  onAdd={() => handleAdd(ticket)}
                  onIncrement={() => increment(ticket.id)}
                  onDecrement={() => decrement(ticket.id)}
                />
              );
            })}
      </section>

      {/* Checkout nudge */}
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
