import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/administration/', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://abyssholding.com/sitemap.xml',
    host: 'https://abyssholding.com',
  };
}

