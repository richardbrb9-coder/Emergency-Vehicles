// Pip's World: the list of worlds, Pip's map (the story picker) and the place drawings.
// Every world is open from the start; one that is not built yet shows on the map as "coming soon". To open one, give it a home screen
// and set built: true; its screens list the world in App.screenWorld so Pip wears the right outfit.
(function () {
  const A = window.App, C = window.CONTENT;
  const { OL, S, S3 } = Art;

  const WORLDS = [
    { id: 'rescue',      name: 'Rescue Station', of: 'the Rescue Station', colour: '#e53935', built: true, home: 'hub',
      go: "Let's go to the Rescue Station!" },
    { id: 'zoo',         name: 'Zoo',            of: 'the zoo', colour: '#2e9e4f', built: true, home: 'zoo',
      go: "Let's go to the zoo!" },
    { id: 'monsters',    name: 'Monster Maths',  of: 'Monster Maths', colour: '#8e5bd6', built: true, home: 'monsters',
      go: "Let's go to Monster Town!" },
    { id: 'school',      name: 'School',         of: 'school', colour: '#1e5bd6', built: true, home: 'school',
      go: "Let's go to school!" },
    { id: 'supermarket', name: 'Supermarket',    of: 'the supermarket', colour: '#2e9e4f', built: true, home: 'supermarket',
      go: "Let's go to the supermarket!" },
    { id: 'shop',        name: 'Toy Shop',       of: 'the toy shop', colour: '#ff6f9c', built: true, home: 'toyshop',
      go: "Let's go to the toy shop!" },
    { id: 'puppies',     name: 'New Puppies',    of: 'the new puppies', colour: '#f07a1a', built: true, home: 'puppies',
      go: "Let's go and see the new puppies!" },
    // Pip's Days Out: further along the map, past the signpost. The railway runs from the station to the seaside.
    { id: 'library',     name: 'Library',        of: 'the library', colour: '#c2185b', built: false, out: true,
      soon: "Shh! The library is full of books and stories. It's coming soon!" },
    { id: 'museum',      name: 'Museum',         of: 'the museum', colour: '#8a5a24', built: false, out: true,
      soon: "Roar! There's a great big dinosaur at the museum. It's coming soon!" },
    { id: 'bus',         name: 'Bus and Train',  of: 'the bus and train', colour: '#d6331f', built: false, out: true,
      soon: "Ding ding! Grandad and I are going on the bus and the train. Coming soon!" },
    { id: 'seaside',     name: 'Seaside',        of: 'the seaside', colour: '#0a8fb0', built: false, out: true,
      soon: "I can hear the waves! A sunny seaside holiday is coming soon!" }
  ];
  const world = id => WORLDS.find(w => w.id === id);

  // What Pip says when a place is tapped: map.go.<id> for an open world, map.soon.<id> for one not built yet.
  WORLDS.forEach(w => { C.lines[`map.${w.built ? 'go' : 'soon'}.${w.id}`] = w.built ? w.go : w.soon; });

  Object.assign(C.lines, {
    'map.welcome': "Hello! I'm Pip. Welcome to Pip's World! Tap a place on the map to visit it. Slide the map to find more places!",
    'map.more':    "This way for Pip's Days Out! The train goes all the way to the seaside.",
    'map.back':    'Where shall we go next?',
    'map.hint':    'Tap a place on the map to go there!',
    'map.pip':     'Woof! Tap the Rescue Station to start an adventure.',
    'book.worldSoon': 'Stickers from {name} will go here. Coming soon!'
  });

  // ---------- Place drawings (base centre at 0,0, about 150 units tall) ----------
  const PLACES = {
    rescue: `
      <rect x="-62" y="-106" width="124" height="106" fill="#c95a43" ${S}/>
      <path d="M-30 -106 V-80 M30 -106 V-80 M0 -80 V-56 M-62 -80 H62 M-62 -56 H62" stroke="#a9442f" stroke-width="3"/>
      <path d="M-76 -100 L0 -146 L76 -100 Z" fill="#e53935" ${S}/>
      <circle cy="-150" r="11" fill="#1e5bd6" ${S3}/>
      <rect x="-38" y="-62" width="76" height="62" fill="#e9e3d6" ${S3}/>
      <path d="M-38 -48 H38 M-38 -34 H38 M-38 -20 H38" stroke="#b9b3a6" stroke-width="3"/>`,
    zoo: `
      <path d="M-44 -96 V0 M-22 -100 V0 M0 -102 V0 M22 -100 V0 M44 -96 V0" stroke="#5a606b" stroke-width="5"/>
      <rect x="-74" y="-118" width="24" height="118" rx="4" fill="#8b5a2b" ${S3}/>
      <rect x="50" y="-118" width="24" height="118" rx="4" fill="#8b5a2b" ${S3}/>
      <path d="M-78 -112 Q0 -162 78 -112 L78 -96 Q0 -144 -78 -96 Z" fill="#2e9e4f" ${S3}/>
      <g transform="translate(-6 0)">
        <path d="M-6 -60 L-2 -150 H12 L16 -60 Z" fill="#f2b705" ${S3}/>
        <circle cx="4" cy="-120" r="4" fill="#a8651e"/><circle cx="8" cy="-92" r="4" fill="#a8651e"/><circle cx="2" cy="-74" r="3" fill="#a8651e"/>
        <ellipse cx="18" cy="-154" rx="20" ry="12" fill="#f2b705" ${S3}/>
        <path d="M0 -164 L-2 -176 M10 -166 L10 -178" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="22" cy="-157" r="3" fill="${OL}"/>
      </g>`,
    monsters: `
      <rect x="-52" y="-122" width="104" height="122" fill="#8e5bd6" ${S}/>
      <path d="M-52 -122 V-140 H-30 V-122 H-10 V-140 H10 V-122 H30 V-140 H52 V-122" fill="#8e5bd6" ${S}/>
      <path d="M-44 -140 L-36 -164 L-28 -140 Z M28 -140 L36 -164 L44 -140 Z" fill="#ffd21f" ${S3}/>
      <circle cy="-78" r="26" fill="#fff" ${S3}/><circle cx="4" cy="-74" r="12" fill="${OL}"/><circle cx="8" cy="-78" r="4" fill="#fff"/>
      <path d="M-24 0 V-24 Q0 -46 24 -24 V0 Z" fill="#3a2a5a" ${S3}/>
      <path d="M-16 -22 L-10 -14 L-4 -22 L2 -14 L8 -22 L14 -14" fill="none" stroke="#fff" stroke-width="3"/>`,
    school: `
      <rect x="-72" y="-100" width="144" height="100" fill="#f2c879" ${S}/>
      <path d="M-82 -98 L0 -150 L82 -98 Z" fill="#e53935" ${S}/>
      <circle cy="-116" r="16" fill="#fff" ${S3}/><path d="M0 -116 V-126 M0 -116 H8" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
      <rect x="-58" y="-80" width="32" height="28" fill="#bfe6ff" ${S3}/><rect x="26" y="-80" width="32" height="28" fill="#bfe6ff" ${S3}/>
      <rect x="-18" y="-50" width="36" height="50" fill="#1e5bd6" ${S3}/>`,
    supermarket: `
      <rect x="-74" y="-96" width="148" height="96" fill="#fff" ${S}/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-80 + i * 26.7} -122 h26.7 v24 q-13.3 12 -26.7 0 Z" fill="${i % 2 ? '#fff' : '#2e9e4f'}" ${S3}/>`).join('')}
      <rect x="-60" y="-80" width="70" height="46" fill="#bfe6ff" ${S3}/>
      <circle cx="-40" cy="-46" r="7" fill="#f07a1a"/><circle cx="-24" cy="-48" r="7" fill="#ffd21f"/><circle cx="-8" cy="-46" r="7" fill="#e53935"/>
      <rect x="24" y="-62" width="34" height="62" fill="#2e9e4f" ${S3}/>`,
    shop: `
      <rect x="-70" y="-96" width="140" height="96" fill="#ffe3ef" ${S}/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-76 + i * 25.3} -120 h25.3 v22 q-12.7 12 -25.3 0 Z" fill="${i % 2 ? '#ffd21f' : '#e53935'}" ${S3}/>`).join('')}
      <rect x="-56" y="-80" width="66" height="50" fill="#bfe6ff" ${S3}/>
      <circle cx="-23" cy="-50" r="13" fill="#c98b4a" ${S3}/><circle cx="-33" cy="-62" r="6" fill="#c98b4a" ${S3}/><circle cx="-13" cy="-62" r="6" fill="#c98b4a" ${S3}/>
      <circle cx="-27" cy="-52" r="2" fill="${OL}"/><circle cx="-19" cy="-52" r="2" fill="${OL}"/>
      <rect x="22" y="-60" width="34" height="60" fill="#e53935" ${S3}/>
      <path d="M62 -96 Q58 -128 66 -146" fill="none" stroke="${OL}" stroke-width="3"/>
      <ellipse cx="66" cy="-162" rx="16" ry="19" fill="#1e5bd6" ${S3}/>`,
    puppies: `
      <rect x="-62" y="-80" width="124" height="80" fill="#c97a3d" ${S}/>
      <path d="M-62 -60 H62 M-62 -40 H62 M-62 -20 H62" stroke="#a8622c" stroke-width="3"/>
      <path d="M-78 -74 L0 -140 L78 -74 Z" fill="#e53935" ${S}/>
      <path d="M-32 0 V-36 Q0 -70 32 -36 V0 Z" fill="#3a2a20" ${S3}/>
      ${[-16, 4, 22].map((x, i) => `<g transform="translate(${x - 4} ${-12 - (i % 2) * 6})">
        <circle r="11" fill="#fff" ${S3}/><path d="M-10 -4 Q-16 6 -8 10 Z M10 -4 Q16 6 8 10 Z" fill="${i === 1 ? '#c97a3d' : OL}"/>
        <circle cx="-4" cy="-2" r="2" fill="${OL}"/><circle cx="4" cy="-2" r="2" fill="${OL}"/><ellipse cy="4" rx="3" ry="2" fill="${OL}"/></g>`).join('')}
      <g transform="translate(0 -104)"><ellipse rx="9" ry="7" fill="#fff"/><circle cx="-10" cy="-10" r="4" fill="#fff"/><circle cx="0" cy="-14" r="4" fill="#fff"/><circle cx="10" cy="-10" r="4" fill="#fff"/></g>`,
    library: `
      <rect x="-70" y="-96" width="140" height="96" fill="#f3e3c3" ${S}/>
      <path d="M-82 -94 L0 -142 L82 -94 Z" fill="#c2185b" ${S}/>
      <g transform="translate(0 -112)"><path d="M-20 -8 Q-10 -13 0 -6 Q10 -13 20 -8 V9 Q10 4 0 11 Q-10 4 -20 9 Z" fill="#fff" ${S3}/><path d="M0 -6 V11" stroke="${OL}" stroke-width="2.5"/></g>
      ${[-58, 20].map(x => `<rect x="${x}" y="-80" width="38" height="44" fill="#bfe6ff" ${S3}/>
        ${['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f', '#8e5bd6'].map((c, i) => `<rect x="${x + 4 + i * 6.4}" y="${-56 + (i % 2) * 3}" width="5.4" height="${17 - (i % 2) * 3}" fill="${c}"/>`).join('')}
        <path d="M${x} -38 H${x + 38}" stroke="${OL}" stroke-width="3"/>`).join('')}
      <path d="M-16 0 V-36 Q0 -54 16 -36 V0 Z" fill="#7a4a2a" ${S3}/>`,
    museum: `
      <path d="M30 -100 Q36 -150 74 -162" fill="none" stroke="${OL}" stroke-width="24" stroke-linecap="round"/>
      <path d="M30 -100 Q36 -150 74 -162" fill="none" stroke="#7ac46a" stroke-width="16" stroke-linecap="round"/>
      <ellipse cx="82" cy="-163" rx="19" ry="12" fill="#7ac46a" ${S3}/><circle cx="86" cy="-167" r="3" fill="${OL}"/>
      <path d="M90 -158 Q96 -157 99 -161" fill="none" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="-80" y="-12" width="160" height="12" fill="#d9d2c3" ${S3}/>
      <rect x="-72" y="-24" width="144" height="12" fill="#e9e3d6" ${S3}/>
      <rect x="-66" y="-90" width="132" height="66" fill="#d9d2c3" ${S3}/>
      ${[-58, -34, 20, 44].map(x => `<rect x="${x}" y="-90" width="14" height="66" fill="#f4f0e6" ${S3}/>`).join('')}
      <path d="M-13 -24 V-58 Q0 -70 13 -58 V-24 Z" fill="#5a3a20" ${S3}/>
      <rect x="-74" y="-102" width="148" height="12" fill="#e9e3d6" ${S3}/>
      <path d="M-82 -102 L0 -140 L82 -102 Z" fill="#f4f0e6" ${S}/>
      <circle cy="-115" r="8" fill="#ffd21f" ${S3}/>`,
    bus: `
      <rect x="-22" y="-104" width="88" height="104" fill="#e8b98a" ${S}/>
      <path d="M-32 -102 L22 -136 L76 -102 Z" fill="#2a5a9e" ${S}/>
      <circle cx="22" cy="-82" r="15" fill="#fff" ${S3}/><path d="M22 -82 V-92 M22 -82 H29" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
      <path d="M8 0 V-44 Q22 -58 36 -44 V0 Z" fill="#2a5a9e" ${S3}/>
      <g transform="translate(-34 0)">
        <rect x="-50" y="-92" width="76" height="82" rx="10" fill="#e53935" ${S}/>
        <path d="M-50 -50 H26" stroke="#fff" stroke-width="5"/>
        ${[-42, -18].map(x => `<rect x="${x}" y="-84" width="18" height="24" rx="4" fill="#bfe6ff" ${S3}/><rect x="${x}" y="-42" width="18" height="18" rx="4" fill="#bfe6ff" ${S3}/>`).join('')}
        <rect x="6" y="-44" width="14" height="30" rx="3" fill="#bfe6ff" ${S3}/>
        <circle cx="-30" cy="-8" r="10" fill="#3a3f55" ${S3}/><circle cx="12" cy="-8" r="10" fill="#3a3f55" ${S3}/>
      </g>`,
    seaside: `
      <path d="M-86 0 Q-40 -18 0 -12 Q50 -20 88 0 Z" fill="#f6dc9a" ${S3}/>
      <rect x="0" y="-92" width="62" height="84" fill="#fff" ${S}/>
      ${[0, 1, 2].map(i => `<rect x="${4 + i * 20}" y="-90" width="10" height="80" fill="#1e88e5"/>`).join('')}
      <rect x="0" y="-92" width="62" height="84" fill="none" ${S}/>
      <path d="M-8 -90 L31 -126 L70 -90 Z" fill="#e53935" ${S}/>
      <rect x="18" y="-48" width="26" height="40" fill="#ffd21f" ${S3}/>
      <path d="M-46 -6 V-112" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-96 -104 Q-46 -158 4 -104 Z" fill="#fff" ${S3}/>
      <path d="M-96 -104 Q-80 -146 -46 -131 Q-62 -120 -63 -104 Z M-46 -131 Q-12 -146 4 -104 H-29 Q-30 -120 -46 -131 Z" fill="#ff6f9c"/>
      <path d="M-96 -104 Q-46 -158 4 -104 Z" fill="none" ${S3}/>
      <g transform="translate(-74 -4)"><path d="M-12 -24 H12 L8 0 H-8 Z" fill="#ffd21f" ${S3}/><path d="M-10 -24 Q0 -38 10 -24" fill="none" ${S3}/></g>`
  };
  // Worlds are never locked: a world that isn't built yet just shows a "Soon!" sign and a traffic cone.
  const soonSign = `<g transform="translate(58 -128)"><path d="M0 16 V44" stroke="${OL}" stroke-width="5"/>
    <rect x="-38" y="-18" width="76" height="36" rx="8" fill="#ffd21f" ${S3}/>
    <text y="8" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="22" fill="${OL}">Soon!</text></g>
    <g transform="translate(-90 4)"><path d="M-14 0 L-6 -36 H6 L14 0 Z" fill="#ff8a1f" ${S3}/><path d="M-9 -16 H9" stroke="#fff" stroke-width="5"/></g>`;

  // A small picture of a place, for the sticker book's world chips.
  const placeIcon = id => `<svg viewBox="-90 -185 180 195" class="place-icon">${PLACES[id]}</svg>`;

  // ---------- Pip's map ----------
  // The map is wider than the screen and slides sideways: the town first (x 0–1600, so a 16:9 screen opens on it),
  // then the "Pip's Days Out" signpost, then the road on to the station, and the railway out to the seaside.
  const MAP_W = 2900;
  const SPOTS = {
    rescue: [320, 660], zoo: [480, 420], monsters: [640, 660], school: [800, 420], supermarket: [960, 660], shop: [1120, 420],
    puppies: [1280, 660], library: [1660, 660], museum: [1830, 420], bus: [2010, 660], seaside: [2560, 700]
  };
  const RAIL = 'M2070 610 C2190 610 2210 520 2330 520 C2420 520 2440 580 2470 580';

  // A little train that runs along the railway to the seaside and back.
  const train = `
    <g transform="translate(-56 -4)">
      <rect x="0" y="-38" width="44" height="30" rx="5" fill="#2e9e4f" ${S3}/>
      <rect x="6" y="-32" width="12" height="12" rx="2" fill="#bfe6ff"/><rect x="24" y="-32" width="12" height="12" rx="2" fill="#bfe6ff"/>
      <path d="M44 -24 H50" stroke="${OL}" stroke-width="4"/>
      <rect x="50" y="-36" width="44" height="28" rx="5" fill="#e53935" ${S3}/>
      <rect x="82" y="-58" width="20" height="50" rx="4" fill="#e53935" ${S3}/>
      <rect x="86" y="-52" width="12" height="12" rx="2" fill="#bfe6ff"/>
      <rect x="58" y="-52" width="10" height="16" fill="${OL}"/>
      <g class="map-smoke"><circle cx="63" cy="-64" r="7" fill="#fff" opacity=".9"/><circle cx="55" cy="-78" r="9" fill="#fff" opacity=".7"/></g>
      ${[12, 34, 62, 92].map(x => `<circle cx="${x}" cy="-6" r="7" fill="#3a3f55" ${S3}/>`).join('')}
    </g>`;

  const signpost = (x, y) => `
    <g transform="translate(${x} ${y})">
      <rect x="-7" y="-150" width="14" height="150" rx="4" fill="#8b5a2b" ${S3}/>
      <path d="M-74 -150 H64 L90 -125 L64 -100 H-74 Z" fill="#ffd21f" ${S3}/>
      <text x="-2" y="-118" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="${OL}">Pip's Days Out</text>
    </g>`;

  function mapArt() {
    // The road joins the places in order, ending at the station; the railway takes over from there.
    const order = WORLDS.filter(w => w.id !== 'seaside').map(w => SPOTS[w.id]);
    const pts = [[60, 700], ...order];
    let d = `M${pts[0][0]} ${pts[0][1] + 12}`;
    for (let i = 1; i < pts.length; i++) {
      const [xa, ya] = pts[i - 1], [xb, yb] = pts[i];
      const k = Math.min(80, (xb - xa) / 2);
      d += ` C${xa + k} ${ya + 12} ${xb - k} ${yb + 12} ${xb} ${yb + 12}`;
    }
    const places = WORLDS.map(w => {
      const [x, y] = SPOTS[w.id], wide = w.name.length * 12.5 + 36;
      return `<g class="place tappable${w.built ? '' : ' soon'}" data-id="${w.id}" transform="translate(${x} ${y})">
        <ellipse cy="6" rx="86" ry="16" fill="#000" opacity=".12"/>
        <g class="place-art">${PLACES[w.id]}${w.built ? '' : soonSign}</g>
        <rect x="${-wide / 2}" y="22" width="${wide}" height="40" rx="12" fill="#fff" ${S3}/>
        <text y="50" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="${w.colour}">${w.name}</text>
        <rect x="-90" y="-185" width="180" height="250" fill="transparent"/>
      </g>`;
    }).join('');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    return `
    <svg class="scene-svg map-svg" viewBox="0 0 ${MAP_W} 900" aria-label="Pip's map">
      ${Art.defs()}
      <rect width="${MAP_W}" height="900" fill="url(#sky)"/>
      ${Art.sun(2640, 210, 'map-sun')}
      <g class="clouds">${Art.cloud(120, 80, 0.9)}${Art.cloud(1020, 60, 0.7)}${Art.cloud(1700, 110, 0.8)}${Art.cloud(2180, 50, 0.6)}</g>
      <path d="M0 330 Q240 250 520 300 T1060 290 T1600 300 T2140 290 T2700 300 V900 H0 Z" fill="#9fd88d"/>
      <path d="M0 520 Q300 470 640 510 T1280 500 T1920 510 T2560 500 V900 H0 Z" fill="#8ccf78"/>
      <!-- the coast: sand, then the sea with a lighthouse -->
      <path d="M2240 900 C2280 760 2300 560 2400 470 C2470 410 2600 400 ${MAP_W} 400 V900 Z" fill="#f6dc9a"/>
      <path d="M2690 900 C2660 760 2650 560 2700 430 H${MAP_W} V900 Z" fill="url(#water)"/>
      <g class="waves">${[500, 600, 700, 800].map((y, i) => `<path d="M${2700 - i * 8} ${y} q22 -14 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`).join('')}</g>
      <g transform="translate(2810 470)">
        <path d="M-40 10 Q-30 -14 0 -16 Q30 -14 40 10 Z" fill="#8a8f9c" ${S3}/>
        <path d="M-20 -14 L-14 -150 H14 L20 -14 Z" fill="#fff" ${S}/>
        <path d="M-18 -50 H18 L17 -70 H-17 Z M-16 -100 H16 L15 -120 H-15 Z" fill="#e53935"/>
        <rect x="-16" y="-172" width="32" height="22" fill="#ffd21f" ${S3}/>
        <path d="M-22 -172 L0 -190 L22 -172 Z" fill="#e53935" ${S3}/>
      </g>
      <g transform="translate(2770 640)"><path d="M-40 0 H40 L28 22 H-28 Z" fill="#ff8a1f" ${S3}/><path d="M0 0 V-66" stroke="${OL}" stroke-width="4"/><path d="M4 -64 L40 -8 H4 Z" fill="#fff" ${S3}/></g>
      <!-- the road -->
      <path d="${d}" fill="none" stroke="#d9bb7a" stroke-width="58" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#f4dca0" stroke-width="44" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="14 22" opacity=".7"/>
      <!-- the railway to the coast -->
      <path d="${RAIL}" fill="none" stroke="#8b5a2b" stroke-width="30" stroke-dasharray="7 11"/>
      <path d="${RAIL}" fill="none" stroke="#7a808f" stroke-width="20"/>
      <path d="${RAIL}" fill="none" stroke="#c9b48a" stroke-width="12"/>
      <g transform="translate(2476 580)"><rect x="-6" y="-22" width="12" height="26" fill="#e53935" ${S3}/></g>
      <g class="map-train">${train}${still ? '' : `<animateMotion dur="14s" repeatCount="indefinite" calcMode="linear"
        keyPoints="0;0;1;1;0" keyTimes="0;.25;.5;.75;1" path="${RAIL}"/>`}</g>
      ${Art.tree(150, 470, 0.7)}${Art.tree(700, 300, 0.55)}${Art.tree(1420, 500, 0.75)}${Art.tree(60, 880, 0.9)}
      ${Art.tree(1990, 330, 0.6)}${Art.tree(1560, 860, 0.8)}${Art.tree(2160, 860, 0.7)}
      ${Art.bush(360, 840, 0.7)}${Art.bush(890, 860, 0.8)}${Art.bush(1230, 840, 0.6)}${Art.bush(1900, 850, 0.7)}
      ${signpost(1460, 620)}
      ${places}
    </svg>`;
  }

  // Arrows at the edges show there is more map; they slide it a screen at a time.
  const arrow = dir => `<button class="map-arrow ${dir}" aria-label="${dir === 'left' ? 'Back along the map' : 'More places'}">
    <svg viewBox="0 0 64 64"><path d="${dir === 'left' ? 'M38 14 L20 32 L38 50' : 'M26 14 L44 32 L26 50'}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;

  let welcomed = false, moreSaid = false, lastPlace = null;
  A.screenWorld.hub = 'rescue';
  A.screens.map = (arg, alive) => {
    const scene = document.getElementById('scene');
    scene.innerHTML = `<div class="map-wrap"><div class="map-scroll">${mapArt()}</div>${arrow('left')}${arrow('right')}</div>`;
    A.ui({ stickers: true, grownups: true });
    const svg = scene.querySelector('svg'), scroller = scene.querySelector('.map-scroll');
    const left = scene.querySelector('.map-arrow.left'), right = scene.querySelector('.map-arrow.right');
    const unit = () => scroller.scrollWidth / MAP_W; // screen pixels per map unit
    let busy = false;

    const update = () => {
      if (!alive()) return;
      const x = scroller.scrollLeft, max = scroller.scrollWidth - scroller.clientWidth;
      left.hidden = x < 8;
      right.hidden = x > max - 8;
      // Once the Days Out signpost comes into view, Pip says where the road goes (once per visit to the app).
      if (!moreSaid && x + scroller.clientWidth > 1720 * unit()) {
        moreSaid = true; right.classList.remove('nudge');
        if (welcomed && !busy) A.say('map.more');
      }
    };
    scroller.addEventListener('scroll', update, { passive: true });
    const slide = dir => { Sfx.tap(); A.Hint.clear(); scroller.scrollBy({ left: dir * scroller.clientWidth * 0.75, behavior: 'smooth' }); };
    left.addEventListener('click', () => slide(-1));
    right.addEventListener('click', () => slide(1));
    if (!moreSaid) right.classList.add('nudge');

    // Coming back from a world: open the map with that place in the middle of the screen.
    if (lastPlace) scroller.scrollLeft = SPOTS[lastPlace][0] * unit() - scroller.clientWidth / 2;
    update();

    svg.querySelectorAll('.place').forEach(p => p.addEventListener('click', async () => {
      if (busy) return;
      const w = world(p.dataset.id), art = p.querySelector('.place-art');
      busy = true; A.Hint.clear(); lastPlace = w.id;
      Sfx.tap();
      A.tween(500, (q, raw) => art.setAttribute('transform', `scale(${1 + Math.sin(raw * Math.PI) * .12})`));
      A.Pip.outfit(w.id);
      if (w.built) {
        A.Pip.act('jump'); A.Pip.mood('cheer');
        await A.say(`map.go.${w.id}`);
        if (alive()) A.go(w.home);
        return;
      }
      // Not built yet: Pip tries on the outfit for that world, then changes back.
      A.Pip.act('dance'); A.Pip.mood('surprised');
      await Promise.all([A.say(`map.soon.${w.id}`), A.wait(2500)]);
      if (!alive()) return;
      A.Pip.outfit('map');
      busy = false;
    }));

    A.Hint.set([svg.querySelector('.place[data-id="rescue"]')], 'map.hint');
    A.Pip.act('wave');
    if (!welcomed) { welcomed = true; A.say('map.welcome'); } else A.say('map.back');
  };

  window.Worlds = { WORLDS, world, placeIcon };
})();
