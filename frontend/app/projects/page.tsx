'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/lib/api';
import { Project } from '@/types';
import Footer from '@/components/Footer';
import { useCompany } from '@/components/CompanyContext';
import {
  MapPin,
  Building2,
  DollarSign,
  Layers,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Camera,
  Award,
  ExternalLink,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Construction',
  'Investments',
  'Realities',
  'Technologies',
  'Automobiles',
  'Earth Movers',
  'Apparels',
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80';

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
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Completed' | 'Ongoing'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Project Dossier / Gallery Modal State
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';

  const load = useCallback(() => {
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
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

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

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchStatus =
        selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchStatus && matchSearch;
    });
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  // Modal Open Handler
  const openDossier = (project: Project, photoIndex = 0) => {
    setActiveProject(project);
    setActivePhotoIdx(photoIndex);
  };

  const closeDossier = () => {
    setActiveProject(null);
    setActivePhotoIdx(0);
  };

  // Keyboard navigation for modal gallery
  useEffect(() => {
    if (!activeProject) return;

    const photos =
      activeProject.images && activeProject.images.length > 0
        ? activeProject.images
        : [activeProject.imageUrl || FALLBACK_IMAGE];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDossier();
      if (e.key === 'ArrowRight') {
        setActivePhotoIdx((prev) => (prev + 1) % photos.length);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProject]);

  return (
    <>
      <main className="min-h-screen bg-slate-50/50">
        {/* ── Corporate Hero Header ─────────────────────────── */}
        <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 pt-20 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A6192E_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Conglomerate Delivery Portfolio
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 max-w-4xl leading-[1.1]">
              Flagship Engineering & Capital Mandates
            </h1>
            
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed mb-10">
              Explore our landmark accomplishments across 7 critical economic pillars — spanning super-tall civil infrastructure,
              utility renewable corridors, luxury master-planned realities, hyper-scale financial cloud ecosystems,
              and advanced heavy industrial manufacturing.
            </p>

            {/* Conglomerate Scale Metrics Bar (Al-Hamad / Al-Rostamani style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-800 max-w-4xl">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white flex items-center">
                  <span>14</span>
                  <span className="text-primary">+</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                  Landmark Projects
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white flex items-center">
                  <span>₹8,500</span>
                  <span className="text-primary text-xl ml-1">Cr+</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                  Delivered Capital Value
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white flex items-center">
                  <span>7</span>
                  <span className="text-primary text-sm font-bold ml-1.5 uppercase">Core Sectors</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                  Industry Footprint
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white flex items-center">
                  <span>100</span>
                  <span className="text-primary">%</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                  Quality & Safety Adherence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter, Search & Interactive Portfolio ────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-12 max-w-7xl mx-auto">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Sector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? projects.length
                    : projects.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-red-500/20'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-dark'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Status Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project, client, city..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto justify-center">
                {(['All', 'Completed', 'Ongoing'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedStatus === st
                        ? 'bg-white text-dark shadow-sm'
                        : 'text-gray-500 hover:text-dark'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Project State Render ─────────────────────────── */}
          {pageState.status === 'loading' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[480px] bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse p-4">
                  <div className="h-64 bg-gray-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/3 mb-3" />
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-4" />
                  <div className="h-16 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : pageState.status === 'error' ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm max-w-xl mx-auto p-8">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Unable to Load Projects</h3>
              <p className="text-xs text-red-600 mb-6 leading-relaxed">{pageState.message}</p>
              <button
                onClick={load}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-500/20"
              >
                Retry Loading Portfolio
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3 text-xl">
                📂
              </div>
              <p className="text-dark font-bold text-base mb-1">No Projects Found</p>
              <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
                No corporate initiatives match your active filter criteria. Try adjusting your sector or search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark rounded-xl text-xs font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => {
                const photos = p.images && p.images.length > 0 ? p.images : [p.imageUrl || FALLBACK_IMAGE];
                const sectorSlug = toSlug(p.category);
                const hasSectorRoute = activeServiceSlugs.has(sectorSlug);
                const divisionHref = hasSectorRoute ? `/services/${sectorSlug}` : '/services';

                return (
                  <article
                    key={p.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Media Showcase Container */}
                      <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={photos[0]}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                        {/* Status Badge */}
                        <span
                          className={`absolute top-4 right-4 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md ${
                            p.status === 'Completed'
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-amber-500/90 text-white'
                          }`}
                        >
                          {p.status}
                        </span>

                        {/* Sector Tag */}
                        <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                          {p.category}
                        </span>

                        {/* Bottom Overlay: Photo Count & Location Tag */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs z-10">
                          {p.location ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-200 truncate max-w-[70%]">
                              <MapPin size={12} className="text-primary shrink-0" />
                              <span className="truncate">{p.location.split(',')[0]}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-300">India Operations</span>
                          )}

                          <button
                            onClick={() => openDossier(p, 0)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-primary text-white text-[10px] font-bold backdrop-blur-md transition-colors"
                            title="View Photo Gallery"
                          >
                            <Camera size={12} />
                            <span>{photos.length} Photos</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 sm:p-7">
                        {/* Client / Partner Pill */}
                        {p.client && (
                          <p className="text-[11px] text-primary font-bold uppercase tracking-wider mb-2 line-clamp-1 flex items-center gap-1">
                            <Briefcase size={12} className="shrink-0" />
                            <span>{p.client}</span>
                          </p>
                        )}

                        <h3 className="font-black text-dark text-xl mb-3 group-hover:text-primary transition-colors leading-snug">
                          {p.title}
                        </h3>

                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-5">
                          {p.description}
                        </p>

                        {/* Quick Spec Strip */}
                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 text-[11px] text-gray-600">
                          {p.scale && (
                            <div className="flex items-center gap-1.5 truncate">
                              <Layers size={13} className="text-gray-400 shrink-0" />
                              <span className="truncate font-semibold text-dark">{p.scale.split('|')[0]}</span>
                            </div>
                          )}
                          {p.value && (
                            <div className="flex items-center gap-1.5 truncate">
                              <DollarSign size={13} className="text-gray-400 shrink-0" />
                              <span className="truncate font-semibold text-dark">{p.value.split('(')[0]}</span>
                            </div>
                          )}
                        </div>

                        {/* Multi-Photo Thumbnail Bar Preview */}
                        {photos.length > 1 && (
                          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Preview:
                            </span>
                            <div className="flex items-center gap-1.5">
                              {photos.slice(0, 4).map((imgUrl, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => openDossier(p, idx)}
                                  className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-all hover:scale-105"
                                  title={`View photo ${idx + 1}`}
                                >
                                  <Image src={imgUrl} alt="thumbnail" fill className="object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => openDossier(p, 0)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-dark hover:text-primary transition-colors"
                      >
                        <span>Full Dossier & Specs</span>
                        <ArrowRight size={13} />
                      </button>

                      <Link
                        href={divisionHref}
                        className="text-[11px] font-semibold text-gray-400 hover:text-primary transition-colors"
                      >
                        {p.category} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Direct Inquiries Banner ────────────────────────── */}
        <section className="bg-slate-900 text-white px-6 sm:px-12 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
                Strategic Partnerships & EPC Execution
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Propose a Capital Project or Sovereign Joint Venture
              </h3>
              <p className="text-gray-400 text-sm mt-1 max-w-lg leading-relaxed">
                Connect directly with our executive governance council at {adminEmail} or {hrEmail}.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25 shrink-0"
            >
              Initiate Corporate Dialogue →
            </Link>
          </div>
        </section>
      </main>

      {/* ── Interactive Project Dossier & Gallery Lightbox Modal (Al-Hamad / Al-Rostamani style) ── */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={closeDossier}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col my-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-50 text-primary">
                      {activeProject.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeProject.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {activeProject.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      Year: {activeProject.year}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-dark tracking-tight mt-1">
                    {activeProject.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeDossier}
                aria-label="Close Project Dossier"
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-dark flex items-center justify-center transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Photo Gallery Viewer */}
              {(() => {
                const galleryPhotos =
                  activeProject.images && activeProject.images.length > 0
                    ? activeProject.images
                    : [activeProject.imageUrl || FALLBACK_IMAGE];
                const currentImg = galleryPhotos[activePhotoIdx] || galleryPhotos[0];

                return (
                  <div className="space-y-3">
                    <div className="relative h-[320px] sm:h-[450px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-gray-100 shadow-inner group">
                      <Image
                        src={currentImg}
                        alt={`${activeProject.title} - Photo ${activePhotoIdx + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />

                      {/* Photo Navigation Overlay Arrows */}
                      {galleryPhotos.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setActivePhotoIdx(
                                (prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length
                              )
                            }
                            aria-label="Previous photograph"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() =>
                              setActivePhotoIdx((prev) => (prev + 1) % galleryPhotos.length)
                            }
                            aria-label="Next photograph"
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      {/* Counter Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                        <Camera size={13} />
                        <span>
                          {activePhotoIdx + 1} of {galleryPhotos.length} Photos
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Selector Strip */}
                    {galleryPhotos.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {galleryPhotos.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => setActivePhotoIdx(i)}
                            className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                              i === activePhotoIdx
                                ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                                : 'border-gray-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <Image src={url} alt="thumbnail" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Technical Specifications Sheet (Al-Hamad / Al-Rostamani style) */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} /> Technical Project Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                  {activeProject.client && (
                    <div className="space-y-1">
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        Client / Stakeholder
                      </p>
                      <p className="font-bold text-dark text-sm leading-snug">{activeProject.client}</p>
                    </div>
                  )}

                  {activeProject.location && (
                    <div className="space-y-1">
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        Geographic Location
                      </p>
                      <p className="font-bold text-dark text-sm leading-snug flex items-center gap-1">
                        <MapPin size={13} className="text-primary shrink-0" />
                        <span>{activeProject.location}</span>
                      </p>
                    </div>
                  )}

                  {activeProject.scale && (
                    <div className="space-y-1">
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        Project Scale / Built-Up Area
                      </p>
                      <p className="font-bold text-dark text-sm leading-snug">{activeProject.scale}</p>
                    </div>
                  )}

                  {activeProject.value && (
                    <div className="space-y-1">
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        Contract / Capital Value
                      </p>
                      <p className="font-black text-primary text-sm leading-snug">
                        {activeProject.value}
                      </p>
                    </div>
                  )}

                  {activeProject.scope && (
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        Scope of Work
                      </p>
                      <p className="font-semibold text-gray-700 text-xs leading-relaxed">
                        {activeProject.scope}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Elaborate Engineering Narrative & Execution Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} className="text-primary" /> Engineering & Execution Overview
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {activeProject.longDescription || activeProject.description}
                </p>
              </div>

              {/* Key Technical Highlights & Certifications */}
              {activeProject.highlights && activeProject.highlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
                    <Award size={16} className="text-primary" /> Key Innovations & Governance Milestones
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProject.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-sm flex items-start gap-2.5"
                      >
                        <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-xs font-semibold text-gray-700 leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-6 sm:px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
              <Link
                href={`mailto:${adminEmail}?subject=${encodeURIComponent(
                  `Inquiry Regarding Project: ${activeProject.title}`
                )}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-red-600 transition-all shadow-md shadow-red-500/20 text-center"
              >
                Inquire About Similar Mandates →
              </Link>

              <button
                onClick={closeDossier}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark text-xs font-semibold transition-all text-center"
              >
                Close Project Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
