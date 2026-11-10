'use client';

import { createContext, useContext } from 'react';
import { Company, Service } from '@/types';
import { DEFAULT_SERVICES } from '@/lib/constants';

interface CompanyContextValue {
  company: Company;
  services: Service[];
}

const DEFAULT_COMPANY_VALUE: Company = {
  name: 'Abyss Holdings',
  tagline: 'Group of Companies',
  description:
    'A diversified group of companies driving innovation across 7 core industry sectors — from investments and construction to realities, technology, automobiles, earth movers, and apparels.',
  email: 'Admin@abyssholding.com',
  hrEmail: 'HR@abyssholding.com',
  phone: '+91 22 1234 5678',
  address: 'Mumbai Office (Headquarters), Maharashtra, India',
  website: 'abyssholding.com',
  primaryColor: '#E84545',
  secondaryColor: '#1a1a2e',
  logoUrl: '',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

const CompanyContext = createContext<CompanyContextValue>({
  company: DEFAULT_COMPANY_VALUE,
  services: DEFAULT_SERVICES,
});

export function CompanyProvider({
  company,
  services,
  children,
}: {
  company: Company;
  services: Service[];
  children: React.ReactNode;
}) {
  return (
    <CompanyContext.Provider value={{ company, services }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}
