import { getCompany, getServices } from '@/lib/api';
import { Company, Service } from '@/types';
import { DEFAULT_SERVICES } from '@/lib/constants';
import ServiceCard from '@/components/ServiceCard';
import RotatingEarth from '@/components/RotatingEarth';
import Footer from '@/components/Footer';
import Link from 'next/link';

async function getData(): Promise<{ company: Company; services: Service[] }> {
  try {
    const [company, services]: [Company, Service[]] = await Promise.all([getCompany(), getServices()]);
    return {
      company,
      services: services && services.length > 0 ? services : DEFAULT_SERVICES,
    };
  } catch {
    return {
      company: {
        name: 'Abyss Holdings', tagline: 'Group of Companies',
        description: 'A diversified group of companies.',
        primaryColor: '#E84545',
      } as Company,
      services: DEFAULT_SERVICES,
    };
  }
}

export default async function HomePage() {
  const { company, services } = await getData();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-16 pt-16 pb-24 overflow-hidden bg-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full opacity-5"
            style={{ background: company.primaryColor }} />
          <div className="absolute bottom-20 left-40 w-56 h-56 rounded-full opacity-5"
            style={{ background: company.primaryColor }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text & Actions */}
          <div className="lg:col-span-7 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-semibold tracking-wider uppercase text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Global Vision • Regional Excellence
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-dark leading-tight tracking-tight mb-3">
              {company.name}
            </h1>
            <p className="text-xl text-gray-400 font-light tracking-[0.2em] uppercase mb-6">
              {company.tagline}
            </p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-normal">
              {company.description}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/services"
                className="px-8 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg shadow-red-200"
                style={{ background: company.primaryColor }}>
                Explore Sectors
              </Link>
              <Link href="/contact"
                className="px-8 py-3.5 rounded-xl text-dark text-sm font-semibold border-2 border-dark hover:bg-dark hover:text-white transition-all">
                Contact Us
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl font-black text-primary">7</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Diverse Sectors</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">6</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Office Hubs</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">500+</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Projects Delivered</p>
              </div>
            </div>
          </div>

          {/* Right: 3D Rotating Earth */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <RotatingEarth />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-6 lg:left-16 hidden md:flex items-center gap-2 text-gray-400 pointer-events-none">
          <div className="w-0.5 h-6 bg-gray-200" />
          <span className="text-[11px] tracking-widest uppercase">Scroll to explore</span>
        </div>
      </section>

      {/* ── Services Preview ──────────────────────────────── */}
      <section className="px-12 py-20 bg-gray-50">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">What We Do</p>
            <h2 className="text-3xl font-black text-dark">Our Sectors</h2>
          </div>
          <Link href="/services"
            className="flex items-center gap-2 text-sm font-semibold text-dark hover:text-primary transition-colors">
            View All
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 3).map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      {/* ── Stats Banner ──────────────────────────────────── */}
      <section className="bg-dark text-white px-12 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '7+', label: 'Business Sectors' },
            { value: '4',  label: 'Countries' },
            { value: '15+', label: 'Years Experience' },
            { value: '500+', label: 'Projects Delivered' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-primary">{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="px-12 py-20 bg-white text-center">
        <h2 className="text-3xl font-black text-dark mb-4">Ready to work with us?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Let's build something extraordinary together.
        </p>
        <Link href="/contact"
          className="inline-block px-10 py-4 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
          style={{ background: company.primaryColor }}>
          Contact Us Today
        </Link>
      </section>

      <Footer />
    </>
  );
}

