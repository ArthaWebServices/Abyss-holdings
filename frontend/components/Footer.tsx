import Link from 'next/link';
import Logo from './Logo';

const SECTOR_LINKS = [
  { name: 'Investments & Capital', href: '/services/investments' },
  { name: 'Construction & Engineering', href: '/services/construction' },
  { name: 'Realities & Urban Spaces', href: '/services/realities' },
  { name: 'Technologies & Digital Systems', href: '/services/technologies' },
  { name: 'Automobiles & Mobility', href: '/services/automobiles' },
  { name: 'Earth Movers & Heavy Machinery', href: '/services/earth-movers' },
  { name: 'Apparels & Textiles', href: '/services/apparels' },
];

const QUICK_LINKS = [
  { name: 'Corporate Home', href: '/' },
  { name: 'About Abyss Group', href: '/about' },
  { name: 'All 7 Sectors', href: '/services' },
  { name: 'Key Projects', href: '/projects' },
  { name: 'Indian Hubs & Offices', href: '/locations' },
  { name: 'Contact Corporate Desk', href: '/contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 px-6 sm:px-12 lg:px-16 w-full border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand Info & Mission (Col 1 - 4) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <Logo size={40} />
              <div>
                <p className="font-black text-base tracking-wide text-white">ABYSS HOLDINGS</p>
                <p className="text-[8.5px] text-gray-400 tracking-widest uppercase mt-0.5">
                  Group of Companies
                </p>
              </div>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              A diversified multi-sector conglomerate creating sustainable long-term value across
              capital investments, infrastructure engineering, technology, mobility, heavy machinery, and global manufacturing.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Connect:</span>
              <div className="flex gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-all hover:scale-110"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Business Sectors Links (Col 2 - 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-sm mb-4 text-white tracking-wide uppercase text-xs">
              Business Sectors
            </h4>
            <div className="flex flex-col gap-2">
              {SECTOR_LINKS.map(({ name, href }) => (
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
                  href="mailto:Admin@abyssholding.com"
                  className="text-white hover:text-primary font-medium transition-colors block text-sm"
                >
                  Admin@abyssholding.com
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Human Resources & Careers
                </p>
                <a
                  href="mailto:HR@abyssholding.com"
                  className="text-white hover:text-primary font-medium transition-colors block text-sm"
                >
                  HR@abyssholding.com
                </a>
              </div>

              <div className="text-gray-400 space-y-1 pt-1">
                <p className="text-white font-medium">Mumbai Corporate Headquarters</p>
                <p>Maharashtra, India</p>
                <p className="text-gray-300">Tel: +91 22 1234 5678</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {year} Abyss Holdings Group of Companies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-primary transition-colors">Corporate Governance</Link>
            <Link href="/services" className="hover:text-primary transition-colors">Sector Portfolios</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Inquiries</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
