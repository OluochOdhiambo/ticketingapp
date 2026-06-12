import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';
import { CUSTOMERS } from '../utils/customers';
import { useCustomerStore } from '../store/customerStore';

function fetchCustomers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(CUSTOMERS.map((c) => ({ ...c }))), 300);
  });
}

function SkeletonList() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="space-y-2">
        <div className="h-4 w-40 rounded bg-slate-200 animate-pulse-soft" />
        <div className="h-3 w-56 rounded bg-slate-200 animate-pulse-soft" />
      </div>
      <div className="h-5 w-5 rounded bg-slate-200 animate-pulse-soft" />
    </div>
  ));
}

export default function SelectCustomerPage() {
  const navigate = useNavigate();
  const setCustomer = useCustomerStore((s) => s.setCustomer);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchCustomers()
      .then((list) => {
        if (active) setCustomers(list);
      })
      .catch((err) => {
        if (active) setError(err.message ?? 'Failed to load customers.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function choose(customer) {
    setCustomer(customer);
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Who's booking?
          </h1>
          <p className="text-sm text-slate-500">
            Select a customer to start an order on their behalf.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <SkeletonList />
        ) : (
          customers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-900 hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {c.firstname} {c.lastname}
                </p>
                <p className="text-sm text-slate-500">
                  {c.code} - {c.email}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
