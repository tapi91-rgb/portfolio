'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CvPage() {
  const path = '/cv/Farid_Masood_CV.pdf'; // place PDF at public/cv/Farid_Masood_CV.pdf
  const [mode, setMode] = useState<'viewer' | 'timeline'>('viewer');

  const timeline = [
    { date: '2024—Present', title: 'Data Science Intern', desc: 'Baselines, pipelines, reporting, and model iteration.' },
    { date: '2020—2024', title: 'Computer Science Graduate', desc: 'Focus on AI/ML/NLP, systems, and software engineering.' }
  ];

  return (
    <div className="mx-auto w-[min(1200px,92vw)] py-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">CV</h2>
        <div className="flex gap-2">
          <button className={`btn ${mode==='viewer'?'btn-primary':'btn-ghost'}`} onClick={() => setMode('viewer')}>PDF Viewer</button>
          <button className={`btn ${mode==='timeline'?'btn-primary':'btn-ghost'}`} onClick={() => setMode('timeline')}>Timeline</button>
        </div>
      </div>
      {mode === 'viewer' ? (
        <div className="panel p-3">
          <object data={path} type="application/pdf" className="w-full h-[70vh]">
            <p>PDF not found. Please place your CV at <code>public/cv/Farid_Masood_CV.pdf</code>.</p>
          </object>
          <div className="mt-3">
            <Link href={path} className="btn btn-primary">Download</Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {timeline.map((t, i) => (
            <article key={i} className="panel p-4">
              <div className="text-sm text-muted">{t.date}</div>
              <div className="font-bold text-lg">{t.title}</div>
              <p className="mt-1">{t.desc}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}