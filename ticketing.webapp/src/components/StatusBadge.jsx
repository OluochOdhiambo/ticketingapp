const styles = {
  Paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 ring-amber-200',
  Cancelled: 'bg-red-100 text-red-700 ring-red-200',
};

export default function StatusBadge({ status }) {
  const cls = styles[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}
    >
      {status}
    </span>
  );
}
