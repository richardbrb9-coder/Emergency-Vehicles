// Museum artwork, drawn in the app's style (navy outline, flat colours). The big dinosaur skeleton (in parts, for Dino
// Dig), the fossil case, the old toys case, the knight's armour, the space gallery, the painting, Professor Fen and the
// dinosaur egg, plus the pictures for the games. Pip's mum comes from School (SchoolArt.pipMum) and Bramble the puppy
// from New Puppies (PupArt.puppy). Big things stand with their base at 0,0; small pictures (Museum Train, Long Ago or
// Now?) are drawn in a 128 x 128 box centred on 0,0. No mummies, and no skulls close up: the dinosaur is friendly.
(function () {
  const { OL, S, S3 } = Art;
  const BA = window.BusArt, LA = window.LibArt, TA = window.ToyArt, PA = window.PupArt;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r, cx = 0) => eye(cx - dx, y, r) + eye(cx + dx, y, r);
  const smile = (y, w = 8, cx = 0) => `<path d="M${cx - w} ${y} Q${cx} ${y + w * .9} ${cx + w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4, cx = 0) => `<circle cx="${cx - dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${cx + dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const RED = '#e53935', YEL = '#ffd21f', GLASS = '#bfe6ff', WOOD = '#c98b4e', WOODD = '#7a4a2a', STONE = '#e9e3d6', STONED = '#d9d2c3';
  const BONE = '#f4ead2', BONED = '#d8c9a3', BROWN = '#8a5a24', GOLD = '#e0a030';
  const star = (R, r, n = 5) => 'M' + Array.from({ length: n * 2 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R;
    return `${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)}`;
  }).join(' L') + ' Z';

  // ---------- Pip, wearing his explorer's hat and magnifying glass ----------
  const pipAt = (x, y, w) => BA.pipAt(x, y, w, 'museum');

  // ---------- Bones ----------
  // A bone from x1,y1 to x2,y2, w thick, with round knobbly ends.
  const bone = (x1, y1, x2, y2, w = 16, c = BONE) => `<g><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="${w + 7}" stroke-linecap="round"/>
    ${[[x1, y1], [x2, y2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${w * .7}" fill="${c}" ${S3}/>`).join('')}
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/></g>`;
  // Little round back bones along a line, getting smaller from r0 to r1.
  const vertebrae = (pts, r0, r1, c = BONE) => pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${(r0 + (r1 - r0) * i / Math.max(1, pts.length - 1)).toFixed(1)}" fill="${c}" ${S3}/>`).join('');
  const along = (x1, y1, cx, cy, x2, y2, n) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1), u = 1 - t;
    return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]; });

  // The friendly long-necked dinosaur, in six parts. Each part is drawn around its own centre (at) so Dino Dig can move
  // it; put together at those centres they make the skeleton, base at 0,0, about 620 wide and 380 tall.
  const DINO = {
    head:  { at: [-262, -336], name: 'head', art: c => `<g><path d="M-44 -6 Q-46 -38 -6 -40 Q36 -40 54 -14 Q62 6 38 14 L-28 16 Q-46 12 -44 -6 Z" fill="${c}" ${S}/>
      <ellipse cx="-6" cy="-16" rx="10" ry="9" fill="${BONED}" ${S3}/><circle cx="-4" cy="-17" r="4" fill="${OL}"/>
      <circle cx="44" cy="-10" r="3.5" fill="${OL}"/><path d="M8 6 Q26 12 44 4" fill="none" ${S3}/></g>` },
    neck:  { at: [-196, -262], name: 'neck', art: c => vertebrae(along(56, 74, -10, 20, -48, -60, 7), 16, 11, c) },
    body:  { at: [0, -190], name: 'back and ribs', art: c => `<g>${[-100, -66, -32, 2, 36, 70, 104].map((x, i) => `<path d="M${x} 0 Q${x + (i < 3 ? -14 : 14)} 40 ${x} 70" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M${x} 0 Q${x + (i < 3 ? -14 : 14)} 40 ${x} 70" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`).join('')}
      ${vertebrae(along(-140, 12, 0, -46, 140, 12, 11), 15, 15, c)}</g>` },
    tail:  { at: [236, -122], name: 'tail', art: c => vertebrae(along(-92, -50, 10, -40, 110, 52, 9), 15, 7, c) },
    front: { at: [-94, -84], name: 'front leg', art: c => `<g>${bone(-4, -80, -14, -6, 18, c)}${bone(-14, -6, -6, 68, 16, c)}<path d="M-30 80 Q-6 64 20 80 Z" fill="${c}" ${S3}/></g>` },
    back:  { at: [96, -84], name: 'back leg', art: c => `<g>${bone(0, -80, 16, -4, 20, c)}${bone(16, -4, 6, 68, 17, c)}<path d="M-16 80 Q8 64 34 80 Z" fill="${c}" ${S3}/></g>` }
  };
  const PART_IDS = ['back', 'front', 'tail', 'body', 'neck', 'head'];
  const part = (id, c = BONE) => `<g transform="translate(${DINO[id].at[0]} ${DINO[id].at[1]})">${DINO[id].art(c)}</g>`;
  // The skeleton on its stand. roar: it rears its head (the head and neck tip up).
  const skeleton = (roar = false, c = BONE) => `<g>
    <rect x="-300" y="-6" width="620" height="16" rx="5" fill="${STONED}" ${S3}/>
    <path d="M-94 -150 V-6 M96 -150 V-6 M0 -170 V-6" stroke="#9aa3b5" stroke-width="6"/>
    ${part('tail', c)}${part('back', c)}${part('body', c)}${part('front', c)}
    <g transform="${roar ? 'rotate(-10 -150 -200)' : ''}">${part('neck', c)}${part('head', c)}</g></g>`;
  // The outline of a missing part (dashed), for Dino Dig.
  const ghost = id => `<g opacity=".55" transform="translate(${DINO[id].at[0]} ${DINO[id].at[1]})">${DINO[id].art('#c9b88f').replace(new RegExp(`stroke="${OL}"`, 'g'), 'stroke="#8a7a58" stroke-dasharray="6 6"')}</g>`;

  // ---------- Professor Fen, who looks after the museum (feet at 0,0, about 250 tall): white curly hair, round glasses,
  // a tweed jacket, a red bow tie and a magnifying glass. wave: one arm up. ----------
  const FEN = { skin: '#f2c79a', jacket: '#8b6a4a', trousers: '#4a3b2e' };
  const fen = (wave = false) => {
    const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${FEN.jacket}" stroke-width="12" stroke-linecap="round"/><circle cx="${x2}" cy="${y2 + 4}" r="9" fill="${FEN.skin}" ${S3}/>`;
    return `<g class="fen">
      <rect x="-22" y="-90" width="16" height="86" rx="6" fill="${FEN.trousers}" ${S3}/><rect x="6" y="-90" width="16" height="86" rx="6" fill="${FEN.trousers}" ${S3}/>
      <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="${OL}"/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="${OL}"/>
      <path d="M-40 -160 Q0 -172 40 -160 L44 -84 H-44 Z" fill="${FEN.jacket}" ${S}/>
      <path d="M-14 -164 L0 -120 L14 -164 Z" fill="#fff" ${S3}/><path d="M-12 -162 L0 -154 L12 -162 L12 -146 L0 -154 L-12 -146 Z" fill="${RED}" ${S3}/>
      <path d="M-30 -140 L-24 -96 M30 -140 L24 -96" stroke="#6f523a" stroke-width="4"/><rect x="18" y="-128" width="16" height="12" fill="#6f523a"/>
      ${arm(-38, -154, -54, -102)}
      ${wave ? arm(38, -154, 62, -206) : `${arm(38, -154, 58, -104)}<path d="M60 -104 L76 -128" ${SW(6)}/><circle cx="84" cy="-140" r="14" fill="${GLASS}" fill-opacity=".8" stroke="${OL}" stroke-width="5"/>`}
      <circle cy="-196" r="27" fill="${FEN.skin}" ${S}/>
      <g fill="#f4f4f4" ${S3}>${[[-26, -206, 11], [-18, -222, 11], [-2, -228, 12], [16, -224, 11], [26, -208, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <circle cx="-10" cy="-196" r="9" fill="#fff" fill-opacity=".3" ${S3}/><circle cx="10" cy="-196" r="9" fill="#fff" fill-opacity=".3" ${S3}/><path d="M-2 -197 Q0 -199 2 -197" fill="none" ${S3}/>
      ${eyes(10, -196, 2.8)}${cheeks(18, -184, 4)}${smile(-182, 8)}<path d="M-8 -176 Q0 -172 8 -176" fill="none" stroke="#f4f4f4" stroke-width="5" stroke-linecap="round"/></g>`;
  };

  // ---------- Fossils (centred on 0,0, about 60 across) ----------
  const ammonite = (c = '#d9b98a') => `<g><circle r="30" fill="${c}" ${S}/><path d="M0 0 Q6 -6 10 2 Q12 14 -2 16 Q-20 16 -20 -2 Q-18 -24 4 -26 Q28 -24 28 4" fill="none" stroke="#a07a4a" stroke-width="4" stroke-linecap="round"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<path d="M${(Math.cos(a) * 20).toFixed(1)} ${(Math.sin(a) * 20).toFixed(1)} L${(Math.cos(a) * 28).toFixed(1)} ${(Math.sin(a) * 28).toFixed(1)}" stroke="#a07a4a" stroke-width="3"/>`; }).join('')}</g>`;
  const trilobite = `<g><path d="M0 -34 Q30 -34 30 -6 Q28 28 0 36 Q-28 28 -30 -6 Q-30 -34 0 -34 Z" fill="#b8a27a" ${S}/><path d="M-10 -30 V30 M10 -30 V30" stroke="#8a7a58" stroke-width="3"/>
    ${[-14, -4, 6, 16, 26].map(y => `<path d="M-26 ${y} H26" stroke="#8a7a58" stroke-width="3"/>`).join('')}<path d="M-24 -18 Q0 -36 24 -18" fill="none" stroke="#8a7a58" stroke-width="4"/></g>`;
  const fern = `<g><rect x="-34" y="-40" width="68" height="80" rx="10" fill="#cfc6b4" ${S}/><path d="M0 34 Q-2 0 4 -32" fill="none" stroke="#8a7a58" stroke-width="3"/>
    ${[-24, -14, -4, 6, 16, 26].map((y, i) => `<path d="M${1 - y * .06} ${y} Q-14 ${y - 6} -20 ${y - 2} M${1 - y * .06} ${y} Q16 ${y - 8} 22 ${y - 4}" fill="none" stroke="#8a7a58" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
  const tooth = `<g><path d="M-14 -30 Q0 -40 14 -30 L4 30 Q0 36 -4 30 Z" fill="${BONE}" ${S}/><path d="M-6 -20 L2 18" stroke="${BONED}" stroke-width="3"/></g>`;
  // The dinosaur egg in its nest (base at 0,0, about 150 wide). wobble: it wobbles and a little crack shows.
  const egg = (wobble = false) => `<g>
    <path d="M-74 0 Q-80 -34 -50 -40 L50 -40 Q80 -34 74 0 Z" fill="#a8844f" ${S}/>${[-56, -30, 0, 30, 56].map((x, i) => `<path d="M${x - 16} ${-36 + (i % 2) * 6} L${x + 16} ${-24 - (i % 2) * 8}" stroke="#7a5a2a" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <g transform="rotate(${wobble ? 10 : 0} 0 -40)"><ellipse cy="-92" rx="40" ry="54" fill="#cfe3b0" ${S}/>${[[-14, -110, 7], [16, -86, 6], [-6, -64, 5], [20, -122, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9cbf6e"/>`).join('')}
      ${wobble ? `<path d="M-20 -104 L-8 -96 L0 -108 L10 -98" fill="none" ${SW(3)}/>` : ''}</g>
    <rect x="-52" y="-4" width="104" height="14" rx="4" fill="${STONED}" ${S3}/></g>`;

  // ---------- The six places in the museum (base at 0,0) ----------
  const plinth = (w = 160, h = 40) => `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${STONE}" ${S}/><rect x="${-w / 2 - 8}" y="${-h - 10}" width="${w + 16}" height="12" rx="3" fill="${STONED}" ${S3}/>`;
  const label = (x, y, s) => `<g transform="translate(${x} ${y})"><rect x="-56" y="-14" width="112" height="28" rx="4" fill="#fff" ${S3}/>${txt(0, 6, 16, OL, s)}</g>`;
  // A glass case on legs, w wide, holding inner (drawn with its floor at 0,0, centred). shine: the case lights up.
  const glassCase = (w, h, inner, shine = false) => `<g>
    <path d="M${-w / 2 + 14} 0 V-60 M${w / 2 - 14} 0 V-60" ${SW(10)}/><rect x="${-w / 2}" y="-70" width="${w}" height="20" fill="${WOODD}" ${S3}/>
    <g transform="translate(0 -70)">${inner}</g>
    <rect x="${-w / 2}" y="${-70 - h}" width="${w}" height="${h}" rx="6" fill="${shine ? '#fff6a8' : GLASS}" fill-opacity="${shine ? .35 : .3}" ${S}/>
    <path d="M${-w / 2 + 14} ${-60 - h} L${-w / 2 + 44} ${-80 - h * .3}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/></g>`;
  const fossilCase = (live = false) => `<g>${glassCase(260, 110, `<g transform="translate(-80 -40)">${ammonite()}</g><g transform="translate(-10 -40) scale(.9)">${trilobite}</g><g transform="translate(70 -44) scale(.9)">${fern}</g>${live ? `<g transform="translate(0 -96) scale(.6)">${tooth}</g>` : ''}`, live)}${label(0, 22, 'FOSSILS')}</g>`;
  // Old toys: a spinning top, a wooden doll, a rocking horse and a ball and cup. live: the top spins.
  const top = `<g><path d="M-26 -30 H26 L0 20 Z" fill="${RED}" ${S3}/><path d="M-26 -30 Q0 -44 26 -30" fill="${YEL}" ${S3}/><path d="M0 -38 V-52" ${SW(5)}/><path d="M-20 -22 H20" stroke="#fff" stroke-width="4"/></g>`;
  const doll = `<g><path d="M-20 0 L-14 -60 H14 L20 0 Z" fill="#1e5bd6" ${S3}/><circle cy="-74" r="16" fill="#f2c79a" ${S3}/><path d="M-16 -76 Q-16 -92 0 -92 Q16 -92 16 -76 Q8 -84 -16 -76 Z" fill="#8b5a2b" ${S3}/>${eyes(5, -74, 2)}${smile(-68, 4)}</g>`;
  const rockingHorse = `<g><path d="M-50 0 Q0 18 50 0" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M-50 0 Q0 18 50 0" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>
    <path d="M-30 6 L-24 -30 M30 6 L24 -30" ${SW(7)}/><ellipse cy="-38" rx="36" ry="16" fill="${WOOD}" ${S}/><path d="M24 -46 L40 -78 Q52 -82 56 -70 L44 -46 Z" fill="${WOOD}" ${S3}/>
    <path d="M38 -76 Q30 -70 26 -56" fill="none" stroke="#5a3b25" stroke-width="5"/><circle cx="48" cy="-72" r="2.5" fill="${OL}"/><path d="M-36 -40 Q-50 -34 -48 -20" fill="none" stroke="#5a3b25" stroke-width="6" stroke-linecap="round"/></g>`;
  const toysCase = (live = false) => `<g>${glassCase(280, 120, `<g transform="translate(-90 -6) ${live ? 'rotate(14)' : ''}">${top}</g>${live ? `<path d="M-120 -30 Q-90 -50 -60 -30" fill="none" stroke="${OL}" stroke-width="3" stroke-dasharray="5 5"/>` : ''}<g transform="translate(-20 -4)">${doll}</g><g transform="translate(70 -10) ${live ? 'rotate(-8)' : ''}">${rockingHorse}</g>`, live)}${label(0, 22, 'OLD TOYS')}</g>`;
  // The knight's armour on a stand, with a shield. live: the visor lifts with a clank.
  const knight = (live = false) => `<g>${plinth(150, 30)}
    <g transform="translate(0 -40)">
      <rect x="-26" y="-110" width="20" height="110" rx="6" fill="#c3cad6" ${S3}/><rect x="6" y="-110" width="20" height="110" rx="6" fill="#c3cad6" ${S3}/>
      <path d="M-46 -210 Q0 -228 46 -210 L40 -110 H-40 Z" fill="#c3cad6" ${S}/><path d="M0 -220 V-110 M-34 -170 H34" stroke="#9aa3b5" stroke-width="5"/>
      <path d="M-44 -206 L-70 -140 M44 -206 L70 -140" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M-44 -206 L-70 -140 M44 -206 L70 -140" stroke="#c3cad6" stroke-width="15" stroke-linecap="round"/>
      <path d="M-30 -230 Q-30 -280 0 -282 Q30 -280 30 -230 Z" fill="#c3cad6" ${S}/><path d="M0 -282 Q10 -306 34 -302" fill="none" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>
      ${live ? `<path d="M-30 -262 Q0 -290 30 -262 L28 -276 Q0 -296 -28 -276 Z" fill="#9aa3b5" ${S3}/><circle cx="-8" cy="-252" r="3" fill="${OL}"/><circle cx="8" cy="-252" r="3" fill="${OL}"/>${txt(70, -270, 22, RED, 'CLANK!')}`
        : `<path d="M-28 -262 H28 L24 -236 H-24 Z" fill="#9aa3b5" ${S3}/><path d="M-20 -252 H20 M-20 -244 H20" ${SW(3)}/>`}
      <g transform="translate(-86 -110)"><path d="M-34 -50 H34 V0 Q34 40 0 56 Q-34 40 -34 0 Z" fill="#1e5bd6" ${S}/><path d="M0 -50 V56 M-34 -6 H34" stroke="${YEL}" stroke-width="8"/></g></g></g>`;
  // The space gallery: a rocket on a stand under hanging planets. live: the rocket lifts off its stand a little.
  const planet = (x, y, r, c, ring = false) => `<g><path d="M${x} -270 V${y - r}" stroke="#9aa3b5" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${S3}/>${ring ? `<ellipse cx="${x}" cy="${y}" rx="${r * 1.7}" ry="${r * .4}" fill="none" stroke="${GOLD}" stroke-width="5"/>` : ''}</g>`;
  const rocketPic = `<g><path d="M0 -70 Q26 -40 22 20 H-22 Q-26 -40 0 -70 Z" fill="#fff" ${S}/><circle cy="-20" r="11" fill="${GLASS}" ${S3}/>
    <path d="M-22 0 L-40 30 L-22 22 Z M22 0 L40 30 L22 22 Z" fill="${RED}" ${S3}/><path d="M0 -70 Q12 -58 15 -46 H-15 Q-12 -58 0 -70 Z" fill="${RED}" ${S3}/></g>`;
  const space = (live = false) => `<g>
    <rect x="-130" y="-270" width="260" height="270" rx="10" fill="#1b2a5a" ${S}/>
    ${[[-100, -240], [90, -220], [-60, -150], [104, -120], [-110, -80]].map(([x, y]) => `<path d="${star(6, 2.5)}" transform="translate(${x} ${y})" fill="#fff"/>`).join('')}
    ${planet(-70, -200, 22, '#ff8a3d', true)}${planet(70, -180, 16, '#4aa8ff')}${planet(10, -230, 10, '#e53935')}
    <g transform="translate(0 ${live ? -60 : -40})">${rocketPic}${live ? `<path d="M-12 22 Q0 70 12 22 Z" fill="#ff8a1f"/><path d="M-6 22 Q0 50 6 22 Z" fill="${YEL}"/>` : ''}</g>
    <rect x="-40" y="-16" width="80" height="16" fill="${STONED}" ${S3}/>${label(0, 22, 'SPACE')}</g>`;
  // The big painting in a gold frame, behind a rope. live: the sun in the painting smiles and the frame shines.
  const painting = (live = false) => `<g>
    <rect x="-130" y="-300" width="260" height="190" rx="6" fill="${GOLD}" ${S}/><rect x="-112" y="-282" width="224" height="154" fill="#bfe6ff" ${S3}/>
    <path d="M-112 -180 Q-60 -220 -10 -186 Q40 -230 112 -190 V-128 H-112 Z" fill="#7ac46a"/><path d="M-112 -150 Q0 -170 112 -150 V-128 H-112 Z" fill="#5cb85c"/>
    ${[-70, -40, 40, 76].map((x, i) => `<g transform="translate(${x} ${-150 - (i % 2) * 6})"><path d="M0 0 V-30" stroke="#2e9e4f" stroke-width="4"/><circle cy="-34" r="9" fill="${YEL}" ${S3}/><circle cy="-34" r="3.5" fill="#8b5a2b"/></g>`).join('')}
    <circle cx="60" cy="-246" r="20" fill="${YEL}" ${S3}/>${live ? `${eyes(6, -250, 2.5, 60)}${smile(-242, 6, 60)}` : ''}
    <rect x="-112" y="-282" width="224" height="154" fill="none" ${S3}/>
    ${live ? [[-140, -310], [140, -300], [-136, -120]].map(([x, y]) => `<path d="${star(13, 5)}" transform="translate(${x} ${y})" fill="${YEL}" ${S3}/>`).join('') : ''}
    <path d="M-120 -6 V-70 M120 -6 V-70" ${SW(8)}/><path d="M-120 -70 Q0 -30 120 -70" fill="none" stroke="${RED}" stroke-width="9"/>
    ${[-120, 120].map(x => `<circle cx="${x}" cy="-74" r="8" fill="${GOLD}" ${S3}/><ellipse cx="${x}" cy="-4" rx="18" ry="6" fill="${GOLD}" ${S3}/>`).join('')}</g>`;
  const dino = (live = false) => `<g>${skeleton(live)}${label(170, 30, 'DINOSAUR')}</g>`;

  // ---------- Fossil Run: the explorer's tray (the goal) and the dinosaur nest (the decoy) ----------
  const tray = (n = 0, happy = false) => `<g>
    <path d="M-92 -50 H92 L80 0 H-80 Z" fill="${WOOD}" ${S}/><path d="M-84 -42 H84" stroke="${WOODD}" stroke-width="5"/>
    ${Array.from({ length: Math.min(n, 5) }, (_, i) => `<g transform="translate(${-60 + i * 30} ${-58 - (happy && i % 2 ? 6 : 0)}) scale(.5)">${ammonite(['#d9b98a', '#c9a878', '#e0c89c'][i % 3])}</g>`).join('')}
    <path d="M-92 -50 H92 L80 0 H-80 Z" fill="none" ${S}/>${txt(0, -14, 18, '#fff', 'FOSSILS')}</g>`;
  const nest = (shake = false) => `<g transform="scale(.9)">${egg(shake).replace(/<rect x="-52"[^>]*>/, '')}${[[-40, -60], [40, -66]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="28" fill="#e9d7ff" ${S3}/>`).join('')}</g>`;

  // ---------- Museum Train pictures (128 x 128 box) ----------
  const statue = `<g><rect x="-34" y="30" width="68" height="28" fill="${STONED}" ${S3}/>
    <path d="M-22 30 L-18 -10 Q-26 -14 -28 -30 L-16 -36 L-12 -18 H12 L16 -36 L28 -30 Q26 -14 18 -10 L22 30 Z" fill="${STONE}" ${S3}/>
    <circle cy="-40" r="16" fill="${STONE}" ${S3}/><path d="M-16 -44 Q-16 -60 0 -60 Q16 -60 16 -44 Q8 -52 -16 -44 Z" fill="${STONED}" ${S3}/><path d="M-6 -38 H-2 M2 -38 H6" ${SW(2)}/></g>`;
  const paintingPic = `<g transform="translate(0 94) scale(.46)">${painting(false).replace(/<path d="M-120 -6[\s\S]*$/, '</g>')}</g>`;
  const telescope = `<g><path d="M-30 56 L0 10 L30 56 M0 10 V56" ${SW(6)}/><g transform="rotate(-30)"><rect x="-52" y="-16" width="84" height="26" rx="6" fill="#1e5bd6" ${S}/><rect x="28" y="-20" width="24" height="34" rx="4" fill="${GOLD}" ${S3}/><rect x="-64" y="-10" width="14" height="14" rx="3" fill="${GOLD}" ${S3}/></g>
    <path d="${star(9, 4)}" transform="translate(44 -48)" fill="${YEL}" ${S3}/></g>`;
  const treasure = `<g><rect x="-50" y="-6" width="100" height="56" rx="6" fill="${WOODD}" ${S}/><path d="M-50 -6 Q0 -40 50 -6 Z" fill="${BROWN}" ${S}/>
    ${[-28, -10, 8, 26].map((x, i) => `<circle cx="${x}" cy="${-14 - (i % 2) * 8}" r="9" fill="${YEL}" ${S3}/>`).join('')}<path d="M-50 18 H50" stroke="${GOLD}" stroke-width="6"/><rect x="-8" y="8" width="16" height="20" rx="3" fill="${GOLD}" ${S3}/>
    <path d="${star(8, 3.5, 4)}" transform="translate(40 -36)" fill="#fff"/></g>`;
  const armour = `<g transform="translate(0 60) scale(.34)">${knight(false).replace(/<rect x="-83"[^>]*>|<rect x="-75" y="-30"[^>]*>/g, '')}</g>`;
  const volcano = `<g><path d="M-60 54 L-16 -20 H16 L60 54 Z" fill="#8a6a5a" ${S}/><path d="M-16 -20 Q-10 4 0 -6 Q10 8 16 -20 Z" fill="#ff8a1f" ${S3}/>
    <path d="M-18 -26 Q-30 -60 0 -56 Q-6 -78 20 -70 Q40 -66 30 -44 Q22 -30 10 -30 Z" fill="#c3cad6" ${S3}/>${[[-30, -40], [30, -20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ff8a1f" ${S3}/>`).join('')}</g>`;
  const mammoth = `<g><path d="M-40 40 V10 M-20 40 V14 M20 40 V14 M38 40 V10" ${SW(18)}/><path d="M-40 40 V10 M-20 40 V14 M20 40 V14 M38 40 V10" stroke="#8b5a2b" stroke-width="11" stroke-linecap="round"/>
    <ellipse cy="-4" rx="54" ry="34" fill="#8b5a2b" ${S}/><circle cx="-40" cy="-22" r="26" fill="#8b5a2b" ${S}/>
    <path d="M-58 -10 Q-70 20 -56 40" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M-58 -10 Q-70 20 -56 40" fill="none" stroke="#8b5a2b" stroke-width="10" stroke-linecap="round"/>
    <path d="M-48 -4 Q-40 20 -20 16" fill="none" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M-48 -4 Q-40 20 -20 16" fill="none" stroke="#fff6e0" stroke-width="6" stroke-linecap="round"/>
    ${eye(-36, -28, 4)}<path d="M-30 -40 Q-10 -44 -4 -30" fill="none" stroke="#6b4420" stroke-width="5" stroke-linecap="round"/><path d="M50 -6 Q62 0 58 14" fill="none" ${SW(5)}/></g>`;
  const pterodactyl = `<g><path d="M-4 0 L-62 -30 Q-56 0 -20 14 Z M4 0 L62 -30 Q56 0 20 14 Z" fill="#4aa8a0" ${S}/>
    <ellipse cy="6" rx="14" ry="22" fill="#4aa8a0" ${S}/><path d="M-6 -16 Q0 -40 20 -38 L48 -28 L20 -24 Q8 -22 6 -14 Z" fill="#4aa8a0" ${S3}/><path d="M0 -34 L-20 -50 L2 -40 Z" fill="#4aa8a0" ${S3}/>
    ${eye(10, -30, 3.5)}<path d="M-6 28 L-12 40 M6 28 L12 40" ${SW(4)}/></g>`;
  const astronaut = `<g><rect x="-28" y="-6" width="56" height="54" rx="14" fill="#fff" ${S}/><rect x="-14" y="8" width="28" height="18" rx="4" fill="${RED}" ${S3}/>
    <path d="M-28 4 L-46 26 M28 4 L46 26" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M-28 4 L-46 26 M28 4 L46 26" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
    <circle cy="-34" r="32" fill="#fff" ${S}/><circle cy="-34" r="22" fill="#1b2a5a" ${S3}/><g transform="translate(0 -34)">${eyes(7, 0, 3)}${smile(6, 6)}</g><path d="M-12 -46 Q-4 -52 4 -50" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/></g>`;
  const ITEMS = {
    skeleton: `<g transform="translate(6 46) scale(.19)">${skeleton(false)}</g>`, fossil: `<g transform="scale(1.6)">${ammonite()}</g>`, statue, painting: paintingPic, telescope, treasure,
    armour, volcano: `<g transform="translate(0 8) scale(.88)">${volcano}</g>`, mammoth: `<g transform="translate(4 0) scale(.86)">${mammoth}</g>`, castle: `<g transform="translate(0 12) scale(.8)">${LA.castlePic}</g>`, pterodactyl, astronaut: `<g transform="translate(0 8) scale(.85)">${astronaut}</g>`
  };

  // ---------- Long Ago or Now? (128 x 128 box) ----------
  const candle = `<g><ellipse cy="46" rx="40" ry="10" fill="${GOLD}" ${S3}/><path d="M28 44 Q50 40 46 26" fill="none" stroke="${OL}" stroke-width="4"/><rect x="-14" y="-20" width="28" height="64" rx="4" fill="#fff6e0" ${S}/>
    <path d="M0 -20 V-28" ${SW(3)}/><path d="M0 -54 Q14 -36 0 -26 Q-14 -36 0 -54 Z" fill="#ffb300" ${S3}/><path d="M0 -44 Q6 -34 0 -30 Q-6 -34 0 -44 Z" fill="${YEL}"/></g>`;
  const bulb = `<g><path d="M-30 -14 Q-30 -54 0 -54 Q30 -54 30 -14 Q30 4 16 18 V30 H-16 V18 Q-30 4 -30 -14 Z" fill="#fff6a8" ${S}/><rect x="-16" y="30" width="32" height="20" rx="3" fill="#9aa3b5" ${S3}/>
    <path d="M-8 22 V2 L0 -12 L8 2 V22" fill="none" stroke="#e0a030" stroke-width="3"/>${[[-48, -30], [48, -30], [0, -72]].map(([x, y]) => `<path d="M${x * .8} ${y * .8} L${x} ${y}" stroke="${YEL}" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`;
  const cart = `<g><path d="M-58 -2 H6 V-30 H-58 Z" fill="${WOOD}" ${S3}/><circle cx="-30" cy="10" r="18" fill="none" ${SW(5)}/><path d="M-30 -8 V28 M-48 10 H-12" ${SW(3)}/>
    <path d="M6 -14 L24 -14" ${SW(4)}/><ellipse cx="38" cy="-14" rx="22" ry="12" fill="#8b5a2b" ${S3}/><path d="M24 -8 V24 M50 -8 V24" ${SW(6)}/><path d="M24 -8 V24 M50 -8 V24" stroke="#8b5a2b" stroke-width="3"/>
    <path d="M50 -20 L58 -44 Q66 -50 70 -42 L62 -18 Z" fill="#8b5a2b" ${S3}/><circle cx="62" cy="-40" r="2" fill="${OL}"/><path d="M54 -36 Q48 -28 50 -20" stroke="#4a2a10" stroke-width="4" fill="none"/></g>`;
  const oldPhone = `<g><path d="M-44 40 L-34 0 H34 L44 40 Z" fill="${OL}"/><circle cy="20" r="18" fill="#fff" ${S3}/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4.5 - 2.4; return `<circle cx="${(Math.cos(a) * 12).toFixed(1)}" cy="${(20 + Math.sin(a) * 12).toFixed(1)}" r="2.6" fill="${OL}"/>`; }).join('')}
    <path d="M-50 -10 Q-52 -30 -36 -30 H36 Q52 -30 50 -10 L36 -6 L30 -18 H-30 L-36 -6 Z" fill="${OL}"/><path d="M38 -6 Q60 20 40 44" fill="none" stroke="${OL}" stroke-width="3" stroke-dasharray="4 3"/></g>`;
  const tablet = `<g><rect x="-50" y="-36" width="100" height="72" rx="10" fill="#30364a" ${S}/><rect x="-40" y="-28" width="80" height="56" rx="4" fill="${GLASS}"/>
    <g transform="translate(-14 -2) scale(.22)">${PA.FARM.dog(true)}</g><rect x="8" y="-14" width="22" height="22" rx="4" fill="${RED}"/><path d="M15 -9 L25 -3 L15 3 Z" fill="#fff"/></g>`;
  const washboard = `<g><ellipse cy="36" rx="54" ry="14" fill="#9aa3b5" ${S}/><path d="M-54 36 V10 Q0 -2 54 10 V36" fill="#c3cad6" ${S3}/>
    <g transform="rotate(-10)"><rect x="-22" y="-60" width="44" height="80" rx="4" fill="${WOOD}" ${S3}/><rect x="-16" y="-44" width="32" height="56" fill="#e0e4ea" ${S3}/>${[-36, -26, -16, -6, 4].map(y => `<path d="M-16 ${y} H16" stroke="#9aa3b5" stroke-width="3"/>`).join('')}</g></g>`;
  const washer = `<g><rect x="-46" y="-56" width="92" height="112" rx="8" fill="#fff" ${S}/><path d="M-46 -32 H46" ${SW(3)}/><circle cx="-30" cy="-44" r="5" fill="${RED}"/><rect x="0" y="-48" width="34" height="8" rx="3" fill="#9aa3b5"/>
    <circle cy="12" r="30" fill="#9aa3b5" ${S}/><circle cy="12" r="22" fill="#7fd0ff"/><path d="M-22 16 Q-10 6 0 16 T22 16 V22 Q0 34 -22 22 Z" fill="#4aa8ff"/><circle cx="-8" cy="4" r="4" fill="#fff" opacity=".7"/></g>`;
  const quill = `<g><path d="M-10 54 Q-8 30 6 18 Q40 -20 56 -56 Q30 -46 10 -20 Q-4 4 -10 54 Z" fill="#fff" ${S3}/><path d="M-10 54 Q4 0 52 -50" fill="none" stroke="#9aa3b5" stroke-width="3"/>
    <rect x="-56" y="20" width="40" height="34" rx="6" fill="#30364a" ${S}/><rect x="-46" y="12" width="20" height="10" rx="2" fill="#30364a" ${S3}/></g>`;
  const pencilNow = `<g transform="translate(-14 4)">${window.SchoolArt.ITEMS.pencil}</g><g transform="translate(26 20) scale(.5)"><rect x="-40" y="-50" width="80" height="100" rx="4" fill="#fff" ${S3}/>${[-26, -10, 6, 22].map(y => `<path d="M-28 ${y} H28" stroke="#9fc6ff" stroke-width="5"/>`).join('')}</g>`;
  const mobile = `<g><rect x="-30" y="-56" width="60" height="112" rx="12" fill="#30364a" ${S}/><rect x="-23" y="-44" width="46" height="86" rx="3" fill="${GLASS}"/>
    ${[[-12, -30], [4, -30], [-12, -12], [4, -12]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${['#e53935', '#2e9e4f', '#ffb300', '#8e5bd6'][i]}"/>`).join('')}<circle cy="48" r="4" fill="#9aa3b5"/></g>`;
  const oldCamera = `<g><path d="M-20 56 L0 18 L20 56 M0 18 V56" ${SW(5)}/><rect x="-40" y="-40" width="64" height="56" rx="4" fill="${WOODD}" ${S}/>
    <path d="M24 -32 L52 -40 V8 L24 0 Z" fill="#30364a" ${S3}/><circle cx="-8" cy="-12" r="12" fill="#30364a" ${S3}/><path d="M-40 -40 Q-60 -40 -60 -20 V16 Q-50 10 -40 16" fill="#30364a" ${S3}/></g>`;
  const AGO = { candle, cart: `<g transform="translate(-6 4) scale(.85)">${cart}</g>`, oldPhone, washboard, quill, oldCamera };
  const NOW = { bulb, car: TA.ITEMS.car, tablet, washer, pencil: pencilNow, mobile };
  const AGO_BIN = `<svg viewBox="-64 -64 128 128"><rect x="-54" y="-54" width="108" height="108" rx="6" fill="#c9a878" ${S}/><rect x="-42" y="-42" width="84" height="84" fill="#f2e2c0" ${S3}/>
    <g opacity=".75"><path d="M-30 30 V-4 L0 -26 L30 -4 V30 Z" fill="#c9a878" ${S3}/><rect x="-8" y="8" width="16" height="22" fill="#8b6a4a"/></g>
    <g transform="translate(30 -30) scale(.5)"><path d="M-20 -30 H20 L0 0 L20 30 H-20 L0 0 Z" fill="#fff6e0" ${S3}/></g></svg>`;
  const NOW_BIN = `<svg viewBox="-64 -64 128 128"><rect x="-56" y="-44" width="112" height="88" rx="12" fill="#30364a" ${S}/><rect x="-46" y="-34" width="92" height="68" rx="4" fill="#bfe6ff"/>
    <circle cx="-14" cy="-6" r="16" fill="${YEL}" ${S3}/><path d="${star(12, 5)}" transform="translate(24 -12)" fill="#ff6f9c" ${S3}/><path d="M-36 24 H36" stroke="#2e9e4f" stroke-width="8" stroke-linecap="round"/></svg>`;

  // ---------- Stickers for the six places in the museum ----------
  const SPOTS = {
    dino:     { name: 'Dinosaur', art: () => `<g transform="translate(14 40) scale(.24)">${skeleton(true)}</g>`, bg: '#fff1d6' },
    fossils:  { name: 'Fossils', art: () => `<g transform="translate(-14 4) scale(.9)">${ammonite()}</g><g transform="translate(22 18) scale(.5)">${trilobite}</g>`, bg: '#efe6d6' },
    toys:     { name: 'Old toys', art: () => `<g transform="translate(-18 20) scale(.6)">${rockingHorse}</g><g transform="translate(24 12) scale(.5)">${top}</g>`, bg: '#ffe3ef' },
    knight:   { name: 'Knight', art: () => `<g transform="translate(6 120) scale(.38)">${knight(true).replace(/<text[^>]*>CLANK!<\/text>/, '')}</g>`, bg: '#e3ecff' },
    space:    { name: 'Space', art: () => `<g transform="translate(0 70) scale(.36)">${space(true).replace(/<g transform="translate\(0 22\)">[\s\S]*?<\/g>$/, '')}</g>`, bg: '#1b2a5a' },
    painting: { name: 'Painting', art: () => `<g transform="translate(0 74) scale(.36)">${painting(true)}</g>`, bg: '#fff6cc' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="mus-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#mus-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;

  // ---------- The gallery room (w x h): stone walls and pillars, a polished floor from floorY ----------
  const hall = (w, h, floorY) => `<rect width="${w}" height="${h}" fill="#f1ebe0"/>
    ${Array.from({ length: Math.ceil(w / 400) + 1 }, (_, i) => `<rect x="${i * 400 - 30}" y="0" width="60" height="${floorY}" fill="${STONE}" stroke="${STONED}" stroke-width="4"/>`).join('')}
    <rect y="${floorY - 40}" width="${w}" height="40" fill="${STONED}"/><rect y="${floorY}" width="${w}" height="${h - floorY}" fill="#c8b89a"/>
    ${Array.from({ length: Math.ceil(w / 120) + 1 }, (_, i) => `<path d="M${i * 120} ${floorY} L${i * 120 - 80} ${h}" stroke="#b8a888" stroke-width="3"/>`).join('')}
    <path d="M0 ${floorY} H${w}" stroke="${OL}" stroke-width="5"/>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(ITEMS[id]);
  const agoSvg = id => svg(AGO[id] || NOW[id]);
  const cache = {};
  const image = (inner, box) => {
    const k = box + inner;
    if (!cache[k]) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${inner}</svg>`);
      cache[k] = img;
    }
    return cache[k];
  };
  const FOSSIL_C = ['#d9b98a', '#c9a878', '#e0c89c', '#d2b48c'];
  const fossilImage = i => image(ammonite(FOSSIL_C[i % FOSSIL_C.length]), '-34 -34 68 68');
  const trayImage = (n, happy) => image(tray(n, happy), '-100 -100 200 104');
  const nestImage = shake => image(nest(shake), '-80 -160 160 164');

  window.MuseumArt = { DINO, PART_IDS, ITEMS, AGO, NOW, AGO_BIN, NOW_BIN, SPOTS, FEN, pipAt, bone, part, skeleton, ghost, fen, ammonite, trilobite, fern, tooth, egg,
    glassCase, fossilCase, toysCase, top, doll, rockingHorse, knight, space, rocketPic, painting, dino, tray, nest, hall, plinth, label, sticker, svg, itemSvg, agoSvg,
    image, fossilImage, trayImage, nestImage, star, txt, eyes, smile };
})();
