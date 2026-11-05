import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ALL_SECTORS_LIST, getSectorBySlug } from '@/lib/sectorsData';
import Footer from '@/components/Footer';

// Generate static params for all 7 sectors so they are pre-rendered at build time
export function generateStaticParams() {
  return ALL_SECTORS_LIST.map((sector) => ({
    slug: sector.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const sector = getSectorBySlug(params.slug);
  if (!sector) return { title: 'Sector Not Found | Abyss Holdings' };
  return {
    title: `${sector.title} | Abyss Holdings Group`,
    description: sector.tagline,
  };
}

export default function SectorDetailPage({ params }: { params: { slug: string } }) {
  const sector = getSectorBySlug(params.slug);

  if (!sector) {
    notFound();
  }

  // Filter other sectors for the bottom recommendation section
  const otherSectors = ALL_SECTORS_LIST.filter((s) => s.slug !== sector.slug);

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Breadcrumb & Top Indicator ──────────────────────── */}
        <section className="bg-gray-50 border-b border-gray-100 py-3.5 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-primary transition-colors">
                Sectors
              </Link>
              <span>/</span>
              <span className="text-dark font-semibold">{sector.title}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Division
              </span>
              <span>•</span>
              <span className="font-mono text-gray-400">ABYSS-{sector.slug.toUpperCase()}</span>
            </div>
          </div>
        </section>

        {/* ── Hero Banner ─────────────────────────────────────── */}
        <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center px-6 lg:px-16 py-20 overflow-hidden bg-slate-950 text-white">
          {/* Background Photo with Corporate Gradient */}
          <div className="absolute inset-0">
            <Image
              src={sector.heroImage}
              alt={sector.title}
              fill
              priority
              className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
          </div>

          <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {sector.badge}
              </div>

              {/* Title & Tagline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4">
                {sector.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mb-8">
                {sector.tagline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href={`/contact?sector=${encodeURIComponent(sector.title)}`}
                  className="px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold transition-all hover:bg-red-600 shadow-lg shadow-red-500/25 flex items-center gap-2"
                >
                  <span>Inquire for {sector.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <a
                  href={`mailto:${sector.inquiries.primaryEmail}?subject=Partnership%20Inquiry%20-%20Abyss%20${sector.title}`}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Direct Email ({sector.inquiries.primaryEmail})</span>
                </a>
              </div>
            </div>

            {/* Micro Quick Fact Box */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-4">
                Division Coordinates
              </p>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Primary Headquarters:</span>
                  <span className="text-white font-medium text-sm">{sector.inquiries.headquarters}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Primary Inquiries Inbox:</span>
                  <a href={`mailto:${sector.inquiries.primaryEmail}`} className="text-red-400 hover:underline font-mono">
                    {sector.inquiries.primaryEmail}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Capital & Executive Desk:</span>
                  <a href={`mailto:${sector.inquiries.secondaryEmail}`} className="text-gray-300 hover:underline font-mono">
                    {sector.inquiries.secondaryEmail}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Telephone Hotline:</span>
                  <span className="text-white font-medium">{sector.inquiries.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Metrics Bar ─────────────────────────────────── */}
        <section className="bg-slate-900 border-t border-b border-slate-800 text-white px-6 lg:px-16 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            {sector.keyStats.map((stat, i) => (
              <div key={i} className="border-l-2 border-primary/60 pl-4 py-1">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Strategic Mission & Overview ────────────────────── */}
        <section className="px-6 lg:px-16 py-20 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Operational Mission & Leadership
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight mb-6">
                Pioneering Growth & Value Creation in {sector.title}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                {sector.overview}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Operating under the unified corporate governance of Abyss Holdings, this division synergizes
                unrivaled technical depth, disciplined capital allocation, and strict regulatory adherence.
                Whether partnering with multinational conglomerates, sovereign developers, or institutional investors,
                we deliver turnkey outcomes engineered for durability and superior economic performance.
              </p>

              {/* Accreditations Tags */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Certified Standards & Governance
                </p>
                <div className="flex flex-wrap gap-2">
                  {sector.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium"
                    >
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Quote & Corporate Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-primary/20 blur-2xl" />
                <span className="text-5xl text-primary font-serif block mb-4">“</span>
                <p className="text-base sm:text-lg text-gray-200 font-light italic leading-relaxed mb-6">
                  {sector.executiveQuote.quote}
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 border border-primary text-primary flex items-center justify-center font-bold text-sm">
                    AH
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{sector.executiveQuote.author}</p>
                    <p className="text-xs text-gray-400">{sector.executiveQuote.role}</p>
                  </div>
                </div>
              </div>

              {/* Direct Touchpoint Card */}
              <div className="p-6 rounded-3xl bg-red-50/60 border border-red-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 text-lg">
                  ✉️
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">Dedicated Division Inbox</h4>
                  <p className="text-xs text-gray-600 mt-1 mb-2">
                    Inquire directly with division officers. All formal correspondence is reviewed within 24 business hours.
                  </p>
                  <a
                    href={`mailto:${sector.inquiries.primaryEmail}`}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Email {sector.inquiries.primaryEmail}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Capabilities Grid ──────────────────────────── */}
        <section className="px-6 lg:px-16 py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">
                Specialized Services & Execution
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Core Capabilities & Solutions
              </h2>
              <p className="text-gray-500 text-sm mt-3">
                Tailored solutions engineered with industry-leading technology, deep regulatory know-how, and strict quality control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sector.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {cap.icon}
                      </span>
                      <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">
                        {cap.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {cap.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Key Deliverables
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cap.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Photographic Operations Gallery ─────────────────── */}
        <section className="px-6 lg:px-16 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">
                  Operations In Action
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                  Visual Showcase & Infrastructure
                </h2>
                <p className="text-gray-500 text-sm mt-2 max-w-xl">
                  Authentic photographic documentation showcasing our people, operational infrastructure, facilities, and real-world execution.
                </p>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {sector.gallery.length} High-Resolution Plates
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sector.gallery.map((img, i) => (
                <div
                  key={i}
                  className="group relative rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-[340px]"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.caption}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                      {img.tag}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="text-xs sm:text-sm font-medium leading-snug text-gray-100">
                        {img.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Flagship Projects / Portfolio ───────────────────── */}
        <section className="px-6 lg:px-16 py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">
                Track Record of Excellence
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Featured Projects & Milestones
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sector.projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={proj.imageUrl}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-dark shadow-sm">
                      {proj.status}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                        <span>{proj.location}</span>
                        <span>•</span>
                        <span>{proj.year}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dual Email & Contact Action Banner ─────────────── */}
        <section className="px-6 lg:px-16 py-20 bg-dark text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-red-400 mb-4">
              <span>✉️</span> Official Corporate Channels
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Partner with Abyss {sector.title}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-10">
              For commercial mandates, capital partnerships, vendor empanelment, or tender submissions,
              contact our specialized department heads directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 text-left">
              {/* Channel 1: General & Operations */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                  General & Technical Inquiries
                </span>
                <p className="text-lg font-bold text-white mb-2">
                  {sector.inquiries.primaryEmail}
                </p>
                <a
                  href={`mailto:${sector.inquiries.primaryEmail}?subject=Inquiry%20regarding%20${encodeURIComponent(sector.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-red-300 transition-colors"
                >
                  <span>Compose Mail</span>
                  <span>→</span>
                </a>
              </div>

              {/* Channel 2: Investments & Capital */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                  Investments & Executive Desk
                </span>
                <p className="text-lg font-bold text-white mb-2">
                  {sector.inquiries.secondaryEmail}
                </p>
                <a
                  href={`mailto:${sector.inquiries.secondaryEmail}?subject=Capital%20%26%20Partnership%20-%20${encodeURIComponent(sector.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-red-300 transition-colors"
                >
                  <span>Compose Mail</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            <Link
              href={`/contact?sector=${encodeURIComponent(sector.title)}`}
              className="inline-block px-10 py-4 rounded-xl bg-primary hover:bg-red-600 text-white font-semibold text-sm transition-all shadow-xl shadow-red-600/30"
            >
              Open Online Inquiry Form
            </Link>
          </div>
        </section>

        {/* ── Other Business Sectors Carousel/Grid ─────────────── */}
        <section className="px-6 lg:px-16 py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-primary font-bold tracking-widest uppercase mb-1">
                  Explore More
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-dark">
                  Other Business Sectors
                </h3>
              </div>
              <Link
                href="/services"
                className="text-xs font-semibold text-dark hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>View All 7 Sectors</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSectors.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="group rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={item.heroImage}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-dark group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary mt-4 group-hover:translate-x-1 transition-transform">
                      <span>Explore Vertical</span>
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
