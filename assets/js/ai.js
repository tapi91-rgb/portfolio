/**
 * AI Assistant (21st.dev Prompt Box inspired, advanced)
 * Client-side demo that simulates responses, supports quick actions, voice input,
 * Enter vs Shift+Enter handling, and theme presets.
 */
(function () {
  const form = document.getElementById('ai-form');
  const input = document.getElementById('ai-input');
  const messages = document.getElementById('ai-messages');
  const shuffleBtn = document.getElementById('ai-shuffle');
  const quickBtns = Array.from(document.querySelectorAll('.ai-quick .chip'));
  const themeBtns = Array.from(document.querySelectorAll('.ai-theme .chip[data-theme]'));
  const voiceBtn = document.getElementById('ai-voice');

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
    const base = 'I can help plan experiments, build Flutter apps, and set up clean ML pipelines. Share goals, constraints, and a repo or sample data.';
    if (/flutter/i.test(q)) {
      return 'For your Flutter app: define screens, data, and Firebase needs. I’ll propose a clean architecture, state management, and a modular UI kit.';
    }
    if (/ml|model|data|pipeline/i.test(q)) {
      return 'For ML: start with a reproducible baseline (scikit‑learn) and clear splits/metrics. Share dataset structure and target; I’ll draft an experiment plan.';
    }
    if (/api|fastapi|docker/i.test(q)) {
      return 'For APIs: I’ll scaffold a FastAPI service, add endpoints, containers, and minimal CI. Tell me your required routes and data models.';
    }
    if (/plan.*day/i.test(q)) {
      return 'Plan: 90m coding (deep work), 30m reading, 30m exercise, 60m project planning. Batch messages and use short demos to keep momentum.';
    }
    if (/tf.?idf|svm/i.test(q)) {
      return 'TF‑IDF: convert text to weighted term vectors; Linear SVM: fast, strong classifier. Together they form a classic and effective baseline.';
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

  // Enter vs Shift+Enter in textarea
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form?.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  // Quick action chips
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-prompt') || btn.textContent || '';
      input.value = text;
      input.focus();
    });
  });

  // Theme presets
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-theme') || '';
      applyPreset(preset);
    });
  });

  shuffleBtn?.addEventListener('click', () => {
    randomizeAccentColors();
    clearThemePresetClass();
  });

  function clearThemePresetClass() {
    document.body.classList.remove('theme-neon', 'theme-calm', 'theme-mono');
    try { localStorage.removeItem('theme_preset'); } catch {}
  }

  function applyPreset(name) {
    const root = document.documentElement;
    document.body.classList.remove('theme-neon', 'theme-calm', 'theme-mono');
    if (name === 'neon') {
      const c1 = 'hsl(195 100% 60%)';
      const c2 = 'hsl(280 100% 58%)';
      root.style.setProperty('--accent', c1);
      root.style.setProperty('--accent-2', c2);
      document.body.classList.add('theme-neon');
    } else if (name === 'calm') {
      const c1 = 'hsl(200 60% 70%)';
      const c2 = 'hsl(260 50% 68%)';
      root.style.setProperty('--accent', c1);
      root.style.setProperty('--accent-2', c2);
      document.body.classList.add('theme-calm');
    } else if (name === 'mono') {
      const c1 = 'hsl(210 8% 66%)';
      const c2 = 'hsl(210 8% 50%)';
      root.style.setProperty('--accent', c1);
      root.style.setProperty('--accent-2', c2);
      document.body.classList.add('theme-mono');
    }
    try { localStorage.setItem('theme_preset', name); } catch {}
  }

  function randomizeAccentColors() {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 210 + Math.floor(Math.random() * 60)) % 360;
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

  // Voice input (Web Speech API)
  let recognition = null;
  let listening = false;
  function initRecognition() {
    const SR = (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return null;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    return rec;
  }

  voiceBtn?.addEventListener('click', async () => {
    if (!recognition) recognition = initRecognition();
    if (!recognition) {
      addMessage('ai', 'Voice input not supported in this browser.');
      return;
    }
    if (!listening) {
      try {
        listening = true;
        voiceBtn.setAttribute('aria-pressed', 'true');
        addMessage('ai', 'Listening…');
        recognition.start();
      } catch {
        addMessage('ai', 'Unable to start voice input.');
        listening = false;
        voiceBtn.setAttribute('aria-pressed', 'false');
      }
    } else {
      recognition.stop();
    }
  });

  if (recognition) {
    recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0]?.transcript || '')
        .join(' ')
        .trim();
      if (transcript) {
        input.value = (input.value ? input.value + ' ' : '') + transcript;
        input.focus();
      }
    });
    recognition.addEventListener('end', () => {
      listening = false;
      voiceBtn.setAttribute('aria-pressed', 'false');
    });
    recognition.addEventListener('error', () => {
      listening = false;
      voiceBtn.setAttribute('aria-pressed', 'false');
      addMessage('ai', 'Voice input error.');
    });
  }

  // Restore accents and preset if previously set
  try {
    const savedPair = JSON.parse(localStorage.getItem('accent_pair') || 'null');
    if (savedPair?.c1 && savedPair?.c2) {
      const root = document.documentElement;
      root.style.setProperty('--accent', savedPair.c1);
      root.style.setProperty('--accent-2', savedPair.c2);
    }
  } catch {}
  try {
    const preset = localStorage.getItem('theme_preset');
    if (preset) applyPreset(preset);
  } catch {}
})();