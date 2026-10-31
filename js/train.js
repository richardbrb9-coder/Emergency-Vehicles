// Syllable train engine: hear a word, clap its beats, put the beat carriages in order, and fix a silly carriage.
// A world pack gives the words: see WordTrain.packs.rescue below. Each beat plays its own recorded clip
// (audio/voice/syl.<word>.<n>.mp3, made by tools/make-voice.mjs), so the beats sound right.
window.WordTrain = { packs: {} };

// ---------- Rescue Station words ----------
// beats: what the child sees on each carriage. say: how the voice tool is asked to pronounce each beat.
// alone: beats the voice tool says on their own (it spelled them out letter by letter when reading the word beat by beat).
window.WordTrain.packs.rescue = {
  id: 'rescue',
  words: [
    { id: 'ladder',     word: 'ladder',      beats: ['lad', 'der'],               say: ['lad', 'duh'],                pic: 'ladder' },
    { id: 'helmet',     word: 'helmet',      beats: ['hel', 'met'],               say: ['hel', 'met'],                pic: 'helmet', alone: [1] },
    { id: 'siren',      word: 'siren',       beats: ['si', 'ren'],                say: ['sigh', 'run'],               pic: 'siren' },
    { id: 'hydrant',    word: 'hydrant',     beats: ['hy', 'drant'],              say: ['high', 'drunt'],             pic: 'hydrant' },
    { id: 'lifeboat',   word: 'lifeboat',    beats: ['life', 'boat'],             say: ['life', 'boat'],              pic: 'lifeboat' },
    { id: 'towtruck',   word: 'tow truck',   beats: ['tow', 'truck'],             say: ['toe', 'truck'],              pic: 'tow' },
    { id: 'fireengine', word: 'fire engine', beats: ['fire', 'en', 'gine'],       say: ['fire', 'en', 'jin'],         pic: 'fire' },
    { id: 'ambulance',  word: 'ambulance',   beats: ['am', 'bu', 'lance'],        say: ['am', 'byoo', 'lunce'],       pic: 'ambulance' },
    { id: 'policecar',  word: 'police car',  beats: ['po', 'lice', 'car'],        say: ['puh', 'lease', 'car'],       pic: 'police', alone: [1] },
    { id: 'hovercraft', word: 'hovercraft',  beats: ['hov', 'er', 'craft'],       say: ['hov', 'uh', 'craft'],        pic: 'hover', alone: [0] },
    { id: 'nozzle',     word: 'nozzle',      beats: ['noz', 'zle'],               say: ['noz', 'zull'],               pic: 'nozzle' },
    { id: 'helicopter', word: 'helicopter',  beats: ['hel', 'i', 'cop', 'ter'],   say: ['hel', 'uh', 'cop', 'tuh'],   pic: 'helitack', alone: [1] }
  ]
};

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const pack = WordTrain.packs.rescue;
  const scene = () => document.getElementById('scene');
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const COLOURS = ['#e53935', '#1e5bd6', '#2e9e4f', '#8e5bd6'];

  Object.assign(CONTENT.lines, {
    'games.train':       'Word Train',
    'train.pick':        'All aboard the Word Train! Words are made of beats. Pick a game.',
    'train.stage.clap':  'Clap it',
    'train.stage.build': 'Build it',
    'train.stage.swap':  'Swap it',
    'train.clap.intro':  'Listen to the word. Each beat is a carriage on the train.',
    'train.clap.go':     'Your turn! Tap the drum for each beat.',
    'train.beats2':      'Two beats!',
    'train.beats3':      'Three beats!',
    'train.beats4':      'Four beats!',
    'train.build.intro': 'Oh no, the carriages are muddled up! Drag them onto the train in the right order. Tap a carriage to hear it.',
    'train.build.go':    'Put the beats in order.',
    'train.build.no':    'Not that one yet. Which beat comes next?',
    'train.swap.intro':  'Uh oh! A silly carriage got on the train. Listen!',
    'train.swap.fix':    'Find the right carriage and drag it onto the silly one.',
    'train.swap.no':     'That sounds silly too! Try another one.',
    'train.yes':         'Yes!',
    'train.done':        'All aboard! Toot toot! Brilliant beat spotting!'
  });
  pack.words.forEach(w => { CONTENT.lines['train.word.' + w.id] = w.word[0].toUpperCase() + w.word.slice(1) + '!'; });

  // ---------- Pictures ----------
  const DRAWN = {
    ladder: `<svg viewBox="-70 -90 140 180"><g transform="rotate(12)"><path d="M-30 -80 V80 M30 -80 V80" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M-30 -80 V80 M30 -80 V80" stroke="#c3cad6" stroke-width="9" stroke-linecap="round"/>
      ${[-56, -24, 8, 40, 72].map(y => `<path d="M-30 ${y} H30" stroke="${OL}" stroke-width="12"/><path d="M-30 ${y} H30" stroke="#e9e3d6" stroke-width="6"/>`).join('')}</g></svg>`,
    helmet: `<svg viewBox="-80 -70 160 120"><path d="M-56 20 Q-56 -56 0 -56 Q56 -56 56 20 Z" fill="#ffd21f" ${S}/><path d="M-70 22 H70" stroke="${OL}" stroke-width="14" stroke-linecap="round"/><path d="M-70 22 H70" stroke="#e0a800" stroke-width="7" stroke-linecap="round"/>
      <path d="M0 -56 V18" stroke="#e0a800" stroke-width="10"/><rect x="-22" y="-34" width="44" height="26" rx="6" fill="#e53935" ${S3}/><path d="M-6 -26 H6 M0 -32 V-14" stroke="#fff" stroke-width="5"/></svg>`,
    siren: `<svg viewBox="-80 -80 160 140"><path d="M-46 -34 L-72 -60 M46 -34 L72 -60 M0 -60 V-78 M-60 0 H-78 M60 0 H78" stroke="#5cc3ff" stroke-width="8" stroke-linecap="round"/>
      <path d="M-36 30 V-10 Q-36 -50 0 -50 Q36 -50 36 -10 V30 Z" fill="#1e5bd6" ${S}/><path d="M-20 -14 Q-20 -36 0 -36" fill="none" stroke="#bfe6ff" stroke-width="8" stroke-linecap="round"/>
      <rect x="-50" y="28" width="100" height="22" rx="6" fill="#596178" ${S}/></svg>`,
    hydrant: () => Art.wordPicture.hydrant(),
    nozzle: () => Art.wordPicture.nozzle()
  };
  const picture = w => DRAWN[w.pic] ? (typeof DRAWN[w.pic] === 'function' ? DRAWN[w.pic]() : DRAWN[w.pic]) : Kit.vehiclePic(w.pic, 'preserveAspectRatio="xMidYMid meet"');

  const ENGINE = `<svg viewBox="0 0 260 200" class="tr-engine">
    <rect x="150" y="30" width="96" height="120" rx="12" fill="#e53935" ${S}/><rect x="166" y="50" width="62" height="44" rx="8" fill="#bfe6ff" ${S3}/>
    <path d="M140 22 H256" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M140 22 H256" stroke="#30364a" stroke-width="11" stroke-linecap="round"/>
    <rect x="34" y="78" width="124" height="72" rx="30" fill="#e53935" ${S}/><path d="M60 80 V148 M96 80 V148 M130 80 V148" stroke="#ffd21f" stroke-width="7"/>
    <path d="M58 78 L52 34 H86 L80 78 Z" fill="#30364a" ${S}/><circle cx="34" cy="114" r="18" fill="#ffd21f" ${S3}/>
    <path d="M14 150 L34 124 H60 V150 Z" fill="#596178" ${S3}/>
    <circle cx="80" cy="160" r="26" fill="#30364a" ${S}/><circle cx="80" cy="160" r="9" fill="#c3cad6"/><circle cx="200" cy="160" r="26" fill="#30364a" ${S}/><circle cx="200" cy="160" r="9" fill="#c3cad6"/>
    <g class="tr-puff"><circle cx="66" cy="18" r="14" fill="#fff" opacity=".9"/><circle cx="88" cy="4" r="10" fill="#fff" opacity=".7"/></g></svg>`;
  const carSvg = (i, empty = false) => {
    const col = COLOURS[i % 4], dots = Array.from({ length: i + 1 }, (_, k) => `<circle cx="${100 - i * 11 + k * 22}" cy="62" r="8" fill="#fff" ${S3}/>`).join('');
    return empty
      ? `<svg viewBox="0 0 200 150"><rect x="14" y="20" width="172" height="90" rx="14" fill="rgba(255,255,255,.5)" stroke="${OL}" stroke-width="5" stroke-dasharray="14 10"/>
          <circle cx="56" cy="122" r="20" fill="#c3cad6" stroke="${OL}" stroke-width="4" stroke-dasharray="8 6"/><circle cx="144" cy="122" r="20" fill="#c3cad6" stroke="${OL}" stroke-width="4" stroke-dasharray="8 6"/></svg>`
      : `<svg viewBox="0 0 200 150"><path d="M0 92 H14 M186 92 H200" stroke="${OL}" stroke-width="8"/><rect x="14" y="20" width="172" height="90" rx="14" fill="${col}" ${S}/>
          <rect x="26" y="10" width="148" height="16" rx="6" fill="#30364a" ${S3}/>${dots}
          <circle cx="56" cy="122" r="20" fill="#30364a" ${S}/><circle cx="56" cy="122" r="7" fill="#c3cad6"/><circle cx="144" cy="122" r="20" fill="#30364a" ${S}/><circle cx="144" cy="122" r="7" fill="#c3cad6"/></svg>`;
  };
  const DRUM = `<svg viewBox="-100 -100 200 200"><path d="M-80 -30 V50 Q0 90 80 50 V-30" fill="#e53935" ${S}/>
    <path d="M-80 -6 L-50 40 L-20 -6 L10 40 L40 -6 L70 40 L80 20" fill="none" stroke="#ffd21f" stroke-width="8" stroke-linejoin="round"/>
    <ellipse cy="-30" rx="80" ry="30" fill="#f4e3c3" ${S}/><ellipse cy="-30" rx="58" ry="20" fill="none" stroke="#e0cfa8" stroke-width="4"/>
    <g class="sticks"><path d="M-70 -96 L-14 -40" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-70 -96 L-14 -40" stroke="#c98b4e" stroke-width="8" stroke-linecap="round"/><circle cx="-14" cy="-40" r="10" fill="#f4e3c3" ${S3}/>
    <path d="M70 -96 L14 -40" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M70 -96 L14 -40" stroke="#c98b4e" stroke-width="8" stroke-linecap="round"/><circle cx="14" cy="-40" r="10" fill="#f4e3c3" ${S3}/></g></svg>`;

  const inner = svg => svg.replace(/<\/?svg[^>]*>/g, '');
  const TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${inner(ENGINE)}</g><g transform="translate(200 84) scale(.62)">${inner(carSvg(0))}</g></svg>`;
  A.addGame('train', '#e53935', TILE);
  const STAGE_ART = {
    clap: DRUM,
    build: `<svg viewBox="0 0 200 150">${[0, 1, 2].map(i => `<g transform="translate(${10 + i * 62} ${i % 2 ? 30 : 0}) scale(.3) rotate(${(i - 1) * 10} 100 75)">${inner(carSvg(i))}</g>`).join('')}</svg>`,
    swap: `<svg viewBox="0 0 200 150"><g transform="translate(10 30) scale(.45)">${inner(carSvg(0))}</g><g transform="translate(100 30) scale(.45) rotate(8 100 75)">${inner(carSvg(1))}</g>
      <text x="145" y="44" font-family="Fredoka, sans-serif" font-weight="700" font-size="40" fill="#ffd21f" stroke="${OL}" stroke-width="3" text-anchor="middle">?!</text></svg>`
  };

  // ---------- Saying beats ----------
  const sayBeat = (w, i) => A.sayText(w.beats[i], `syl.${w.id}.${i}`);
  const sayWord = w => A.say('train.word.' + w.id);
  async function sayBeats(w, cars, alive, beats = w.beats.map((_, i) => [w, i])) {
    for (let k = 0; k < beats.length; k++) {
      if (!alive()) return;
      if (cars && cars[k]) light(cars[k]);
      await sayBeat(...beats[k]);
      await A.wait(120);
    }
  }
  const light = car => { car.classList.remove('lit'); void car.offsetWidth; car.classList.add('lit'); };

  // ---------- Stage picker ----------
  function picker() {
    A.ui({ home: true });
    scene().innerHTML = `<div class="tr-pick">${['clap', 'build', 'swap'].map((s, i) => `
      <button class="tr-stage" data-s="${s}" style="animation-delay:${i * .08}s" aria-label="${CONTENT.lines['train.stage.' + s]}">
        <span class="art">${STAGE_ART[s]}</span><span class="label">${CONTENT.lines['train.stage.' + s]}</span>
        ${(A.progress.train || []).includes(s) ? '<b aria-hidden="true">★</b>' : ''}</button>`).join('')}</div>`;
    scene().querySelectorAll('.tr-stage').forEach(b => b.onclick = () => { Sfx.toot(); A.go('train', b.dataset.s); });
    A.say('train.pick');
  }

  // Four words per round: easy words first, longer words later.
  function roundWords(stage) {
    const by = n => shuffle(pack.words.filter(w => w.beats.length === n));
    const [two, three, four] = [by(2), by(3), by(4)];
    if (stage === 'clap') return shuffle([two[0], two[1], three[0], four[0]]);
    return [two[0], three[0], two[1], A.level('train') > 0 ? four[0] : three[1]];
  }

  // ---------- Playing ----------
  A.screens.train = (stage, alive) => {
    if (!stage) return picker();
    A.ui({ home: true });
    const words = roundWords(stage);
    let n = 0;
    scene().innerHTML = `
      <div class="train ${stage}">
        <div class="tr-card"><div class="tr-pic"></div><div class="tr-word"></div></div>
        <div class="tr-right"></div>
        <div class="tr-track"></div>
        <div class="tr-train"><div class="tr-loco">${ENGINE}</div><div class="tr-cars"></div></div>
      </div>`;
    const root = scene().querySelector('.train'), trainEl = root.querySelector('.tr-train'), carsEl = root.querySelector('.tr-cars');
    const right = root.querySelector('.tr-right'), picEl = root.querySelector('.tr-pic'), wordEl = root.querySelector('.tr-word');

    const makeCar = (i, text, cls = '') => {
      const c = document.createElement('div');
      c.className = 'car ' + cls;
      c.innerHTML = carSvg(i, cls.includes('slot')) + `<span class="syl">${text}</span>`;
      return c;
    };
    async function arrive(w) {
      picEl.innerHTML = picture(w); wordEl.textContent = '';
      root.classList.remove('leaving');
      trainEl.style.transition = 'none'; trainEl.style.transform = 'translateX(110vw)';
      void trainEl.offsetWidth;
      trainEl.style.transition = ''; trainEl.style.transform = '';
      Sfx.chuff(5);
      await A.wait(1500);
    }
    async function depart(w) {
      wordEl.textContent = w.beats.join('-');
      Sfx.toot(); A.Pip.mood('cheer');
      await A.say('train.beats' + w.beats.length);
      if (!alive()) return;
      await sayWord(w);
      if (!alive()) return;
      Sfx.chuff(6);
      trainEl.style.transform = 'translateX(-130vw)';
      await A.wait(1700);
      if (!alive()) return;
      n++;
      if (n < words.length) play(words[n]);
      else finish();
    }
    async function finish() {
      root.dataset.wait = 'end';
      picEl.innerHTML = ''; wordEl.textContent = '';
      const done = (A.progress.train = A.progress.train || []);
      if (!done.includes(stage)) { done.push(stage); A.saveProgress(); }
      await A.say('train.done');
      if (alive()) A.gameDone('train');
    }

    // ----- Stage 1: clap the beats on the drum -----
    async function clap(w) {
      carsEl.innerHTML = '';
      const cars = w.beats.map((b, i) => carsEl.appendChild(makeCar(i, b, 'quiet')));
      right.innerHTML = `<button class="tr-drum" aria-label="Drum">${DRUM}</button>`;
      const drum = right.querySelector('.tr-drum');
      let k = -1;
      drum.onclick = () => {
        Sfx.drum(); drum.classList.remove('hit'); void drum.offsetWidth; drum.classList.add('hit');
        if (k < 0 || k >= w.beats.length) return;
        light(cars[k]); cars[k].classList.remove('quiet');
        sayBeat(w, k); k++;
        if (k === w.beats.length) { A.Hint.clear(); root.dataset.wait = ''; A.later(() => depart(w), 900); }
      };
      await arrive(w);
      if (!alive()) return;
      await sayWord(w);
      if (n === 0) await A.say('train.clap.intro');
      if (!alive()) return;
      await sayBeats(w, cars, alive);
      if (!alive()) return;
      cars.forEach(c => c.classList.remove('lit'));
      A.say('train.clap.go');
      A.Hint.set([drum], 'train.clap.go');
      k = 0; root.dataset.wait = 'drum';
    }

    // ----- Stage 2: drag the muddled carriages onto the train in order -----
    async function build(w) {
      carsEl.innerHTML = '';
      const slots = w.beats.map((b, i) => carsEl.appendChild(makeCar(i, '', 'slot')));
      let order = shuffle(w.beats.map((_, i) => i));
      while (order.every((v, i) => v === i)) order = shuffle(order);
      right.innerHTML = '<div class="tr-siding"></div>';
      const siding = right.querySelector('.tr-siding');
      await arrive(w);
      if (!alive()) return;
      const loose = order.map(i => { const c = makeCar(i, w.beats[i], 'loose'); c.dataset.i = i; siding.appendChild(c); return c; });
      Sfx.pop();
      await sayWord(w);
      if (!alive()) return;
      A.say(n === 0 ? 'train.build.intro' : 'train.build.go');
      let next = 0;
      root.dataset.wait = 'drag';
      const hintNext = () => A.Hint.set([loose.find(c => +c.dataset.i === next)], 'train.build.go');
      hintNext();
      loose.forEach(c => draggable(c, () => sayBeat(w, +c.dataset.i), (x, y) => {
        const r = trainEl.getBoundingClientRect();
        if (y < r.top - 40 || x > r.right + 60) return false;
        if (+c.dataset.i !== next) { A.say('train.build.no'); return false; }
        const slot = slots[next];
        slot.replaceWith(c); c.classList.remove('loose'); c.style.transform = ''; c.onpointerdown = null;
        light(c); Sfx.pop(); sayBeat(w, next);
        next++;
        if (next === w.beats.length) { A.Hint.clear(); root.dataset.wait = ''; A.later(async () => { await A.wait(500); if (!alive()) return; await sayBeats(w, [...carsEl.children], alive); if (alive()) depart(w); }, 600); }
        else hintNext();
        return true;
      }));
    }

    // ----- Stage 3: one carriage is silly; swap in the right one -----
    async function swap(w) {
      carsEl.innerHTML = '';
      const k = Math.floor(Math.random() * w.beats.length);
      const others = shuffle(pack.words.filter(o => o !== w).flatMap(o => o.beats.map((b, i) => [o, i]))).filter(([o, i]) => o.beats[i] !== w.beats[k]);
      const seen = new Set([w.beats[k]]);
      const [silly, ...wrong] = others.filter(([o, i]) => !seen.has(o.beats[i]) && seen.add(o.beats[i]));
      const cars = w.beats.map((b, i) => carsEl.appendChild(i === k ? makeCar(i, silly[0].beats[silly[1]], 'silly') : makeCar(i, b)));
      right.innerHTML = '<div class="tr-siding"></div>';
      const siding = right.querySelector('.tr-siding');
      await arrive(w);
      if (!alive()) return;
      await sayWord(w);
      if (!alive()) return;
      await A.say('train.swap.intro');
      if (!alive()) return;
      const mixed = w.beats.map((_, i) => i === k ? silly : [w, i]);
      await sayBeats(w, cars, alive, mixed);
      if (!alive()) return;
      Sfx.boing(); A.Pip.mood('surprised');
      const choices = shuffle([[w, k], wrong[0], wrong[1]]);
      choices.forEach(([o, i]) => {
        const c = makeCar(k, o.beats[i], 'loose'); c.dataset.right = o === w ? 1 : 0; siding.appendChild(c);
        draggable(c, () => sayBeat(o, i), (x, y) => {
          const r = cars[k].getBoundingClientRect();
          if (x < r.left - 50 || x > r.right + 50 || y < r.top - 70 || y > r.bottom + 50) return false;
          if (o !== w) { Sfx.boing(); A.say('train.swap.no'); return false; }
          cars[k].replaceWith(c); cars[k] = c; c.classList.remove('loose'); c.style.transform = ''; c.onpointerdown = null;
          siding.innerHTML = ''; A.Hint.clear(); root.dataset.wait = '';
          light(c); Sfx.pop(); A.Pip.mood(null);
          A.later(async () => { await A.say('train.yes'); if (!alive()) return; await sayBeats(w, cars, alive); if (alive()) depart(w); }, 300);
          return true;
        });
      });
      A.say('train.swap.fix');
      root.dataset.wait = 'swap';
      A.Hint.set([...siding.children].filter(c => c.dataset.right === '1'), 'train.swap.fix');
    }

    // Drag a loose carriage; a tap without moving plays its beat. drop(x, y) returns true if it was used.
    function draggable(c, tap, drop) {
      c.onpointerdown = e => {
        e.preventDefault();
        const x0 = e.clientX, y0 = e.clientY; let moved = false;
        c.setPointerCapture(e.pointerId); c.classList.add('dragging'); Sfx.tap();
        c.onpointermove = ev => {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 10) moved = true;
          c.style.transform = `translate(${ev.clientX - x0}px, ${ev.clientY - y0}px)`;
        };
        c.onpointerup = c.onpointercancel = ev => {
          c.onpointermove = c.onpointerup = c.onpointercancel = null;
          c.classList.remove('dragging');
          if (!moved) { c.style.transform = ''; tap(); return; }
          if (drop(ev.clientX, ev.clientY)) return;
          c.style.transition = 'transform .3s'; c.style.transform = '';
          setTimeout(() => { c.style.transition = ''; }, 320);
        };
      };
    }

    const play = w => ({ clap, build, swap })[stage](w);
    play(words[0]);
  };
})();
