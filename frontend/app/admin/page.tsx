'use client';
import { useEffect, useState } from 'react';
import { getAllServices, getLocations, getProjects, getMessages } from '@/lib/api';
import { Briefcase, MapPin, FolderKanban, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ services: 0, locations: 0, projects: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllServices(), getLocations(), getProjects(), getMessages()])
      .then(([services, locations, projects, messages]) => {
        setStats({
          services:  services.length,
          locations: locations.length,
          projects:  projects.length,
          messages:  messages.length,
          unread:    messages.filter((m: any) => !m.read).length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Services',  value: stats.services,  icon: Briefcase,     href: '/admin/services',  color: 'bg-blue-500' },
    { label: 'Locations', value: stats.locations, icon: MapPin,        href: '/admin/locations', color: 'bg-green-500' },
    { label: 'Projects',  value: stats.projects,  icon: FolderKanban,  href: '/admin/projects',  color: 'bg-purple-500' },
    { label: 'Messages',  value: stats.messages,  icon: MessageSquare, href: '/admin/messages',  color: 'bg-primary',  badge: stats.unread },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-dark">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Admin. Here's your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color, badge }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group border border-gray-100">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-dark">{loading ? '—' : value}</p>
              {badge !== undefined && badge > 0 && (
                <span className="mb-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {badge} new
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs mt-0.5 group-hover:text-primary transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-dark text-base mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '+ Add Service',  href: '/admin/services' },
            { label: '+ Add Location', href: '/admin/locations' },
            { label: '+ Add Project',  href: '/admin/projects' },
            { label: '⚙ Settings',    href: '/admin/settings' },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              className="text-center py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

