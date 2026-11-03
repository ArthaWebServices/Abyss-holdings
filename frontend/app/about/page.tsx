import { getCompany } from '@/lib/api';
import Footer from '@/components/Footer';

export default async function AboutPage() {
  let company;
  try { company = await getCompany(); }
  catch { company = { name: 'Abyss Holdings', tagline: 'Group of Companies', description: '', primaryColor: '#E84545' }; }

  return (
    <>
      <section className="min-h-screen px-12 py-20 bg-white">
        <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">Who We Are</p>
        <h1 className="text-4xl font-black text-dark mb-6">About Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Our Story</h2>
            <p className="text-gray-500 leading-relaxed text-sm mb-4">
              Abyss Holdings is a dynamic, multi-sector conglomerate headquartered in Abu Dhabi, UAE.
              Over the past 15+ years, we have built a reputation for excellence across construction,
              technology, investments, realities, earth movers, automobiles, and apparels.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm mb-4">
              Our group operates across the Middle East, UK, and beyond — delivering projects and
              solutions that create lasting value for our clients and communities.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                { value: '15+', label: 'Years of Excellence' },
                { value: '4', label: 'Countries' },
                { value: '7', label: 'Business Sectors' },
                { value: '500+', label: 'Projects Done' },
              ].map(({ value, label }) => (
                <div key={label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-black text-primary">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Our Values</h2>
            <div className="flex flex-col gap-4">
              {[
                { title: 'Excellence', desc: 'We set the highest standards in every sector we operate.' },
                { title: 'Innovation', desc: 'Constantly evolving to stay ahead in a changing world.' },
                { title: 'Integrity', desc: 'Transparent, honest, and ethical in all we do.' },
                { title: 'Sustainability', desc: 'Building for the future with responsibility and care.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-dark text-sm">{title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

