// New Puppies artwork, drawn in the app's style (navy outline, flat colours). Pip's mum, her five puppies, their
// basket and things, Dr Ade the vet, and the farm animal mums and babies for the games. Animal heads are drawn in a
// 120 x 120 box centred on 0,0 (like the zoo animals); a baby is the same animal drawn younger (bigger eyes, smaller
// snout) and is usually shown smaller. Puppies, people and big things stand with their base at 0,0.
(function () {
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r) => eye(-dx, y, r) + eye(dx, y, r);
  const shut = (dx, y, w = 5, cx = 0) => `<path d="M${cx - dx - w} ${y} Q${cx - dx} ${y + w * .9} ${cx - dx + w} ${y} M${cx + dx - w} ${y} Q${cx + dx} ${y + w * .9} ${cx + dx + w} ${y}" fill="none" ${SW(3)}/>`;
  const smile = (y, w = 8) => `<path d="M${-w} ${y} Q0 ${y + w * .9} ${w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const zzz = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" class="zzz">${txt(0, 0, 22, '#8e5bd6', 'z')}${txt(14, -18, 28, '#8e5bd6', 'z')}${txt(32, -40, 34, '#8e5bd6', 'Z')}</g>`;

  // ---------- Pip's mum and the five puppies ----------
  const MUM = { fur: '#f6e2c4', ear: '#c98b4e', belly: '#fff8ee', collar: '#e86aa6' };
  // body, ears, a patch (or spots) and a collar colour for each puppy, so they can be told apart.
  const PUPS = [
    { name: 'Patch',   fur: '#ffffff', ear: OL,        patch: OL,        collar: '#e53935' },
    { name: 'Biscuit', fur: '#f6e2c4', ear: '#c98b4e', patch: null,      collar: '#1e5bd6' },
    { name: 'Pepper',  fur: '#ffffff', ear: '#7f8b9c', spots: '#7f8b9c', collar: '#2e9e4f' },
    { name: 'Bramble', fur: '#d9a066', ear: '#8b5a2b', patch: '#8b5a2b', collar: '#ffd21f' },
    { name: 'Daisy',   fur: '#f6e2c4', ear: '#ffffff', spots: '#c98b4e', collar: '#8e5bd6' }
  ];
  // A sitting puppy, base at 0,0, about 96 tall. shut: eyes closed (newborn, or asleep). collar: wear its collar.
  const pupHead = (i, closed = false, tongue = false) => {
    const p = PUPS[i % PUPS.length];
    return `<circle r="27" fill="${p.fur}" ${S}/>
        ${p.patch ? `<ellipse cx="11" cy="-6" rx="10" ry="9" fill="${p.patch}"/>` : ''}
        ${p.spots ? `<circle cx="-14" cy="-14" r="4" fill="${p.spots}"/>` : ''}
        <path d="M-20 -16 Q-40 -10 -34 18 Q-22 16 -16 -2 Z" fill="${p.ear}" ${S3}/><path d="M20 -16 Q40 -10 34 18 Q22 16 16 -2 Z" fill="${p.ear}" ${S3}/>
        ${closed ? shut(10, -3, 5) : eyes(10, -4, 4.6)}
        ${cheeks(17, 7, 4)}
        <ellipse cy="8" rx="12" ry="9" fill="#fff" ${S3}/><ellipse cy="4" rx="6" ry="4" fill="${OL}"/>
        ${tongue ? `<path d="M-6 12 Q0 18 6 12" fill="none" ${SW(2.5)}/><path d="M-3 14 Q0 22 3 14 Z" fill="#ff7a8a" ${S3}/>` : `<path d="M-5 12 Q0 16 5 12" fill="none" ${SW(2.5)}/>`}`;
  };
  const puppy = (i, { shut: closed = false, collar = true, tongue = false } = {}) => {
    const p = PUPS[i % PUPS.length];
    return `<g>
      <path d="M22 -14 Q44 -16 40 -38" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M22 -14 Q44 -16 40 -38" fill="none" stroke="${p.fur}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cy="-24" rx="27" ry="24" fill="${p.fur}" ${S}/>
      ${p.spots ? `<circle cx="-12" cy="-22" r="5" fill="${p.spots}"/><circle cx="10" cy="-14" r="4" fill="${p.spots}"/>` : ''}
      <ellipse cx="-13" cy="-3" rx="10" ry="6" fill="${p.fur}" ${S3}/><ellipse cx="13" cy="-3" rx="10" ry="6" fill="${p.fur}" ${S3}/>
      ${collar ? `<path d="M-18 -42 Q0 -34 18 -42" fill="none" stroke="${p.collar}" stroke-width="6" stroke-linecap="round"/><circle cy="-36" r="4" fill="#ffd21f" ${S3}/>` : ''}
      <g transform="translate(0 -62)">${pupHead(i, closed, tongue)}</g></g>`;
  };
  // A curled-up sleeping puppy (for heaps in the basket), base at 0,0, about 70 wide.
  const curled = i => {
    const p = PUPS[i % PUPS.length];
    return `<g>
      <ellipse cx="4" cy="-18" rx="34" ry="19" fill="${p.fur}" ${S}/>
      ${p.spots ? `<circle cx="14" cy="-24" r="5" fill="${p.spots}"/><circle cx="24" cy="-14" r="4" fill="${p.spots}"/>` : ''}
      <path d="M34 -12 Q40 -2 26 -2" fill="none" ${SW(4)}/>
      <circle cx="-16" cy="-22" r="18" fill="${p.fur}" ${S}/>
      ${p.patch ? `<ellipse cx="-10" cy="-27" rx="7" ry="6" fill="${p.patch}"/>` : ''}
      <path d="M-26 -34 Q-40 -26 -32 -10 Q-24 -14 -22 -26 Z" fill="${p.ear}" ${S3}/>
      ${shut(6, -24, 3.5, -16)}
      <ellipse cx="-20" cy="-13" rx="8" ry="6" fill="#fff" ${S3}/><ellipse cx="-24" cy="-15" rx="3.5" ry="2.5" fill="${OL}"/></g>`;
  };
  // Pip's mum lying down, side on, head on the left; base at 0,0, about 330 wide. sleepy: eyes shut.
  const mumLying = (sleepy = false) => `<g>
    <path d="M136 -44 Q176 -40 170 -82" fill="none" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M136 -44 Q176 -40 170 -82" fill="none" stroke="${MUM.fur}" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="40" cy="-56" rx="112" ry="56" fill="${MUM.fur}" ${S}/>
    <ellipse cx="44" cy="-32" rx="86" ry="26" fill="${MUM.belly}"/>
    <ellipse cx="128" cy="-12" rx="34" ry="13" fill="${MUM.fur}" ${S3}/>
    <ellipse cx="-74" cy="-10" rx="36" ry="12" fill="${MUM.fur}" ${S3}/><ellipse cx="-30" cy="-10" rx="34" ry="12" fill="${MUM.fur}" ${S3}/>
    <path d="M-52 -96 Q-36 -82 -40 -60" fill="none" stroke="${MUM.collar}" stroke-width="10" stroke-linecap="round"/>
    <g transform="translate(-92 -96)">
      <circle r="46" fill="${MUM.fur}" ${S}/>
      <path d="M-34 -30 Q-66 -20 -58 34 Q-44 28 -34 0 Z" fill="${MUM.ear}" ${S3}/><path d="M34 -30 Q62 -22 58 30 Q44 26 34 0 Z" fill="${MUM.ear}" ${S3}/>
      ${sleepy ? shut(16, -6, 6) : eyes(16, -8, 5)}<ellipse cy="14" rx="9" ry="6" fill="${OL}"/><path d="M-10 24 Q0 32 10 24" fill="none" ${S3}/>${cheeks(28, 16, 6)}
    </g></g>`;
  // Pip's mum standing, waiting for her puppies (a round tummy), feet at 0,0, about 200 tall.
  const mumRound = () => window.SchoolArt.pipMum.replace('<ellipse cx="0" cy="-50" rx="34" ry="44" fill="#fff8ee"/>',
    `<ellipse cx="0" cy="-44" rx="64" ry="50" fill="${MUM.fur}" ${S}/><ellipse cx="0" cy="-40" rx="46" ry="36" fill="${MUM.belly}"/>`);
  const mumStand = () => window.SchoolArt.pipMum;

  // ---------- The puppies' things ----------
  // The basket: draw basketBack, then what sits in it, then basketFront. Base at 0,0, w wide.
  const basketBack = (w = 360) => `<g><ellipse cy="-40" rx="${w / 2}" ry="44" fill="#a8622c" ${S}/><ellipse cy="-46" rx="${w / 2 - 22}" ry="30" fill="#7fb8e6"/>
    ${Array.from({ length: 6 }, (_, i) => `<circle cx="${-w / 2 + 50 + i * (w - 100) / 5}" cy="${-46 + (i % 2) * 8}" r="5" fill="#fff" opacity=".7"/>`).join('')}</g>`;
  const basketFront = (w = 360) => `<g><path d="M${-w / 2} -40 Q${-w / 2} 0 0 0 Q${w / 2} 0 ${w / 2} -40 Q${w / 2} -22 0 -22 Q${-w / 2} -22 ${-w / 2} -40 Z" fill="#c97a3d" ${S}/>
    ${Array.from({ length: Math.floor(w / 30) }, (_, i) => `<path d="M${-w / 2 + 22 + i * 30} -26 l8 18" stroke="#a8622c" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
  const basket = (w = 360, inner = '') => basketBack(w) + inner + basketFront(w);
  // Mum and all five puppies tucked up in the basket. awake: the puppies sit up, eyes open.
  const family = (awake = false, sleepy = false) => basket(420, `<g transform="translate(-20 -30) scale(.86)">${mumLying(sleepy)}</g>
    ${awake ? [0, 1, 2, 3, 4].map(i => `<g transform="translate(${-120 + i * 62} ${-14 - (i % 2) * 8}) scale(.62)">${puppy(i)}</g>`).join('')
    : [0, 1, 2, 3, 4].map(i => `<g transform="translate(${-110 + i * 50} ${-18 - (i % 2) * 10}) scale(.66)">${curled(i)}</g>`).join('')}`);
  const bowl = (fill, food) => `<g><path d="M-40 -24 H40 L32 0 H-32 Z" fill="${fill}" ${S}/><ellipse cy="-24" rx="40" ry="9" fill="${food}" ${S3}/>
    <path d="M-20 -12 L-14 -10 M-4 -12 L4 -8" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></g>`;
  const bowls = `<g>${'<rect x="-110" y="-8" width="220" height="12" rx="6" fill="#ff8fb1" ' + S3 + '/>'}
    <g transform="translate(-48 0)">${bowl('#e53935', '#a8622c')}${[-18, -6, 6, 18].map((x, i) => `<circle cx="${x}" cy="${-26 - (i % 2) * 3}" r="5" fill="#8b5a2b"/>`).join('')}</g>
    <g transform="translate(50 0)">${bowl('#1e5bd6', '#7fd3ff')}</g>${txt(-48, -40, 20, '#e53935', 'PUP')}</g>`;
  const ball = (c = '#e53935', r = 16) => `<g><circle r="${r}" fill="${c}" ${S3}/><path d="M${-r} 0 Q0 ${r * .7} ${r} 0" fill="none" stroke="#fff" stroke-width="${r * .22}"/><circle cx="${-r * .35}" cy="${-r * .4}" r="${r * .22}" fill="#fff" opacity=".6"/></g>`;
  const bone = `<g><path d="M-30 -6 H30 V6 H-30 Z" fill="#fff" ${S3}/>${[[-30, -8], [-30, 8], [30, -8], [30, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" ${S3}/>`).join('')}<path d="M-28 -6 H28 V6 H-28 Z" fill="#fff"/></g>`;
  const rope = `<g><path d="M-36 0 Q-12 -14 0 0 T36 0" fill="none" stroke="${OL}" stroke-width="14" stroke-linecap="round"/><path d="M-36 0 Q-12 -14 0 0 T36 0" fill="none" stroke="#2e9e4f" stroke-width="8" stroke-linecap="round" stroke-dasharray="8 6"/>
    <circle cx="-40" r="9" fill="#e53935" ${S3}/><circle cx="40" r="9" fill="#e53935" ${S3}/></g>`;
  const toyBox = (open = false) => `<g>
    <g transform="translate(-30 -96)">${ball('#1e5bd6', 18)}</g><g transform="translate(18 -92) rotate(-20)">${bone}</g><g transform="translate(4 -112) rotate(10) scale(.8)">${rope}</g>
    ${open ? `<g transform="translate(46 -136) rotate(-30)">${ball('#ffd21f', 14)}</g>` : ''}
    <rect x="-70" y="-84" width="140" height="84" rx="8" fill="#ffd21f" ${S}/>${txt(0, -32, 28, '#e53935', 'TOYS')}
    <path d="M-76 -86 H76" ${SW(8)}/><path d="M-76 -86 H76" stroke="#f2a900" stroke-width="4"/></g>`;
  // Puppy scales: a tray on a stand with a dial. pup: which puppy is on it (or none).
  const scales = (pup = -1) => `<g>
    <rect x="-56" y="-60" width="112" height="60" rx="10" fill="#dfe4ec" ${S}/>
    <circle cy="-30" r="20" fill="#fff" ${S3}/><path d="M0 -30 L${pup >= 0 ? 12 : -8} -44" ${SW(4)}/>${[-60, -30, 0, 30, 60].map(a => `<path d="M${(Math.sin(a * Math.PI / 180) * 15).toFixed(1)} ${(-30 - Math.cos(a * Math.PI / 180) * 15).toFixed(1)} l${(Math.sin(a * Math.PI / 180) * 3).toFixed(1)} ${(-Math.cos(a * Math.PI / 180) * 3).toFixed(1)}" ${SW(2)}/>`).join('')}
    <rect x="-10" y="-74" width="20" height="16" fill="#9aa3b5" ${S3}/>
    <path d="M-80 -86 Q-80 -70 -64 -70 H64 Q80 -70 80 -86 Z" fill="#fff" ${S}/>
    ${pup >= 0 ? `<g transform="translate(0 -84) scale(.7)">${puppy(pup)}</g>` : ''}</g>`;
  // Five collars on a row of pegs, one colour for each puppy.
  const collars = `<g><rect x="-150" y="-110" width="300" height="20" rx="6" fill="#c98b4e" ${S3}/>
    ${PUPS.map((p, i) => `<g transform="translate(${-120 + i * 60} -100)"><circle r="6" fill="#8b5a2b" ${S3}/>
      <ellipse cy="30" rx="20" ry="26" fill="none" stroke="${OL}" stroke-width="11"/><ellipse cy="30" rx="20" ry="26" fill="none" stroke="${p.collar}" stroke-width="6"/>
      <circle cy="58" r="7" fill="#ffd21f" ${S3}/></g>`).join('')}</g>`;
  const stethoscope = `<g><path d="M-22 -40 Q-26 0 0 6 Q26 0 22 -40" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M-22 -40 Q-26 0 0 6 Q26 0 22 -40" fill="none" stroke="#1e5bd6" stroke-width="5" stroke-linecap="round"/>
    <path d="M0 6 Q2 30 24 34" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M0 6 Q2 30 24 34" fill="none" stroke="#1e5bd6" stroke-width="5" stroke-linecap="round"/>
    <circle cx="30" cy="34" r="13" fill="#dfe4ec" ${S3}/><circle cx="30" cy="34" r="6" fill="#9aa3b5"/>
    <circle cx="-22" cy="-42" r="5" fill="#9aa3b5" ${S3}/><circle cx="22" cy="-42" r="5" fill="#9aa3b5" ${S3}/></g>`;
  // Dr Ade the vet: green tunic, stethoscope round the neck. Feet at 0,0, about 236 tall.
  const vet = (wave = false) => {
    const arm = (x1, y1, x2, y2, hx, hy) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#2bb39a" stroke-width="12" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="9" fill="#5a3a22" ${S3}/>`;
    return `<g class="vet">
    <rect x="-22" y="-86" width="16" height="82" rx="6" fill="#1f8a76" ${S3}/><rect x="6" y="-86" width="16" height="82" rx="6" fill="#1f8a76" ${S3}/>
    <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="#fff" ${S3}/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="#fff" ${S3}/>
    <path d="M-38 -160 Q0 -172 38 -160 L42 -80 H-42 Z" fill="#2bb39a" ${S}/>
    <path d="M-12 -164 L0 -146 L12 -164" fill="none" ${SW(3)}/><rect x="14" y="-136" width="18" height="14" rx="3" fill="#fff" ${S3}/><path d="M23 -133 V-125 M19 -129 H27" stroke="#e53935" stroke-width="3"/>
    <g transform="translate(-4 -128) scale(.62)">${stethoscope}</g>
    ${arm(-36, -154, -52, -100, -52, -96)}
    ${wave ? arm(36, -154, 60, -200, 62, -206) : arm(36, -154, 52, -100, 52, -96)}
    <circle cy="-196" r="27" fill="#5a3a22" ${S}/>
    <path d="M-27 -202 Q-26 -228 0 -228 Q26 -228 27 -202 Q20 -214 0 -214 Q-20 -214 -27 -202 Z" fill="#1a1a1a" ${S3}/>
    ${eyes(10, -198, 3)}${cheeks(17, -186, 4)}${smile(-184, 9)}
  </g>`;
  };
  // A night window with the moon and stars (for bedtime pages), centred on 0,0.
  const nightWindow = `<g><rect x="-90" y="-80" width="180" height="160" rx="10" fill="#1b2a5a" ${S}/>
    <circle cx="36" cy="-30" r="24" fill="#fff6cc"/><circle cx="48" cy="-38" r="22" fill="#1b2a5a"/>
    ${[[-50, -40], [-20, 20], [-60, 40], [10, -50], [50, 40]].map(([x, y]) => `<path d="M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y} L${x + 2} ${y + 2} L${x} ${y + 6} L${x - 2} ${y + 2} L${x - 6} ${y} L${x - 2} ${y - 2} Z" fill="#ffd21f"/>`).join('')}
    <path d="M0 -80 V80 M-90 0 H90" stroke="${OL}" stroke-width="6"/><rect x="-100" y="78" width="200" height="14" rx="5" fill="#c98b4e" ${S3}/></g>`;
  const dayWindow = `<g><rect x="-90" y="-80" width="180" height="160" rx="10" fill="#bfe6ff" ${S}/>
    <circle cx="40" cy="-34" r="22" fill="#ffd21f"/>${Art.cloud(-70, -50, .35)}
    <path d="M0 -80 V80 M-90 0 H90" stroke="${OL}" stroke-width="6"/><rect x="-100" y="78" width="200" height="14" rx="5" fill="#c98b4e" ${S3}/></g>`;
  const heart = (c = '#ff6f9c') => `<path d="M0 14 C-10 6 -18 -2 -10 -8 C-5 -12 0 -8 0 -4 C0 -8 5 -12 10 -8 C18 -2 10 6 0 14 Z" fill="${c}" ${S3}/>`;

  // ---------- Farm animal mums and babies (heads, 120 x 120 box) ----------
  // b: true for the baby. Each baby has bigger eyes and a rounder face.
  const FARM = {
    dog: b => b ? `<g transform="scale(1.6)">${pupHead(1)}</g>` : `
      <circle r="44" fill="${MUM.fur}" ${S}/><path d="M-34 -30 Q-66 -20 -58 34 Q-44 28 -34 0 Z" fill="${MUM.ear}" ${S3}/><path d="M34 -30 Q66 -20 58 34 Q44 28 34 0 Z" fill="${MUM.ear}" ${S3}/>
      ${eyes(16, -8, 5)}<ellipse cy="18" rx="20" ry="15" fill="${MUM.belly}" ${S3}/><ellipse cy="12" rx="9" ry="6" fill="${OL}"/>${smile(24, 8)}${cheeks(28, 16, 6)}
      <path d="M-30 40 Q0 52 30 40" fill="none" stroke="${MUM.collar}" stroke-width="9" stroke-linecap="round"/>`,
    cat: (b, closed = false) => `
      <path d="M-34 -18 L-38 -56 L-8 -38 Z M34 -18 L38 -56 L8 -38 Z" fill="${b ? '#9aa3b5' : '#f29a3a'}" ${S}/>
      <path d="M-30 -26 L-32 -46 L-16 -36 Z M30 -26 L32 -46 L16 -36 Z" fill="#ffb3c1"/>
      <ellipse cy="0" rx="${b ? 40 : 44}" ry="${b ? 38 : 38}" fill="${b ? '#9aa3b5' : '#f29a3a'}" ${S}/>
      ${b ? '<path d="M-10 -36 L-6 -22 M0 -38 V-22 M10 -36 L6 -22" stroke="#6f7a8c" stroke-width="4" stroke-linecap="round"/>' : '<path d="M-10 -36 L-6 -22 M0 -38 V-22 M10 -36 L6 -22" stroke="#c4691a" stroke-width="4" stroke-linecap="round"/>'}
      ${closed ? shut(15, -4, 7) : b ? eyes(15, -4, 8) : `<ellipse cx="-15" cy="-4" rx="6" ry="7" fill="#7cc46a" ${S3}/><ellipse cx="15" cy="-4" rx="6" ry="7" fill="#7cc46a" ${S3}/><ellipse cx="-15" cy="-4" rx="2" ry="5" fill="${OL}"/><ellipse cx="15" cy="-4" rx="2" ry="5" fill="${OL}"/>`}
      <path d="M-5 12 H5 L0 18 Z" fill="#ff8fa3" ${S3}/><path d="M0 18 Q-6 26 -12 22 M0 18 Q6 26 12 22" fill="none" ${S3}/>
      <path d="M-20 14 H-46 M-20 20 L-44 26 M20 14 H46 M20 20 L44 26" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>${cheeks(26, 12, 5)}`,
    pig: b => `
      <path d="M-30 -30 L-44 -58 L-12 -42 Z M30 -30 L44 -58 L12 -42 Z" fill="#f57fa8" ${S3}/>
      <ellipse rx="${b ? 40 : 46}" ry="${b ? 38 : 40}" fill="#ff9fc0" ${S}/>
      ${eyes(b ? 15 : 17, -10, b ? 7 : 5)}
      <ellipse cy="14" rx="${b ? 16 : 20}" ry="${b ? 12 : 14}" fill="#f57fa8" ${S3}/><ellipse cx="-6" cy="14" rx="3" ry="4.5" fill="${OL}"/><ellipse cx="6" cy="14" rx="3" ry="4.5" fill="${OL}"/>
      ${smile(30, 8)}${cheeks(28, 8, 6)}`,
    hen: b => b ? `
      <path d="M-8 -36 Q-4 -50 2 -38 Q8 -50 10 -36" fill="#ffe066" ${S3}/>
      <circle r="38" fill="#ffe066" ${S}/>${eyes(13, -6, 7)}
      <path d="M-9 8 L9 8 L0 22 Z" fill="#f7a823" ${S3}/>${cheeks(24, 10, 5)}
      <path d="M-38 10 Q-52 0 -46 -12 M38 10 Q52 0 46 -12" fill="none" ${SW(3)}/>` : `
      <path d="M-16 -40 Q-14 -60 -4 -46 Q2 -64 10 -46 Q20 -58 20 -38 Z" fill="#e53935" ${S3}/>
      <ellipse rx="38" ry="44" fill="#fff" ${S}/><path d="M-26 30 Q0 50 26 30" fill="none" stroke="#e9e3d6" stroke-width="8" stroke-linecap="round"/>
      ${eyes(14, -12, 5)}<path d="M-10 4 L10 4 L0 20 Z" fill="#f7a823" ${S3}/><path d="M-4 18 Q0 34 6 22 Z" fill="#e53935" ${S3}/>`,
    egg: () => `<ellipse cy="4" rx="30" ry="38" fill="#fff6e6" ${S}/><ellipse cx="-10" cy="-12" rx="7" ry="11" fill="#fff" transform="rotate(-20 -10 -12)"/>`,
    duck: b => b ? `
      <circle r="38" fill="#ffe066" ${S}/><path d="M-4 -38 Q0 -50 6 -38" fill="none" ${SW(3)}/>${eyes(13, -8, 7)}
      <ellipse cy="12" rx="20" ry="9" fill="#f7a823" ${S3}/><path d="M-14 12 H14" ${SW(2)}/>${cheeks(26, 4, 5)}` : `
      <path d="M-6 -42 Q-2 -56 4 -44 Q10 -54 12 -40" fill="#b5793e" ${S3}/>
      <ellipse rx="38" ry="42" fill="#c98b4e" ${S}/>
      ${[[-20, 22], [18, 26], [-6, 34], [24, 6], [-26, 4]].map(([x, y]) => `<path d="M${x - 4} ${y} q4 -4 8 0" stroke="#8b5a2b" stroke-width="3" fill="none"/>`).join('')}
      ${eyes(14, -4, 5)}<ellipse cy="16" rx="24" ry="10" fill="#f7a823" ${S3}/><path d="M-18 16 H18" ${SW(2.5)}/><circle cx="12" cy="11" r="3" fill="${OL}"/>`,
    cow: b => `
      ${b ? '' : `<path d="M-30 -36 Q-40 -58 -26 -60 Q-26 -48 -20 -40 Z M30 -36 Q40 -58 26 -60 Q26 -48 20 -40 Z" fill="#fff6e6" ${S3}/>`}
      <ellipse cx="-46" cy="-18" rx="18" ry="9" fill="#fff" ${S3} transform="rotate(-20 -46 -18)"/><ellipse cx="46" cy="-18" rx="18" ry="9" fill="#fff" ${S3} transform="rotate(20 46 -18)"/>
      <path d="M-34 -30 Q-36 -44 0 -44 Q36 -44 34 -30 L30 22 H-30 Z" fill="#fff" ${S}/>
      <path d="M-34 -30 Q-30 -40 -14 -40 Q-10 -20 -30 -12 Z" fill="${b ? '#8b5a2b' : OL}"/><path d="M12 -42 Q30 -42 34 -26 L32 -4 Q16 -10 12 -42 Z" fill="${b ? '#8b5a2b' : OL}"/>
      ${eyes(14, -14, b ? 7 : 5)}
      <ellipse cy="26" rx="${b ? 26 : 32}" ry="${b ? 18 : 20}" fill="#ffb3c1" ${S}/><ellipse cx="-10" cy="24" rx="4" ry="5" fill="${OL}"/><ellipse cx="10" cy="24" rx="4" ry="5" fill="${OL}"/>`,
    sheep: b => `
      <g fill="#fff" ${S}>${Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 34).toFixed(1)}" cy="${(Math.sin(a) * 30 - 6).toFixed(1)}" r="${b ? 15 : 18}"/>`; }).join('')}</g>
      <circle cy="-6" r="34" fill="#fff"/>
      <ellipse cx="-34" cy="-2" rx="16" ry="8" fill="${b ? '#f6e2c4' : '#3a3f55'}" ${S3} transform="rotate(-25 -34 -2)"/><ellipse cx="34" cy="-2" rx="16" ry="8" fill="${b ? '#f6e2c4' : '#3a3f55'}" ${S3} transform="rotate(25 34 -2)"/>
      <ellipse cy="10" rx="22" ry="28" fill="${b ? '#f6e2c4' : '#3a3f55'}" ${S}/>
      ${b ? eyes(10, 4, 6.5) : `<circle cx="-10" cy="4" r="5" fill="#fff"/><circle cx="10" cy="4" r="5" fill="#fff"/><circle cx="-9" cy="5" r="2.6" fill="${OL}"/><circle cx="11" cy="5" r="2.6" fill="${OL}"/>`}
      <path d="M-6 26 Q0 32 6 26" fill="none" stroke="${b ? OL : '#fff'}" stroke-width="3" stroke-linecap="round"/>`,
    horse: b => `
      <path d="M-20 -38 L-24 -60 L-8 -44 Z M20 -38 L24 -60 L8 -44 Z" fill="${b ? '#d9a066' : '#8b5a2b'}" ${S3}/>
      <path d="M-6 -48 Q4 -60 12 -46 Q20 -40 14 ${b ? -26 : 10} L6 ${b ? -30 : 10} Z" fill="${b ? '#f6e2c4' : OL}"/>
      <path d="M-26 -30 Q-28 -48 0 -48 Q28 -48 26 -30 L22 30 Q0 40 -22 30 Z" fill="${b ? '#d9a066' : '#8b5a2b'}" ${S}/>
      <path d="M-4 -40 L4 -40 L2 0 L-2 0 Z" fill="#fff" opacity="${b ? 0 : .9}"/>
      ${eyes(14, -16, b ? 7 : 5)}
      <ellipse cy="30" rx="22" ry="16" fill="${b ? '#f0c690' : '#b5793e'}" ${S3}/><ellipse cx="-8" cy="28" rx="3" ry="4" fill="${OL}"/><ellipse cx="8" cy="28" rx="3" ry="4" fill="${OL}"/>`,
    elephant: b => window.ZooArt ? (b ? window.ZooArt.animal('elephant').replace(/r="5.5"/g, 'r="7.5"') : window.ZooArt.animal('elephant')) : ''
  };
  // What each mum and baby is called.
  const BABY = { dog: 'puppy', cat: 'kitten', pig: 'piglet', hen: 'chick', duck: 'duckling', cow: 'calf', sheep: 'lamb', horse: 'foal', elephant: 'calf' };
  const BABIES = { puppy: 'puppies', kitten: 'kittens', piglet: 'piglets', chick: 'chicks', duckling: 'ducklings', calf: 'calves', lamb: 'lambs', foal: 'foals', egg: 'eggs' };
  const MUMS = { dog: 'dog', cat: 'cat', pig: 'pig', hen: 'hen', duck: 'duck', cow: 'cow', sheep: 'sheep', horse: 'horse', elephant: 'elephant' };
  const BG = { dog: '#fff1d6', cat: '#ffe3ef', pig: '#e3f7e8', hen: '#fff6cc', duck: '#dff3ff', cow: '#e3f7e8', sheep: '#efe6ff', horse: '#fff1d6', elephant: '#dff3ff' };
  const farm = (id, b = false) => FARM[id](b);

  // ---------- Word Train pictures (120 x 120, centred) ----------
  const rabbit = `<g><path d="M-16 -28 Q-26 -74 -10 -70 Q0 -60 -4 -28 Z M16 -28 Q26 -74 10 -70 Q0 -60 4 -28 Z" fill="#c3cad6" ${S}/><path d="M-12 -34 Q-18 -62 -11 -62 Q-6 -54 -8 -34 Z M12 -34 Q18 -62 11 -62 Q6 -54 8 -34 Z" fill="#ffb3c1"/>
    <ellipse cy="6" rx="38" ry="34" fill="#c3cad6" ${S}/>${eyes(14, 0, 5.5)}<path d="M-5 14 H5 L0 19 Z" fill="#ff8fa3" ${S3}/><path d="M0 19 Q-6 26 -11 22 M0 19 Q6 26 11 22" fill="none" ${S3}/>
    <rect x="-6" y="24" width="12" height="9" fill="#fff" ${S3}/>${cheeks(24, 14, 5)}</g>`;
  const hedgehog = `<g><g fill="#8b5a2b" ${S3}>${Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return `<path d="M${(Math.cos(a) * 34).toFixed(1)} ${(Math.sin(a) * 30 + 14).toFixed(1)} L${(Math.cos(a) * 56).toFixed(1)} ${(Math.sin(a) * 50 + 14).toFixed(1)} L${(Math.cos(a + .3) * 34).toFixed(1)} ${(Math.sin(a + .3) * 30 + 14).toFixed(1)} Z"/>`; }).join('')}</g>
    <ellipse cy="14" rx="48" ry="34" fill="#a8762f" ${S}/><path d="M18 30 Q44 26 56 10 Q50 -4 30 0 Q14 6 18 30 Z" fill="#f6e2c4" ${S}/><circle cx="57" cy="9" r="5" fill="${OL}"/>${eye(34, 8, 4)}
    <ellipse cx="-24" cy="46" rx="10" ry="6" fill="#f6e2c4" ${S3}/><ellipse cx="14" cy="46" rx="10" ry="6" fill="#f6e2c4" ${S3}/></g>`;
  const tadpole = `<g><path d="M-6 0 Q-30 -26 -56 -8 Q-36 -4 -50 14 Q-26 22 -6 0 Z" fill="#3a3f55" ${S}/><circle cx="14" r="26" fill="#3a3f55" ${S}/>${eye(24, -8, 6)}<path d="M26 10 Q32 12 36 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-30" cy="34" r="6" fill="none" stroke="#7fb8e6" stroke-width="3"/><circle cx="40" cy="-34" r="5" fill="none" stroke="#7fb8e6" stroke-width="3"/></g>`;
  const blanket = `<g><path d="M-54 -34 H54 V34 Q30 44 0 34 Q-30 44 -54 34 Z" fill="#7fb8e6" ${S}/>
    ${[-30, 0, 30].map(x => `<path d="M${x} -34 V36" stroke="#fff" stroke-width="7" opacity=".7"/>`).join('')}${[-14, 14].map(y => `<path d="M-54 ${y} H54" stroke="#fff" stroke-width="7" opacity=".7"/>`).join('')}
    <path d="M-54 -34 H54" ${SW(4)}/></g>`;
  const animals = `<g><g transform="translate(-28 -16) scale(.5)">${FARM.cow(false)}</g><g transform="translate(28 -16) scale(.5)">${FARM.pig(false)}</g>
    <g transform="translate(-28 34) scale(.5)">${FARM.sheep(false)}</g><g transform="translate(28 34) scale(.5)">${FARM.hen(false)}</g></g>`;
  const ITEMS = {
    puppy: `<g transform="translate(0 50)">${puppy(0, { tongue: true })}</g>`,
    kitten: `<g transform="scale(.95)">${FARM.cat(true)}</g>`,
    piglet: `<g transform="scale(.95)">${FARM.pig(true)}</g>`,
    duckling: `<g transform="scale(.95)">${FARM.duck(true)}</g>`,
    rabbit, hedgehog: `<g transform="translate(-4 -10)">${hedgehog}</g>`, tadpole, blanket, animals,
    basket: `<g transform="translate(0 40) scale(.5)">${basket(220, `<g transform="translate(-36 -20) scale(.9)">${puppy(1, { shut: true })}</g><g transform="translate(40 -40)">${ball('#e53935', 22)}</g>`)}</g>`,
    family: `<g transform="translate(-30 52) scale(.5)">${mumStand()}</g>${[2, 0, 4].map((p, i) => `<g transform="translate(${10 + i * 22} ${54 - (i % 2) * 6}) scale(.42)">${puppy(p)}</g>`).join('')}`,
    stethoscope: `<g transform="scale(1.1)">${stethoscope}</g>`
  };

  // ---------- Stickers for the six places in the puppy room ----------
  const SPOTS = {
    basket:  { name: 'The puppies', art: () => `<g transform="translate(6 30) scale(.24)">${family(false)}</g>`, bg: '#fff1d6' },
    scales:  { name: 'Scales', art: () => `<g transform="translate(0 50) scale(.62)">${scales(3)}</g>`, bg: '#dff3ff' },
    bowls:   { name: 'Puppy bowls', art: () => `<g transform="translate(0 18) scale(.5)">${bowls}</g>`, bg: '#ffe3ef' },
    toys:    { name: 'Toy box', art: () => `<g transform="translate(0 46) scale(.5)">${toyBox(true)}</g>`, bg: '#fff6cc' },
    collars: { name: 'Collars', art: () => `<g transform="translate(0 30) scale(.32)">${collars}</g>`, bg: '#efe6ff' },
    vet:     { name: 'Dr Ade', art: () => `<g transform="translate(0 110) scale(.5)">${vet(true)}</g>`, bg: '#e3f7e8' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="pp-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#pp-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;
  const pawPrint = (c = OL) => `<g fill="${c}"><ellipse cy="10" rx="16" ry="13"/><ellipse cx="-18" cy="-8" rx="7" ry="9"/><ellipse cx="-6" cy="-20" rx="7" ry="9"/><ellipse cx="6" cy="-20" rx="7" ry="9"/><ellipse cx="18" cy="-8" rx="7" ry="9"/></g>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(ITEMS[id]);
  const farmSvg = (id, b) => svg(farm(id, b), '-64 -64 128 128');
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
  const BALLS = ['#e53935', '#1e5bd6', '#2e9e4f', '#ffd21f', '#8e5bd6'];
  const ballImage = c => image(ball(c, 46), '-50 -50 100 100');
  // The puppy basket at the bottom of Bedtime Run: the puppies sit up when a ball lands, and cheer when all are in.
  const basketImage = (awake, happy) => image(basket(300, [0, 1, 2, 3, 4].map(i => `<g transform="translate(${-108 + i * 54} ${-16 - (i % 2) * 8}) scale(.7)">${puppy(i, { shut: !awake, tongue: happy })}</g>`).join('')), '-160 -100 320 104');
  // The sleepy cat's basket (the decoy): she opens her eyes and mews when a ball lands in it.
  const catBed = (awake = false) => `<g><ellipse cy="-24" rx="70" ry="26" fill="#8e5bd6" ${S}/><ellipse cy="-28" rx="54" ry="16" fill="#efe6ff"/>
    <g transform="translate(0 -46) scale(.62)">${FARM.cat(false, !awake)}</g>
    <path d="M-70 -24 Q-70 0 0 0 Q70 0 70 -24 Q70 -10 0 -10 Q-70 -10 -70 -24 Z" fill="#6f3fb8" ${S}/>${awake ? '' : zzz(40, -70, .7)}</g>`;
  const catImage = awake => image(catBed(awake), '-80 -110 160 114');

  window.PupArt = { PUPS, MUM, FARM, BABY, BABIES, MUMS, BG, ITEMS, SPOTS, BALLS, puppy, curled, mumLying, mumRound, mumStand, basket, basketBack, basketFront, family,
    bowls, bowl, ball, bone, rope, toyBox, scales, collars, stethoscope, vet, nightWindow, dayWindow, heart, farm, rabbit, hedgehog, tadpole, blanket,
    sticker, pawPrint, svg, itemSvg, farmSvg, image, ballImage, basketImage, catBed, catImage, zzz, txt, eyes, shut };
})();
