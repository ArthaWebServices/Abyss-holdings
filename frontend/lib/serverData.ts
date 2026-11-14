import { readDatabase } from '@/lib/serverDb';
import { DEFAULT_SERVICES } from '@/lib/constants';
import { Company, Location, Project, Service } from '@/types';

export const DEFAULT_COMPANY: Company = {
  name: 'Abyss Holdings',
  tagline: 'Group of Companies',
  description:
    'A diversified group of companies driving innovation across 7 core industry sectors — from investments and construction to realities, technology, automobiles, earth movers, and apparels.',
  email: 'Admin@abyssholding.com',
  hrEmail: 'HR@abyssholding.com',
  phone: '+91 22 1234 5678',
  address: '46/48 maruti cross lane, Borabazaar precint, Fort, Mumbai, Maharashtra 400001, India',
  website: 'abyssholding.com',
  primaryColor: '#A6192E',
  secondaryColor: '#0f1422',
  logoUrl: '/images/abyss-logo-square.png',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

function getExternalApiBase(): string | null {
  const configured = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return null;
  const trimmed = configured.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

async function fetchExternalJson<T>(endpoint: string): Promise<T | null> {
  const base = getExternalApiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function slugifyServiceTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function getServerCompany(): Promise<Company> {
  const external = await fetchExternalJson<Company>('/company');
  if (external && typeof external === 'object') {
    return {
      ...DEFAULT_COMPANY,
      ...external,
      socialLinks: {
        ...DEFAULT_COMPANY.socialLinks,
        ...(external.socialLinks || {}),
      },
    };
  }
  try {
    const db = readDatabase();
    return {
      ...DEFAULT_COMPANY,
      ...(db.company || {}),
      socialLinks: {
        ...DEFAULT_COMPANY.socialLinks,
        ...(db.company?.socialLinks || {}),
      },
    };
  } catch {
    return DEFAULT_COMPANY;
  }
}

export async function getServerServices(): Promise<Service[]> {
  const external = await fetchExternalJson<Service[]>('/services');
  if (Array.isArray(external)) {
    return [...external].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  try {
    const db = readDatabase();
    if (Array.isArray(db.services)) {
      return db.services
        .filter((s: Service) => s.active !== false)
        .sort((a: Service, b: Service) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch {}
  return DEFAULT_SERVICES;
}

export async function getServerAllServices(): Promise<Service[]> {
  try {
    const db = readDatabase();
    if (Array.isArray(db.services)) {
      return [...db.services].sort((a: Service, b: Service) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch {}
  return DEFAULT_SERVICES;
}

export async function getServerLocations(): Promise<Location[]> {
  const external = await fetchExternalJson<Location[]>('/locations');
  if (Array.isArray(external)) {
    return [...external].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  try {
    const db = readDatabase();
    if (Array.isArray(db.locations)) {
      return [...db.locations].sort((a: Location, b: Location) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch {}
  return [];
}

export async function getServerProjects(): Promise<Project[]> {
  const external = await fetchExternalJson<Project[]>('/projects');
  if (Array.isArray(external)) {
    return [...external].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  try {
    const db = readDatabase();
    if (Array.isArray(db.projects)) {
      return [...db.projects].sort((a: Project, b: Project) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch {}
  return [];
}

export function hexToRgbChannels(hex?: string, fallback = '232 69 69'): string {
  if (!hex || typeof hex !== 'string') return fallback;
  const cleaned = hex.trim().replace(/^#/, '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return fallback;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
