import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Abyss Holdings – Group of Companies',
  description: 'A diversified conglomerate driving national and global innovation across 7 core industry sectors.',
  metadataBase: new URL('https://abyssholdings.vercel.app'),
  openGraph: {
    title: 'Abyss Holdings – Group of Companies',
    description: 'A diversified conglomerate driving national and global innovation across 7 core industry sectors.',
    url: 'https://abyssholdings.vercel.app',
    siteName: 'Abyss Holdings',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Abyss Holdings – Group of Companies',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abyss Holdings – Group of Companies',
    description: 'A diversified conglomerate driving national and global innovation across 7 core industry sectors.',
    images: ['/images/og-cover.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-dark antialiased">
        <Navbar />
        <main className="mt-[104px] min-h-[calc(100vh-104px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
