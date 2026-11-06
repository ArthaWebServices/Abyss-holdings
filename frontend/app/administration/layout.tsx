'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getMe } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/administration/login') { setChecked(true); return; }
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/administration/login'); return; }
    getMe()
      .then(() => setChecked(true))
      .catch(() => { localStorage.removeItem('admin_token'); router.push('/administration/login'); });
  }, [pathname]);

  if (pathname === '/administration/login') return <>{children}</>;
  if (!checked) return (
    <div className="h-screen flex items-center justify-center bg-dark text-white">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ marginRight: 0 }}>
      <AdminSidebar />
      <div className="ml-60 flex-1 min-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}


