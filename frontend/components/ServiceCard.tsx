import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types';

interface Props {
  service: Service;
  index: number;
}

// Unique dedicated background images for every business sector
const SECTOR_BACKGROUNDS: Record<string, string> = {
  construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  investments: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80',
  realities: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
  automobiles: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
  'earth-movers': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
  technologies: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
  apparels: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&q=80',
};

export default function ServiceCard({ service, index }: Props) {
  const numberStr = String(service.order || index + 1).padStart(2, '0');
  const slug =
    service.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || service.id;
  const imageSrc =
    service.imageUrl?.trim() || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';
  const bgImage =
    SECTOR_BACKGROUNDS[slug] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80';

  return (
    <Link
      href={`/services/${slug}`}
      className="service-card group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100/90 hover:border-red-200 transition-all duration-500 flex flex-col h-full fade-in cursor-pointer bg-white"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Service Header Showcase */}
      <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-900">
        <Image
          src={imageSrc}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.95]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Sector Tag */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-dark shadow-sm">
          Sector {numberStr}
        </span>
      </div>

      {/* Service Content Body with Unique Sector Background Image */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative overflow-hidden bg-white">
        {/* Prominent Unique Sector Background Photo Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover object-center opacity-20 group-hover:opacity-35 group-hover:scale-108 transition-all duration-700 filter saturate-125"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Subtle gradient overlay to keep text ultra-crisp while letting the background photo shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/92 group-hover:from-white/80 group-hover:via-white/70 group-hover:to-white/85 transition-colors duration-500" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-xl text-dark tracking-tight group-hover:text-primary transition-colors">
              {service.title.charAt(0).toUpperCase() + service.title.slice(1)}
            </h3>
            <span className="text-3xl font-extrabold text-gray-300 select-none tracking-wider font-mono group-hover:text-red-300 transition-colors">
              {numberStr}
            </span>
          </div>
          <p className="text-gray-700 text-sm mt-3 leading-relaxed line-clamp-2 font-normal">
            {service.description}
          </p>
        </div>

        {/* Action Link Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs font-bold text-primary relative z-10">
          <span className="group-hover:underline">Explore Dedicated Sector</span>
          <span className="w-7 h-7 rounded-full bg-red-100/80 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-sm">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
