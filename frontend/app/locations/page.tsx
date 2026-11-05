import { getLocations } from '@/lib/api';
import { Location } from '@/types';
import Footer from '@/components/Footer';
import Link from 'next/link';

const FALLBACK_LOCATIONS: Location[] = [
  {
    id: '1',
    country: 'India',
    city: 'Mumbai',
    address: 'Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
    phone: '+91 22 1234 5678',
    email: 'contact@abyssholdings.com',
    isHeadquarter: true,
    order: 1,
  },
  {
    id: '2',
    country: 'India',
    city: 'Hyderabad',
    address: 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
    phone: '+91 40 1234 5678',
    email: 'hyderabad@abyssholdings.com',
    isHeadquarter: false,
    order: 2,
  },
  {
    id: '3',
    country: 'India',
    city: 'Trivandrum',
    address: 'Technopark Phase III, Trivandrum, Kerala 695583',
    phone: '+91 471 123 4567',
    email: 'trivandrum@abyssholdings.com',
    isHeadquarter: false,
    order: 3,
  },
  {
    id: '4',
    country: 'India',
    city: 'Madhya Pradesh',
    address: 'Arera Hills Industrial Area, Bhopal, Madhya Pradesh 462011',
    phone: '+91 755 123 4567',
    email: 'mp@abyssholdings.com',
    isHeadquarter: false,
    order: 4,
  },
  {
    id: '5',
    country: 'India',
    city: 'Bengaluru',
    address: 'Outer Ring Road (ORR) Tech Corridor, Bengaluru, Karnataka 560103',
    phone: '+91 80 1234 5678',
    email: 'bengaluru@abyssholdings.com',
    isHeadquarter: false,
    order: 5,
  },
  {
    id: '6',
    country: 'India',
    city: 'Gujarat',
    address: 'GIDC Mega Industrial Estate, Ahmedabad, Gujarat 382445',
    phone: '+91 79 1234 5678',
    email: 'gujarat@abyssholdings.com',
    isHeadquarter: false,
    order: 6,
  },
];

export default async function LocationsPage() {
  let locations: Location[] = [];
  try {
    const data = await getLocations();
    locations = data && data.length > 0 ? data : FALLBACK_LOCATIONS;
  } catch {
    locations = FALLBACK_LOCATIONS;
  }

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
              Anchored by our Mumbai Corporate Headquarters, Abyss Holdings operates a network of 6 strategic
              regional hubs across India to lead operations, engineering, and client liaison.
            </p>
          </div>
        </section>

        {/* ── Locations Grid ─────────────────────────────────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between hover:shadow-xl
                    ${loc.isHeadquarter
                      ? 'border-primary/50 bg-red-50/20 shadow-md ring-1 ring-primary/20'
                      : 'border-gray-200/80 bg-white hover:border-gray-300'}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
                          {loc.country}
                        </span>
                        <h3 className="font-black text-dark text-2xl mt-0.5">
                          {loc.city}
                        </h3>
                      </div>
                      {loc.isHeadquarter ? (
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          Global HQ
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Regional Hub
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-gray-600 my-6 pt-4 border-t border-gray-100">
                      {loc.address && (
                        <p className="flex items-start gap-2.5">
                          <span className="text-primary text-base shrink-0">📍</span>
                          <span className="leading-relaxed">{loc.address}</span>
                        </p>
                      )}
                      {loc.phone && (
                        <p className="flex items-center gap-2.5">
                          <span className="text-primary text-base shrink-0">📞</span>
                          <a href={`tel:${loc.phone}`} className="hover:text-primary transition-colors font-medium">
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

                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href={`/contact`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Inquire with {loc.city} Office</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
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
                General Inquiries: info@abyssholdings.com | Investment & Capital: investments@abyssholdings.com
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
