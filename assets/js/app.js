(function () {
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
  setTheme(initialTheme);

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleBtn?.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    localStorage.setItem('theme', theme);
    const themeColor = theme === 'light' ? '#f7f9fc' : '#0d1117';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', themeColor);
  }

  toggleBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  // Update footer dates
  const now = new Date();
  const lastUpdatedEl = document.getElementById('last-updated');
  const copyrightYearEl = document.getElementById('copyright-year');
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    lastUpdatedEl.setAttribute('datetime', now.toISOString().split('T')[0]);
  }
  if (copyrightYearEl) copyrightYearEl.textContent = now.getFullYear();

  // Parallax for hero blobs
  const blob1 = document.querySelector('.hero-blob');
  const blob2 = document.querySelector('.hero-blob.blob-2');
  let ticking = false;

  function onScroll() {
    if (!motionOK) return;
    const y = window.scrollY || 0;
    const t1 = Math.min(40, y * 0.05);
    const t2 = Math.min(28, y * 0.04);
    if (blob1) blob1.style.transform = `translate3d(0, ${t1}px, 0)`;
    if (blob2) blob2.style.transform = `translate3d(0, ${t2}px, 0)`;
  }

  window.addEventListener('scroll', () => {
    if (!motionOK) return;
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Magnetic buttons
  const magnets = Array.from(document.querySelectorAll('.magnetic'));
  magnets.forEach(btn => {
    let rafId = null;
    const strength = 0.25;

    function move(e) {
      if (!motionOK) return;
      const rect = btn.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      const tx = mx * strength;
      const ty = my * strength;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        btn.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }
    function reset() {
      if (rafId) cancelAnimationFrame(rafId);
      btn.style.transform = 'translate(0,0)';
    }

    btn.addEventListener('mousemove', move);
    btn.addEventListener('mouseleave', reset);
    btn.addEventListener('blur', reset);
  });

  // Cursor micro-trail (lightweight particles)
  const canvas = document.getElementById('cursor-canvas');
  const ctx = canvas?.getContext('2d', { alpha: true });
  let particles = [];
  let running = false;

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addParticle(x, y) {
    const p = {
      x, y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      life: 1,
      size: Math.random() * 3 + 1
    };
    particles.push(p);
    if (particles.length > 60) particles.shift();
  }

  function step() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let i = 0; i &lt; particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life &lt;= 0) {
        particles.splice(i, 1);
        i--;
        continue;
      }
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      grad.addColorStop(0, `rgba(108,192,255,${0.25 * p.life})`);
      grad.addColorStop(1, `rgba(158,123,255,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    if (running) requestAnimationFrame(step);
  }

  if (canvas && motionOK) {
    const rectCanvas = () => {
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      resizeCanvas();
    };
    rectCanvas();
    window.addEventListener('resize', rectCanvas);

    window.addEventListener('mousemove', (e) => {
      addParticle(e.clientX, e.clientY);
      if (!running) {
        running = true;
        requestAnimationFrame(step);
      }
    }, { passive: true });
  }

  // Fetch GitHub repos
  const grid = document.getElementById('repo-grid');
  const status = document.getElementById('repo-status');
  const fallback = document.getElementById('repo-fallback');

  async function fetchRepos() {
    const endpoint = 'https://api.github.com/users/Farid-Masood-Khan/repos';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github+json'
        },
        cache: 'no-store'
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const repos = (Array.isArray(data) ? data : []).filter(r => !r.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 6);
      if (!repos.length) throw new Error('No repos');

      renderRepos(repos);
      status.textContent = 'Loaded latest repositories.';
    } catch (err) {
      renderFallback();
      status.textContent = 'Showing fallback due to network limits.';
    } finally {
      grid?.setAttribute('aria-busy', 'false');
      grid?.setAttribute('data-loading', 'false');
    }
  }

  function renderRepos(repos) {
    if (!grid) return;
    grid.innerHTML = '';
    for (const r of repos) {
      const card = document.createElement('article');
      card.className = 'card';
      const desc = r.description || 'No description provided.';
      const stars = r.stargazers_count ?? 0;
      const lang = r.language || '—';

      card.innerHTML = `
        <div class="title">${escapeHTML(r.name)}</div>
        <div class="desc">${escapeHTML(desc)}</div>
        <div class="meta">
          <span title="Primary language">${escapeHTML(lang)}</span>
          <span aria-label="Stars">${starSVG()} ${stars}</span>
          <span title="Updated">${new Date(r.pushed_at).toLocaleDateString()}</span>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${r.html_url}" target="_blank" rel="noopener">View Repo</a>
        </div>
      `;
      grid.appendChild(card);
    }
  }

  function renderFallback() {
    fallback?.removeAttribute('hidden');
    if (!grid) return;
    grid.innerHTML = '';
    const fallbackRepos = [
      {
        name: 'IoT-IDS-baselines',
        description: 'Baseline models for intrusion detection on IoT/SDN datasets.',
        language: 'Python',
        html_url: 'https://github.com/Farid-Masood-Khan'
      },
      {
        name: 'THUCNews-LinearSVM',
        description: 'Classic text classification with TF-IDF and Linear SVM.',
        language: 'Python',
        html_url: 'https://github.com/Farid-Masood-Khan'
      },
      {
        name: 'tiny-YOLO-UAV',
        description: 'Experiments with small YOLO models on limited UAV imagery.',
        language: 'Python',
        html_url: 'https://github.com/Farid-Masood-Khan'
      }
    ];
    renderRepos(fallbackRepos.map(r => ({ ...r, stargazers_count: 0, pushed_at: new Date().toISOString() })));
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '&lt;': '&lt;', '&gt;': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function starSVG() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.998 3.5 9.41 9.14l-6.16.49 4.665 3.87-1.42 5.97 5.503-3.36 5.503 3.36-1.42-5.97 4.665-3.87-6.16-.49L11.998 3.5z"/></svg>';
  }

  fetchRepos();
})();