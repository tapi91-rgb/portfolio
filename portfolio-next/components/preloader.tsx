'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 300);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-bg">
      <div className="panel p-4">
        <div className="h-1.5 w-40 rounded-full bg-surface overflow-hidden">
          <div className="h-full w-1/3 bg-[linear-gradient(90deg,var(--tw-color-accent),var(--tw-color-accent2))] animate-[shimmer_1.6s_linear_infinite]" />
        </div>
      </div>
    </div>
  );
}