import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
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
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [company, services] = await Promise.all([getServerCompany(), getServerServices()]);

  const primaryColor = company.primaryColor || '#E84545';
  const secondaryColor = company.secondaryColor || '#1a1a2e';
  const primaryRgb = hexToRgbChannels(primaryColor, '232 69 69');
  const darkRgb = hexToRgbChannels(secondaryColor, '26 26 46');

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
      streetAddress: company.address || 'Bandra Kurla Complex (BKC)',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400051',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
      </head>
      <body className="bg-gray-50 text-dark antialiased">
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
