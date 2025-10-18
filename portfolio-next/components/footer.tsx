export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-muted/40 py-6">
      <div className="mx-auto w-[min(1200px,92vw)] flex items-center justify-between">
        <small>© {year} Muhammad Farid Masood Khan</small>
        <small className="text-muted">Sahiwal, Pakistan</small>
      </div>
    </footer>
  );
}