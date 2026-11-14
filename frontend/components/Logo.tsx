'use client';

import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
  animated?: boolean;
}

export default function Logo({
  size = 40,
  className = '',
  priority = false,
  animated = false,
}: LogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group/logo ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient soft glow on hover or when animated */}
      <div
        className={`absolute inset-0 rounded-full bg-[#A6192E]/20 blur-md transition-all duration-500 scale-75
          ${animated ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover/logo:opacity-100 group-hover/logo:scale-110'}`}
      />

      {/* Authentic Geodesic Network Sphere / Globe Logo */}
      <Image
        src="/images/abyss-logo-square.png"
        alt="Abyss Holdings Logo"
        width={size}
        height={size}
        priority={priority}
        className={`relative z-10 w-full h-full object-contain transition-transform duration-500 ease-out
          ${animated ? 'animate-[spin_24s_linear_infinite]' : 'group-hover/logo:scale-105 group-hover/logo:rotate-6'}`}
      />
    </div>
  );
}
