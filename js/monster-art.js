// Monster Maths artwork, drawn in the app's style (navy outline, flat colours). Each of the six monsters is made
// of one shape (circle, square, triangle, rectangle, star, hexagon) and has a number to count (eyes, horns, legs,
// points or sides). Monsters stand with their feet at about y = 58 in a 128 x 132 box centred on 0,0, so the same
// drawing works on a sticker, a game card, the ball run board (via MonsterArt.image) and the story pages.
// mood: 'smile' (default), 'open' (hungry), 'munch', 'burp' or 'sleep'.
(function () {
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const star = (r1, r2, n = 5, cy = 0, rot = -Math.PI / 2) => 'M' + Array.from({ length: n * 2 }, (_, i) => {
    const a = rot + i * Math.PI / n, r = i % 2 ? r2 : r1;
    return `${(Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(' L') + ' Z';
  const poly = (r, n, cy = 0, rot = 0) => 'M' + Array.from({ length: n }, (_, i) => {
    const a = rot + i * 2 * Math.PI / n;
    return `${(Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(' L') + ' Z';

  // The shapes, as body outlines (about 100 units across, centred a little above 0,0).
  const SHAPES = {
    circle:    { name: 'circle',    body: c => `<circle cy="-4" r="46" fill="${c}" ${S}/>` },
    square:    { name: 'square',    body: c => `<rect x="-44" y="-48" width="88" height="88" rx="8" fill="${c}" ${S}/>` },
    triangle:  { name: 'triangle',  body: c => `<path d="M0 -58 L54 40 L-54 40 Z" fill="${c}" ${S}/>` },
    rectangle: { name: 'rectangle', body: c => `<rect x="-32" y="-58" width="64" height="98" rx="8" fill="${c}" ${S}/>` },
    star:      { name: 'star',      body: c => `<path d="${star(60, 27, 5, -2)}" fill="${c}" ${S}/>` },
    hexagon:   { name: 'hexagon',   body: c => `<path d="${poly(50, 6, -6)}" fill="${c}" ${S}/>` },
    heart:     { name: 'heart',     body: c => `<path d="M0 40 C-40 10 -56 -10 -50 -30 C-44 -52 -12 -56 0 -32 C12 -56 44 -52 50 -30 C56 -10 40 10 0 40 Z" fill="${c}" ${S}/>` },
    oval:      { name: 'oval',      body: c => `<ellipse cy="-6" rx="36" ry="50" fill="${c}" ${S}/>` }
  };
  // A plain shape on its own (for shape cookies and choice buttons), about 70 units across, centred on 0,0.
  const shape = (id, c, sc = .7) => `<g transform="scale(${sc}) translate(0 ${id === 'triangle' ? 9 : id === 'square' ? 4 : id === 'rectangle' ? 9 : id === 'heart' ? 6 : 4})">${SHAPES[id].body(c)}</g>`;

  const eye = (x, y, r, sleep) => sleep
    ? `<path d="M${x - r} ${y} Q${x} ${y + r * .8} ${x + r} ${y}" fill="none" ${S3}/>`
    : `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S3}/><circle cx="${x + r * .15}" cy="${y + r * .1}" r="${r * .5}" fill="${OL}"/><circle cx="${x + r * .3}" cy="${y - r * .15}" r="${r * .18}" fill="#fff"/>`;
  const mouth = (y, w, mood) => {
    if (mood === 'open') return `<path d="M${-w} ${y - 4} Q0 ${y + w * 1.4} ${w} ${y - 4} Z" fill="${OL}"/><path d="M${-w * .5} ${y + w * .6} Q0 ${y + w * .25} ${w * .5} ${y + w * .6} Q0 ${y + w * 1.05} ${-w * .5} ${y + w * .6} Z" fill="#e8507a"/>
      <path d="M${-w * .6} ${y - 2} l5 8 l5 -8 M${w * .6 - 10} ${y - 2} l5 8 l5 -8" fill="#fff" ${SW(2)}/>`;
    if (mood === 'munch') return `<path d="M${-w * .8} ${y + 2} L${-w * .4} ${y - 4} L0 ${y + 2} L${w * .4} ${y - 4} L${w * .8} ${y + 2}" fill="none" ${SW(4)}/>`;
    if (mood === 'burp') return `<ellipse cy="${y + 4}" rx="${w * .45}" ry="${w * .55}" fill="${OL}"/>`;
    if (mood === 'sleep') return `<path d="M-6 ${y + 4} Q0 ${y + 8} 6 ${y + 4}" fill="none" ${S3}/>`;
    return `<path d="M${-w} ${y} Q0 ${y + w * 1.1} ${w} ${y}" fill="#fff" ${S3}/><path d="M${-w * .3} ${y + w * .28} V${y + w * .55} M${w * .3} ${y + w * .28} V${y + w * .55}" ${SW(2)}/>`;
  };
  const legs = (n, xs, c, y = 40) => (xs || Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * (n === 2 ? 30 : n === 3 ? 27 : 21))).map(x =>
    `<rect x="${x - 6}" y="${y - 4}" width="12" height="20" rx="4" fill="${c}" ${S3}/><ellipse cx="${x}" cy="${y + 17}" rx="${n > 3 ? 9.5 : 11}" ry="6" fill="${c}" ${S3}/>`).join('');
  const horn = (x, y, dir, c = '#fff6cc') => `<path d="M${x - 9} ${y} L${x + dir * 10} ${y - 26} L${x + 9} ${y} Z" fill="${c}" ${S3}/>`;
  const zzz = `<text x="34" y="-50" font-family="Fredoka, sans-serif" font-weight="700" font-size="20" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">z</text>
    <text x="48" y="-66" font-family="Fredoka, sans-serif" font-weight="700" font-size="15" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">z</text>`;

  // The six monsters of Monster Town.
  const MONSTERS = {
    gobble:  { name: 'Gobble',  shape: 'circle',    colour: '#5cc96b', count: 1, what: 'eye',
      draw: m => `${legs(2, null, '#4caf50')}${SHAPES.circle.body('#5cc96b')}
        <path d="M-20 -46 Q-26 -66 -16 -70 M20 -46 Q26 -66 16 -70" fill="none" ${SW(4)}/><circle cx="-16" cy="-72" r="6" fill="#ffd21f" ${S3}/><circle cx="16" cy="-72" r="6" fill="#ffd21f" ${S3}/>
        ${eye(0, -16, 17, m === 'sleep')}${mouth(14, 22, m)}` },
    zug:     { name: 'Zug',     shape: 'square',    colour: '#f07a1a', count: 2, what: 'horn',
      draw: m => `${legs(2, null, '#d8640f')}${horn(-26, -46, -1)}${horn(26, -46, 1)}${SHAPES.square.body('#f07a1a')}
        <path d="M-30 30 h12 M-6 30 h12 M18 30 h12" stroke="#d8640f" stroke-width="5" stroke-linecap="round"/>
        ${eye(-16, -18, 10, m === 'sleep')}${eye(16, -18, 10, m === 'sleep')}${mouth(6, 20, m)}` },
    trixie:  { name: 'Trixie',  shape: 'triangle',  colour: '#8e5bd6', count: 3, what: 'eye',
      draw: m => `${legs(2, null, '#7444b8')}${SHAPES.triangle.body('#8e5bd6')}
        ${eye(0, -22, 8, m === 'sleep')}${eye(-15, -2, 8, m === 'sleep')}${eye(15, -2, 8, m === 'sleep')}${mouth(18, 16, m)}` },
    boxy:    { name: 'Boxy',    shape: 'rectangle', colour: '#1e5bd6', count: 4, what: 'leg',
      draw: m => `${legs(4, [-27, -9, 9, 27], '#1749a8')}${SHAPES.rectangle.body('#1e5bd6')}
        <path d="M-10 -58 V-70" ${SW(4)}/><circle cy="-72" cx="-10" r="5" fill="#e53935" ${S3}/>
        ${eye(-13, -34, 9, m === 'sleep')}${eye(13, -34, 9, m === 'sleep')}${mouth(-8, 18, m)}
        <circle cx="-14" cy="22" r="5" fill="#5cc3ff"/><circle cx="14" cy="22" r="5" fill="#5cc3ff"/>` },
    twinkle: { name: 'Twinkle', shape: 'star',      colour: '#ffd21f', count: 5, what: 'point',
      draw: m => `${legs(2, [-18, 18], '#e0a800', 38)}${SHAPES.star.body('#ffd21f')}
        ${eye(-10, -8, 7, m === 'sleep')}${eye(10, -8, 7, m === 'sleep')}${mouth(8, 11, m)}
        <circle cx="-20" cy="6" r="4" fill="#ff8fa3" opacity=".6"/><circle cx="20" cy="6" r="4" fill="#ff8fa3" opacity=".6"/>` },
    hexie:   { name: 'Hexie',   shape: 'hexagon',   colour: '#00a6a6', count: 6, what: 'side',
      draw: m => `${legs(2, null, '#008080')}${SHAPES.hexagon.body('#00a6a6')}
        <path d="M-14 -50 L-20 -66 L-6 -54 M14 -50 L20 -66 L6 -54" fill="#00a6a6" ${S3}/>
        ${eye(-15, -16, 10, m === 'sleep')}${eye(15, -16, 10, m === 'sleep')}${mouth(8, 18, m)}` }
  };
  const IDS = Object.keys(MONSTERS);

  const svg = (inner, box = '-66 -80 132 150', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const monster = (id, mood = 'smile') => MONSTERS[id].draw(mood) + (mood === 'sleep' ? zzz : '');
  const monsterSvg = (id, mood) => svg(monster(id, mood));

  // A drawing as an image, for the canvas (ball run board). Ready when loaded; draw() skips it until then.
  const cache = {};
  const image = (inner, box) => {
    const key = box + inner;
    if (!cache[key]) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${inner}</svg>`);
      cache[key] = img;
    }
    return cache[key];
  };
  const monsterImage = (id, mood) => image(monster(id, mood), '-66 -80 132 150');

  // Number colours (the same for a number everywhere: balls, cookies, signs).
  const NUM_COLOURS = ['#9aa3b5', '#e53935', '#1e5bd6', '#2e9e4f', '#f07a1a', '#8e5bd6', '#00a6a6', '#e86aa6', '#8a5a3c', '#ffb300', '#5a606b'];
  const numColour = n => NUM_COLOURS[n % NUM_COLOURS.length];
  // A big friendly numeral, centred on 0,0 (about 80 tall).
  const numeral = (n, colour = numColour(+String(n).slice(-1) || 0), size = 88) => `<text y="${size * .34}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}"
    fill="${colour}" stroke="${OL}" stroke-width="${size / 14}" paint-order="stroke" stroke-linejoin="round">${n}</text>`;
  // Dots for a number, in the dice-like patterns children learn to see at a glance (up to 10).
  const DOTS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  const dots = (n, r = 7, gap = 18, colour = '#fff') => {
    if (n <= 6) return (DOTS[n] || []).map(([x, y]) => `<circle cx="${x * gap}" cy="${y * gap}" r="${r}" fill="${colour}" ${S3}/>`).join('');
    // 7 to 10: two rows of five, like a ten frame.
    return Array.from({ length: n }, (_, i) => `<circle cx="${(i % 5 - 2) * gap}" cy="${(Math.floor(i / 5) - .5) * gap * 1.1}" r="${r}" fill="${colour}" ${S3}/>`).join('');
  };
  // A cookie (centred on 0,0, about 60 across).
  const cookie = (chips = 4) => `<circle r="28" fill="#d9a066" ${S3}/><circle r="22" fill="#e7b57d"/>
    ${[[-10, -8], [8, -12], [12, 6], [-6, 10], [0, -2], [-14, 4]].slice(0, chips).map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="3.4" fill="#5a3a22"/>`).join('')}`;
  const cookieSvg = () => svg(cookie(), '-32 -32 64 64');

  // A round sticker for a monster.
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? '#e6dbff' : '#d3d9e3'}"/>
      <defs><clipPath id="ms-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#ms-${id})" opacity="${earned ? 1 : 0.3}"><g transform="translate(0 10) scale(.56)">${earned ? monster(id) : `<g style="filter:grayscale(1) brightness(.7)">${monster(id)}</g>`}</g></g>
    </svg>`;

  // ---------- Monster Town scenery ----------
  // A house made of shapes: a square with a triangle roof and a rectangle door (base centre at x,y).
  const house = (x, y, s, wall, roof) => `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-60" y="-110" width="120" height="110" fill="${wall}" ${S}/><path d="M-76 -106 L0 -176 L76 -106 Z" fill="${roof}" ${S}/>
    <rect x="-18" y="-62" width="36" height="62" rx="4" fill="#8a5a3c" ${S3}/><circle cx="10" cy="-30" r="4" fill="#ffd21f"/>
    <circle cx="-38" cy="-78" r="14" fill="#bfe6ff" ${S3}/><rect x="24" y="-92" width="26" height="26" fill="#bfe6ff" ${S3}/><circle cy="-132" r="11" fill="#fff6cc" ${S3}/></g>`;
  const hills = `<path d="M0 520 Q250 400 520 470 T1000 450 T1600 470 V900 H0 Z" fill="#b39ddb"/><path d="M0 610 Q400 560 800 600 T1600 590 V900 H0 Z" fill="#9fd88d"/>`;
  const lolly = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-90" stroke="${OL}" stroke-width="9"/><path d="M0 0 V-90" stroke="#fff" stroke-width="4"/>
    <circle cy="-110" r="30" fill="${c}" ${S}/><path d="M-16 -116 Q0 -136 16 -116 Q0 -96 -8 -110" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;

  // A calculator, for the Monster Train.
  const calculator = `<rect x="-38" y="-52" width="76" height="104" rx="10" fill="#5a606b" ${S}/><rect x="-28" y="-42" width="56" height="24" rx="4" fill="#bff0c8" ${S3}/>
    <text x="22" y="-23" text-anchor="end" font-family="Fredoka, sans-serif" font-weight="700" font-size="18" fill="${OL}">123</text>
    ${[0, 1, 2, 3].map(r => [0, 1, 2].map(k => `<rect x="${-26 + k * 19}" y="${-10 + r * 15}" width="14" height="11" rx="3" fill="${k === 2 && r > 1 ? '#f07a1a' : '#e7ebf2'}" ${SW(2)}/>`).join('')).join('')}`;


  // ---------- Monster Shapes: a monster built from the child's choices ----------
  // c: { body: shape id, eyes: 1-3, horns: 'triangle' | 'circle' | 'none', mouth: 'smile' | 'rect' | 'zigzag', legs: 2-4, colour }
  const FACE = {
    circle:    { y: -16, d: 16, r: [15, 10, 8.5], top: -44, hx: 22, my: 14, mw: 22, ly: 40 },
    square:    { y: -18, d: 16, r: [15, 10, 8.5], top: -46, hx: 26, my: 12, mw: 22, ly: 38 },
    triangle:  { y: -4,  d: 10, r: [11, 8, 7],    top: -36, hx: 10, my: 20, mw: 14, ly: 38 },
    rectangle: { y: -32, d: 13, r: [12, 9, 7],    top: -56, hx: 18, my: -4, mw: 18, ly: 38 },
    star:      { y: -8,  d: 10, r: [9, 6.5, 5.5], top: -50, hx: 8,  my: 10, mw: 10, ly: 34 },
    hexagon:   { y: -18, d: 16, r: [14, 10, 8.5], top: -48, hx: 16, my: 10, mw: 18, ly: 36 }
  };
  const buildMouth = (kind, y, w) => {
    if (kind === 'rect') return `<rect x="${-w}" y="${y - 4}" width="${2 * w}" height="${w * .9}" rx="3" fill="${OL}"/>
      ${(k => Array.from({ length: k }, (_, i) => `<rect x="${-w + 2 + i * (2 * w - 4) / k}" y="${y - 4}" width="${(2 * w - 4) / k - 2}" height="${w * .3}" fill="#fff"/>`).join(''))(Math.max(2, Math.round(w / 6)))}`;
    if (kind === 'zigzag') {
      const n = 4, step = 2 * w / n;
      return `<path d="M${-w} ${y - 4} H${w} Q${w} ${y + w * .9} 0 ${y + w * .9} Q${-w} ${y + w * .9} ${-w} ${y - 4} Z" fill="${OL}"/>
        <path d="M${-w} ${y - 4} ${Array.from({ length: n }, (_, i) => `L${-w + step * (i + .5)} ${y + w * .35} L${-w + step * (i + 1)} ${y - 4}`).join(' ')} Z" fill="#fff" stroke="${OL}" stroke-width="1.5"/>`;
    }
    return `<path d="M${-w} ${y - 2} A${w} ${w} 0 0 0 ${w} ${y - 2} Z" fill="${OL}"/><path d="M${-w * .45} ${y + w * .62} Q0 ${y + w * .2} ${w * .45} ${y + w * .62} Q0 ${y + w * .98} ${-w * .45} ${y + w * .62} Z" fill="#e8507a"/>`;
  };
  const build = c => {
    const f = FACE[c.body || 'circle'], col = c.colour || '#5cc96b', n = c.eyes || 0;
    const ex = n === 1 ? [[0, f.y]] : n === 2 ? [[-f.d, f.y], [f.d, f.y]] : n === 3 ? [[-f.d * 1.3, f.y + 4], [0, f.y - 8], [f.d * 1.3, f.y + 4]] : [];
    const horns = c.horns === 'triangle' ? horn(-f.hx, f.top, -1) + horn(f.hx, f.top, 1)
      : c.horns === 'circle' ? [-1, 1].map(s => `<path d="M${s * f.hx} ${f.top + 6} Q${s * (f.hx + 4)} ${f.top - 14} ${s * (f.hx + 10)} ${f.top - 22}" fill="none" ${SW(4)}/><circle cx="${s * (f.hx + 10)}" cy="${f.top - 24}" r="7" fill="#ffd21f" ${S3}/>`).join('') : '';
    return `${c.legs ? legs(c.legs, null, col, f.ly) : ''}${horns}${SHAPES[c.body || 'circle'].body(col)}
      ${ex.map(([x, y]) => eye(x, y, f.r[n - 1])).join('')}${c.mouth ? buildMouth(c.mouth, f.my, f.mw) : ''}`;
  };

  window.MonsterArt = { build, buildMouth, eye, legs, horn, MONSTERS, IDS, SHAPES, shape, monster, monsterSvg, monsterImage, image, svg, numeral, numColour, dots, cookie, cookieSvg, sticker, house, hills, lolly, calculator, star, poly };
})();
