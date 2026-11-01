// Toy Shop artwork, drawn in the app's style (navy outline, flat colours). Each toy and coin is drawn centred on 0,0
// in about a 120 x 120 box, so the same drawing works on a shelf, a sticker, a game card, the ball run board (via
// ToyArt.image) and the story pages. Big things (the counter, Sam, the piggy bank) stand with their base at 0,0.
(function () {
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r) => eye(-dx, y, r) + eye(dx, y, r);
  const smile = (y, w = 8) => `<path d="M${-w} ${y} Q0 ${y + w * .9} ${w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const shine = (x, y, rx = 6, ry = 10, r = -20) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#fff" opacity=".55"/>`;
  const poly = (n, r, rot = -90) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' L');

  // ---------- Coins (UK): copper 1p and 2p, silver 5p, 10p and 20p, gold £1. Also the balls in Coin Run. ----------
  const COIN = {
    1:   { r: 36, fill: '#d9883e', rim: '#b5651d', label: '1p' },
    2:   { r: 46, fill: '#d9883e', rim: '#b5651d', label: '2p' },
    5:   { r: 32, fill: '#dfe4ec', rim: '#9aa3b5', label: '5p' },
    10:  { r: 44, fill: '#dfe4ec', rim: '#9aa3b5', label: '10p' },
    20:  { r: 39, fill: '#dfe4ec', rim: '#9aa3b5', label: '20p', sides: 7 },
    100: { r: 42, fill: '#f2c200', rim: '#c99a00', label: '£1', sides: 12 }
  };
  const COIN_VALUES = [1, 2, 5, 10, 20, 100];
  // r: drawn radius (true sizes by default, so a 2p coin is bigger than a 1p).
  const coin = (v, r = COIN[v].r) => {
    const c = COIN[v], k = r / 44;
    const edge = c.sides ? `<path d="M${poly(c.sides, r)} Z" fill="${c.fill}" ${S}/><path d="M${poly(c.sides, r * .8)} Z" fill="none" stroke="${c.rim}" stroke-width="${3 * k + 1}"/>`
      : `<circle r="${r}" fill="${c.fill}" ${S}/><circle r="${r * .8}" fill="none" stroke="${c.rim}" stroke-width="${3 * k + 1}"/>`;
    return `<g>${edge}${shine(-r * .45, -r * .45, r * .14, r * .24, -40)}${txt(0, r * .26, (c.label.length > 2 ? 30 : 36) * k, c.rim, c.label)}</g>`;
  };
  const COIN_NAMES = { 1: 'a 1p coin', 2: 'a 2p coin', 5: 'a 5p coin', 10: 'a 10p coin', 20: 'a 20p coin', 100: 'a pound coin' };

  // ---------- Toys ----------
  const teddy = (fur = '#c98b4a', bow = '#e53935', light = '#f2cf9b') => `<g>
    <circle cx="-28" cy="-48" r="13" fill="${fur}" ${S3}/><circle cx="28" cy="-48" r="13" fill="${fur}" ${S3}/><circle cx="-28" cy="-48" r="6" fill="${light}"/><circle cx="28" cy="-48" r="6" fill="${light}"/>
    <ellipse cx="-36" cy="18" rx="12" ry="20" transform="rotate(25 -36 18)" fill="${fur}" ${S3}/><ellipse cx="36" cy="18" rx="12" ry="20" transform="rotate(-25 36 18)" fill="${fur}" ${S3}/>
    <ellipse cy="24" rx="32" ry="32" fill="${fur}" ${S}/><ellipse cy="28" rx="18" ry="18" fill="${light}"/>
    <ellipse cx="-20" cy="52" rx="15" ry="10" fill="${fur}" ${S3}/><ellipse cx="20" cy="52" rx="15" ry="10" fill="${fur}" ${S3}/>
    <circle cy="-26" r="30" fill="${fur}" ${S}/><ellipse cy="-14" rx="14" ry="11" fill="${light}" ${S3}/><ellipse cy="-19" rx="6" ry="4.5" fill="${OL}"/>
    <path d="M-5 -9 Q0 -5 5 -9" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>${eyes(11, -32, 3.6)}
    <path d="M0 4 L-20 -6 L-20 14 Z M0 4 L20 -6 L20 14 Z" fill="${bow}" ${S3}/><circle cy="4" r="5" fill="${bow}" ${S3}/></g>`;
  const robot = (lit = false) => `<g>
    <path d="M0 -44 V-56" ${SW(5)}/><circle cy="-58" r="6" fill="${lit ? '#ffd21f' : '#e53935'}" ${S3}/>
    <rect x="-48" y="-2" width="14" height="30" rx="6" fill="#9aa3b5" ${S3}/><rect x="34" y="-2" width="14" height="30" rx="6" fill="#9aa3b5" ${S3}/>
    <rect x="-22" y="34" width="16" height="22" rx="3" fill="#9aa3b5" ${S3}/><rect x="6" y="34" width="16" height="22" rx="3" fill="#9aa3b5" ${S3}/>
    <rect x="-32" y="-8" width="64" height="46" rx="8" fill="#1e5bd6" ${S}/>
    ${[['#e53935', -14], ['#ffd21f', 0], ['#2e9e4f', 14]].map(([c, x]) => `<circle cx="${x}" cy="14" r="5" fill="${lit ? c : '#5a7bd6'}" ${S3}/>`).join('')}
    <rect x="-28" y="-46" width="56" height="38" rx="9" fill="#c3cad6" ${S}/>
    <circle cx="-11" cy="-30" r="7" fill="${lit ? '#ffd21f' : '#5cc3ff'}" ${S3}/><circle cx="11" cy="-30" r="7" fill="${lit ? '#ffd21f' : '#5cc3ff'}" ${S3}/>
    <rect x="-12" y="-19" width="24" height="5" rx="2" fill="${OL}"/></g>`;
  const puzzle = `<g transform="rotate(-8)"><path d="M-36 -36 H-12 a12 12 0 1 1 24 0 H36 V-12 a12 12 0 1 1 0 24 V36 H12 a12 12 0 1 0 -24 0 H-36 V12 a12 12 0 1 0 0 -24 Z" fill="#8e5bd6" ${S}/>
    <circle cx="-14" cy="-12" r="7" fill="#ffd21f"/><path d="M4 8 l10 -10 l10 10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
  const rocket = `<g transform="rotate(20)">
    <path d="M-10 34 Q0 62 10 34 Z" fill="#ffd21f" ${S3}/><path d="M-5 34 Q0 50 5 34 Z" fill="#f07a1a"/>
    <path d="M-20 4 L-38 34 L-18 28 Z M20 4 L38 34 L18 28 Z" fill="#e53935" ${S3}/>
    <path d="M0 -56 Q26 -30 20 32 H-20 Q-26 -30 0 -56 Z" fill="#fff" ${S}/><path d="M-12 -40 Q0 -54 12 -40" fill="#e53935" ${S3}/>
    <circle cy="-10" r="11" fill="#5cc3ff" ${S3}/><path d="M-4 -14 a5 5 0 0 1 6 -2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`;
  const balloon = (c = '#e53935') => `<g><path d="M0 26 Q-12 42 4 52 Q14 60 2 68" fill="none" stroke="${OL}" stroke-width="3"/>
    <ellipse cy="-14" rx="32" ry="40" fill="${c}" ${S}/><path d="M-6 26 L0 20 L6 26 Z" fill="${c}" ${S3}/>${shine(-14, -32, 6, 12, 20)}</g>`;
  const bicycle = `<g>
    ${[-36, 36].map(x => `<circle cx="${x}" cy="20" r="24" fill="none" stroke="${OL}" stroke-width="8"/><circle cx="${x}" cy="20" r="24" fill="none" stroke="#5a606b" stroke-width="3"/>
      <path d="M${x - 17} 3 L${x + 17} 37 M${x + 17} 3 L${x - 17} 37 M${x} -4 V44 M${x - 24} 20 H${x + 24}" stroke="#c3cad6" stroke-width="2"/><circle cx="${x}" cy="20" r="4" fill="${OL}"/>`).join('')}
    <path d="M-36 20 L-8 -12 H22 L36 20 M-8 -12 L0 20 L22 -12 M0 20 H-36" fill="none" stroke="${OL}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M-36 20 L-8 -12 H22 L36 20 M-8 -12 L0 20 L22 -12 M0 20 H-36" fill="none" stroke="#e53935" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M-12 -12 L-16 -24" ${SW(5)}/><path d="M-30 -28 H-4" stroke="${OL}" stroke-width="9" stroke-linecap="round"/>
    <path d="M22 -12 L18 -32 M10 -34 H28" ${SW(5)}/><circle cx="30" cy="-30" r="5" fill="#ffd21f" ${S3}/></g>`;
  const dinosaur = `<g>
    ${[[-24, -22], [-8, -30], [8, -28]].map(([x, y]) => `<path d="M${x - 9} ${y + 12} L${x} ${y - 4} L${x + 9} ${y + 12} Z" fill="#f07a1a" ${S3}/>`).join('')}
    <path d="M-30 14 Q-50 18 -62 34 Q-40 34 -24 28 Z" fill="#5cb85c" ${S3}/>
    <rect x="-26" y="22" width="14" height="22" rx="5" fill="#5cb85c" ${S3}/><rect x="10" y="22" width="14" height="22" rx="5" fill="#5cb85c" ${S3}/>
    <ellipse cy="10" rx="38" ry="24" fill="#5cb85c" ${S}/><ellipse cy="18" rx="22" ry="11" fill="#b9e6a5"/>
    <path d="M24 0 Q34 -16 36 -30" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M24 0 Q34 -16 36 -30" fill="none" stroke="#5cb85c" stroke-width="15" stroke-linecap="round"/>
    <ellipse cx="44" cy="-36" rx="18" ry="13" fill="#5cb85c" ${S3}/>${eye(44, -40, 3.4)}<path d="M50 -30 Q56 -30 60 -34" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/></g>`;
  const aeroplane = `<g transform="rotate(-12)">
    <path d="M-6 -4 L-24 -44 H-10 L22 -4 Z" fill="#ffd21f" ${S3}/>
    <path d="M-50 -2 L-62 -28 H-50 L-36 -6 Z" fill="#e53935" ${S3}/>
    <path d="M-56 0 Q-56 -14 -36 -14 H40 Q60 -14 62 0 Q60 14 40 14 H-36 Q-56 14 -56 0 Z" fill="#1e5bd6" ${S}/>
    ${[-20, -4, 12, 28].map(x => `<circle cx="${x}" cy="-3" r="4.5" fill="#bfe6ff" ${S3}/>`).join('')}<path d="M44 -12 Q58 -10 60 -2 H46 Z" fill="#bfe6ff" ${S3}/>
    <path d="M-6 6 L-26 40 H-12 L22 6 Z" fill="#ffd21f" ${S3}/></g>`;
  const pig = (scale = 1) => `<g transform="scale(${scale})">
    <path d="M-48 2 Q-62 -2 -60 -14 Q-58 -22 -52 -16" fill="none" ${SW(4)}/>
    ${[-30, -12, 14, 32].map(x => `<rect x="${x - 7}" y="28" width="14" height="18" rx="4" fill="#f57fa8" ${S3}/>`).join('')}
    <ellipse cy="6" rx="50" ry="36" fill="#ff9fc0" ${S}/><path d="M18 -26 L26 -46 L36 -22 Z" fill="#f57fa8" ${S3}/><path d="M-4 -30 L0 -50 L12 -30 Z" fill="#f57fa8" ${S3}/>
    <rect x="-16" y="-34" width="28" height="7" rx="3" fill="${OL}"/>
    <ellipse cx="48" cy="8" rx="11" ry="14" fill="#f57fa8" ${S3}/><ellipse cx="45" cy="4" rx="2.4" ry="3.4" fill="${OL}"/><ellipse cx="51" cy="12" rx="2.4" ry="3.4" fill="${OL}"/>
    ${eye(28, -6, 4.2)}<circle cx="30" cy="12" r="5" fill="#ff6f9c" opacity=".5"/>${shine(-24, -14, 8, 14, -50)}</g>`;
  const piggybank = pig();
  // The jack-in-the-box: the box (base at 46) and, once it pops, a clown on a spring.
  const jack = (open = false) => `<g>
    ${open ? `<path d="M-36 -18 L-62 -54 L-54 -62 L-28 -24 Z" fill="#1e5bd6" ${S3}/>
      <path d="M0 -18 l-14 -8 l28 -8 l-28 -8 l28 -8 l-14 -6" fill="none" ${SW(5)}/>
      <circle cy="-70" r="20" fill="#fde3c8" ${S}/><circle cy="-66" r="6" fill="#e53935" ${S3}/>${eyes(8, -76, 3)}<path d="M-8 -60 Q0 -54 8 -60" fill="none" ${S3}/>
      <path d="M-18 -84 L0 -112 L18 -84 Z" fill="#ffd21f" ${S3}/><circle cy="-114" r="5" fill="#e53935" ${S3}/>
      <path d="M-22 -54 Q0 -44 22 -54 Q14 -44 0 -42 Q-14 -44 -22 -54 Z" fill="#2e9e4f" ${S3}/>`
    : `<rect x="-40" y="-26" width="80" height="12" rx="3" fill="#1e5bd6" ${S3}/>`}
    <rect x="-36" y="-18" width="72" height="64" rx="4" fill="#e53935" ${S}/>
    <path d="M0 -10 L14 14 L0 38 L-14 14 Z" fill="#ffd21f" ${S3}/><circle cx="-24" cy="2" r="5" fill="#fff"/><circle cx="24" cy="30" r="5" fill="#fff"/>
    <path d="M36 12 H48 V0" fill="none" ${SW(5)}/><circle cx="48" cy="-2" r="5" fill="#ffd21f" ${S3}/></g>`;
  const ballerina = `<g>
    <path d="M-8 30 L-14 58 M8 30 L22 52" ${SW(6)}/><path d="M-8 30 L-14 58 M8 30 L22 52" stroke="#fde3c8" stroke-width="3" stroke-linecap="round"/>
    <ellipse cy="22" rx="38" ry="11" fill="#ff9fc0" ${S}/><path d="M-30 22 Q0 34 30 22" fill="none" stroke="#fff" stroke-width="3"/>
    <path d="M-12 22 L-8 -14 H8 L12 22 Z" fill="#ff6f9c" ${S3}/>
    <path d="M-8 -10 Q-30 -26 -18 -48 M8 -10 Q30 -26 18 -48" fill="none" ${SW(6)}/><path d="M-8 -10 Q-30 -26 -18 -48 M8 -10 Q30 -26 18 -48" fill="none" stroke="#fde3c8" stroke-width="3" stroke-linecap="round"/>
    <circle cy="-28" r="13" fill="#fde3c8" ${S3}/><circle cy="-44" r="7" fill="#8b5a2b" ${S3}/><path d="M-13 -30 Q-12 -42 0 -42 Q12 -42 13 -30 Q6 -38 0 -38 Q-6 -38 -13 -30 Z" fill="#8b5a2b"/>
    ${eyes(5, -28, 1.8)}<path d="M-3 -22 Q0 -20 3 -22" fill="none" stroke="${OL}" stroke-width="2" stroke-linecap="round"/></g>`;
  const ball = `<g transform="rotate(-20)"><circle r="42" fill="#fff" ${S}/>
    <path d="M0 -42 Q-28 0 0 42 Q-42 30 -42 0 Q-42 -30 0 -42 Z" fill="#e53935"/><path d="M0 -42 Q28 0 0 42 Q42 30 42 0 Q42 -30 0 -42 Z" fill="#1e5bd6"/>
    <path d="M0 -42 Q-10 0 0 42 Q10 0 0 -42 Z" fill="#ffd21f"/><circle r="42" fill="none" ${S}/><circle cx="-16" cy="-20" r="6" fill="#fff" opacity=".7"/></g>`;
  const kite = `<g><path d="M8 34 Q-6 46 6 56 Q16 64 2 72" fill="none" stroke="${OL}" stroke-width="3"/>
    ${[[0, 48, '#e53935'], [6, 62, '#ffd21f']].map(([x, y, c]) => `<path d="M${x - 8} ${y - 5} L${x + 8} ${y + 5} M${x + 8} ${y - 5} L${x - 8} ${y + 5}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`).join('')}
    <path d="M0 -54 L36 -8 L0 36 L-36 -8 Z" fill="#00a6a6" ${S}/><path d="M0 -54 L36 -8 L0 -8 Z M0 36 L-36 -8 L0 -8 Z" fill="#ffd21f"/>
    <path d="M0 -54 V36 M-36 -8 H36" ${SW(4)}/><path d="M0 -54 L36 -8 L0 36 L-36 -8 Z" fill="none" ${S}/></g>`;
  const yoyo = `<g><path d="M0 0 Q14 -30 6 -60" fill="none" stroke="${OL}" stroke-width="3"/><circle r="36" fill="#8e5bd6" ${S}/><circle r="24" fill="#b48cf0" ${S3}/><circle r="8" fill="#ffd21f" ${S3}/>
    ${shine(-16, -16, 5, 9, -45)}</g>`;
  const car = `<g>
    <path d="M-52 14 V-6 Q-52 -14 -42 -16 L-26 -18 L-12 -40 H22 L38 -18 Q54 -16 54 -4 V14 Z" fill="#f07a1a" ${S}/>
    <path d="M-20 -18 L-8 -34 H2 V-18 Z M10 -18 V-34 H18 L30 -18 Z" fill="#bfe6ff" ${S3}/>
    <circle cx="-30" cy="16" r="14" fill="#30364a" ${S3}/><circle cx="-30" cy="16" r="5" fill="#c3cad6"/><circle cx="32" cy="16" r="14" fill="#30364a" ${S3}/><circle cx="32" cy="16" r="5" fill="#c3cad6"/>
    <circle cx="48" cy="-6" r="4" fill="#ffd21f"/></g>`;
  const drum = `<g><path d="M-30 -40 L18 -60 M30 -40 L-8 -62" ${SW(5)}/><circle cx="18" cy="-60" r="6" fill="#ffd21f" ${S3}/><circle cx="-8" cy="-62" r="6" fill="#ffd21f" ${S3}/>
    <path d="M-44 -20 V30 Q0 50 44 30 V-20 Z" fill="#e53935" ${S}/><path d="M-44 -6 L-22 34 L0 -6 L22 34 L44 -6" fill="none" stroke="#ffd21f" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cy="-20" rx="44" ry="14" fill="#fff6e0" ${S}/></g>`;
  const money = `<g>${[[-26, 30, 2], [-26, 20, 2], [-26, 10, 2]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1 .45)">${coin(2, 30)}</g>`).join('')}
    <g transform="translate(20 6)">${coin(10, 34)}</g><g transform="translate(-10 -28) rotate(-10)">${coin(100, 26)}</g></g>`;

  const ITEMS = { teddy: teddy(), robot: robot(), puzzle, rocket, balloon: balloon(), bicycle, dinosaur, aeroplane, piggybank, jack: jack(true), ballerina,
    ball, kite, yoyo, car, drum, money };
  // What each toy is called, for the voice and labels.
  const NAMES = {
    teddy: 'a teddy', robot: 'a robot', puzzle: 'a jigsaw puzzle', rocket: 'a rocket', balloon: 'a balloon', bicycle: 'a bicycle', dinosaur: 'a dinosaur',
    aeroplane: 'an aeroplane', piggybank: 'a piggy bank', jack: 'a jack-in-the-box', ballerina: 'a ballerina', ball: 'a ball', kite: 'a kite', yoyo: 'a yo-yo',
    car: 'a toy car', drum: 'a drum', money: 'money'
  };

  // ---------- Clothes for the teddies (Just the Right Size): each about 110 wide at full size ----------
  const CLOTHES = {
    hat: `<g><path d="M-40 10 Q-40 -40 0 -40 Q40 -40 40 10 Z" fill="#e53935" ${S}/><circle cy="-44" r="12" fill="#fff" ${S3}/>
      <rect x="-46" y="4" width="92" height="20" rx="8" fill="#ffd21f" ${S}/><path d="M-30 -14 H30 M-36 -2 H36" stroke="#fff" stroke-width="4" opacity=".6"/></g>`,
    boots: `<g>${[-26, 26].map(x => `<g transform="translate(${x} 0)"><path d="M-14 -36 H12 V14 H22 Q30 14 30 26 V32 H-14 Z" fill="#2e9e4f" ${S}/><path d="M-14 22 H30" stroke="#1f7a3a" stroke-width="4"/>
      <rect x="-17" y="-42" width="32" height="10" rx="4" fill="#5cb85c" ${S3}/></g>`).join('')}</g>`,
    scarf: `<g><path d="M-44 -18 Q0 6 44 -18 L44 -2 Q0 22 -44 -2 Z" fill="#1e5bd6" ${S}/><path d="M20 -6 L32 40 L14 42 L6 0 Z" fill="#1e5bd6" ${S}/>
      <path d="M-30 -8 V6 M-12 -2 V12 M8 -2 V12 M26 -10 V4 M16 22 L26 20 M18 32 L28 30" stroke="#ffd21f" stroke-width="5" stroke-linecap="round"/>
      <path d="M16 42 v8 M22 42 v8 M28 41 v8" ${SW(3)}/></g>`,
    jumper: `<g><path d="M-26 -38 Q0 -28 26 -38 L50 -20 L40 4 L30 -2 V40 H-30 V-2 L-40 4 L-50 -20 Z" fill="#8e5bd6" ${S}/>
      <path d="M-12 -34 Q0 -24 12 -34" fill="none" ${S3}/><path d="M-30 30 H30" stroke="#b48cf0" stroke-width="5"/>
      <path d="M0 -6 l5 9 h10 l-8 6 l3 10 l-10 -6 l-10 6 l3 -10 l-8 -6 h10 Z" fill="#ffd21f" ${S3}/></g>`
  };
  const SIZES = { small: .55, middle: .78, big: 1 };
  const TEDDY_BOW = { small: '#ff6f9c', middle: '#1e5bd6', big: '#2e9e4f' };
  // A teddy standing with its feet at 0,0 (for the size bins), 120 tall at full size.
  const sizeTeddy = size => `<g transform="scale(${SIZES[size]}) translate(0 -62)">${teddy('#c98b4a', TEDDY_BOW[size])}</g>`;

  // ---------- Big things ----------
  // Pip's purse, centred, about 120 wide.
  const purse = (coins = true) => `<g>
    <path d="M-34 -30 Q-34 -58 -8 -54 M34 -30 Q34 -58 8 -54" fill="none" ${SW(5)}/><circle cx="-7" cy="-56" r="7" fill="#ffd21f" ${S3}/><circle cx="7" cy="-56" r="7" fill="#ffd21f" ${S3}/>
    <path d="M-50 -10 Q-58 44 0 46 Q58 44 50 -10 Q46 -30 30 -30 H-30 Q-46 -30 -50 -10 Z" fill="#ff6f9c" ${S}/>
    <path d="M-36 -30 Q0 -44 36 -30" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M-36 -30 Q0 -44 36 -30" fill="none" stroke="#ffd21f" stroke-width="4" stroke-linecap="round"/>
    <path d="M-30 10 Q0 22 30 10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>
    ${coins ? `<g transform="translate(-30 40)">${coin(10, 18)}</g><g transform="translate(4 46)">${coin(2, 18)}</g><g transform="translate(36 38)">${coin(100, 17)}</g>` : ''}</g>`;
  // A price tag with a string, centred, about 90 wide. s: what it says.
  const tag = (s, colour = '#fff') => `<g transform="rotate(-8)"><path d="M-30 -24 Q-48 -40 -40 -56" fill="none" stroke="${OL}" stroke-width="3"/>
    <path d="M-34 -22 H40 V22 H-34 L-50 0 Z" fill="${colour}" ${S}/><circle cx="-34" cy="0" r="5" fill="#fff" ${S3}/>${txt(4, 12, 32, OL, s)}</g>`;
  // The shop counter with the till on it, base at 0,0, about 300 wide.
  const counter = (open = false) => `<g>
    <rect x="-150" y="-110" width="300" height="110" fill="#ff8fb1" ${S}/><rect x="-160" y="-124" width="320" height="18" rx="6" fill="#c98b4e" ${S}/>
    ${[-110, -55, 0, 55, 110].map(x => `<circle cx="${x}" cy="-56" r="12" fill="${['#ffd21f', '#fff', '#1e5bd6', '#fff', '#ffd21f'][(x / 55 + 2) | 0]}" opacity=".8"/>`).join('')}
    <path d="M20 -124 L30 -190 H130 L140 -124 Z" fill="#5a606b" ${S}/><rect x="44" y="-182" width="72" height="30" rx="4" fill="#7be0a0" ${S3}/>${txt(80, -159, 22, '#2f3446', '£')}
    ${[0, 1, 2].map(i => [0, 1, 2, 3].map(j => `<rect x="${44 + j * 19}" y="${-146 + i * 8}" width="14" height="5" rx="2" fill="#c3cad6"/>`).join('')).join('')}
    <rect x="${open ? 26 : 30}" y="-124" width="100" height="${open ? 26 : 14}" rx="3" fill="#2f3446" ${S3}/>
    ${open ? `<circle cx="56" cy="-110" r="7" fill="#d9883e" ${S3}/><circle cx="76" cy="-110" r="7" fill="#dfe4ec" ${S3}/><circle cx="96" cy="-110" r="7" fill="#f2c200" ${S3}/>` : ''}</g>`;
  // Sam, who runs the toy shop (feet at 0,0, about 240 tall). wave: one hand up.
  const sam = (wave = false) => {
    const arm = (x1, y1, x2, y2, hx, hy) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#1e5bd6" stroke-width="12" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="9" fill="#7a4a2a" ${S3}/>`;
    return `<g class="sam">
    <rect x="-22" y="-86" width="16" height="82" rx="6" fill="#5a606b" ${S3}/><rect x="6" y="-86" width="16" height="82" rx="6" fill="#5a606b" ${S3}/>
    <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="${OL}"/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="${OL}"/>
    <path d="M-38 -160 Q0 -172 38 -160 L42 -80 H-42 Z" fill="#1e5bd6" ${S}/>
    <path d="M-28 -150 Q0 -158 28 -150 L32 -84 H-32 Z" fill="#ff6f9c" ${S3}/><rect x="-16" y="-128" width="32" height="20" rx="4" fill="#fff" ${S3}/>${txt(0, -113, 13, '#ff6f9c', 'TOYS')}
    ${arm(-36, -154, -52, -100, -52, -96)}
    ${wave ? arm(36, -154, 60, -200, 62, -206) : arm(36, -154, 52, -100, 52, -96)}
    <circle cy="-196" r="27" fill="#7a4a2a" ${S}/>
    <path d="M-27 -200 Q-30 -228 0 -228 Q30 -228 27 -200 Q22 -216 0 -216 Q-22 -216 -27 -200 Z" fill="#1a1a1a" ${S3}/>
    <circle cx="-10" cy="-196" r="8" fill="none" ${SW(3)}/><circle cx="10" cy="-196" r="8" fill="none" ${SW(3)}/><path d="M-2 -196 H2" ${SW(3)}/>
    ${eyes(10, -196, 2.6)}${cheeks(17, -184, 4)}${smile(-182, 8)}
  </g>`;
  };
  // A wooden shelf of toys for the shop walls, base at 0,0, w wide.
  const SHELF_TOYS = ['teddy', 'ball', 'car', 'rocket', 'drum', 'kite', 'yoyo', 'dinosaur', 'puzzle', 'aeroplane', 'robot', 'ballerina'];
  const shelves = (w = 400, seed = 0) => {
    const rows = [-60, -160, -260], n = Math.floor((w - 20) / 70);
    return `<g><rect x="0" y="-320" width="${w}" height="320" fill="#f6e2c4" ${S}/>
      ${rows.map((y, r) => `${Array.from({ length: n }, (_, i) => `<g transform="translate(${45 + i * 70} ${y - 34}) scale(.5)">${ITEMS[SHELF_TOYS[(i * 5 + r * 3 + seed) % SHELF_TOYS.length]]}</g>`).join('')}
        <rect x="0" y="${y}" width="${w}" height="14" fill="#c98b4e" ${S3}/>`).join('')}</g>`;
  };
  // Three teddies on a stand, small to big (the home screen spot), base at 0,0.
  const teddyStand = `<g><rect x="-150" y="-30" width="300" height="30" rx="6" fill="#c98b4e" ${S}/>
    <g transform="translate(-100 -30)">${sizeTeddy('small')}</g><g transform="translate(-20 -30)">${sizeTeddy('middle')}</g><g transform="translate(86 -30)">${sizeTeddy('big')}</g></g>`;
  // The big robot on a box with its price tag, base at 0,0.
  const bigRobot = (lit = false) => `<g><rect x="-90" y="-60" width="180" height="60" rx="6" fill="#ffd21f" ${S}/>${txt(0, -20, 30, OL, 'NEW!')}
    <g transform="translate(0 -180) scale(2)">${robot(lit)}</g><g transform="translate(118 -110) scale(.8)">${tag('£20', '#fff6cc')}</g></g>`;
  const bigBike = `<g transform="translate(0 -88) scale(1.9)">${bicycle}</g>`;
  // A bunch of balloons tied to a weight, base at 0,0.
  const balloons = (up = 0) => `<g>
    ${[[-60, -250, '#e53935', -14], [0, -280, '#ffd21f', 0], [60, -250, '#1e5bd6', 14], [-30, -200, '#2e9e4f', -8], [32, -204, '#ff6f9c', 8]].map(([x, y, c, r]) =>
      `<path d="M${x} ${y + 46 - up} Q${x / 2} ${-80 - up / 2} 0 -26" fill="none" stroke="${OL}" stroke-width="2.5"/><g transform="translate(${x} ${y - up}) rotate(${r})"><g transform="scale(1.1)">${balloon(c).replace(/<path d="M0 26[^>]*>/, '')}</g></g>`).join('')}
    <path d="M-18 0 L-12 -26 H12 L18 0 Z" fill="#5a606b" ${S}/></g>`;
  // Pip's purse on a little stool (the home screen spot), base at 0,0.
  const purseStool = `<g><path d="M-50 0 L-40 -70 M50 0 L40 -70" ${SW(10)}/><rect x="-62" y="-88" width="124" height="20" rx="8" fill="#e8a54b" ${S}/>
    <g transform="translate(0 -136) scale(.9)">${purse(true)}</g></g>`;
  // The toy shop from the outside, base at 0,0, about 300 wide.
  const shopFront = `<g>
    <rect x="-150" y="-200" width="300" height="200" fill="#ffe3ef" ${S}/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${-160 + i * 40} -246 h40 v34 q-20 18 -40 0 Z" fill="${i % 2 ? '#ffd21f' : '#e53935'}" ${S3}/>`).join('')}
    <rect x="-110" y="-290" width="220" height="40" rx="10" fill="#ff6f9c" ${S}/>${txt(0, -261, 28, '#fff', 'TOY SHOP')}
    <rect x="-130" y="-172" width="150" height="110" fill="#bfe6ff" ${S3}/>
    <g transform="translate(-96 -100) scale(.5)">${ITEMS.teddy}</g><g transform="translate(-36 -104) scale(.5)">${robot()}</g><g transform="translate(-60 -150) scale(.36)">${ITEMS.rocket}</g>
    <rect x="44" y="-130" width="80" height="130" fill="#e53935" ${S3}/><circle cx="110" cy="-66" r="5" fill="#ffd21f" ${S3}/></g>`;
  // Birthday things for the story.
  const cake = `<g><rect x="-60" y="-50" width="120" height="50" rx="6" fill="#ff9fc0" ${S}/><path d="M-60 -36 Q-45 -24 -30 -36 Q-15 -24 0 -36 Q15 -24 30 -36 Q45 -24 60 -36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    ${[-36, -12, 12, 36].map((x, i) => `<rect x="${x - 4}" y="-80" width="8" height="30" rx="3" fill="${['#1e5bd6', '#ffd21f', '#2e9e4f', '#e53935'][i]}" ${S3}/><path d="M${x} -96 q7 8 0 12 q-7 -4 0 -12 Z" fill="#ffb300" ${S3}/>`).join('')}
    <ellipse cy="2" rx="76" ry="10" fill="#fff" ${S3}/></g>`;
  const card = (c = '#1e5bd6') => `<g><path d="M-40 -56 L40 -48 V56 L-40 48 Z" fill="${c}" ${S}/><path d="M-40 -56 L-52 -44 V60 L-40 48" fill="#fff" ${S3}/>
    <g transform="translate(0 0) scale(.5)">${cake}</g><path d="M-24 -30 l8 -12 l8 12 M8 -30 l8 -12 l8 12" fill="none" stroke="#ffd21f" stroke-width="4" stroke-linecap="round"/></g>`;
  const banner = (w = 600) => {
    const letters = 'HAPPY BIRTHDAY'.split(''), step = w / letters.length;
    return `<g><path d="M0 0 Q${w / 2} 60 ${w} 0" fill="none" ${SW(3)}/>
      ${letters.map((ch, i) => ch === ' ' ? '' : `<g transform="translate(${step * (i + .5)} ${Math.sin((i + .5) / letters.length * Math.PI) * 36 + 4})"><path d="M-27 0 H27 L0 62 Z" fill="${['#e53935', '#ffd21f', '#1e5bd6', '#2e9e4f', '#ff6f9c'][i % 5]}" ${S3}/>${txt(0, 32, 30, '#fff', ch)}</g>`).join('')}</g>`;
  };

  // Pip's mum, borrowed from the school pictures.
  const pipMum = () => window.SchoolArt.pipMum;

  // ---------- Stickers for the six places in the toy shop ----------
  const SPOTS = {
    purse:    { name: 'Birthday money', art: () => `<g transform="translate(0 10) scale(.6)">${purse(true)}</g>`, bg: '#ffe3ef' },
    teddies:  { name: 'Teddies', art: () => `<g transform="translate(-18 34) scale(.6)">${sizeTeddy('small')}</g><g transform="translate(14 40) scale(.62)">${sizeTeddy('big')}</g>`, bg: '#fff1d6' },
    robot:    { name: 'Robot', art: () => `<g transform="translate(0 4) scale(.66)">${robot(true)}</g>`, bg: '#dff3ff' },
    bike:     { name: 'Bicycle', art: () => `<g transform="translate(0 4) scale(.72)">${bicycle}</g>`, bg: '#e3f7e8' },
    balloons: { name: 'Balloons', art: () => `<g transform="translate(0 70) scale(.34)">${balloons()}</g>`, bg: '#efe6ff' },
    till:     { name: 'Sam', art: () => `<g transform="translate(0 110) scale(.5)">${sam(true)}</g>`, bg: '#fff6cc' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="ts-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#ts-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(ITEMS[id]);
  const coinSvg = (v, r) => svg(coin(v, r), '-50 -50 100 100');
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
  // In Coin Run every coin is drawn the same size as the ball, so it rolls true.
  const coinImage = v => image(coin(v, 46), '-50 -50 100 100');
  const pigImage = (happy = false) => image(`<g transform="translate(0 -46)">${pig()}</g>${happy ? `<path d="M-30 -100 l6 -10 M0 -108 v-12 M30 -100 l-6 -10" ${SW(5)}/>` : ''}`, '-70 -124 150 128');
  const jackImage = open => image(`<g transform="translate(0 -46)">${jack(open)}</g>`, '-70 -170 140 172');

  window.ToyArt = { ITEMS, NAMES, COIN, COIN_VALUES, COIN_NAMES, CLOTHES, SIZES, SPOTS, coin, teddy, robot, balloon, pig, jack, purse, tag, counter, sam, shelves,
    teddyStand, bigRobot, bigBike, balloons, purseStool, shopFront, sizeTeddy, cake, card, banner, pipMum, sticker, svg, itemSvg, coinSvg, image, coinImage, pigImage, jackImage, txt, eyes };
})();
