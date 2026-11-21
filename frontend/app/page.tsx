import { getServerCompany, getServerServices, getServerLocations, getServerProjects } from '@/lib/serverData';
import ServiceCard from '@/components/ServiceCard';
import RotatingEarth from '@/components/RotatingEarth';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [company, services, locations, projects] = await Promise.all([
    getServerCompany(),
    getServerServices(),
    getServerLocations(),
    getServerProjects(),
  ]);
  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';
  const heroDescription =
    company.description ||
    'A diversified group of companies driving innovation across 7 core industry sectors — from capital investments and civil mega-infrastructure to digital systems, mobility, heavy machinery, and global manufacturing.';

  const sectorCount = services.length || 7;
  const locationCount = locations.length || 6;
  const projectCount = projects.length ? `${projects.length}+` : '500+';

  return (
    <>
      {/* ── Hero with 3D Globe ─────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-16 pt-12 pb-20 overflow-hidden bg-white">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 -left-20 w-80 h-80 rounded-full opacity-5"
            style={{ background: company.primaryColor }}
          />
          <div
            className="absolute bottom-20 left-40 w-56 h-56 rounded-full opacity-5"
            style={{ background: company.primaryColor }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text & Actions */}
          <div className="lg:col-span-7 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-semibold tracking-wider uppercase text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              National Footprint • Multi-Sector Conglomerate
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-dark leading-tight tracking-tight mb-3">
              {company.name}
            </h1>
            <p className="text-xl text-gray-400 font-light tracking-[0.2em] uppercase mb-6">
              {company.tagline}
            </p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-normal">
              {heroDescription}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/services"
                className="px-8 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg shadow-red-200"
                style={{ background: company.primaryColor }}
              >
                Explore 7 Business Sectors
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-xl text-dark text-sm font-semibold border-2 border-dark hover:bg-dark hover:text-white transition-all"
              >
                Contact Corporate Desk
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">{sectorCount}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Diverse Sectors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">{locationCount}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Indian Office Hubs</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">{projectCount}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Projects Delivered</p>
              </div>
            </div>
          </div>

          {/* Right: 3D Rotating Earth (with Indian offices highlighting) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <RotatingEarth />
          </div>
        </div>
      </section>

      {/* ── Business Sectors Showcase ──────────────────────── */}
      <section className="px-6 sm:px-12 lg:px-16 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">
                Operational Portfolios
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Our {sectorCount} Core Business Sectors
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Click any sector to open its dedicated division landing page, operational capabilities, high-resolution visual showcase, and project track record.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors self-start md:self-auto"
            >
              <span>View All Sectors</span>
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>

          {/* Grid of all active sectors with links */}
          {services.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500 text-sm">
              No active business sectors available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Landmark Projects Photographic Showcase ── */}
      <section className="px-6 sm:px-12 lg:px-16 py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">
                Portfolio In Action
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Featured Landmark Projects
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Explore signature infrastructure developments, technology deployments, and institutional capital mandates across India.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors self-start md:self-auto"
            >
              <span>Explore All {projectCount} Projects</span>
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.slice(0, 4).map((proj, idx) => (
              <Link
                key={proj.id}
                href="/projects"
                className="group rounded-3xl overflow-hidden bg-gray-50 border border-gray-200/80 hover:border-red-200 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={proj.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80'}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.93]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-dark uppercase tracking-wider shadow-sm">
                      {proj.category || 'Flagship'}
                    </span>

                    {proj.images && proj.images.length > 1 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white">
                        📷 {proj.images.length} Photos
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] text-red-300 font-medium">{proj.location || 'India'}</p>
                      <h3 className="font-bold text-base leading-snug line-clamp-1">{proj.title}</h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                    {proj.client && (
                      <p className="mt-3 text-[11px] text-gray-400 font-medium">
                        Client: <span className="text-gray-700 font-semibold">{proj.client}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Inspect Dossier</span>
                  <span className="w-6 h-6 rounded-full bg-red-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Operational Scale & Engineering In Action (Photo Strip) ── */}
      <section className="py-16 bg-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-wider mb-2 inline-block">
              Field Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Industrial Scale & Engineering In Action
            </h2>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            Realizing high-precision capital projects across heavy civil works, hyperscale data networks, and industrial manufacturing plants.
          </p>
        </div>

        {/* 5-Photo High-Impact Panoramic Gallery Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 px-4 sm:px-8 max-w-[1600px] mx-auto">
          {[
            {
              title: 'Heavy Civil Infrastructure',
              sub: 'Precision concrete & deep foundation engineering',
              img: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80',
            },
            {
              title: 'Autonomous Robotics',
              sub: 'High-throughput electric vehicle assembly lines',
              img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
            },
            {
              title: 'Mission-Critical Cloud',
              sub: 'Tier-IV hyperscale edge datacenter facilities',
              img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
            },
            {
              title: 'Heavy Mining Fleets',
              sub: 'GPS-guided hydraulic earth moving equipment',
              img: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80',
            },
            {
              title: 'Sustainable Textile Plants',
              sub: 'Circular spinning mills & export apparel lines',
              img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-white/5"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-bold leading-tight group-hover:text-red-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Corporate Heritage & Visual Narrative ──────────── */}
      <section className="px-6 sm:px-12 lg:px-16 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[460px] bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
                alt="Corporate Headquarters Architecture"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Corporate Governance
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Institutional Reliability & Scale
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Headquartered in Mumbai with 6 regional offices powering projects across India.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">
              Corporate Synergy
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight mb-6">
              A Unified Model of Engineering, Capital & Integrity
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              At Abyss Holdings, each business sector operates with specialized domain expertise while benefiting from
              centralized institutional governance, substantial capital reserves, and shared engineering technologies.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Capital Strength & Risk Governance', desc: 'Robust balance sheet and disciplined underwriting delivering consistent economic stability.' },
                { title: 'Advanced Technology Integration', desc: '5D BIM, AI telemetry, cloud security, and predictive analytics deployed across every vertical.' },
                { title: 'Uncompromising Safety & ESG Standards', desc: 'Certified to ISO 45001, ISO 14001, and LEED green building benchmarks.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="w-8 h-8 rounded-xl bg-red-50 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-dark text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Official Dual Email Touchpoints Strip ──────────── */}
      <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 py-16 border-t border-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-red-400 uppercase tracking-wider mb-3 inline-block">
                Direct Corporate Correspondence
              </span>
              <h3 className="text-3xl font-black text-white mb-2">
                Get In Touch With Our Executive Desks
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                Whether you represent an institutional investor, public tender authority, corporate client, or strategic partner,
                our dedicated inboxes route directly to accountable division leadership.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Desk 1 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                  Administration & Corporate
                </span>
                <p className="text-base font-bold text-white mb-3 break-all font-mono">
                  {adminEmail}
                </p>
                <a
                  href={`mailto:${adminEmail}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-red-300 transition-colors"
                >
                  <span>Send Mail Directly</span>
                  <span>→</span>
                </a>
              </div>

              {/* Email Desk 2 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                  Human Resources & Careers
                </span>
                <p className="text-base font-bold text-white mb-3 break-all font-mono">
                  {hrEmail}
                </p>
                <a
                  href={`mailto:${hrEmail}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-red-300 transition-colors"
                >
                  <span>Send Mail Directly</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics & Track Record ─────────────────────── */}
      <section className="bg-dark text-white px-6 sm:px-12 lg:px-16 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: String(sectorCount), label: 'Business Sectors' },
            { value: String(locationCount), label: 'Indian Office Hubs' },
            { value: '15+', label: 'Years Experience' },
            { value: projectCount, label: 'Projects Delivered' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-primary">{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
