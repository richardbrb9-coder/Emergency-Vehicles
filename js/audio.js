// Sound effects (synthesised, so nothing to download) and the narrator voice.
(function () {
  let ctx = null, master = null;
  const settings = () => window.Settings || { sound: true, voice: true, calm: false };

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone({ freq = 440, to = null, type = 'sine', start = 0, dur = 0.2, vol = 0.2, attack = 0.01 }) {
    const c = ac(); if (!c || !settings().sound) return;
    const t = c.currentTime + start;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(dur, { type = 'lowpass', f1 = 1000, f2 = null, q = 1, vol = 0.3, start = 0 } = {}) {
    const c = ac(); if (!c || !settings().sound) return null;
    const t = c.currentTime + start;
    const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f1, t);
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
    return src;
  }

  const Sfx = {
    unlock() { ac(); },
    tap()    { tone({ freq: 620, to: 880, dur: 0.08, vol: 0.15, type: 'triangle' }); },
    pop()    { tone({ freq: 300, to: 900, dur: 0.12, vol: 0.2, type: 'sine' }); },
    chime()  { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone({ freq: f, type: 'triangle', start: i * 0.08, dur: 0.5, vol: 0.18 })); },
    sparkle(){ [1318, 1568, 2093, 2637, 3136].forEach((f, i) => tone({ freq: f, type: 'sine', start: i * 0.06, dur: 0.35, vol: 0.08 })); },
    fanfare(){
      [[523, 0], [659, 0.15], [784, 0.3], [1047, 0.45], [784, 0.65], [1047, 0.8]].forEach(([f, s]) =>
        tone({ freq: f, type: 'square', start: s, dur: s >= 0.8 ? 0.7 : 0.18, vol: 0.07 }));
    },
    boing()  { tone({ freq: 240, to: 120, dur: 0.35, vol: 0.2, type: 'sine' }); },
    // UK fire engine two-tone: "nee-naw"
    siren(seconds = 2.4) {
      const c = ac(); if (!c || !settings().sound) return;
      const calm = settings().calm, dur = calm ? 1.2 : seconds;
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 1800;
      const t = c.currentTime;
      for (let s = 0, i = 0; s < dur; s += 0.42, i++) o.frequency.setValueAtTime(i % 2 ? 587 : 784, t + s);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(calm ? 0.05 : 0.12, t + 0.05);
      g.gain.setValueAtTime(calm ? 0.05 : 0.12, t + dur - 0.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.05);
    },
    engine(dur = 1.8) {
      const c = ac(); if (!c || !settings().sound) return;
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 420;
      const t = c.currentTime;
      o.frequency.setValueAtTime(55, t);
      o.frequency.exponentialRampToValueAtTime(140, t + dur * 0.35);
      o.frequency.exponentialRampToValueAtTime(90, t + dur * 0.7);
      o.frequency.exponentialRampToValueAtTime(50, t + dur);
      g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur);
    },
    // Roller door rattle
    roller(dur = 0.9) {
      for (let i = 0; i < dur / 0.07; i++) tone({ freq: 180 + (i % 3) * 40, type: 'square', start: i * 0.07, dur: 0.04, vol: 0.05 });
      noise(dur, { type: 'bandpass', f1: 900, q: 2, vol: 0.06 });
    },
    whoosh() { noise(0.6, { type: 'bandpass', f1: 300, f2: 1600, q: 2, vol: 0.25 }); },
    splash() { noise(0.7, { type: 'lowpass', f1: 2400, f2: 300, vol: 0.35 }); },
    spray()  { noise(0.9, { type: 'highpass', f1: 2500, f2: 1200, vol: 0.18 }); },
    hiss()   { noise(0.5, { type: 'highpass', f1: 4000, vol: 0.12 }); },
    clank(n = 6) { for (let i = 0; i < n; i++) tone({ freq: 900 + (i % 2) * 260, type: 'square', start: i * 0.11, dur: 0.05, vol: 0.08 }); },
    meow() {
      tone({ freq: 700, to: 1100, dur: 0.18, vol: 0.12, type: 'triangle' });
      tone({ freq: 1100, to: 600, start: 0.17, dur: 0.35, vol: 0.12, type: 'triangle' });
    },
    ring() {
      for (let r = 0; r < 2; r++) for (let i = 0; i < 10; i++)
        tone({ freq: i % 2 ? 1300 : 1100, type: 'square', start: r * 0.9 + i * 0.04, dur: 0.035, vol: 0.05 });
    },
    horn() {
      [300, 378].forEach(f => tone({ freq: f, type: 'sawtooth', dur: 0.35, vol: 0.09 }));
      [300, 378].forEach(f => tone({ freq: f, type: 'sawtooth', start: 0.45, dur: 0.45, vol: 0.09 }));
    },
    cheer() {
      noise(1.4, { type: 'bandpass', f1: 900, f2: 1400, q: 0.6, vol: 0.22 });
      tone({ freq: 1800, to: 2600, start: 0.2, dur: 0.3, vol: 0.05, type: 'sine' });
      tone({ freq: 1800, to: 2600, start: 0.6, dur: 0.3, vol: 0.05, type: 'sine' });
    },
    screech() {
      tone({ freq: 1400, to: 700, dur: 0.8, vol: 0.06, type: 'sawtooth' });
      noise(0.8, { type: 'highpass', f1: 3000, vol: 0.12 });
    },
    chop(n = 8) {
      for (let i = 0; i < n; i++) tone({ freq: 95, to: 35, start: i * 0.13, dur: 0.1, vol: 0.3, type: 'sine', attack: 0.005 });
    },
    // Ambulance wail: slow rise and fall
    wail(seconds = 2.4) {
      const c = ac(); if (!c || !settings().sound) return;
      const calm = settings().calm, dur = calm ? 1.2 : seconds;
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 1800;
      const t = c.currentTime;
      o.frequency.setValueAtTime(600, t);
      for (let s = 0; s < dur; s += 1.2) {
        o.frequency.linearRampToValueAtTime(1250, t + s + 0.6);
        o.frequency.linearRampToValueAtTime(600, t + s + 1.2);
      }
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(calm ? 0.05 : 0.11, t + 0.05);
      g.gain.setValueAtTime(calm ? 0.05 : 0.11, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
    },
    // Police yelp: fast sweeps
    yelp(seconds = 2) {
      const c = ac(); if (!c || !settings().sound) return;
      const calm = settings().calm, dur = calm ? 1 : seconds;
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 2000;
      const t = c.currentTime;
      o.frequency.setValueAtTime(650, t);
      for (let s = 0; s < dur; s += 0.25) {
        o.frequency.linearRampToValueAtTime(1400, t + s + 0.2);
        o.frequency.setValueAtTime(650, t + s + 0.25);
      }
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(calm ? 0.04 : 0.09, t + 0.05);
      g.gain.setValueAtTime(calm ? 0.04 : 0.09, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
    },
    crackle() { noise(0.5, { type: 'bandpass', f1: 2200, q: 1.5, vol: 0.18 }); tone({ freq: 1000, type: 'sine', start: 0.5, dur: 0.12, vol: 0.08 }); },
    tune() {
      [523, 659, 784, 659, 698, 880, 784, 659, 523].forEach((f, i) => tone({ freq: f, type: 'triangle', start: i * 0.18, dur: 0.22, vol: 0.1 }));
    },
    foghorn() { tone({ freq: 110, type: 'sawtooth', dur: 1.2, vol: 0.14, attack: 0.1 }); tone({ freq: 165, type: 'sawtooth', dur: 1.2, vol: 0.08, attack: 0.1 }); },
    beep(n = 1) { for (let i = 0; i < n; i++) tone({ freq: 880, type: 'square', start: i * 0.15, dur: 0.1, vol: 0.06 }); },
    // Water run and Word Train
    drip()   { tone({ freq: 900, to: 1500, dur: 0.07, vol: 0.08, type: 'sine' }); },
    plink(p = 1) { tone({ freq: 700 * p, to: 500 * p, dur: 0.06, vol: 0.06, type: 'triangle' }); },
    sproing(){ tone({ freq: 200, to: 900, dur: 0.25, vol: 0.12, type: 'triangle' }); tone({ freq: 210, to: 880, start: 0.03, dur: 0.22, vol: 0.05, type: 'sine' }); },
    whistle(){ tone({ freq: 1950, to: 2050, dur: 0.18, vol: 0.09, type: 'square' }); tone({ freq: 1950, to: 2150, start: 0.2, dur: 0.4, vol: 0.09, type: 'square' }); },
    drum()   { tone({ freq: 160, to: 60, dur: 0.25, vol: 0.4, type: 'sine' }); noise(0.08, { type: 'bandpass', f1: 1800, q: 0.8, vol: 0.12 }); },
    toot()   { const calm = settings().calm; [[587, 0], [740, 0], [587, 0.32], [740, 0.32]].forEach(([f, s]) => tone({ freq: f, type: 'sawtooth', start: s, dur: 0.26, vol: calm ? 0.03 : 0.06, attack: 0.03 })); },
    chuff(n = 4) { for (let i = 0; i < n; i++) noise(0.12, { type: 'highpass', f1: 2500, vol: 0.1, start: i * 0.22 }); },
    woof() {
      tone({ freq: 380, to: 180, dur: 0.16, vol: 0.18, type: 'sawtooth' });
      tone({ freq: 360, to: 170, start: 0.22, dur: 0.16, vol: 0.18, type: 'sawtooth' });
    },
    // Zoo animals and munching (kept soft: these are friendly animals)
    chomp(n = 3) { for (let i = 0; i < n; i++) { noise(0.07, { type: 'lowpass', f1: 900, vol: 0.25, start: i * 0.16 }); tone({ freq: 180, to: 120, start: i * 0.16, dur: 0.06, vol: 0.12 }); } },
    roar() { const v = settings().calm ? 0.05 : 0.1; tone({ freq: 140, to: 90, dur: 0.9, vol: v, type: 'sawtooth', attack: 0.15 }); noise(0.9, { type: 'lowpass', f1: 500, f2: 200, vol: v * 1.6 }); },
    trumpet() { const v = settings().calm ? 0.04 : 0.08; tone({ freq: 520, to: 780, dur: 0.25, vol: v, type: 'sawtooth', attack: 0.05 }); tone({ freq: 780, to: 700, start: 0.24, dur: 0.5, vol: v, type: 'sawtooth' }); },
    squawk() { tone({ freq: 1200, to: 1700, dur: 0.12, vol: 0.08, type: 'square' }); tone({ freq: 1700, to: 1000, start: 0.14, dur: 0.16, vol: 0.08, type: 'square' }); },
    honk() { tone({ freq: 420, to: 380, dur: 0.18, vol: 0.09, type: 'square' }); tone({ freq: 440, to: 400, start: 0.24, dur: 0.18, vol: 0.09, type: 'square' }); },
    oohooh() { [0, 0.22, 0.44].forEach((s, i) => tone({ freq: 500 + i * 120, to: 800 + i * 150, start: s, dur: 0.18, vol: 0.08, type: 'triangle' })); },
    burp() { const v = settings().calm ? 0.07 : 0.16; tone({ freq: 130, to: 70, dur: 0.55, vol: v, type: 'sawtooth', attack: 0.04 }); tone({ freq: 95, to: 60, start: 0.05, dur: 0.5, vol: v * .7, type: 'square', attack: 0.04 }); noise(0.45, { type: 'lowpass', f1: 380, f2: 140, vol: v * 1.4 }); },
    gobble() { tone({ freq: 260, to: 140, dur: 0.12, vol: 0.16, type: 'square' }); noise(0.08, { type: 'lowpass', f1: 900, vol: 0.25, start: 0.1 }); tone({ freq: 200, to: 110, start: 0.14, dur: 0.1, vol: 0.12 }); },
    plop() { tone({ freq: 500, to: 160, dur: 0.15, vol: 0.18, type: 'sine' }); }
  };

  // ---------- Narrator ----------
  // Prefers a British voice. Calls onWord(index) as each word is spoken so the subtitle can follow along.
  const PREFERRED = ['Google UK English Female', 'Microsoft Libby', 'Microsoft Sonia', 'Microsoft Maisie', 'Serena', 'Kate', 'Martha', 'Stephanie', 'Fiona', 'Moira', 'Samantha', 'Karen'];
  let voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const all = speechSynthesis.getVoices();
    if (!all.length) return;
    for (const name of PREFERRED) {
      const v = all.find(v => v.name.includes(name));
      if (v) { voice = v; return; }
    }
    voice = all.find(v => v.lang === 'en-GB') || all.find(v => v.lang.startsWith('en')) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  let token = 0, clip = null;
  const Voice = {
    // Resolves when the line has finished (or been interrupted).
    say(text, { id = null, onWord = null } = {}) {
      Voice.stop();
      const my = ++token;
      const words = text.split(/\s+/);
      const s = settings();
      return new Promise(resolve => {
        const done = () => { if (my === token) { clearInterval(fallback); resolve(); } else resolve(); };
        let fallback = null, gotBoundary = false;
        // Estimated word timing, used when the voice doesn't report word boundaries.
        const startFallback = (msPerWord) => {
          let i = 0;
          fallback = setInterval(() => {
            if (gotBoundary || my !== token) return clearInterval(fallback);
            onWord && onWord(Math.min(i++, words.length - 1));
            if (i >= words.length) clearInterval(fallback);
          }, msPerWord);
        };
        const file = id && window.CONTENT.voiceFiles[id];
        if (!s.voice) {
          startFallback(330);
          setTimeout(done, Math.max(1500, words.length * 330));
          return;
        }
        if (file) {
          clip = new Audio(file);
          clip.onloadedmetadata = () => startFallback((clip.duration * 1000) / words.length);
          clip.onended = done; clip.onerror = done;
          clip.play().catch(done);
          return;
        }
        if (!('speechSynthesis' in window)) { startFallback(330); setTimeout(done, words.length * 330); return; }
        const u = new SpeechSynthesisUtterance(text);
        if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-GB';
        u.rate = 0.9; u.pitch = 1.1;
        // Map character offsets to word indexes for the follow-along highlight.
        const starts = []; let pos = 0;
        words.forEach(w => { const at = text.indexOf(w, pos); starts.push(at); pos = at + w.length; });
        u.onboundary = e => {
          if (e.name && e.name !== 'word') return;
          gotBoundary = true;
          let idx = 0; while (idx + 1 < starts.length && starts[idx + 1] <= e.charIndex) idx++;
          onWord && onWord(idx);
        };
        u.onstart = () => setTimeout(() => { if (!gotBoundary && my === token) startFallback(360); }, 450);
        u.onend = done; u.onerror = done;
        // Safety net: some browsers never fire onend.
        setTimeout(done, 1500 + words.length * 600);
        speechSynthesis.speak(u);
      });
    },
    stop() {
      token++;
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      if (clip) { clip.pause(); clip = null; }
    }
  };

  window.Sfx = Sfx;
  window.Voice = Voice;
})();
