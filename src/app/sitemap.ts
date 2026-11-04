import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/core/config/SiteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/beauty-rating',
    '/content-rating',
    '/hand-reading',
  ];

  return routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
