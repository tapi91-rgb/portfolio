import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://example.com';
  const routes = ['', '/about', '/projects', '/blog', '/cv', '/hire'].map((p) => ({
    url: base + p,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7
  }));
  return routes;
}