'use client';
import { useState, useEffect } from 'react';
import { getServices } from '@/lib/api';
import { DEFAULT_SERVICES } from '@/lib/constants';
import { Service } from '@/types';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/components/Footer';

const VISIBLE = 3;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [startIdx, setStartIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  useEffect(() => {
    getServices()
      .then((data) => {
        if (data && data.length > 0) setServices(data);
      })
      .catch(() => setServices(DEFAULT_SERVICES))
      .finally(() => setLoading(false));
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
      <section className="min-h-screen px-6 md:px-12 py-16 bg-white relative">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">
              What We Offer
            </p>
            <h1 className="text-4xl font-black text-dark">Our Services</h1>
            <p className="text-gray-400 mt-2 max-w-lg text-sm">
              Diversified expertise across 7 key industries, delivering excellence with precision and innovation.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl self-start md:self-auto">
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
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-gray-500 hover:text-dark'
              }`}
            >
              All Grid (7)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : viewMode === 'slider' ? (
          <div>
            {/* Horizontal 3-card display (matching tablet view) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={startIdx + i} />
              ))}
            </div>

            {/* Pagination & Navigation controls */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              {/* Horizontal Pagination Dots (matching tablet screen bottom dots) */}
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

              {/* Prev / Next Arrows */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        )}

        {/* Floating Scroll-to-Top Button (orange/red with up arrow matching tablet screen) */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-48 z-40 w-11 h-11 rounded-xl bg-primary text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center text-sm font-black"
          aria-label="Scroll to top"
        >
          ▲
        </button>
      </section>
      <Footer />
    </>
  );
}
