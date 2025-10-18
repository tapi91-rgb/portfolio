export default function AboutPage() {
  const skills = ['Machine Learning', 'Deep Learning', 'NLP', 'Data Mining', 'Flutter', 'React.js', 'Node.js', 'SQL', 'AI App Development'];
  const timeline = [
    { title: 'Computer Science Graduate', place: 'University', date: '—', desc: 'Completed CS degree with a focus on AI/ML.' },
    { title: 'Data Science Intern', place: '—', date: '—', desc: 'Built baselines, reports, and pipelines.' }
  ];
  return (
    <div className="mx-auto w-[min(1200px,92vw)] py-10">
      <section className="panel p-5">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {skills.map(s => <li key={s} className="px-3 py-1 rounded-full border border-muted/40 bg-surface/60">{s}</li>)}
        </ul>
      </section>
      <section className="panel p-5 mt-6">
        <h2 className="text-2xl font-bold mb-4">Timeline</h2>
        <ul className="grid gap-3">
          {timeline.map((t, i) => (
            <li key={i} className="rounded-2xl border border-muted/40 bg-surface/60 p-3">
              <div className="font-semibold">{t.title}</div>
              <div className="text-muted">{t.place} — {t.date}</div>
              <p className="mt-1">{t.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}