import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Abyss Holdings – Group of Companies',
  description: 'A diversified group of companies driving innovation across multiple sectors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <main className="mt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

