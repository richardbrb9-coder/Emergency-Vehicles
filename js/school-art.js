// School artwork, drawn in the app's style (navy outline, flat colours). Each object is drawn centred on 0,0 in
// about a 120 x 120 box, so the same drawing works on a sticker, a game card, the ball run board (via SchoolArt.image)
// and the story pages. People (Mrs Bell and the children) stand with their feet at 0,0.
(function () {
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r) => eye(-dx, y, r) + eye(dx, y, r);
  const smile = (y, w = 8) => `<path d="M${-w} ${y} Q0 ${y + w * .9} ${w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;

  // The crayon colours (Crayon Run, Line Up pencils and the classroom).
  const COLOURS = { red: '#e53935', blue: '#1e5bd6', yellow: '#ffd21f', green: '#2e9e4f', orange: '#f07a1a', purple: '#8e5bd6' };
  const UNIFORM = '#1e5bd6';

  // A crayon lying flat, pointing right, centred on 0,0 (about 76 long).
  const crayon = (c, len = 76) => `<g>
    <path d="M${-len / 2} -10 H${len / 2 - 16} L${len / 2} 0 L${len / 2 - 16} 10 H${-len / 2} Z" fill="${c}" ${S3}/>
    <rect x="${-len / 2 + 10}" y="-10" width="${len - 34}" height="20" fill="#fff" opacity=".85" ${S3}/>
    <path d="M${-len / 2 + 16} -4 H${len / 2 - 30} M${-len / 2 + 16} 4 H${len / 2 - 30}" stroke="${c}" stroke-width="3"/></g>`;
  // A pencil standing up, base at 0,0, len tall.
  const pencil = (c, len = 100) => `<g>
    <rect x="-9" y="${-len + 22}" width="18" height="${len - 22}" fill="${c}" ${S3}/>
    <path d="M-3 ${-len + 22} V-4" stroke="#fff" stroke-width="3" opacity=".5"/>
    <path d="M-9 ${-len + 22} L0 ${-len} L9 ${-len + 22} Z" fill="#f2c88f" ${S3}/><path d="M-3 ${-len + 7} L0 ${-len} L3 ${-len + 7} Z" fill="${OL}"/>
    <rect x="-9" y="-12" width="18" height="12" fill="#ff8fa3" ${S3}/><path d="M-9 -12 H9" stroke="#c3cad6" stroke-width="4"/></g>`;
  // A colour pot (a tin cup) with n crayons in it, base at 0,0, about 110 tall.
  const pot = (c, n = 0, cols = [c, c, c]) => `<g>
    ${[-22, 0, 22].slice(0, n).map((dx, i) => `<g transform="translate(${dx} -86) rotate(${-90 + (i - 1) * 12})">${crayon(cols[i], 64)}</g>`).join('')}
    <path d="M-44 -86 H44 L38 0 H-38 Z" fill="${c}" ${S}/>
    <path d="M-44 -86 H44" stroke="#fff" stroke-width="5" opacity=".6"/>
    <rect x="-26" y="-62" width="52" height="34" rx="8" fill="#fff" ${S3}/>
    ${c === '#fff' ? ['#e53935', '#ffd21f', '#2e9e4f', '#1e5bd6'].map((k, i) => `<rect x="${-22 + i * 11}" y="-52" width="11" height="14" fill="${k}"/>`).join('') : `<circle cy="-45" r="10" fill="${c}" ${S3}/>`}</g>`;

  const ITEMS = {
    pencil: `<g transform="rotate(35) translate(0 52)">${pencil('#ffd21f', 104)}</g>`,
    crayon: `<g transform="rotate(-30)">${crayon('#e53935', 90)}</g>`,
    scissors: `<g transform="rotate(-20)">
      <path d="M-4 -6 L40 -40 L46 -34 Z" fill="#c3cad6" ${S3}/><path d="M-4 6 L40 40 L46 34 Z" fill="#c3cad6" ${S3}/>
      <circle cx="-26" cy="-18" r="15" fill="none" stroke="${OL}" stroke-width="11"/><circle cx="-26" cy="-18" r="15" fill="none" stroke="#e53935" stroke-width="6"/>
      <circle cx="-26" cy="18" r="15" fill="none" stroke="${OL}" stroke-width="11"/><circle cx="-26" cy="18" r="15" fill="none" stroke="#e53935" stroke-width="6"/>
      <path d="M-12 -8 L0 0 L-12 8" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M-12 -8 L0 0 L-12 8" fill="none" stroke="#e53935" stroke-width="5" stroke-linecap="round"/>
      <circle r="4" fill="${OL}"/></g>`,
    lunchbox: `<g><path d="M-22 -30 Q-22 -46 0 -46 Q22 -46 22 -30" fill="none" ${SW(7)}/>
      <rect x="-50" y="-32" width="100" height="66" rx="12" fill="#2e9e4f" ${S}/><path d="M-50 -10 H50" ${SW(4)}/>
      <rect x="-12" y="-16" width="24" height="12" rx="3" fill="#ffd21f" ${S3}/>
      <circle cx="-26" cy="14" r="9" fill="#e53935" ${S3}/><path d="M-26 5 q3 -6 7 -6" fill="none" stroke="#2e9e4f" stroke-width="3"/><circle cx="24" cy="16" r="7" fill="#ffd21f" ${S3}/></g>`,
    book: `<g><path d="M-48 -34 Q-24 -42 0 -32 Q24 -42 48 -34 V36 Q24 28 0 38 Q-24 28 -48 36 Z" fill="#e53935" ${S}/>
      <path d="M-42 -30 Q-22 -36 -2 -28 V32 Q-22 24 -42 30 Z" fill="#fff" ${S3}/><path d="M42 -30 Q22 -36 2 -28 V32 Q22 24 42 30 Z" fill="#fff" ${S3}/>
      <path d="M-34 -14 Q-22 -18 -10 -14 M-34 -2 Q-22 -6 -10 -2 M-34 10 Q-22 6 -10 10" stroke="#c3cad6" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="22" cy="-6" r="10" fill="#ffd21f" ${S3}/><path d="M10 18 L18 8 L26 16 L34 6" fill="none" stroke="#2e9e4f" stroke-width="4" stroke-linecap="round"/></g>`,
    pencilcase: `<g><rect x="-54" y="-24" width="108" height="48" rx="22" fill="#8e5bd6" ${S}/>
      <path d="M-44 -6 H44" stroke="${OL}" stroke-width="4" stroke-dasharray="6 4"/><rect x="34" y="-14" width="14" height="18" rx="4" fill="#ffd21f" ${S3}/>
      <g transform="translate(-24 -30) rotate(-70)">${crayon('#e53935', 44)}</g><g transform="translate(-4 -34) rotate(-82)">${crayon('#1e5bd6', 48)}</g></g>`,
    bottle: `<g><rect x="-10" y="-56" width="20" height="14" rx="4" fill="#e53935" ${S3}/>
      <rect x="-24" y="-44" width="48" height="96" rx="16" fill="#bfe6ff" ${S}/><path d="M-24 0 H24 V36 Q24 52 8 52 H-8 Q-24 52 -24 36 Z" fill="#5cc3ff"/>
      <rect x="-24" y="-44" width="48" height="96" rx="16" fill="none" ${S}/><path d="M-12 -30 V20" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>`,
    pebag: `<g><path d="M-40 -40 L0 -20 L40 -40" fill="none" stroke="${OL}" stroke-width="5"/>
      <path d="M-40 -34 Q-46 40 0 46 Q46 40 40 -34 Q0 -22 -40 -34 Z" fill="#00a6a6" ${S}/>
      <path d="M-14 0 l-12 6 6 6 v20 h40 v-20 l6 -6 -12 -6 q-14 8 -28 0 Z" fill="#fff" ${S3}/>${txt(0, 30, 16, '#00a6a6', 'PE')}</g>`,
    schoolbag: `<g><path d="M-26 -40 Q-26 -60 0 -60 Q26 -60 26 -40" fill="none" ${SW(8)}/>
      <rect x="-46" y="-44" width="92" height="96" rx="20" fill="#e53935" ${S}/>
      <path d="M-46 -14 Q0 4 46 -14" fill="none" ${S}/><path d="M-46 -44 H46 V-14 Q0 4 -46 -14 Z" fill="#c62828" ${S}/>
      <rect x="-30" y="12" width="60" height="30" rx="8" fill="#c62828" ${S3}/><rect x="-6" y="-12" width="12" height="16" rx="3" fill="#ffd21f" ${S3}/></g>`,
    slide: `<g><path d="M-50 50 V-46 M-22 50 V-46" stroke="${OL}" stroke-width="9"/><path d="M-50 50 V-46 M-22 50 V-46" stroke="#5a606b" stroke-width="4"/>
      <path d="M-50 -30 H-22 M-50 -6 H-22 M-50 18 H-22" stroke="${OL}" stroke-width="5"/>
      <rect x="-56" y="-52" width="40" height="10" rx="3" fill="#ffd21f" ${S3}/>
      <path d="M-20 -46 Q8 -40 22 6 Q30 40 58 42 L58 54 Q22 54 12 10 Q0 -30 -20 -30 Z" fill="#e53935" ${S}/></g>`,
    computer: `<g><rect x="-50" y="-48" width="100" height="70" rx="8" fill="#5a606b" ${S}/><rect x="-40" y="-38" width="80" height="50" rx="4" fill="#5cc3ff"/>
      <circle cx="-18" cy="-16" r="8" fill="#ffd21f"/><path d="M-36 10 L-14 -8 L4 6 L18 -6 L38 10 Z" fill="#2e9e4f"/>
      <path d="M-10 22 L-16 36 H16 L10 22 Z" fill="#9aa3b5" ${S3}/><rect x="-46" y="38" width="92" height="14" rx="4" fill="#d3d9e3" ${S3}/>
      <path d="M-38 45 H38" stroke="#9aa3b5" stroke-width="3" stroke-dasharray="5 3"/></g>`,
    alphabet: `<g>${[['A', '#e53935', -32, 20], ['B', '#1e5bd6', 26, 20], ['C', '#2e9e4f', -4, -30]].map(([l, c, x, y]) => `<g transform="translate(${x} ${y})">
      <rect x="-26" y="-26" width="52" height="52" rx="6" fill="${c}" ${S}/><rect x="-18" y="-18" width="36" height="36" rx="4" fill="#fff"/>${txt(0, 13, 36, c, l)}</g>`).join('')}</g>`,
    xylophone: `<g><path d="M-54 -26 L54 -14 M-54 30 L54 18" stroke="#8b5a2b" stroke-width="10" stroke-linecap="round"/>
      ${['#e53935', '#f07a1a', '#ffd21f', '#2e9e4f', '#1e5bd6', '#8e5bd6'].map((c, i) => { const x = -44 + i * 18, h = 70 - i * 7; return `<rect x="${x - 7}" y="${2 - h / 2 + i * 1}" width="14" height="${h}" rx="4" fill="${c}" ${S3}/>`; }).join('')}
      <path d="M20 -44 L52 -64" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="-66" r="8" fill="#e53935" ${S3}/></g>`,
    uniform: `<g><path d="M0 -50 V-58 Q0 -64 6 -64" fill="none" ${SW(4)}/><path d="M-40 -46 H40" ${SW(5)}/>
      <path d="M-22 -48 L-52 -34 L-60 10 L-44 14 L-38 -10 L-36 50 H36 L38 -10 L44 14 L60 10 L52 -34 L22 -48 Q0 -34 -22 -48 Z" fill="${UNIFORM}" ${S}/>
      <path d="M-18 -46 L0 -26 L18 -46" fill="#fff" ${S3}/><path d="M-36 40 H36" stroke="#ffd21f" stroke-width="5"/>
      <path d="M-26 -14 L-18 -4 L-12 -16" fill="#ffd21f" ${S3}/></g>`,
    watercolour: `<g><path d="M-56 -14 Q-56 -44 -10 -44 H40 Q58 -44 58 -26 V22 Q58 40 40 40 H-30 Q-56 40 -56 14 Z" fill="#fff" ${S}/>
      ${[['#e53935', -34, -22], ['#ffd21f', -8, -24], ['#2e9e4f', 18, -24], ['#1e5bd6', 40, -16], ['#8e5bd6', 38, 18], ['#f07a1a', 12, 20]].map(([c, x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="8" fill="${c}" ${S3}/>`).join('')}
      <path d="M-40 22 L-12 -4" stroke="#c98b4e" stroke-width="8" stroke-linecap="round"/><path d="M-12 -4 L-4 -12" stroke="#1e5bd6" stroke-width="9" stroke-linecap="round"/></g>`,
    macaroni: `<g><path d="M-56 -6 H56 Q50 44 0 46 Q-50 44 -56 -6 Z" fill="#fff" ${S}/><path d="M-56 -6 H56" stroke="#5cc3ff" stroke-width="6"/>
      ${[[-34, -14, 20], [-14, -22, -30], [8, -16, 10], [28, -22, -20], [-22, -30, 40], [16, -30, 60], [40, -12, 30], [-4, -10, -50]].map(([x, y, r]) =>
        `<path d="M-8 4 Q-8 -8 4 -8" transform="translate(${x} ${y}) rotate(${r})" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M-8 4 Q-8 -8 4 -8" transform="translate(${x} ${y}) rotate(${r})" fill="none" stroke="#ffc94d" stroke-width="6" stroke-linecap="round"/>`).join('')}
      <path d="M44 -20 L62 -50" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M44 -20 L62 -50" stroke="#c3cad6" stroke-width="4" stroke-linecap="round"/></g>`,
    // Things that stay at home
    duck: `<g><path d="M-42 6 Q-44 40 0 42 Q44 40 46 4 Q30 14 12 6 Q-10 -4 -42 6 Z" fill="#ffd21f" ${S}/>
      <circle cx="-12" cy="-22" r="24" fill="#ffd21f" ${S}/><path d="M-36 -22 L-56 -16 L-36 -10 Z" fill="#f07a1a" ${S3}/>${eye(-18, -28, 4)}
      <path d="M4 14 Q16 24 28 14" fill="none" stroke="#e0a800" stroke-width="5" stroke-linecap="round"/></g>`,
    pillow: `<g><path d="M-52 -34 Q0 -46 52 -34 Q60 0 52 34 Q0 46 -52 34 Q-60 0 -52 -34 Z" fill="#bfe6ff" ${S}/>
      ${[[-26, -14], [10, -18], [-6, 12], [30, 14]].map(([x, y]) => `<path d="M${x} ${y - 6} l2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1 Z" fill="#fff"/>`).join('')}</g>`,
    slippers: `<g>${[-24, 24].map(x => `<g transform="translate(${x} 0)"><path d="M-16 40 Q-22 -10 -14 -36 Q0 -50 14 -36 Q22 -10 16 40 Q0 50 -16 40 Z" fill="#e86aa6" ${S}/>
      <path d="M-17 4 Q0 -8 17 4 Q20 30 14 38 Q0 46 -14 38 Q-20 30 -17 4 Z" fill="#c2185b" ${S3}/><circle cy="-2" r="7" fill="#fff" ${S3}/></g>`).join('')}</g>`,
    toaster: `<g><rect x="-50" y="-30" width="100" height="64" rx="18" fill="#c3cad6" ${S}/>
      <rect x="-30" y="-34" width="22" height="8" rx="3" fill="${OL}"/><rect x="8" y="-34" width="22" height="8" rx="3" fill="${OL}"/>
      <path d="M-34 -34 Q-34 -52 -19 -52 Q-4 -52 -4 -34 Z" fill="#e0a85a" ${S3}/><path d="M4 -34 Q4 -48 19 -48 Q34 -48 34 -34 Z" fill="#e0a85a" ${S3}/>
      <rect x="44" y="-8" width="12" height="8" rx="2" fill="${OL}"/><path d="M-36 10 H36" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/></g>`,
    pan: `<g><path d="M14 -4 L60 -30" stroke="${OL}" stroke-width="14" stroke-linecap="round"/><path d="M14 -4 L60 -30" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="-14" cy="6" rx="44" ry="30" fill="#5a606b" ${S}/><ellipse cx="-14" cy="4" rx="34" ry="21" fill="#2f3446"/>
      <ellipse cx="-14" cy="4" rx="14" ry="10" fill="#fff" ${S3}/><circle cx="-12" cy="4" r="6" fill="#ffd21f"/></g>`
  };

  // ---------- People ----------
  // A child in school uniform, feet at 0,0, h tall (about 140 to 230). look: skin, hair colour and style.
  // Drawn 200 tall, then scaled, so a shorter child looks like a smaller child (not one with short legs).
  const kid = (h, look, mood = 'smile') => `<g transform="scale(${(h / 200).toFixed(3)})">${kid200(look, mood)}</g>`;
  const kid200 = (look, mood) => {
    const h = 200, { skin = '#f2c79a', hair = '#5a3a22', style = 'short', bottom = 'trousers' } = look;
    const head = 26, hy = -h + head; // head centre
    const legTop = -h * .38, bodyTop = hy + head + 2;
    const hairBack = style === 'long' ? `<path d="M${-head - 2} ${hy} Q${-head - 6} ${hy + head * 1.6} ${-head + 6} ${hy + head * 1.5} H${head - 6} Q${head + 6} ${hy + head * 1.6} ${head + 2} ${hy} Z" fill="${hair}" ${S3}/>` : '';
    const hairTop = style === 'bunches'
      ? `<circle cx="${-head - 4}" cy="${hy - 6}" r="11" fill="${hair}" ${S3}/><circle cx="${head + 4}" cy="${hy - 6}" r="11" fill="${hair}" ${S3}/><path d="M${-head} ${hy - 2} Q0 ${hy - head * 1.6} ${head} ${hy - 2} Q0 ${hy - head * .7} ${-head} ${hy - 2} Z" fill="${hair}" ${S3}/>`
      : style === 'curly'
        ? `<g fill="${hair}" ${S3}>${[-20, -8, 6, 18].map((dx, i) => `<circle cx="${dx}" cy="${hy - head + 4 + (i % 2) * 3}" r="11"/>`).join('')}<circle cx="${-head + 2}" cy="${hy - 6}" r="9"/><circle cx="${head - 2}" cy="${hy - 6}" r="9"/></g>`
        : `<path d="M${-head} ${hy - 2} Q${-head + 2} ${hy - head * 1.3} 0 ${hy - head} Q${head - 2} ${hy - head * 1.3} ${head} ${hy - 2} Q${head * .4} ${hy - head * .6} ${-head * .2} ${hy - head * .45} Q${-head * .7} ${hy - head * .4} ${-head} ${hy - 2} Z" fill="${hair}" ${S3}/>`;
    const legs = bottom === 'skirt'
      ? `<rect x="-14" y="${legTop}" width="10" height="${-legTop - 6}" fill="${skin}" ${S3}/><rect x="4" y="${legTop}" width="10" height="${-legTop - 6}" fill="${skin}" ${S3}/>
         <path d="M-22 ${legTop - 6} H22 L26 ${legTop + 22} H-26 Z" fill="#5a606b" ${S3}/>`
      : `<rect x="-16" y="${legTop - 4}" width="14" height="${-legTop - 2}" rx="3" fill="#5a606b" ${S3}/><rect x="2" y="${legTop - 4}" width="14" height="${-legTop - 2}" rx="3" fill="#5a606b" ${S3}/>`;
    return `<g class="kid">${hairBack}${legs}
      <ellipse cx="-11" cy="-4" rx="12" ry="6" fill="${OL}"/><ellipse cx="11" cy="-4" rx="12" ry="6" fill="${OL}"/>
      <path d="M-24 ${bodyTop + 6} Q-24 ${bodyTop} -14 ${bodyTop} H14 Q24 ${bodyTop} 24 ${bodyTop + 6} L24 ${legTop + 2} H-24 Z" fill="${UNIFORM}" ${S}/>
      <path d="M-24 ${bodyTop + 8} L-32 ${legTop - 8}" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-24 ${bodyTop + 8} L-32 ${legTop - 8}" stroke="${UNIFORM}" stroke-width="8" stroke-linecap="round"/>
      <path d="M24 ${bodyTop + 8} L32 ${legTop - 8}" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M24 ${bodyTop + 8} L32 ${legTop - 8}" stroke="${UNIFORM}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="-32" cy="${legTop - 6}" r="6" fill="${skin}" ${S3}/><circle cx="32" cy="${legTop - 6}" r="6" fill="${skin}" ${S3}/>
      <path d="M-9 ${bodyTop} L0 ${bodyTop + 10} L9 ${bodyTop}" fill="#fff" ${S3}/>
      <circle cy="${hy}" r="${head}" fill="${skin}" ${S}/>${hairTop}
      ${eyes(9, hy + 2, 3.6)}${cheeks(15, hy + 10, 4)}
      ${mood === 'open' ? `<path d="M-7 ${hy + 12} Q0 ${hy + 24} 7 ${hy + 12} Z" fill="${OL}"/>` : smile(hy + 12, 7)}
    </g>`;
  };
  const KIDS = [
    { name: 'Lily', skin: '#f2c79a', hair: '#e0a030', style: 'bunches', bottom: 'skirt' },
    { name: 'Sam',  skin: '#8d5a3b', hair: '#2a1a10', style: 'curly' },
    { name: 'Aisha', skin: '#c68a5a', hair: '#2a1a10', style: 'long', bottom: 'skirt' },
    { name: 'Leo',  skin: '#f6d2b0', hair: '#b5541e', style: 'short' },
    { name: 'Mia',  skin: '#e0b088', hair: '#5a3a22', style: 'long', bottom: 'skirt' },
    { name: 'Josh', skin: '#a86e44', hair: '#2a1a10', style: 'short' }
  ];

  // Mrs Bell, the teacher (feet at 0,0, about 240 tall). bell: holding up her hand bell.
  const teacher = (bell = false) => `
    <g class="mrs-bell">
      <rect x="-22" y="-86" width="16" height="82" rx="6" fill="#2f3446" ${S3}/><rect x="6" y="-86" width="16" height="82" rx="6" fill="#2f3446" ${S3}/>
      <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="#8e1b3a" ${S3}/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="#8e1b3a" ${S3}/>
      <path d="M-36 -160 Q0 -172 36 -160 L44 -78 H-44 Z" fill="#8e5bd6" ${S}/><path d="M-10 -166 L0 -110 L10 -166" fill="#fff" ${S3}/>
      <path d="M-8 -150 V-86 M8 -150 V-86" stroke="#6f3fb8" stroke-width="4"/>
      <path d="M-34 -154 L-52 -100" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M-34 -154 L-52 -100" stroke="#8e5bd6" stroke-width="12" stroke-linecap="round"/><circle cx="-52" cy="-96" r="8" fill="#e0b088" ${S3}/>
      ${bell ? `<g class="bell-arm"><path d="M34 -154 L58 -196" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M34 -154 L58 -196" stroke="#8e5bd6" stroke-width="12" stroke-linecap="round"/><circle cx="60" cy="-200" r="8" fill="#e0b088" ${S3}/>
          <g transform="translate(66 -214) rotate(20)"><rect x="-4" y="-22" width="8" height="18" rx="3" fill="#8b5a2b" ${S3}/><path d="M-14 12 Q-14 -6 0 -6 Q14 -6 14 12 Z" fill="#ffd21f" ${S3}/><circle cy="15" r="4" fill="#ffd21f" ${S3}/></g></g>`
             : `<path d="M34 -154 L52 -100" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M34 -154 L52 -100" stroke="#8e5bd6" stroke-width="12" stroke-linecap="round"/><circle cx="52" cy="-96" r="8" fill="#e0b088" ${S3}/>`}
      <circle cy="-196" r="27" fill="#e0b088" ${S}/>
      <path d="M-28 -196 Q-30 -228 0 -228 Q30 -228 28 -196 Q20 -214 0 -214 Q-20 -214 -28 -196 Z" fill="#7a4a2a" ${S3}/><circle cy="-232" r="13" fill="#7a4a2a" ${S3}/>
      <circle cx="-10" cy="-196" r="8" fill="#fff" fill-opacity=".4" ${S3}/><circle cx="10" cy="-196" r="8" fill="#fff" fill-opacity=".4" ${S3}/><path d="M-2 -196 H2" ${S3}/>
      ${eyes(10, -196, 3)}${cheeks(18, -184, 4)}${smile(-182, 8)}
    </g>`;

  // ---------- The classroom (each drawn with its base at 0,0) ----------
  const peg = (name = 'Pip') => `<g>
    <rect x="-70" y="-190" width="140" height="22" rx="6" fill="#c98b4e" ${S}/>
    ${[-44, 0, 44].map(x => `<path d="M${x} -176 V-158 Q${x} -150 ${x + 8} -152" fill="none" ${SW(5)}/>`).join('')}
    <path d="M-6 -160 Q-30 -150 -30 -100 L-34 -40 H26 L22 -100 Q22 -150 -2 -160 Z" fill="#ffd21f" ${S}/><path d="M-4 -150 V-44" stroke="#e0a800" stroke-width="4"/>
    <rect x="30" y="-150" width="34" height="56" rx="8" fill="#e53935" ${S3}/>
    <rect x="-34" y="-222" width="68" height="28" rx="6" fill="#fff" ${S3}/>${txt(0, -201, 20, '#1e5bd6', name)}</g>`;
  const bookCorner = `<g>
    <rect x="-90" y="-150" width="120" height="150" fill="#c98b4e" ${S}/><path d="M-90 -100 H30 M-90 -50 H30" ${SW(5)}/>
    ${[['#e53935', -82], ['#1e5bd6', -66], ['#2e9e4f', -50], ['#ffd21f', -34], ['#8e5bd6', -18], ['#f07a1a', -2]].map(([c, x], i) => `<rect x="${x}" y="${-146 + (i % 2) * 6}" width="14" height="${42 - (i % 2) * 6}" fill="${c}" ${S3}/><rect x="${x + (i * 3) % 9}" y="${-96 + (i % 3) * 4}" width="14" height="${42 - (i % 3) * 4}" fill="${c}" ${S3}/>`).join('')}
    <ellipse cx="70" cy="-20" rx="56" ry="26" fill="#e86aa6" ${S}/><ellipse cx="40" cy="-40" rx="40" ry="22" fill="#ffb3c7" ${S}/>
    <g transform="translate(76 -54) rotate(-12) scale(.5)">${ITEMS.book}</g></g>`;
  const easel = `<g>
    <path d="M-50 0 L-20 -200 M50 0 L20 -200 M0 -200 L0 0" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 0 L-20 -200 M50 0 L20 -200 M0 -200 L0 0" stroke="#c98b4e" stroke-width="7" stroke-linecap="round"/>
    <rect x="-64" y="-206" width="128" height="120" fill="#fff" ${S}/>
    <circle cx="-30" cy="-176" r="14" fill="#ffd21f"/><path d="M-56 -96 Q-30 -140 0 -110 Q30 -150 56 -100 Z" fill="#2e9e4f"/>
    <path d="M10 -150 Q0 -180 26 -186 Q40 -160 10 -150 Z" fill="#e53935"/><path d="M14 -150 V-110" stroke="#2e9e4f" stroke-width="4"/>
    <rect x="-60" y="-92" width="120" height="12" rx="4" fill="#c98b4e" ${S3}/>
    ${['#e53935', '#1e5bd6', '#ffd21f'].map((c, i) => `<rect x="${-44 + i * 32}" y="-108" width="18" height="18" rx="4" fill="${c}" ${S3}/>`).join('')}</g>`;
  const sandTray = `<g>
    <path d="M-40 0 V-70 M40 0 V-70" stroke="${OL}" stroke-width="12"/><path d="M-40 0 V-70 M40 0 V-70" stroke="#1e5bd6" stroke-width="6"/>
    <path d="M-90 -110 H90 L80 -66 H-80 Z" fill="#1e5bd6" ${S}/>
    <path d="M-80 -110 Q-40 -132 -10 -114 Q20 -136 50 -116 Q70 -124 80 -110 Z" fill="#f4dca0" ${S3}/>
    <path d="M-30 -122 L-24 -150 L-8 -146 L-14 -118 Z" fill="#e53935" ${S3}/><path d="M-20 -148 L-14 -170" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>
    <path d="M20 -130 L28 -146 H52 L60 -130 Z" fill="#ffd21f" ${S3}/></g>`;
  const hamster = (mood = 'smile') => `<g>
    <path d="M-40 -6 Q-46 -50 0 -54 Q46 -50 40 -6 Q30 8 0 8 Q-30 8 -40 -6 Z" fill="#f2b56b" ${S}/>
    <path d="M-24 -6 Q-24 -30 0 -30 Q24 -30 24 -6 Q14 4 0 4 Q-14 4 -24 -6 Z" fill="#fff4e0"/>
    <circle cx="-26" cy="-48" r="11" fill="#f2b56b" ${S3}/><circle cx="26" cy="-48" r="11" fill="#f2b56b" ${S3}/><circle cx="-26" cy="-48" r="5" fill="#ff8fa3"/><circle cx="26" cy="-48" r="5" fill="#ff8fa3"/>
    ${eyes(13, -32, 4.5)}<ellipse cy="-22" rx="4" ry="3" fill="#e86aa6"/>${cheeks(22, -18, 6)}
    ${mood === 'munch' ? `<path d="M-6 -14 Q-3 -18 0 -14 Q3 -18 6 -14" fill="none" ${S3}/>` : `<path d="M-6 -16 Q0 -10 6 -16" fill="none" ${S3}/>`}
    <path d="M-30 -20 H-46 M-30 -14 H-44 M30 -20 H46 M30 -14 H44" stroke="${OL}" stroke-width="2"/></g>`;
  const hamsterCage = `<g>
    <rect x="-90" y="-40" width="180" height="40" fill="#c98b4e" ${S}/>
    <path d="M-80 -40 V-150 Q0 -200 80 -150 V-40" fill="#eaf6ff" fill-opacity=".5" ${S}/>
    ${[-60, -30, 0, 30, 60].map(x => `<path d="M${x} -40 V${-156 - (60 - Math.abs(x)) * .4}" stroke="#9aa3b5" stroke-width="3"/>`).join('')}
    <circle cx="44" cy="-82" r="34" fill="none" stroke="#e53935" stroke-width="7"/><path d="M44 -82 l0 -34 M44 -82 l30 16 M44 -82 l-30 16" stroke="#e53935" stroke-width="3"/>
    <g transform="translate(-28 -40) scale(.9)">${hamster()}</g></g>`;
  const whiteboard = `<g>
    <rect x="-150" y="-100" width="300" height="180" rx="8" fill="#fff" stroke="#9aa3b5" stroke-width="10"/>
    ${txt(-70, -20, 64, '#e53935', 'A')}${txt(0, -20, 64, '#1e5bd6', 'B')}${txt(70, -20, 64, '#2e9e4f', 'C')}
    ${txt(-70, 54, 50, '#f07a1a', '1')}${txt(0, 54, 50, '#8e5bd6', '2')}${txt(70, 54, 50, '#00a6a6', '3')}
    <rect x="-60" y="80" width="120" height="10" rx="3" fill="#9aa3b5"/></g>`;
  const school = `<g>
    <rect x="-200" y="-200" width="400" height="200" fill="#f2c879" ${S}/>
    <path d="M-220 -196 L0 -300 L220 -196 Z" fill="#e53935" ${S}/>
    <circle cy="-236" r="30" fill="#fff" ${S3}/><path d="M0 -236 V-256 M0 -236 H14" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
    ${[-150, -80, 80, 150].map(x => `<rect x="${x - 26}" y="-170" width="52" height="46" fill="#bfe6ff" ${S3}/><path d="M${x} -170 V-124 M${x - 26} -147 H${x + 26}" stroke="${OL}" stroke-width="3"/>`).join('')}
    <path d="M-40 0 V-80 Q0 -110 40 -80 V0 Z" fill="#1e5bd6" ${S}/>
    <rect x="-90" y="-112" width="180" height="30" rx="6" fill="#fff" ${S3}/>${txt(0, -89, 24, '#1e5bd6', 'SCHOOL')}</g>`;
  const gate = (x, w) => `<g transform="translate(${x} 0)"><path d="M0 -60 H${w} M0 -20 H${w}" stroke="${OL}" stroke-width="10"/><path d="M0 -60 H${w} M0 -20 H${w}" stroke="#2e9e4f" stroke-width="5"/>
    ${Array.from({ length: Math.floor(w / 26) + 1 }, (_, i) => `<path d="M${i * 26} 0 V-76" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M${i * 26} 0 V-76" stroke="#2e9e4f" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
  const bell = `<g><rect x="-8" y="-60" width="16" height="34" rx="5" fill="#8b5a2b" ${S3}/><path d="M-34 24 Q-34 -26 0 -26 Q34 -26 34 24 Z" fill="#ffd21f" ${S}/><path d="M-40 24 H40" ${SW(7)}/><circle cy="32" r="9" fill="#ffd21f" ${S3}/></g>`;
  // Pip's mum (a bigger, softer Pip with a pink collar), feet at 0,0, about 200 tall.
  const pipMum = `<g>
    <ellipse cx="0" cy="-60" rx="56" ry="64" fill="#f6e2c4" ${S}/><ellipse cx="0" cy="-50" rx="34" ry="44" fill="#fff8ee"/>
    <ellipse cx="-30" cy="-6" rx="20" ry="10" fill="#f6e2c4" ${S3}/><ellipse cx="30" cy="-6" rx="20" ry="10" fill="#f6e2c4" ${S3}/>
    <path d="M-34 -118 Q0 -104 34 -118" fill="none" stroke="#e86aa6" stroke-width="9" stroke-linecap="round"/>
    <circle cy="-160" r="46" fill="#f6e2c4" ${S}/>
    <path d="M-40 -186 Q-74 -176 -64 -122 Q-50 -130 -40 -156 Z" fill="#c98b4e" ${S3}/><path d="M40 -186 Q74 -176 64 -122 Q50 -130 40 -156 Z" fill="#c98b4e" ${S3}/>
    ${eyes(16, -166, 5)}<ellipse cy="-146" rx="9" ry="6" fill="${OL}"/><path d="M-10 -136 Q0 -128 10 -136" fill="none" ${S3}/>${cheeks(28, -144, 6)}</g>`;

  // ---------- Stickers for the classroom spots ----------
  const SPOTS = {
    teacher: { name: 'Mrs Bell', art: () => `<g transform="translate(0 112) scale(.5)">${teacher(true)}</g>`, bg: '#efe6ff' },
    peg:     { name: 'My peg', art: () => `<g transform="translate(0 72) scale(.48)">${peg()}</g>`, bg: '#fff6cc' },
    books:   { name: 'Book corner', art: () => `<g transform="translate(-10 42) scale(.46)">${bookCorner}</g>`, bg: '#ffe3ef' },
    easel:   { name: 'Painting', art: () => `<g transform="translate(0 66) scale(.48)">${easel}</g>`, bg: '#e3f7e8' },
    sand:    { name: 'Sand tray', art: () => `<g transform="translate(0 40) scale(.52)">${sandTray}</g>`, bg: '#fff1d6' },
    hamster: { name: 'Nibbles', art: () => `<g transform="translate(0 30) scale(1.1)">${hamster()}</g>`, bg: '#dff3ff' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="ss-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#ss-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
    </svg>`;

  const svg = (inner, box = '-64 -64 128 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const itemSvg = id => svg(ITEMS[id]);
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
  // 'rainbow' is the free build: crayons of every colour into a white pot.
  const RAINBOW = ['red', 'yellow', 'green', 'blue', 'orange', 'purple'];
  const crayonImage = colour => image(crayon(COLOURS[colour], 76), '-40 -14 80 28');
  const potImage = (colour, n) => image(colour === 'rainbow' ? pot('#fff', n, RAINBOW.map(k => COLOURS[k])) : pot(COLOURS[colour], n), '-56 -150 112 156');

  window.SchoolArt = { COLOURS, RAINBOW, UNIFORM, ITEMS, KIDS, SPOTS, crayon, pencil, pot, kid, teacher, peg, bookCorner, easel, sandTray, hamster, hamsterCage,
    whiteboard, school, gate, bell, pipMum, sticker, svg, itemSvg, image, crayonImage, potImage, eye, eyes, txt };
})();
