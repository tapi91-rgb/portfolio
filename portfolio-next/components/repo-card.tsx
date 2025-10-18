'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
};

export function RepoCard({ repo }: { repo: Repo }) {
  const [open, setOpen] = useState(false);
  const [readme, setReadme] = useState<string>('Loading README…');
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadReadme() {
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/Farid-Masood-Khan/${repo.name}/readme`, {
        headers: { 'Accept': 'application/vnd.github+json' },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Rate limited or not found');
      const data = await res.json();
      const text = atob(data.content || '');
      setReadme(text || 'No README content.');
    } catch {
      setReadme('Unable to load README (rate limit). Try opening the repo.');
    } finally {
      setLoading(false);
    }
    // Try to load topics (best-effort, ignore errors)
    try {
      const res2 = await fetch(`https://api.github.com/repos/Farid-Masood-Khan/${repo.name}/topics`, {
        headers: { 'Accept': 'application/vnd.github+json' },
        cache: 'no-store'
      });
      if (res2.ok) {
        const t = await res2.json();
        setTopics(Array.isArray(t.names) ? t.names : []);
      }
    } catch {}
  }

  return (
    <>
      <article className="panel p-4 grid gap-2">
        <div className="font-bold text-lg">{repo.name}</div>
        <div className="text-muted">{repo.description || '—'}</div>
        <div className="text-sm text-muted flex gap-3">
          <span>{repo.language || '—'}</span>
          <span>⭐ {repo.stargazers_count}</span>
          <span>{new Date(repo.pushed_at).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <a className="btn btn-ghost" href={repo.html_url} target="_blank" rel="noopener">View Repo</a>
          <button className="btn btn-primary" onClick={loadReadme}>README</button>
        </div>
      </article>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">README — {repo.name}</h3>
          <div className="hidden md:flex gap-2">
            {topics.map(t => <span key={t} className="px-2 py-1 rounded-full border border-muted/40 bg-surface/60 text-sm">{t}</span>)}
          </div>
        </div>
        {loading ? (
          <div className="grid gap-2">
            <div className="h-6 w-1/2 bg-surface/50 rounded" />
            <div className="h-4 w-3/4 bg-surface/50 rounded" />
            <div className="h-4 w-2/3 bg-surface/50 rounded" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh] markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
          </div>
        )}
      </Modal>
    </>
  );
}