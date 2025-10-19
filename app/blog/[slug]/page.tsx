import posts from '@/data/blog.json';
import Markdown from '@/components/Markdown';
import JsonLd from '@/components/JsonLd';
import siteMeta from '@/data/site-meta.json';
import { buildArticleLd, buildBreadcrumbLd, type BlogPostLite } from '@/lib/structuredData';
import Link from 'next/link';

export function generateStaticParams() {
  return (posts as BlogPostLite[])
    .filter(p => p.published !== false)
    .map(p => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const all = posts as BlogPostLite[];
  const post = all.find(p => p.slug === params.slug);

  if (!post || post.published === false) {
    // Could render a NotFound here, but keep the UI minimal
    return (
      <section>
        <p className="text-neutral-400">Post not found.</p>
        <Link href="/blog" className="inline-block mt-4 rounded-lg border border-neutral-800 px-4 py-2 hover:border-primary">
          ← Back to blog
        </Link>
      </section>
    );
  }

  const articleLd = buildArticleLd({ site: siteMeta as any, post });
  const breadcrumbLd = buildBreadcrumbLd({
    site: siteMeta as any,
    trail: [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: post.title, href: `/blog/${post.slug}` }
    ]
  });

  return (
    <section className="max-w-3xl mx-auto">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />

      <h1 className="text-3xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-sm text-neutral-400">{new Date(post.date).toDateString()}</p>
      {post.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map(t => (
            <Link key={t} className="px-2 py-0.5 text-xs rounded-full bg-neutral-900 border border-neutral-800 hover:border-primary" href={`/blog/tag/${encodeURIComponent(t)}`}>{t}</Link>
          ))}
        </div>
      ) : null}
      <div className="mt-6">
        <Markdown content={post.bodyMarkdown || ''} />
      </div>
      <div className="mt-8">
        <Link href="/blog" className="rounded-lg border border-neutral-800 px-3 py-1 hover:border-primary">← Back to blog</Link>
      </div>
    </section>
  );
}