'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getMe } from '@/lib/api';

type AuthStatus = 'verifying' | 'authenticated' | 'unauthenticated';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthStatus>(() =>
    pathname === '/administration/login' ? 'authenticated' : 'verifying'
  );

  useEffect(() => {
    let active = true;

    if (pathname === '/administration/login') {
      setAuthState('authenticated');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      if (active) {
        setAuthState('unauthenticated');
        router.push('/administration/login');
      }
      return;
    }

    // Verify session
    getMe()
      .then(() => {
        if (active) {
          setAuthState('authenticated');
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem('admin_token');
          setAuthState('unauthenticated');
          router.push('/administration/login');
        }
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (pathname === '/administration/login') {
    return <>{children}</>;
  }

  if (authState !== 'authenticated') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        <p className="text-xs text-gray-400 font-mono tracking-wider">Verifying Session Security…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ marginRight: 0 }}>
      <AdminSidebar />
      <div className="ml-60 flex-1 min-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}


