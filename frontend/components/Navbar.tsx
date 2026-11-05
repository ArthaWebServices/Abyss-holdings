'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const SECTORS_NAV = [
  { label: 'Investments & Capital', slug: 'investments', icon: '💼', badge: 'Private Equity' },
  { label: 'Construction & Engineering', slug: 'construction', icon: '🏗️', badge: 'Mega EPC' },
  { label: 'Realities & Urban Spaces', slug: 'realities', icon: '🏙️', badge: 'Prime Realty' },
  { label: 'Technologies & Digital Systems', slug: 'technologies', icon: '🤖', badge: 'Enterprise AI' },
  { label: 'Automobiles & Mobility', slug: 'automobiles', icon: '🚗', badge: 'Fleet & EV' },
  { label: 'Earth Movers & Heavy Machinery', slug: 'earth-movers', icon: '🚜', badge: 'Heavy Fleets' },
  { label: 'Apparels & Textile Manufacturing', slug: 'apparels', icon: '🧵', badge: 'Global Export' },
];

const MAIN_NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'Sectors',    href: '/services', hasDropdown: true },
  { label: 'Projects',   href: '/projects' },
  { label: 'Locations',  href: '/locations' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectorsDropdownOpen, setSectorsDropdownOpen] = useState(false);
  const [mobileSectorsOpen, setMobileSectorsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSectorsDropdownOpen(false);
  }, [pathname]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSectorsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
        {/* ── Corporate Utility Micro-Bar ───────────────────── */}
        <div className="bg-slate-950 text-gray-300 text-[11px] border-b border-slate-800/80 px-4 sm:px-8 py-2 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Dual Official Inboxes */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <a
                href="mailto:info@abyssholdings.com"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
                title="General & Corporate Inquiries"
              >
                <span className="text-primary group-hover:scale-110 transition-transform">✉</span>
                <span className="text-gray-400 hidden xs:inline">General:</span>
                <span className="text-gray-200 group-hover:underline">info@abyssholdings.com</span>
              </a>

              <span className="hidden sm:inline text-slate-700">|</span>

              <a
                href="mailto:investments@abyssholdings.com"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
                title="Investment & Partnership Desk"
              >
                <span className="text-primary group-hover:scale-110 transition-transform">💼</span>
                <span className="text-gray-400 hidden xs:inline">Investments:</span>
                <span className="text-gray-200 group-hover:underline">investments@abyssholdings.com</span>
              </a>
            </div>

            {/* Right: Corporate HQ & Hotline */}
            <div className="hidden md:flex items-center gap-5 text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="text-primary">📍</span>
                <span>HQ: Mumbai, India</span>
              </span>
              <span className="text-slate-700">|</span>
              <a href="tel:+912212345678" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <span>📞 +91 22 1234 5678</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Main Navigation Bar ────────────────────────────── */}
        <nav className="h-[68px] flex items-center justify-between px-4 sm:px-8 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <Logo size={36} />
              <div>
                <p className="font-black text-sm sm:text-base leading-tight tracking-wide text-dark">
                  ABYSS<span className="hidden sm:inline"> HOLDINGS</span>
                </p>
                <p className="text-[7.5px] sm:text-[8px] text-gray-400 tracking-widest uppercase mt-0.5">
                  Group of Companies
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              {MAIN_NAV_LINKS.map(({ label, href, hasDropdown }) => {
                const isServicesActive = pathname.startsWith('/services');
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

                if (hasDropdown) {
                  return (
                    <div
                      key={href}
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={() => setSectorsDropdownOpen(true)}
                      onMouseLeave={() => setSectorsDropdownOpen(false)}
                    >
                      <button
                        onClick={() => setSectorsDropdownOpen((v) => !v)}
                        className={`text-sm font-medium transition-all duration-200 flex items-center gap-1 pb-1
                          ${isServicesActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-dark'}`}
                      >
                        <span>{label}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            sectorsDropdownOpen ? 'rotate-180 text-primary' : 'text-gray-400'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {isServicesActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded" />
                        )}
                      </button>

                      {/* Mega Dropdown Menu for Sectors */}
                      {sectorsDropdownOpen && (
                        <div className="absolute top-full -left-12 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 pt-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              7 Business Sectors
                            </span>
                            <Link
                              href="/services"
                              onClick={() => setSectorsDropdownOpen(false)}
                              className="text-[11px] font-semibold text-primary hover:underline"
                            >
                              View All Portfolios →
                            </Link>
                          </div>
                          <div className="space-y-1">
                            {SECTORS_NAV.map((sec) => (
                              <Link
                                key={sec.slug}
                                href={`/services/${sec.slug}`}
                                onClick={() => setSectorsDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover/item:bg-red-50 text-base flex items-center justify-center transition-colors">
                                    {sec.icon}
                                  </span>
                                  <div>
                                    <p className="text-xs font-bold text-dark group-hover/item:text-primary transition-colors">
                                      {sec.label}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                      {sec.badge}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-gray-300 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all text-xs">
                                  →
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium transition-all duration-200 relative pb-1
                      ${active ? 'text-primary font-semibold' : 'text-gray-600 hover:text-dark'}`}
                  >
                    {label}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action & Contact Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-red-600 transition-all shadow-sm shadow-red-200"
              >
                Get In Touch
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
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
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer Overlay ───────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-dark/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed top-[104px] left-0 right-0 bg-white border-b border-gray-100 shadow-2xl p-6 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
            {/* Dual Email Quick Actions */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Official Correspondence
              </p>
              <div className="flex flex-col gap-1.5">
                <a
                  href="mailto:info@abyssholdings.com"
                  className="flex items-center justify-between text-dark hover:text-primary py-1 font-medium"
                >
                  <span>✉ info@abyssholdings.com</span>
                  <span className="text-[10px] text-gray-400">General</span>
                </a>
                <a
                  href="mailto:investments@abyssholdings.com"
                  className="flex items-center justify-between text-dark hover:text-primary py-1 font-medium"
                >
                  <span>💼 investments@abyssholdings.com</span>
                  <span className="text-[10px] text-gray-400">Investments</span>
                </a>
              </div>
            </div>

            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-2 mb-1">
              Main Menu
            </p>
            {MAIN_NAV_LINKS.map(({ label, href, hasDropdown }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

              if (hasDropdown) {
                return (
                  <div key={href} className="space-y-2">
                    <button
                      onClick={() => setMobileSectorsOpen((v) => !v)}
                      className="w-full flex items-center justify-between text-base font-semibold py-3 px-4 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2">
                        <span>{label}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-primary">
                          7 Portfolios
                        </span>
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileSectorsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {mobileSectorsOpen && (
                      <div className="pl-3 pr-1 py-1 space-y-1 bg-gray-50 rounded-2xl border border-gray-100">
                        {SECTORS_NAV.map((sec) => (
                          <Link
                            key={sec.slug}
                            href={`/services/${sec.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-medium text-gray-700 hover:bg-white hover:text-primary transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span>{sec.icon}</span>
                              <span>{sec.label}</span>
                            </span>
                            <span className="text-gray-300">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

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
                Contact Corporate Desk
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
