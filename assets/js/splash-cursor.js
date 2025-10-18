/**
 * 21st.dev Splash Cursor inspired canvas effect
 * Lightweight fluid-like ripples that follow the cursor within the hero section.
 * Respects prefers-reduced-motion.
 */
(function () {
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.getElementById('hero');
  if (!motionOK || !hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'splash-canvas';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let rect = hero.getBoundingClientRect();
  let width = Math.max(1, Math.floor(rect.width));
  let height = Math.max(1, Math.floor(rect.height));

  function resize() {
    rect = hero.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const drops = [];
  let lastEmit = 0;

  function addDrop(x, y) {
    drops.push({
      x, y,
      r: 60,
      life: 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    });
    // limit number of drops to keep perf stable
    if (drops.length > 60) drops.shift();
  }

  hero.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastEmit < 18) return; // throttle
    lastEmit = now;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > width || y > height) return;
    addDrop(x, y);
  }, { passive: true });

  function tick() {
    // subtle fade
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      // expand and fade
      d.r += 0.9;
      d.life *= 0.965;
      d.x += d.vx;
      d.y += d.vy;

      const g = ctx.createRadialGradient(d.x, d.y, Math.max(0, d.r * 0.15), d.x, d.y, d.r);
      // accent blend to violet tail
      g.addColorStop(0, `rgba(69, 202, 255, ${0.20 * d.life})`);
      g.addColorStop(0.6, `rgba(162, 123, 255, ${0.10 * d.life})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();

      if (d.life < 0.03) {
        drops.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();