// Phase 4 games, part 1: Count the Convoy, Look Closer, Rescue Maze and What's That Sound?
(function () {
  const A = window.App;
  const { OL, S, S3 } = Art;
  const NS = 'http://www.w3.org/2000/svg';
  const scene = () => document.getElementById('scene');
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const NUM = ['zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

  // ---------- Vehicle pictures for games, cropped to what is visible ----------
  const clean = id => Kit.art[id]().replace(/ id="[^"]*"/g, '').replace(/ class="tappable"/g, '');
  const boxes = {};
  function vbox(id) {
    if (boxes[id]) return boxes[id];
    const host = document.createElementNS(NS, 'svg');
    host.setAttribute('width', 0); host.setAttribute('height', 0);
    host.style.cssText = 'position:absolute;left:-9999px;top:0';
    host.innerHTML = `<g>${clean(id)}</g>`;
    document.body.appendChild(host);
    host.querySelectorAll('[opacity="0"]').forEach(n => n.remove());
    const b = host.firstElementChild.getBBox();
    host.remove();
    const p = Math.max(b.width, b.height) * 0.04;
    return (boxes[id] = { x: b.x - p, y: b.y - p, w: b.width + p * 2, h: b.height + p * 2 });
  }
  const vehiclePic = (id, attrs = '') => { const b = vbox(id); return `<svg viewBox="${b.x} ${b.y} ${b.w} ${b.h}" ${attrs}>${clean(id)}</svg>`; };
  // The same picture as a plain group, fitted into a w x h box whose bottom centre is at (0, 0).
  const vehicleG = (id, w, h, align = 'bottom') => {
    const b = vbox(id), k = Math.min(w / b.w, h / b.h);
    const tx = -(b.x + b.w / 2) * k, ty = align === 'bottom' ? -(b.y + b.h) * k : -(b.y + b.h / 2) * k;
    return `<g transform="translate(${tx} ${ty}) scale(${k})">${clean(id)}</g>`;
  };
  Kit.vbox = vbox; Kit.vehiclePic = vehiclePic; Kit.vehicleG = vehicleG; Kit.cleanArt = clean;

  const svgScene = (label, inner, extra = '') => `
    <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="${label}" ${extra}>
      ${Art.defs()}<rect width="1600" height="900" fill="url(#sky)"/>${inner}</svg>`;

  const ICONS = {
    count: `<svg viewBox="-60 -60 120 120"><rect x="-50" y="-10" width="100" height="40" rx="8" fill="#596178" ${S3}/><path d="M-44 10 H-30 M-14 10 H0 M16 10 H30" stroke="#fff" stroke-width="4"/>
      <circle cx="-26" cy="-30" r="18" fill="#e53935" ${S3}/><circle cx="14" cy="-30" r="18" fill="#1e5bd6" ${S3}/>
      <text x="-26" y="-23" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#fff" text-anchor="middle">1</text><text x="14" y="-23" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#fff" text-anchor="middle">2</text>
      <circle cx="44" cy="-30" r="10" fill="#ffd21f" ${S3}/></svg>`,
    closer: `<svg viewBox="-60 -60 120 120"><circle cx="-8" cy="-8" r="32" fill="#bfe6ff" stroke="${OL}" stroke-width="8"/><path d="M-20 -14 Q-10 -26 4 -22" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M16 16 L44 44" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M18 18 L44 44" stroke="#8a5a3c" stroke-width="9" stroke-linecap="round"/></svg>`,
    maze: `<svg viewBox="-60 -60 120 120"><path d="M-44 44 V-10 H0 V20 H40 V-44" fill="none" stroke="#7b8794" stroke-width="22" stroke-linejoin="round"/><path d="M-44 44 V-10 H0 V20 H40 V-44" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 7"/><circle cx="-44" cy="40" r="10" fill="#e53935" ${S3}/><path d="M40 -52 l8 14 h-16 z" fill="#2e9e4f" ${S3}/></svg>`,
    sound: `<svg viewBox="-60 -60 120 120"><path d="M-40 -16 H-20 L4 -36 V36 L-20 16 H-40 Z" fill="#8e5bd6" ${S}/><path d="M18 -18 Q30 0 18 18 M28 -30 Q48 0 28 30" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/></svg>`
  };
  A.addGame('count', '#f07a1a', ICONS.count);
  A.addGame('closer', '#1e5bd6', ICONS.closer);
  A.addGame('maze', '#2e9e4f', ICONS.maze);
  A.addGame('sound', '#8e5bd6', ICONS.sound);

  // =====================================================================
  // Count the Convoy: vehicles drive in, the child taps each one to count it, then picks the number
  // =====================================================================
  const LAND = ['fire', 'ambulance', 'police', 'tow', 'medical'];
  A.screens.count = (arg, alive) => {
    A.ui({ home: true });
    const lvl = A.level('count');
    const ranges = [[2, 5], [3, 7], [5, 10]][lvl];
    const rounds = 3;
    let round = 0;
    scene().innerHTML = svgScene('A road for the convoy', `
      ${Art.cloud(260, 210, .8)}${Art.cloud(1060, 260, .7)}
      <rect y="560" width="1600" height="340" fill="#7cc46a"/>
      <rect y="590" width="1600" height="290" fill="#596178"/>
      <path d="M0 735 H1600" stroke="#fff" stroke-width="8" stroke-dasharray="50 40"/>
      <g id="convoy"></g>
      <g id="choices"></g>`);
    const svg = scene().querySelector('svg');
    const convoy = svg.querySelector('#convoy'), choices = svg.querySelector('#choices');

    async function play() {
      const n = ranges[0] + Math.floor(Math.random() * (ranges[1] - ranges[0] + 1));
      const lanes = n > 5 ? 2 : 1, perLane = Math.ceil(n / lanes);
      const slotW = Math.min(290, 1160 / perLane);
      convoy.innerHTML = ''; choices.innerHTML = '';
      let counted = 0;
      const items = [];
      for (let i = 0; i < n; i++) {
        const lane = lanes === 2 ? (i < perLane ? 0 : 1) : 0;
        const k = lane ? i - perLane : i;
        const inLane = lane ? n - perLane : perLane;
        const x = 800 - (inLane * slotW) / 2 + k * slotW + slotW / 2;
        const y = lanes === 1 ? 760 : (lane ? 860 : 700);
        const w = slotW * 0.92, h = w * 0.62;
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'tappable cv');
        g.innerHTML = `${vehicleG(pick(LAND), w, h)}
          <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="transparent"/>
          <g class="num" opacity="0"><circle cx="0" cy="${-h - 30}" r="34" fill="#ffd21f" ${S3}/><text x="0" y="${-h - 18}" font-family="Fredoka, sans-serif" font-weight="700" font-size="38" text-anchor="middle" fill="${OL}"></text></g>`;
        g.dataset.x = x; g.dataset.y = y;
        g.setAttribute('transform', `translate(${-300 - i * 40} ${y})`);
        convoy.appendChild(g);
        items.push(g);
        g.addEventListener('click', () => {
          if (!g.dataset.n) {
            if (counted >= n) return;
            counted++; g.dataset.n = counted;
            g.querySelector('.num text').textContent = counted;
            g.querySelector('.num').setAttribute('opacity', 1);
            Sfx.pop(); A.sayText(NUM[counted] + '!');
            if (counted === n) { A.Hint.clear(); A.later(ask, 900); }
            else A.Hint.set(items.filter(t => !t.dataset.n), 'count.more');
          } else { Sfx.tap(); A.sayText(NUM[+g.dataset.n] + '!'); }
        });
      }
      Sfx.engine(2.2);
      await A.tween(2000, p => items.forEach((g, i) => {
        const q = Math.max(0, Math.min(1, p * 1.6 - i * 0.6 / n));
        const e = 1 - Math.pow(1 - q, 3);
        g.setAttribute('transform', `translate(${-300 + (+g.dataset.x + 300) * e} ${g.dataset.y})`);
      }), t => t);
      if (!alive()) return;
      A.say(round ? 'count.more' : 'count.intro');
      A.Hint.set(items, 'count.more');

      function ask() {
        if (!alive()) return;
        A.say('count.how');
        const opts = new Set([n]);
        while (opts.size < 3) { const d = n + pick([-2, -1, 1, 2]); if (d >= 1 && d <= 12) opts.add(d); }
        const list = [...opts].sort((a, b) => a - b);
        choices.innerHTML = list.map((v, i) => `<g class="tappable choice" data-v="${v}" transform="translate(${620 + i * 180} 330)">
          <circle r="70" fill="#fff" stroke="${OL}" stroke-width="8"/><text y="26" font-family="Fredoka, sans-serif" font-weight="700" font-size="80" text-anchor="middle" fill="#1e5bd6">${v}</text></g>`).join('');
        choices.querySelectorAll('.choice').forEach(c => c.addEventListener('click', async () => {
          if (choices.dataset.done) return;
          if (+c.dataset.v !== n) {
            Sfx.boing(); A.say('count.no');
            A.Hint.set([choices.querySelector(`[data-v="${n}"]`)], 'count.how', true);
            return;
          }
          choices.dataset.done = 1; A.Hint.clear();
          Sfx.chime();
          c.querySelector('circle').setAttribute('fill', '#bff0c8');
          await A.say('count.yes', { n });
          if (!alive()) return;
          Sfx.siren(1.6); Sfx.engine(1.8);
          await A.tween(1500, p => items.forEach(g => g.setAttribute('transform', `translate(${+g.dataset.x + p * p * 1500} ${g.dataset.y})`)), t => t);
          if (!alive()) return;
          delete choices.dataset.done;
          round++;
          if (round < rounds) play();
          else { A.say('count.done'); A.gameDone('count'); }
        }));
      }
    }
    play();
  };

  // =====================================================================
  // Look Closer: a close-up slowly zooms out; guess which vehicle it is
  // =====================================================================
  const ALL = ['fire', 'ambulance', 'police', 'tow', 'medical', 'airamb', 'helitack', 'lifeboat', 'hover'];
  A.screens.closer = (arg, alive) => {
    A.ui({ home: true });
    const lvl = A.level('closer');
    const zoom0 = [4, 6, 8][lvl], nOpts = [3, 3, 4][lvl];
    const order = shuffle(ALL).slice(0, 4);
    let round = 0, anim = null;
    scene().innerHTML = `
      <div class="closer">
        <div class="lens"><div class="pic"></div></div>
        <div class="opts"></div>
      </div>`;
    const pic = scene().querySelector('.lens .pic'), opts = scene().querySelector('.opts');

    function show() {
      const id = order[round], b = vbox(id);
      pic.innerHTML = vehiclePic(id, 'preserveAspectRatio="xMidYMid meet"');
      const s = pic.querySelector('svg');
      // Start on a detail somewhere in the middle of the vehicle.
      const fx = b.x + b.w * (0.25 + Math.random() * 0.5), fy = b.y + b.h * (0.3 + Math.random() * 0.4);
      const setZoom = z => {
        const w = b.w / z, h = b.h / z;
        const x = fx - w / 2 + (b.x + b.w / 2 - fx) * (1 - 1 / z) * 0, y = fy - h / 2;
        // Blend the centre from the detail to the middle as we zoom out.
        const t = (zoom0 - z) / (zoom0 - 1);
        const cx = fx + (b.x + b.w / 2 - fx) * t, cy = fy + (b.y + b.h / 2 - fy) * t;
        s.setAttribute('viewBox', `${cx - w / 2} ${cy - h / 2} ${w} ${h}`);
      };
      setZoom(zoom0);
      let z = zoom0;
      anim = { done: false };
      const my = anim;
      A.tween(12000, p => { if (!my.done) { z = zoom0 - (zoom0 - 1.6) * p; setZoom(z); } }, t => t);
      const choices = shuffle([id, ...shuffle(ALL.filter(v => v !== id)).slice(0, nOpts - 1)]);
      opts.innerHTML = choices.map(v => `<button class="svc" data-v="${v}" aria-label="${A.vehicle(v).name}">${Art.sticker(A.vehicle(v), true)}</button>`).join('');
      opts.querySelectorAll('.svc').forEach(btn => btn.onclick = async () => {
        if (my.done) return;
        if (btn.dataset.v !== id) {
          Sfx.boing(); btn.classList.add('shake'); setTimeout(() => btn.classList.remove('shake'), 400);
          A.say('closer.no'); return;
        }
        my.done = true; A.Hint.clear();
        btn.classList.add('chosen'); Sfx.chime();
        const from = z;
        A.tween(700, p => setZoom(from - (from - 1) * p));
        await A.say('closer.yes', { name: A.vehicle(id).name });
        if (!alive()) return;
        round++;
        if (round < order.length) show();
        else { A.say('closer.done'); A.gameDone('closer'); }
      });
      A.Hint.set([...opts.querySelectorAll('.svc')], 'closer.intro');
    }
    A.say('closer.intro');
    show();
  };

  // =====================================================================
  // Rescue Maze: drag the vehicle along the roads to the person who needs help
  // =====================================================================
  // '#' grass, '.' road, 'S' start, 'G' the person who needs help.
  const MAZES = [
    ['S...#..', '##.##.#', '#....#G', '####...'],
    ['S.#....', '#.#.##.', '#...#..', '##.##.G'],
    ['S..#...', '#.##.#.', '#....#.', '#.##..G'],
    ['S#.....', '.#.###.', '...#...', '#.##.#G'],
    ['S....#.', '###.#..', '.#....#', '...#..G'],
    ['S.#...#', '#...#..', '#.#.#.#', '..#...G']
  ];
  const COLS = 7, ROWS = 4, CW = 170, CH = 150, X0 = 800 - (COLS * CW) / 2, Y0 = 250;
  const cellXY = (c, r) => ({ x: X0 + c * CW + CW / 2, y: Y0 + r * CH + CH / 2 });
  const RESCUES = [
    { v: 'ambulance', who: 'hurt', sound: () => Sfx.wail(2) },
    { v: 'police', who: 'lost', sound: () => Sfx.yelp(2) },
    { v: 'fire', who: 'fire', sound: () => Sfx.siren(2) }
  ];
  const goalArt = (who, k) => who === 'hurt'
    ? `<g transform="translate(-20 50) scale(.7)">${Kit.sitter({ id: 'mz' + k, top: '#8e5bd6', legs: '#1e5bd6', skin: '#e0ac85', hair: '#2a2f45' })}</g>`
    : who === 'lost'
      ? `<g transform="translate(0 60) scale(.5)">${Kit.person({ id: 'mzp' + k, suit: '#f07a1a', band: '#f07a1a', hat: 'hair', hair: '#c97b2a', skin: '#f1c27d' })}<ellipse class="tear" cx="-10" cy="-136" rx="4" ry="7" fill="#5cc3ff"/></g>`
      : `<g transform="translate(0 56)"><path d="M-60 -60 L0 -110 L60 -60 Z" fill="#c62828" ${S}/><rect x="-50" y="-62" width="100" height="62" fill="#f4e3c3" ${S}/><rect x="-14" y="-34" width="28" height="34" fill="#8a5a3c" ${S3}/>
          <g class="burning"><g class="flame-group lit" transform="translate(-30 -60)"><g class="flame-scale"><g class="flame"><path d="M0 0 C-36 -8 -34 -54 -6 -96 C0 -64 22 -70 18 -42 C34 -56 36 -18 0 0 Z" fill="#ff8a1f" ${S3} transform="scale(.5)"/></g></g></g>
          <g class="flame-group lit" transform="translate(28 -64)"><g class="flame-scale"><g class="flame"><path d="M0 0 C-36 -8 -34 -54 -6 -96 C0 -64 22 -70 18 -42 C34 -56 36 -18 0 0 Z" fill="#ff8a1f" ${S3} transform="scale(.5)"/></g></g></g></g></g>`;

  A.screens.maze = (arg, alive) => {
    A.ui({ home: true });
    const lvl = A.level('maze');
    const pool = lvl === 0 ? MAZES.slice(0, 3) : lvl === 1 ? MAZES.slice(1, 5) : MAZES.slice(3);
    const mazes = shuffle(pool).slice(0, 3);
    let round = 0;

    function build() {
      const m = mazes[round], R = RESCUES[round];
      const road = (c, r) => r >= 0 && r < ROWS && c >= 0 && c < COLS && m[r][c] !== '#';
      let start, goal;
      m.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'S') start = { c, r }; if (ch === 'G') goal = { c, r }; }));
      let cells = '', deco = '';
      m.forEach((row, r) => [...row].forEach((ch, c) => {
        const { x, y } = cellXY(c, r);
        if (ch === '#') {
          deco += (c + r) % 3 === 0 ? Art.tree(x, y + 60, 0.42) : (c + r) % 3 === 1
            ? `<g transform="translate(${x} ${y + 50})"><path d="M-46 -50 L0 -88 L46 -50 Z" fill="${['#e53935', '#1e5bd6', '#8e5bd6'][(c * 3 + r) % 3]}" ${S3}/><rect x="-38" y="-52" width="76" height="52" fill="#fff6e6" ${S3}/><rect x="-10" y="-30" width="20" height="30" fill="#8a5a3c"/></g>`
            : Art.bush(x, y + 40, 0.8);
        } else {
          cells += `<rect x="${x - CW / 2 - 1}" y="${y - CH / 2 - 1}" width="${CW + 2}" height="${CH + 2}" fill="#7b8794"/>`;
          if (road(c + 1, r)) cells += `<path d="M${x} ${y} H${x + CW}" stroke="#fff" stroke-width="5" stroke-dasharray="20 18"/>`;
          if (road(c, r + 1)) cells += `<path d="M${x} ${y} V${y + CH}" stroke="#fff" stroke-width="5" stroke-dasharray="20 18"/>`;
        }
      }));
      const gp = cellXY(goal.c, goal.r), sp = cellXY(start.c, start.r);
      scene().innerHTML = svgScene('A town map with roads', `
        <rect x="${X0 - 20}" y="${Y0 - 20}" width="${COLS * CW + 40}" height="${ROWS * CH + 40}" rx="30" fill="#7cc46a" ${S}/>
        ${cells}${deco}
        <g id="trail"></g>
        <g id="goal" transform="translate(${gp.x} ${gp.y})">${goalArt(R.who, round)}</g>
        <g id="car" class="tappable" transform="translate(${sp.x} ${sp.y})">${vehicleG(R.v, 156, 104, 'middle')}<rect x="-80" y="-70" width="160" height="140" fill="transparent"/></g>
        <rect id="maze-hit" x="${X0}" y="${Y0}" width="${COLS * CW}" height="${ROWS * CH}" fill="transparent"/>`);
      // Show the whole map on any screen shape, rather than cropping it.
      const ms = scene().querySelector('svg');
      ms.setAttribute('viewBox', `${X0 - 40} 60 ${COLS * CW + 80} 850`);
      ms.setAttribute('preserveAspectRatio', 'xMidYMax meet');
      ms.style.background = 'linear-gradient(#7cc8f7, #e3f5ff)';
      const svg = scene().querySelector('svg');
      const car = svg.querySelector('#car'), hit = svg.querySelector('#maze-hit'), trail = svg.querySelector('#trail');
      // The car sits above the hit area so it can be grabbed; the hit area catches the drag.
      svg.appendChild(car);
      let pos = { ...start }, moving = Promise.resolve(), dragging = false, won = false, facing = 1;

      const place = (x, y) => car.setAttribute('transform', `translate(${x} ${y}) scale(${facing} 1)`);
      const stepTo = (c, r) => {
        moving = moving.then(async () => {
          if (won || !alive()) return;
          const a = cellXY(pos.c, pos.r), b = cellXY(c, r);
          if (b.x !== a.x) facing = b.x > a.x ? 1 : -1;
          trail.insertAdjacentHTML('beforeend', `<path d="M${a.x} ${a.y} L${b.x} ${b.y}" stroke="#ffd21f" stroke-width="14" stroke-linecap="round" opacity=".8"/>`);
          pos = { c, r };
          await A.tween(140, p => place(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p), t => t);
          if (pos.c === goal.c && pos.r === goal.r) arrive();
        });
      };
      // Move towards a cell if it is in a straight, clear line of road from where the car will be.
      let queued = { ...start };
      const tryReach = (c, r) => {
        if (won || !road(c, r)) return;
        const dc = Math.sign(c - queued.c), dr = Math.sign(r - queued.r);
        if (dc && dr) return;
        let cc = queued.c, rr = queued.r;
        while ((cc !== c || rr !== r)) {
          if (!road(cc + dc, rr + dr)) return;
          cc += dc; rr += dr;
          stepTo(cc, rr); queued = { c: cc, r: rr };
        }
      };
      const cellAt = e => { const p = A.svgPoint(svg, e); return { c: Math.floor((p.x - X0) / CW), r: Math.floor((p.y - Y0) / CH) }; };
      svg.addEventListener('pointerdown', e => { dragging = true; Sfx.tap(); const { c, r } = cellAt(e); tryReach(c, r); try { svg.setPointerCapture(e.pointerId); } catch (_) {} });
      svg.addEventListener('pointermove', e => { if (!dragging) return; const { c, r } = cellAt(e); tryReach(c, r); });
      const up = () => { dragging = false; };
      svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);

      async function arrive() {
        won = true; A.Hint.clear();
        R.sound(); Sfx.chime();
        const goalEl = svg.querySelector('#goal');
        if (R.who === 'hurt') {
          goalEl.querySelector(`#mz${round}-sad`).setAttribute('opacity', 0);
          goalEl.querySelector(`#mz${round}-happy`).setAttribute('opacity', 1);
          goalEl.querySelector(`#mz${round}-tear`).setAttribute('opacity', 0);
          goalEl.querySelector(`#mz${round}-plaster`).setAttribute('opacity', 1);
        } else if (R.who === 'lost') goalEl.querySelector('.tear').setAttribute('opacity', 0);
        else { goalEl.querySelector('.burning').setAttribute('opacity', 0); Sfx.hiss(); }
        A.tween(800, (p, raw) => goalEl.setAttribute('transform', `translate(${gp.x} ${gp.y - Math.abs(Math.sin(raw * Math.PI * 2)) * 24})`));
        await A.say('maze.yes');
        if (!alive()) return;
        round++;
        if (round < mazes.length) { await A.wait(400); if (alive()) build(); }
        else { A.say('maze.done'); A.gameDone('maze'); }
      }
      A.say('maze.intro', { vehicle: A.vehicle(R.v).name.toLowerCase() });
      // Glow the first road cell to show the way.
      A.Hint.set([car], null, true);
      place(sp.x, sp.y);
    }
    build();
  };

  // =====================================================================
  // What's That Sound? Hear a siren, rotor or horn and tap the vehicle that makes it
  // =====================================================================
  const SOUNDS = {
    fire: { play: () => Sfx.siren(2.4), family: 'siren' },
    ambulance: { play: () => Sfx.wail(2.4), family: 'siren' },
    police: { play: () => Sfx.yelp(2), family: 'siren' },
    airamb: { play: () => Sfx.chop(10), family: 'air' },
    lifeboat: { play: () => Sfx.foghorn(), family: 'sea' },
    tow: { play: () => Sfx.clank(12), family: 'tow' }
  };
  A.screens.sound = (arg, alive) => {
    A.ui({ home: true });
    const lvl = A.level('sound');
    const ids = Object.keys(SOUNDS);
    const order = shuffle(ids).slice(0, 5);
    let round = 0;
    scene().innerHTML = `
      <div class="sound-game">
        <button class="speaker" aria-label="Play the sound">${ICONS.sound.replace('<svg ', '<svg class="spk" ')}</button>
        <div class="opts"></div>
      </div>`;
    const spk = scene().querySelector('.speaker'), opts = scene().querySelector('.opts');
    let current = null, locked = false;
    const playIt = () => { if (!current) return; spk.classList.add('playing'); setTimeout(() => spk.classList.remove('playing'), 2200); SOUNDS[current].play(); };
    spk.onclick = () => { Sfx.tap(); playIt(); };

    function show() {
      current = order[round]; locked = false;
      // First time round, the wrong answers sound very different. Later, sirens can appear together.
      const others = ids.filter(v => v !== current && (lvl > 0 || SOUNDS[v].family !== SOUNDS[current].family));
      const choices = shuffle([current, ...shuffle(others).slice(0, 2)]);
      opts.innerHTML = choices.map(v => `<button class="sound-opt" data-v="${v}" aria-label="${A.vehicle(v).name}">${vehiclePic(v, 'preserveAspectRatio="xMidYMid meet"')}</button>`).join('');
      opts.querySelectorAll('.sound-opt').forEach(b => b.onclick = async () => {
        if (locked) return;
        if (b.dataset.v !== current) { Sfx.boing(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); A.say('sound.no'); return; }
        locked = true; A.Hint.clear();
        b.classList.add('chosen', 'flashing'); Sfx.chime();
        await A.say('sound.' + current);
        if (!alive()) return;
        round++;
        if (round < order.length) { show(); A.later(playIt, 500); }
        else { current = null; A.say('sound.done'); A.gameDone('sound'); }
      });
      A.Hint.set([spk], 'sound.again');
    }
    show();
    A.say('sound.intro').then(() => { if (alive()) playIt(); });
  };
})();
