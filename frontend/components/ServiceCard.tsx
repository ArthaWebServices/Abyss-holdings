import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types';

interface Props {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: Props) {
  const numberStr = String(service.order || index + 1).padStart(2, '0');
  const slug = service.title.toLowerCase().trim().replace(/\s+/g, '-');

  return (
    <Link
      href={`/services/${slug}`}
      className="service-card group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-red-200 transition-all duration-300 flex flex-col h-full fade-in cursor-pointer"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Service Image */}
      <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-gray-100">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Subtle sector tag */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-dark">
          Sector {numberStr}
        </span>
      </div>

      {/* Service Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white relative">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-xl text-dark tracking-tight group-hover:text-primary transition-colors">
              {service.title.charAt(0).toUpperCase() + service.title.slice(1)}
            </h3>
            <span className="text-3xl font-extrabold text-gray-200 select-none tracking-wider font-mono group-hover:text-red-100 transition-colors">
              {numberStr}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* Action Link Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary">
          <span className="group-hover:underline">Explore Dedicated Sector</span>
          <span className="w-7 h-7 rounded-full bg-red-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
