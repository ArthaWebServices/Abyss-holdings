'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendMessage } from '@/lib/api';
import Footer from '@/components/Footer';
import Link from 'next/link';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialSector = searchParams ? searchParams.get('sector') || '' : '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    sector: initialSector || 'General Corporate Inquiry',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (initialSector) {
      setForm((prev) => ({ ...prev, sector: initialSector }));
    }
  }, [initialSector]);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `[Sector: ${form.sector}] [Subject: ${form.subject || 'Inquiry'}] ${form.message}`,
      });
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        sector: 'General Corporate Inquiry',
        subject: '',
        message: '',
      });
    } catch {
      setStatus('error');
      setErr('Failed to submit message to the server. You can also email us directly at info@abyssholdings.com or investments@abyssholdings.com.');
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark">Send Online Message</h2>
        <p className="text-xs text-gray-500 mt-1">
          Fill in the details below. Messages are routed directly to the accountable department leadership.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-4">
            ✓
          </div>
          <h3 className="font-bold text-dark text-2xl mb-2">Message Successfully Dispatched</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6 leading-relaxed">
            Thank you for reaching out to Abyss Holdings. Your message has been logged and forwarded to our corporate communications officers.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. Vikram Mehta"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Corporate Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. v.mehta@enterprise.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Phone / Mobile
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Target Business Sector / Division
              </label>
              <select
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
              >
                <option value="General Corporate Inquiry">General Corporate Inquiry</option>
                <option value="Investments & Capital">Investments & Capital</option>
                <option value="Construction & Engineering">Construction & Engineering</option>
                <option value="Realities & Urban Spaces">Realities & Urban Spaces</option>
                <option value="Technologies & Digital Systems">Technologies & Digital Systems</option>
                <option value="Automobiles & Mobility">Automobiles & Mobility</option>
                <option value="Earth Movers & Heavy Machinery">Earth Movers & Heavy Machinery</option>
                <option value="Apparels & Textile Manufacturing">Apparels & Textile Manufacturing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">
              Subject / Mandate Title
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Infrastructure EPC Partnership Mandate"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">
              Detailed Message / Requirements <span className="text-primary">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Please outline the scope, timeline, and strategic requirements of your inquiry..."
            />
          </div>

          {status === 'error' && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-all shadow-md shadow-red-500/20 disabled:opacity-50"
          >
            {status === 'sending' ? 'Transmitting to Corporate Desk…' : 'Submit Official Inquiry →'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Corporate Hero Header ─────────────────────────── */}
        <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Corporate Inquiries & Liaison
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Contact Abyss Holdings
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Connect with our corporate communications desk, investor relations team, or specific sector heads.
              Our leadership is committed to prompt, accountable correspondence across all business verticals.
            </p>
          </div>
        </section>

        {/* ── Official Dual Inboxes Banner ──────────────────── */}
        <section className="bg-gray-50 border-b border-gray-100 py-10 px-6 sm:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: General Desk */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-2xl bg-red-50 text-primary flex items-center justify-center text-lg">
                    ✉️
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                    General Inquiries
                  </span>
                </div>
                <h3 className="font-bold text-dark text-lg mb-1">General & Corporate Desk</h3>
                <p className="text-xs text-gray-500 mb-4">
                  For corporate affairs, vendor submissions, public relations, and general communication.
                </p>
                <p className="text-base sm:text-lg font-mono font-bold text-dark">
                  info@abyssholdings.com
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Response within 24 hours</span>
                <a
                  href="mailto:info@abyssholdings.com?subject=Corporate%20Inquiry%20-%20Abyss%20Holdings"
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-xs font-semibold text-dark transition-colors"
                >
                  Compose Mail →
                </a>
              </div>
            </div>

            {/* Box 2: Investment Desk */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-2xl bg-red-50 text-primary flex items-center justify-center text-lg">
                    💼
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
                    Investor Relations
                  </span>
                </div>
                <h3 className="font-bold text-dark text-lg mb-1">Business & Investments Desk</h3>
                <p className="text-xs text-gray-500 mb-4">
                  For private equity co-investments, institutional debt, project partnerships, and M&A opportunities.
                </p>
                <p className="text-base sm:text-lg font-mono font-bold text-dark">
                  investments@abyssholdings.com
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Executive Priority Review</span>
                <a
                  href="mailto:investments@abyssholdings.com?subject=Strategic%20Investment%20Partnership%20-%20Abyss%20Holdings"
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-xs font-semibold text-dark transition-colors"
                >
                  Compose Mail →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Form & HQ Coordinates ────────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Interactive Form wrapped in Suspense */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="h-96 bg-gray-50 rounded-3xl animate-pulse" />}>
                <ContactFormInner />
              </Suspense>
            </div>

            {/* Right: Corporate Coordinates & Network */}
            <div className="lg:col-span-5 space-y-6">
              {/* Headquarters Box */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-red-400 uppercase tracking-wider mb-4 inline-block">
                  Global Headquarters
                </span>
                <h3 className="text-2xl font-black text-white mb-2">Mumbai Office</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Bandra Kurla Complex (BKC), Mumbai, Maharashtra, India.
                </p>

                <div className="space-y-3.5 text-xs border-t border-white/10 pt-5 text-gray-300">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">📞</span>
                    <span>General Switchboard: +91 22 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">✉️</span>
                    <span>Corporate Desk: info@abyssholdings.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">💼</span>
                    <span>Investments Desk: investments@abyssholdings.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">🕒</span>
                    <span>Office Hours: Mon - Fri | 09:00 - 18:30 IST</span>
                  </div>
                </div>
              </div>

              {/* Pan-India Presence Teaser */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                  National Footprint
                </p>
                <h4 className="font-bold text-dark text-base mb-2">
                  6 Operational Hubs Across India
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Our regional offices anchor local operations, engineering teams, and client liaison across major industrial corridors.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 font-medium mb-4">
                  <span className="flex items-center gap-1.5"><span>📍</span> Mumbai HQ</span>
                  <span className="flex items-center gap-1.5"><span>📍</span> Hyderabad</span>
                  <span className="flex items-center gap-1.5"><span>📍</span> Bengaluru</span>
                  <span className="flex items-center gap-1.5"><span>📍</span> Trivandrum</span>
                  <span className="flex items-center gap-1.5"><span>📍</span> Gujarat Hub</span>
                  <span className="flex items-center gap-1.5"><span>📍</span> Madhya Pradesh</span>
                </div>
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Explore Interactive Office Map</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
