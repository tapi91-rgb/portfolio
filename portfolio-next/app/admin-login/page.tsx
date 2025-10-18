'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/api';

export default function AdminLoginPage() {
  const [status, setStatus] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '');
    const password = String(fd.get('password') || '');
    setStatus('Signing in…');
    try {
      const res = await login(email, password);
      if (res?.token) {
        setStatus('OK');
        router.push('/admin-secret');
      } else {
        setStatus('Invalid credentials.');
      }
    } catch {
      setStatus('Login failed.');
    }
  }

  return (
    <div className="mx-auto w-[min(420px,92vw)] py-10">
      <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
      <form className="panel p-4 grid gap-3" onSubmit={submit}>
        <div className="grid gap-1">
          <label className="text-muted" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        </div>
        <div className="grid gap-1">
          <label className="text-muted" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="rounded-xl border border-muted/40 bg-surface/70 p-2" />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" type="submit">Login</button>
          <span className="text-sm text-muted">{status}</span>
        </div>
      </form>
    </div>
  );
}