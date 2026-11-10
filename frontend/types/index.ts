// Shared TypeScript types

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

export interface Location {
  id: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  isHeadquarter: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  status: string;
  year: number;
  order: number;
}

export interface Company {
  name: string;
  tagline: string;
  description: string;
  email: string;
  hrEmail?: string;
  phone: string;
  address: string;
  website?: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

