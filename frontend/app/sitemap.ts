import { MetadataRoute } from 'next';
import { ALL_SECTORS_LIST } from '@/lib/sectorsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abyssholding.com';
  const lastModified = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 7 Sector vertical dynamic pages
  const sectorRoutes: MetadataRoute.Sitemap = ALL_SECTORS_LIST.map((sector) => ({
    url: `${baseUrl}/services/${sector.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...sectorRoutes];
}

