(function () {
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (OS preference fallback)
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const osLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (osLight ? 'light' : 'dark');
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

  // Nav active highlighting
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  function setActive(hash) {
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === hash;
      link.classList.toggle('active', match);
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  setActive('#hero');
  const sections = navLinks
    .map(l => {
      const sel = l.getAttribute('href');
      const el = sel?.startsWith('#') ? document.querySelector(sel) : null;
      return el ? { link: l, el } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          setActive(id);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -40% 0px' });
    sections.forEach(s => io.observe(s.el));
  }

  // Parallax for hero blobs
  const blob1 = document.querySelector('.hero-blob');
  const blob2 = document.querySelector('.hero-blob.blob-2');
  const blob3 = document.querySelector('.hero-blob.blob-3');
  let ticking = false;

  function onScroll() {
    if (!motionOK) return;
    const y = window.scrollY || 0;
    const t1 = Math.min(40, y * 0.05);
    const t2 = Math.min(28, y * 0.04);
    const t3 = Math.min(20, y * 0.03);
    if (blob1) blob1.style.transform = `translate3d(0, ${t1}px, 0)`;
    if (blob2) blob2.style.transform = `translate3d(0, ${t2}px, 0)`;
    if (blob3) blob3.style.transform = `translate3d(-50%, ${t3}px, 0)`;
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
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) {
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

  // Back to top
  const backTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (!backTop) return;
    const show = (window.scrollY || 0) > 240;
    backTop.classList.toggle('show', show);
  }, { passive: true });

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: motionOK ? 'smooth' : 'auto' });
  });

  // Contact form
  const form = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const copyWechatBtn = document.getElementById('copy-wechat');
  const wechatEl = document.getElementById('wechat-id');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = (document.getElementById('subject')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const email = 'faridmasoodofficial@gmail.com';

    const bodyLines = [
      'Hello Farid,',
      '',
      message,
      '',
      '— Sent from your portfolio contact form'
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject || 'Portfolio inquiry')}&body=${body}`;
    contactStatus.textContent = 'Opening mail client...';
    window.location.href = mailto;
  });

  copyWechatBtn?.addEventListener('click', async () => {
    const text = wechatEl?.textContent || 'faridmasood1';
    try {
      await navigator.clipboard.writeText(text);
      contactStatus.textContent = 'WeChat ID copied.';
    } catch {
      contactStatus.textContent = 'Copy failed. ID: ' + text;
    }
  });

  // Fetch GitHub repos with caching, filters, sort
  const grid = document.getElementById('repo-grid');
  const status = document.getElementById('repo-status');
  const fallback = document.getElementById('repo-fallback');
  const filtersEl = document.getElementById('repo-filters');
  const sortEl = document.getElementById('repo-sort');

  let allRepos = [];
  let currentLang = 'All';
  let currentSort = 'updated';
  const cacheKey = 'repos_cache_v1';
  const cacheTTL = 1000 * 60 * 5; // 5 minutes

  function loadRepos() {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (cached && (Date.now() - cached.time) < cacheTTL && Array.isArray(cached.data)) {
        allRepos = cached.data.filter(r => !r.fork);
        buildControls();
        applyRepoView();
        status.textContent = 'Loaded repositories from cache.';
        grid?.setAttribute('aria-busy', 'false');
        grid?.setAttribute('data-loading', 'false');
        return;
      }
    } catch {}
    fetchRepos();
  }

  async function fetchRepos() {
    const endpoint = 'https://api.github.com/users/Farid-Masood-Khan/repos';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: { 'Accept': 'application/vnd.github+json' },
        cache: 'no-store'
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      allRepos = (Array.isArray(data) ? data : []).filter(r => !r.fork);
      localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data }));
      buildControls();
      applyRepoView();
      status.textContent = 'Loaded latest repositories.';
    } catch (err) {
      renderFallback();
      status.textContent = 'Showing fallback due to network limits.';
    } finally {
      grid?.setAttribute('aria-busy', 'false');
      grid?.setAttribute('data-loading', 'false');
    }
  }

  function buildControls() {
    // Render language filters
    if (filtersEl) {
      filtersEl.innerHTML = '';
      const langs = Array.from(new Set(allRepos.map(r => r.language).filter(Boolean)));
      const allChip = document.createElement('button');
      allChip.type = 'button';
      allChip.className = 'chip';
      allChip.textContent = 'All';
      allChip.setAttribute('aria-selected', String(currentLang === 'All'));
      allChip.addEventListener('click', () => {
        currentLang = 'All';
        updateFilterSelection('All');
        applyRepoView();
      });
      filtersEl.appendChild(allChip);

      langs.sort((a, b) => a.localeCompare(b)).forEach(l => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = l;
        chip.setAttribute('aria-selected', String(currentLang === l));
        chip.addEventListener('click', () => {
          currentLang = l;
          updateFilterSelection(l);
          applyRepoView();
        });
        filtersEl.appendChild(chip);
      });
    }
    // Sort controls
    sortEl?.querySelectorAll('button[data-sort]').forEach(btn => {
      const val = btn.getAttribute('data-sort');
      btn.setAttribute('aria-pressed', String(val === currentSort));
      btn.addEventListener('click', () => {
        currentSort = val || 'updated';
        sortEl.querySelectorAll('button[data-sort]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        applyRepoView();
      });
    });
  }

  function updateFilterSelection(value) {
    filtersEl?.querySelectorAll('.chip').forEach(c => {
      c.setAttribute('aria-selected', String(c.textContent === value));
    });
  }

  function applyRepoView() {
    let list = allRepos.slice();
    if (currentLang !== 'All') {
      list = list.filter(r => (r.language || '—') === currentLang);
    }
    list = sortRepos(list);
    renderRepos(list.slice(0, 6));
    const count = Math.min(6, list.length);
    status.textContent = `Showing ${count} repositories · Sort: ${currentSort} · Filter: ${currentLang}`;
  }

  function sortRepos(list) {
    return list.sort((a, b) => {
      if (currentSort === 'stars') {
        return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
      }
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    });
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
    allRepos = fallbackRepos.map(r => ({ ...r, stargazers_count: 0, pushed_at: new Date().toISOString(), fork: false }));
    buildControls();
    applyRepoView();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function starSVG() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.998 3.5 9.41 9.14l-6.16.49 4.665 3.87-1.42 5.97 5.503-3.36 5.503 3.36-1.42-5.97 4.665-3.87-6.16-.49L11.998 3.5z"/></svg>';
  }

  loadRepos();
})();