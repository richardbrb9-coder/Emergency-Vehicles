// Supermarket artwork, drawn in the app's style (navy outline, flat colours). Each food is drawn centred on 0,0 in
// about a 120 x 120 box, so the same drawing works on a shelf, a sticker, a game card, the ball run board (via
// SupermarketArt.image) and the story pages. Big things (the trolley, the till, the fridge) stand with their base at 0,0.
(function () {
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r) => eye(-dx, y, r) + eye(dx, y, r);
  const smile = (y, w = 8) => `<path d="M${-w} ${y} Q0 ${y + w * .9} ${w} ${y}" fill="none" ${S3}/>`;
  const cheeks = (dx, y, r = 4) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const txt = (x, y, size, fill, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${fill}">${s}</text>`;
  const leaf = (x, y, r, c = '#2e9e4f') => `<path d="M${x} ${y} q8 -14 22 -12 q-6 14 -22 12 Z" transform="rotate(${r} ${x} ${y})" fill="${c}" ${S3}/>`;
  const shine = (x, y, rx = 6, ry = 10, r = -20) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#fff" opacity=".55"/>`;

  // ---------- Round foods (also the balls in Trolley Run: drawn in a 100 box so they turn as they roll) ----------
  const ROUND = {
    orange: `<g><circle r="44" fill="#f7931e" ${S}/>${[[-14, -8], [10, 10], [16, -16], [-10, 18], [0, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#d9700a"/>`).join('')}
      ${shine(-18, -18)}<path d="M0 -44 V-52" ${SW(5)}/>${leaf(2, -48, -10)}</g>`,
    apple: `<g><path d="M0 -30 Q-20 -46 -38 -30 Q-56 -8 -40 22 Q-24 48 0 38 Q24 48 40 22 Q56 -8 38 -30 Q20 -46 0 -30 Z" fill="#e53935" ${S}/>
      ${shine(-22, -12)}<path d="M0 -30 Q2 -44 8 -52" fill="none" ${SW(5)}/>${leaf(6, -44, -20)}</g>`,
    tomato: `<g><ellipse rx="46" ry="40" fill="#e8322b" ${S}/>${shine(-20, -14, 7, 11)}
      <path d="M0 -40 L-16 -50 L-8 -36 L-26 -34 L-6 -30 L0 -22 L6 -30 L26 -34 L8 -36 L16 -50 Z" fill="#2e9e4f" ${S3}/></g>`,
    lemon: `<g><path d="M-48 0 Q-44 -38 0 -40 Q44 -38 48 0 Q44 38 0 40 Q-44 38 -48 0 Z" fill="#ffe14d" ${S}/>
      <path d="M-48 0 L-56 -3 L-52 4 Z M48 0 L56 3 L52 -4 Z" fill="#ffe14d" ${S3}/>${shine(-16, -16, 6, 12, -60)}</g>`,
    onion: `<g><path d="M0 -50 Q8 -38 22 -30 Q46 -12 40 14 Q32 42 0 42 Q-32 42 -40 14 Q-46 -12 -22 -30 Q-8 -38 0 -50 Z" fill="#c98b4e" ${S}/>
      <path d="M0 -40 Q-22 -10 -14 38 M0 -40 Q22 -10 14 38" fill="none" stroke="#a5672e" stroke-width="3"/><path d="M-10 42 l-4 6 M0 42 v8 M10 42 l4 6" ${SW(3)}/></g>`,
    tin: `<g><circle r="44" fill="#c3cad6" ${S}/><circle r="34" fill="#e7ebf2" ${S3}/><circle r="24" fill="none" stroke="#9aa3b5" stroke-width="3"/>
      <circle r="14" fill="none" stroke="#9aa3b5" stroke-width="3"/><path d="M-6 -30 Q8 -32 16 -24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`
  };
  const ROUND_IDS = ['orange', 'apple', 'tomato', 'lemon', 'tin', 'onion'];

  const ITEMS = Object.assign({}, ROUND, {
    // Fruit
    banana: `<g transform="rotate(-10)">${[[-6, 0], [4, 10], [14, 20]].map(([dx, dy], i) => `<path d="M${-48 + dx} ${-18 + dy} Q${-30 + dx} ${26 + dy} ${30 + dx} ${18 + dy} Q${44 + dx} ${14 + dy} ${50 + dx} ${2 + dy} Q${8 + dx} ${8 + dy} ${-36 + dx} ${-24 + dy} Z" fill="${i === 1 ? '#ffd21f' : '#ffe14d'}" ${S}/>`).join('')}
      <path d="M-58 -26 L-46 -36 L-38 -22 Z" fill="#8bc34a" ${S3}/><path d="M60 22 l6 -4" ${SW(6)}/></g>`,
    pear: `<g><path d="M0 -38 Q-16 -38 -16 -16 Q-16 -4 -30 8 Q-44 22 -34 38 Q-20 54 0 50 Q20 54 34 38 Q44 22 30 8 Q16 -4 16 -16 Q16 -38 0 -38 Z" fill="#b5d334" ${S}/>
      ${shine(-16, 20, 6, 10)}<path d="M0 -38 Q2 -48 8 -54" fill="none" ${SW(5)}/>${leaf(5, -48, -30)}</g>`,
    grapes: `<g><path d="M0 -44 Q4 -54 12 -56" fill="none" ${SW(5)}/>${leaf(4, -48, -20)}
      ${[[-24, -26], [0, -30], [24, -26], [-12, -6], [12, -6], [-26, 10], [26, 10], [0, 14], [-12, 32], [12, 32], [0, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#8e5bd6" ${S3}/><circle cx="${x - 4}" cy="${y - 4}" r="3.5" fill="#fff" opacity=".5"/>`).join('')}</g>`,
    strawberry: `<g><path d="M0 -30 Q-44 -40 -40 -4 Q-30 34 0 50 Q30 34 40 -4 Q44 -40 0 -30 Z" fill="#e53935" ${S}/>
      ${[[-18, -10], [0, -6], [18, -10], [-12, 12], [12, 12], [0, 30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3.4" fill="#ffe14d"/>`).join('')}
      <path d="M0 -30 L-24 -42 L-10 -28 L-26 -22 L-4 -22 L0 -12 L4 -22 L26 -22 L10 -28 L24 -42 Z" fill="#2e9e4f" ${S3}/></g>`,
    watermelon: `<g><path d="M-56 -14 A56 56 0 0 0 56 -14 Z" fill="#2e9e4f" ${S}/><path d="M-48 -14 A48 48 0 0 0 48 -14 Z" fill="#ff5a6e" ${S3}/>
      <path d="M-56 -14 H56" ${SW(5)}/>${[[-26, 0], [-8, 10], [12, 4], [28, -2], [0, 22], [-18, 18], [20, 18]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.5" ry="4" fill="${OL}"/>`).join('')}</g>`,
    avocado: `<g transform="rotate(-20)"><path d="M0 -54 Q-20 -54 -24 -20 Q-46 10 -40 32 Q-30 56 0 56 Q30 56 40 32 Q46 10 24 -20 Q20 -54 0 -54 Z" fill="#3f7d2c" ${S}/>
      <path d="M0 -44 Q-14 -44 -16 -16 Q-36 12 -30 30 Q-22 46 0 46 Q22 46 30 30 Q36 12 16 -16 Q14 -44 0 -44 Z" fill="#cde58a"/><circle cy="20" r="17" fill="#8b5a2b" ${S3}/><circle cx="-5" cy="14" r="5" fill="#fff" opacity=".4"/></g>`,
    // Vegetables
    carrot: `<g transform="rotate(-35)"><path d="M-14 -36 Q0 -42 14 -36 L2 52 Q0 56 -2 52 Z" fill="#f07a1a" ${S}/>
      <path d="M-8 -14 H0 M2 4 H10 M-6 22 H2" ${SW(3)}/>
      <path d="M0 -38 Q-12 -60 -20 -62 M0 -38 Q0 -62 4 -66 M0 -38 Q12 -58 22 -58" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/>
      <path d="M0 -38 Q-12 -60 -20 -62 M0 -38 Q0 -62 4 -66 M0 -38 Q12 -58 22 -58" fill="none" stroke="#2e9e4f" stroke-width="5" stroke-linecap="round"/></g>`,
    broccoli: `<g><path d="M-10 0 L-14 50 H14 L10 0 Z" fill="#8bc34a" ${S}/>
      ${[[-28, -8, 20], [0, -26, 24], [28, -8, 20], [-14, -30, 18], [16, -32, 18], [0, -4, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2e9e4f" ${S3}/>`).join('')}
      ${[[-30, -12], [-2, -32], [26, -14], [4, -8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#5cb85c"/>`).join('')}</g>`,
    potato: `<g><path d="M-48 -6 Q-46 -36 -10 -36 Q30 -40 46 -14 Q56 14 30 30 Q0 44 -30 30 Q-52 18 -48 -6 Z" fill="#d9a55b" ${S}/>
      ${[[-24, -14], [10, -20], [22, 10], [-8, 14]].map(([x, y]) => `<path d="M${x - 3} ${y} q3 -3 6 0" fill="none" stroke="#a5672e" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`,
    cucumber: `<g transform="rotate(-25)"><rect x="-58" y="-16" width="116" height="32" rx="16" fill="#3f9b4b" ${S}/>
      <path d="M-40 -6 H30 M-30 6 H40" stroke="#7cc46a" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 12"/></g>`,
    // Cold things (the fridge)
    milk: `<g><path d="M-26 -30 L-14 -50 H14 L26 -30 V52 H-26 Z" fill="#fff" ${S}/><rect x="-14" y="-62" width="28" height="14" rx="4" fill="#1e5bd6" ${S3}/>
      <path d="M-26 -30 H26" ${SW(4)}/><rect x="-26" y="-2" width="52" height="34" fill="#5cc3ff" ${S3}/>${txt(0, 22, 18, '#fff', 'MILK')}</g>`,
    cheese: `<g><path d="M-50 30 V-6 L40 -40 L50 -10 V30 Z" fill="#ffd21f" ${S}/><path d="M-50 -6 L50 -10" ${SW(4)}/>
      ${[[-24, 10, 7], [6, 16, 5], [30, 6, 6], [10, -18, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f0b400"/>`).join('')}</g>`,
    yoghurt: `<g><path d="M-36 -26 H36 L28 44 H-28 Z" fill="#fff" ${S}/><rect x="-42" y="-38" width="84" height="14" rx="5" fill="#e86aa6" ${S3}/>
      <circle cy="10" r="15" fill="#e53935" ${S3}/>${leaf(0, -4, -30)}<path d="M-34 32 H34" stroke="#ffb3c7" stroke-width="6"/></g>`,
    butter: `<g><path d="M-52 -4 L-30 -26 H52 L30 -4 Z" fill="#fff3a0" ${S}/><path d="M-52 -4 H30 V30 H-52 Z" fill="#ffe14d" ${S}/><path d="M30 -4 L52 -26 V8 L30 30 Z" fill="#f2c200" ${S}/>
      <rect x="-42" y="2" width="62" height="20" rx="4" fill="#1e5bd6" ${S3}/>${txt(-11, 18, 14, '#fff', 'BUTTER')}</g>`,
    // The bakery (the bread bin)
    loaf: `<g><path d="M-54 30 V-4 Q-54 -40 -24 -40 Q-10 -48 4 -40 Q18 -48 32 -40 Q56 -40 54 -4 V30 Z" fill="#d9944a" ${S}/>
      <path d="M-30 -30 Q-24 -16 -20 -28 M-4 -32 Q2 -18 6 -30 M22 -32 Q28 -18 32 -30" fill="none" stroke="#f2c88f" stroke-width="5" stroke-linecap="round"/></g>`,
    rolls: `<g>${[[-26, 12], [26, 12], [0, -16]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-28 16 Q-34 -22 0 -24 Q34 -22 28 16 Z" fill="#e0a85a" ${S}/><path d="M-12 -12 Q0 -4 12 -12" fill="none" stroke="#f6d39a" stroke-width="5" stroke-linecap="round"/></g>`).join('')}</g>`,
    croissant: `<g><path d="M-56 16 Q-58 -6 -40 -16 Q-22 -40 0 -40 Q22 -40 40 -16 Q58 -6 56 16 Q40 6 26 10 Q12 -2 0 -2 Q-12 -2 -26 10 Q-40 6 -56 16 Z" fill="#e8a54b" ${S}/>
      <path d="M-26 10 Q-26 -16 -14 -30 M26 10 Q26 -16 14 -30 M0 -2 V-40" fill="none" ${SW(3)}/></g>`,
    // The cupboard
    cereal: `<g><rect x="-36" y="-54" width="72" height="104" rx="4" fill="#f07a1a" ${S}/><rect x="-28" y="-44" width="56" height="20" rx="4" fill="#fff" ${S3}/>${txt(0, -29, 13, '#f07a1a', 'FLAKES')}
      <ellipse cy="14" rx="24" ry="14" fill="#fff" ${S3}/>${[[-10, 8], [4, 6], [12, 14], [-4, 16]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#ffd21f" ${S3}/>`).join('')}
      <path d="M-24 14 Q0 34 24 14" fill="#5cc3ff" ${S3}/></g>`,
    biscuit: `<g><circle r="44" fill="#d9944a" ${S}/><circle r="34" fill="none" stroke="#b97434" stroke-width="3" stroke-dasharray="4 6"/>
      ${[[-14, -12], [12, -16], [0, 6], [-16, 16], [18, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#6b3f1d"/>`).join('')}</g>`,
    pasta: `<g><path d="M-34 -50 H34 L30 50 H-30 Z" fill="#fff" fill-opacity=".85" ${S}/><rect x="-34" y="-58" width="68" height="14" rx="4" fill="#e53935" ${S3}/>
      ${[[-16, -24, 30], [10, -30, -20], [-6, -2, 60], [16, 6, 10], [-18, 22, -40], [6, 30, 30]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-10 -5 L10 -8 L10 8 L-10 5 Z" fill="#ffc94d" ${S3}/></g>`).join('')}</g>`,
    // Not on the list (Pip asks for it in the story)
    lollipop: `<g><path d="M0 4 V60" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M0 4 V60" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <circle cy="-24" r="36" fill="#ff6f9c" ${S}/><path d="M0 -24 m-24 0 a24 24 0 1 1 24 24 a16 16 0 1 1 -16 -16 a8 8 0 1 1 8 8" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`
  });

  // What each food is called, for the voice and labels.
  const NAMES = {
    orange: 'an orange', apple: 'an apple', tomato: 'a tomato', lemon: 'a lemon', onion: 'an onion', tin: 'a tin of beans',
    banana: 'bananas', pear: 'a pear', grapes: 'grapes', strawberry: 'strawberries', watermelon: 'a watermelon', avocado: 'an avocado',
    carrot: 'a carrot', broccoli: 'broccoli', potato: 'a potato', cucumber: 'a cucumber',
    milk: 'milk', cheese: 'cheese', yoghurt: 'a yoghurt', butter: 'butter',
    loaf: 'a loaf of bread', rolls: 'bread rolls', croissant: 'a croissant',
    cereal: 'cereal', biscuit: 'a biscuit', pasta: 'pasta', lollipop: 'a giant lollipop'
  };

  // ---------- Big things ----------
  // The trolley, wheels at 0,0, about 150 wide and 150 tall. load: food ids piled in the basket.
  const trolley = (load = []) => `<g>
    <path d="M-80 -150 L-66 -150 L-50 -60 H66" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-80 -150 L-66 -150 L-50 -60 H66" fill="none" stroke="#9aa3b5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="-92" y="-160" width="30" height="16" rx="6" fill="#e53935" ${S3}/>
    ${load.map((id, i) => `<g transform="translate(${-30 + (i % 4) * 26} ${-110 - Math.floor(i / 4) * 24 + (i % 2) * 6}) scale(.36)">${ITEMS[id]}</g>`).join('')}
    <path d="M-62 -130 H80 L66 -60 H-50 Z" fill="#c3cad6" fill-opacity=".55" ${S}/>
    ${[-36, -8, 20, 48].map(x => `<path d="M${x} -130 L${x - 4} -60" stroke="${OL}" stroke-width="3"/>`).join('')}<path d="M-58 -100 H74" stroke="${OL}" stroke-width="3"/>
    <path d="M-62 -130 H80" stroke="#2e9e4f" stroke-width="7" stroke-linecap="round"/>
    <path d="M-50 -60 L-40 -18 H56 L66 -60" fill="none" ${SW(5)}/><path d="M-40 -18 V-10 M56 -18 V-10" ${SW(5)}/>
    <circle cx="-40" cy="-6" r="9" fill="#5a606b" ${S3}/><circle cx="56" cy="-6" r="9" fill="#5a606b" ${S3}/></g>`;
  // A shopping basket (Pip's outfit hint, the tile), centred.
  const basket = `<g><path d="M-30 -18 Q-30 -56 0 -56 Q30 -56 30 -18" fill="none" ${SW(8)}/><path d="M-30 -18 Q-30 -56 0 -56 Q30 -56 30 -18" fill="none" stroke="#e53935" stroke-width="4"/>
    <path d="M-52 -20 H52 L42 40 H-42 Z" fill="#e53935" ${S}/>${[-28, -10, 8, 26].map(x => `<rect x="${x - 4}" y="-8" width="10" height="38" rx="3" fill="#b71c1c"/>`).join('')}</g>`;
  // The till with its belt, base at 0,0, about 260 wide.
  const till = (beep = false) => `<g>
    <rect x="-130" y="-90" width="260" height="90" fill="#5a606b" ${S}/><rect x="-130" y="-106" width="180" height="20" rx="6" fill="#2f3446" ${S}/>
    ${[-110, -80, -50, -20, 10, 40].map(x => `<path d="M${x} -104 V-90" stroke="#5a606b" stroke-width="4"/>`).join('')}
    <rect x="56" y="-112" width="70" height="26" rx="4" fill="#d3d9e3" ${S3}/><rect x="70" y="-108" width="42" height="12" rx="3" fill="${beep ? '#ff5a6e' : '#9aa3b5'}"/>
    <path d="M100 -112 V-150" ${SW(6)}/><rect x="70" y="-196" width="62" height="48" rx="6" fill="#2f3446" ${S}/><rect x="78" y="-188" width="46" height="30" rx="3" fill="#7be0a0"/>
    ${txt(101, -166, 18, '#2f3446', '£')}
    ${beep ? `<text x="150" y="-130" font-family="Fredoka, sans-serif" font-weight="700" font-size="30" fill="#e53935" stroke="#fff" stroke-width="5" paint-order="stroke">Beep!</text>` : ''}
    <rect x="-112" y="-70" width="60" height="50" rx="4" fill="#9aa3b5"/><rect x="-30" y="-70" width="60" height="50" rx="4" fill="#9aa3b5"/></g>`;
  // Ruby, who works at the till (feet at 0,0, about 240 tall). wave: one hand up.
  const worker = (wave = false) => `<g class="ruby">
    <rect x="-22" y="-86" width="16" height="82" rx="6" fill="#2f3446" ${S3}/><rect x="6" y="-86" width="16" height="82" rx="6" fill="#2f3446" ${S3}/>
    <ellipse cx="-15" cy="-4" rx="15" ry="7" fill="${OL}"/><ellipse cx="15" cy="-4" rx="15" ry="7" fill="${OL}"/>
    <path d="M-36 -160 Q0 -172 36 -160 L42 -80 H-42 Z" fill="#2e9e4f" ${S}/><path d="M-22 -164 V-80 M22 -164 V-80" stroke="#1f7a3a" stroke-width="4"/>
    <rect x="8" y="-146" width="24" height="16" rx="3" fill="#fff" ${S3}/><path d="M12 -138 H28" stroke="#2e9e4f" stroke-width="3"/>
    <path d="M-34 -154 L-52 -100" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M-34 -154 L-52 -100" stroke="#2e9e4f" stroke-width="12" stroke-linecap="round"/><circle cx="-52" cy="-96" r="8" fill="#a86e44" ${S3}/>
    ${wave ? `<path d="M34 -154 L58 -200" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M34 -154 L58 -200" stroke="#2e9e4f" stroke-width="12" stroke-linecap="round"/><circle cx="60" cy="-206" r="9" fill="#a86e44" ${S3}/>`
           : `<path d="M34 -154 L52 -100" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M34 -154 L52 -100" stroke="#2e9e4f" stroke-width="12" stroke-linecap="round"/><circle cx="52" cy="-96" r="8" fill="#a86e44" ${S3}/>`}
    <circle cy="-196" r="27" fill="#a86e44" ${S}/>
    <path d="M-30 -200 Q-34 -234 0 -232 Q34 -234 30 -200 Q28 -170 34 -150 Q20 -160 22 -196 Q0 -212 -22 -196 Q-20 -160 -34 -150 Q-28 -170 -30 -200 Z" fill="#2a1a10" ${S3}/>
    <path d="M-30 -214 Q0 -238 30 -214 L32 -206 Q0 -222 -32 -206 Z" fill="#2e9e4f" ${S3}/>
    ${eyes(10, -194, 3)}${cheeks(17, -182, 4)}${smile(-182, 8)}
  </g>`;
  // Weighing scales with a pile of bananas, base at 0,0.
  const scales = `<g>
    <rect x="-60" y="-60" width="120" height="60" rx="10" fill="#e7ebf2" ${S}/><rect x="-36" y="-46" width="72" height="30" rx="4" fill="#2f3446" ${S3}/>${txt(0, -24, 22, '#7be0a0', '1 kg')}
    <path d="M-10 -60 V-76 H10 V-60" fill="#c3cad6" ${S3}/><path d="M-76 -80 H76 L64 -96 H-64 Z" fill="#c3cad6" ${S}/>
    <g transform="translate(0 -122) scale(.72)">${ITEMS.banana}</g></g>`;
  // The fruit and vegetable stand (crates on a slope), base at 0,0, about 300 wide.
  const crate = (id, x, y, colour = '#c98b4e') => `<g transform="translate(${x} ${y})">
    ${[[-30, -20], [0, -26], [30, -20], [-16, -40], [16, -40]].map(([dx, dy]) => `<g transform="translate(${dx} ${dy}) scale(.34)">${ITEMS[id]}</g>`).join('')}
    <rect x="-56" y="-24" width="112" height="40" rx="4" fill="${colour}" ${S}/><path d="M-56 -4 H56" stroke="#8b5a2b" stroke-width="4"/></g>`;
  const fruitStand = `<g>
    <path d="M-160 0 V-40 M160 0 V-40" ${SW(10)}/><rect x="-170" y="-60" width="340" height="24" rx="6" fill="#8b5a2b" ${S}/>
    ${crate('apple', -110, -76)}${crate('banana', 0, -76)}${crate('orange', 110, -76)}
    ${crate('carrot', -110, -160)}${crate('broccoli', 0, -160)}${crate('potato', 110, -160)}
    <rect x="-170" y="-150" width="340" height="14" rx="5" fill="#8b5a2b" ${S3}/>
    <rect x="-80" y="-268" width="160" height="40" rx="8" fill="#2e9e4f" ${S}/>${txt(0, -240, 22, '#fff', 'FRUIT & VEG')}</g>`;
  // The bakery shelf, base at 0,0.
  const bakery = `<g>
    <rect x="-130" y="-230" width="260" height="230" rx="6" fill="#c98b4e" ${S}/>
    <rect x="-118" y="-216" width="236" height="200" fill="#f6e2c4"/>
    <path d="M-118 -150 H118 M-118 -84 H118" ${SW(6)}/>
    ${[-80, 0, 80].map(x => `<g transform="translate(${x} -176) scale(.55)">${ITEMS.loaf}</g>`).join('')}
    ${[-70, 30].map(x => `<g transform="translate(${x} -110) scale(.55)">${ITEMS.croissant}</g>`).join('')}<g transform="translate(90 -112) scale(.4)">${ITEMS.rolls}</g>
    ${[-60, 40].map(x => `<g transform="translate(${x} -44) scale(.45)">${ITEMS.rolls}</g>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-140 + i * 46.7} -270 h46.7 v26 q-23.3 14 -46.7 0 Z" fill="${i % 2 ? '#fff' : '#f07a1a'}" ${S3}/>`).join('')}
    <rect x="-70" y="-300" width="140" height="36" rx="8" fill="#f07a1a" ${S}/>${txt(0, -274, 22, '#fff', 'BAKERY')}</g>`;
  // The shop fridge (glass doors, shelves of milk, cheese and yoghurt), base at 0,0.
  const fridge = (open = false) => `<g>
    <rect x="-120" y="-300" width="240" height="300" rx="10" fill="#e7ebf2" ${S}/>
    <rect x="-108" y="-286" width="216" height="252" rx="4" fill="#dff3ff" ${S3}/>
    <path d="M-108 -204 H108 M-108 -120 H108" ${SW(5)}/>
    ${[-74, -26, 22, 70].map(x => `<g transform="translate(${x} -236) scale(.48)">${ITEMS.milk}</g>`).join('')}
    ${[-70, 0, 70].map(x => `<g transform="translate(${x} -150) scale(.5)">${ITEMS.cheese}</g>`).join('')}
    ${[-78, -30, 18, 66].map(x => `<g transform="translate(${x} -64) scale(.42)">${ITEMS.yoghurt}</g>`).join('')}
    ${open ? '' : `<path d="M0 -286 V-34" ${SW(4)}/><path d="M-12 -170 V-150 M12 -170 V-150" ${SW(6)}/><path d="M-90 -270 L-60 -240 M60 -270 L90 -240" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`}
    ${open ? [[-150, -240], [140, -200], [-140, -120], [150, -90]].map(([x, y]) => `<path d="M${x} ${y} l8 0 m-4 -4 l0 8 m-3 -3 l6 -2" stroke="#5cc3ff" stroke-width="4" stroke-linecap="round"/>`).join('') : ''}
    <rect x="-60" y="-330" width="120" height="34" rx="8" fill="#1e5bd6" ${S}/>${txt(0, -305, 22, '#fff', 'COLD')}</g>`;
  // A cardboard box (the decoy in Trolley Run), base at 0,0, about 140 wide.
  const box = `<g><path d="M-64 -96 H64 V0 H-64 Z" fill="#d9a55b" ${S}/><path d="M-64 -96 L-80 -122 H-10 L0 -96 M64 -96 L80 -122 H10 L0 -96" fill="#e8bd7a" ${S}/>
    <path d="M-30 -60 H30 M-30 -44 H30" stroke="#a5672e" stroke-width="5" stroke-linecap="round"/><path d="M-12 -24 l12 -12 12 12" fill="none" stroke="#a5672e" stroke-width="5" stroke-linecap="round"/></g>`;
  // The shop from the outside (the School Train picture for "supermarket"), base at 0,0.
  const shopFront = `<g>
    <rect x="-74" y="-96" width="148" height="96" fill="#fff" ${S}/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-80 + i * 26.7} -122 h26.7 v24 q-13.3 12 -26.7 0 Z" fill="${i % 2 ? '#fff' : '#2e9e4f'}" ${S3}/>`).join('')}
    <rect x="-60" y="-80" width="70" height="46" fill="#bfe6ff" ${S3}/>
    <circle cx="-40" cy="-46" r="7" fill="#f07a1a"/><circle cx="-24" cy="-48" r="7" fill="#ffd21f"/><circle cx="-8" cy="-46" r="7" fill="#e53935"/>
    <rect x="24" y="-62" width="34" height="62" fill="#2e9e4f" ${S3}/></g>`;
  // Shelves of tins and boxes for the background of the shop, base at 0,0, w wide.
  const aisle = (w = 400, seed = 0) => {
    const cols = ['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f', '#f07a1a', '#8e5bd6', '#00a6a6'];
    const rows = [-60, -150, -240];
    return `<g><rect x="0" y="-290" width="${w}" height="290" fill="#d3d9e3" ${S}/>
      ${rows.map((y, r) => `${Array.from({ length: Math.floor((w - 20) / 34) }, (_, i) => { const c = cols[(i * 3 + r * 2 + seed) % cols.length], tall = (i + r + seed) % 3 === 0;
        return tall ? `<rect x="${14 + i * 34}" y="${y - 70}" width="28" height="70" rx="3" fill="${c}" ${S3}/><rect x="${18 + i * 34}" y="${y - 56}" width="20" height="16" fill="#fff" opacity=".8"/>`
          : `<rect x="${14 + i * 34}" y="${y - 42}" width="28" height="42" rx="6" fill="${c}" ${S3}/><rect x="${14 + i * 34}" y="${y - 30}" width="28" height="14" fill="#fff" opacity=".7"/>`; }).join('')}
        <rect x="0" y="${y}" width="${w}" height="12" fill="#9aa3b5" ${S3}/>`).join('')}</g>`;
  };
  // Mum's shopping list: a sheet of paper with a picture for each thing, centred, about 160 x 200.
  const list = (ids = ['apple', 'milk', 'loaf'], ticks = 0) => `<g>
    <path d="M-70 -100 H70 V100 H-70 Z" fill="#fff" ${S}/><path d="M-70 -100 H70" stroke="#e53935" stroke-width="6"/>
    ${ids.map((id, i) => `<g transform="translate(-30 ${-60 + i * 56}) scale(.4)">${ITEMS[id]}</g><path d="M2 ${-60 + i * 56} H54" stroke="#c3cad6" stroke-width="4" stroke-linecap="round"/>
      ${i < ticks ? `<path d="M10 ${-62 + i * 56} l10 12 l24 -26" fill="none" stroke="#2e9e4f" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` : ''}`).join('')}</g>`;
  // At home: the fruit bowl, the vegetable rack, the fridge and the bread bin (Put It Away), each centred in a 160 box.
  const HOME = {
    bowl: `<g><g transform="translate(-30 -18) scale(.46)">${ITEMS.apple}</g><g transform="translate(26 -20) scale(.46)">${ITEMS.orange}</g><g transform="translate(0 -38) scale(.5)">${ITEMS.banana}</g>
      <path d="M-70 -8 H70 Q66 50 0 54 Q-66 50 -70 -8 Z" fill="#5cc3ff" ${S}/><path d="M-50 14 Q0 30 50 14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M-24 54 L-30 66 H30 L24 54" fill="#5cc3ff" ${S}/></g>`,
    rack: `<g><path d="M-60 70 V-70 M60 70 V-70" ${SW(9)}/>
      ${[-40, 30].map((y, i) => `<path d="M-64 ${y} H64 L56 ${y + 30} H-56 Z" fill="#c98b4e" ${S}/>${[-40, -20, 0, 20, 40].map(x => `<path d="M${x} ${y} V${y + 30}" stroke="#8b5a2b" stroke-width="3"/>`).join('')}
        <g transform="translate(-30 ${y - 4}) scale(.4)">${ITEMS[i ? 'potato' : 'carrot']}</g><g transform="translate(18 ${y - 6}) scale(.4)">${ITEMS[i ? 'onion' : 'broccoli']}</g>`).join('')}</g>`,
    fridge: `<g><rect x="-52" y="-74" width="104" height="148" rx="12" fill="#fff" ${S}/><path d="M-52 -20 H52" ${SW(5)}/>
      <path d="M-38 -60 V-34 M-38 -6 V30" ${SW(7)}/><rect x="-12" y="-62" width="34" height="26" rx="3" fill="#fff6cc" ${S3}/><circle cx="22" cy="-62" r="5" fill="#e53935" ${S3}/>
      <circle cx="16" cy="10" r="6" fill="#2e9e4f" ${S3}/><circle cx="34" cy="40" r="6" fill="#1e5bd6" ${S3}/></g>`,
    breadbin: `<g><path d="M-66 50 V-10 Q-66 -50 -26 -50 H26 Q66 -50 66 -10 V50 Z" fill="#e53935" ${S}/><path d="M-66 50 H66" ${SW(6)}/>
      <path d="M-54 -6 Q-54 -38 -22 -38 H22 Q54 -38 54 -6" fill="none" stroke="#b71c1c" stroke-width="5"/>
      <rect x="-40" y="4" width="80" height="26" rx="6" fill="#fff" ${S3}/>${txt(0, 24, 18, '#e53935', 'BREAD')}<rect x="-14" y="-28" width="28" height="10" rx="5" fill="#ffd21f" ${S3}/></g>`
  };
  // A shopping bag with a picture on the front (Pack the Bags), base at 60, centred, about 130 wide.
  const BAGS = {
    fruit: { colour: '#e53935', pic: 'apple' },
    veg:   { colour: '#f07a1a', pic: 'carrot' },
    cold:  { colour: '#1e5bd6', pic: 'snow' },
    bread: { colour: '#c98b4e', pic: 'loaf' }
  };
  const snow = `<g>${[0, 60, 120].map(r => `<path d="M0 -34 V34 M-8 -26 L0 -18 L8 -26 M-8 26 L0 18 L8 26" transform="rotate(${r})" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>`;
  const bag = id => { const b = BAGS[id]; return `<g>
    <path d="M-30 -40 Q-30 -76 0 -76 Q30 -76 30 -40" fill="none" ${SW(12)}/><path d="M-30 -40 Q-30 -76 0 -76 Q30 -76 30 -40" fill="none" stroke="${b.colour}" stroke-width="6"/>
    <path d="M-62 -46 H62 L54 60 H-54 Z" fill="${b.colour}" ${S}/>${id === 'cold' ? '<path d="M-62 -30 H62" stroke="#fff" stroke-width="6" opacity=".6"/>' : ''}
    <circle cy="8" r="38" fill="${id === 'cold' ? '#5cc3ff' : '#fff'}" ${S3}/>
    <g transform="translate(0 8) scale(.5)">${b.pic === 'snow' ? snow : ITEMS[b.pic]}</g></g>`; };

  // Pip's mum, borrowed from the school pictures (she takes Pip to school too).
  const pipMum = () => window.SchoolArt.pipMum;

  // ---------- Stickers for the six places in the shop ----------
  const SPOTS = {
    trolley: { name: 'Trolley', art: () => `<g transform="translate(-4 40) scale(.5)">${trolley(['apple', 'milk', 'loaf', 'banana'])}</g>`, bg: '#e3f7e8' },
    fruit:   { name: 'Fruit and veg', art: () => `<g transform="translate(-14 4) scale(.6)">${ITEMS.apple}</g><g transform="translate(16 8) scale(.55)">${ITEMS.carrot}</g><g transform="translate(4 -18) scale(.5)">${ITEMS.banana}</g>`, bg: '#fff1d6' },
    bakery:  { name: 'Bakery', art: () => `<g transform="translate(0 6) scale(.62)">${ITEMS.loaf}</g><g transform="translate(14 -20) scale(.4)">${ITEMS.croissant}</g>`, bg: '#ffe9d6' },
    fridge:  { name: 'Fridge', art: () => `<g transform="translate(-18 6) scale(.55)">${ITEMS.milk}</g><g transform="translate(20 14) scale(.45)">${ITEMS.yoghurt}</g><g transform="translate(14 -18) scale(.38)">${ITEMS.cheese}</g>`, bg: '#dff3ff' },
    scales:  { name: 'Scales', art: () => `<g transform="translate(0 42) scale(.5)">${scales}</g>`, bg: '#fff6cc' },
    till:    { name: 'Ruby', art: () => `<g transform="translate(0 110) scale(.5)">${worker(true)}</g>`, bg: '#efe6ff' }
  };
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? SPOTS[id].bg : '#d3d9e3'}"/>
      <defs><clipPath id="sm-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#sm-${id})" opacity="${earned ? 1 : 0.3}">${earned ? SPOTS[id].art() : `<g style="filter:grayscale(1) brightness(.7)">${SPOTS[id].art()}</g>`}</g>
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
  const foodImage = id => image(ROUND[id], '-58 -58 116 116');
  const trolleyImage = load => image(trolley(load), '-100 -170 200 180');
  const boxImage = () => image(box, '-90 -130 180 136');

  window.SupermarketArt = { ITEMS, ROUND, ROUND_IDS, NAMES, HOME, SPOTS, BAGS, bag, trolley, basket, till, worker, scales, fruitStand, bakery, fridge, box, shopFront,
    aisle, list, pipMum, sticker, svg, itemSvg, image, foodImage, trolleyImage, boxImage, eye, eyes, txt };
})();
