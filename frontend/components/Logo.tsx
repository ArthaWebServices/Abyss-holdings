'use client';

// SVG network/node logo matching the geometric icon seen in the images
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring nodes */}
      <circle cx="30" cy="4"  r="3.5" fill="#E84545" />
      <circle cx="56" cy="20" r="3.5" fill="#E84545" />
      <circle cx="56" cy="40" r="3.5" fill="#E84545" />
      <circle cx="30" cy="56" r="3.5" fill="#E84545" />
      <circle cx="4"  cy="40" r="3.5" fill="#E84545" />
      <circle cx="4"  cy="20" r="3.5" fill="#E84545" />
      {/* Inner ring nodes */}
      <circle cx="30" cy="16" r="2.5" fill="#1a1a2e" />
      <circle cx="44" cy="23" r="2.5" fill="#1a1a2e" />
      <circle cx="44" cy="37" r="2.5" fill="#1a1a2e" />
      <circle cx="30" cy="44" r="2.5" fill="#1a1a2e" />
      <circle cx="16" cy="37" r="2.5" fill="#1a1a2e" />
      <circle cx="16" cy="23" r="2.5" fill="#1a1a2e" />
      {/* Center */}
      <circle cx="30" cy="30" r="4"   fill="#E84545" />
      {/* Connections outer→inner */}
      <line x1="30" y1="7"  x2="30" y2="14" stroke="#E84545" strokeWidth="1.2" opacity="0.6"/>
      <line x1="53" y1="21" x2="46" y2="24" stroke="#E84545" strokeWidth="1.2" opacity="0.6"/>
      <line x1="53" y1="39" x2="46" y2="36" stroke="#E84545" strokeWidth="1.2" opacity="0.6"/>
      <line x1="30" y1="53" x2="30" y2="46" stroke="#E84545" strokeWidth="1.2" opacity="0.6"/>
      <line x1="7"  y1="39" x2="14" y2="36" stroke="#E84545" strokeWidth="1.2" opacity="0.6"/>
      <line x1="7"  y1="21" x2="14" y2="24" stroke="#E84545" strokeWidth="1.2" opacity="0.6"/>
      {/* Inner hexagon */}
      <polygon points="30,16 44,23 44,37 30,44 16,37 16,23"
        fill="none" stroke="#1a1a2e" strokeWidth="1" opacity="0.3"/>
      {/* Inner→center */}
      <line x1="30" y1="18" x2="30" y2="26" stroke="#1a1a2e" strokeWidth="1" opacity="0.5"/>
      <line x1="42" y1="24" x2="34" y2="28" stroke="#1a1a2e" strokeWidth="1" opacity="0.5"/>
      <line x1="42" y1="36" x2="34" y2="32" stroke="#1a1a2e" strokeWidth="1" opacity="0.5"/>
      <line x1="30" y1="42" x2="30" y2="34" stroke="#1a1a2e" strokeWidth="1" opacity="0.5"/>
      <line x1="18" y1="36" x2="26" y2="32" stroke="#1a1a2e" strokeWidth="1" opacity="0.5"/>
      <line x1="18" y1="24" x2="26" y2="28" stroke="#1a1a2e" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

