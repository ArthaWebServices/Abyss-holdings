import { getServerCompany, getServerLocations } from '@/lib/serverData';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Direct Contact | Abyss Holdings Group',
  description: 'Connect directly with Abyss Holdings via our official email inboxes and telephone switchboards.',
};

export default async function ContactPage() {
  const [company, locations] = await Promise.all([getServerCompany(), getServerLocations()]);
  const companyName = company.name || 'Abyss Holdings';
  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';
  const hqLocation = locations.find((l) => l.isHeadquarter) || locations[0];
  const hqTitle = hqLocation ? `${hqLocation.city} Corporate Headquarters` : `${companyName} Corporate Headquarters`;
  const hqAddress = hqLocation?.address || company.address || 'Mumbai, Maharashtra, India';
  const hqPhone = company.phone || hqLocation?.phone || '+91 22 1234 5678';
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ── Hero Header ─────────────────────────────────────── */}
        <section className="bg-slate-950 text-white px-6 sm:px-12 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Direct Communication Channels
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
              Direct Contact & Switchboards
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              We provide direct, unfiltered access to our leadership and department heads.
              Connect immediately via our 2 official email inboxes or dedicated direct telephone lines below.
            </p>
          </div>
        </section>

        {/* ── 2 Official Email Desks (Primary Connection) ────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">
                Official Inboxes (2 Email IDs Only)
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Connect Directly via Email
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                All communications are routed directly to responsible executive officers. Choose the appropriate desk below:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Desk 1: Admin */}
              <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-gray-200/90 shadow-sm hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-2xl bg-red-50 text-primary flex items-center justify-center text-2xl">
                      ✉️
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                      Administration Desk
                    </span>
                  </div>

                  <h3 className="font-black text-dark text-2xl mb-2">
                    {adminEmail}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Primary inbox for corporate inquiries, business partnerships, executive mandates,
                    tenders, investments, and operational correspondence.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5 text-xs text-gray-600 mb-6">
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span> Corporate Governance & Liaison
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span> Commercial & Project Proposals
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span> Vendor Empanelment & Procurement
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`mailto:${adminEmail}?subject=${encodeURIComponent(`Corporate Inquiry - ${companyName}`)}`}
                    className="w-full sm:w-auto flex-1 text-center py-3.5 px-6 rounded-xl bg-primary hover:bg-red-600 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20"
                  >
                    Compose Email to Admin →
                  </a>
                </div>
              </div>

              {/* Desk 2: HR */}
              <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-gray-200/90 shadow-sm hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-2xl bg-red-50 text-primary flex items-center justify-center text-2xl">
                      💼
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
                      Human Resources Desk
                    </span>
                  </div>

                  <h3 className="font-black text-dark text-2xl mb-2">
                    {hrEmail}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Dedicated inbox for career applications, talent acquisition, recruitment inquiries,
                    internships, employment verification, and human capital affairs.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5 text-xs text-gray-600 mb-6">
                    <p className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Careers & Executive Hiring
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Resume & CV Submissions
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Academic & Institutional Partnerships
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`mailto:${hrEmail}?subject=${encodeURIComponent(`Job Application / HR Inquiry - ${companyName}`)}`}
                    className="w-full sm:w-auto flex-1 text-center py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-dark text-white text-xs font-bold transition-all shadow-md"
                  >
                    Compose Email to HR →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Telephone Hotlines & Corporate Switchboards ─────── */}
        <section className="px-6 sm:px-12 lg:px-16 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">
                Voice Telephone Connections
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                Direct Telephony Lines
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Call our headquarters or regional hubs directly during business hours (Monday – Friday, 09:00 – 18:30 IST).
              </p>
            </div>

            {/* Central Switchboard Feature Box */}
            <div className="mb-12 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="relative max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <span>📍</span> Central Global Switchboard
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">
                  {hqTitle}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {hqAddress}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <a
                    href={`tel:${hqPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-red-600 text-white font-black text-lg transition-all shadow-xl shadow-red-500/30"
                  >
                    <span>📞</span>
                    <span>{hqPhone}</span>
                  </a>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p className="text-white font-semibold">Hours: 09:00 - 18:30 IST</p>
                    <p>English, Hindi & Regional Languages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Offices Directory */}
            <div>
              <h3 className="font-bold text-xl text-dark mb-6">Regional Hub Direct Numbers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((office) => (
                  <div
                    key={office.id}
                    className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-lg text-dark">{office.city}</h4>
                        {office.isHeadquarter && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold uppercase">
                            HQ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-primary font-semibold mb-3">
                        {office.isHeadquarter ? 'Corporate Headquarters' : `${office.country} Regional Hub`}
                      </p>
                      {office.address && (
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{office.address}</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200/60 space-y-2 text-xs">
                      {office.phone && (
                        <a
                          href={`tel:${office.phone.replace(/\s+/g, '')}`}
                          className="flex items-center justify-between text-dark font-bold hover:text-primary py-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>📞</span>
                            <span>{office.phone}</span>
                          </span>
                          <span className="text-[11px] text-primary">Call →</span>
                        </a>
                      )}
                      {office.email && (
                        <a
                          href={`mailto:${office.email}`}
                          className="flex items-center justify-between text-gray-600 hover:text-primary py-1 font-mono text-[11px]"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>✉️</span>
                            <span>{office.email}</span>
                          </span>
                          <span className="text-gray-400">Email</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
