// Seaside artwork, drawn in the app's style (navy outline, flat colours). The beach hut, the lifeguard tower with its red
// and yellow flag, the rock pool, the sandcastle, the ice cream van and the lighthouse, Kai the lifeguard and the cheeky
// seagull, plus the pictures for the games. Pip's family come from the other worlds: Mum (SchoolArt.pipMum), Grandad
// (BusArt.grandad) and the five puppies (PupArt.puppy). People and big things stand with their base at 0,0; small
// pictures (Seaside Train, Sink or Float?, Pack for the Beach) are drawn in a 128 x 128 box centred on 0,0.
(function () {
  const { OL, S, S3 } = Art;
  const BA = window.BusArt;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r, cx = 0) => eye(cx - dx, y, r) + eye(cx + dx, y, r);
  const smile = (y, w = 8, cx = 0) => `<path d="M${cx - w} ${y} Q${cx} ${y + w * .9} ${cx + w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4, cx = 0) => `<circle cx="${cx - dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${cx + dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const RED = '#e53935', YEL = '#ffd21f', SEA = '#3aa7d8', SAND = '#f6dc9a', GLASS = '#bfe6ff', WOOD = '#c98b4e', ROCK = '#8a93a6';

  // A star (or starfish) path with n points, outer radius R and inner radius r, centred on 0,0.
  const star = (R, r, n = 5) => 'M' + Array.from({ length: n * 2 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R;
    return `${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)}`;
  }).join(' L') + ' Z';
  // A wavy white line across the sea, from x0 to x1 at height y.
  const waves = (x0, x1, y, amp = 10, len = 80, c = '#fff', w = 5) => {
    let d = `M${x0} ${y}`;
    for (let x = x0; x < x1; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity=".75"/>`;
  };
  // Sky, sea and sand, w x h, with the sea from seaY down to the sand at sandY.
  const beach = (w, h, seaY, sandY, sky = '#bfe6ff', sea = SEA) => `<rect width="${w}" height="${h}" fill="${sky}"/>
    <rect y="${seaY}" width="${w}" height="${sandY - seaY + 30}" fill="${sea}"/>
    ${waves(-20, w, seaY + 30, 8, 90)}${waves(20, w, seaY + (sandY - seaY) * .6, 8, 110)}
    <path d="M0 ${sandY} Q${w / 4} ${sandY - 22} ${w / 2} ${sandY} T${w} ${sandY} V${h} H0 Z" fill="${SAND}"/>
    <path d="M0 ${sandY} Q${w / 4} ${sandY - 22} ${w / 2} ${sandY} T${w} ${sandY}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".9"/>`;
  const sun = (x, y, r = 50) => `<g transform="translate(${x} ${y})"><g stroke="#ffb300" stroke-width="8" stroke-linecap="round">${Array.from({ length: 8 }, (_, i) => {
    const a = i * Math.PI / 4; return `<path d="M${(Math.cos(a) * r * 1.3).toFixed(1)} ${(Math.sin(a) * r * 1.3).toFixed(1)} L${(Math.cos(a) * r * 1.6).toFixed(1)} ${(Math.sin(a) * r * 1.6).toFixed(1)}"/>`; }).join('')}</g>
    <circle r="${r}" fill="${YEL}" ${S}/></g>`;

  // ---------- Pip, wearing his sun hat and sunglasses ----------
  const pipAt = (x, y, w) => BA.pipAt(x, y, w, 'seaside');

  // ---------- Kai the lifeguard (feet at 0,0, about 240 tall): red shorts, yellow top, red cap and a whistle ----------
  const KAI = '#a86e44';
  const kai = (wave = false) => {
    const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${KAI}" stroke-width="12" stroke-linecap="round"/><circle cx="${x2}" cy="${y2 + 4}" r="9" fill="${KAI}" ${S3}/>`;
    return `<g class="kai">
      <rect x="-22" y="-90" width="16" height="86" rx="6" fill="${KAI}" ${S3}/><rect x="6" y="-90" width="16" height="86" rx="6" fill="${KAI}" ${S3}/>
      <ellipse cx="-15" cy="-3" rx="15" ry="6" fill="#1e5bd6" ${S3}/><ellipse cx="15" cy="-3" rx="15" ry="6" fill="#1e5bd6" ${S3}/>
      <path d="M-40 -104 H40 L42 -62 H4 L0 -72 L-4 -62 H-42 Z" fill="${RED}" ${S3}/>
      <path d="M-38 -160 Q0 -172 38 -160 L40 -100 H-40 Z" fill="${YEL}" ${S}/>
      ${txt(0, -118, 13, RED, 'LIFEGUARD')}
      <path d="M-12 -164 Q-2 -146 8 -140" fill="none" stroke="${RED}" stroke-width="3"/><rect x="4" y="-144" width="18" height="10" rx="4" fill="#c3cad6" ${S3}/>
      ${arm(-36, -154, -52, -104)}
      ${wave ? arm(36, -154, 62, -206) : arm(36, -154, 52, -104)}
      <circle cy="-196" r="27" fill="${KAI}" ${S}/>
      <g fill="#1b1410" ${S3}>${[-18, -6, 6, 18].map((x, i) => `<circle cx="${x}" cy="${-218 + (i % 2) * 2}" r="9"/>`).join('')}</g>
      <path d="M-27 -212 Q-27 -236 0 -236 Q27 -236 27 -212 Z" fill="${RED}" ${S3}/><path d="M18 -214 Q44 -214 48 -206 Q34 -202 16 -206 Z" fill="${RED}" ${S3}/>
      ${eyes(10, -196, 3)}${cheeks(17, -184, 4)}${smile(-182, 9)}</g>`;
  };

  // ---------- The cheeky seagull, facing right (feet at 0,0, about 90 tall). fly: wings up. chip: a chip in its beak ----------
  const gull = ({ fly = false, chip = false } = {}) => `<g class="gull">
    ${fly ? `<path d="M-10 -50 Q-40 -110 -70 -96 Q-46 -80 -24 -40 Z" fill="#c3cad6" ${S3}/>` : `<path d="M-6 0 V-22 M8 0 V-22" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M-6 0 V-22 M8 0 V-22" stroke="#f08a24" stroke-width="4" stroke-linecap="round"/>
      <path d="M-16 0 H2 M0 0 H16" stroke="#f08a24" stroke-width="5" stroke-linecap="round"/>`}
    <path d="M-30 -46 L-60 -40 L-56 -30 L-30 -32 Z" fill="#596178" ${S3}/>
    <ellipse cx="0" cy="-40" rx="36" ry="22" fill="#fff" ${S}/>
    ${fly ? `<path d="M0 -50 Q20 -116 56 -110 Q36 -84 18 -40 Z" fill="#c3cad6" ${S3}/>` : `<path d="M-28 -46 Q2 -60 24 -42 Q0 -28 -28 -36 Z" fill="#c3cad6" ${S3}/>`}
    <circle cx="28" cy="-66" r="18" fill="#fff" ${S}/>${eye(32, -70, 3.5)}
    <path d="M40 -68 L64 -63 L42 -58 Z" fill="${YEL}" ${S3}/><circle cx="56" cy="-62" r="2.5" fill="${RED}"/>
    ${chip ? `<rect x="52" y="-70" width="34" height="9" rx="2" fill="#ffd36b" transform="rotate(14 52 -66)" ${S3}/>` : ''}</g>`;

  // ---------- Things on the beach (base at 0,0) ----------
  // The beach hut. open: the doors open, with towels and a bucket inside.
  const hut = (open = false) => `<g>
    <rect x="-90" y="-220" width="180" height="214" fill="#fff"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-90 + i * 30}" y="-220" width="15" height="214" fill="#4aa8ff"/>`).join('')}
    <rect x="-90" y="-220" width="180" height="214" fill="none" ${S}/>
    <path d="M-110 -212 L0 -300 L110 -212 Z" fill="${RED}" ${S}/>${txt(0, -236, 26, '#fff', '7')}
    ${open ? `<rect x="-46" y="-160" width="92" height="154" fill="#5a3b25" ${S3}/>
      <path d="M-40 -150 H40" stroke="#8b5a2b" stroke-width="5"/><rect x="-34" y="-148" width="24" height="60" rx="4" fill="#ff6f9c" ${S3}/><rect x="-6" y="-148" width="24" height="60" rx="4" fill="${YEL}" ${S3}/>
      <g transform="translate(18 -6) scale(.36)"><path d="M-62 -90 H62 L50 0 H-50 Z" fill="#2e9e4f" ${S}/></g>
      <path d="M-46 -160 L-80 -150 V-12 L-46 -6 Z M46 -160 L80 -150 V-12 L46 -6 Z" fill="${YEL}" ${S3}/>`
      : `<rect x="-46" y="-160" width="92" height="154" fill="${YEL}" ${S3}/><path d="M0 -160 V-6" ${SW(4)}/><circle cx="-10" cy="-80" r="5" fill="${OL}"/><circle cx="10" cy="-80" r="5" fill="${OL}"/>`}
    <rect x="-110" y="-8" width="220" height="14" rx="4" fill="${WOOD}" ${S3}/></g>`;

  // A beach safety flag: red over yellow. Pole base at 0,0, s times about 120 tall.
  const flag = (s = 1) => `<g transform="scale(${s})"><path d="M0 0 V-120" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M0 0 V-120" stroke="#e8edf3" stroke-width="3"/>
    <g class="flag-wave"><rect x="3" y="-118" width="58" height="20" fill="${RED}"/><rect x="3" y="-98" width="58" height="20" fill="${YEL}"/><rect x="3" y="-118" width="58" height="40" fill="none" ${S3}/></g></g>`;
  // The lifeguard tower, with Kai on top and a flag beside it. wave: Kai waves.
  const tower = (wave = false) => `<g>
    <g transform="translate(118 0)">${flag(1.9)}</g>
    <path d="M-62 0 L-44 -182 M62 0 L44 -182 M-56 -60 L50 -126 M56 -60 L-50 -126" stroke="${OL}" stroke-width="16" stroke-linecap="round"/>
    <path d="M-62 0 L-44 -182 M62 0 L44 -182 M-56 -60 L50 -126 M56 -60 L-50 -126" stroke="${WOOD}" stroke-width="9" stroke-linecap="round"/>
    <g transform="translate(0 -196) scale(.72)">${kai(wave)}</g>
    <path d="M-80 -196 V-250 H80 V-196 M-80 -224 H80" fill="none" stroke="${OL}" stroke-width="10" stroke-linejoin="round"/><path d="M-80 -196 V-250 H80 V-196 M-80 -224 H80" fill="none" stroke="#fff" stroke-width="5"/>
    <rect x="-90" y="-200" width="180" height="22" rx="5" fill="${WOOD}" ${S3}/>
    <rect x="-52" y="-176" width="104" height="30" rx="5" fill="${RED}" ${S3}/>${txt(0, -154, 18, '#fff', 'LIFEGUARD')}</g>`;

  // A crab, centred on 0,0, about 120 wide. wave: claws up.
  const crab = (wave = false, c = '#e8522a') => `<g class="crab">
    ${[-1, 1].map(k => [0, 1, 2].map(j => `<path d="M${k * 26} ${4 + j * 6} L${k * (50 + j * 4)} ${16 + j * 10}" ${SW(5)}/>`).join('')).join('')}
    ${[-1, 1].map(k => `<path d="M${k * 30} -6 L${k * 46} ${wave ? -40 : -20}" ${SW(6)}/>
      <g transform="translate(${k * 50} ${wave ? -50 : -30}) scale(${k} 1)"><path d="M-12 8 Q-16 -14 4 -16 L14 -4 L2 -2 L12 6 Q4 18 -12 8 Z" fill="${c}" ${S3}/></g>`).join('')}
    <ellipse cy="2" rx="40" ry="24" fill="${c}" ${S}/>
    <path d="M-10 -18 V-32 M10 -18 V-32" ${SW(4)}/><circle cx="-10" cy="-34" r="7" fill="#fff" ${S3}/><circle cx="10" cy="-34" r="7" fill="#fff" ${S3}/>
    <circle cx="-9" cy="-34" r="3" fill="${OL}"/><circle cx="11" cy="-34" r="3" fill="${OL}"/>${smile(4, 10)}${cheeks(24, 0, 4)}</g>`;
  // A starfish, centred on 0,0, radius about 50.
  const starfish = (c = '#ff8a3d', face = true) => `<g><path d="${star(52, 24)}" fill="${c}" ${S}/>
    ${[[0, -32], [30, -10], [18, 26], [-18, 26], [-30, -10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" opacity=".7"/>`).join('')}
    ${face ? `${eyes(8, -4, 3.5)}${smile(6, 6)}` : ''}</g>`;
  const shrimp = `<g><path d="M-24 0 Q-20 -24 6 -22 Q26 -18 24 4 Q14 -6 4 -4 Q-8 -2 -10 10 Z" fill="#ff9e80" ${S3}/><path d="M24 -6 L40 -24 M22 -2 L42 -12" ${SW(2)}/>${eye(14, -12, 2.5)}</g>`;
  const seaweed = (h = 60, c = '#2e9e4f') => `<path d="M0 0 Q-12 ${-h * .3} 0 ${-h * .5} Q12 ${-h * .7} 0 ${-h}" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M0 0 Q-12 ${-h * .3} 0 ${-h * .5} Q12 ${-h * .7} 0 ${-h}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
  // The rock pool, about 260 wide. peek: the crab climbs out and waves.
  const pool = (peek = false, empty = false) => `<g>
    <path d="M-130 0 Q-140 -56 -96 -70 Q-76 -104 -30 -88 Q10 -116 56 -90 Q108 -100 124 -50 Q136 -16 130 0 Z" fill="${ROCK}" ${S}/>
    <path d="M-96 -70 Q-90 -84 -70 -84 M56 -90 Q76 -96 92 -88" fill="none" stroke="#b3bbc9" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="0" cy="-38" rx="98" ry="32" fill="${SEA}" ${S3}/><ellipse cx="-24" cy="-48" rx="40" ry="8" fill="#9fdcff" opacity=".7"/>
    <g transform="translate(-70 -22)">${seaweed(44)}</g><g transform="translate(76 -24)">${seaweed(36, '#5cb85c')}</g>
    ${empty ? '' : `<g transform="translate(-40 -36) scale(.34)">${starfish()}</g><g transform="translate(14 -40) scale(.7)">${shrimp}</g>
    <g transform="translate(${peek ? 70 : 50} ${peek ? -96 : -34}) scale(.4)">${crab(peek)}</g>`}</g>`;

  // A sandcastle, about 210 wide and 220 tall. flag: a little red flag on the top tower.
  const castle = (wave = false) => {
    const tw = (x, w, top) => `<rect x="${x}" y="${top}" width="${w}" height="${-top}" fill="#f2c879" ${S}/>
      ${[0, 2, 4].map(k => `<rect x="${x + k * w / 5}" y="${top - 18}" width="${w / 5}" height="20" fill="#f2c879" ${S3}/>`).join('')}`;
    return `<g>${tw(-106, 66, -120)}${tw(40, 66, -120)}
      <rect x="-80" y="-84" width="160" height="84" fill="#f2c879" ${S}/>
      ${tw(-38, 76, -160)}
      <path d="M-20 0 V-34 Q0 -56 20 -34 V0 Z" fill="#c98b4e" ${S3}/>
      <rect x="-82" y="-96" width="18" height="22" rx="9" fill="#c98b4e"/><rect x="64" y="-96" width="18" height="22" rx="9" fill="#c98b4e"/><rect x="-8" y="-130" width="16" height="22" rx="8" fill="#c98b4e"/>
      <g transform="translate(-50 -40) scale(.22)">${starfish('#ff8fa3', false)}</g><g transform="translate(52 -40) scale(.3)">${scallop('#fff')}</g>
      <path d="M0 -178 V-236" ${SW(4)}/><g class="${wave ? 'flag-wave' : ''}"><path d="M2 -236 L44 -224 L2 -212 Z" fill="${RED}" ${S3}/></g>
      <path d="M-130 0 Q-110 -8 -90 0 M90 0 Q110 -8 130 0" fill="none" stroke="#e0c07a" stroke-width="8" stroke-linecap="round"/></g>`;
  };

  // The ice cream van, facing right, wheels on 0,0, 300 wide. open: the hatch opens and it plays its tune.
  const cone = (s = 1, scoops = ['#ffb3c1', '#fff6e6']) => `<g transform="scale(${s})"><path d="M-22 -10 L0 50 L22 -10 Z" fill="#e0a050" ${S3}/>
    <path d="M-14 4 L8 -6 M-8 22 L14 8 M-16 -6 L4 32" stroke="#b9772e" stroke-width="3"/>
    ${scoops.map((c, i) => `<circle cy="${-18 - i * 24}" r="${22 - i * 2}" fill="${c}" ${S3}/>`).join('')}<circle cx="2" cy="${-38 - (scoops.length - 1) * 24}" r="5" fill="${RED}" ${S3}/></g>`;
  const van = (open = false) => `<g>
    <g transform="translate(-40 -214) scale(.9)">${cone(1, ['#ffb3c1', '#c8f0d8'])}</g>
    <path d="M-150 -30 V-168 Q-150 -186 -132 -186 H70 Q90 -186 100 -168 L140 -104 Q150 -98 150 -82 V-30 Z" fill="#fff" ${S}/>
    <path d="M-148 -66 H148" stroke="#ff6f9c" stroke-width="22"/>${txt(-36, -58, 20, '#fff', 'ICE CREAM')}
    <path d="M78 -170 Q92 -170 100 -156 L128 -106 H78 Z" fill="${GLASS}" ${S3}/>
    ${open ? `<rect x="-128" y="-160" width="160" height="72" rx="6" fill="#ffe3ef" ${S3}/>
      ${[0, 1, 2].map(i => `<g transform="translate(${-96 + i * 50} -110) scale(.5)">${cone(1, [['#ffb3c1'], ['#8b5a2b'], ['#fff6e6']][i])}</g>`).join('')}
      <g class="notes" fill="${OL}">${[[60, -230], [100, -260], [140, -224]].map(([x, y]) => `<path d="M${x} ${y} V${y - 26} L${x + 14} ${y - 30} V${y - 4}" fill="none" ${SW(4)}/><ellipse cx="${x - 5}" cy="${y}" rx="7" ry="5"/>`).join('')}</g>`
      : `<rect x="-128" y="-160" width="160" height="72" rx="6" fill="#ff8fb1" ${S3}/><path d="M-120 -124 H24" stroke="#fff" stroke-width="4" opacity=".6"/>`}
    <path d="M-136 -160 Q-120 -176 -104 -160 Q-88 -176 -72 -160 Q-56 -176 -40 -160 Q-24 -176 -8 -160 Q8 -176 24 -160 Q40 -176 48 -164" fill="#ffd1e0" ${S3}/>
    <rect x="140" y="-58" width="12" height="14" rx="3" fill="${YEL}" ${S3}/>
    ${[-92, 96].map(x => `<circle cx="${x}" cy="-24" r="24" fill="#30364a" ${S}/><circle cx="${x}" cy="-24" r="9" fill="#c3cad6" ${S3}/>`).join('')}</g>`;

  // The lighthouse on its rock, about 340 tall. lit: the light shines out across the sea.
  const lhw = y => 44 - ((-40 - y) / 210) * 14; // half-width of the tower at height y
  const band = (y1, y2) => `<path d="M${-lhw(y1)} ${y1} L${-lhw(y2)} ${y2} H${lhw(y2)} L${lhw(y1)} ${y1} Z" fill="${RED}"/>`;
  const lighthouse = (lit = false) => `<g>
    ${lit ? `<path d="M0 -284 L-300 -340 L-300 -226 Z M0 -284 L300 -340 L300 -226 Z" fill="#fff6a8" opacity=".7"/>` : ''}
    <path d="M-44 -40 L-30 -250 H30 L44 -40 Z" fill="#fff"/>${band(-80, -120)}${band(-160, -200)}
    <path d="M-44 -40 L-30 -250 H30 L44 -40 Z" fill="none" ${S}/>
    <path d="M-12 -40 V-66 Q0 -80 12 -66 V-40 Z" fill="#1e3a7a" ${S3}/><rect x="-8" y="-144" width="16" height="20" rx="8" fill="${GLASS}" ${S3}/>
    <rect x="-46" y="-262" width="92" height="14" rx="4" fill="#30364a" ${S3}/>
    <rect x="-26" y="-306" width="52" height="44" rx="6" fill="${lit ? '#fff3a0' : GLASS}" ${S3}/>${lit ? `<circle cy="-284" r="12" fill="${YEL}"/>` : ''}
    <path d="M-32 -306 Q0 -346 32 -306 Z" fill="${RED}" ${S3}/><circle cy="-336" r="5" fill="${OL}"/>
    <path d="M-100 0 Q-108 -34 -66 -44 Q-24 -64 26 -48 Q92 -44 100 0 Z" fill="${ROCK}" ${S}/></g>`;

  // ---------- Shells (centred on 0,0, about 64 across) and the sand bucket (the Shell Run goal) ----------
  const scallop = (c = '#ffb3c1') => `<g><path d="M0 26 L-30 -4 Q-32 -32 0 -34 Q32 -32 30 -4 Z" fill="${c}" ${S3}/>
    ${[-20, -10, 0, 10, 20].map(x => `<path d="M0 24 L${x} ${-30 + Math.abs(x) * .3}" stroke="#d4848f" stroke-width="2.5" opacity=".6"/>`).join('')}
    <path d="M-12 24 H12 L8 34 H-8 Z" fill="${c}" ${S3}/></g>`;
  const spiral = (c = '#ffe0a3') => `<g><path d="M-30 18 Q-34 -12 -4 -28 Q30 -36 30 -2 Q30 22 2 24 Q-18 24 -14 6 Q-10 -8 6 -6 Q14 -2 10 8" fill="${c}" ${S3}/>
    <path d="M30 -2 L40 8 L24 14 Z" fill="${c}" ${S3}/></g>`;
  const SHELLS = ['#ffb3c1', '#ffe0a3', '#f7c6a3', '#e9d7ff', '#ffffff', '#ffd2a8'];
  const shell = i => (i % 2 ? spiral : scallop)(SHELLS[i % SHELLS.length]);
  const spade = (c = '#1e5bd6') => `<g><rect x="-5" y="-110" width="10" height="70" rx="4" fill="${c}" ${S3}/><rect x="-16" y="-120" width="32" height="12" rx="5" fill="${c}" ${S3}/>
    <path d="M-20 -44 H20 V-12 Q0 6 -20 -12 Z" fill="${c}" ${S3}/></g>`;
  // The sand bucket with a spade beside it, base at 0,0, about 170 wide. n: shells in it. happy: they jiggle.
  const sandBucket = (n = 0, happy = false, c = '#ff6f9c') => `<g>
    <g transform="translate(84 0) rotate(14)">${spade()}</g>
    <path d="M-56 -86 Q0 -150 56 -86" fill="none" stroke="${OL}" stroke-width="8"/><path d="M-56 -86 Q0 -150 56 -86" fill="none" stroke="#e8edf3" stroke-width="3"/>
    ${Array.from({ length: Math.min(n, 5) }, (_, i) => `<g transform="translate(${-40 + i * 20} ${-96 - (i % 2) * 8 - (happy ? (i % 2 ? 6 : 0) : 0)}) scale(.42)">${shell(i)}</g>`).join('')}
    <path d="M-62 -90 H62 L50 0 H-50 Z" fill="${c}" ${S}/><rect x="-66" y="-98" width="132" height="14" rx="6" fill="${c}" ${S3}/>
    <g transform="translate(0 -42) scale(.3)"><path d="${star(52, 24)}" fill="${YEL}" ${S}/></g></g>`;

  // ---------- Seaside Train pictures (128 x 128 box) ----------
  const jellyfish = `<g>${[-24, -8, 8, 24].map((x, i) => `<path d="M${x} 4 Q${x + (i % 2 ? 10 : -10)} 26 ${x} 40 Q${x + (i % 2 ? -8 : 8)} 52 ${x} 60" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M${x} 4 Q${x + (i % 2 ? 10 : -10)} 26 ${x} 40 Q${x + (i % 2 ? -8 : 8)} 52 ${x} 60" fill="none" stroke="#d58cff" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M-44 6 Q-44 -46 0 -46 Q44 -46 44 6 Q34 0 22 6 Q11 0 0 6 Q-11 0 -22 6 Q-34 0 -44 6 Z" fill="#e9b8ff" ${S}/>
    <ellipse cx="-14" cy="-30" rx="10" ry="6" fill="#fff" opacity=".6"/>${eyes(12, -14, 4)}${smile(-4, 7)}${cheeks(24, -6, 4)}</g>`;
  const octopus = `<g>${Array.from({ length: 6 }, (_, i) => { const x = -40 + i * 16; return `<path d="M${x * .6} 10 Q${x} 36 ${x * 1.2} 50 Q${x * 1.2 + (i < 3 ? -12 : 12)} 58 ${x * 1.2 + (i < 3 ? -16 : 16)} 48" fill="none" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M${x * .6} 10 Q${x} 36 ${x * 1.2} 50 Q${x * 1.2 + (i < 3 ? -12 : 12)} 58 ${x * 1.2 + (i < 3 ? -16 : 16)} 48" fill="none" stroke="#8e5bd6" stroke-width="8" stroke-linecap="round"/>`; }).join('')}
    <ellipse cy="-14" rx="38" ry="40" fill="#8e5bd6" ${S}/><circle cx="-16" cy="-36" r="6" fill="#b48cf0"/><circle cx="18" cy="-30" r="4" fill="#b48cf0"/>
    ${eyes(13, -14, 5)}${smile(4, 8)}${cheeks(24, 0, 5)}</g>`;
  const suncream = `<g transform="rotate(-12)"><rect x="-26" y="-40" width="52" height="88" rx="14" fill="#ffd21f" ${S}/><rect x="-12" y="-58" width="24" height="20" rx="4" fill="#ff8a1f" ${S3}/>
    <rect x="-20" y="-14" width="40" height="40" rx="8" fill="#fff" ${S3}/><g transform="translate(0 6) scale(.22)">${sun(0, 0, 50).replace(/^<g transform="translate\(0 0\)">/, '<g>')}</g>
    ${txt(0, 42, 11, '#c4501e', 'SPF 50')}</g>`;
  const icecream = `<g transform="translate(0 4) scale(1.15)">${cone(1, ['#ffb3c1', '#fff6e6'])}<path d="M10 -50 L26 -76" stroke="#8b5a2b" stroke-width="9" stroke-linecap="round"/></g>`;
  const sunglasses = `<g><path d="M-58 -10 L-50 -24 M58 -10 L50 -24" ${SW(6)}/>
    <path d="M-54 -14 H-6 Q-6 22 -30 22 Q-54 22 -54 -14 Z M6 -14 H54 Q54 22 30 22 Q6 22 6 -14 Z" fill="#1b2233" ${S}/>
    <path d="M-6 -10 Q0 -16 6 -10" fill="none" ${SW(5)}/><path d="M-44 -6 L-34 -6 M16 -6 L26 -6" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></g>`;
  const deckchair = `<g><path d="M-30 50 L10 -30 M30 50 L-10 -30" ${SW(7)}/><path d="M-34 4 L-6 -36 L24 30 L-4 44 Z" fill="#fff" ${S3}/>
    <path d="M-24 -10 L-12 -27 L18 37 L6 42 Z" fill="${RED}"/><path d="M-34 4 L-6 -36 L24 30 L-4 44 Z" fill="none" ${S3}/></g>`;
  const holiday = `<g><rect x="-60" y="-60" width="120" height="120" rx="14" fill="#bfe6ff"/><rect x="-60" y="4" width="120" height="30" fill="${SEA}"/>
    <path d="M-60 30 Q-30 18 0 28 T60 26 V60 H-60 Z" fill="${SAND}"/>${waves(-56, 60, 14, 4, 40, '#fff', 3)}
    <g transform="translate(-28 -30) scale(.36)">${sun(0, 0, 50).replace(/^<g transform="translate\(0 0\)">/, '<g>')}</g>
    <g transform="translate(22 18) scale(.7)">${deckchair}</g><rect x="-60" y="-60" width="120" height="120" rx="14" fill="none" ${S}/></g>`;
  const ITEMS = {
    sandcastle: `<g transform="translate(-2 56) scale(.5)">${castle()}</g>`,
    seagull: `<g transform="translate(-10 50) scale(1.15)">${gull()}</g>`,
    starfish: `<g transform="rotate(10) scale(1.05)">${starfish()}</g>`,
    jellyfish, octopus, suncream, icecream, sunglasses, holiday,
    lighthouse: `<g transform="translate(0 60) scale(.36)">${lighthouse(true)}</g>`,
    bucket: `<g transform="translate(-14 52) scale(.72)">${sandBucket(0)}</g>`,
    seaweed: `<g><rect x="-60" y="-60" width="120" height="120" rx="14" fill="#cdeeff"/>
      <g transform="translate(-30 56)">${seaweed(100)}</g><g transform="translate(0 56)">${seaweed(76, '#5cb85c')}</g><g transform="translate(28 56)">${seaweed(108, '#3a8f3a')}</g>
      ${[[-12, -40, 6], [14, -24, 4], [40, -50, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S3}/>`).join('')}<rect x="-60" y="-60" width="120" height="120" rx="14" fill="none" ${S}/></g>`
  };

  // ---------- Sink or Float? things (128 x 128 box). The tank holds them at about 110 across ----------
  const apple = `<g><path d="M0 -30 Q-4 -46 6 -54" fill="none" ${SW(6)}/><path d="M4 -42 Q24 -56 32 -38 Q16 -32 4 -42 Z" fill="#2e9e4f" ${S3}/>
    <path d="M0 -28 Q-26 -44 -42 -18 Q-54 16 -26 40 Q-12 50 0 42 Q12 50 26 40 Q54 16 42 -18 Q26 -44 0 -28 Z" fill="${RED}" ${S}/><ellipse cx="-20" cy="-12" rx="8" ry="12" fill="#fff" opacity=".45"/></g>`;
  const duck = `<g><path d="M-48 0 Q-50 40 -6 42 Q44 44 48 6 Q36 12 20 4 Q-10 -10 -48 0 Z" fill="${YEL}" ${S}/>
    <path d="M-20 10 Q0 0 18 18 Q-4 26 -20 10 Z" fill="#f2b705" ${S3}/><circle cx="-18" cy="-24" r="24" fill="${YEL}" ${S}/>
    <path d="M-40 -24 Q-60 -26 -62 -16 Q-50 -10 -38 -16 Z" fill="#ff8a1f" ${S3}/>${eye(-24, -30, 4)}${cheeks(6, -16, 4, -14)}</g>`;
  const beachBall = `<g><circle r="46" fill="#fff" ${S}/><path d="M0 -46 Q-30 0 0 46 Q-46 40 -46 0 Q-46 -40 0 -46 Z" fill="${RED}"/><path d="M0 -46 Q30 0 0 46 Q46 40 46 0 Q46 -40 0 -46 Z" fill="#1e5bd6"/>
    <path d="M0 -46 Q-12 0 0 46 Q12 0 0 -46 Z" fill="${YEL}"/><circle r="46" fill="none" ${S}/><circle cy="-2" r="8" fill="#fff" ${S3}/></g>`;
  const leaf = `<g transform="rotate(-30)"><path d="M0 -50 Q38 -20 0 50 Q-38 -20 0 -50 Z" fill="#5cb85c" ${S}/><path d="M0 -40 V56" ${SW(3)}/>
    <path d="M0 -14 L-16 -26 M0 4 L18 -8 M0 22 L-14 10" ${SW(2.5)}/></g>`;
  const boat = `<g><path d="M-52 4 H52 L38 34 H-38 Z" fill="${RED}" ${S}/><path d="M0 4 V-50" ${SW(5)}/>
    <path d="M4 -48 L42 -4 H4 Z" fill="#fff" ${S3}/><path d="M-4 -40 L-34 -4 H-4 Z" fill="${YEL}" ${S3}/><path d="M-30 18 H30" stroke="#fff" stroke-width="5"/></g>`;
  const sponge = `<g><rect x="-48" y="-30" width="96" height="60" rx="12" fill="#ffe066" ${S}/><rect x="-48" y="-30" width="96" height="18" rx="9" fill="#5cb85c" ${S3}/>
    ${[[-30, 4], [-8, 14], [16, 2], [32, 18], [-20, 20], [6, -2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#e0b100"/>`).join('')}</g>`;
  const stone = `<g><path d="M-46 14 Q-50 -20 -16 -30 Q20 -40 42 -16 Q56 10 34 28 Q0 40 -28 32 Q-44 28 -46 14 Z" fill="#9aa3b5" ${S}/>
    <path d="M-24 -14 Q-10 -22 4 -18" fill="none" stroke="#c3cad6" stroke-width="5" stroke-linecap="round"/></g>`;
  const key = `<g transform="rotate(-30)"><circle cx="-28" r="22" fill="#ffc94d" ${S}/><circle cx="-28" r="9" fill="#fff6e6" ${S3}/>
    <path d="M-6 -7 H50 V7 H40 V20 H30 V7 H22 V16 H12 V7 H-6 Z" fill="#ffc94d" ${S3}/></g>`;
  const coin = `<g><circle r="40" fill="#ffc94d" ${S}/><circle r="30" fill="none" stroke="#e0a030" stroke-width="4"/>${txt(0, 13, 36, '#b9772e', '£1')}</g>`;
  const spoon = `<g transform="rotate(-40)"><rect x="-6" y="-8" width="12" height="62" rx="6" fill="#c3cad6" ${S3}/><ellipse cy="-30" rx="20" ry="28" fill="#c3cad6" ${S}/>
    <ellipse cx="-6" cy="-36" rx="5" ry="10" fill="#fff" opacity=".7"/></g>`;
  const marble = `<g><circle r="34" fill="#7fd0ff" fill-opacity=".85" ${S}/><path d="M-20 -6 Q0 -30 22 -8 Q4 2 -20 -6 Z M-18 14 Q4 24 20 12" fill="#1e5bd6" opacity=".7"/>
    <ellipse cx="-12" cy="-16" rx="7" ry="4" fill="#fff" opacity=".8"/></g>`;
  const SINKFLOAT = {
    apple, duck, ball: beachBall, leaf, boat, sponge,
    stone, key, coin, spoon, marble, shell: `<g transform="scale(1.3)">${scallop('#ffd2a8')}</g>`
  };

  // ---------- Pack for the Beach things (128 x 128 box) and the two places they go ----------
  const sunhat = `<g><ellipse cy="10" rx="58" ry="14" fill="#f6d77a" ${S}/><path d="M-32 8 Q-30 -34 0 -34 Q30 -34 32 8 Z" fill="#f6d77a" ${S}/>
    <path d="M-31 -2 Q0 -10 31 -2" stroke="#ff6f9c" stroke-width="9" fill="none"/></g>`;
  const water = `<g><rect x="-24" y="-34" width="48" height="86" rx="14" fill="#7fd0ff" fill-opacity=".85" ${S}/><rect x="-14" y="-54" width="28" height="22" rx="6" fill="#1e5bd6" ${S3}/>
    <path d="M-24 0 Q0 -8 24 0" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/><ellipse cx="-10" cy="16" rx="4" ry="14" fill="#fff" opacity=".5"/></g>`;
  const towel = `<g><rect x="-50" y="-36" width="100" height="72" rx="10" fill="#ff8a3d" ${S}/>
    ${[0, 1, 2].map(i => `<rect x="-50" y="${-24 + i * 22}" width="100" height="10" fill="#fff"/>`).join('')}<rect x="-50" y="-36" width="100" height="72" rx="10" fill="none" ${S}/>
    <ellipse cx="50" cy="0" rx="12" ry="36" fill="#ffb07a" ${S3}/></g>`;
  const swimsuit = `<g><path d="M-30 -48 L-22 -48 Q-14 -24 0 -24 Q14 -24 22 -48 L30 -48 L34 -6 Q40 30 26 46 Q12 30 0 30 Q-12 30 -26 46 Q-40 30 -34 -6 Z" fill="#1e88e5" ${S}/>
    ${[[-14, -2], [12, 4], [-4, 18], [16, 24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join('')}</g>`;
  const scarf = `<g><path d="M-50 -26 Q0 -6 50 -26 L46 -6 Q0 14 -46 -6 Z" fill="#8e5bd6" ${S}/><path d="M20 -10 L30 52 L10 54 L4 -6 Z" fill="#8e5bd6" ${S3}/>
    <path d="M-30 -14 L-26 4 M-6 -8 L-4 10 M24 -2 L24 14 M14 40 L26 40" stroke="#c8a8ff" stroke-width="6" stroke-linecap="round"/>
    ${[12, 18, 24].map(x => `<path d="M${x} 54 V64" ${SW(3)}/>`).join('')}</g>`;
  const boot = x => `<g transform="translate(${x} 0)"><path d="M-14 -46 H14 V18 H30 Q40 18 40 34 V44 H-16 Z" fill="#596178" ${S}/><path d="M-16 -46 H16 V-34 H-16 Z" fill="#fff" ${S3}/>
    <path d="M-16 34 H40" stroke="#fff" stroke-width="4"/></g>`;
  const boots = `<g>${boot(-26)}${boot(14)}</g>`;
  const schoolbag = `<g><path d="M-20 -46 Q0 -62 20 -46" fill="none" ${SW(8)}/><rect x="-42" y="-44" width="84" height="96" rx="18" fill="#1e5bd6" ${S}/>
    <rect x="-30" y="2" width="60" height="38" rx="10" fill="#4a7fe6" ${S3}/><path d="M-42 -14 H42" ${SW(4)}/><circle cy="-14" r="6" fill="${YEL}" ${S3}/></g>`;
  const mitten = (x, flip) => `<g transform="translate(${x} 0) scale(${flip ? -1 : 1} 1)"><path d="M-20 40 V-10 Q-20 -40 4 -40 Q24 -40 24 -10 V40 Z" fill="${RED}" ${S}/>
    <path d="M-20 -4 Q-40 -10 -38 -28 Q-30 -36 -20 -24" fill="${RED}" ${S3}/><rect x="-24" y="30" width="52" height="16" rx="5" fill="#fff" ${S3}/></g>`;
  const gloves = `<g>${mitten(-22, false)}${mitten(26, true)}</g>`;
  const woolly = `<g><path d="M-44 20 Q-44 -40 0 -40 Q44 -40 44 20 Z" fill="#2e9e4f" ${S}/><rect x="-48" y="8" width="96" height="28" rx="8" fill="#fff" ${S3}/>
    <path d="M-30 -16 V8 M-10 -26 V8 M10 -26 V8 M30 -16 V8" stroke="#5cb85c" stroke-width="5"/><circle cy="-46" r="14" fill="#fff" ${S3}/></g>`;
  const coat = `<g><path d="M-22 -50 L-50 -38 L-56 50 H56 L50 -38 L22 -50 L0 -30 Z" fill="#a0522d" ${S}/>
    <path d="M0 -30 V50" ${SW(4)}/>${[-10, 10, 30].map(y => `<circle cx="8" cy="${y}" r="4" fill="${YEL}" ${S3}/>`).join('')}
    <path d="M-22 -50 L-6 -24 L0 -30 L6 -24 L22 -50" fill="#fff" ${S3}/><path d="M-50 -38 L-62 40 M50 -38 L62 40" ${SW(5)}/></g>`;
  const PACK = {
    hat: sunhat, cream: suncream, water, towel, swim: swimsuit, spade: `<g transform="translate(-10 48) scale(.62)">${sandBucket(0, false, '#2e9e4f')}</g>`,
    scarf, boots, school: schoolbag, gloves, woolly, coat
  };
  const beachBag = `<svg viewBox="-64 -64 128 128"><path d="M-30 -20 Q-30 -60 0 -60 Q30 -60 30 -20" fill="none" ${SW(8)}/>
    <path d="M-52 -24 H52 L44 54 H-44 Z" fill="#f6d77a" ${S}/>${[0, 1, 2, 3].map(i => `<path d="M-50 ${-6 + i * 16} H50" stroke="#e0b860" stroke-width="4"/>`).join('')}
    <path d="M-52 -24 H52 L44 54 H-44 Z" fill="none" ${S}/><g transform="translate(0 22) scale(.36)"><path d="${star(52, 24)}" fill="#ff8a3d" ${S}/></g></svg>`;
  const homeBin = `<svg viewBox="-64 -64 128 128"><rect x="-44" y="-12" width="88" height="66" fill="#f2c879" ${S}/><path d="M-56 -8 L0 -56 L56 -8 Z" fill="${RED}" ${S}/>
    <rect x="-12" y="18" width="24" height="36" fill="#8b5a2b" ${S3}/><rect x="-36" y="2" width="20" height="18" fill="${GLASS}" ${S3}/><rect x="16" y="2" width="20" height="18" fill="${GLASS}" ${S3}/>
    ${[[-18, -50], [6, -58], [26, -46]].map(([x, y]) => `<path d="${star(7, 3, 6)}" transform="translate(${x} ${y - 4})" fill="#fff" stroke="#9aa3b5" stroke-width="1.5"/>`).join('')}</svg>`;

  // ---------- Stickers for the six places on the beach ----------
  const SPOTS = {
    hut:        { name: 'Beach hut', art: () => `<g transform="translate(0 64) scale(.36)">${hut(true)}</g>`, bg: '#dff3ff' },
    tower:      { name: 'Lifeguard Kai', art: () => `<g transform="translate(0 112) scale(.5)">${kai(true)}</g>`, bg: '#fff6cc' },
    pool:       { name: 'Rock pool', art: () => `<g transform="translate(0 34) scale(.42)">${pool(true)}</g>`, bg: '#e3f7e8' },
    castle:     { name: 'Sandcastle', art: () => `<g transform="translate(-4 66) scale(.42)">${castle()}</g>`, bg: '#fff1d6' },
    van:        { name: 'Ice cream van', art: () => `<g transform="translate(0 50) scale(.3)">${van(true)}</g>`, bg: '#ffe3ef' },
    lighthouse: { name: 'Lighthouse', art: () => `<g transform="translate(0 60) scale(.29)">${lighthouse(true)}</g>`, bg: '#1b2a5a' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="sea-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#sea-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(ITEMS[id]);
  const packSvg = id => svg(PACK[id]);
  // A drawing as an image, for the canvas (ball run board). Ready when loaded; draw() skips it until then.
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
  const shellImage = i => image(`<g transform="scale(1.3)">${shell(i)}</g>`, '-50 -50 100 100');
  const bucketImage = (n, happy) => image(sandBucket(n, happy), '-80 -128 200 132');
  const poolImage = splash => image(`<g transform="scale(.6)">${pool(splash)}</g>${splash ? [[-40, -50], [-10, -66], [20, -70], [44, -52]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="8" fill="#7fb8e6" ${S3}/>`).join('') : ''}`, '-80 -80 160 84');

  window.SeaArt = { ITEMS, SINKFLOAT, PACK, SPOTS, SHELLS, pipAt, kai, gull, hut, flag, tower, crab, starfish, shrimp, seaweed, pool, castle, cone, van, lighthouse,
    scallop, spiral, shell, spade, sandBucket, beachBag, homeBin, sun, waves, beach, star, sticker, svg, itemSvg, packSvg, image, shellImage, bucketImage, poolImage, txt, eyes, smile };
})();
