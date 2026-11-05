'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/lib/api';
import { Project } from '@/types';
import Footer from '@/components/Footer';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Metropolis Corporate Twin Towers',
    description: 'A 1.4M sq.ft Grade-A commercial complex with LEED Gold green building certification and seismic dampening.',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    category: 'Construction',
    status: 'Completed',
    year: 2024,
    order: 1,
  },
  {
    id: '2',
    title: 'GreenHorizon Renewable Energy Fund',
    description: 'A $65M direct private equity deployment into solar-wind hybrid utility plants powering industrial corridors.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
    category: 'Investments',
    status: 'Ongoing',
    year: 2024,
    order: 2,
  },
  {
    id: '3',
    title: 'The Azure Crest Residences',
    description: '42-story luxury residential high-rise featuring 240 bespoke sky-villas, infinity pool, and concierge wellness hub.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    category: 'Realities',
    status: 'Completed',
    year: 2024,
    order: 3,
  },
  {
    id: '4',
    title: 'FinEdge Core Banking Cloud Migration',
    description: 'Multi-region cloud infrastructure transformation processing 4,000 transactions per second with 99.999% uptime.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    category: 'Technologies',
    status: 'Completed',
    year: 2024,
    order: 4,
  },
  {
    id: '5',
    title: 'GreenTransit Electric Fleet Logistics',
    description: 'Deployment of 350 commercial zero-emission electric delivery vans supported by 24 fast-charging transit depots.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    category: 'Automobiles',
    status: 'Ongoing',
    year: 2024,
    order: 5,
  },
  {
    id: '6',
    title: 'Trans-Regional Expressway Earthworks',
    description: 'Excavated and graded 4.2 million cubic meters of earth across an 82km greenfield corridor ahead of schedule.',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80',
    category: 'Earth Movers',
    status: 'Completed',
    year: 2024,
    order: 6,
  },
  {
    id: '7',
    title: 'EcoActive Sustainable Performance Apparel',
    description: 'Manufacturing 3.6M units of recycled ocean-polymer sportswear for international athletic retail brands.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    category: 'Apparels',
    status: 'Ongoing',
    year: 2024,
    order: 7,
  },
];

const CATEGORIES = ['All', 'Construction', 'Investments', 'Realities', 'Technologies', 'Automobiles', 'Earth Movers', 'Apparels'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (data && data.length > 0) setProjects(data);
      })
      .catch(() => setProjects(FALLBACK_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

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
              {CATEGORIES.map((cat) => (
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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((p) => {
                  const sectorSlug = p.category.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div
                      key={p.id}
                      className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                          <Image
                            src={p.imageUrl}
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
                          href={`/services/${sectorSlug}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>Explore {p.category} Division</span>
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
                Connect with our business development team at info@abyssholdings.com or investments@abyssholdings.com.
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
