'use client';
import { useEffect, useState, useCallback } from 'react';
import { getAllServices, getLocations, getProjects, getMessages } from '@/lib/api';
import { Briefcase, MapPin, FolderKanban, MessageSquare, TrendingUp, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

type DashboardStats = {
  services: number;
  locations: number;
  projects: number;
  messages: number;
  unread: number;
};

type DashboardState =
  | { status: 'loading' }
  | { status: 'success'; stats: DashboardStats }
  | { status: 'error'; message: string };

export default function AdminDashboard() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const [services, locations, projects, messages] = await Promise.all([
        getAllServices(),
        getLocations(),
        getProjects(),
        getMessages(),
      ]);
      setState({
        status: 'success',
        stats: {
          services: Array.isArray(services) ? services.length : 0,
          locations: Array.isArray(locations) ? locations.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          unread: Array.isArray(messages) ? messages.filter((m: any) => !m.read).length : 0,
        },
      });
    } catch (err: any) {
      setState({
        status: 'error',
        message: err?.response?.data?.error || err?.message || 'Failed to connect to corporate API server',
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = [
    {
      label: 'Services',
      value: state.status === 'success' ? state.stats.services : 0,
      icon: Briefcase,
      href: '/administration/services',
      color: 'bg-blue-500',
    },
    {
      label: 'Locations',
      value: state.status === 'success' ? state.stats.locations : 0,
      icon: MapPin,
      href: '/administration/locations',
      color: 'bg-green-500',
    },
    {
      label: 'Projects',
      value: state.status === 'success' ? state.stats.projects : 0,
      icon: FolderKanban,
      href: '/administration/projects',
      color: 'bg-purple-500',
    },
    {
      label: 'Messages',
      value: state.status === 'success' ? state.stats.messages : 0,
      icon: MessageSquare,
      href: '/administration/messages',
      color: 'bg-primary',
      badge: state.status === 'success' ? state.stats.unread : 0,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-dark">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Admin. Here's your corporate overview.</p>
      </div>

      {state.status === 'error' && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 max-w-xl">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 mb-1">Failed to load dashboard metrics</p>
              <p className="text-xs text-red-600 mb-4">{state.message}</p>
              <button
                onClick={load}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
              >
                <RefreshCw size={12} /> Retry Dashboard Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color, badge }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group border border-gray-100"
          >
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-dark">
                {state.status === 'loading' ? (
                  <span className="inline-block w-8 h-7 bg-gray-100 rounded-lg animate-pulse" />
                ) : state.status === 'error' ? (
                  '—'
                ) : (
                  value
                )}
              </p>
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
            { label: '+ Add Service', href: '/administration/services' },
            { label: '+ Add Location', href: '/administration/locations' },
            { label: '+ Add Project', href: '/administration/projects' },
            { label: '⚙ Settings', href: '/administration/settings' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-center py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


