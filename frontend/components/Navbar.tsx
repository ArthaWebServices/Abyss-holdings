'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'Services',   href: '/services' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Hide navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-4 sm:px-8 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <Logo size={36} />
          <div>
            <p className="font-black text-sm sm:text-base leading-tight tracking-wide text-dark">
              ABYSS<br className="hidden sm:inline" /> HOLDINGS
            </p>
            <p className="text-[7.5px] sm:text-[8px] text-gray-400 tracking-widest uppercase mt-0.5">
              Group of Companies
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links (hidden on mobile/tablet screens < 768px) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-all duration-200 relative pb-1
                  ${active
                    ? 'text-primary font-semibold'
                    : 'text-gray-600 hover:text-dark'}`}
              >
                {label}
                {active && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/services"
            className="text-gray-500 hover:text-dark transition-colors p-1.5"
            title="Search Services"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <Link
            href="/services"
            className="text-gray-500 hover:text-dark transition-colors p-1.5"
            title="View Sectors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger Button (visible on screens < 768px) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 flex flex-col items-center justify-center gap-1.5 transition-colors focus:outline-none"
          >
            <span
              className={`w-5 h-0.5 bg-dark rounded transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-dark rounded transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-dark rounded transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-2xl p-6 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
              Navigation
            </p>
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-base font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-red-50 text-primary border border-red-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{label}</span>
                  {active ? (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  ) : (
                    <span className="text-gray-300 text-sm">→</span>
                  )}
                </Link>
              );
            })}

            {/* Quick Contact Badge inside Mobile Drawer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <p className="text-xs text-gray-500 font-medium">
                📍 Mumbai Office (Corporate Headquarters)
              </p>
              <p className="text-xs text-gray-500 font-medium">
                📞 +91 22 1234 5678
              </p>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full text-center py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-md shadow-red-200 active:scale-[0.98] transition-all"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
