import Link from 'next/link';
import { getBlogList } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const posts = await getBlogList();
  return (
    <div className="mx-auto w-[min(1200px,92vw)] py-10">
      <h2 className="text-2xl font-bold mb-2">Blog</h2>
      <ul className="grid gap-3">
        {posts.map(p => (
          <li key={p.slug} className="panel p-4">
            <Link className="font-bold text-lg hover:text-accent" href={`/blog/${p.slug}`}>{p.title}</Link>
            <div className="flex gap-2 mt-1">
              {p.tags?.map(t => <span key={t} className="px-2 py-1 rounded-full border border-muted/40 bg-surface/60 text-sm">{t}</span>)}
            </div>
            <p className="text-muted mt-2 line-clamp-3">{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}