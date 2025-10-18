'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { adminUpsertBlog, adminDeleteBlog, adminUpsertProject, adminSiteMeta } from '@/lib/api';

export default function AdminSecretPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'content'|'chatbot'|'meta'>('content');

  useEffect(() => {
    // Simple gate: presence of cookie sent by backend or token set in memory on login
    // We cannot read httpOnly cookie here; rely on user having logged in and set token in memory via login page.
    // If not, show 404.
    const ok = typeof window !== 'undefined' && (window as any).__MEM_TOKEN_SET__ ? true : false;
    // Mark set when login() is called (see lib/api setToken)
    setAuthed(ok);
  }, []);

  if (!authed) {
    notFound();
  }

  return (
    <div className="mx-auto w-[min(1000px,92vw)] py-10">
      <h2 className="text-2xl font-bold mb-3">Admin Dashboard</h2>
      <div className="panel p-3">
        <div className="flex gap-2 mb-3">
          <button className={`btn ${tab==='content'?'btn-primary':'btn-ghost'}`} onClick={() => setTab('content')}>Content</button>
          <button className={`btn ${tab==='chatbot'?'btn-primary':'btn-ghost'}`} onClick={() => setTab('chatbot')}>Chatbot</button>
          <button className={`btn ${tab==='meta'?'btn-primary':'btn-ghost'}`} onClick={() => setTab('meta')}>Site Meta</button>
        </div>

        {tab === 'content' && <ContentTab />}
        {tab === 'chatbot' && <ChatbotTab />}
        {tab === 'meta' && <MetaTab />}
      </div>
    </div>
  );
}

function ContentTab() {
  async function saveBlog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const post = Object.fromEntries(fd.entries());
    await adminUpsertBlog(post as any);
    alert('Saved blog');
  }
  async function delBlog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = String(new FormData(e.currentTarget).get('id') || '');
    await adminDeleteBlog(id);
    alert('Deleted blog');
  }
  async function saveProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p = Object.fromEntries(fd.entries());
    await adminUpsertProject(p as any);
    alert('Saved project');
  }

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <form onSubmit={saveBlog} className="panel p-3 grid gap-2">
        <strong>Blog — Upsert</strong>
        <input name="id" placeholder="id" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <input name="title" placeholder="title" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <input name="slug" placeholder="slug" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <input name="tags" placeholder="tag1,tag2" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <textarea name="body" placeholder="body" rows={4} className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
      <form onSubmit={delBlog} className="panel p-3 grid gap-2">
        <strong>Blog — Delete</strong>
        <input name="id" placeholder="id" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <button className="btn btn-primary" type="submit">Delete</button>
      </form>
      <form onSubmit={saveProject} className="panel p-3 grid gap-2 md:col-span-2">
        <strong>Project — Upsert</strong>
        <input name="title" placeholder="title" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <input name="slug" placeholder="slug" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <input name="tags" placeholder="tag1,tag2" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <input name="url" placeholder="URL" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <textarea name="desc" placeholder="description" rows={3} className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

function ChatbotTab() {
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    await adminSiteMeta({ chatbotProfile: body });
    alert('Saved chatbot profile');
  }
  return (
    <form onSubmit={save} className="panel p-3 grid gap-2">
      <strong>Chatbot Profile Context</strong>
      <textarea name="summary" placeholder="CV summary, skills, links…" rows={6} className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
      <button className="btn btn-primary" type="submit">Save</button>
    </form>
  );
}

function MetaTab() {
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    await adminSiteMeta(body as any);
    alert('Saved site meta');
  }
  return (
    <form onSubmit={save} className="panel p-3 grid gap-2">
      <strong>Site Meta</strong>
      <input name="title" placeholder="Title" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
      <input name="description" placeholder="Description" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
      <textarea name="openGraph" placeholder='{"title":"","description":""}' rows={4} className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
      <textarea name="schema" placeholder='{"@context":"https://schema.org","@type":"Person"}' rows={4} className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
      <button className="btn btn-primary" type="submit">Save</button>
    </form>
  );
}