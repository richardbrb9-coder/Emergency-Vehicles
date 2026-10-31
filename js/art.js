// Vector artwork. Everything is drawn in one style: thick navy outline, flat bright colours,
// rounded corners. Moving parts are separate groups with ids or classes so code can animate them.
(function () {
  const OL = '#2a2f45';            // outline colour used everywhere
  const S = `stroke="${OL}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
  const S3 = `stroke="${OL}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

  const defs = () => `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7cc8f7"/><stop offset="1" stop-color="#e3f5ff"/>
      </linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3aa6e6"/><stop offset="1" stop-color="#1c6fb5"/>
      </linearGradient>
      <pattern id="bricks" width="60" height="30" patternUnits="userSpaceOnUse">
        <rect width="60" height="30" fill="#c95a43"/>
        <path d="M0 15 H60 M0 30 H60 M30 0 V15 M0 15 V30 M60 15 V30" stroke="#a9442f" stroke-width="3"/>
      </pattern>
      <pattern id="planks" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#7e94ad"/>
        <path d="M0 0 V40 M20 0 V40" stroke="#677c95" stroke-width="3"/>
      </pattern>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/>
        <feGaussianBlur in="d" stdDeviation="6" result="b"/>
        <feFlood flood-color="#ffd400"/>
        <feComposite in2="b" operator="in" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

  const cloud = (x, y, s, cls = 'cloud') => `
    <g class="${cls}" transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 40 Q-5 10 30 12 Q40 -14 75 0 Q100 -12 115 14 Q150 12 145 40 Z" fill="#fff" ${S3} opacity=".95"/>
    </g>`;

  const sun = (x, y, id = 'sun') => `
    <g id="${id}" class="tappable" transform="translate(${x} ${y})">
      <g class="sun-rays">${Array.from({ length: 10 }, (_, i) =>
        `<rect x="-6" y="-92" width="12" height="26" rx="6" fill="#ffc928" transform="rotate(${i * 36})"/>`).join('')}</g>
      <circle r="56" fill="#ffd84a" ${S}/>
      <circle cx="-18" cy="-8" r="6" fill="${OL}"/><circle cx="18" cy="-8" r="6" fill="${OL}"/>
      <path class="sun-mouth" d="M-20 14 Q0 32 20 14" fill="none" ${S}/>
      <circle cx="-32" cy="12" r="8" fill="#ff9f7a" opacity=".6"/><circle cx="32" cy="12" r="8" fill="#ff9f7a" opacity=".6"/>
    </g>`;

  const bush = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-50 0 Q-60 -40 -20 -38 Q-10 -70 25 -50 Q60 -55 55 0 Z" fill="#4fb35a" ${S}/>
    </g>`;

  const tree = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-14" y="-140" width="28" height="140" fill="#8a5a3c" ${S}/>
      <path d="M-90 -130 Q-110 -210 -40 -220 Q-20 -290 50 -250 Q120 -250 100 -170 Q120 -110 60 -110 Q0 -90 -40 -110 Q-100 -95 -90 -130 Z" fill="#46a852" ${S}/>
      <circle cx="-30" cy="-180" r="7" fill="#e94b3c"/><circle cx="40" cy="-200" r="7" fill="#e94b3c"/><circle cx="10" cy="-140" r="7" fill="#e94b3c"/>
    </g>`;

  // ---------- Pictograms for door badges (drawn in about an 80 x 56 box, centred) ----------
  const W = (cx, cy, r = 7) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${OL}"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#fff"/>`;
  const PICTO = {
    fire: `<rect x="-38" y="-8" width="54" height="22" rx="3" fill="${OL}"/><path d="M16 14 V-14 H28 Q36 -14 38 -4 V14 Z" fill="${OL}"/>
           <path d="M-36 -15 H14 M-30 -15 V-9 M-20 -15 V-9 M-10 -15 V-9 M0 -15 V-9 M10 -15 V-9" stroke="${OL}" stroke-width="4"/>
           <rect x="20" y="-10" width="11" height="9" rx="2" fill="#fff"/>${W(-24, 17)}${W(24, 17)}`,
    ambulance: `<path d="M-38 14 V-16 H18 Q30 -16 36 -2 L38 14 Z" fill="${OL}"/><rect x="20" y="-11" width="11" height="9" rx="2" fill="#fff"/>
           <path d="M-16 -9 V7 M-24 -1 H-8" stroke="#fff" stroke-width="6"/><rect x="-12" y="-22" width="12" height="6" rx="2" fill="${OL}"/>${W(-24, 17)}${W(22, 17)}`,
    police: `<path d="M-38 12 V0 Q-36 -6 -26 -6 L-14 -18 H14 L26 -6 Q38 -6 38 4 V12 Z" fill="${OL}"/>
           <path d="M-10 -14 H-1 V-6 H-18 Z M3 -14 H12 L20 -6 H3 Z" fill="#fff"/><rect x="-8" y="-26" width="16" height="7" rx="3" fill="${OL}"/>${W(-22, 14)}${W(22, 14)}`,
    tow: `<rect x="-38" y="-2" width="44" height="16" rx="3" fill="${OL}"/><path d="M6 14 V-16 H24 Q34 -16 38 -2 V14 Z" fill="${OL}"/>
           <path d="M-30 -2 L-8 -26 M-8 -26 V-8" stroke="${OL}" stroke-width="5" fill="none"/><path d="M-12 -8 q4 8 8 0" stroke="${OL}" stroke-width="3" fill="none"/>
           <rect x="13" y="-11" width="10" height="9" rx="2" fill="#fff"/>${W(-24, 17)}${W(24, 17)}`,
    medical: `<path d="M-38 12 V2 Q-36 -4 -26 -4 L-16 -14 H14 L24 -4 Q38 -4 38 6 V12 Z" fill="${OL}"/>
           <path d="M-26 -16 V-34" stroke="${OL}" stroke-width="3"/><path d="M-26 -34 h18 v12 h-18 Z" fill="#fff" stroke="${OL}" stroke-width="2"/>
           <path d="M-26 -34 h6 v6 h-6 Z M-14 -34 h6 v6 h-6 Z M-20 -28 h6 v6 h-6 Z" fill="${OL}"/>${W(-22, 14)}${W(22, 14)}`,
    airamb: `<path d="M-14 -14 H10 Q30 -14 34 4 Q30 14 10 14 H-10 L-38 -2 V-8 H-30 L-22 -4 Z" fill="${OL}"/>
           <path d="M-36 -22 H32 M0 -22 V-14" stroke="${OL}" stroke-width="4"/><path d="M4 -6 V8 M-3 1 H11" stroke="#fff" stroke-width="4"/>
           <path d="M-12 18 H22" stroke="${OL}" stroke-width="4"/>`,
    helitack: `<path d="M-14 -18 H10 Q30 -18 34 0 Q30 10 10 10 H-10 L-38 -6 V-12 H-30 L-22 -8 Z" fill="${OL}"/>
           <path d="M-36 -26 H32 M0 -26 V-18 M6 10 L6 18" stroke="${OL}" stroke-width="4"/>
           <path d="M-2 18 H14 L10 30 H2 Z" fill="${OL}"/>`,
    lifeboat: `<path d="M-40 2 H40 L30 20 H-30 Z" fill="${OL}"/><rect x="-14" y="-18" width="30" height="20" rx="3" fill="${OL}"/>
           <rect x="-8" y="-13" width="8" height="7" fill="#fff"/><rect x="4" y="-13" width="8" height="7" fill="#fff"/>
           <path d="M-44 26 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0" stroke="${OL}" stroke-width="3" fill="none"/>`,
    hover: `<path d="M-38 6 H38 Q40 18 30 20 H-30 Q-40 18 -38 6 Z" fill="${OL}"/><rect x="-18" y="-10" width="30" height="16" rx="4" fill="${OL}"/>
           <circle cx="26" cy="-10" r="12" fill="#fff" stroke="${OL}" stroke-width="4"/><path d="M26 -20 V0 M16 -10 H36" stroke="${OL}" stroke-width="3"/>`
  };
  const picto = (kind, cx, cy, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${s})">${PICTO[kind] || ''}</g>`;

  // Front view of a fire engine, seen inside its open garage door.
  const fireEngineFront = (cx, by, w) => {
    const s = w / 140;
    return `<g transform="translate(${cx} ${by}) scale(${s})">
      <rect x="-62" y="-150" width="124" height="128" rx="12" fill="#e53935" ${S}/>
      <rect x="-50" y="-136" width="100" height="44" rx="6" fill="#bfe6ff" ${S3}/>
      <rect x="-36" y="-170" width="72" height="18" rx="8" fill="#9fb1c7" ${S3}/>
      <ellipse class="beacon" cx="-24" cy="-172" rx="12" ry="10" fill="#3b82f6" ${S3}/>
      <ellipse class="beacon b2" cx="24" cy="-172" rx="12" ry="10" fill="#3b82f6" ${S3}/>
      <rect x="-40" y="-78" width="80" height="30" rx="4" fill="#d8dee8" ${S3}/>
      <path d="M-30 -70 H30 M-30 -62 H30 M-30 -54 H30" stroke="${OL}" stroke-width="2"/>
      <circle cx="-48" cy="-62" r="9" fill="#fff3a6" ${S3}/><circle cx="48" cy="-62" r="9" fill="#fff3a6" ${S3}/>
      <rect x="-60" y="-26" width="26" height="26" rx="6" fill="${OL}"/><rect x="34" y="-26" width="26" height="26" rx="6" fill="${OL}"/>
      <text x="0" y="-100" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="16" fill="${OL}">ERIF</text>
    </g>`;
  };

  // ---------- Garage door ----------
  function door(v, x, y, w, h) {
    const id = v.id;
    const slats = Array.from({ length: Math.floor(h / 18) }, (_, i) =>
      `<path d="M${x + 6} ${y + 14 + i * 18} H${x + w - 6}" stroke="rgba(0,0,0,.18)" stroke-width="3"/>`).join('');
    const badgeW = Math.min(w - 24, 104), badgeH = badgeW * 0.62;
    const by = y + h * 0.36;
    const inside = v.built
      ? (id === 'fire'
        ? `<g class="door-inside">${fireEngineFront(x + w / 2, y + h - 4, w * 0.92)}</g>`
        : `<g class="door-inside"><circle class="beacon" cx="${x + 18}" cy="${y + 16}" r="9" fill="#3b82f6"/><circle class="beacon b2" cx="${x + w - 18}" cy="${y + 16}" r="9" fill="#3b82f6"/>
             <rect x="${x + 10}" y="${y + h * 0.3}" width="${w - 20}" height="${(w - 20) * 0.62}" rx="12" fill="#fff" ${S3}/>${picto(id, x + w / 2, y + h * 0.3 + (w - 20) * 0.31, (w - 20) / 100)}</g>`)
      : `<g class="door-inside">
           <path d="M${x + w / 2} ${y + 6} V${y + 26}" stroke="#596178" stroke-width="3"/>
           <path d="M${x + w / 2 - 16} ${y + 38} Q${x + w / 2} ${y + 18} ${x + w / 2 + 16} ${y + 38} Z" fill="#ffd84a"/>
           <path d="M${x + w / 2 - 34} ${y + h - 2} L${x + w / 2 - 22} ${y + h - 44} H${x + w / 2 - 14} L${x + w / 2 - 2} ${y + h - 2} Z" fill="#ff8a1f" ${S3}/>
           <path d="M${x + w / 2 - 28} ${y + h - 22} H${x + w / 2 - 8}" stroke="#fff" stroke-width="5"/>
         </g>`;
    return `
    <g class="door tappable" data-id="${id}" data-h="${h}">
      <rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 8}" rx="6" fill="#596178" ${S}/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#262b38"/>
      ${inside}
      <clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
      <g clip-path="url(#clip-${id})">
        <g class="door-panel" id="panel-${id}">
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${v.colour}"/>
          ${slats}
          <rect x="${x + (w - badgeW) / 2}" y="${by - badgeH / 2}" width="${badgeW}" height="${badgeH}" rx="12" fill="#fff" ${S3}/>
          ${picto(v.id, x + w / 2, by + 2, badgeW / 100)}
          <circle cx="${x + w / 2}" cy="${y + h * 0.74}" r="${Math.min(26, w * 0.2)}" fill="#fff" ${S3}/>
          <text x="${x + w / 2}" y="${y + h * 0.74 + Math.min(26, w * 0.2) * 0.38}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${Math.min(34, w * 0.26)}" fill="${OL}">${v.door}</text>
          <rect x="${x + w / 2 - 14}" y="${y + h - 14}" width="28" height="7" rx="3" fill="rgba(0,0,0,.3)"/>
        </g>
      </g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${S}/>
    </g>`;
  }

  // ---------- Pip ----------
  // One Pip for every world. The outfit changes per world; moods and actions are CSS classes on the parent
  // (mood-surprised, mood-cheer, mood-thinking, act-jump, act-dance, act-wave), so any Pip on screen can use them.
  const collar = `<path d="M70 124 Q100 140 130 124" fill="none" stroke="#e53935" stroke-width="9" stroke-linecap="round"/>
    <circle cx="100" cy="138" r="7" fill="#ffd21f" ${S3}/>`;
  const PIP_OUTFITS = {
    map: { body: '', head: '' },
    rescue: {
      body: `<path d="M56 138 Q100 116 144 138 L148 174 Q100 196 52 174 Z" fill="#ffd21f" ${S}/>
        <path d="M55 156 Q100 140 146 156" stroke="#d6dee8" stroke-width="7" fill="none"/>
        <path d="M53 170 Q100 156 148 170" stroke="#d6dee8" stroke-width="7" fill="none"/>`,
      head: `<path d="M76 34 Q100 18 124 34 L120 44 Q100 36 80 44 Z" fill="#e53935" ${S3}/>`, noCollar: true
    },
    zoo: {
      body: '',
      head: `<path d="M64 38 Q100 0 136 38 Z" fill="#d6b46a" ${S3}/><path d="M66 32 Q100 22 134 32" stroke="#8b5a2b" stroke-width="6" fill="none"/>
        <ellipse cx="100" cy="38" rx="58" ry="9" fill="#c39a4a" ${S3}/>`
    },
    monsters: {
      body: '',
      head: `<path d="M68 40 Q58 14 74 2 Q76 24 86 36 Z" fill="#8e5bd6" ${S3}/><path d="M132 40 Q142 14 126 2 Q124 24 114 36 Z" fill="#8e5bd6" ${S3}/>
        <circle cx="84" cy="44" r="5" fill="#b9f26b" ${S3}/><circle cx="116" cy="44" r="5" fill="#b9f26b" ${S3}/>`
    },
    school: {
      body: `<path d="M138 132 Q160 132 160 156 V176 Q150 184 140 178 Z" fill="#e53935" ${S3}/>`,
      head: `<path d="M66 40 Q100 4 134 40 Z" fill="#1e5bd6" ${S3}/><path d="M128 38 Q156 34 162 46 Q142 50 124 44 Z" fill="#1e5bd6" ${S3}/>
        <circle cx="100" cy="17" r="5" fill="#ffd21f" ${S3}/>`
    },
    supermarket: {
      body: `<path d="M70 130 H130 L136 184 Q100 196 64 184 Z" fill="#2e9e4f" ${S}/><rect x="88" y="154" width="24" height="16" rx="3" fill="#bfe8c9" ${S3}/>`,
      head: ''
    },
    shop: {
      body: '',
      head: `<path d="M84 36 L100 -8 L116 36 Z" fill="#ff8fb1" ${S3}/><path d="M90 20 L110 20 M94 8 L106 8" stroke="#fff" stroke-width="5"/>
        <circle cx="100" cy="-10" r="7" fill="#ffd21f" ${S3}/>`
    },
    puppies: {
      body: `<path d="M70 130 H130 L136 184 Q100 196 64 184 Z" fill="#ffd21f" ${S}/><path d="M100 168 C92 160 86 152 94 148 C98 146 100 150 100 152 C100 150 102 146 106 148 C114 152 108 160 100 168 Z" fill="#e53935"/>`,
      head: ''
    }
  };
  const pip = (outfit = 'rescue') => {
    const o = PIP_OUTFITS[outfit] || PIP_OUTFITS.rescue;
    return `
  <svg viewBox="0 0 200 200" class="pip-svg" aria-hidden="true">
    <path class="pip-tail" d="M146 160 Q190 150 178 108" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/>
    <path class="pip-tail" d="M146 160 Q190 150 178 108" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="100" cy="152" rx="54" ry="42" fill="#fff" ${S}/>
    ${o.body}
    ${o.noCollar ? '' : collar}
    <ellipse cx="78" cy="190" rx="18" ry="9" fill="#fff" ${S3}/><ellipse cx="122" cy="190" rx="18" ry="9" fill="#fff" ${S3}/>
    <g class="pip-paw"><ellipse cx="162" cy="118" rx="13" ry="18" fill="#fff" ${S3}/></g>
    <g class="pip-head">
      <circle cx="100" cy="80" r="50" fill="#fff" ${S}/>
      <path class="pip-ear-l" d="M60 52 Q28 62 38 118 Q58 114 68 78 Z" fill="${OL}"/>
      <path class="pip-ear-r" d="M140 52 Q172 62 162 118 Q142 114 132 78 Z" fill="${OL}"/>
      <circle cx="122" cy="46" r="8" fill="${OL}"/><circle cx="74" cy="110" r="5" fill="${OL}"/><circle cx="132" cy="104" r="4" fill="${OL}"/>
      <g class="pip-eyes">
        <circle cx="82" cy="76" r="9" fill="${OL}"/><circle cx="118" cy="76" r="9" fill="${OL}"/>
        <circle cx="85" cy="73" r="3.2" fill="#fff"/><circle cx="121" cy="73" r="3.2" fill="#fff"/>
      </g>
      <circle cx="66" cy="96" r="8" fill="#ffb3b3" opacity=".7"/><circle cx="134" cy="96" r="8" fill="#ffb3b3" opacity=".7"/>
      <ellipse cx="100" cy="100" rx="22" ry="16" fill="#fff" ${S3}/>
      <ellipse cx="100" cy="92" rx="10" ry="7" fill="${OL}"/>
      <path class="pip-mouth" d="M88 104 Q100 116 112 104" fill="none" ${S3}/>
      <path class="pip-tongue" d="M95 109 Q100 122 105 109 Z" fill="#ff7a8a" ${S3}/>
      <ellipse class="pip-o" cx="100" cy="110" rx="6" ry="8" fill="${OL}"/>
      <path class="pip-grin" d="M86 102 Q100 128 114 102 Z" fill="#ff7a8a" ${S3}/>
      <path class="pip-flat" d="M90 108 Q100 104 110 108" fill="none" ${S3}/>
      ${o.head}
    </g>
  </svg>`;
  };

  // ---------- Rescue Station hub ----------
  function hub(vehicles) {
    const byId = Object.fromEntries(vehicles.map(v => [v.id, v]));
    const ground = vehicles.filter(v => v.area === 'ground');
    let doors = '';
    ground.forEach((v, i) => { doors += door(v, 244 + i * 166, 548, 140, 222); });
    doors += door(byId.airamb, 512, 226, 124, 104);
    doors += door(byId.helitack, 664, 226, 124, 104);
    doors += door(byId.lifeboat, 1132, 600, 110, 190);
    doors += door(byId.hover, 1262, 600, 110, 190);

    const windows = [0, 1, 2, 3, 4].map(i => {
      const x = 254 + i * 166;
      const cat = i === 2 ? `
        <g id="window-cat" class="tappable">
          <rect x="${x}" y="428" width="120" height="58" fill="transparent"/>
          <g transform="translate(${x + 60} 486)">
            <path d="M-20 0 Q-22 -30 0 -32 Q22 -30 20 0 Z" fill="#f29a3a" ${S3}/>
            <path d="M-16 -26 L-14 -42 L-4 -32 Z M16 -26 L14 -42 L4 -32 Z" fill="#f29a3a" ${S3}/>
            <circle cx="-7" cy="-20" r="3" fill="${OL}"/><circle cx="7" cy="-20" r="3" fill="${OL}"/>
            <path d="M-3 -13 Q0 -10 3 -13" fill="none" stroke="${OL}" stroke-width="2"/>
          </g>
        </g>` : '';
      return `<rect x="${x}" y="428" width="120" height="58" rx="6" fill="#bfe6ff" ${S}/>
              <path d="M${x + 60} 428 V486" stroke="${OL}" stroke-width="4"/>${cat}`;
    }).join('');

    return `
    <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="Rescue Station">
      ${defs()}
      <rect width="1600" height="900" fill="url(#sky)"/>
      ${sun(1190, 240)}
      <g class="clouds">${cloud(140, 110, 1.1)}${cloud(980, 70, 0.8)}${cloud(1450, 200, 0.9)}</g>
      <path d="M0 640 Q200 560 420 610 T860 600 T1300 590 T1600 600 V900 H0 Z" fill="#9fd88d"/>
      ${tree(170, 790, 0.9)}${tree(1480, 790, 1)}
      <!-- road, pavement and water -->
      <rect x="0" y="770" width="1600" height="30" fill="#d9d4c7"/>
      <rect x="0" y="800" width="1100" height="100" fill="#5a606b"/>
      <path d="M0 852 H1100" stroke="#fff" stroke-width="8" stroke-dasharray="50 40"/>
      <path d="M1100 790 H1600 V900 H1100 Z" fill="url(#water)"/>
      <path class="waves" d="M1100 820 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#bfe6ff" stroke-width="5" opacity=".8"/>
      <!-- station building -->
      <rect x="220" y="330" width="860" height="440" fill="url(#bricks)" ${S}/>
      <rect x="204" y="312" width="892" height="26" rx="6" fill="#e9e3d6" ${S}/>
      <!-- flag pole -->
      <g id="flag" class="tappable">
        <path d="M268 312 V176" stroke="${OL}" stroke-width="7"/>
        <circle cx="268" cy="172" r="8" fill="#ffd84a" ${S3}/>
        <path class="flag-cloth" d="M272 184 Q300 172 330 186 T388 188 V230 Q360 216 330 230 T272 226 Z" fill="#e53935" ${S3}/>
        <circle cx="330" cy="207" r="11" fill="#fff" ${S3}/>
        <rect x="244" y="170" width="160" height="150" fill="transparent"/>
      </g>
      <!-- roof hangar for the helicopters -->
      <rect x="490" y="196" width="320" height="120" rx="8" fill="#9fb1c7" ${S}/>
      <path d="M480 202 Q650 150 820 202 Z" fill="#7f93ad" ${S}/>
      <g transform="translate(860 300)"><ellipse rx="64" ry="12" fill="#5a606b" ${S3}/><text y="7" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#ffd84a">H</text></g>
      <!-- sign -->
      <rect x="440" y="350" width="420" height="58" rx="12" fill="#fff" ${S}/>
      <text x="650" y="392" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="36" fill="#e53935" letter-spacing="2">RESCUE STATION</text>
      ${windows}
      <!-- boathouse -->
      <rect x="1112" y="480" width="280" height="312" fill="url(#planks)" ${S}/>
      <path d="M1096 488 L1252 396 L1408 488 Z" fill="#e53935" ${S}/>
      <g transform="translate(1252 450)"><circle r="22" fill="#fff" ${S3}/><circle r="22" fill="none" stroke="#e53935" stroke-width="10" stroke-dasharray="17.3 17.3"/><circle r="11" fill="#7e94ad" ${S3}/></g>
      ${doors}
      ${bush(1060, 790, 0.8)}
      <g transform="translate(205 800)"><path d="M-16 0 L-8 -40 H8 L16 0 Z" fill="#ff8a1f" ${S3}/><path d="M-12 -18 H12" stroke="#fff" stroke-width="6"/></g>
    </svg>`;
  }

  // ---------- Fire engine (side view, facing right; ground at y = 0) ----------
  function fireEngine() {
    const ladderRungs = (x1, x2, y1, y2) => {
      let r = ''; for (let x = x1 + 18; x < x2 - 6; x += 30) r += `<path d="M${x} ${y1} V${y2}" stroke="#7d8698" stroke-width="5"/>`;
      return r;
    };
    const wheel = (cx, cls) => `
      <g class="fe-wheel ${cls}" data-cx="${cx}">
        <circle cx="${cx}" cy="-46" r="46" fill="#30364a" ${S}/>
        <circle cx="${cx}" cy="-46" r="24" fill="#c7cfdb" ${S3}/>
        <g class="spokes"><path d="M${cx - 18} -46 H${cx + 18} M${cx} -64 V-28" stroke="${OL}" stroke-width="5"/></g>
        <circle cx="${cx}" cy="-46" r="6" fill="${OL}"/>
      </g>`;
    const locker = (n, x, w, contents) => `
      <g class="fe-locker tappable" data-n="${n}">
        <rect x="${x}" y="-232" width="${w}" height="92" rx="6" fill="#3a4157" ${S3}/>
        ${contents}
        <clipPath id="lock-${n}"><rect x="${x}" y="-232" width="${w}" height="92"/></clipPath>
        <g clip-path="url(#lock-${n})"><g class="locker-shutter" id="shutter-${n}">
          <rect x="${x}" y="-232" width="${w}" height="92" fill="#d9dfe8"/>
          ${Array.from({ length: 6 }, (_, i) => `<path d="M${x} ${-218 + i * 14} H${x + w}" stroke="#aab4c3" stroke-width="3"/>`).join('')}
          <rect x="${x + w / 2 - 12}" y="-152" width="24" height="7" rx="3" fill="#6b7489"/>
        </g></g>
        <rect x="${x}" y="-232" width="${w}" height="92" rx="6" fill="none" ${S3}/>
      </g>`;
    return `
    <g class="fire-engine">
      <ellipse cx="320" cy="2" rx="320" ry="14" fill="rgba(0,0,0,.18)"/>
      <!-- ladder sits on the roof and pivots at its back end -->
      <g id="fe-ladder" class="tappable">
        <g id="fe-ladder-ext">
          <rect x="70" y="-298" width="420" height="22" rx="4" fill="#c7cfdb" ${S3}/>
          ${ladderRungs(70, 490, -294, -280)}
        </g>
        <rect x="56" y="-290" width="430" height="24" rx="4" fill="#e3e8ef" ${S3}/>
        ${ladderRungs(56, 486, -286, -270)}
        <rect x="36" y="-276" width="70" height="24" rx="6" fill="#596178" ${S3}/>
        <rect x="40" y="-320" width="460" height="90" fill="transparent"/>
      </g>
      <!-- body -->
      <rect x="18" y="-252" width="420" height="190" rx="14" fill="#e53935" ${S}/>
      <path d="M430 -62 V-262 H556 Q598 -260 610 -212 L632 -122 V-62 Z" fill="#e53935" ${S}/>
      <path d="M454 -244 H552 Q582 -242 590 -204 L598 -166 H454 Z" fill="#bfe6ff" ${S3}/>
      <path d="M520 -236 L496 -176" stroke="#fff" stroke-width="7" opacity=".7"/>
      <g id="fe-cab" class="tappable">
        <rect x="454" y="-160" width="120" height="96" fill="transparent"/>
        <path d="M466 -134 H520" stroke="${OL}" stroke-width="4"/>
      </g>
      <!-- reflective stripes -->
      <rect x="18" y="-128" width="614" height="26" fill="#fff"/>
      ${Array.from({ length: 21 }, (_, i) => `<rect x="${18 + i * 29.2}" y="-128" width="14.6" height="26" fill="#ffd21f"/>`).join('')}
      <rect x="18" y="-128" width="614" height="26" fill="none" ${S3}/>
      ${locker(1, 36, 120, `<g transform="translate(96 -186)"><circle r="34" fill="#c0392b" ${S3}/><circle r="20" fill="#e53935" ${S3}/><circle r="7" fill="${OL}"/></g>`)}
      ${locker(2, 168, 120, `<g transform="translate(228 -186)"><path d="M-20 34 L14 -24" stroke="#8a5a3c" stroke-width="10"/><path d="M6 -40 Q34 -34 28 -10 L12 -18 Z" fill="#c7cfdb" ${S3}/></g>`)}
      ${locker(3, 300, 120, `<g transform="translate(360 -186)"><path d="M-36 6 Q-36 -26 -8 -26 Q20 -26 20 6 Z" fill="#ffd21f" ${S3}/><path d="M-44 8 H28" ${S3}/><rect x="2" y="12" width="34" height="16" rx="4" fill="#596178" ${S3}/></g>`)}
      <!-- light bar and siren -->
      <g id="fe-lights" class="tappable">
        <rect x="462" y="-282" width="104" height="20" rx="8" fill="#9fb1c7" ${S3}/>
        <ellipse class="beacon" cx="482" cy="-286" rx="16" ry="12" fill="#3b82f6" ${S3}/>
        <ellipse class="beacon b2" cx="546" cy="-286" rx="16" ry="12" fill="#3b82f6" ${S3}/>
        <ellipse class="beacon b2" cx="30" cy="-258" rx="12" ry="9" fill="#3b82f6" ${S3}/>
        <rect x="450" y="-310" width="130" height="60" fill="transparent"/>
      </g>
      <g id="fe-siren" class="tappable">
        <rect x="600" y="-100" width="44" height="38" rx="8" fill="#d8dee8" ${S3}/>
        <path d="M608 -90 H636 M608 -81 H636 M608 -72 H636" stroke="${OL}" stroke-width="3"/>
        <circle cx="624" cy="-114" r="10" fill="#fff3a6" ${S3}/>
        <rect x="590" y="-130" width="64" height="80" fill="transparent"/>
      </g>
      <rect x="14" y="-74" width="30" height="14" rx="4" fill="#596178" ${S3}/>
      <!-- wheel arches and wheels -->
      <path d="M70 -62 A56 56 0 0 1 182 -62 Z M260 -62 A56 56 0 0 1 372 -62 Z M474 -62 A56 56 0 0 1 586 -62 Z" fill="#30364a"/>
      <g id="fe-wheels" class="tappable">${wheel(126, 'w1')}${wheel(316, 'w2')}${wheel(530, 'w3')}</g>
    </g>`;
  }

  // ---------- Firefighter Sam ----------
  const sam = () => `
    <g class="sam">
      <ellipse cx="0" cy="2" rx="40" ry="8" fill="rgba(0,0,0,.18)"/>
      <rect x="-24" y="-16" width="20" height="16" rx="4" fill="${OL}"/><rect x="4" y="-16" width="20" height="16" rx="4" fill="${OL}"/>
      <rect x="-22" y="-72" width="44" height="58" rx="8" fill="#29324a" ${S3}/>
      <rect x="-22" y="-40" width="44" height="8" fill="#ffd21f"/>
      <path d="M0 -70 V-16" stroke="${OL}" stroke-width="3"/>
      <rect x="-28" y="-128" width="56" height="62" rx="14" fill="#29324a" ${S3}/>
      <rect x="-28" y="-92" width="56" height="9" fill="#ffd21f"/><rect x="-28" y="-106" width="56" height="5" fill="#d6dee8"/>
      <g id="sam-wave-arm"><path d="M-24 -118 Q-52 -120 -60 -150" fill="none" stroke="#29324a" stroke-width="16" stroke-linecap="round"/>
        <circle cx="-61" cy="-156" r="9" fill="${OL}"/></g>
      <g id="sam-hose-arm"><path d="M22 -116 Q46 -104 50 -96" fill="none" stroke="#29324a" stroke-width="16" stroke-linecap="round"/>
        <rect x="44" y="-104" width="34" height="13" rx="4" fill="#9fb1c7" ${S3} transform="rotate(-24 44 -98)"/>
        <circle cx="50" cy="-96" r="9" fill="${OL}"/></g>
      <circle cx="0" cy="-148" r="22" fill="#a8704f" ${S3}/>
      <circle cx="-8" cy="-148" r="3" fill="${OL}"/><circle cx="8" cy="-148" r="3" fill="${OL}"/>
      <path d="M-8 -138 Q0 -132 8 -138" fill="none" stroke="${OL}" stroke-width="3"/>
      <path d="M-28 -152 Q-28 -184 0 -184 Q28 -184 28 -152 Z" fill="#ffd21f" ${S3}/>
      <path d="M-34 -152 H34" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
      <rect x="-4" y="-182" width="8" height="26" fill="#f2b705"/>
      <rect x="-66" y="-190" width="106" height="200" fill="transparent"/>
    </g>`;

  const hydrant = () => `
    <g class="hydrant">
      <ellipse cx="0" cy="2" rx="30" ry="6" fill="rgba(0,0,0,.18)"/>
      <rect x="-24" y="-12" width="48" height="12" rx="3" fill="#c0392b" ${S3}/>
      <rect x="-16" y="-62" width="32" height="52" rx="6" fill="#e53935" ${S3}/>
      <path d="M-18 -62 Q0 -86 18 -62 Z" fill="#e53935" ${S3}/>
      <rect x="-5" y="-84" width="10" height="8" rx="2" fill="#c0392b" ${S3}/>
      <circle cx="-22" cy="-40" r="8" fill="#c0392b" ${S3}/><circle cx="22" cy="-40" r="8" fill="#c0392b" ${S3}/>
      <rect x="-40" y="-100" width="80" height="110" fill="transparent"/>
    </g>`;

  const kitten = () => `
    <g class="kitten-body">
      <path d="M14 -8 Q36 -12 34 -34" fill="none" stroke="${OL}" stroke-width="10" stroke-linecap="round"/>
      <path d="M14 -8 Q36 -12 34 -34" fill="none" stroke="#f29a3a" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="0" cy="-12" rx="22" ry="14" fill="#f29a3a" ${S3}/>
      <circle cx="-16" cy="-30" r="16" fill="#f29a3a" ${S3}/>
      <path d="M-28 -40 L-28 -56 L-18 -44 Z M-4 -40 L-4 -56 L-14 -44 Z" fill="#f29a3a" ${S3}/>
      <circle cx="-21" cy="-32" r="2.6" fill="${OL}"/><circle cx="-11" cy="-32" r="2.6" fill="${OL}"/>
      <path d="M-19 -24 Q-16 -21 -13 -24" fill="none" stroke="${OL}" stroke-width="2"/>
    </g>`;

  const flame = (cx, cy, s, id) => `
    <g class="flame-group" id="${id}" transform="translate(${cx} ${cy})" data-hits="0">
      <g class="flame-scale">
        <g class="flame">
          <path d="M0 0 C-36 -8 -34 -54 -6 -96 C0 -64 22 -70 18 -42 C34 -56 36 -18 0 0 Z" fill="#ff8a1f" ${S3} transform="scale(${s})"/>
          <path d="M0 -6 C-16 -10 -16 -34 -2 -56 C2 -38 14 -40 10 -24 C18 -30 16 -12 0 -6 Z" fill="#ffd84a" transform="scale(${s})"/>
        </g>
      </g>
      <rect x="${-50 * s}" y="${-110 * s}" width="${100 * s}" height="${120 * s}" fill="transparent"/>
    </g>`;

  // ---------- Fire engine scene: Maple Street ----------
  function fireScene() {
    return `
    <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="Maple Street">
      ${defs()}
      <rect width="1600" height="900" fill="url(#sky)"/>
      ${sun(1290, 250, 'sun')}
      <g class="clouds">${cloud(120, 90, 1)}${cloud(1080, 60, 0.8)}</g>
      <path d="M0 620 Q260 540 520 600 T1040 590 T1600 580 V900 H0 Z" fill="#9fd88d"/>
      <!-- background houses -->
      <g opacity=".9">
        <rect x="560" y="560" width="150" height="230" fill="#f3d9a4" ${S3}/><path d="M545 566 L635 500 L725 566 Z" fill="#7f93ad" ${S3}/>
        <rect x="590" y="600" width="40" height="40" fill="#bfe6ff" ${S3}/><rect x="645" y="600" width="40" height="40" fill="#bfe6ff" ${S3}/>
        <rect x="1250" y="580" width="150" height="210" fill="#bfd7ea" ${S3}/><path d="M1236 586 L1325 520 L1414 586 Z" fill="#c95a43" ${S3}/>
        <rect x="1280" y="620" width="40" height="40" fill="#fff6c8" ${S3}/><rect x="1336" y="620" width="40" height="40" fill="#fff6c8" ${S3}/>
      </g>
      ${tree(1480, 790, 1)}
      <!-- the house on Maple Street -->
      <g id="house" class="tappable">
        <rect x="890" y="450" width="320" height="340" fill="#f6e3b4" ${S}/>
        <path d="M866 456 L1050 330 L1234 456 Z" fill="#c95a43" ${S}/>
        <rect x="1130" y="352" width="34" height="70" fill="#a9442f" ${S3}/>
        <rect id="win1" x="932" y="490" width="80" height="74" rx="4" fill="#bfe6ff" ${S}/>
        <rect id="win2" x="1088" y="490" width="80" height="74" rx="4" fill="#bfe6ff" ${S}/>
        <rect id="win3" x="932" y="626" width="80" height="74" rx="4" fill="#bfe6ff" ${S}/>
        <rect class="burn" x="932" y="490" width="80" height="74" fill="#ff9a3a"/>
        <rect class="burn" x="1088" y="490" width="80" height="74" fill="#ff9a3a"/>
        <rect class="burn" x="932" y="626" width="80" height="74" fill="#ff9a3a"/>
        <path d="M972 490 V564 M932 527 H1012 M1128 490 V564 M1088 527 H1168 M972 626 V700 M932 663 H1012" stroke="${OL}" stroke-width="4"/>
        <rect x="1090" y="640" width="70" height="150" rx="6" fill="#2e9e4f" ${S}/><circle cx="1146" cy="716" r="5" fill="#ffd84a"/>
        <text x="1050" y="430" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="#fff">12</text>
      </g>
      <g id="smoke">${[0, 1, 2, 3, 4].map(i => `<circle class="puff p${i}" cx="${980 + (i % 3) * 70}" cy="420" r="${30 + (i % 2) * 12}" fill="#8a8f9c"/>`).join('')}</g>
      ${flame(972, 562, 0.75, 'flame1')}
      ${flame(1128, 562, 0.75, 'flame2')}
      ${flame(972, 698, 0.75, 'flame3')}
      <g id="kitten" class="tappable" transform="translate(986 392)">${kitten()}</g>
      <!-- street -->
      <rect x="0" y="790" width="1600" height="26" fill="#d9d4c7"/>
      <path d="M0 790 H1600" stroke="${OL}" stroke-width="3"/>
      <rect x="0" y="816" width="1600" height="84" fill="#5a606b"/>
      <path d="M0 872 H1600" stroke="#fff" stroke-width="8" stroke-dasharray="50 40"/>
      <g id="hydrant" class="tappable" transform="translate(304 800)">${hydrant()}</g>
      <path id="hose" d="M326 760 C336 812 340 812 352 800" fill="none" stroke="#2a2f45" stroke-width="14" stroke-linecap="round"/>
      <path id="hose-in" d="M326 760 C336 812 340 812 352 800" fill="none" stroke="#e9e3d6" stroke-width="8" stroke-linecap="round"/>
      <g id="engine" transform="translate(330 846) scale(0.82)">${fireEngine()}</g>
      <g id="sam" class="tappable" transform="translate(222 802)">${sam()}</g>
      <path id="spray" d="" fill="none" stroke="#5cc3ff" stroke-width="16" stroke-linecap="round" opacity=".85"/>
      <g id="splash"></g>
    </svg>`;
  }

  // Small picture for each red word card.
  const wordPicture = {
    hydrant: () => `<svg viewBox="-70 -110 140 130">${hydrant()}</svg>`,
    nozzle: () => `<svg viewBox="-20 -80 200 110"><path d="M-10 0 Q40 -10 70 -20" stroke="${OL}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-10 0 Q40 -10 70 -20" stroke="#e9e3d6" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="64" y="-36" width="60" height="26" rx="6" fill="#9fb1c7" ${S3} transform="rotate(-12 64 -23)"/><path d="M128 -40 Q160 -60 176 -50 M128 -32 Q160 -40 178 -30 M128 -26 Q156 -20 174 -10" stroke="#5cc3ff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`
  };

  // Round sticker for each vehicle.
  const sticker = (v, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? v.colour : '#d3d9e3'}"/>
      <g opacity="${earned ? 1 : 0.35}"><rect x="-38" y="-24" width="76" height="48" rx="10" fill="#fff"/>${picto(v.id, 0, 2, 0.82)}</g>
      ${earned ? '' : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="20" font-weight="700" fill="#8b94a6">${v.door}</text>`}
    </svg>`;

  window.Art = { hub, fireScene, pip, wordPicture, sticker, picto, OL, S, S3, defs, cloud, sun, bush, tree, flame, fireEngine };
})();
