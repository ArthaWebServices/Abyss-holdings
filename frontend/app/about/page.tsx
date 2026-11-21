import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { getServerCompany } from '@/lib/serverData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'About Abyss Holdings – Group of Companies',
  description: 'Learn about the legacy, governance, executive leadership, and multi-sector reach of Abyss Holdings Group.',
};

export default async function AboutPage() {
  const company = await getServerCompany();
  const companyName = company.name || 'Abyss Holdings';
  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Corporate Hero Header ─────────────────────────── */}
        <section className="relative min-h-[500px] flex items-center px-6 sm:px-12 lg:px-16 py-20 bg-slate-950 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=85"
              alt="Abyss Holdings Corporate Headquarters"
              fill
              priority
              className="object-cover object-center opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Corporate Profile & Heritage
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              About {companyName}
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed mb-8">
              A diversified multi-sector conglomerate anchored in integrity, visionary capital stewardship,
              and transformative industrial execution across India and global growth corridors.
            </p>

            {/* Micro Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 max-w-3xl">
              <div>
                <p className="text-3xl font-black text-primary">7</p>
                <p className="text-xs text-gray-400 mt-0.5">Industry Sectors</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">500+</p>
                <p className="text-xs text-gray-400 mt-0.5">Projects Delivered</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">6</p>
                <p className="text-xs text-gray-400 mt-0.5">Indian Office Hubs</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">15+</p>
                <p className="text-xs text-gray-400 mt-0.5">Years of Excellence</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Corporate Story & Narrative ───────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-20 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">
                Our Foundation & Vision
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight mb-6">
                Building Enduring Value Across Diverse Economic Landscapes
              </h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Headquartered in the commercial capital of Mumbai, Abyss Holdings stands as a dynamic
                  multi-sector corporate conglomerate with operational depth across seven critical industry verticals:
                  Investments & Capital, Construction & Infrastructure, Realities & Urban Spaces, Technologies & Digital Systems,
                  Automobiles & Clean Mobility, Earth Movers & Heavy Machinery, and Apparels & Textile Manufacturing.
                </p>
                <p>
                  Our institutional model unites rigorous financial underwriting, agile engineering expertise, and
                  uncompromising governance. Across every operating company, we combine deep domain specialization
                  with centralized capital governance to unlock cross-industry synergies and resilient economic returns.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-2xl mb-2 block">🏛️</span>
                  <h4 className="font-bold text-dark text-sm mb-1">Corporate Governance</h4>
                  <p className="text-xs text-gray-500">
                    Stringent board oversight, international audit standards, and transparent shareholder communication.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-2xl mb-2 block">🌱</span>
                  <h4 className="font-bold text-dark text-sm mb-1">ESG Responsibility</h4>
                  <p className="text-xs text-gray-500">
                    Proactive environmental stewardship, circular supply chain protocols, and community empowerment.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px]">
                <Image
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&q=80"
                  alt="Abyss Holdings Leadership Deliberations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                    Corporate Leadership
                  </span>
                  <p className="text-sm font-semibold">
                    Steered by seasoned industry leaders, institutional engineers, and capital managers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Operational Visual Gallery ────────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">
                Operational Breadth
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Engineering, Infrastructure & Enterprise
              </h2>
              <p className="text-gray-500 text-sm mt-3">
                From high-density cloud data centers to mega civil developments and sustainable manufacturing facilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  img: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80',
                  title: 'Civil & Structural EPC',
                  sub: 'Mega infrastructure engineering across key transit and industrial corridors.',
                },
                {
                  img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
                  title: 'Enterprise Tech & AI Systems',
                  sub: 'High-availability mission-critical cloud, cybersecurity, and data telemetry.',
                },
                {
                  img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
                  title: 'Grade-A Realities & Townships',
                  sub: 'Curating luxury commercial towers and integrated master-planned communities.',
                },
                {
                  img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
                  title: 'Capital Investments & Private Equity',
                  sub: 'Deploying strategic growth capital and institutional asset management.',
                },
                {
                  img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
                  title: 'Heavy Earth Moving & Mining Fleets',
                  sub: 'High-tonnage hydraulic excavators and GPS-graded terrain development.',
                },
                {
                  img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
                  title: 'Sustainable Garment Manufacturing',
                  sub: 'Zero-liquid-discharge facilities crafting organic textiles for global export.',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.92]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-dark group-hover:text-primary transition-colors mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {card.sub}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Official Contact & Email Strip ────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
                Direct Corporate Touchpoints
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Connect with {companyName} Corporate
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-lg">
                Reach out to our executive desks for investment mandates, business development, or institutional partnerships.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={`mailto:${adminEmail}`}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all flex items-center gap-2"
              >
                <span>✉ {adminEmail}</span>
              </a>
              <a
                href={`mailto:${hrEmail}`}
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-red-600 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/25 flex items-center gap-2"
              >
                <span>💼 {hrEmail}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
