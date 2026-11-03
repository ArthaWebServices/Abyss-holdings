import Image from 'next/image';
import { Service } from '@/types';

interface Props {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: Props) {
  const numberStr = String(service.order || index + 1).padStart(2, '0');

  return (
    <div
      className="service-card group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full fade-in"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Service Image */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-gray-100">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Service Content */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white relative">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-xl text-dark tracking-tight">
              {service.title}
            </h3>
            <span className="text-3xl font-extrabold text-gray-200 select-none tracking-wider font-mono">
              {numberStr}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}
