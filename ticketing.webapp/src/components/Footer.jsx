import { Ticket } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-slate-700">
          <Ticket className="h-4 w-4" />
          <span className="text-sm font-semibold">EventPass</span>
        </div>
        <p className="text-sm text-slate-500">
          &copy; {year} EventPass. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
