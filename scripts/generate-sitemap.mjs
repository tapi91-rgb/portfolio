import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const baseUrl = (process.env.SITE_BASE_URL || 'https://example.com').replace(/\/$/, '');

const outDir = resolve(process.cwd(), 'public');
mkdirSync(outDir, { recursive: true });

const routes = ['/', '/about', '/projects', '/blog', '/cv', '/hire'];

// Blog posts (published only)
const posts = JSON.parse(readFileSync(resolve('data/blog.json'), 'utf8'))
  .filter(p => p.published !== false)
  .map(p => `/blog/${p.slug}`);

// Blog pagination (6 per page)
const PER_PAGE = 6;
const pagesCount = Math.max(1, Math.ceil(JSON.parse(readFileSync(resolve('data/blog.json'), 'utf8').toString())
  .filter(p => p.published !== false).length / PER_PAGE));
const paged = Array.from({ length: pagesCount }, (_, i) => `/blog/page/${i + 1}`);

// Tags
const all = JSON.parse(readFileSync(resolve('data/blog.json'), 'utf8'));
const tags = Array.from(new Set(all.filter(p => p.published !== false).flatMap(p => p.tags || [])));
const tagRoutes = tags.map(t => `/blog/tag/${encodeURIComponent(t)}`);

const urls = [...routes, ...posts, ...paged, ...tagRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${baseUrl}${u}</loc></url>`).join('\n')}
</urlset>
`;

writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf8');
console.log('sitemap.xml generated with', urls.length, 'entries');