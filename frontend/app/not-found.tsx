import Link from 'next/link';
import Logo from '@/components/Logo';

export const metadata = {
  title: '404 - Page Not Found | Abyss Holdings',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-20 bg-slate-950 text-white">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex justify-center mb-6">
          <Logo size={64} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
          Status 404 — Corporate Notice
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Page Not Located
        </h1>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The requested corporate portal or sector page is unavailable or has moved to an updated URL.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-95 transition-all text-center"
          >
            ← Return to Homepage
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-all border border-white/10 text-center"
          >
            Explore All 7 Sectors
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-gray-500">
          Need immediate assistance? Contact the Administration Desk at{' '}
          <a href="mailto:Admin@abyssholding.com" className="text-gray-300 hover:text-primary transition-colors underline">
            Admin@abyssholding.com
          </a>
        </div>
      </div>
    </div>
  );
}

