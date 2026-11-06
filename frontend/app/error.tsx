'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Application Exception]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-slate-950 text-white">
      <div className="max-w-lg w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-primary flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          Application Notice
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          A temporary client-side error occurred while rendering this view. You can reload the page or return to the main corporate portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-all border border-white/10"
          >
            Corporate Home
          </Link>
        </div>

        {error?.digest && (
          <p className="mt-8 text-[11px] text-gray-600 font-mono">
            Reference code: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

