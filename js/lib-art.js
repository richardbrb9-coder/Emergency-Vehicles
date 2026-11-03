// Library artwork, drawn in the app's style (navy outline, flat colours). The front desk with Miss Rosa the librarian,
// the picture-book box, the story-time rug, the beanbag corner, the alphabet frieze and the book returns slot, plus the
// cheeky bookworm and the pictures for the games. Pip's mum comes from School (SchoolArt.pipMum). People and big things
// stand with their base at 0,0; small pictures (Library Train, Rhyme Time, Sound Shelves) are drawn in a 128 x 128 box
// centred on 0,0. Many Rhyme Time and Sound Shelves pictures are borrowed from the other worlds.
(function () {
  const { OL, S, S3 } = Art;
  const BA = window.BusArt, SA = window.SeaArt, PA = window.PupArt, ZA = window.ZooArt, TA = window.ToyArt, SC = window.SchoolArt, MA = window.MonsterArt;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r, cx = 0) => eye(cx - dx, y, r) + eye(cx + dx, y, r);
  const smile = (y, w = 8, cx = 0) => `<path d="M${cx - w} ${y} Q${cx} ${y + w * .9} ${cx + w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4, cx = 0) => `<circle cx="${cx - dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${cx + dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const RED = '#e53935', YEL = '#ffd21f', GLASS = '#bfe6ff', WOOD = '#c98b4e', WOODL = '#e0a868', WOODD = '#7a4a2a', PINK = '#c2185b';
  const BOOKC = ['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f', '#8e5bd6', '#ff8a3d', '#ff6f9c', '#0a8fb0'];
  const star = (R, r, n = 5) => 'M' + Array.from({ length: n * 2 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R;
    return `${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)}`;
  }).join(' L') + ' Z';
  const strip = s => s.replace(/<\/?svg[^>]*>/g, '');

  // ---------- Pip, wearing his round reading glasses and his library card ----------
  const pipAt = (x, y, w) => BA.pipAt(x, y, w, 'library');

  // ---------- Books ----------
  // A row of book spines standing on a shelf at height y, from x0 to x1, about h tall.
  const spines = (x0, x1, y, h, seed = 0) => {
    let out = '', x = x0, k = seed;
    while (true) {
      const bw = 14 + (k * 7) % 12, bh = h - (k * 13) % 22;
      if (x + bw > x1) break;
      out += `<rect x="${x}" y="${y - bh}" width="${bw}" height="${bh}" rx="2" fill="${BOOKC[k % BOOKC.length]}" ${S3}/>`;
      if (k % 3 === 0) out += `<path d="M${x + 3} ${y - bh + 10} H${x + bw - 3}" stroke="#fff" stroke-width="3" opacity=".7"/>`;
      x += bw + 2; k++;
    }
    return out;
  };
  // A bookshelf full of books, w wide, rows high, base centre at 0,0.
  const bookshelf = (w = 300, rows = 3, rh = 90, seed = 0) => {
    const h = rows * rh + 20;
    return `<g><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="6" fill="${WOOD}" ${S}/>
      ${Array.from({ length: rows }, (_, i) => { const y = -h + 10 + (i + 1) * rh;
        return `<rect x="${-w / 2 + 12}" y="${y - rh + 12}" width="${w - 24}" height="${rh - 12}" fill="${WOODD}"/>${spines(-w / 2 + 16, w / 2 - 16, y, rh - 24, seed + i * 5)}
        <rect x="${-w / 2 + 6}" y="${y}" width="${w - 12}" height="10" rx="3" fill="${WOODL}" ${S3}/>`; }).join('')}</g>`;
  };
  // A closed book seen from the front, centred on 0,0, about 70 x 92. pic: something on the cover.
  const cover = (c = '#1e5bd6', pic = '') => `<g><rect x="-36" y="-46" width="72" height="92" rx="6" fill="${c}" ${S}/>
    <path d="M-28 -46 V46" stroke="#fff" stroke-width="4" opacity=".45"/><rect x="-20" y="-36" width="48" height="12" rx="4" fill="#fff" opacity=".85"/>
    <g transform="translate(4 12)">${pic}</g></g>`;
  // An open book, centred on 0,0, about 150 wide. lines: words on the pages.
  const openBook = (c = PINK, inner = '', lines = true) => `<g><path d="M-78 -46 Q-40 -60 0 -46 Q40 -60 78 -46 V44 Q40 30 0 44 Q-40 30 -78 44 Z" fill="${c}" ${S}/>
    <path d="M-70 -50 Q-36 -62 0 -50 Q36 -62 70 -50 V38 Q36 26 0 38 Q-36 26 -70 38 Z" fill="#fff" ${S3}/><path d="M0 -50 V38" ${SW(3)}/>
    ${lines ? [-30, -14, 2, 18].map(y => `<path d="M-60 ${y} Q-36 ${y - 6} -10 ${y} M10 ${y} Q36 ${y - 6} 60 ${y}" stroke="#c3cad6" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('') : ''}${inner}</g>`;
  // A book for the Book Run (the balls): front cover, centred on 0,0, about 44 x 56.
  const runBook = c => `<g><rect x="-20" y="-28" width="40" height="56" rx="5" fill="${c}" ${S3}/><path d="M-14 -28 V28" stroke="#fff" stroke-width="3" opacity=".6"/>
    <rect x="-8" y="-18" width="22" height="8" rx="3" fill="#fff" opacity=".9"/><path d="M3 4 L6 11 L13 11 L8 16 L10 23 L3 19 L-4 23 L-2 16 L-7 11 L0 11 Z" fill="#fff" opacity=".8"/></g>`;

  // ---------- Miss Rosa the librarian (feet at 0,0, about 250 tall): dark hair in a bun with a pencil, round glasses,
  // a teal cardigan over a yellow dress and her lanyard. wave: one arm up. book: holding a book open. ----------
  const ROSA = { skin: '#c68a5a', hair: '#2a1a10', top: '#0a8f8f', dress: '#ffb300' };
  const rosaFace = () => `<circle cy="-196" r="27" fill="${ROSA.skin}" ${S}/>
    <circle cy="-236" r="13" fill="${ROSA.hair}" ${S3}/><path d="M-12 -248 L14 -224" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M-12 -248 L14 -224" stroke="${YEL}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-29 -192 Q-32 -226 0 -226 Q32 -226 29 -192 Q20 -212 0 -212 Q-20 -212 -29 -192 Z" fill="${ROSA.hair}" ${S3}/>
    <circle cx="-10" cy="-196" r="9" fill="#fff" fill-opacity=".3" ${S3}/><circle cx="10" cy="-196" r="9" fill="#fff" fill-opacity=".3" ${S3}/><path d="M-2 -197 Q0 -199 2 -197" fill="none" ${S3}/>
    ${eyes(10, -196, 2.8)}${cheeks(18, -184, 4)}${smile(-182, 8)}`;
  const rosa = (wave = false, book = false) => {
    const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${ROSA.top}" stroke-width="12" stroke-linecap="round"/><circle cx="${x2}" cy="${y2 + 4}" r="9" fill="${ROSA.skin}" ${S3}/>`;
    return `<g class="rosa">
      <rect x="-20" y="-52" width="13" height="48" rx="5" fill="${ROSA.skin}" ${S3}/><rect x="7" y="-52" width="13" height="48" rx="5" fill="${ROSA.skin}" ${S3}/>
      <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="${PINK}" ${S3}/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="${PINK}" ${S3}/>
      <path d="M-46 -46 L-36 -156 Q0 -168 36 -156 L46 -46 Z" fill="${ROSA.dress}" ${S}/>
      <path d="M-38 -160 Q-22 -168 -12 -166 L-6 -92 H-42 Z M38 -160 Q22 -168 12 -166 L6 -92 H42 Z" fill="${ROSA.top}" ${S3}/>
      ${[-120, -104].map(y => `<circle cx="-10" cy="${y}" r="3.5" fill="#fff" ${S3}/>`).join('')}
      <path d="M-12 -164 L0 -134 L12 -164" fill="none" stroke="${PINK}" stroke-width="4"/><rect x="-10" y="-136" width="20" height="24" rx="3" fill="#fff" ${S3}/><path d="M-6 -128 H6 M-6 -122 H2" stroke="${PINK}" stroke-width="3"/>
      ${book ? `${arm(-36, -154, -30, -110)}${arm(36, -154, 30, -110)}<g transform="translate(0 -112) scale(.5)">${openBook('#1e5bd6', `<g transform="translate(-36 -2) scale(.4)">${dragonPic}</g><g transform="translate(36 -2) scale(.36)"><path d="${star(50, 22)}" fill="${YEL}" ${S}/></g>`, false)}</g>`
        : `${arm(-36, -154, -52, -100)}${wave ? arm(36, -154, 62, -206) : arm(36, -154, 52, -100)}`}
      ${rosaFace()}</g>`;
  };

  // ---------- The bookworm: a cheeky green worm in glasses, peeping out of a book (base at 0,0, about 150 wide) ----------
  const bookworm = (up = false) => `<g class="bookworm">
    <path d="M-70 0 L-62 -40 H62 L70 0 Z" fill="#1e5bd6" ${S}/><path d="M-62 -40 Q-30 -52 0 -40 Q30 -52 62 -40 L58 -30 Q30 -40 0 -30 Q-30 -40 -58 -30 Z" fill="#fff" ${S3}/>
    <g transform="translate(10 ${up ? -24 : 0})">
      ${[[-20, -40, 15], [-6, -56, 15], [8, -68, 15]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#7ac46a" ${S3}/>`).join('')}
      <circle cx="22" cy="-86" r="22" fill="#7ac46a" ${S}/>
      <circle cx="15" cy="-88" r="8" fill="#fff" fill-opacity=".3" ${S3}/><circle cx="31" cy="-88" r="8" fill="#fff" fill-opacity=".3" ${S3}/>${eyes(8, -88, 3, 23)}
      ${smile(-76, 7, 23)}<path d="M14 -106 Q10 -120 2 -118 M30 -106 Q34 -120 42 -118" fill="none" ${SW(3)}/><circle cx="2" cy="-118" r="4" fill="${PINK}" ${S3}/><circle cx="42" cy="-118" r="4" fill="${PINK}" ${S3}/></g>
    <path d="M-62 -30 H62" stroke="#c3cad6" stroke-width="3"/></g>`;

  // ---------- The room (w x h): a cream wall, a rail of books high up, a wooden floor from floorY ----------
  const room = (w, h, floorY) => `<rect width="${w}" height="${h}" fill="#fdf1e1"/>
    <rect y="${floorY - 70}" width="${w}" height="70" fill="#f3dcc0"/><path d="M0 ${floorY - 70} H${w}" stroke="#e0b98a" stroke-width="6"/>
    <rect y="${floorY}" width="${w}" height="${h - floorY}" fill="#d9a66b"/>
    ${Array.from({ length: Math.ceil(w / 160) }, (_, i) => `<path d="M${i * 160} ${floorY} L${i * 160 - 60} ${h}" stroke="#c48e52" stroke-width="4"/>`).join('')}
    <path d="M0 ${floorY} H${w}" stroke="${OL}" stroke-width="5"/>`;
  const windowArt = (w = 180, h = 150) => `<g><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="${GLASS}" ${S}/>
    <circle cx="${w / 4}" cy="${-h * .66}" r="18" fill="${YEL}"/><path d="M${-w / 2} ${-h * .3} Q${-w / 4} ${-h * .45} 0 ${-h * .3} T${w / 2} ${-h * .3} V0 H${-w / 2} Z" fill="#7ac46a"/>
    <path d="M0 ${-h} V0 M${-w / 2} ${-h / 2} H${w / 2}" stroke="#fff" stroke-width="8"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="none" ${S}/>
    <rect x="${-w / 2 - 10}" y="-6" width="${w + 20}" height="14" rx="4" fill="#fff" ${S3}/></g>`;

  // ---------- The six places in the library (base at 0,0) ----------
  // The scanner gun. beep: its red light shines.
  const scanner = (beep = false) => `<g><path d="M-22 -16 H20 Q30 -16 30 -6 V2 H-22 Z" fill="#30364a" ${S3}/><path d="M-12 2 L-18 30 H-4 L2 2 Z" fill="#30364a" ${S3}/>
    <rect x="22" y="-14" width="8" height="12" fill="${beep ? '#ff5252' : '#7a8296'}"/>
    ${beep ? `<path d="M30 -10 L90 -34 L90 18 Z" fill="#ff5252" opacity=".35"/>${txt(-10, -30, 22, RED, 'BEEP!')}` : ''}</g>`;
  // The library card, centred on 0,0, about 180 x 112. name: the name on it.
  const card = (name = 'PIP') => `<g><rect x="-90" y="-56" width="180" height="112" rx="12" fill="#fff" ${S}/>
    <path d="M-90 -30 V-44 Q-90 -56 -78 -56 H78 Q90 -56 90 -44 V-30 Z" fill="${PINK}" ${S3}/>${txt(0, -36, 18, '#fff', 'LIBRARY CARD')}
    <rect x="-76" y="-20" width="56" height="62" rx="6" fill="#fff1d6" ${S3}/>${pawPrint(-48, 14, .9)}
    ${txt(30, 2, 26, OL, name)}<path d="M-6 16 H70" stroke="#c3cad6" stroke-width="4"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<rect x="${-6 + i * 6.5}" y="24" width="${i % 3 ? 3 : 4.5}" height="16" fill="${OL}"/>`).join('')}</g>`;
  const pawPrint = (x, y, s = 1, c = OL) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><ellipse cy="6" rx="13" ry="11"/>
    <ellipse cx="-14" cy="-10" rx="5" ry="7"/><ellipse cx="-5" cy="-18" rx="5" ry="7"/><ellipse cx="5" cy="-18" rx="5" ry="7"/><ellipse cx="14" cy="-10" rx="5" ry="7"/></g>`;
  // The front desk, with Miss Rosa behind it, her scanner and computer. live: she waves and the scanner beeps.
  const desk = (live = false) => `<g>
    <g transform="translate(-30 -70)">${rosa(live)}</g>
    <g transform="translate(96 -170)"><rect x="-48" y="-80" width="96" height="66" rx="8" fill="#30364a" ${S3}/><rect x="-40" y="-72" width="80" height="50" rx="4" fill="${live ? '#ffe3ef' : GLASS}"/>
      ${live ? pawPrint(0, -46, .7, PINK) : ''}<path d="M-6 -14 V0 M-22 0 H22" ${SW(6)}/></g>
    <rect x="-160" y="-150" width="320" height="150" fill="${WOOD}" ${S}/><rect x="-170" y="-166" width="340" height="20" rx="5" fill="${WOODL}" ${S}/>
    <rect x="-120" y="-118" width="240" height="40" rx="8" fill="${PINK}" ${S3}/>${txt(0, -89, 26, '#fff', 'ASK ME!')}
    <path d="M-140 -60 H140" stroke="${WOODD}" stroke-width="4"/>
    <g transform="translate(-118 -184)">${scanner(live)}</g>
    <g transform="translate(20 -166)"><rect x="-30" y="-14" width="60" height="14" fill="${BOOKC[1]}" ${S3}/><rect x="-26" y="-28" width="54" height="14" fill="${BOOKC[2]}" ${S3}/><rect x="-32" y="-42" width="58" height="14" fill="${BOOKC[3]}" ${S3}/></g></g>`;
  // The picture-book box: a low wooden box of books facing out. live: the books pop up.
  const COVERS = [[BOOKC[3], 'dragon'], [BOOKC[0], 'fire'], [BOOKC[4], 'star'], [BOOKC[5], 'pup']];
  const coverPic = k => ({
    dragon: `<g transform="scale(.36)">${dragonPic}</g>`,
    fire: `<g transform="scale(.42)">${Art.picto('fire', 0, 0, 1)}</g>`,
    star: `<path d="${star(20, 9)}" fill="${YEL}" ${S3}/>`,
    pup: `<g transform="scale(.28)">${PA.FARM.dog(true)}</g>`
  })[k];
  const bookBox = (live = false) => `<g>
    <path d="M-140 -40 V-110 H140 V-40 Z" fill="${WOODD}" ${S}/>
    ${COVERS.map(([c, p], i) => `<g transform="translate(${-102 + i * 68} ${-120 - (live ? (i % 2 ? 40 : 26) : 0)}) rotate(${(i - 1.5) * 6})">${cover(c, coverPic(p))}</g>`).join('')}
    <rect x="-150" y="-80" width="300" height="80" rx="8" fill="#ff8a3d" ${S}/>${txt(0, -32, 26, '#fff', 'PICTURE BOOKS')}
    ${live ? [[-150, -200], [150, -190], [0, -240]].map(([x, y]) => `<path d="${star(12, 5)}" transform="translate(${x} ${y})" fill="${YEL}" ${S3}/>`).join('') : ''}</g>`;
  // The story-time rug, with Miss Rosa's big storybook chair. live: the big book opens on the chair, with stars.
  const rug = (live = false) => `<g>
    <ellipse cy="-20" rx="200" ry="44" fill="#8e5bd6" ${S}/><ellipse cy="-20" rx="150" ry="30" fill="#b48cf0"/><ellipse cy="-20" rx="90" ry="17" fill="#ffd21f"/>
    <g transform="translate(0 -70)">
      <rect x="-80" y="-170" width="160" height="150" rx="36" fill="${PINK}" ${S}/><rect x="-96" y="-90" width="36" height="90" rx="14" fill="#e0457f" ${S}/><rect x="60" y="-90" width="36" height="90" rx="14" fill="#e0457f" ${S}/>
      <rect x="-64" y="-50" width="128" height="34" rx="10" fill="#e0457f" ${S3}/><path d="M-60 0 V16 M60 0 V16" ${SW(10)}/>
      ${live ? `<g transform="translate(0 -110) scale(.9)">${openBook('#1e5bd6', `<g transform="translate(-36 -6) scale(.36)">${dragonPic}</g><g transform="translate(36 -6) scale(.4)">${castlePic}</g>`, false)}</g>
        ${[[-110, -200], [110, -210], [-60, -250], [70, -250]].map(([x, y]) => `<path d="${star(13, 5)}" transform="translate(${x} ${y})" fill="${YEL}" ${S3}/>`).join('')}`
        : `<g transform="translate(0 -60) rotate(-6)"><rect x="-44" y="-14" width="88" height="20" rx="4" fill="#1e5bd6" ${S3}/></g>`}</g>
    ${[[-150, -26, '#1e88e5'], [150, -26, '#2e9e4f']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="16" fill="${c}" ${S3}/>`).join('')}</g>`;
  // Two beanbags and a reading lamp. live: the lamp turns on and a beanbag squashes down with a flump.
  const bag = (c, squish = false) => `<g transform="scale(${squish ? '1.1 .8' : '1 1'})"><path d="M-62 0 Q-76 -24 -56 -58 Q-30 -98 0 -96 Q34 -98 58 -56 Q74 -22 62 0 Z" fill="${c}" ${S}/>
    <path d="M-30 -70 Q-10 -84 14 -78" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/></g>`;
  const beanbag = (live = false) => `<g>
    <g transform="translate(116 0)"><path d="M0 0 V-210" stroke="${OL}" stroke-width="10"/><path d="M0 0 V-210" stroke="#c3cad6" stroke-width="5"/><ellipse rx="34" ry="8" fill="#596178" ${S3}/>
      ${live ? '<path d="M-36 -186 L-80 -60 H80 L36 -186 Z" fill="#fff6a8" opacity=".55"/>' : ''}<path d="M-34 -184 L-20 -236 H20 L34 -184 Z" fill="${live ? '#ffe066' : '#ffb300'}" ${S}/></g>
    <g transform="translate(-60 0)">${bag('#1e88e5', live)}</g><g transform="translate(40 4)">${bag(YEL)}</g>
    <g transform="translate(-60 ${live ? -78 : -96}) rotate(-8) scale(.32)">${openBook(RED)}</g></g>`;
  // The alphabet frieze: a string of letter cards along the wall, centred on 0, hanging from y -64. live: they light up.
  const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const frieze = (live = false) => `<g><path d="M-500 -64 Q0 -40 500 -64" fill="none" stroke="${OL}" stroke-width="4"/>
    ${ABC.map((l, i) => { const x = -480 + i * 38.4, y = -60 + Math.sin(i / 25 * Math.PI) * 22, c = live ? BOOKC[i % BOOKC.length] : '#fff';
      return `<g transform="translate(${x} ${y}) rotate(${live ? (i % 2 ? 6 : -6) : 0})"><rect x="-16" y="0" width="32" height="40" rx="5" fill="${c}" ${S3}/>${txt(0, 30, 26, live ? '#fff' : BOOKC[i % BOOKC.length], l)}</g>`; }).join('')}</g>`;
  // The book returns slot in the wall. live: a book slides in and a "thank you" shows.
  const returns = (live = false) => `<g>
    <rect x="-90" y="-230" width="180" height="230" rx="10" fill="#1e5bd6" ${S}/><rect x="-74" y="-216" width="148" height="40" rx="6" fill="#fff" ${S3}/>${txt(0, -186, 26, '#1e5bd6', 'RETURNS')}
    <path d="M-28 -150 L0 -122 L28 -150" fill="none" stroke="${YEL}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="-64" y="-108" width="128" height="26" rx="6" fill="#14264f" ${S3}/>
    ${live ? `<g transform="translate(0 -104) rotate(-4)"><rect x="-36" y="-50" width="72" height="50" rx="4" fill="${BOOKC[0]}" ${S3}/><path d="M-30 -50 V0" stroke="#fff" stroke-width="3" opacity=".6"/></g>
      <rect x="-66" y="-90" width="132" height="12" fill="#1e5bd6"/>${txt(0, -40, 22, YEL, 'THANK YOU!')}` : `<path d="M-50 -60 H50 M-50 -40 H50" stroke="#4a7fe6" stroke-width="6" stroke-linecap="round"/>`}
    <rect x="-100" y="-8" width="200" height="14" rx="4" fill="${WOODL}" ${S3}/></g>`;

  // ---------- Book Run: the bookshelf goal and the fish tank decoy ----------
  // A low shelf, 2 cells wide (base at 0,0, about 190 x 120), with a colour label. n: books on it. happy: they jiggle.
  const goalShelf = (n = 0, happy = false, c = BOOKC[0]) => `<g>
    <rect x="-94" y="-118" width="188" height="118" rx="6" fill="${WOOD}" ${S}/><rect x="-82" y="-106" width="164" height="90" fill="${WOODD}"/>
    ${Array.from({ length: Math.min(n, 6) }, (_, i) => `<g transform="translate(${-62 + i * 26} ${-16 - (happy && i % 2 ? 6 : 0)})"><rect x="-11" y="-66" width="22" height="66" rx="3" fill="${c}" ${S3}/><path d="M-6 -54 H6" stroke="#fff" stroke-width="3"/></g>`).join('')}
    <rect x="-90" y="-16" width="180" height="16" rx="3" fill="${WOODL}" ${S3}/>
    <rect x="-30" y="-140" width="60" height="28" rx="8" fill="${c}" ${S3}/><path d="M-12 -126 H12" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
  // The fish tank on its stand (base at 0,0, about 170 x 130). splash: water splashes out.
  const tankFish = (x, y, c, k = 1) => `<g transform="translate(${x} ${y}) scale(${k} 1)"><path d="M-16 0 Q0 -14 16 0 Q0 14 -16 0 Z" fill="${c}" ${S3}/><path d="M-16 0 L-26 -9 V9 Z" fill="${c}" ${S3}/><circle cx="7" cy="-2" r="2.5" fill="${OL}"/></g>`;
  const fishTank = (splash = false) => `<g>
    <rect x="-80" y="-24" width="160" height="24" rx="4" fill="${WOOD}" ${S3}/>
    <rect x="-76" y="-128" width="152" height="104" rx="8" fill="#7fd0ff" fill-opacity=".8" ${S}/><path d="M-72 -110 H72" stroke="#fff" stroke-width="4" opacity=".7"/>
    <path d="M-50 -24 Q-58 -50 -48 -74 M-40 -24 Q-30 -56 -40 -84" fill="none" stroke="#2e9e4f" stroke-width="6" stroke-linecap="round"/>
    ${tankFish(12, -70, '#ff8a3d')}${tankFish(44, -46, YEL, -1)}
    <ellipse cx="20" cy="-30" rx="36" ry="6" fill="#f6dc9a"/>
    ${splash ? [[-44, -150], [-10, -166], [26, -168], [56, -150]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#7fb8e6" ${S3}/>`).join('') : ''}</g>`;

  // ---------- Library Train pictures (128 x 128 box) ----------
  const dragonPic = `<g><path d="M30 20 Q70 10 62 -30 Q56 -10 40 0" fill="#5cb85c" ${S}/><path d="M58 -30 L72 -34 L64 -20 Z" fill="${YEL}" ${S3}/>
    <path d="M-10 -40 Q-40 -76 -60 -50 Q-40 -46 -30 -24 Z" fill="#9be08a" ${S3}/>
    <ellipse cx="6" cy="16" rx="42" ry="34" fill="#5cb85c" ${S}/><ellipse cx="6" cy="26" rx="26" ry="20" fill="#c8f0b8"/>
    <rect x="-20" y="40" width="16" height="16" rx="6" fill="#5cb85c" ${S3}/><rect x="16" y="40" width="16" height="16" rx="6" fill="#5cb85c" ${S3}/>
    <circle cx="-14" cy="-26" r="26" fill="#5cb85c" ${S}/><path d="M-28 -48 L-24 -62 L-16 -50 M-6 -50 L0 -62 L4 -48" fill="${YEL}" ${S3}/>
    <ellipse cx="-34" cy="-18" rx="14" ry="10" fill="#7ac46a" ${S3}/><circle cx="-40" cy="-20" r="2.5" fill="${OL}"/>${eye(-8, -30, 4.5)}${cheeks(10, -16, 4, -16)}
    <path d="M-30 -10 Q-22 -6 -14 -12" fill="none" ${S3}/>
    ${[[16, -14], [34, -2], [46, 14]].map(([x, y]) => `<path d="M${x - 6} ${y + 4} L${x} ${y - 8} L${x + 6} ${y + 4} Z" fill="${YEL}" ${S3}/>`).join('')}</g>`;
  const castlePic = `<g><rect x="-50" y="-30" width="100" height="80" fill="#c3cad6" ${S}/>${[-50, 30].map(x => `<rect x="${x}" y="-60" width="20" height="30" fill="#c3cad6" ${S3}/>`).join('')}
    <rect x="-16" y="-80" width="32" height="50" fill="#c3cad6" ${S3}/><path d="M-16 -80 L0 -104 L16 -80 Z" fill="${RED}" ${S3}/><path d="M-12 50 V24 Q0 10 12 24 V50 Z" fill="${WOODD}" ${S3}/></g>`;
  const kidFace = (skin, hair, inner = '') => `<g><circle r="34" fill="${skin}" ${S}/>${hair}${eyes(11, 0, 4)}${cheeks(20, 12, 5)}${smile(12, 9)}${inner}</g>`;
  const pirate = `<g transform="translate(0 10)">${kidFace('#f2c79a', '', `<path d="M-30 -14 L30 -2" ${SW(3)}/><ellipse cx="11" cy="0" rx="9" ry="8" fill="${OL}"/>`)}
    <path d="M-50 -20 Q-44 -64 0 -66 Q44 -64 50 -20 Q0 -36 -50 -20 Z" fill="#30364a" ${S}/><circle cy="-44" r="9" fill="#fff" ${S3}/><path d="M-6 -44 H6" stroke="${OL}" stroke-width="3"/>
    <path d="M-50 -20 Q0 -36 50 -20" fill="none" stroke="${YEL}" stroke-width="4"/></g>`;
  const princess = `<g transform="translate(0 12)"><path d="M-38 30 Q-46 -40 0 -40 Q46 -40 38 30 L26 30 Q30 -14 0 -18 Q-30 -14 -26 30 Z" fill="#e0a030" ${S3}/>
    ${kidFace('#c68a5a', `<path d="M-32 -6 Q0 -46 32 -6 Q0 -22 -32 -6 Z" fill="#e0a030" ${S3}/>`)}
    <path d="M-26 -34 L-30 -66 L-14 -48 L0 -72 L14 -48 L30 -66 L26 -34 Z" fill="${YEL}" ${S3}/><circle cy="-50" r="5" fill="#ff6f9c" ${S3}/></g>`;
  const giant = `<g><path d="M-64 60 H-8 V20 H-40 Q-64 20 -64 40 Z M64 60 H8 V20 H40 Q64 20 64 40 Z" fill="#8b5a2b" ${S}/>
    <rect x="-38" y="-64" width="28" height="86" fill="#1e5bd6" ${S3}/><rect x="10" y="-64" width="28" height="86" fill="#1e5bd6" ${S3}/>
    <g transform="translate(-6 46) scale(.22)">${SA.homeBin.replace(/<\/?svg[^>]*>/g, '')}</g>
    <path d="M-44 -64 H44" stroke="${OL}" stroke-width="6"/><path d="M-30 -56 L-30 -40 M24 -56 L24 -40" stroke="#4a7fe6" stroke-width="4"/></g>`;
  const wizard = `<g transform="translate(-8 14)">${kidFace('#f6d2b0', `<path d="M-30 18 Q-36 40 -10 48 Q0 34 10 48 Q36 40 30 18" fill="#e8edf3" ${S3}/>`)}
    <path d="M-44 -18 L4 -98 L44 -18 Z" fill="#5a3fb0" ${S}/><path d="M-50 -18 H50" ${SW(10)}/><path d="M-50 -18 H50" stroke="#5a3fb0" stroke-width="5"/>
    ${[[-6, -50, 8], [16, -34, 6], [0, -74, 5]].map(([x, y, r]) => `<path d="${star(r, r * .45)}" transform="translate(${x} ${y})" fill="${YEL}"/>`).join('')}
    <path d="M40 10 L64 -40" ${SW(7)}/><path d="${star(12, 5)}" transform="translate(66 -46)" fill="${YEL}" ${S3}/></g>`;
  const magazine = `<g transform="rotate(-6)"><rect x="-44" y="-58" width="88" height="116" rx="4" fill="#ff6f9c" ${S}/><rect x="-36" y="-50" width="72" height="22" fill="#fff"/>${txt(0, -32, 18, PINK, 'PUPS')}
    <g transform="translate(0 6) scale(.36)">${PA.FARM.dog(true)}</g><path d="M-34 44 H20 M-34 34 H8" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="26" cy="38" r="12" fill="${YEL}" ${S3}/></g>`;
  const poetry = `<g transform="rotate(4)"><path d="M-44 -58 H32 L46 -44 V58 H-44 Z" fill="#fff" ${S}/><path d="M32 -58 V-44 H46" fill="#e8edf3" ${S3}/>
    ${[-30, -16, 8, 22].map((y, i) => `<path d="M-32 ${y} H${i % 2 ? 14 : 26}" stroke="#8e5bd6" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="${star(12, 5)}" transform="translate(-20 42)" fill="${YEL}" ${S3}/><path d="M18 34 Q18 26 26 26 Q34 26 34 34 Q34 26 42 26 Q50 26 50 34 Q50 44 34 54 Q18 44 18 34 Z" transform="translate(-12 0) scale(.9)" fill="${RED}" ${S3}/></g>`;
  const bookmark = `<g transform="translate(6 6) rotate(-10) scale(.9)"><path d="M-20 -58 H20 V52 L0 36 L-20 52 Z" fill="#1e88e5" ${S}/><path d="M-12 -40 H12 M-12 -28 H6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <path d="${star(13, 6)}" transform="translate(0 4)" fill="${YEL}" ${S3}/><path d="M0 -58 Q-14 -76 -30 -70" fill="none" ${SW(4)}/><circle cx="-32" cy="-68" r="6" fill="${RED}" ${S3}/></g>`;
  const storyPic = `<g transform="translate(0 12) scale(.7)">${openBook(PINK, `<g transform="translate(-36 -6) scale(.36)">${castlePic}</g><g transform="translate(36 -6) scale(.36)">${dragonPic}</g>`, false)}
    ${[[-60, -76], [56, -80], [0, -96]].map(([x, y]) => `<path d="${star(12, 5)}" transform="translate(${x} ${y})" fill="${YEL}" ${S3}/>`).join('')}</g>`;
  const adventure = `<g><path d="M-58 -44 L-20 -54 L20 -44 L58 -54 V44 L20 54 L-20 44 L-58 54 Z" fill="#f6e3b0" ${S}/><path d="M-20 -54 V44 M20 -44 V54" stroke="#d9c08a" stroke-width="4"/>
    <path d="M-44 34 Q-30 0 -6 10 Q20 22 18 -6 Q16 -26 34 -30" fill="none" stroke="${RED}" stroke-width="5" stroke-dasharray="8 8" stroke-linecap="round"/>
    <path d="M30 -40 L44 -26 M44 -40 L30 -26" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-40 -30 L-26 -10 L-50 -10 Z" fill="#7ac46a" ${S3}/><path d="M-20 -30 L-6 -10 L-30 -10 Z" fill="#5cb85c" ${S3}/></g>`;
  const ITEMS = {
    story: storyPic, bookmark, dragon: `<g transform="scale(.95)">${dragonPic}</g>`, pirate, princess, giant, wizard, magazine, poetry,
    beanbag: `<g transform="translate(-6 46) scale(.62)">${bag('#1e88e5')}<g transform="translate(0 -90) rotate(-8) scale(.4)">${openBook(RED)}</g></g>`, adventure
  };
  // The library building comes from Pip's map (drawn once Worlds has loaded).
  ITEMS.library = `<g transform="translate(0 50) scale(.72)">${'{PLACE}'}</g>`;

  // ---------- Rhyme Time and Sound Shelves pictures (128 x 128 box) ----------
  const frog = `<g><ellipse cy="14" rx="48" ry="34" fill="#5cb85c" ${S}/><circle cx="-24" cy="-22" r="18" fill="#5cb85c" ${S}/><circle cx="24" cy="-22" r="18" fill="#5cb85c" ${S}/>
    ${eyes(24, -24, 7)}<path d="M-26 14 Q0 34 26 14" fill="none" ${SW(4)}/>${cheeks(34, 10, 6)}
    <path d="M-48 40 Q-60 46 -56 52 H-30 M48 40 Q60 46 56 52 H30" fill="#5cb85c" ${S3}/></g>`;
  const starPic = `<g><path d="${star(54, 24)}" fill="${YEL}" ${S}/>${eyes(10, -4, 4)}${smile(8, 7)}${cheeks(18, 6, 4)}</g>`;
  const bee = `<g><path d="M-6 -18 Q-30 -64 -50 -40 Q-40 -20 -10 -14 Z M6 -18 Q30 -64 50 -40 Q40 -20 10 -14 Z" fill="#dff3ff" ${S3}/>
    <ellipse cy="10" rx="44" ry="32" fill="${YEL}" ${S}/><path d="M-12 -20 Q-18 10 -12 40 M12 -20 Q18 10 12 40" stroke="${OL}" stroke-width="10" fill="none"/>
    <circle cx="-40" cy="2" r="22" fill="${YEL}" ${S}/>${eye(-46, -2, 4)}${smile(8, 6, -42)}<path d="M-44 -20 Q-50 -36 -58 -38 M-34 -20 Q-32 -36 -24 -40" fill="none" ${SW(3)}/>
    <path d="M44 10 L56 10" ${SW(5)}/></g>`;
  const moon = `<g><path d="M14 -52 Q-44 -46 -40 10 Q-34 58 22 54 Q-14 34 -12 0 Q-10 -36 14 -52 Z" fill="#fff3a0" ${S}/>${eye(-20, -2, 4)}${smile(14, 6, -20)}
    ${[[30, -30], [40, 20]].map(([x, y]) => `<path d="${star(9, 4)}" transform="translate(${x} ${y})" fill="${YEL}" ${S3}/>`).join('')}</g>`;
  const snake = `<g><path d="M-50 40 Q-56 10 -24 12 Q8 14 6 -6 Q4 -24 -18 -24" fill="none" stroke="${OL}" stroke-width="26" stroke-linecap="round"/>
    <path d="M-50 40 Q-56 10 -24 12 Q8 14 6 -6 Q4 -24 -18 -24" fill="none" stroke="#7ac46a" stroke-width="18" stroke-linecap="round"/>
    <path d="M-40 26 L-30 22 M-12 14 L-2 10" stroke="${YEL}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="-14" cy="-32" rx="26" ry="18" fill="#7ac46a" ${S}/>${eyes(9, -38, 3.5, -12)}<path d="M-40 -28 L-54 -28 L-60 -34 M-54 -28 L-60 -22" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round"/>
    <path d="M30 40 Q50 36 56 46" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M-50 40 Q-10 50 30 40" fill="none" stroke="${OL}" stroke-width="20" stroke-linecap="round"/>
    <path d="M-50 40 Q-10 50 30 40 Q50 36 56 46" fill="none" stroke="#7ac46a" stroke-width="12" stroke-linecap="round"/></g>`;
  const mouse = `<g><path d="M44 22 Q66 26 60 -4" fill="none" ${SW(4)}/><ellipse cx="6" cy="16" rx="42" ry="28" fill="#b3bbc9" ${S}/>
    <circle cx="-34" cy="-16" r="16" fill="#b3bbc9" ${S3}/><circle cx="-34" cy="-16" r="8" fill="#ffb3c1"/><circle cx="2" cy="-22" r="16" fill="#b3bbc9" ${S3}/><circle cx="2" cy="-22" r="8" fill="#ffb3c1"/>
    <circle cx="-22" cy="6" r="24" fill="#b3bbc9" ${S}/>${eyes(8, 2, 3.5, -22)}<circle cx="-44" cy="12" r="5" fill="#ff8fa3" ${S3}/>
    <path d="M-40 16 L-58 12 M-40 20 L-58 24" stroke="${OL}" stroke-width="2"/></g>`;
  const dish = `<g><ellipse cy="14" rx="58" ry="20" fill="#fff" ${S}/><ellipse cy="10" rx="40" ry="11" fill="#dff3ff"/><path d="M-58 14 Q-54 40 0 42 Q54 40 58 14" fill="#4aa8ff" ${S}/>
    <ellipse cy="14" rx="58" ry="20" fill="none" ${S}/><path d="M-30 32 H30" stroke="#fff" stroke-width="4" opacity=".7"/></g>`;
  const sock = `<g transform="rotate(-10)"><path d="M-22 -54 H22 V14 L44 30 Q56 46 40 56 Q30 60 18 52 L-16 30 Q-22 26 -22 16 Z" fill="${RED}" ${S}/>
    <rect x="-24" y="-60" width="48" height="18" rx="5" fill="#fff" ${S3}/><path d="M-22 -14 H22 M-22 2 H22" stroke="#fff" stroke-width="6"/></g>`;
  const pen = `<g transform="rotate(35)"><rect x="-10" y="-56" width="20" height="90" rx="6" fill="#1e5bd6" ${S}/><path d="M-10 34 L0 56 L10 34 Z" fill="#e8edf3" ${S3}/>
    <path d="M-2 50 L0 56 L2 50 Z" fill="${OL}"/><rect x="8" y="-50" width="6" height="34" rx="3" fill="#c3cad6" ${S3}/></g>`;
  const brick = (x, y, w, k) => `<rect x="${x}" y="${y}" width="${w}" height="20" rx="2" fill="${k % 3 ? '#d6633d' : '#c95a43'}" ${S3}/>`;
  const wall = `<g>${[0, 1, 2, 3].map(r => { const y = -42 + r * 22;
    return r % 2 ? brick(-58, y, 13, r) + [0, 1, 2].map(c => brick(-43 + c * 30, y, 28, r + c)).join('') + brick(47, y, 13, r + 1)
      : [0, 1, 2, 3].map(c => brick(-58 + c * 30, y, 28, r + c)).join(''); }).join('')}
    <path d="M-64 48 H64" stroke="#7ac46a" stroke-width="10" stroke-linecap="round"/></g>`;
  const bun = `<g><path d="M-54 20 Q-56 -36 0 -36 Q56 -36 54 20 Z" fill="#e0a050" ${S}/><rect x="-58" y="14" width="116" height="20" rx="8" fill="#f6d2a0" ${S3}/>
    ${[[-24, -16], [6, -22], [30, -10], [-6, -4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.5" fill="#fff6e0"/>`).join('')}</g>`;
  const truck = `<g><rect x="-58" y="-36" width="74" height="52" rx="6" fill="#ffb300" ${S}/><path d="M16 16 V-22 H38 Q50 -22 56 -6 L58 16 Z" fill="#e53935" ${S}/><rect x="24" y="-16" width="20" height="14" rx="3" fill="${GLASS}" ${S3}/>
    ${[-36, 34].map(x => `<circle cx="${x}" cy="22" r="13" fill="#30364a" ${S3}/><circle cx="${x}" cy="22" r="5" fill="#c3cad6"/>`).join('')}</g>`;
  const ant = `<g><path d="M-26 6 L-40 34 M-6 8 L-8 38 M14 8 L24 36 M-20 -2 L-44 -16 M18 0 L40 -20" ${SW(5)}/>
    <circle cx="-34" cy="-6" r="18" fill="#30364a" ${S3}/><ellipse cx="-4" cy="2" rx="14" ry="12" fill="#30364a" ${S3}/><ellipse cx="30" cy="0" rx="24" ry="18" fill="#30364a" ${S3}/>
    <path d="M-44 -20 Q-52 -42 -40 -50 M-34 -22 Q-30 -44 -18 -48" fill="none" ${SW(3)}/>${eye(-40, -10, 4)}<path d="M-46 0 Q-40 4 -34 0" fill="none" stroke="#fff" stroke-width="2"/></g>`;
  const arrow = `<g transform="rotate(-20)"><path d="M-56 0 H34" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M-56 0 H34" stroke="${WOODL}" stroke-width="6" stroke-linecap="round"/>
    <path d="M30 -18 L60 0 L30 18 Z" fill="#9aa3b5" ${S3}/><path d="M-60 -16 L-40 0 L-60 16 L-50 0 Z M-48 -16 L-28 0 L-48 16 L-38 0 Z" fill="${RED}" ${S3}/></g>`;
  const anchor = `<g><circle cy="-42" r="12" fill="none" ${SW(6)}/><path d="M0 -30 V50 M-22 -14 H22" ${SW(9)}/><path d="M-50 10 Q-46 52 0 52 Q46 52 50 10" fill="none" ${SW(9)}/>
    <path d="M0 -30 V50 M-22 -14 H22 M-50 10 Q-46 52 0 52 Q46 52 50 10" fill="none" stroke="#9aa3b5" stroke-width="4" stroke-linecap="round"/>
    <path d="M-58 18 L-50 0 L-40 18 Z M58 18 L50 0 L40 18 Z" fill="#9aa3b5" ${S3}/></g>`;
  const tap = `<g><rect x="-40" y="-40" width="16" height="44" rx="4" fill="#c3cad6" ${S3}/><path d="M-26 -30 H22 Q40 -30 40 -12 V10 H24 V-10 Q24 -14 20 -14 H-26 Z" fill="#c3cad6" ${S}/>
    <rect x="-6" y="-50" width="12" height="20" fill="#9aa3b5" ${S3}/><rect x="-22" y="-58" width="44" height="12" rx="5" fill="${RED}" ${S3}/>
    <ellipse cx="32" cy="30" rx="6" ry="9" fill="#7fd0ff" ${S3}/><ellipse cx="32" cy="52" rx="5" ry="7" fill="#7fd0ff" ${S3}/></g>`;
  const farm = (id, s = 1) => `<g transform="scale(${s})">${PA.FARM[id](false)}</g>`;
  const PICS = {
    cat: farm('cat'), hat: SA.PACK.hat, dog: farm('dog'), frog, boat: SA.SINKFLOAT.boat, coat: SA.PACK.coat,
    car: TA.ITEMS.car, star: starPic, bee, tree: `<g transform="translate(-4 52) scale(.42)">${Art.tree(0, 0, 1).replace(/^\s*<g transform="translate\(0 0\) scale\(1\)">/, '<g>')}</g>`,
    moon, spoon: SA.SINKFLOAT.spoon, cake: `<g transform="translate(0 24) scale(.8)">${TA.cake}</g>`, snake,
    mouse, house: strip(SA.homeBin), fish: `<g transform="scale(1.5)">${ZA.FOOD.fish}</g>`, dish,
    clock: `<g>${BA.clockFace(3, 0, 50)}</g>`, sock, hen: farm('hen'), pen, ball: TA.ITEMS.ball, wall,
    sun: `<g transform="scale(.72)">${SA.sun(0, 0, 50)}</g>`, bun, shell: SA.SINKFLOAT.shell, bell: `<g transform="translate(0 6) scale(1.15)">${SC.bell}</g>`,
    duck: SA.SINKFLOAT.duck, truck,
    // Sound Shelves only
    apple: SA.SINKFLOAT.apple, ant, arrow, anchor,
    six: MA.numeral(6, '#1e5bd6', 100), ten: MA.numeral(10, '#e53935', 90),
    tap, tiger: `<g transform="scale(.95)">${ZA.animal('tiger')}</g>`, teddy: TA.ITEMS.teddy, tomato: window.SupermarketArt.ITEMS.tomato,
    pig: farm('pig'), panda: `<g transform="scale(.95)">${ZA.animal('panda')}</g>`, penguin: `<g transform="scale(.95)">${ZA.animal('penguin')}</g>`, pencil: SC.ITEMS.pencil
  };
  // A Sound Shelves shelf: the letter, and the picture whose first sound it is.
  const soundShelf = (letter, c, pic) => `<svg viewBox="-64 -64 128 128"><rect x="-58" y="-58" width="116" height="116" rx="14" fill="#fff" ${S}/>
    <rect x="-58" y="-58" width="116" height="40" rx="14" fill="${c}" ${S3}/>${txt(-24, -26, 40, '#fff', letter)}<g transform="translate(26 -40) scale(.3)">${PICS[pic]}</g>
    <path d="M-48 46 H48" stroke="${WOOD}" stroke-width="10" stroke-linecap="round"/><path d="M-48 46 H48" ${SW(3)} fill="none" opacity=".4"/>
    ${spines(-44, 44, 40, 46, letter.charCodeAt(0))}</svg>`;

  // ---------- Stickers for the six places in the library ----------
  const SPOTS = {
    desk:     { name: 'Miss Rosa', art: () => `<g transform="translate(0 100) scale(.55)">${rosa(true)}</g>`, bg: '#e0f5f5' },
    box:      { name: 'Picture books', art: () => `<g transform="translate(0 46) scale(.3)">${bookBox(true)}</g>`, bg: '#fff1d6' },
    rug:      { name: 'Story rug', art: () => `<g transform="translate(0 66) scale(.3)">${rug(true)}</g>`, bg: '#efe6ff' },
    beanbag:  { name: 'Beanbags', art: () => `<g transform="translate(-6 36) scale(.3)">${beanbag(true)}</g>`, bg: '#dff3ff' },
    frieze:   { name: 'Alphabet', art: () => `<g transform="translate(0 10)">${['a', 'b', 'c'].map((l, i) => `<g transform="translate(${-30 + i * 30} ${i % 2 ? -6 : 4}) rotate(${(i - 1) * 8})"><rect x="-14" y="-18" width="28" height="36" rx="5" fill="${BOOKC[i]}" ${S3}/>${txt(0, 10, 26, '#fff', l)}</g>`).join('')}</g>`, bg: '#fff6cc' },
    returns:  { name: 'Book returns', art: () => `<g transform="translate(0 40) scale(.34)">${returns(true)}</g>`, bg: '#e3ecff' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="lib-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#lib-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(id === 'library' && window.Worlds ? ITEMS.library.replace('{PLACE}', window.Worlds.placeIcon('library').replace(/<\/?svg[^>]*>/g, '')) : ITEMS[id]);
  const picSvg = id => svg(PICS[id]);
  // A drawing as an image, for the canvas (Book Run board). Ready when loaded; draw() skips it until then.
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
  const bookImage = c => image(runBook(c), '-30 -34 60 68');
  const shelfImage = (n, happy, c) => image(goalShelf(n, happy, c), '-100 -150 200 154');
  const tankImage = splash => image(fishTank(splash), '-90 -180 180 184');

  window.LibArt = { BOOKC, ITEMS, PICS, SPOTS, ROSA, pipAt, rosa, rosaFace, bookworm, room, windowArt, spines, bookshelf, cover, openBook, runBook, card, pawPrint, scanner,
    desk, bookBox, rug, bag, beanbag, frieze, returns, goalShelf, fishTank, dragonPic, castlePic, soundShelf, sticker, svg, itemSvg, picSvg, image,
    bookImage, shelfImage, tankImage, star, txt, eyes, smile };
})();
