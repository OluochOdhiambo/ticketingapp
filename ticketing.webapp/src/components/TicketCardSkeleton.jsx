/** Skeleton placeholder shown while the ticket API is loading. */
export default function TicketCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse-soft" />
        <div className="h-4 w-12 rounded bg-slate-200 animate-pulse-soft" />
      </div>

      <div className="mt-4 h-9 w-32 rounded bg-slate-200 animate-pulse-soft" />

      <div className="mt-5 space-y-3">
        <div className="h-4 w-full rounded bg-slate-200 animate-pulse-soft" />
        <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse-soft" />
        <div className="h-4 w-4/6 rounded bg-slate-200 animate-pulse-soft" />
      </div>

      <div className="mt-6 h-11 w-full rounded-xl bg-slate-200 animate-pulse-soft" />
    </div>
  );
}
