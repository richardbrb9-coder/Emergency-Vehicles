// Phase 4 games, part 2: Jigsaw, Colouring and Build a Vehicle
(function () {
  const A = window.App;
  const { OL, S, S3 } = Art;
  const scene = () => document.getElementById('scene');
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const ALL = ['fire', 'ambulance', 'police', 'tow', 'medical', 'airamb', 'helitack', 'lifeboat', 'hover'];
  const SEA = ['lifeboat', 'hover'], AIR = ['airamb', 'helitack'];

  const ICONS = {
    jigsaw: `<svg viewBox="-60 -60 120 120"><path d="M-46 -46 H-6 Q-10 -60 4 -60 Q18 -60 14 -46 H46 V-6 Q60 -10 60 4 Q60 18 46 14 H46 V46 H-46 Z" fill="#ffd21f" ${S}/><path d="M-46 0 H46 M0 -46 V46" stroke="${OL}" stroke-width="4"/></svg>`,
    colour: `<svg viewBox="-60 -60 120 120"><path d="M-30 44 L30 -36" stroke="${OL}" stroke-width="20" stroke-linecap="round"/><path d="M-30 44 L30 -36" stroke="#e53935" stroke-width="12" stroke-linecap="round"/><path d="M22 -26 L38 -48 L42 -30 Z" fill="#f4e3c3" ${S3}/>
      <circle cx="-30" cy="-26" r="14" fill="#1e5bd6" ${S3}/><circle cx="-4" cy="-44" r="10" fill="#ffd21f" ${S3}/><circle cx="34" cy="26" r="12" fill="#2e9e4f" ${S3}/></svg>`,
    build: `<svg viewBox="-60 -60 120 120"><rect x="-50" y="-20" width="74" height="40" rx="8" fill="#1e5bd6" ${S3}/><path d="M24 -20 H38 L50 0 V20 H24 Z" fill="#1e5bd6" ${S3}/><circle cx="-28" cy="24" r="12" fill="#30364a"/><circle cx="34" cy="24" r="12" fill="#30364a"/>
      <rect x="-30" y="-32" width="30" height="10" rx="4" fill="#596178"/><circle cx="-22" cy="-36" r="7" fill="#e53935" ${S3}/><circle cx="-8" cy="-36" r="7" fill="#1e5bd6" ${S3}/>
      <path d="M30 -54 L44 -40 M44 -54 L30 -40" stroke="#f07a1a" stroke-width="6" stroke-linecap="round"/></svg>`
  };
  A.addGame('jigsaw', '#ffb300', ICONS.jigsaw);
  A.addGame('colour', '#e86aa6', ICONS.colour);
  A.addGame('build', '#00897b', ICONS.build);

  // A finished scene for a vehicle: sky, ground (or sea), and the vehicle.
  const W = 600, H = 400;
  const picture = id => {
    const ground = SEA.includes(id) ? '#2f8fd8' : '#7cc46a';
    const vy = AIR.includes(id) ? 40 : 70;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <rect width="${W}" height="${H}" fill="#9fd6fa"/>
      <circle cx="520" cy="70" r="40" fill="#ffd21f"/>
      <path d="M60 80 Q55 60 80 60 Q90 42 115 52 Q135 46 140 66 Q160 66 156 82 Z" fill="#fff"/>
      <rect y="300" width="${W}" height="100" fill="${ground}"/>
      ${Kit.vehiclePic(id, `x="40" y="${vy}" width="520" height="300" preserveAspectRatio="xMidYMax meet"`)}
    </svg>`;
  };

  // A grid of vehicles to choose from.
  function chooser(lineId, onPick) {
    scene().innerHTML = `<div class="chooser">${ALL.map(id => `<button class="choose" data-v="${id}" aria-label="${A.vehicle(id).name}">${Kit.vehiclePic(id, 'preserveAspectRatio="xMidYMid meet"')}</button>`).join('')}</div>`;
    scene().querySelectorAll('.choose').forEach(b => b.onclick = () => { Sfx.pop(); onPick(b.dataset.v); });
    A.say(lineId);
  }

  // =====================================================================
  // Jigsaw: 4, 6 or 9 pieces, dragged (or tapped) into place
  // =====================================================================
  A.screens.jigsaw = (arg, alive) => {
    A.ui({ home: true });
    if (!arg) { chooser('jigsaw.pick', id => A.go('jigsaw', id)); return; }
    const id = arg, lvl = A.level('jigsaw');
    const [cols, rows] = [[2, 2], [3, 2], [3, 3]][lvl];
    const pic = picture(id);
    scene().innerHTML = `
      <div class="jigsaw">
        <div class="board" style="--cols:${cols};--rows:${rows}"><div class="ghost">${pic}</div>
          ${Array.from({ length: cols * rows }, (_, i) => `<div class="slot" data-i="${i}" style="left:${(i % cols) * 100 / cols}%;top:${Math.floor(i / cols) * 100 / rows}%"></div>`).join('')}</div>
        <div class="tray" style="--cols:${cols}">${shuffle(Array.from({ length: cols * rows }, (_, i) => i)).map(i => `
          <div class="piece" data-i="${i}" style="--cols:${cols};--rows:${rows};--c:${i % cols};--r:${Math.floor(i / cols)}"><div class="inner">${pic}</div></div>`).join('')}</div>
      </div>`;
    const root = scene().querySelector('.jigsaw'), board = root.querySelector('.board');
    let placed = 0, picked = null;

    const place = piece => {
      const i = +piece.dataset.i;
      piece.classList.remove('picked', 'dragging');
      piece.style.transform = '';
      piece.classList.add('placed');
      piece.style.left = `${(i % cols) * 100 / cols}%`; piece.style.top = `${Math.floor(i / cols) * 100 / rows}%`;
      board.appendChild(piece);
      board.querySelector(`.slot[data-i="${i}"]`).classList.add('filled');
      Sfx.pop(); placed++;
      if (placed === cols * rows) finish();
      else if (placed === 1) A.say('jigsaw.yes');
    };
    const slotAt = (x, y) => {
      const r = board.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return -1;
      return Math.floor((y - r.top) / r.height * rows) * cols + Math.floor((x - r.left) / r.width * cols);
    };

    root.querySelectorAll('.piece').forEach(piece => {
      let start = null, moved = false;
      piece.addEventListener('pointerdown', e => {
        if (piece.classList.contains('placed')) return;
        start = { x: e.clientX, y: e.clientY }; moved = false;
        piece.setPointerCapture(e.pointerId); piece.classList.add('dragging'); Sfx.tap();
      });
      piece.addEventListener('pointermove', e => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.hypot(dx, dy) > 8) moved = true;
        piece.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      const end = e => {
        if (!start) return;
        start = null; piece.classList.remove('dragging');
        if (moved) {
          const s = slotAt(e.clientX, e.clientY);
          if (s === +piece.dataset.i) { place(piece); return; }
          if (s >= 0) { Sfx.boing(); }
          piece.style.transition = 'transform .25s'; piece.style.transform = '';
          setTimeout(() => { piece.style.transition = ''; }, 260);
        } else {
          root.querySelectorAll('.piece').forEach(p => p.classList.remove('picked'));
          picked = piece; piece.classList.add('picked');
          piece.style.transform = '';
        }
      };
      piece.addEventListener('pointerup', end);
      piece.addEventListener('pointercancel', end);
    });
    // Tap a piece, then tap where it goes.
    board.addEventListener('click', e => {
      if (!picked) return;
      const s = slotAt(e.clientX, e.clientY);
      if (s === +picked.dataset.i) { place(picked); picked = null; }
      else { Sfx.boing(); }
    });

    async function finish() {
      root.classList.add('done');
      A.say('jigsaw.done', { name: A.vehicle(id).name });
      A.gameDone('jigsaw');
    }
    A.say('jigsaw.intro');
  };

  // =====================================================================
  // Colouring: tap-to-fill pages made from the vehicle drawings, saved to My Pictures
  // =====================================================================
  const PALETTE = ['#e53935', '#f07a1a', '#ffd21f', '#2e9e4f', '#5cc3ff', '#1e5bd6', '#8e5bd6', '#e86aa6', '#8a5a3c', '#ffffff', '#30364a'];
  const KEEP = ['none', 'transparent', OL.toLowerCase(), '#1b2233', '#30364a'];
  A.screens.colour = (arg, alive) => {
    A.ui({ home: true });
    if (!arg) { chooser('colour.pick', id => A.go('colour', id)); return; }
    const id = arg;
    scene().innerHTML = `
      <div class="colouring">
        <div class="page">${Kit.vehiclePic(id, 'preserveAspectRatio="xMidYMid meet" class="cpage"')}</div>
        <div class="palette">${PALETTE.map((c, i) => `<button class="pot${i === 0 ? ' on' : ''}" style="--pot:${c}" data-c="${c}" aria-label="Colour ${i + 1}"></button>`).join('')}
          <button class="big-btn done-btn" style="background:#2e9e4f" aria-label="Finished"><svg viewBox="0 0 64 64"><path d="M14 34 L27 46 L50 20" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      </div>`;
    const svg = scene().querySelector('.cpage');
    svg.querySelectorAll('[opacity="0"]').forEach(n => n.remove());
    // Turn every coloured shape white, ready to colour in. Outlines and dark details stay.
    svg.querySelectorAll('[fill]').forEach(n => {
      const f = n.getAttribute('fill').toLowerCase();
      if (KEEP.includes(f) || f.startsWith('url') || f.startsWith('rgba') || n.tagName === 'text') return;
      n.setAttribute('fill', '#fff'); n.classList.add('region');
    });
    svg.querySelectorAll('[stroke]').forEach(n => {
      const s = n.getAttribute('stroke').toLowerCase();
      if (!KEEP.includes(s) && s !== '#fff' && s !== '#ffffff') n.setAttribute('stroke', '#c7cfdb');
    });
    let colour = PALETTE[0];
    scene().querySelectorAll('.pot').forEach(p => p.onclick = () => {
      scene().querySelectorAll('.pot').forEach(q => q.classList.remove('on'));
      p.classList.add('on'); colour = p.dataset.c; Sfx.pop();
    });
    svg.addEventListener('click', e => {
      const r = e.target.closest('.region');
      if (!r) return;
      r.setAttribute('fill', colour); Sfx.tap();
    });
    let saved = false;
    scene().querySelector('.done-btn').onclick = () => {
      if (saved) return; saved = true;
      Sfx.tap();
      const copy = svg.cloneNode(true);
      copy.removeAttribute('class');
      const p = A.progress;
      p.gallery.unshift({ v: id, svg: copy.outerHTML });
      p.gallery = p.gallery.slice(0, 8);
      A.say('colour.saved');
      A.gameDone('colour');
    };
    A.say('colour.intro');
  };

  // =====================================================================
  // Build a Vehicle: pick a shape, colour, wheels, lights and something special, then drive it
  // =====================================================================
  const CHOICES = {
    body: ['car', 'van', 'truck'],
    colour: ['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f', '#f07a1a', '#ffffff'],
    wheels: ['small', 'big', 'chunky'],
    lights: ['blue', 'red', 'amber'],
    extra: ['ladder', 'cross', 'star', 'stripes']
  };
  const STEPS = ['body', 'colour', 'wheels', 'lights', 'extra'];
  const WHEEL_R = { small: 32, big: 44, chunky: 54 };

  function buildArt(o) {
    const r = WHEEL_R[o.wheels], lift = r - 32;
    const col = o.colour, trim = col === '#ffffff' ? '#e53935' : '#ffffff';
    const win = '#bfe6ff';
    let body = '', roofY = -160, wx = [110, 370], sideY = -100, sideX = [40, 320];
    if (o.body === 'car') {
      body = `<path d="M20 -40 V-100 Q20 -114 40 -116 L120 -120 L170 -172 H330 L388 -120 L440 -114 Q462 -110 462 -90 V-40 Z" fill="${col}" ${S}/>
        <path d="M184 -160 H250 V-122 H146 Z M264 -160 H322 L366 -122 H264 Z" fill="${win}" ${S3}/>`;
      roofY = -172; sideY = -92; sideX = [60, 400];
    } else if (o.body === 'van') {
      body = `<path d="M20 -40 V-196 Q20 -212 40 -212 H360 Q380 -212 392 -196 L452 -120 Q462 -110 462 -96 V-40 Z" fill="${col}" ${S}/>
        <path d="M370 -196 L436 -120 H370 Z" fill="${win}" ${S3}/><rect x="70" y="-180" width="110" height="50" rx="8" fill="${win}" ${S3}/>`;
      roofY = -212; sideY = -110; sideX = [40, 350];
    } else {
      body = `<rect x="20" y="-232" width="296" height="192" rx="12" fill="${col}" ${S}/>
        <path d="M330 -40 V-196 Q330 -206 340 -206 H398 Q410 -206 418 -196 L456 -130 Q462 -120 462 -108 V-40 Z" fill="${col}" ${S}/>
        <path d="M350 -190 H400 L438 -128 H350 Z" fill="${win}" ${S3}/>`;
      roofY = -232; sideY = -116; sideX = [30, 306]; wx = [100, 250, 390];
    }
    const lightCol = { blue: '#1e5bd6', red: '#e53935', amber: '#f59e0b' }[o.lights];
    const lightCls = o.lights === 'blue' ? 'beacon' : `beacon ${o.lights}`;
    const lights = o.lights ? `<g><rect x="${o.body === 'truck' ? 350 : 200}" y="${roofY - 16}" width="90" height="16" rx="6" fill="#596178" ${S3}/>
      <ellipse class="${lightCls}" cx="${o.body === 'truck' ? 372 : 222}" cy="${roofY - 22}" rx="18" ry="13" fill="${lightCol}" ${S3}/><ellipse class="${lightCls} b2" cx="${o.body === 'truck' ? 418 : 268}" cy="${roofY - 22}" rx="18" ry="13" fill="${lightCol}" ${S3}/></g>` : '';
    let extra = '';
    if (o.extra === 'ladder') {
      const lx0 = o.body === 'truck' ? 30 : 40, lx1 = o.body === 'truck' ? 300 : (o.body === 'car' ? 180 : 330);
      extra = `<g><rect x="${lx0}" y="${roofY - 22}" width="${lx1 - lx0}" height="20" rx="4" fill="#d8dee8" ${S3}/>${Array.from({ length: Math.floor((lx1 - lx0) / 26) }, (_, i) => `<path d="M${lx0 + 13 + i * 26} ${roofY - 22} V${roofY - 2}" stroke="${OL}" stroke-width="3"/>`).join('')}</g>`;
    } else if (o.extra === 'cross') {
      const cx = (sideX[0] + sideX[1]) / 2;
      extra = `<g transform="translate(${cx} ${sideY - 10})"><circle r="34" fill="#fff" ${S3}/><path d="M0 -20 V20 M-20 0 H20" stroke="#2e9e4f" stroke-width="12"/></g>`;
    } else if (o.extra === 'star') {
      const cx = (sideX[0] + sideX[1]) / 2;
      extra = `<g transform="translate(${cx} ${sideY - 10})"><path d="M0 -34 L10 -11 L34 -10 L15 6 L22 30 L0 16 L-22 30 L-15 6 L-34 -10 L-10 -11 Z" fill="#ffd21f" ${S3}/></g>`;
    } else if (o.extra === 'stripes') {
      const n = Math.floor((sideX[1] - sideX[0]) / 30);
      extra = `<g>${Array.from({ length: n }, (_, i) => `<rect x="${sideX[0] + i * 30}" y="${sideY + 20}" width="30" height="16" fill="${i % 2 ? trim : '#1e5bd6'}"/><rect x="${sideX[0] + i * 30}" y="${sideY + 36}" width="30" height="16" fill="${i % 2 ? '#1e5bd6' : trim}"/>`).join('')}
        <rect x="${sideX[0]}" y="${sideY + 20}" width="${n * 30}" height="32" fill="none" ${S3}/></g>`;
    }
    const wheels = wx.map(x => `<g><circle cx="${x}" cy="${-r}" r="${r}" fill="#30364a" ${S}/>${o.wheels === 'chunky' ? `<circle cx="${x}" cy="${-r}" r="${r - 6}" fill="none" stroke="#596178" stroke-width="5" stroke-dasharray="8 7"/>` : ''}
      <circle cx="${x}" cy="${-r}" r="${r * 0.48}" fill="#c7cfdb" ${S3}/><circle cx="${x}" cy="${-r}" r="5" fill="${OL}"/></g>`).join('');
    return `<g><ellipse cx="240" cy="2" rx="250" ry="12" fill="rgba(0,0,0,.18)"/>
      <g transform="translate(0 ${-lift})">${extra && o.extra === 'ladder' ? extra : ''}${lights}${body}${extra && o.extra !== 'ladder' ? extra : ''}
        <rect x="452" y="-84" width="14" height="22" rx="4" fill="#ffd27a" ${S3}/></g>${wheels}</g>`;
  }
  const buildSvg = (o, attrs = '') => `<svg viewBox="-20 -320 520 340" ${attrs}>${buildArt(o)}</svg>`;

  A.screens.build = (arg, alive) => {
    A.ui({ home: true });
    const o = { body: 'van', colour: '#e53935', wheels: 'small', lights: null, extra: null };
    let step = 0;
    scene().innerHTML = `
      <div class="build">
        <div class="garage"><div class="preview"></div></div>
        <div class="steps">${STEPS.map((s, i) => `<span class="dot" data-i="${i}"></span>`).join('')}</div>
        <div class="options"></div>
      </div>`;
    const preview = scene().querySelector('.preview'), options = scene().querySelector('.options');
    const draw = () => { preview.innerHTML = buildSvg(o, 'class="built"'); };

    function showStep() {
      scene().querySelectorAll('.dot').forEach((d, i) => { d.classList.toggle('on', i === step); d.classList.toggle('done', i < step); });
      if (step >= STEPS.length) {
        options.innerHTML = `<button class="big-btn go-btn" style="background:#2e9e4f" aria-label="Go!"><svg viewBox="0 0 64 64"><path d="M22 14 L52 32 L22 50 Z" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"/></svg></button>`;
        const go = options.querySelector('.go-btn');
        A.Hint.set([go], 'build.go', true);
        A.say('build.go');
        go.onclick = drive;
        return;
      }
      const key = STEPS[step];
      options.innerHTML = CHOICES[key].map(v => {
        const trial = { ...o, [key]: v };
        return `<button class="opt" data-v="${v}" aria-label="${v}">${key === 'colour' ? `<span class="swatch" style="background:${v}"></span>` : buildSvg(trial, 'preserveAspectRatio="xMidYMid meet"')}</button>`;
      }).join('');
      options.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        o[key] = b.dataset.v; Sfx.pop(); draw();
        step++;
        showStep();
      });
      A.say('build.' + key);
    }

    async function drive() {
      A.Hint.clear();
      options.innerHTML = '';
      const v = preview.querySelector('svg');
      v.classList.add('flashing');
      ({ blue: () => Sfx.yelp(2), red: () => Sfx.siren(2.4), amber: () => Sfx.wail(2) })[o.lights]();
      Sfx.engine(2.4);
      await A.tween(700, p => { v.style.transform = `translateX(${-p * 6}%)`; });
      await A.tween(1300, p => { v.style.transform = `translateX(${-6 + p * p * 160}%)`; }, t => t);
      if (!alive()) return;
      v.style.transition = 'none'; v.style.transform = 'translateX(-160%)';
      await A.tween(1200, p => { v.style.transform = `translateX(${-160 + 160 * (1 - Math.pow(1 - p, 3))}%)`; }, t => t);
      if (!alive()) return;
      A.say('build.done');
      A.gameDone('build');
    }
    draw();
    showStep();
  };
})();
