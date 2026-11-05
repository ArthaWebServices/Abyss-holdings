import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Abyss Holdings – Group of Companies',
  description: 'A diversified conglomerate driving national and global innovation across 7 core industry sectors.',
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
