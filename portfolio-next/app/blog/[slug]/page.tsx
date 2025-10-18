import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/api';

type Params = { params: { slug: string } };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  const title = post?.title || params.slug;
  const description = post?.body?.slice(0, 160) || 'Article';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/og.svg']
    }
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const post = await getBlogBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-[min(900px,92vw)] py-10">
      <h1 className="text-3xl font-extrabold">{post.title}</h1>
      <div className="flex gap-2 mt-2">
        {post.tags?.map(t => <span key={t} className="px-2 py-1 rounded-full border border-muted/40 bg-surface/60 text-sm">{t}</span>)}
      </div>
      <div className="prose prose-invert mt-4">
        <p>{post.body}</p>
      </div>

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            author: { '@type': 'Person', name: 'Muhammad Farid Masood Khan' },
            datePublished: post.createdAt || new Date().toISOString(),
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
                { '@type': 'ListItem', position: 3, name: post.title, item: `/blog/${post.slug}` }
              ]
            }
          })
        }}
      />
    </article>
  );
}