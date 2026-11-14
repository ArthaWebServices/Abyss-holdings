'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/lib/api';
import { Project } from '@/types';
import Footer from '@/components/Footer';
import { useCompany } from '@/components/CompanyContext';

const DEFAULT_CATEGORIES = ['Construction', 'Investments', 'Realities', 'Technologies', 'Automobiles', 'Earth Movers', 'Apparels'];
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type ProjectsPageState =
  | { status: 'loading' }
  | { status: 'success'; projects: Project[] }
  | { status: 'error'; message: string };

export default function ProjectsPage() {
  const { company, services } = useCompany();
  const [pageState, setPageState] = useState<ProjectsPageState>({ status: 'loading' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';

  const load = () => {
    setPageState({ status: 'loading' });
    let active = true;
    getProjects()
      .then((data) => {
        if (active) {
          setPageState({
            status: 'success',
            projects: Array.isArray(data) ? data : [],
          });
        }
      })
      .catch((err: any) => {
        if (active) {
          setPageState({
            status: 'error',
            message: err?.response?.data?.error || err?.message || 'Unable to load corporate projects portfolio.',
          });
        }
      });
    return () => {
      active = false;
    };
  };

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, []);

  const projects = pageState.status === 'success' ? pageState.projects : [];

  const categories = useMemo(() => {
    const seen = new Set<string>(['All']);
    const list = ['All'];
    for (const cat of [...DEFAULT_CATEGORIES, ...projects.map((p) => p.category).filter(Boolean)]) {
      const normalized = cat.trim();
      const key = normalized.toLowerCase();
      if (normalized && !seen.has(key)) {
        seen.add(key);
        list.push(normalized);
      }
    }
    return list;
  }, [projects]);

  const activeServiceSlugs = useMemo(
    () => new Set(services.map((s) => toSlug(s.title) || s.id)),
    [services]
  );

  const filtered = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Corporate Hero Header ─────────────────────────── */}
        <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Delivery Track Record
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Featured Corporate Projects
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Showcasing landmark engineering accomplishments, strategic capital investments,
              digital cloud transformations, and global manufacturing mandates across India.
            </p>
          </div>
        </section>

        {/* ── Filter & Projects Grid ─────────────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-md shadow-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {pageState.status === 'loading' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : pageState.status === 'error' ? (
              <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100 max-w-xl mx-auto p-6">
                <p className="text-sm font-semibold text-red-700 mb-1">Unable to Load Projects</p>
                <p className="text-xs text-red-600 mb-4">{pageState.message}</p>
                <button
                  onClick={load}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all"
                >
                  Retry Loading Projects
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-gray-500 text-sm">No projects found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((p) => {
                  const sectorSlug = toSlug(p.category);
                  const hasSectorRoute = activeServiceSlugs.has(sectorSlug);
                  const divisionHref = hasSectorRoute ? `/services/${sectorSlug}` : '/services';
                  return (
                    <div
                      key={p.id}
                      className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                          <Image
                            src={p.imageUrl?.trim() || FALLBACK_IMAGE}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full text-dark shadow-sm">
                            {p.status}
                          </span>
                          <span className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {p.category}
                          </span>
                        </div>

                        <div className="p-6 sm:p-7">
                          <p className="text-[11px] text-gray-400 font-semibold mb-1">
                            Year: {p.year}
                          </p>
                          <h3 className="font-bold text-dark text-xl mb-3 group-hover:text-primary transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 border-t border-gray-100/60 flex items-center justify-between text-xs font-semibold text-primary">
                        <Link
                          href={divisionHref}
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{hasSectorRoute ? `Explore ${p.category} Division` : 'Explore Business Sectors'}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Direct Inquiries Banner ────────────────────────── */}
        <section className="bg-slate-900 text-white px-6 sm:px-12 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
                Project Partnerships
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Propose a Project or Strategic Alliance
              </h3>
              <p className="text-gray-400 text-sm mt-1 max-w-lg">
                Connect with our team at {adminEmail} or {hrEmail}.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25 shrink-0"
            >
              Contact Corporate Desk
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
