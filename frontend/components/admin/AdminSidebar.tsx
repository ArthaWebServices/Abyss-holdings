'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, MapPin, FolderKanban,
  Settings, MessageSquare, LogOut, ChevronRight
} from 'lucide-react';

const NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/services',  label: 'Services',   icon: Briefcase },
  { href: '/admin/locations', label: 'Locations',  icon: MapPin },
  { href: '/admin/projects',  label: 'Projects',   icon: FolderKanban },
  { href: '/admin/messages',  label: 'Messages',   icon: MessageSquare },
  { href: '/admin/settings',  label: 'Settings',   icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <aside className="w-60 h-screen bg-dark text-white fixed left-0 top-0 flex flex-col shadow-xl z-50">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-black text-base text-white">ABYSS HOLDINGS</p>
        <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${active ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <Icon size={16} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-red-500/20 transition-all w-full">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-primary transition-all mt-1">
          ← View Website
        </Link>
      </div>
    </aside>
  );
}

