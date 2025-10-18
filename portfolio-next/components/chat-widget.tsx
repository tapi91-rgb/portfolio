'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageSquareText, X } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [dockLeft, setDockLeft] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{role:'user'|'ai', text:string}[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function send(q: string) {
    setBusy(true);
    setMessages(m => [...m, { role: 'user', text: q }, { role: 'ai', text: '' }]);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });

      if (!res.ok || !res.body) {
        fallback(q);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let aiText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        aiText += chunk;
        setMessages((msgs) => {
          const copy = [...msgs];
          const idx = copy.findIndex(m => m.role === 'ai' && m.text === '');
          if (idx !== -1) copy[idx] = { role: 'ai', text: aiText };
          else copy.push({ role: 'ai', text: aiText });
          return copy;
        });
      }
    } catch {
      fallback(q);
    } finally {
      setBusy(false);
    }
  }

  function fallback(q: string) {
    const reply = demoReply(q);
    setMessages(m => {
      const copy = [...m];
      const idx = copy.findIndex(mm => mm.role === 'ai' && mm.text === '');
      if (idx !== -1) copy[idx] = { role: 'ai', text: reply };
      else copy.push({ role: 'ai', text: reply });
      return copy;
    });
  }

  function demoReply(q: string) {
    if (/hire|work/i.test(q)) return 'Glad to hear! Please share scope, timeline, and constraints. I’ll propose a plan.';
    if (/ml|data|pipeline/i.test(q)) return 'Start with a reproducible baseline (sklearn), clear splits, metrics. Share schema & target.';
    if (/flutter|app/i.test(q)) return 'Define screens, navigation, data, and Firebase needs. We’ll scaffold a clean architecture.';
    return 'I can help plan experiments, build apps, and set up pipelines. What are your goals?';
  }

  return (
    <div className={`fixed ${dockLeft ? 'left-4' : 'right-4'} bottom-20 z-40`}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-full border border-muted/40 bg-surface/70 shadow-soft"
          aria-label="Open chat"
        >
          <MessageSquareText size={20} />
        </button>
      )}
      {open && (
        <div className="panel w-[min(92vw,380px)] p-3">
          <div className="flex items-center justify-between">
            <strong>AI Assistant</strong>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-xl border border-muted/40 bg-surface/60"
                onClick={() => setDockLeft(v => !v)}
                aria-label="Dock side"
                title="Dock left/right"
              >
                {dockLeft ? '↘' : '↙'}
              </button>
              <button className="p-2 rounded-xl border border-muted/40 bg-surface/60" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="grid gap-2 max-h-[240px] overflow-y-auto mt-2">
            {messages.map((m, i) => (
              <p key={i} className={`p-2 rounded-xl border border-muted/40 ${m.role === 'user' ? 'bg-surface/60' : 'bg-surface/80'}`}>{m.text}</p>
            ))}
          </div>
          <form
            className="mt-2 grid grid-cols-[1fr_auto] gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const text = inputRef.current?.value?.trim() || '';
              if (!text) return;
              inputRef.current!.value = '';
              send(text);
            }}
          >
            <textarea
              ref={inputRef}
              rows={2}
              placeholder="Ask anything..."
              className="rounded-xl border border-muted/40 bg-surface/70 p-2"
            />
            <button className="btn btn-primary" disabled={busy} type="submit">Send</button>
          </form>
          <p className="text-sm text-muted mt-1">Streams from {API_BASE}/api/chat</p>
        </div>
      )}
    </div>
  );
}