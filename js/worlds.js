// Pip's World: the list of worlds, Pip's map (the story picker) and the place drawings.
// A world that is not built yet shows on the map as "coming soon". To open one, give it a home screen
// and set built: true; its screens list the world in App.screenWorld so Pip wears the right outfit.
(function () {
  const A = window.App, C = window.CONTENT;
  const { OL, S, S3 } = Art;

  const WORLDS = [
    { id: 'rescue',      name: 'Rescue Station', of: 'the Rescue Station', colour: '#e53935', built: true, home: 'hub',
      go: "Let's go to the Rescue Station!" },
    { id: 'zoo',         name: 'Zoo',            of: 'the zoo', colour: '#2e9e4f',
      soon: 'The zoo is getting ready for visitors. Coming soon!' },
    { id: 'monsters',    name: 'Monster Maths',  of: 'Monster Maths', colour: '#8e5bd6',
      soon: 'The monsters are still counting. Monster Maths is coming soon!' },
    { id: 'school',      name: 'School',         of: 'school', colour: '#1e5bd6',
      soon: 'School is not open yet. Coming soon!' },
    { id: 'supermarket', name: 'Supermarket',    of: 'the supermarket', colour: '#2e9e4f',
      soon: 'The supermarket is still filling its shelves. Coming soon!' },
    { id: 'shop',        name: 'Toy Shop',       of: 'the toy shop', colour: '#ff6f9c',
      soon: 'The toy shop is still unpacking its toys. Coming soon!' },
    { id: 'puppies',     name: 'New Puppies',    of: 'the new puppies', colour: '#f07a1a',
      soon: 'Shh! Mum is resting. The new puppies are coming soon!' }
  ];
  const world = id => WORLDS.find(w => w.id === id);

  Object.assign(C.lines, {
    'map.welcome': "Hello! I'm Pip. Welcome to Pip's World! Tap a place on the map to visit it.",
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
      <g transform="translate(0 -104)"><ellipse rx="9" ry="7" fill="#fff"/><circle cx="-10" cy="-10" r="4" fill="#fff"/><circle cx="0" cy="-14" r="4" fill="#fff"/><circle cx="10" cy="-10" r="4" fill="#fff"/></g>`
  };
  const lock = `<g transform="translate(64 -130)"><circle r="22" fill="#ffd21f" ${S3}/>
    <path d="M-8 -2 V-8 Q0 -18 8 -8 V-2" fill="none" stroke="${OL}" stroke-width="4"/><rect x="-11" y="-3" width="22" height="16" rx="3" fill="${OL}"/></g>`;

  // A small picture of a place, for the sticker book's world chips.
  const placeIcon = id => `<svg viewBox="-90 -185 180 195" class="place-icon">${PLACES[id]}</svg>`;

  // ---------- Pip's map ----------
  const SPOTS = [[320, 660], [480, 420], [640, 660], [800, 420], [960, 660], [1120, 420], [1280, 660]]; // inside x 200–1400 so 4:3 screens show every place
  function mapArt() {
    const pts = [[60, 700], ...SPOTS, [1560, 700]];
    let d = `M${pts[0][0]} ${pts[0][1] + 12}`;
    for (let i = 1; i < pts.length; i++) {
      const [xa, ya] = pts[i - 1], [xb, yb] = pts[i];
      d += ` C${xa + 80} ${ya + 12} ${xb - 80} ${yb + 12} ${xb} ${yb + 12}`;
    }
    const places = WORLDS.map((w, i) => {
      const [x, y] = SPOTS[i], wide = w.name.length * 12.5 + 36;
      return `<g class="place tappable${w.built ? '' : ' soon'}" data-id="${w.id}" transform="translate(${x} ${y})">
        <ellipse cy="6" rx="86" ry="16" fill="#000" opacity=".12"/>
        <g class="place-art">${PLACES[w.id]}${w.built ? '' : lock}</g>
        <rect x="${-wide / 2}" y="22" width="${wide}" height="40" rx="12" fill="#fff" ${S3}/>
        <text y="50" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="${w.colour}">${w.name}</text>
        <rect x="-90" y="-185" width="180" height="250" fill="transparent"/>
      </g>`;
    }).join('');
    return `
    <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="Pip's map">
      ${Art.defs()}
      <rect width="1600" height="900" fill="url(#sky)"/>
      <g class="clouds">${Art.cloud(120, 80, 0.9)}${Art.cloud(1020, 60, 0.7)}</g>
      <path d="M0 330 Q240 250 520 300 T1060 290 T1600 300 V900 H0 Z" fill="#9fd88d"/>
      <path d="M0 520 Q300 470 640 510 T1280 500 T1600 520 V900 H0 Z" fill="#8ccf78"/>
      <path d="${d}" fill="none" stroke="#d9bb7a" stroke-width="58" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#f4dca0" stroke-width="44" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="14 22" opacity=".7"/>
      <path d="M1440 900 Q1460 800 1600 780 V900 Z" fill="url(#water)"/>
      ${Art.tree(150, 470, 0.7)}${Art.tree(700, 300, 0.55)}${Art.tree(1450, 520, 0.75)}${Art.tree(60, 880, 0.9)}
      ${Art.bush(360, 840, 0.7)}${Art.bush(890, 860, 0.8)}${Art.bush(1230, 840, 0.6)}
      ${places}
    </svg>`;
  }

  let welcomed = false;
  A.screens.map = (arg, alive) => {
    const scene = document.getElementById('scene');
    scene.innerHTML = mapArt();
    A.ui({ stickers: true, grownups: true });
    const svg = scene.querySelector('svg');
    let busy = false;
    svg.querySelectorAll('.place').forEach(p => p.addEventListener('click', async () => {
      if (busy) return;
      const w = world(p.dataset.id), art = p.querySelector('.place-art');
      busy = true; A.Hint.clear();
      Sfx.tap();
      A.tween(500, (q, raw) => art.setAttribute('transform', `scale(${1 + Math.sin(raw * Math.PI) * .12})`));
      A.Pip.outfit(w.id);
      if (w.built) {
        A.Pip.act('jump'); A.Pip.mood('cheer');
        await A.sayText(w.go);
        if (alive()) A.go(w.home);
        return;
      }
      // Not built yet: Pip tries on the outfit for that world, then changes back.
      A.Pip.act('dance'); A.Pip.mood('surprised');
      await Promise.all([A.sayText(w.soon), A.wait(2500)]);
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
