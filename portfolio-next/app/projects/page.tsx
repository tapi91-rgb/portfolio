'use client';

import { useEffect, useState } from 'react';
import { RepoCard } from '@/components/repo-card';

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
  fork?: boolean;
};

export default function ProjectsPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState('Loading repositories…');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('https://api.github.com/users/Farid-Masood-Khan/repos', {
          headers: { 'Accept': 'application/vnd.github+json' },
          signal: controller.signal,
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('rate limited');
        const data: Repo[] = await res.json();
        const filtered = data.filter(r => !r.fork).sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
        setRepos(filtered.slice(0, 12));
        setStatus(`Showing ${Math.min(12, filtered.length)} repositories · Latest updates first`);
      } catch {
        setRepos([
          { name: 'IoT-IDS-baselines', description: 'Baselines for intrusion detection on IoT/SDN.', language: 'Python', stargazers_count: 0, html_url: 'https://github.com/Farid-Masood-Khan', pushed_at: new Date().toISOString() },
          { name: 'THUCNews-LinearSVM', description: 'TF‑IDF + Linear SVM baseline.', language: 'Python', stargazers_count: 0, html_url: 'https://github.com/Farid-Masood-Khan', pushed_at: new Date().toISOString() }
        ]);
        setStatus('Showing fallback list due to rate limits.');
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="mx-auto w-[min(1200px,92vw)] py-10">
      <h2 className="text-2xl font-bold mb-2">Projects</h2>
      <p className="text-muted mb-4">{status}</p>
      <div className="grid md:grid-cols-3 gap-3">
        {repos.map(r => <RepoCard key={r.name} repo={r} />)}
      </div>
    </div>
  );
}