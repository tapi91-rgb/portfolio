'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export function Tabs({ tabs }: { tabs: { key: string; title: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key || '');
  return (
    <div>
      <div className="flex gap-2 mb-3">
        {tabs.map(t => (
          <button
            key={t.key}
            className={cn('inline-flex items-center gap-2 rounded-full border border-muted/40 px-4 py-2 font-semibold transition-transform',
              active === t.key ? 'text-black bg-[color-mix(in_oklab,_white,_var(--tw-color-accent)_20%)] shadow-soft' : 'text-text bg-surface/60')}
            onClick={() => setActive(t.key)}
          >
            {t.title}
          </button>
        ))}
      </div>
      <div className="panel p-3">
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}