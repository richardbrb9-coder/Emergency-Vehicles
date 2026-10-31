// Pip's World — screens, Pip's narration, hints, rewards and settings.
(function () {
  const C = window.CONTENT;
  const $ = s => document.querySelector(s);
  const stage = $('#stage'), sceneEl = $('#scene'), bubble = $('#bubble'), modal = $('#modal');
  const vehicle = id => C.vehicles.find(v => v.id === id);

  // ---------- Saved settings and progress (device only; safe if storage is blocked) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('etr.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('etr.' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  const Settings = window.Settings = Object.assign({ sound: true, voice: true, subtitles: true, calm: false, name: '' }, store.get('settings', {}));
  const progress = Object.assign({ stickers: [], words: [], games: [], gallery: [], plays: {} }, store.get('progress', {}));
  const saveSettings = () => { store.set('settings', Settings); stage.classList.toggle('calm', Settings.calm); };
  const saveProgress = () => { store.set('progress', progress); updateStickerCount(); };
  stage.classList.toggle('calm', Settings.calm);

  // ---------- Per-screen timers, so leaving a screen stops everything it started ----------
  let scope = { timers: [], rafs: [], intervals: [] };
  let sceneToken = 0;
  const later = (fn, ms) => { const t = setTimeout(fn, ms); scope.timers.push(t); return t; };
  const every = (fn, ms) => { const t = setInterval(fn, ms); scope.intervals.push(t); return t; };
  const wait = ms => new Promise(r => later(r, ms));
  function clearScope() {
    scope.timers.forEach(clearTimeout); scope.intervals.forEach(clearInterval); scope.rafs.forEach(cancelAnimationFrame);
    scope = { timers: [], rafs: [], intervals: [] };
  }
  const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  function tween(ms, fn, e = ease) {
    return new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / ms);
        fn(e(p), p);
        if (p < 1) scope.rafs.push(requestAnimationFrame(step)); else res();
      };
      scope.rafs.push(requestAnimationFrame(step));
    });
  }

  // ---------- Pip talks ----------
  let lastSaid = null, talkId = 0;
  const pipBtn = $('#pip');
  $('#start-pip').innerHTML = Art.pip('map');

  // Pip's outfit follows the world on screen. Moods and actions are short-lived classes on the button.
  const Pip = {
    current: null, moodTimer: null, actTimer: null,
    outfit(o) { if (o === this.current) return; this.current = o; pipBtn.innerHTML = Art.pip(o); },
    mood(m, ms = 2500) {
      clearTimeout(this.moodTimer);
      pipBtn.classList.remove('mood-surprised', 'mood-cheer', 'mood-thinking');
      if (m) { pipBtn.classList.add('mood-' + m); this.moodTimer = setTimeout(() => this.mood(null), ms); }
    },
    act(a) {
      clearTimeout(this.actTimer);
      pipBtn.classList.remove('act-jump', 'act-dance', 'act-wave');
      void pipBtn.offsetWidth;
      pipBtn.classList.add('act-' + a);
      this.actTimer = setTimeout(() => pipBtn.classList.remove('act-' + a), 2000);
    }
  };
  Pip.outfit('map');

  function line(id, vars = {}) {
    let t = C.lines[id] || id;
    Object.keys(vars).forEach(k => { t = t.replace('{' + k + '}', vars[k]); });
    return t;
  }
  function sayText(text, id = null) {
    const my = ++talkId;
    lastSaid = { text, id };
    const words = text.split(/\s+/);
    bubble.innerHTML = words.map(w => `<span class="w">${w.replace(/[<>&]/g, '')}</span>`).join(' ');
    bubble.hidden = !Settings.subtitles;
    bubble.style.animation = 'none'; void bubble.offsetWidth; bubble.style.animation = '';
    pipBtn.classList.add('talking');
    const spans = bubble.querySelectorAll('.w');
    return Voice.say(text, {
      id,
      onWord: i => { if (my !== talkId) return; spans.forEach((s, j) => s.classList.toggle('on', j === i)); }
    }).then(() => {
      if (my !== talkId) return;
      pipBtn.classList.remove('talking');
      spans.forEach(s => s.classList.remove('on'));
    });
  }
  const say = (id, vars) => sayText(line(id, vars), Object.keys(vars || {}).length ? null : id);
  function hush() { talkId++; Voice.stop(); pipBtn.classList.remove('talking'); }

  // ---------- Hints: glow what to tap, and repeat the instruction if nothing happens ----------
  const Hint = {
    targets: [], lineId: null, timer: null, count: 0, sticky: false,
    set(targets, lineId, sticky = false) {
      this.clear();
      this.targets = targets.filter(Boolean); this.lineId = lineId; this.sticky = sticky; this.count = 0;
      if (sticky) this.targets.forEach(t => t.classList.add('target'));
      this.arm();
    },
    arm() {
      clearTimeout(this.timer);
      this.targets.forEach(t => t.classList.remove('hint'));
      if (this.targets.length) this.timer = setTimeout(() => this.fire(), 8000);
    },
    fire() {
      if (this.count >= 3) return;
      this.count++;
      this.targets.forEach(t => t.classList.add('hint'));
      if (this.lineId && !pipBtn.classList.contains('talking') && modal.hidden) say(this.lineId);
      this.timer = setTimeout(() => this.arm(), 5000);
    },
    clear() {
      clearTimeout(this.timer);
      this.targets.forEach(t => t.classList.remove('hint', 'target'));
      this.targets = [];
    }
  };
  document.addEventListener('pointerdown', () => Hint.arm(), true);

  // ---------- Tap sparkles ----------
  sceneEl.addEventListener('pointerdown', e => {
    if (!e.target.closest('.tappable')) return;
    const r = stage.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
      const a = (Math.PI * 2 * i) / 6 + Math.random() * .5, d = 40 + Math.random() * 40;
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      $('#fx-layer').appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  });

  // ---------- Confetti ----------
  function confetti() {
    const cv = $('#confetti'), ctx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const colours = ['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f', '#8e5bd6', '#f07a1a'];
    const ps = Array.from({ length: Settings.calm ? 50 : 120 }, () => ({
      x: cv.width / 2, y: cv.height * .45, vx: (Math.random() - .5) * 18, vy: (Math.random() - .8) * 18,
      s: Math.random() * 10 + 6, c: colours[Math.floor(Math.random() * colours.length)], r: Math.random() * 6, vr: (Math.random() - .5) * .3
    }));
    const t0 = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .4; p.vx *= .99; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); ctx.restore();
      });
      if (now - t0 < 3500) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })(t0);
  }

  // ---------- Modals ----------
  const ICON = {
    close: '<svg viewBox="0 0 64 64"><path d="M16 16 L48 48 M48 16 L16 48" stroke="#fff" stroke-width="9" stroke-linecap="round"/></svg>',
    speak: '<svg viewBox="0 0 64 64"><path d="M12 24 H22 L34 14 V50 L22 40 H12 Z" fill="#fff"/><path d="M42 22 Q50 32 42 42 M48 16 Q60 32 48 48" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>',
    again: '<svg viewBox="0 0 64 64"><path d="M48 32 A16 16 0 1 1 40 18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M34 8 L46 18 L34 26 Z" fill="#fff"/></svg>',
    home: '<svg viewBox="0 0 64 64"><path d="M10 32 L32 12 L54 32" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 30 V52 H28 V40 H36 V52 H46 V30" fill="#fff"/></svg>'
  };
  let modalClose = null;
  function openModal(html, onClose) {
    modal.innerHTML = html; modal.hidden = false;
    modalClose = onClose || null;
    const x = modal.querySelector('.close');
    if (x) x.onclick = () => { Sfx.tap(); closeModal(); };
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true; modal.innerHTML = '';
    const cb = modalClose; modalClose = null; cb && cb();
  }

  // Red word card. Resolves when the child closes it.
  function wordCard(key) {
    const w = C.words[key];
    if (!progress.words.includes(key)) { progress.words.push(key); saveProgress(); }
    return new Promise(resolve => {
      openModal(`
        <div class="card word-card" role="dialog" aria-label="Red word: ${w.word}">
          <button class="close" aria-label="Close">${ICON.close}</button>
          <div class="pic">${Art.wordPicture[key] ? Art.wordPicture[key]() : ''}</div>
          <div>
            <div class="label">Red word</div>
            <div class="big">${w.word}</div>
            <div class="say">${w.say}</div>
            <p class="meaning">${w.meaning}</p>
            <div class="btn-row" style="justify-content:flex-start">
              <button class="big-btn hear" style="background:#8e5bd6" aria-label="Hear it again">${ICON.speak}</button>
            </div>
          </div>
        </div>`, () => { hush(); resolve(); });
      const speak = () => sayText(`${w.word}. ${w.say.replace(/ - /g, ' ')}. ${w.meaning}`);
      modal.querySelector('.hear').onclick = () => { Sfx.tap(); speak(); };
      modal.querySelector('.big').onclick = speak;
      Sfx.sparkle();
      speak();
    });
  }

  function reward(vId, onAgain) {
    const v = vehicle(vId);
    const isNew = !progress.stickers.includes(vId);
    if (isNew) { progress.stickers.push(vId); saveProgress(); }
    Sfx.fanfare(); confetti();
    openModal(`
      <div class="card reward" role="dialog" aria-label="${v.name} sticker">
        <h2>${v.name} sticker!</h2>
        <div class="sticker-big">${Art.sticker(v, true)}</div>
        <div class="btn-row">
          <button class="big-btn again" style="background:#1e5bd6" aria-label="Play again">${ICON.again}</button>
          <button class="big-btn home" style="background:#2e9e4f" aria-label="Back to the station">${ICON.home}</button>
        </div>
      </div>`);
    modal.querySelector('.again').onclick = () => { Sfx.tap(); closeModal(); onAgain(); };
    modal.querySelector('.home').onclick = () => { Sfx.tap(); closeModal(); go('hub'); };
    sayText(`You earned the ${v.name} sticker!`);
  }

  // ---------- Edge buttons ----------
  function ui({ home = false, stickers = false, phone = false, grownups = false, games = false, map = false } = {}) {
    $('#btn-games').hidden = !games;
    $('#btn-map').hidden = !map;
    $('#btn-home').hidden = !home;
    $('#btn-stickers').hidden = !stickers;
    $('#btn-phone').hidden = !phone;
    $('#btn-grownups').hidden = !grownups;
  }
  function updateStickerCount() {
    const n = progress.stickers.length + progress.games.length, c = $('#sticker-count');
    c.textContent = n; c.hidden = n === 0;
  }
  updateStickerCount();
  $('#btn-home').onclick = () => { Sfx.tap(); go(current === 'stickers' ? bookFrom : 'hub'); };
  $('#btn-map').onclick = () => { Sfx.tap(); go('map'); };
  $('#btn-stickers').onclick = () => { Sfx.tap(); go('stickers'); };
  $('#btn-games').onclick = () => { Sfx.tap(); go('games'); };
  $('#btn-repeat').onclick = () => { Sfx.tap(); if (lastSaid) sayText(lastSaid.text, lastSaid.id); };
  pipBtn.onclick = () => { Sfx.woof(); Pip.act('jump'); if (current === 'hub') say('hub.pip'); else if (current === 'map') say('map.pip'); else if (lastSaid) sayText(lastSaid.text, lastSaid.id); };

  // Grown-ups area: press and hold for 3 seconds so children don't wander in.
  (function grownupsGate() {
    const b = $('#btn-grownups'); let t = null;
    const start = e => { e.preventDefault(); b.classList.add('holding'); t = setTimeout(() => { b.classList.remove('holding'); openGrownups(); }, 3000); };
    const stop = () => { clearTimeout(t); b.classList.remove('holding'); };
    b.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
    b.addEventListener('contextmenu', e => e.preventDefault());
  })();

  function openGrownups() {
    hush();
    const rows = [
      ['sound', 'Sound effects'], ['voice', 'Narrator voice'], ['subtitles', 'Words on screen'], ['calm', 'Calm mode (softer lights and sirens)']
    ].map(([k, label]) => `<div class="toggle-row"><span id="lbl-${k}">${label}</span>
        <button class="switch" role="switch" aria-labelledby="lbl-${k}" aria-checked="${!!Settings[k]}" data-k="${k}"></button></div>`).join('');
    openModal(`
      <div class="card panel" role="dialog" aria-label="Grown-ups">
        <button class="close" aria-label="Close">${ICON.close}</button>
        <h2>Grown-ups</h2>
        <p>Your child is learning about people who help us, new words, numbers and colours. Everything stays on this device. There are no ads, purchases or timers.</p>
        ${rows}
        <div class="toggle-row"><label for="child-name">Child's first name (for the Rescue Cadet certificate)</label>
          <input id="child-name" class="name-input" maxlength="20" autocomplete="off" value="${(Settings.name || '').replace(/"/g, '&quot;')}"></div>
        <p style="margin-top:2vmin">Stickers collected: ${progress.stickers.length + progress.games.length} of ${C.vehicles.length + (window.App && App.games ? App.games.length : 0)}. Red words learned: ${progress.words.length}.</p>
        <div class="toggle-row"><span>${installState()}</span>
          ${installPrompt ? '<button class="text-btn" id="install" style="margin:0">Install app</button>' : ''}</div>
        <button class="text-btn danger" id="reset">Reset stickers, words and pictures</button>
      </div>`);
    modal.querySelectorAll('.switch').forEach(s => s.onclick = () => {
      const k = s.dataset.k; Settings[k] = !Settings[k]; s.setAttribute('aria-checked', Settings[k]); saveSettings(); Sfx.tap();
    });
    const inst = modal.querySelector('#install');
    if (inst) inst.onclick = async () => { const p = installPrompt; installPrompt = null; p.prompt(); await p.userChoice; inst.remove(); };
    const nameIn = modal.querySelector('#child-name');
    nameIn.oninput = () => { Settings.name = nameIn.value.trim(); saveSettings(); };
    const reset = modal.querySelector('#reset');
    reset.onclick = () => {
      if (reset.dataset.sure) {
        progress.stickers = []; progress.words = []; progress.games = []; progress.gallery = []; progress.plays = {}; saveProgress();
        reset.textContent = 'Progress has been reset'; reset.disabled = true; reset.classList.remove('danger');
      } else { reset.dataset.sure = '1'; reset.textContent = 'Tap again to reset'; }
    };
  }

  // ---------- Install and offline ----------
  // In a browser, an Install button appears as soon as Chrome says the app can be installed.
  // If Chrome never offers it (for example it wrongly thinks the app is already installed), a help button explains what to do.
  let current = null, bookFrom = 'hub';
  let installPrompt = null;
  const standalone = () => matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
  const installBtn = $('#btn-install'), helpBtn = $('#btn-install-help');
  const showInstall = () => {
    const where = !current || current === 'hub' || current === 'map';
    installBtn.hidden = !(installPrompt && where && !standalone());
    helpBtn.hidden = !(!installPrompt && where && !standalone() && helpBtn.dataset.ready);
  };
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; showInstall(); });
  window.addEventListener('appinstalled', () => { installPrompt = null; showInstall(); });
  setTimeout(() => { helpBtn.dataset.ready = '1'; showInstall(); }, 4000);
  installBtn.onclick = async e => {
    e.stopPropagation();
    if (!installPrompt) return;
    const p = installPrompt; installPrompt = null; showInstall();
    p.prompt();
    try { await p.userChoice; } catch (err) { /* ignore */ }
  };
  helpBtn.onclick = e => {
    e.stopPropagation();
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    openModal(`
      <div class="card panel" role="dialog" aria-label="How to install">
        <button class="close" aria-label="Close">${ICON.close}</button>
        <h2>How to install</h2>
        ${apple ? `<p>In Safari, tap the <b>Share</b> button, then <b>Add to Home Screen</b>.</p>` : `
        <p>Open the <b>⋮</b> menu in Chrome and choose <b>Install app</b> or <b>Add to home screen</b>.</p>
        <p>If Chrome says the app is <b>already installed</b> but it won't open:</p>
        <ol class="steps">
          <li>Long-press the old <b>To the Rescue</b> icon and choose <b>Uninstall</b>.</li>
          <li>In Chrome open <b>⋮ → Settings → Site settings → All sites</b>, choose <b>${location.hostname}</b> and tap <b>Clear &amp; reset</b>.</li>
          <li>Restart the tablet, open this page again, wait a few seconds, and tap <b>📲 Install app</b>.</li>
        </ol>`}
      </div>`);
  };
  function installState() {
    const offline = 'serviceWorker' in navigator && navigator.serviceWorker.controller;
    if (standalone()) return 'Installed on this device. Works without the internet.';
    if (installPrompt) return 'Install the app to play it full screen, even without the internet.';
    if (!standalone() && !installPrompt) return 'This browser is not offering to install right now. See "How to install" on the start screen.';
    return offline ? 'Ready to play without the internet. To install, use the browser menu: Add to Home screen.'
      : 'To install, use the browser menu: Add to Home screen.';
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  // ---------- Screen router ----------
  const screens = {};
  const screenWorld = {}; // screen name -> world id, for screens outside the Rescue Station
  function go(name, arg) {
    hush(); Hint.clear(); clearScope(); closeModal();
    sceneToken++;
    const my = sceneToken;
    const fade = $('#fade');
    fade.classList.add('on');
    setTimeout(() => {
      if (my !== sceneToken) return;
      if (name === 'stickers' && current !== 'stickers') bookFrom = current === 'map' ? 'map' : 'hub';
      current = name;
      // Every screen belongs to a world; the map and sticker book keep whatever Pip is wearing.
      if (name === 'map') Pip.outfit('map');
      else if (name !== 'stickers') Pip.outfit(screenWorld[name] || 'rescue');
      showInstall();
      bubble.hidden = true;
      screens[name](arg, () => my === sceneToken);
      fade.classList.remove('on');
    }, 260);
  }

  // Convert a pointer position to scene coordinates.
  function svgPoint(svg, e) {
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  // ---------- Hub: the Rescue Station ----------
  let welcomed = false;
  screens.hub = (arg, alive) => {
    sceneEl.innerHTML = Art.hub(C.vehicles);
    ui({ stickers: true, grownups: true, games: true, map: true });
    const svg = sceneEl.querySelector('svg');
    let busy = false;

    svg.querySelectorAll('.door').forEach(d => {
      d.addEventListener('click', async () => {
        if (busy) return;
        busy = true; Hint.clear();
        const v = vehicle(d.dataset.id), h = +d.dataset.h, panel = d.querySelector('.door-panel');
        Sfx.roller();
        await tween(900, p => panel.setAttribute('transform', `translate(0 ${-p * (h - 14)})`), easeOut);
        if (!alive()) return;
        if (v.built) {
          d.classList.add('flashing'); Sfx.siren(1.6);
          await sayText(`Door ${v.door}. The ${v.name}!`);
          if (alive()) go(v.id);
        } else {
          await say('hub.away', { name: v.name });
          await wait(500);
          if (!alive()) return;
          Sfx.roller(.7);
          await tween(700, p => panel.setAttribute('transform', `translate(0 ${-(1 - p) * (h - 14)})`));
          busy = false;
        }
      });
    });
    svg.querySelector('#sun').addEventListener('click', e => {
      Sfx.boing(); say('hub.sun');
      const s = e.currentTarget;
      tween(600, (p, raw) => s.setAttribute('transform', `translate(1190 240) scale(${1 + Math.sin(raw * Math.PI) * .2})`));
    });
    svg.querySelector('#flag').addEventListener('click', () => { Sfx.whoosh(); say('hub.flag'); });
    svg.querySelector('#window-cat').addEventListener('click', () => { Sfx.meow(); say('hub.windowCat'); });

    Hint.set([...svg.querySelectorAll('.door')].slice(0, 1), 'hub.hint');
    if (!welcomed) { welcomed = true; say('hub.welcome'); } else say('hub.hint');
  };

  // ---------- Fire engine on Maple Street ----------
  screens.fire = (arg, alive) => {
    sceneEl.innerHTML = Art.fireScene();
    ui({ home: true });
    const svg = sceneEl.querySelector('svg');
    const el = id => svg.querySelector('#' + id);
    const engine = el('engine'), ladder = el('fe-ladder'), ladderExt = el('fe-ladder-ext');
    const wheels = [...svg.querySelectorAll('.fe-wheel')];
    const flames = ['flame1', 'flame2', 'flame3'].map(el);
    let mode = 'arrive', step = null, explored = 0, ladderUp = false, busy = false;
    const lockersOpen = {};

    const setEngine = x => {
      engine.setAttribute('transform', `translate(${x} 846) scale(0.82)`);
      const deg = ((x - 330) / 0.82 / 46) * (180 / Math.PI);
      wheels.forEach(w => w.querySelector('.spokes').setAttribute('transform', `rotate(${deg} ${w.dataset.cx} -46)`));
    };
    const setLadder = (angle, ext) => {
      ladder.setAttribute('transform', `rotate(${angle} 60 -262)`);
      ladderExt.setAttribute('transform', `translate(${ext} 0)`);
    };
    const flash = ms => { engine.classList.add('flashing'); later(() => engine.classList.remove('flashing'), ms); };

    // Drive in
    setEngine(-760);
    svg.querySelector('#hose').style.visibility = 'hidden';
    svg.querySelector('#hose-in').style.visibility = 'hidden';
    engine.classList.add('flashing');
    Sfx.siren(2.6); Sfx.engine(2.4);
    tween(2600, p => setEngine(-760 + p * 1090), easeOut).then(() => {
      if (!alive()) return;
      engine.classList.remove('flashing');
      mode = 'explore';
      say('fire.arrive');
      Hint.set([el('fe-lights'), el('fe-ladder'), el('sam')], 'fire.arrive');
      later(showPhone, 16000);
    });

    const explore = (fn) => () => { if (mode === 'explore' && !busy) { explored++; fn(); if (explored === 4) later(showPhone, 2500); } else if (mode === 'mission') Sfx.tap(); };

    el('fe-lights').addEventListener('click', explore(() => { Sfx.chime(); flash(3000); say('fire.lights'); }));
    el('fe-siren').addEventListener('click', explore(() => { Sfx.siren(); flash(2400); say('fire.siren'); }));
    el('fe-cab').addEventListener('click', explore(() => { Sfx.tap(); say('fire.cab'); }));
    el('fe-wheels').addEventListener('click', explore(async () => {
      Sfx.engine(); say('fire.wheels');
      await tween(900, (p, raw) => setEngine(330 + Math.sin(raw * Math.PI * 6) * 6));
    }));
    svg.querySelectorAll('.fe-locker').forEach(lk => lk.addEventListener('click', explore(async () => {
      const n = lk.dataset.n, sh = lk.querySelector('.locker-shutter');
      if (lockersOpen[n]) return;
      lockersOpen[n] = true;
      Sfx.roller(.45);
      await tween(450, p => sh.setAttribute('transform', `translate(0 ${-p * 80})`), easeOut);
      await say(['fire.lockerHose', 'fire.lockerAxe', 'fire.lockerHelmets'][n - 1]);
      if (!alive()) return;
      if (n === '1' && !progress.words.includes('nozzle')) await wordCard('nozzle');
      await wait(1200);
      if (!alive()) return;
      Sfx.roller(.45);
      await tween(450, p => sh.setAttribute('transform', `translate(0 ${-(1 - p) * 80})`));
      lockersOpen[n] = false;
    })));
    el('sam').addEventListener('click', explore(async () => {
      say('fire.sam');
      const arm = el('sam-wave-arm');
      await tween(1400, (p, raw) => arm.setAttribute('transform', `rotate(${Math.sin(raw * Math.PI * 6) * 12} -24 -118)`));
    }));
    el('house').addEventListener('click', e => {
      if (mode === 'explore' && !busy) { explored++; Sfx.tap(); say('fire.house'); }
      else if (step === 'spray') {
        // A tap anywhere on the house sprays the nearest flame.
        const pt = svgPoint(svg, e);
        const lit = flames.filter(f => f.classList.contains('lit'));
        if (!lit.length) return;
        lit.sort((a, b) => dist(a, pt) - dist(b, pt));
        sprayAt(lit[0]);
      }
    });
    el('hydrant').addEventListener('click', () => {
      if (step === 'hydrant') return connectHose();
      if (mode === 'explore' && !busy) { explored++; Sfx.pop(); say('fire.hydrant').then(() => alive() && wordCard('hydrant')); }
    });
    el('kitten').addEventListener('click', () => { Sfx.meow(); });
    el('sun').addEventListener('click', () => { Sfx.boing(); });
    ladder.addEventListener('click', async () => {
      if (step === 'ladder') return rescueKitten();
      if (mode !== 'explore' || busy) return Sfx.tap();
      explored++; busy = true;
      Sfx.clank(8);
      const from = ladderUp ? 1 : 0, to = ladderUp ? 0 : 1;
      ladderUp = !ladderUp;
      say(ladderUp ? 'fire.ladder' : 'fire.ladderDown');
      await tween(1300, p => { const k = from + (to - from) * p; setLadder(-20 * k, 160 * k); });
      busy = false;
      if (explored === 4) later(showPhone, 2500);
    });

    function dist(f, pt) {
      const m = f.getAttribute('transform').match(/translate\(([\d.]+) ([\d.]+)\)/);
      return Math.hypot(+m[1] - pt.x, +m[2] - 40 - pt.y);
    }

    // ----- Mission -----
    const phone = $('#btn-phone');
    let ringer = null;
    function showPhone() {
      if (!alive() || mode !== 'explore' || !phone.hidden) return;
      if (!modal.hidden || busy) return later(showPhone, 3000);
      ui({ home: true, phone: true });
      Sfx.ring(); ringer = every(() => Sfx.ring(), 3500);
      Hint.set([phone], 'fire.phoneHint', true);
      if (!pipBtn.classList.contains('talking')) say('fire.phoneHint');
    }
    phone.onclick = () => { if (current === 'fire' && mode === 'explore') startMission(); };

    async function startMission() {
      clearInterval(ringer); Hint.clear();
      ui({ home: true });
      mode = 'mission'; busy = true;
      // tidy the engine
      if (ladderUp) { ladderUp = false; await tween(600, p => setLadder(-20 * (1 - p), 160 * (1 - p))); }
      flames.forEach(f => { f.classList.add('lit'); f.dataset.hits = 0; f.querySelector('.flame-scale').removeAttribute('transform'); });
      svg.classList.add('burning');
      Sfx.siren(); flash(4000);
      await say('fire.m.call');
      if (!alive()) return;
      step = 'hydrant';
      Hint.set([el('hydrant')], 'fire.m.hydrant', true);
      say('fire.m.hydrant');
    }

    async function connectHose() {
      step = null; Hint.clear();
      svg.querySelector('#hose').style.visibility = '';
      svg.querySelector('#hose-in').style.visibility = '';
      svg.classList.add('hosed');
      Sfx.pop(); Sfx.hiss();
      await say('fire.m.hosed');
      if (!alive()) return;
      if (!progress.words.includes('hydrant')) await wordCard('hydrant');
      if (!alive()) return;
      step = 'spray';
      Hint.set(flames, 'fire.m.sprayHint', true);
      say('fire.m.spray');
    }

    flames.forEach(f => f.addEventListener('click', e => { e.stopPropagation(); if (step === 'spray') sprayAt(f); }));

    let sprays = 0;
    async function sprayAt(f) {
      if (!f.classList.contains('lit') || f.dataset.busy) return;
      f.dataset.busy = 1;
      const m = f.getAttribute('transform').match(/translate\(([\d.]+) ([\d.]+)\)/);
      const tx = +m[1], ty = +m[2] - 40, sx = 300, sy = 688;
      const cx = (sx + tx) / 2, cy = Math.min(sy, ty) - 240;
      const spray = el('spray');
      spray.setAttribute('d', `M${sx} ${sy} Q${cx} ${cy} ${tx} ${ty}`);
      const len = spray.getTotalLength();
      spray.style.strokeDasharray = len; spray.style.opacity = .85;
      Sfx.spray();
      await tween(380, p => { spray.style.strokeDashoffset = len * (1 - p); }, easeOut);
      splash(tx, ty); Sfx.splash();
      const hits = +f.dataset.hits + 1; f.dataset.hits = hits;
      const fs = f.querySelector('.flame-scale');
      await tween(300, p => fs.setAttribute('transform', `scale(${1 - (hits - 1 + p) * 0.5})`));
      later(() => { spray.style.opacity = 0; }, 150);
      delete f.dataset.busy;
      if (hits >= 2) {
        f.classList.remove('lit'); Sfx.hiss();
        const t = Hint.targets.indexOf(f); if (t >= 0) { f.classList.remove('target', 'hint'); Hint.targets.splice(t, 1); }
      }
      sprays++;
      if (sprays === 2) say('fire.m.more');
      if (!flames.some(x => x.classList.contains('lit'))) fireOut();
    }
    function splash(x, y) {
      const g = el('splash');
      for (let i = 0; i < 8; i++) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 6 + Math.random() * 6);
        c.setAttribute('fill', '#bfe6ff'); c.setAttribute('class', 'drop');
        const a = Math.random() * Math.PI * 2;
        c.style.setProperty('--dx', Math.cos(a) * 60 + 'px'); c.style.setProperty('--dy', Math.sin(a) * 50 + 30 + 'px');
        g.appendChild(c); setTimeout(() => c.remove(), 650);
      }
    }

    async function fireOut() {
      step = null; Hint.clear();
      svg.classList.remove('burning'); svg.classList.add('steam');
      Sfx.chime();
      await say('fire.m.out');
      if (!alive()) return;
      later(() => svg.classList.remove('steam'), 2500);
      await wait(600);
      svg.classList.add('show-kitten');
      Sfx.meow(); later(() => Sfx.meow(), 900);
      await say('fire.m.meow');
      if (!alive()) return;
      step = 'ladder';
      Hint.set([ladder], 'fire.m.ladder', true);
      say('fire.m.ladder');
    }

    async function rescueKitten() {
      step = null; Hint.clear();
      Sfx.clank(12);
      await tween(1600, p => setLadder(-20.5 * p, 310 * p));
      if (!alive()) return;
      const kit = el('kitten');
      const place = (x, y, flip = false) => kit.setAttribute('transform', `translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`);
      Sfx.meow();
      // hop onto the top of the ladder, walk down it, then jump to the pavement
      await tween(450, (p, raw) => place(986 - p * 40, 392 + p * 22 - Math.sin(raw * Math.PI) * 30));
      await tween(2200, (p, raw) => place(946 - p * 520, 414 + p * 196 - Math.abs(Math.sin(raw * Math.PI * 10)) * 6), p => p);
      await tween(700, (p, raw) => place(426 - p * 160, 610 + p * 202 - Math.sin(raw * Math.PI) * 90));
      if (!alive()) return;
      Sfx.meow();
      const arm = el('sam-wave-arm');
      tween(1400, (p, raw) => arm.setAttribute('transform', `rotate(${Math.sin(raw * Math.PI * 6) * 12} -24 -118)`));
      confetti();
      await say('fire.m.saved');
      if (!alive()) return;
      tween(1200, p => setLadder(-20.5 * (1 - p), 310 * (1 - p)));
      await wait(400);
      mode = 'done'; busy = false;
      reward('fire', () => go('fire'));
    }
  };

  // ---------- Sticker book ----------
  screens.stickers = () => {
    ui({ home: true });
    sceneEl.innerHTML = `<div class="book"><div class="book-page">${C.vehicles.map(v => `
      <button data-id="${v.id}" aria-label="${v.name}">${Art.sticker(v, progress.stickers.includes(v.id))}
      <span>${progress.stickers.includes(v.id) ? v.name : '?'}</span></button>`).join('')}</div></div>`;
    sceneEl.querySelectorAll('.book-page button').forEach(b => b.onclick = () => {
      const v = vehicle(b.dataset.id);
      if (progress.stickers.includes(v.id)) { Sfx.sparkle(); sayText(`The ${v.name}!`); }
      else { Sfx.boing(); sayText(`Open door number ${v.door} to find this sticker.`); }
    });
    const n = progress.stickers.length;
    if (n) say('stickers.count', { n, stickers: n === 1 ? 'sticker' : 'stickers' }); else say('stickers.none');
  };

  // Shared toolkit for vehicle screens defined in other files.
  window.App = {
    screens, screenWorld, Pip, go, say, sayText, hush, Hint, later, every, wait, tween, ease, easeOut, svgPoint,
    wordCard, reward, ui, confetti, progress, saveProgress, openModal, closeModal, ICON, Settings, vehicle, alivePhone: () => $('#btn-phone'), isModalOpen: () => !modal.hidden,
    isTalking: () => pipBtn.classList.contains('talking'), current: () => current
  };

  // ---------- Start ----------
  $('#btn-play').onclick = () => {
    Sfx.unlock(); Sfx.woof();
    // On tablets: go full screen, keep landscape and stop the screen dimming while playing.
    try {
      const el = document.documentElement;
      if (!standalone() && el.requestFullscreen && matchMedia('(pointer: coarse)').matches) {
        el.requestFullscreen({ navigationUI: 'hide' }).then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {})).catch(() => {});
      }
    } catch (e) { /* not supported */ }
    const keepAwake = () => { try { if (navigator.wakeLock && document.visibilityState === 'visible') navigator.wakeLock.request('screen').catch(() => {}); } catch (e) { /* not supported */ } };
    keepAwake(); document.addEventListener('visibilitychange', keepAwake);
    // Some browsers only allow speech after a first spoken line inside a tap.
    if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); }
    const s = $('#start'); s.style.opacity = 0; setTimeout(() => s.remove(), 400);
    go('map');
  };
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();
