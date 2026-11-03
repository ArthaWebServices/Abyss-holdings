import { getLocations } from '@/lib/api';
import { Location } from '@/types';
import Footer from '@/components/Footer';

export default async function LocationsPage() {
  let locations: Location[] = [];
  try { locations = await getLocations(); } catch {}

  return (
    <>
      <section className="min-h-screen px-12 py-20 bg-white">
        {/* Header – matches the "Our locations" bold style */}
        <div className="mb-12">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-3">Where We Are</p>
          <h1 className="text-5xl font-black text-dark leading-none">
            Our <span className="italic text-primary">locations</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <div key={loc.id}
              className={`rounded-2xl p-6 border transition-all hover:shadow-md
                ${loc.isHeadquarter ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-start gap-3 mb-4">
                {loc.isHeadquarter && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    HQ
                  </span>
                )}
                <div>
                  <p className="font-black text-dark text-lg">{loc.country}</p>
                  <p className="text-gray-400 text-sm">{loc.city}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                {loc.address && <p>📍 {loc.address}</p>}
                {loc.phone   && <p>📞 {loc.phone}</p>}
                {loc.email   && <p>✉️ {loc.email}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

