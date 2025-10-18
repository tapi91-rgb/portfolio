import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin-secret' }
    ],
    sitemap: 'https://example.com/sitemap.xml'
  };
}