import Image from 'next/image';
import { getProjects } from '@/lib/api';
import Footer from '@/components/Footer';

export default async function ProjectsPage() {
  let projects = [];
  try { projects = await getProjects(); } catch {}

  return (
    <>
      <section className="min-h-screen px-12 py-20 bg-white">
        <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">Our Work</p>
        <h1 className="text-4xl font-black text-dark mb-10">Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p: any) => (
            <div key={p.id} className="group rounded-2xl overflow-hidden bg-gray-50 shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-52 overflow-hidden">
                <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="600px"/>
                <span className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full text-dark">
                  {p.status}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs text-primary font-semibold mb-1">{p.category} · {p.year}</p>
                <h3 className="font-bold text-dark text-lg mb-1">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🏗️</p>
            <p>Projects coming soon.</p>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

