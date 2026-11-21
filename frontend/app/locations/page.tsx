import { getServerCompany, getServerLocations } from '@/lib/serverData';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Verified modern architectural skyline photography for each Indian regional hub
const CITY_PHOTOGRAPHY: Record<string, string> = {
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'new delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=900&q=80',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=80',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=80',
  telangana: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=900&q=80',
  hyderabad: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=900&q=80',
};

function getCityImage(city: string): string {
  const normalized = city.toLowerCase().trim();
  for (const [key, url] of Object.entries(CITY_PHOTOGRAPHY)) {
    if (normalized.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80';
}

export default async function LocationsPage() {
  const [locations, company] = await Promise.all([getServerLocations(), getServerCompany()]);
  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';
  const companyName = company.name || 'Abyss Holdings';

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Corporate Hero Header ─────────────────────────── */}
        <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              National Presence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Our Indian Hubs & Offices
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Anchored by our Corporate Headquarters, {companyName} operates a strategic network of
              regional hubs across India to lead operations, engineering, and client liaison.
            </p>
          </div>
        </section>

        {/* ── Locations Grid ─────────────────────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            {locations.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-gray-500 text-sm">No office locations have been published yet.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((loc) => {
                const cityImg = getCityImage(loc.city);
                const mapsQuery = encodeURIComponent(`${loc.address || loc.city}, India`);
                return (
                  <div
                    key={loc.id}
                    className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl bg-white
                      ${loc.isHeadquarter
                        ? 'border-primary/50 shadow-md ring-1 ring-primary/20'
                        : 'border-gray-200/80 hover:border-red-200'}`}
                  >
                    <div>
                      {/* Architectural City Hub Photography Header */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={cityImg}
                          alt={`${loc.city} Corporate Office Hub`}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.92]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        
                        {/* Status Pills */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span className="bg-white/95 backdrop-blur-md text-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {loc.country}
                          </span>
                          {loc.isHeadquarter ? (
                            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                              Global HQ
                            </span>
                          ) : (
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Regional Hub
                            </span>
                          )}
                        </div>

                        {/* City Title Overlay */}
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h3 className="font-black text-2xl tracking-tight drop-shadow-sm">
                            {loc.city}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div className="p-6">
                        <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                          {loc.address && (
                            <p className="flex items-start gap-2.5">
                              <span className="text-primary text-base shrink-0">📍</span>
                              <span className="leading-relaxed font-normal text-gray-700">{loc.address}</span>
                            </p>
                          )}
                          {loc.phone && (
                            <p className="flex items-center gap-2.5">
                              <span className="text-primary text-base shrink-0">📞</span>
                              <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors font-medium">
                                {loc.phone}
                              </a>
                            </p>
                          )}
                          {loc.email && (
                            <p className="flex items-center gap-2.5">
                              <span className="text-primary text-base shrink-0">✉️</span>
                              <a href={`mailto:${loc.email}`} className="hover:text-primary transition-colors font-mono text-xs">
                                {loc.email}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/contact`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <span>Inquire Desk</span>
                        <span>→</span>
                      </Link>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-dark transition-colors px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                      >
                        <span>Maps Directions</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </section>

        {/* ── Dual Inboxes Banner ────────────────────────────── */}
        <section className="bg-slate-900 text-white px-6 sm:px-12 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
                Centralized Communications
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Official Group Email Channels
              </h3>
              <p className="text-gray-400 text-sm mt-1 max-w-lg">
                Admin Desk: {adminEmail} | HR Desk: {hrEmail}
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
