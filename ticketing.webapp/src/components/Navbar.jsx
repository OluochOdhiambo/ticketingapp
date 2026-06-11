import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Ticket, ShoppingCart, Menu, X, UserRound } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useCustomerStore } from '../store/customerStore';

const navLinks = [
  { to: '/', label: 'Tickets', end: true },
  { to: '/orders', label: 'Orders' },
  { to: '/customers', label: 'Customers' },
  { to: '/checkout', label: 'Checkout' },
];

function CartButton({ onClick }) {
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <Link
      to="/checkout"
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:bg-slate-100"
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function CustomerChip() {
  const customer = useCustomerStore((s) => s.customer);
  if (!customer) return null;

  return (
    <Link
      to="/select-customer"
      className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 sm:inline-flex"
      title="Switch customer"
    >
      <UserRound className="h-4 w-4" />
      <span className="font-medium">{customer.firstname}</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">EventPass</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CustomerChip />
          <CartButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
