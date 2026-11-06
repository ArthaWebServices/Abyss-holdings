import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

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

const structuredSchema = {
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  name: 'Abyss Holdings',
  alternateName: 'Abyss Holdings Group of Companies',
  url: 'https://abyssholding.com',
  logo: 'https://abyssholding.com/images/og-cover.jpg',
  description: 'A diversified multi-sector conglomerate driving innovation across investments, civil infrastructure, realities, enterprise technologies, automobiles, earth-movers, and textile manufacturing.',
  telephone: '+91 22 1234 5678',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bandra Kurla Complex (BKC)',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400051',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91 22 1234 5678',
      contactType: 'corporate desk',
      email: 'Admin@abyssholding.com',
      availableLanguage: ['English', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '+91 22 1234 5678',
      contactType: 'human resources',
      email: 'HR@abyssholding.com',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
  sameAs: [
    'https://linkedin.com',
    'https://twitter.com',
    'https://facebook.com',
    'https://youtube.com',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
      </head>
      <body className="bg-gray-50 text-dark antialiased">
        <Navbar />
        <main className="mt-[104px] min-h-[calc(100vh-104px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
