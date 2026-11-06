// Bus and Train artwork, drawn in the app's style (navy outline, flat colours). The red bus, the train, the bus stop,
// ticket machine, platform clock and bell button, Grandad (Pip's grandad, a grey old dog), Dot the bus driver and
// Mr Amin the train guard, plus the pictures for the games. People, Grandad and big things stand with their base at
// 0,0; small pictures (Word Train, Safe or Not Safe?) are drawn in a 128 x 128 box centred on 0,0.
(function () {
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r, cx = 0) => eye(cx - dx, y, r) + eye(cx + dx, y, r);
  const smile = (y, w = 8, cx = 0) => `<path d="M${cx - w} ${y} Q${cx} ${y + w * .9} ${cx + w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4, cx = 0) => `<circle cx="${cx - dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${cx + dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const RED = '#e53935', GLASS = '#bfe6ff', TRAIN = '#2e9e4f', NAVY = '#1e3a7a';

  // ---------- Pip, small (for bus and train windows and the safety pictures) ----------
  // The whole Pip drawing (200 x 200 box) placed at x, y with width w, wearing his guard's cap and rucksack.
  const pipAt = (x, y, w, outfit = 'bus') => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip(outfit).replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  // Just Pip's head, centred on 0,0, about 40 across (in windows).
  const pipHead = (s = 1) => `<g transform="scale(${s})"><path d="M-14 -10 Q-26 -6 -22 14 Q-14 12 -10 0 Z M14 -10 Q26 -6 22 14 Q14 12 10 0 Z" fill="${OL}"/>
    <circle r="18" fill="#fff" ${S3}/><path d="M-14 -10 Q-26 -6 -22 14 Q-14 12 -10 0 Z M14 -10 Q26 -6 22 14 Q14 12 10 0 Z" fill="${OL}"/>
    ${eyes(6, -3, 3)}<ellipse cy="5" rx="4" ry="3" fill="${OL}"/><path d="M-4 9 Q0 13 4 9" fill="none" ${SW(2)}/>
    <path d="M-14 -12 Q0 -30 14 -12 Z" fill="${NAVY}" ${SW(2)}/><path d="M-16 -12 H16" stroke="#ffd21f" stroke-width="3"/></g>`;

  // ---------- Grandad: Pip's grandad, a grey old dog with a flat cap, glasses, a green cardigan and a walking stick ----------
  const G = { fur: '#e6e8ee', ear: '#8a93a6', cardi: '#5f8f4a', cap: '#8b6a4a' };
  const grandadHead = (s = 1) => `<g transform="scale(${s})">
    <path d="M-34 -30 Q-66 -20 -58 34 Q-44 28 -34 0 Z" fill="${G.ear}" ${S3}/><path d="M34 -30 Q66 -20 58 34 Q44 28 34 0 Z" fill="${G.ear}" ${S3}/>
    <circle r="46" fill="${G.fur}" ${S}/>
    <path d="M-28 -18 Q-16 -26 -6 -18 M6 -18 Q16 -26 28 -18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    ${eyes(16, -6, 4.5)}
    <circle cx="-16" cy="-6" r="12" fill="#fff" fill-opacity=".25" ${S3}/><circle cx="16" cy="-6" r="12" fill="#fff" fill-opacity=".25" ${S3}/><path d="M-4 -6 Q0 -9 4 -6" fill="none" ${S3}/>
    <ellipse cy="16" rx="18" ry="13" fill="#fff" ${S3}/><ellipse cy="10" rx="8" ry="5.5" fill="${OL}"/>
    <path d="M-12 20 Q-6 26 0 20 Q6 26 12 20" fill="none" ${S3}/>${cheeks(30, 14, 6)}
    <path d="M-44 -18 Q-42 -50 0 -50 Q36 -50 46 -24 L64 -18 Q52 -6 40 -14 Q0 -30 -44 -18 Z" fill="${G.cap}" ${S3}/>
    <path d="M-30 -36 Q0 -46 30 -36" fill="none" stroke="#6f523a" stroke-width="4"/></g>`;
  const grandad = (wave = false) => `<g class="grandad">
    <path d="M58 0 V-110 Q58 -128 42 -128" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M58 0 V-110 Q58 -128 42 -128" fill="none" stroke="#8b5a2b" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="0" cy="-60" rx="56" ry="64" fill="${G.cardi}" ${S}/>
    <path d="M-12 -122 L0 -60 L12 -122" fill="${G.fur}" ${S3}/>${[-96, -76, -56].map(y => `<circle cx="0" cy="${y + 26}" r="4" fill="#ffd21f" ${S3}/>`).join('')}
    <ellipse cx="-30" cy="-6" rx="20" ry="10" fill="${G.fur}" ${S3}/><ellipse cx="30" cy="-6" rx="20" ry="10" fill="${G.fur}" ${S3}/>
    <ellipse cx="44" cy="-120" rx="13" ry="12" fill="${G.fur}" ${S3}/>
    ${wave ? `<g class="wave-paw"><path d="M-44 -100 L-70 -150" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M-44 -100 L-70 -150" stroke="${G.cardi}" stroke-width="15" stroke-linecap="round"/><ellipse cx="-72" cy="-158" rx="12" ry="13" fill="${G.fur}" ${S3}/></g>` : ''}
    <g transform="translate(0 -160)">${grandadHead()}</g></g>`;

  // ---------- People: Dot the bus driver and Mr Amin the guard (feet at 0,0, about 240 tall) ----------
  const person = ({ skin, top, legs = '#2f3446', hair = '', hat = '', over = '', wave = false, hold = '' }) => {
    const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${top}" stroke-width="12" stroke-linecap="round"/><circle cx="${x2}" cy="${y2 + 4}" r="9" fill="${skin}" ${S3}/>`;
    return `<g>
      <rect x="-22" y="-86" width="16" height="82" rx="6" fill="${legs}" ${S3}/><rect x="6" y="-86" width="16" height="82" rx="6" fill="${legs}" ${S3}/>
      <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="${OL}"/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="${OL}"/>
      <path d="M-38 -160 Q0 -172 38 -160 L42 -80 H-42 Z" fill="${top}" ${S}/>${over}
      ${arm(-36, -154, -52, -100)}
      ${wave ? arm(36, -154, 60, -204) : arm(36, -154, 52, -100)}${hold}
      <circle cy="-196" r="27" fill="${skin}" ${S}/>${hair}
      ${eyes(10, -198, 3)}${cheeks(17, -186, 4)}${smile(-184, 9)}${hat}</g>`;
  };
  // Dot: curly red hair, a navy bus company jumper with a yellow lanyard.
  const dotHair = `<g fill="#c4501e" ${S3}>${[-22, -10, 4, 18].map((x, i) => `<circle cx="${x}" cy="${-218 + (i % 2) * 3}" r="11"/>`).join('')}<circle cx="-26" cy="-200" r="9"/><circle cx="26" cy="-202" r="9"/></g>`;
  const dot = (wave = false) => person({ skin: '#f2c79a', top: NAVY, legs: '#2f3446', hair: dotHair, wave,
    over: `<path d="M-14 -164 L0 -130 L14 -164" fill="none" stroke="#ffd21f" stroke-width="4"/><rect x="-10" y="-132" width="20" height="24" rx="3" fill="#fff" ${S3}/><path d="M-6 -124 H6 M-6 -118 H2" stroke="${RED}" stroke-width="3"/>
      <path d="M-40 -100 H40" stroke="${RED}" stroke-width="6"/>` });
  // Dot's head and shoulders at the wheel (for the bus's front window), centred on 0,0.
  const dotHead = (s = 1) => `<g transform="scale(${s})"><path d="M-22 40 Q-22 20 0 20 Q22 20 22 40 Z" fill="${NAVY}" ${S3}/><circle r="20" fill="#f2c79a" ${S3}/>
    <g fill="#c4501e" ${S3}>${[-16, -6, 6, 16].map((x, i) => `<circle cx="${x}" cy="${-16 + (i % 2) * 2}" r="8"/>`).join('')}</g>${eyes(7, -1, 2.6)}${smile(8, 6)}</g>`;
  // Mr Amin: a guard's cap, a beard, an orange high-vis waistcoat and his whistle. flag: holding up his green flag.
  const amin = (flag = false) => person({ skin: '#a86e44', top: '#24407a', legs: '#24407a',
    hair: `<path d="M-26 -194 Q-26 -166 0 -166 Q26 -166 26 -194 Q20 -178 0 -178 Q-20 -178 -26 -194 Z" fill="#2a1a10" ${S3}/>`,
    hat: `<g transform="translate(0 -9)"><path d="M-28 -206 Q-28 -234 0 -234 Q28 -234 28 -206 Z" fill="${NAVY}" ${S3}/><path d="M-28 -208 H28" stroke="${RED}" stroke-width="6"/><path d="M-30 -206 Q0 -200 34 -206 Q30 -196 0 -196 Q-30 -196 -30 -206 Z" fill="#14264f" ${S3}/><circle cy="-222" r="5" fill="#ffd21f" ${S3}/></g>`,
    over: `<path d="M-38 -160 L-14 -162 L-8 -82 H-42 Z M38 -160 L14 -162 L8 -82 H42 Z" fill="#ff8a1f" ${S3}/><path d="M-40 -110 H-10 M10 -110 H40 M-41 -96 H-9 M9 -96 H41" stroke="#e8edf3" stroke-width="5"/>
      <path d="M-6 -160 Q-4 -140 6 -132" fill="none" stroke="#c3cad6" stroke-width="3"/><rect x="2" y="-136" width="16" height="9" rx="4" fill="#c3cad6" ${S3}/>`,
    wave: flag, hold: flag ? `<path d="M62 -200 V-250" ${SW(5)}/><path d="M62 -250 L100 -240 L62 -226 Z" fill="${TRAIN}" ${S3}/>` : '' });
  const aminHead = (s = 1) => `<g transform="scale(${s}) translate(0 196)"><path d="M-30 -150 Q-30 -170 0 -170 Q30 -170 30 -150 Z" fill="#ff8a1f" ${S3}/>
    <circle cy="-196" r="27" fill="#a86e44" ${S}/><path d="M-26 -194 Q-26 -166 0 -166 Q26 -166 26 -194 Q20 -178 0 -178 Q-20 -178 -26 -194 Z" fill="#2a1a10" ${S3}/>${eyes(10, -198, 3)}${smile(-184, 9)}
    <g transform="translate(0 -9)"><path d="M-28 -206 Q-28 -234 0 -234 Q28 -234 28 -206 Z" fill="${NAVY}" ${S3}/><path d="M-28 -208 H28" stroke="${RED}" stroke-width="6"/><path d="M-30 -206 Q0 -200 34 -206 Q30 -196 0 -196 Q-30 -196 -30 -206 Z" fill="#14264f" ${S3}/><circle cy="-222" r="5" fill="#ffd21f" ${S3}/></g></g>`;

  // ---------- Passengers (round faces, for the bus windows and the Ticket Run balls) ----------
  const FOLK = [
    { skin: '#f2c79a', hair: '#e0a030', style: 'bunches' }, { skin: '#8d5a3b', hair: '#2a1a10', style: 'curly' },
    { skin: '#c68a5a', hair: '#2a1a10', style: 'long' }, { skin: '#f6d2b0', hair: '#b5541e', style: 'short' },
    { skin: '#e0b088', hair: '#c3cad6', style: 'bun' }, { skin: '#a86e44', hair: '#2a1a10', style: 'cap' }
  ];
  // A passenger's face, centred on 0,0, radius r.
  const face = (i, r = 30) => {
    const f = FOLK[i % FOLK.length], k = r / 30;
    const hair = {
      bunches: `<circle cx="-30" cy="-12" r="10" fill="${f.hair}" ${S3}/><circle cx="30" cy="-12" r="10" fill="${f.hair}" ${S3}/><path d="M-28 -6 Q0 -50 28 -6 Q0 -22 -28 -6 Z" fill="${f.hair}" ${S3}/>`,
      curly: `<g fill="${f.hair}" ${S3}>${[-20, -7, 7, 20].map((x, j) => `<circle cx="${x}" cy="${-24 + (j % 2) * 3}" r="10"/>`).join('')}</g>`,
      long: `<path d="M-32 18 Q-36 -36 0 -34 Q36 -36 32 18 L22 18 Q24 -12 0 -16 Q-24 -12 -22 18 Z" fill="${f.hair}" ${S3}/>`,
      short: `<path d="M-30 -4 Q-30 -36 0 -34 Q30 -36 30 -4 Q14 -22 -30 -4 Z" fill="${f.hair}" ${S3}/>`,
      bun: `<circle cy="-36" r="11" fill="${f.hair}" ${S3}/><path d="M-30 -4 Q-30 -34 0 -32 Q30 -34 30 -4 Q0 -24 -30 -4 Z" fill="${f.hair}" ${S3}/>`,
      cap: `<path d="M-30 -8 Q-30 -36 0 -36 Q30 -36 30 -8 Z" fill="#2e9e4f" ${S3}/><path d="M20 -10 Q40 -12 44 -4 Q30 0 18 -4 Z" fill="#2e9e4f" ${S3}/>`
    }[f.style];
    const back = f.style === 'long' ? hair : '';
    return `<g transform="scale(${k})">${back}<circle r="30" fill="${f.skin}" ${S}/>${f.style === 'long' ? `<path d="M-28 -6 Q0 -40 28 -6 Q0 -20 -28 -6 Z" fill="${f.hair}" ${S3}/>` : hair}
      ${eyes(10, 0, 4)}${cheeks(18, 10, 4)}${smile(10, 8)}</g>`;
  };

  // ---------- The red bus (a double-decker), facing right, wheels on 0,0, 300 wide ----------
  // open: the door is open. pip: Pip and Grandad look out of the lower windows. faces: passengers in the upper windows.
  const bus = ({ open = false, pip = false, faces = [0, 3, 1] } = {}) => `<g class="bus">
    <rect x="-150" y="-236" width="300" height="214" rx="22" fill="${RED}" ${S}/>
    <path d="M-150 -138 H90" stroke="#fff2cc" stroke-width="10"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${-134 + i * 52}" y="-218" width="42" height="56" rx="9" fill="${GLASS}" ${S3}/>`).join('')}
    <path d="M128 -218 H136 Q146 -218 146 -204 V-162 H128 Z" fill="${GLASS}" ${S3}/>
    ${faces.map((f, k) => f == null ? '' : `<g transform="translate(${-113 + [0, 2, 4][k] * 52} -184)">${face(f, 15)}</g>`).join('')}
    <rect x="96" y="-146" width="50" height="17" rx="3" fill="#1b2233" ${S3}/>${txt(121, -133, 12, '#ffd21f', '12')}
    ${[0, 1, 2].map(i => `<rect x="${-134 + i * 50}" y="-120" width="40" height="46" rx="8" fill="${GLASS}" ${S3}/>`).join('')}
    ${pip ? `<g transform="translate(-64 -92)">${grandadHead(.28)}</g><g transform="translate(-14 -92)">${pipHead(.9)}</g>` : ''}
    <path d="M100 -120 H136 Q146 -120 146 -106 V-62 H100 Z" fill="${GLASS}" ${S3}/>
    <g transform="translate(124 -80)">${dotHead(.8)}</g><circle cx="110" cy="-72" r="10" fill="none" stroke="${OL}" stroke-width="4"/>
    ${open ? `<rect x="50" y="-120" width="44" height="96" rx="4" fill="#2a2f45" ${S3}/><path d="M50 -40 H94" stroke="#ffd21f" stroke-width="5"/>
      <rect x="44" y="-120" width="8" height="96" fill="${GLASS}" ${S3}/><rect x="92" y="-120" width="8" height="96" fill="${GLASS}" ${S3}/>`
      : `<rect x="50" y="-120" width="44" height="96" rx="4" fill="${GLASS}" ${S3}/><path d="M72 -120 V-24" ${SW(3)}/><path d="M58 -64 V-56 M86 -64 V-56" ${SW(3)}/>`}
    <path d="M-150 -40 H40" stroke="#b71c1c" stroke-width="6"/>
    <rect x="140" y="-56" width="12" height="14" rx="3" fill="#ffd21f" ${S3}/><rect x="-154" y="-56" width="10" height="14" rx="3" fill="#ff6f6f" ${S3}/>
    ${[-96, 110].map(x => `<path d="M${x - 34} -22 Q${x - 34} -58 ${x} -58 Q${x + 34} -58 ${x + 34} -22 Z" fill="#b71c1c" ${S3}/><circle cx="${x}" cy="-22" r="24" fill="#30364a" ${S}/><circle cx="${x}" cy="-22" r="9" fill="#c3cad6" ${S3}/>`).join('')}
  </g>`;

  // An open-top bus, low and wide (the Ticket Run goal), wheels on 0,0, 300 wide, about 110 tall. n: passengers on board.
  const openBus = (n = 0, happy = false, kind = null) => `<g>
    ${Array.from({ length: Math.min(n, 6) }, (_, i) => `<g transform="translate(${-110 + i * 40} ${-98 - (happy ? (i % 2) * 8 : 0)})">${face(kind != null ? kind : i, 16)}</g>`).join('')}
    <path d="M-150 -92 H150 V-30 H-150 Z" fill="${RED}" ${S}/>
    <path d="M-150 -92 H150" stroke="#fff2cc" stroke-width="8"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-126 + i * 40} -86 V-92" ${SW(3)}/>`).join('')}
    <path d="M-144 -110 H144" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M-144 -110 H144" stroke="#ffd21f" stroke-width="3"/>
    ${[-140, -60, 20, 100, 140].map(x => `<path d="M${x} -92 V-110" ${SW(4)}/>`).join('')}
    ${txt(-10, -50, 26, '#fff', 'ALL ABOARD')}
    ${[-96, 100].map(x => `<circle cx="${x}" cy="-24" r="22" fill="#30364a" ${S}/><circle cx="${x}" cy="-24" r="8" fill="#c3cad6" ${S3}/>`).join('')}</g>`;

  // ---------- The train, facing right, wheels on 0,0 (one cab and `cars` carriages behind it, each 270 long) ----------
  // faces: passengers at the windows (one list for all carriages). pip: Pip waving from the first carriage window.
  const carriage = (x, faces = [], pip = false) => `<g transform="translate(${x} 0)">
    <rect x="-268" y="-150" width="264" height="128" rx="14" fill="${TRAIN}" ${S}/>
    <path d="M-268 -60 H-4" stroke="#fff" stroke-width="8"/>
    ${[0, 1, 2].map(i => `<rect x="${-246 + i * 60 + (i > 1 ? 50 : 0)}" y="-132" width="46" height="44" rx="8" fill="${GLASS}" ${S3}/>`).join('')}
    ${faces.map((f, k) => f == null ? '' : `<g transform="translate(${-223 + k * 60 + (k > 1 ? 50 : 0)} -106)">${face(f, 14)}</g>`).join('')}
    ${pip ? `<g transform="translate(-223 -104)">${pipHead(.95)}</g>` : ''}
    <rect x="-128" y="-138" width="44" height="112" rx="5" fill="#ffd21f" ${S3}/><rect x="-122" y="-132" width="32" height="100" rx="3" fill="${GLASS}" ${S3}/><path d="M-106 -132 V-32" ${SW(3)}/>
    ${[-226, -46].map(c => `<rect x="${c - 30}" y="-30" width="60" height="12" rx="4" fill="#3a3f55" ${S3}/>${[c - 16, c + 16].map(w => `<circle cx="${w}" cy="-12" r="12" fill="#30364a" ${S3}/><circle cx="${w}" cy="-12" r="4" fill="#c3cad6"/>`).join('')}`).join('')}</g>`;
  const train = ({ cars = 1, faces = [1, 4, 2, 5, 0, 3], pip = false } = {}) => `<g class="train">
    ${Array.from({ length: cars }, (_, i) => carriage(-136 - i * 270, faces.slice(i * 3, i * 3 + 3), pip && i === 0)).join('')}
    <path d="M-136 -150 H60 Q118 -150 140 -80 L148 -40 Q150 -22 132 -22 H-136 Z" fill="${TRAIN}" ${S}/>
    <path d="M100 -146 Q126 -128 140 -80 L148 -40 Q150 -22 132 -22 H96 Z" fill="#ffd21f" ${S3}/>
    <path d="M70 -140 Q100 -138 118 -104 H70 Z" fill="${GLASS}" ${S3}/>
    <path d="M-136 -60 H96" stroke="#fff" stroke-width="8"/>
    ${[0, 1].map(i => `<rect x="${-110 + i * 60}" y="-132" width="46" height="44" rx="8" fill="${GLASS}" ${S3}/>`).join('')}
    <rect x="24" y="-138" width="36" height="112" rx="5" fill="#ffd21f" ${S3}/><rect x="30" y="-132" width="24" height="100" rx="3" fill="${GLASS}" ${S3}/>
    <circle cx="138" cy="-44" r="7" fill="#fff6cc" ${S3}/>
    ${[-80, 90].map(c => `<rect x="${c - 30}" y="-30" width="60" height="12" rx="4" fill="#3a3f55" ${S3}/>${[c - 16, c + 16].map(w => `<circle cx="${w}" cy="-12" r="12" fill="#30364a" ${S3}/><circle cx="${w}" cy="-12" r="4" fill="#c3cad6"/>`).join('')}`).join('')}
  </g>`;
  // Railway track (side on), from x0 to x1, rails at y.
  const track = (x0, x1, y) => `<rect x="${x0}" y="${y - 4}" width="${x1 - x0}" height="30" fill="#a59a8a"/>
    ${Array.from({ length: Math.ceil((x1 - x0) / 40) }, (_, i) => `<rect x="${x0 + i * 40}" y="${y + 2}" width="22" height="10" fill="#7a5a3a"/>`).join('')}
    <path d="M${x0} ${y} H${x1}" stroke="#596178" stroke-width="7"/>`;

  // ---------- Things at the stop and the station (base at 0,0) ----------
  const busStop = `<g><rect x="-6" y="-236" width="12" height="236" rx="4" fill="#9aa3b5" ${S3}/>
    <circle cy="-250" r="38" fill="#fff" ${S}/><circle cy="-250" r="30" fill="${RED}"/><rect x="-40" y="-260" width="80" height="20" fill="${NAVY}" ${S3}/>${txt(0, -244, 14, '#fff', 'BUS STOP')}
    <rect x="-28" y="-196" width="56" height="70" rx="5" fill="#fff" ${S3}/>${txt(0, -178, 13, NAVY, 'TIMES')}
    ${[0, 1, 2, 3].map(i => `<path d="M-18 ${-166 + i * 10} H${8 - (i % 2) * 8}" stroke="#9aa3b5" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
  // The bell button on a yellow pole inside the bus. lit: pressed, and the "Bus stopping" sign lights up.
  const bell = (lit = false) => `<g>
    <rect x="-16" y="-260" width="32" height="260" rx="14" fill="#ffd21f" ${S}/>
    <rect x="-46" y="-196" width="92" height="76" rx="16" fill="${RED}" ${S}/>
    <circle cy="-158" r="24" fill="${lit ? '#ff8a80' : '#b71c1c'}" ${S3}/>${txt(0, -152, 15, '#fff', 'STOP')}
    ${lit ? `<g class="bell-ring" fill="none" stroke="#ffd21f" stroke-width="6" stroke-linecap="round"><path d="M-60 -186 Q-72 -158 -60 -130 M60 -186 Q72 -158 60 -130 M-74 -196 Q-90 -158 -74 -120 M74 -196 Q90 -158 74 -120"/></g>` : ''}
    <rect x="-70" y="-300" width="140" height="34" rx="8" fill="#1b2233" ${S3}/>${txt(0, -276, 18, lit ? '#ffb300' : '#4a5066', 'BUS STOPPING')}</g>`;
  const ticket = (s = 1) => `<g transform="scale(${s})"><rect x="-44" y="-26" width="88" height="52" rx="6" fill="#ffb74d" ${S3}/><rect x="-38" y="-20" width="76" height="14" fill="#fff6e6"/>
    ${txt(0, -9, 11, '#c4501e', 'TICKET')}<path d="M-34 6 H10 M-34 16 H-2" stroke="#c4501e" stroke-width="4" stroke-linecap="round"/>
    <g transform="translate(26 12) scale(.5)"><rect x="-18" y="-18" width="36" height="28" rx="6" fill="${TRAIN}" ${S3}/><rect x="-12" y="-14" width="24" height="10" rx="2" fill="${GLASS}"/></g></g>`;
  // The ticket machine. printing: a ticket pops out of the slot.
  const ticketMachine = (printing = false) => `<g>
    <rect x="-52" y="-190" width="104" height="190" rx="12" fill="#1e5bd6" ${S}/>
    <rect x="-44" y="-182" width="88" height="22" rx="4" fill="#ffd21f" ${S3}/>${txt(0, -165, 15, OL, 'TICKETS')}
    <rect x="-38" y="-150" width="76" height="46" rx="6" fill="#bff0c8" ${S3}/>${txt(0, -120, 15, '#1b5e20', printing ? 'THANKS!' : 'HELLO!')}
    ${[0, 1, 2].map(r => [0, 1, 2].map(c => `<circle cx="${-24 + c * 24}" cy="${-88 + r * 18}" r="7" fill="${r === 0 && c === 2 ? '#2e9e4f' : '#e8edf3'}" ${S3}/>`).join('')).join('')}
    <rect x="-32" y="-38" width="64" height="10" rx="4" fill="#1b2233"/>
    ${printing ? `<g transform="translate(0 -14) rotate(-6)">${ticket(.6)}</g>` : ''}
    <rect x="22" y="-104" width="20" height="30" rx="4" fill="#1b2233" ${S3}/></g>`;
  // A clock face, radius 50, centred on 0,0. h, m: the time it shows.
  const clockFace = (h = 3, m = 0, r = 50) => {
    const ang = (v, of) => (v / of) * Math.PI * 2;
    const hand = (a, len, w) => `<path d="M0 0 L${(Math.sin(a) * len).toFixed(1)} ${(-Math.cos(a) * len).toFixed(1)}" stroke="${OL}" stroke-width="${w}" stroke-linecap="round"/>`;
    return `<g><circle r="${r}" fill="#fff" ${S}/>
      ${Array.from({ length: 12 }, (_, i) => { const a = ang(i, 12), big = i % 3 === 0; return `<path d="M${(Math.sin(a) * r * (big ? .72 : .8)).toFixed(1)} ${(-Math.cos(a) * r * (big ? .72 : .8)).toFixed(1)} L${(Math.sin(a) * r * .9).toFixed(1)} ${(-Math.cos(a) * r * .9).toFixed(1)}" stroke="${OL}" stroke-width="${big ? 5 : 3}" stroke-linecap="round"/>`; }).join('')}
      ${hand(ang(h % 12 + m / 60, 12), r * .5, 8)}${hand(ang(m, 60), r * .75, 5)}<circle r="5" fill="${RED}" ${S3}/></g>`;
  };
  // The platform clock on its post.
  const clock = (h = 3, m = 0) => `<g><rect x="-7" y="-250" width="14" height="250" rx="4" fill="#596178" ${S3}/>
    <rect x="-64" y="-330" width="128" height="88" rx="16" fill="#1b2233" ${S}/><g transform="translate(0 -286) scale(.78)">${clockFace(h, m)}</g></g>`;
  // The red and green man at a crossing. go: the green man is lit.
  const pedLight = (go = false) => `<g><rect x="-6" y="-120" width="12" height="120" fill="#596178" ${S3}/>
    <rect x="-26" y="-210" width="52" height="96" rx="10" fill="#1b2233" ${S}/>
    <g opacity="${go ? .25 : 1}" transform="translate(0 -184)"><circle r="18" fill="#3a1a1a"/><path d="M-5 -12 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M-7 -4 H7 V8 H3 V16 H-3 V8 H-7 Z" fill="#ff3b30"/></g>
    <g opacity="${go ? 1 : .25}" transform="translate(0 -138)"><circle r="18" fill="#1a3a1a"/><path d="M-3 -14 a5 5 0 1 0 8 0 a5 5 0 1 0 -8 0 M-6 -6 L4 -6 L8 4 L4 4 L8 16 L2 16 L-1 6 L-5 16 L-11 16 L-6 4 Z" fill="#4cd964"/></g></g>`;
  // A puddle (the Ticket Run decoy). splash: drops fly up.
  const puddle = (splash = false) => `<g><ellipse cy="-14" rx="74" ry="16" fill="#7fb8e6" ${S3}/><ellipse cx="-10" cy="-16" rx="44" ry="7" fill="#bfe6ff"/>
    <path d="M-30 -14 Q-20 -18 -10 -14 M10 -12 Q22 -16 34 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${splash ? [[-40, -40], [-14, -56], [16, -60], [42, -42]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#7fb8e6" ${S3}/>`).join('') : ''}
    <g transform="translate(46 -22)"><path d="M-12 0 Q-14 -16 0 -16 Q8 -26 16 -18 L24 -16 L16 -12 Q18 0 4 2 Z" fill="#ffe066" ${S3}/><circle cx="8" cy="-19" r="2" fill="${OL}"/></g></g>`;

  // ---------- Word Train pictures (128 x 128 box) ----------
  const umbrella = `<g><path d="M0 -40 V40 Q0 52 -12 50" fill="none" ${SW(6)}/>
    <path d="M-56 -4 Q-56 -52 0 -52 Q56 -52 56 -4 Q46 -12 37 -4 Q28 -12 19 -4 Q9 -12 0 -4 Q-9 -12 -19 -4 Q-28 -12 -37 -4 Q-46 -12 -56 -4 Z" fill="${RED}" ${S}/>
    <path d="M-19 -4 Q-14 -40 0 -52 Q14 -40 19 -4" fill="none" stroke="#b71c1c" stroke-width="4"/>
    ${[[-40, 22], [36, 16], [-20, 40], [44, 44]].map(([x, y]) => `<path d="M${x} ${y - 8} Q${x + 5} ${y} ${x} ${y + 4} Q${x - 5} ${y} ${x} ${y - 8} Z" fill="#7fb8e6"/>`).join('')}</g>`;
  const suitcase = `<g><path d="M-16 -34 V-46 H16 V-34" fill="none" ${SW(7)}/><rect x="-50" y="-36" width="100" height="74" rx="10" fill="#f07a1a" ${S}/>
    <path d="M-28 -36 V38 M28 -36 V38" stroke="#c4501e" stroke-width="6"/><circle cx="-34" cy="44" r="7" fill="#30364a" ${S3}/><circle cx="34" cy="44" r="7" fill="#30364a" ${S3}/>
    <rect x="6" y="-20" width="30" height="18" rx="4" fill="#fff" transform="rotate(-10 21 -11)" ${S3}/></g>`;
  const platform = `<g><rect x="-60" y="10" width="120" height="44" fill="#c9ced8" ${S3}/><path d="M-60 18 H60" stroke="#ffd21f" stroke-width="6"/>
    <rect x="-4" y="-34" width="8" height="44" fill="#596178" ${S3}/><rect x="-50" y="-56" width="100" height="34" rx="6" fill="${NAVY}" ${S3}/>${txt(0, -31, 20, '#fff', 'Platform 1')}</g>`;
  const timetable = `<g><rect x="-58" y="-50" width="116" height="100" rx="8" fill="#1b2233" ${S}/>${txt(0, -26, 16, '#ffd21f', 'TRAINS')}
    ${['9:00', '10:00', '11:00'].map((t, i) => `${txt(-26, 2 + i * 20, 15, '#ffb300', t)}<path d="M2 ${-3 + i * 20} H44" stroke="#ffb300" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join('')}</g>`;
  const driver = `<g><circle cy="34" r="40" fill="none" stroke="${OL}" stroke-width="14"/><circle cy="34" r="40" fill="none" stroke="#596178" stroke-width="8"/>
    <g transform="translate(0 -6) scale(1.25)">${dotHead()}</g><path d="M-38 30 L-10 34 M38 30 L10 34" stroke="${OL}" stroke-width="10" stroke-linecap="round"/></g>`;
  const window_ = `<g><rect x="-52" y="-46" width="104" height="92" rx="14" fill="${TRAIN}" ${S}/><rect x="-40" y="-34" width="80" height="68" rx="10" fill="${GLASS}" ${S3}/>
    ${Art.cloud(-14, -10, .25)}<g transform="translate(14 14)">${pipHead(1)}</g></g>`;
  const signal = `<g><rect x="-6" y="-10" width="12" height="70" fill="#596178" ${S3}/><rect x="-24" y="-62" width="48" height="76" rx="10" fill="#1b2233" ${S}/>
    <circle cy="-42" r="13" fill="#4a1a1a"/><circle cy="-4" r="13" fill="#4cd964" ${S3}/><path d="M-18 -4 Q-26 -4 -30 0 M18 -4 Q26 -4 30 0" fill="none" stroke="#4cd964" stroke-width="3" opacity=".6"/></g>`;
  const motorway = `<g><path d="M-14 56 L-6 -10 H6 L14 56 Z" fill="#596178" ${S3}/><path d="M0 -6 V52" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/>
    <rect x="-56" y="-56" width="112" height="48" rx="8" fill="#1e5bd6" ${S}/>${txt(0, -24, 22, '#fff', 'M1')}
    <path d="M-48 56 L-28 4 M48 56 L28 4" ${SW(4)}/></g>`;
  const passenger = `<g><g transform="translate(-8 52) scale(.5)">${window.SchoolArt ? window.SchoolArt.kid(200, { skin: '#c68a5a', hair: '#2a1a10', style: 'long' }).replace(/#1e5bd6/g, '#f07a1a') : ''}</g>
    <g transform="translate(34 50) scale(.5)">${suitcase}</g><g transform="translate(-36 -12) scale(.42)">${ticket()}</g></g>`;
  const ITEMS = {
    ticket: `<g transform="rotate(-8)">${ticket(1.2)}</g>`, passenger, platform, timetable, umbrella, suitcase, driver, window: window_, signal, motorway,
    carriage: `<g transform="translate(60 30) scale(.44)">${carriage(0, [2, null, 4])}</g>`,
    conductor: `<g transform="translate(0 14) scale(1.15)">${aminHead()}</g>`
  };

  // ---------- Safe or Not Safe? pictures (128 x 128 box, a little scene each with Pip) ----------
  const road = `<rect x="-64" y="10" width="128" height="54" fill="#5a606b"/><path d="M-64 38 H64" stroke="#fff" stroke-width="4" stroke-dasharray="12 10"/>`;
  const kerb = `<rect x="-64" y="2" width="128" height="10" fill="#c9ced8" ${S3}/>`;
  const car = (x, y, s = .5) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 -10 V-34 Q-60 -40 -52 -40 H-30 L-14 -62 H28 L46 -40 H56 Q62 -40 62 -32 V-10 Z" fill="#1e5bd6" ${S}/>
    <path d="M-24 -42 L-10 -56 H8 V-42 Z M14 -42 V-56 H26 L38 -42 Z" fill="${GLASS}" ${S3}/><circle cx="-34" cy="-8" r="12" fill="#30364a" ${S3}/><circle cx="36" cy="-8" r="12" fill="#30364a" ${S3}/></g>`;
  const seat = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-24" width="68" height="20" rx="8" fill="#1e5bd6" ${S3}/><rect x="-34" y="-78" width="16" height="64" rx="7" fill="#1e5bd6" ${S3}/>
    <rect x="-30" y="-6" width="8" height="30" fill="#596178"/><rect x="22" y="-6" width="8" height="30" fill="#596178"/></g>`;
  const busInside = `<rect x="-64" y="-64" width="128" height="128" fill="#fff6e6"/><rect x="-54" y="-54" width="60" height="40" rx="8" fill="${GLASS}" ${S3}/><rect x="-64" y="40" width="128" height="24" fill="#9aa3b5"/>`;
  const platformBg = `<rect x="-64" y="-64" width="128" height="92" fill="#dff3ff"/><rect x="-64" y="28" width="128" height="36" fill="#c9ced8"/>`;
  const SAFETY = {
    hands: `<rect x="-64" y="-64" width="128" height="80" fill="#dff3ff"/>${road}${kerb}<g transform="translate(-20 6) scale(.36)">${grandad()}</g>${pipAt(-2, -54, 60)}
      <path d="M-4 -26 Q2 -30 8 -24" fill="none" ${SW(3)}/>`,
    seat: `${busInside}${seat(-4, 40, 1.1)}${pipAt(-38, -46, 68)}`,
    line: `${platformBg}<path d="M-64 40 H64" stroke="#ffd21f" stroke-width="6"/><rect x="-64" y="56" width="128" height="8" fill="#596178"/>${pipAt(-30, -36, 66)}`,
    green: `<rect x="-64" y="-64" width="128" height="80" fill="#dff3ff"/>${road}${[-40, -16, 8, 32].map(x => `<rect x="${x}" y="14" width="14" height="48" fill="#fff"/>`).join('')}
      <g transform="translate(46 40) scale(.42)">${pedLight(true)}</g>${pipAt(-44, -30, 64)}`,
    wait: `<rect x="-64" y="-64" width="128" height="104" fill="#dff3ff"/><rect x="-64" y="40" width="128" height="24" fill="#c9ced8"/><g transform="translate(-36 54) scale(.42)">${busStop}</g>${pipAt(-10, -32, 66)}`,
    belt: `<rect x="-64" y="-64" width="128" height="128" fill="#fff1d6"/><rect x="-42" y="-20" width="84" height="76" rx="18" fill="#30364a" ${S3}/>${pipAt(-30, -46, 62)}
      <path d="M-26 -8 L30 44" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M-26 -8 L30 44" stroke="#ff8a1f" stroke-width="7" stroke-linecap="round"/><rect x="-42" y="34" width="84" height="22" rx="8" fill="#30364a"/>`,
    run: `<rect x="-64" y="-64" width="128" height="80" fill="#dff3ff"/>${road}${kerb}${car(32, 58, .5)}<g transform="rotate(-12 -20 20)">${pipAt(-52, -26, 62)}</g>
      <path d="M-58 18 H-48 M-60 6 H-50" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`,
    stand: `${busInside}${seat(-4, 40, 1.1)}${pipAt(-32, -76, 62)}<path d="M30 -40 L42 -52 M34 -30 L48 -34" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>`,
    edge: `${platformBg}<path d="M-64 30 H64" stroke="#ffd21f" stroke-width="6"/><rect x="-64" y="56" width="128" height="8" fill="#596178"/>${pipAt(-2, -16, 60)}
      <g transform="translate(-40 40) scale(.24)">${train({ cars: 0 })}</g>`,
    red: `<rect x="-64" y="-64" width="128" height="80" fill="#dff3ff"/>${road}<g transform="translate(46 40) scale(.42)">${pedLight(false)}</g>${car(-24, 62, .44)}${pipAt(-40, -30, 60)}`,
    ball: `<rect x="-64" y="-64" width="128" height="80" fill="#dff3ff"/>${road}${kerb}<g transform="translate(20 42)"><circle r="10" fill="${RED}" ${S3}/><path d="M-10 0 Q0 7 10 0" fill="none" stroke="#fff" stroke-width="3"/></g>
      ${pipAt(-56, -30, 60)}${car(54, 58, .4)}`,
    lean: `<rect x="-64" y="-64" width="128" height="128" fill="#dff3ff"/><rect x="-64" y="-20" width="128" height="84" fill="${TRAIN}"/><path d="M-64 30 H64" stroke="#fff" stroke-width="6"/>
      <rect x="-44" y="-12" width="60" height="34" rx="6" fill="${GLASS}" ${S3}/><g transform="rotate(-24 0 -20)">${pipAt(-30, -62, 58)}</g>`
  };

  // ---------- Stickers for the six places at the bus stop and the station ----------
  const SPOTS = {
    stop:   { name: 'Bus stop', art: () => `<g transform="translate(0 92) scale(.5)">${busStop}</g>`, bg: '#dff3ff' },
    bus:    { name: 'Red bus', art: () => `<g transform="translate(0 46) scale(.32)">${bus({ pip: true })}</g>`, bg: '#fff1d6' },
    bell:   { name: 'Bell button', art: () => `<g transform="translate(0 92) scale(.38)">${bell(true)}</g>`, bg: '#ffe3ef' },
    ticket: { name: 'Ticket machine', art: () => `<g transform="translate(0 64) scale(.5)">${ticketMachine(true)}</g>`, bg: '#fff6cc' },
    clock:  { name: 'Platform clock', art: () => `<g transform="scale(.7)">${clockFace(3, 0)}</g>`, bg: '#efe6ff' },
    train:  { name: 'Train', art: () => `<g transform="translate(-4 30) scale(.36)">${train({ cars: 1, pip: true })}</g>`, bg: '#e3f7e8' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="bt-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#bt-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(ITEMS[id]);
  const safetySvg = id => svg(`<defs><clipPath id="sf-${id}"><rect x="-64" y="-64" width="128" height="128" rx="14"/></clipPath></defs><g clip-path="url(#sf-${id})">${SAFETY[id]}</g>`);
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
  const faceImage = i => image(face(i, 46), '-50 -50 100 100');
  const openBusImage = (n, happy, kind = null) => image(openBus(n, happy, kind), '-160 -128 320 132');
  const puddleImage = splash => image(puddle(splash), '-80 -70 160 74');

  window.BusArt = { FOLK, ITEMS, SAFETY, SPOTS, pipAt, pipHead, grandad, grandadHead, dot, dotHead, amin, aminHead, face, bus, openBus, train, carriage, track,
    busStop, bell, ticket, ticketMachine, clockFace, clock, pedLight, puddle, car, seat, sticker, svg, itemSvg, safetySvg, image, faceImage, openBusImage, puddleImage, txt, eyes };
})();
