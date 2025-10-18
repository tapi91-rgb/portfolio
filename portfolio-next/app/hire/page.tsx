'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function HirePage() {
  const [status, setStatus] = useState<string>('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    setStatus('Sending…');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('Sent. I will reply shortly.');
      e.currentTarget.reset();
    } catch {
      setStatus('Failed to send. Please try later.');
    }
  }

  return (
    <div className="mx-auto w-[min(800px,92vw)] py-10">
      <h2 className="text-2xl font-bold mb-2">Hire Me</h2>
      <form className="panel p-4 grid gap-3" onSubmit={submit}>
        <div className="grid gap-1">
          <label htmlFor="name" className="text-muted">Name</label>
          <input id="name" name="name" className="rounded-xl border border-muted/40 bg-surface/70 p-2" required />
        </div>
        <div className="grid gap-1">
          <label htmlFor="email" className="text-muted">Email</label>
          <input id="email" name="email" type="email" className="rounded-xl border border-muted/40 bg-surface/70 p-2" required />
        </div>
        <div className="grid gap-1">
          <label htmlFor="company" className="text-muted">Company</label>
          <input id="company" name="company" className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="purpose" className="text-muted">Purpose</label>
          <select id="purpose" name="purpose" className="rounded-xl border border-muted/40 bg-surface/70 p-2">
            <option>Flutter App</option>
            <option>ML/NLP Baseline</option>
            <option>Full-Stack Project</option>
            <option>Consultation</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="message" className="text-muted">Message</label>
          <textarea id="message" name="message" rows={4} className="rounded-xl border border-muted/40 bg-surface/70 p-2" required />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" type="submit">Send</button>
          <span className="text-sm text-muted">{status}</span>
        </div>
      </form>
      <p className="text-muted mt-3">Email: faridmasood.khan@yahoo.com · Phone: +92 302 6673322</p>
    </div>
  );
}