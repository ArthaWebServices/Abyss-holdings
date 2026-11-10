'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useCompany } from './CompanyContext';

// S-8: Validate logoUrl to prevent javascript: URI injection
function isSafeUrl(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  );
}

const SECTORS_LABEL_MAP: Record<string, { defaultTitle: string; label: string }> = {
  investments: { defaultTitle: 'investments', label: 'Investments & Capital' },
  construction: { defaultTitle: 'construction', label: 'Construction & Engineering' },
  realities: { defaultTitle: 'realities', label: 'Realities & Urban Spaces' },
  technologies: { defaultTitle: 'technologies', label: 'Technologies & Digital Systems' },
  automobiles: { defaultTitle: 'automobiles', label: 'Automobiles & Mobility' },
  'earth-movers': { defaultTitle: 'earth movers', label: 'Earth Movers & Heavy Machinery' },
  apparels: { defaultTitle: 'apparels', label: 'Apparels & Textiles' },
};

const QUICK_LINKS = [
  { name: 'Corporate Home', href: '/' },
  { name: 'About Abyss Group', href: '/about' },
  { name: 'All Sectors', href: '/services' },
  { name: 'Key Projects', href: '/projects' },
  { name: 'Indian Hubs & Offices', href: '/locations' },
  { name: 'Contact Corporate Desk', href: '/contact' },
];

function toSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { company, services } = useCompany();

  const companyName = company.name || 'Abyss Holdings';
  const tagline = company.tagline || 'Group of Companies';
  const description = company.description ||
    'A diversified multi-sector conglomerate creating sustainable long-term value across capital investments, infrastructure engineering, technology, mobility, heavy machinery, and global manufacturing.';
  const adminEmail = company.email || 'Admin@abyssholding.com';
  const hrEmail = company.hrEmail || 'HR@abyssholding.com';
  const phone = company.phone || '+91 22 1234 5678';
  const address = company.address || 'Mumbai Corporate Headquarters, Maharashtra, India';
  const social = company.socialLinks || {};

  const sectorLinks = services.map((s) => {
    const slug = toSlug(s.title) || s.id;
    const meta = SECTORS_LABEL_MAP[slug];
    const isDefaultTitle = meta && s.title.toLowerCase().trim() === meta.defaultTitle;
    return {
      name: isDefaultTitle ? meta.label : s.title,
      href: `/services/${slug}`,
    };
  });

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 px-6 sm:px-12 lg:px-16 w-full border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand Info & Mission (Col 1 - 4) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              {isSafeUrl(company.logoUrl) ? (
                <img src={company.logoUrl} alt={companyName} className="w-10 h-10 object-contain rounded-lg" />
              ) : (
                <Logo size={40} />
              )}
              <div>
                <p className="font-black text-base tracking-wide text-white uppercase">{companyName}</p>
                <p className="text-[8.5px] text-gray-400 tracking-widest uppercase mt-0.5">
                  {tagline}
                </p>
              </div>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              {description}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Connect:</span>
              <div className="flex gap-2">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {social.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Business Sectors Links (Col 2 - 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-sm mb-4 text-white tracking-wide uppercase text-xs">
              Business Sectors
            </h4>
            <div className="flex flex-col gap-2">
              {sectorLinks.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-gray-600 group-hover:text-primary transition-colors text-[10px]">›</span>
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links (Col 3 - 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm mb-4 text-white tracking-wide uppercase text-xs">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {QUICK_LINKS.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-gray-600 group-hover:text-primary transition-colors text-[10px]">›</span>
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Official Inboxes & Contact (Col 4 - 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-sm mb-4 text-white tracking-wide uppercase text-xs">
              Official Inboxes
            </h4>
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Administration & Corporate
                </p>
                <a
                  href={`mailto:${adminEmail}`}
                  className="text-white hover:text-primary font-medium transition-colors block text-sm break-all"
                >
                  {adminEmail}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Human Resources & Careers
                </p>
                <a
                  href={`mailto:${hrEmail}`}
                  className="text-white hover:text-primary font-medium transition-colors block text-sm break-all"
                >
                  {hrEmail}
                </a>
              </div>

              <div className="text-gray-400 space-y-1 pt-1">
                <p className="text-white font-medium">{address}</p>
                <p className="text-gray-300">Tel: {phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {year} {companyName} {tagline}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-primary transition-colors">Corporate Governance</Link>
            <Link href="/services" className="hover:text-primary transition-colors">Sector Portfolios</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Inquiries</Link>
            <Link href="/locations" className="hover:text-primary transition-colors">Locations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
