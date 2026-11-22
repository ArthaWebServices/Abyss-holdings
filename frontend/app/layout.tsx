import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import IntroSplash from '@/components/IntroSplash';
import { CompanyProvider } from '@/components/CompanyContext';
import { getServerCompany, getServerServices, hexToRgbChannels } from '@/lib/serverData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL('https://abyssholding.com'),
  title: {
    default: 'Abyss Holdings – Group of Companies',
    template: '%s | Abyss Holdings',
  },
  description: 'A diversified multi-sector conglomerate driving national and global innovation across capital investments, construction, realities, technologies, mobility, heavy machinery, and apparels.',
  applicationName: 'Abyss Holdings',
  authors: [{ name: 'Abyss Holdings Corporate' }],
  generator: 'Next.js',
  keywords: [
    'Abyss Holdings',
    'Abyss Group of Companies',
    'Capital Investments',
    'Mega Infrastructure Construction',
    'Realities and Urban Spaces',
    'Enterprise Technologies',
    'Automobiles and Mobility',
    'Earth Movers Heavy Machinery',
    'Apparels Manufacturing',
    'Corporate India Conglomerate',
  ],
  alternates: {
    canonical: 'https://abyssholding.com',
  },
  openGraph: {
    title: 'Abyss Holdings – Group of Companies',
    description: 'A diversified conglomerate driving national and global innovation across 7 core industry sectors.',
    url: 'https://abyssholding.com',
    siteName: 'Abyss Holdings',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Abyss Holdings Group of Companies',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abyss Holdings – Group of Companies',
    description: 'Driving national and global innovation across 7 core industry sectors.',
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/images/abyss-logo-64.png',
    apple: '/images/abyss-logo-180.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [company, services] = await Promise.all([getServerCompany(), getServerServices()]);

  const primaryColor = company.primaryColor || '#A6192E';
  const secondaryColor = company.secondaryColor || '#0f1422';
  const primaryRgb = hexToRgbChannels(primaryColor, '166 25 46');
  const darkRgb = hexToRgbChannels(secondaryColor, '15 20 34');

  const structuredSchema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: company.name || 'Abyss Holdings',
    alternateName: `${company.name || 'Abyss Holdings'} ${company.tagline || 'Group of Companies'}`,
    url: 'https://abyssholding.com',
    logo: company.logoUrl || 'https://abyssholding.com/images/og-cover.jpg',
    description: company.description,
    telephone: company.phone || '+91 22 1234 5678',
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address || '46/48 maruti cross lane, Borabazaar precint, Fort',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: company.phone || '+91 22 1234 5678',
        contactType: 'corporate desk',
        email: company.email || 'Admin@abyssholding.com',
        availableLanguage: ['English', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: company.phone || '+91 22 1234 5678',
        contactType: 'human resources',
        email: company.hrEmail || 'HR@abyssholding.com',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    sameAs: Object.values(company.socialLinks || {}).filter(Boolean),
  };

  return (
    <html
      lang="en"
      style={
        {
          '--primary': primaryColor,
          '--dark': secondaryColor,
          '--primary-rgb': primaryRgb,
          '--dark-rgb': darkRgb,
        } as React.CSSProperties
      }
    >
      <head>
        {/* Preconnect to Unsplash Image CDN for instant TLS handshake and rapid image delivery */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Synchronous Frame-0 Script: Prevents flashing the homepage before the intro splash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var sp = new URLSearchParams(window.location.search);
                  var force = sp.has('intro') || sp.has('splash');
                  var seen = sessionStorage.getItem('abyss_has_seen_splash');
                  if (force || !seen) {
                    document.documentElement.classList.add('splash-active');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
      </head>
      <body className="bg-gray-50 text-dark antialiased">
        {/* Frame-0 Zero-Flash Brand Preloader: Painted immediately by browser at 0ms before React hydration */}
        <div
          id="splash-backdrop-preloader"
          suppressHydrationWarning
          className="fixed inset-0 z-[99998] items-center justify-center select-none transition-opacity duration-500"
          style={{
            display: 'none',
            background: 'radial-gradient(ellipse 95% 85% at 50% 45%, #180509 0%, #0d0812 45%, #06070c 85%, #020305 100%)',
          }}
          aria-hidden="true"
        >
          {/* Ambient radial red glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(166, 25, 46, 0.55) 0%, rgba(130, 16, 32, 0.25) 55%, transparent 75%)',
            }}
          />
          {/* Constellation grid */}
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:36px_36px]" />

          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <img
                src="/images/abyss-logo-square.png"
                alt=""
                className="w-36 h-36 object-contain drop-shadow-[0_0_35px_rgba(166,25,46,0.75)]"
              />
            </div>
            <div className="mt-6">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-[0.32em] uppercase">
                Abyss <span className="text-[#E5506E]">Holdings</span>
              </p>
              <p className="text-[10px] sm:text-xs font-semibold text-rose-200/90 tracking-[0.42em] uppercase mt-2">
                Group of Companies
              </p>
            </div>
          </div>
        </div>

        <IntroSplash />
        <CompanyProvider company={company} services={services}>
          <Navbar />
          <main className="mt-[104px] min-h-[calc(100vh-104px)]">
            {children}
          </main>
        </CompanyProvider>
      </body>
    </html>
  );
}
