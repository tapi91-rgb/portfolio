'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Github, Linkedin, Moon, Sun } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initDark = !prefersLight;
    setDark(initDark);
    document.documentElement.classList.toggle('dark', initDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/60 border-b border-muted/40">
      <nav className="mx-auto w-[min(1200px,92vw)] grid grid-cols-[auto_40px_1fr] items-center gap-3 py-3">
        <Link href="/" className="px-3 py-2 rounded-xl border border-muted/40 bg-surface/60 font-bold">MFMK</Link>
        <button aria-label="Toggle theme" className="p-2 rounded-xl border border-muted/40 bg-surface/60" onClick={toggleTheme}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="justify-self-end">
          <button
            aria-label="Open menu"
            className="p-2 rounded-xl border border-muted/40 bg-surface/60 md:hidden"
            onClick={() => setOpen(v => !v)}
          >
            <span className="sr-only">Open</span>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Z"/></svg>
          </button>
          <ul className="hidden md:flex gap-4">
            <li><Link className="hover:text-accent" href="/about">About</Link></li>
            <li><Link className="hover:text-accent" href="/projects">Projects</Link></li>
            <li><Link className="hover:text-accent" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-accent" href="/cv">CV</Link></li>
            <li><Link className="hover:text-accent" href="/hire">Hire Me</Link></li>
            {/* Admin route intentionally hidden */}
            <li className="flex gap-2">
              <Link href="https://github.com/Farid-Masood-Khan" target="_blank" className="p-2 rounded-xl border border-muted/40 bg-surface/60"><Github size={18} /></Link>
              <Link href="https://www.linkedin.com/in/leishu/" target="_blank" className="p-2 rounded-xl border border-muted/40 bg-surface/60"><Linkedin size={18} /></Link>
            </li>
          </ul>
        </div>
      </nav>
      {open && (
        <div className="md:hidden px-4 pb-3">
          <ul className="panel p-3 grid gap-2">
            <li><Link className="hover:text-accent" href="/about" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link className="hover:text-accent" href="/projects" onClick={() => setOpen(false)}>Projects</Link></li>
            <li><Link className="hover:text-accent" href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
            <li><Link className="hover:text-accent" href="/cv" onClick={() => setOpen(false)}>CV</Link></li>
            <li><Link className="hover:text-accent" href="/hire" onClick={() => setOpen(false)}>Hire Me</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}