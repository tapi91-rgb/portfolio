/**
 * AI Assistant (21st.dev Prompt Box inspired)
 * Client-side demo that simulates responses and lets you shuffle theme accents.
 */
(function () {
  const form = document.getElementById('ai-form');
  const input = document.getElementById('ai-input');
  const messages = document.getElementById('ai-messages');
  const shuffleBtn = document.getElementById('ai-shuffle');

  function addMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = 'ai-msg ' + (role === 'user' ? 'user' : 'ai');

    const p = document.createElement('p');
    p.className = 'ai-text';
    if (role === 'ai') {
      p.textContent = '';
      streamText(p, text);
    } else {
      p.textContent = text;
    }
    msg.appendChild(p);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function streamText(el, text) {
    let i = 0;
    function step() {
      el.textContent += text.charAt(i++);
      if (i < text.length) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function generateReply(q) {
    const base = 'I can help plan experiments, build Flutter apps, and set up clean ML pipelines. Please share goals, constraints, and a repo or sample data.';
    if (/flutter/i.test(q)) {
      return 'For your Flutter app: define screens, data, and Firebase needs. I’ll propose a clean architecture, state management, and a modular UI kit.';
    }
    if (/ml|model|data|pipeline/i.test(q)) {
      return 'For ML: we start with a reproducible baseline (scikit‑learn) and clear splits/metrics. Share dataset structure and target; I’ll draft an experiment plan.';
    }
    if (/api|fastapi|docker/i.test(q)) {
      return 'For APIs: I’ll scaffold a FastAPI service, add endpoints, containers, and minimal CI. Tell me your required routes and data models.';
    }
    return base;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (input?.value || '').trim();
    if (!q) return;
    addMessage('user', q);
    input.value = '';
    setTimeout(() => addMessage('ai', generateReply(q)), 240);
  });

  shuffleBtn?.addEventListener('click', () => {
    randomizeAccentColors();
  });

  function randomizeAccentColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 210 + Math.floor(Math.random() * 60)) % 360; // spaced apart
    const sat = 78;
    const light1 = 62;
    const light2 = 52;
    const c1 = `hsl(${hue1} ${sat}% ${light1}%)`;
    const c2 = `hsl(${hue2} ${sat}% ${light2}%)`;
    const root = document.documentElement;
    root.style.setProperty('--accent', c1);
    root.style.setProperty('--accent-2', c2);
    try {
      localStorage.setItem('accent_pair', JSON.stringify({ c1, c2 }));
    } catch {}
  }

  // restore accents if previously randomized
  try {
    const saved = JSON.parse(localStorage.getItem('accent_pair') || 'null');
    if (saved?.c1 && saved?.c2) {
      const root = document.documentElement;
      root.style.setProperty('--accent', saved.c1);
      root.style.setProperty('--accent-2', saved.c2);
    }
  } catch {}
})();