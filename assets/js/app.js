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

  // Ensure CV link works (fallback to mailto if file missing) — only on http(s)
  const cvLink = document.getElementById('cv-link');
  if (cvLink && /^https?:$/.test(location.protocol)) {
    const href = cvLink.getAttribute('href') || '';
    try {
      fetch(href, { method: 'HEAD', cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error('CV not found');
        })
        .catch(() => {
          const mail = 'mailto:faridmasoodofficial@gmail.com?subject=' + encodeURIComponent('Request CV');
          cvLink.setAttribute('href', mail);
          cvLink.removeAttribute('download');
          cvLink.textContent = 'Request CV';
        });
    } catch {
      const mail = 'mailto:faridmasoodofficial@gmail.com?subject=' + encodeURIComponent('Request CV');
      cvLink.setAttribute('href', mail);
      cvLink.removeAttribute('download');
      cvLink.textContent = 'Request CV';
    }
  }

  // Footer year only
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

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

    // Reveal animations
    if (motionOK) {
      const revealEls = Array.from(document.querySelectorAll('.reveal'));
      const ro = new IntersectionObserver((ents) => {
        ents.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      revealEls.forEach(el => ro.observe(el));
    }
  }

  // Mobile navigation (hamburger)
  const menuBtn = document.getElementById('menu-toggle');
  const navListEl = document.getElementById('primary-nav');
  const navBackdrop = document.getElementById('nav-backdrop');

  function setMenu(open) {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const active = open && isMobile;
    document.body.classList.toggle('menu-open', active);
    menuBtn?.setAttribute('aria-expanded', String(active));
    navListEl?.setAttribute('aria-hidden', String(!active));
  }

  menuBtn?.addEventListener('click', () => {
    const next = !document.body.classList.contains('menu-open');
    setMenu(next);
  });

  navBackdrop?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  navListEl?.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a.nav-link') : null;
    if (a) setMenu(false);
  });

  // Ensure menu state is correct when switching between mobile/desktop
  const mql = window.matchMedia('(max-width: 760px)');
  function handleViewportChange(e) {
    if (!e.matches) {
      // Leaving mobile -> desktop: force close overlay
      setMenu(false);
    }
  }
  if (mql.addEventListener) mql.addEventListener('change', handleViewportChange);
  else if (mql.addListener) mql.addListener(handleViewportChange);
  // Initialize state
  handleViewportChange(mql);

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

  // WeChat QR toggle
  const showQRBtn = document.getElementById('show-wechat-qr');
  const qrPanel = document.getElementById('wechat-qr-panel');
  const qrImg = document.getElementById('wechat-qr-img');
  const closeQRBtn = document.getElementById('close-wechat-qr');

  function ensureQrFallback() {
    if (!qrPanel) return;
    const inner = qrPanel.querySelector('.qr-inner');
    if (!inner) return;
    if (!inner.querySelector('.qr-msg')) {
      const p = document.createElement('p');
      p.className = 'qr-msg';
      const idText = wechatEl?.textContent || 'faridmasood1';
      p.textContent = 'QR not available. Add assets/img/wechat_qr.png or use WeChat ID: ' + idText;
      p.style.color = 'var(--muted)';
      p.style.textAlign = 'center';
      inner.appendChild(p);
    }
  }

  qrImg?.addEventListener('error', ensureQrFallback);

  showQRBtn?.addEventListener('click', () => {
    qrPanel?.removeAttribute('hidden');
    qrPanel?.setAttribute('aria-hidden', 'false');
    if (!qrImg || !qrImg.complete) {
      // If image missing or not loaded, set fallback message
      ensureQrFallback();
    }
  });
  closeQRBtn?.addEventListener('click', () => {
    qrPanel?.setAttribute('hidden', '');
    qrPanel?.setAttribute('aria-hidden', 'true');
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

  async function applyRepoView() {
    let list = allRepos.slice();
    if (currentLang !== 'All') {
      list = list.filter(r => (r.language || '—') === currentLang);
    }
    list = sortRepos(list);
    if (!list.length) {
      await renderPinnedReposFromJson();
      status.textContent = 'Showing featured repositories.';
      return;
    }
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

  async function renderPinnedReposFromJson() {
    if (!grid) return;
    try {
      const res = await fetch('assets/data/pinned.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const combined = [...(data.highlights || []), ...(data.apps || [])];
        const repos = combined.slice(0, 6).map(it => ({
          name: it.title || 'Project',
          description: it.desc || '',
          language: it.icon === 'flutter' ? 'Dart' : 'Python',
          html_url: it.url || 'https://github.com/Farid-Masood-Khan',
          stargazers_count: 0,
          pushed_at: new Date().toISOString(),
          fork: false
        }));
        renderRepos(repos);
        return;
      }
    } catch {}
    // fallback to static basic list
    renderFallback();
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
    // directly render without applying filters to ensure we show content even if filters empty
    renderRepos(allRepos.slice(0, 6));
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function starSVG() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.998 3.5 9.41 9.14l-6.16.49 4.665 3.87-1.42 5.97 5.503-3.36 5.503 3.36-1.42-5.97 4.665-3.87-6.16-.49L11.998 3.5z"/></svg>';
  }

  // Pinned Highlights & Apps
  const highlightsGrid = document.getElementById('highlights-grid');
  const appsGrid = document.getElementById('apps-grid');

  async function loadPinned() {
    try {
      const res = await fetch('assets/data/pinned.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('pinned.json missing');
      const data = await res.json();
      renderPinned(data.highlights || [], highlightsGrid);
      renderPinned(data.apps || [], appsGrid);
    } catch {
      const defaults = {
        highlights: [
          { title: 'Portfolio (this site)', desc: 'Accessible, fast, responsive.', url: 'https://github.com/Farid-Masood-Khan', icon: 'github' },
          { title: 'IoT-IDS baselines', desc: 'Tabular ML baselines & pipelines.', url: 'https://github.com/Farid-Masood-Khan', icon: 'python' },
          { title: 'THUCNews Linear SVM', desc: 'TF‑IDF + Linear SVM baseline.', url: 'https://github.com/Farid-Masood-Khan', icon: 'python' }
        ],
        apps: [
          { title: 'Flutter Portfolio App', desc: 'Theming & modular widgets.', url: 'https://github.com/Farid-Masood-Khan', icon: 'flutter' },
          { title: 'Flutter + Firebase Starter', desc: 'Auth, Firestore, CI.', url: 'https://github.com/Farid-Masood-Khan', icon: 'flutter' },
          { title: 'Flutter UI Kit', desc: 'Reusable widgets & animations.', url: 'https://github.com/Farid-Masood-Khan', icon: 'flutter' }
        ]
      };
      renderPinned(defaults.highlights, highlightsGrid);
      renderPinned(defaults.apps, appsGrid);
    }
  }

  function renderPinned(list, container) {
    if (!container) return;
    container.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card reveal';
      card.innerHTML = `
        <div class="title">${pinnedIconSVG(item.icon || 'github')}${escapeHTML(item.title)}</div>
        <div class="desc">${escapeHTML(item.desc || '')}</div>
        <div class="actions">
          <a class="btn ghost" href="${item.url}" target="_blank" rel="noopener">View Repo</a>
        </div>
      `;
      container.appendChild(card);
      if (motionOK) requestAnimationFrame(() => card.classList.add('in-view'));
    });
  }

  

  function pinnedIconSVG(name) {
    // minimal icons inline
    if (name === 'github') {
      return '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="margin-right:6px;"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.35-1.75-1.35-1.75-1.1-.75.08-.73.08-.73 1.21.09 1.85 1.25 1.85 1.25 1.08 1.85 2.82 1.32 3.51 1.01.11-.79.42-1.32.76-1.63-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.39 1.25-3.24-.13-.3-.54-1.52.12-3.17 0 0 1-.32 3.28 1.24a11.4 11.4 0 0 1 5.97 0c2.28-1.56 3.28-1.24 3.28-1.24.66 1.65.25 2.87.12 3.17.78.85 1.25 1.93 1.25 3.24 0 4.61-2.82 5.62-5.5 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5Z"/></svg>';
    }
    if (name === 'python') {
      return '<span class="inline-badge python" aria-hidden="true">Py</span>';
    }
    if (name === 'flutter') {
      return '<span class="inline-badge flutter" aria-hidden="true">Fl</span>';
    }
    // fallback simple star
    return starSVG();
  }

  // Initialize dynamic sections
  loadPinned();
  loadRepos();
})();