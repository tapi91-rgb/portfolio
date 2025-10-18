'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <section className="relative overflow-clip">
      <div className="absolute inset-0 aurora-bg" />
      <div className="relative z-10 mx-auto w-[min(1200px,92vw)] pt-20 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Muhammad Farid Masood Khan
        </motion.h1>
        <p className="mt-2 text-lg text-muted text-shimmer">Computer Science graduate & Data Science intern — AI/ML/NLP/Flutter/full‑stack</p>
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <Link href="/projects" className="btn-rainbow"><span>View Projects</span></Link>
          <Link href="/cv" className="btn btn-ghost">View CV</Link>
          <Link href="/hire" className="btn btn-primary">Hire Me</Link>
          <Link href="https://github.com/Farid-Masood-Khan" target="_blank" className="btn btn-ghost">GitHub</Link>
          <Link href="https://www.linkedin.com/in/leishu/" target="_blank" className="btn btn-ghost">LinkedIn</Link>
        </div>
      </div>
    </section>
  );
}