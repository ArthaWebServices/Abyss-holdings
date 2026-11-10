'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getServices } from '@/lib/api';
import { Service } from '@/types';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/components/Footer';
import { useCompany } from '@/components/CompanyContext';

const VISIBLE = 3;

export default function ServicesPage() {
  const { company, services: contextServices } = useCompany();
  const [services, setServices] = useState<Service[]>(contextServices);
  const [startIdx, setStartIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('grid');

  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';

  useEffect(() => {
    setServices(contextServices);
  }, [contextServices]);

  useEffect(() => {
    let active = true;
    getServices()
      .then((data) => {
        if (active && Array.isArray(data)) setServices(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const maxStart = Math.max(0, services.length - VISIBLE);
  const next = () => setStartIdx((i) => Math.min(i + 1, maxStart));
  const prev = () => setStartIdx((i) => Math.max(i - 1, 0));
  const visible = services.slice(startIdx, startIdx + VISIBLE);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Corporate Hero Header ─────────────────────────── */}
        <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Conglomerate Portfolio
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white">
              Our Business Sectors
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              A diversified multi-sector powerhouse driving national transformation across 7 core industries.
              Click on any sector below to explore its dedicated operations, facilities, and project track record.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 max-w-3xl">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">{services.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Active Verticals</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">500+</p>
                <p className="text-xs text-gray-400 mt-0.5">Projects Delivered</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">6</p>
                <p className="text-xs text-gray-400 mt-0.5">Regional Office Hubs</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">100%</p>
                <p className="text-xs text-gray-400 mt-0.5">Governance Adherence</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Sectors Directory ────────────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-white relative">
          <div className="max-w-7xl mx-auto">
            {/* Header Controls */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-1">
                  Explore Portfolios
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-dark">
                  All 7 Core Verticals
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Each sector operates with dedicated infrastructure, engineering teams, and capital stewardship.
                </p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl self-start md:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-dark shadow-sm'
                      : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  All Grid ({services.length})
                </button>
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'slider'
                      ? 'bg-white text-dark shadow-sm'
                      : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  Carousel (3 View)
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-gray-500 text-sm">No active business sectors available at the moment.</p>
              </div>
            ) : viewMode === 'slider' ? (
              <div>
                {/* Horizontal 3-card display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visible.map((s, i) => (
                    <ServiceCard key={s.id} service={s} index={startIdx + i} />
                  ))}
                </div>

                {/* Pagination & Navigation controls */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: maxStart + 1 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStartIdx(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          i === startIdx
                            ? 'w-7 bg-primary'
                            : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={prev}
                      disabled={startIdx === 0}
                      className="w-11 h-11 rounded-full border-2 border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all flex items-center justify-center text-xl font-bold"
                      aria-label="Previous services"
                    >
                      ‹
                    </button>
                    <span className="text-xs font-semibold text-gray-400">
                      {startIdx + 1} - {Math.min(startIdx + VISIBLE, services.length)} of {services.length}
                    </span>
                    <button
                      onClick={next}
                      disabled={startIdx >= maxStart}
                      className="w-11 h-11 rounded-full bg-primary text-white hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center text-xl font-bold shadow-sm"
                      aria-label="Next services"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Full Grid of all 7 services */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((s, i) => (
                  <ServiceCard key={s.id} service={s} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Dual Official Email Channels Banner ───────────── */}
        <section className="bg-gray-50 border-t border-b border-gray-100 px-6 sm:px-12 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">
                  Direct Division Access
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-dark tracking-tight mb-3">
                  Have a Project or Sector Inquiry?
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Our group executive desks are structured to route client tenders, joint-venture proposals,
                  and strategic procurement mandates directly to the accountable vertical leadership.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                  >
                    Direct Email & Phone Directory
                  </Link>
                  <Link
                    href="/locations"
                    className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-dark text-xs font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View Our 6 Indian Hubs
                  </Link>
                </div>
              </div>

              {/* Two Official Email Desks */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:border-primary/50 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center text-sm font-bold mb-3">
                    ✉️
                  </span>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Administration & Corporate
                  </p>
                  <p className="font-bold text-dark text-sm sm:text-base break-all mb-2">
                    {adminEmail}
                  </p>
                  <a
                    href={`mailto:${adminEmail}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Email Admin Desk →
                  </a>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:border-primary/50 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center text-sm font-bold mb-3">
                    💼
                  </span>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Human Resources & Careers
                  </p>
                  <p className="font-bold text-dark text-sm sm:text-base break-all mb-2">
                    {hrEmail}
                  </p>
                  <a
                    href={`mailto:${hrEmail}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Email HR Desk →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Scroll-to-Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-primary text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center text-sm font-black"
          aria-label="Scroll to top"
        >
          ▲
        </button>
      </main>

      <Footer />
    </>
  );
}
