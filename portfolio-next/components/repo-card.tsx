'use client';

import { useState } from 'react';
import { Modal } from '@/components/modal';

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

  async function loadReadme() {
    setOpen(true);
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
    }
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
        <h3 className="text-xl font-bold mb-2">README — {repo.name}</h3>
        <pre className="overflow-auto max-h-[50vh] whitespace-pre-wrap text-sm">{readme}</pre>
      </Modal>
    </>
  );
}