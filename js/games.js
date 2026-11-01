// Games corner: a menu of mini-games, plus Action Stations (dress Sam in order) and Call 999 (dial and pick the service).
(function () {
  const A = window.App;
  const { OL, S, S3 } = Art;
  const scene = () => document.getElementById('scene');
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  const ICON = {
    again: `<svg viewBox="0 0 64 64"><path d="M48 32 A16 16 0 1 1 40 18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M34 8 L46 18 L34 26 Z" fill="#fff"/></svg>`,
    games: `<svg viewBox="0 0 64 64"><path d="M14 22 H26 Q24 12 32 12 Q40 12 38 22 H50 V34 Q60 32 60 40 Q60 48 50 46 V56 H14 V46 Q24 48 24 40 Q24 32 14 34 Z" fill="#fff"/></svg>`
  };

  // Play again / back to the games menu, shown at the end of a game.
  function endButtons(again, back = 'games') {
    const end = document.createElement('div');
    end.className = 'game-end';
    end.innerHTML = `
      <button class="big-btn" style="background:#1e5bd6" aria-label="Play again">${ICON.again}</button>
      <button class="big-btn" style="background:#8e5bd6" aria-label="More games">${ICON.games}</button>`;
    scene().appendChild(end);
    const [a, g] = end.querySelectorAll('button');
    a.onclick = () => { Sfx.tap(); A.go(again); };
    g.onclick = () => { Sfx.tap(); A.go(back); };
  }

  // =====================================================================
  // Games registry: each game file adds itself, and the menu and sticker book read from here
  // =====================================================================
  // Each game belongs to a world. world: which sticker page it is on; back: the screen its "more games" button goes to.
  A.games = [];
  A.addGame = (id, colour, art, { world = 'rescue', back = 'games' } = {}) => A.games.push({ id, colour, art, world, back, title: CONTENT.lines['games.' + id] });
  A.worldGames = world => A.games.filter(g => g.world === world);
  A.game = id => A.games.find(g => g.id === id);
  // How many times this game has been finished: games get a little harder each time.
  A.level = id => Math.min(2, A.progress.plays[id] || 0);

  A.gameSticker = (g, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? g.colour : '#d3d9e3'}"/>
      <circle r="33" fill="#fff" opacity="${earned ? 1 : 0.5}"/>
      <g opacity="${earned ? 1 : 0.3}">${g.art.replace('<svg ', '<svg x="-29" y="-29" width="58" height="58" ')}</g>
    </svg>`;

  // Finishing a game: confetti, a sticker the first time, then play again or pick another game.
  A.gameDone = (id, { buttons = true } = {}) => {
    const p = A.progress, g = A.game(id);
    p.plays[id] = (p.plays[id] || 0) + 1;
    const isNew = !p.games.includes(id);
    if (isNew) p.games.push(id);
    A.saveProgress();
    A.confetti(); Sfx.fanfare();
    if (A.afterProgress) A.afterProgress();
    if (isNew && g) {
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${g.title} sticker">
          <h2>${g.title} sticker!</h2>
          <div class="sticker-big">${A.gameSticker(g, true)}</div>
          <div class="btn-row">
            <button class="big-btn again" style="background:#1e5bd6" aria-label="Play again">${ICON.again}</button>
            <button class="big-btn more" style="background:#8e5bd6" aria-label="More games">${ICON.games}</button>
          </div>
        </div>`);
      document.querySelector('#modal .again').onclick = () => { Sfx.tap(); A.closeModal(); A.go(id); };
      document.querySelector('#modal .more').onclick = () => { Sfx.tap(); A.closeModal(); A.go(g.back); };
      A.later(() => A.sayText(`You earned the ${g.title} sticker!`), 1600);
    } else if (buttons) endButtons(id, g ? g.back : 'games');
  };

  // =====================================================================
  // Games menu
  // =====================================================================
  const TILE_ART = {
    match: `<svg viewBox="-60 -60 120 120"><g transform="translate(-22 -6) rotate(-10)"><path d="M-30 4 Q0 -2 20 -10" stroke="${OL}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-30 4 Q0 -2 20 -10" stroke="#e9e3d6" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="16" y="-22" width="34" height="18" rx="5" fill="#9fb1c7" ${S3}/></g>
      <g transform="translate(20 26)"><path d="M-10 -16 V-24 H10 V-16" fill="none" stroke="${OL}" stroke-width="5"/><rect x="-28" y="-18" width="56" height="40" rx="8" fill="#8a5a3c" ${S3}/><path d="M0 -8 V14 M-11 3 H11" stroke="#fff" stroke-width="7"/></g></svg>`,
    dress: `<svg viewBox="-60 -60 120 120"><path d="M-44 14 Q-44 -40 0 -40 Q44 -40 44 14 Z" fill="#ffd21f" ${S}/><path d="M-52 14 H52" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M0 -40 V12" stroke="#e0a800" stroke-width="8"/><rect x="-14" y="-24" width="28" height="18" rx="4" fill="#e53935" ${S3}/></svg>`,
    call: `<svg viewBox="-60 -60 120 120"><rect x="-30" y="-50" width="60" height="100" rx="12" fill="#30364a" ${S}/><rect x="-22" y="-40" width="44" height="22" rx="4" fill="#bff0c8"/><text x="0" y="-23" font-family="Fredoka, sans-serif" font-weight="700" font-size="18" fill="#1b2233" text-anchor="middle">999</text>
      ${[0, 1, 2].map(r => [0, 1, 2].map(k => `<circle cx="${-14 + k * 14}" cy="${-4 + r * 14}" r="5" fill="${r === 0 ? '#ffd21f' : '#c7cfdb'}"/>`).join('')).join('')}</svg>`
  };
  A.addGame('match', '#1e5bd6', TILE_ART.match);
  A.addGame('dress', '#e53935', TILE_ART.dress);
  A.addGame('call', '#2e9e4f', TILE_ART.call);

  A.screens.games = () => {
    A.ui({ home: true, stickers: true });
    scene().innerHTML = `
      <div class="games-menu">
        ${A.worldGames('rescue').map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * 0.05}s" aria-label="${g.title}">
          <span class="art">${g.art}</span><span class="label">${g.title}</span>${A.progress.games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}
      </div>`;
    scene().querySelectorAll('.game-tile').forEach(b => {
      b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); };
    });
    A.say('games.title');
  };

  // =====================================================================
  // Action Stations: put Sam's kit on in the right order, then slide down the pole
  // =====================================================================
  const SKIN = '#a8704f', NAVY = '#29324a', VIS = '#ffd21f';
  const KIT = [
    { id: 'boots', name: 'boots', art: `<g><path d="M-44 -40 H-14 V-8 H-6 Q0 -8 0 0 V8 H-48 V-36 Z" fill="${NAVY}" ${S3}/><rect x="-46" y="-26" width="30" height="6" fill="${VIS}"/>
        <path d="M6 -40 H36 V-8 H44 Q50 -8 50 0 V8 H2 V-36 Z" fill="${NAVY}" ${S3}/><rect x="4" y="-26" width="30" height="6" fill="${VIS}"/></g>` },
    { id: 'trousers', name: 'trousers', art: `<g><path d="M-32 -60 H32 L36 50 H8 L0 -10 L-8 50 H-36 Z" fill="${NAVY}" ${S3}/><rect x="-35" y="22" width="26" height="8" fill="${VIS}"/><rect x="9" y="22" width="26" height="8" fill="${VIS}"/><rect x="-32" y="-60" width="64" height="10" fill="#c62828"/></g>` },
    { id: 'jacket', name: 'jacket', art: `<g><path d="M-30 -56 Q0 -66 30 -56 L58 0 L42 10 L30 -14 V52 H-30 V-14 L-42 10 L-58 0 Z" fill="${NAVY}" ${S3}/>
        <rect x="-30" y="16" width="60" height="9" fill="${VIS}"/><path d="M0 -60 V52" stroke="${OL}" stroke-width="3"/><path d="M-12 -60 L0 -44 L12 -60" fill="#c62828" ${S3}/></g>` },
    { id: 'helmet', name: 'helmet', art: `<g><path d="M-40 10 Q-40 -44 0 -44 Q40 -44 40 10 Z" fill="${VIS}" ${S3}/><path d="M-48 10 H48" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M0 -44 V8" stroke="#e0a800" stroke-width="7"/></g>` }
  ];
  const SPOTS = [{ x: 330, y: 600 }, { x: 330, y: 440 }, { x: 1290, y: 440 }, { x: 1290, y: 600 }];
  const SAM = { x: 760, y: 790, s: 1.9 };
  const POLE = 1060;

  const samArt = () => `
    <ellipse cx="0" cy="2" rx="40" ry="8" fill="rgba(0,0,0,.18)"/>
    <rect x="-20" y="-72" width="16" height="66" rx="6" fill="${SKIN}" ${S3}/><rect x="4" y="-72" width="16" height="66" rx="6" fill="${SKIN}" ${S3}/>
    <rect x="-22" y="-14" width="18" height="14" rx="4" fill="#fff" ${S3}/><rect x="4" y="-14" width="18" height="14" rx="4" fill="#fff" ${S3}/>
    <rect x="-25" y="-90" width="50" height="30" rx="8" fill="#7b8794" ${S3}/>
    <path d="M-24 -126 Q-38 -112 -40 -92" fill="none" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M-24 -126 Q-38 -112 -40 -92" fill="none" stroke="#4a7bd0" stroke-width="12" stroke-linecap="round"/>
    <path d="M24 -126 Q38 -112 40 -92" fill="none" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M24 -126 Q38 -112 40 -92" fill="none" stroke="#4a7bd0" stroke-width="12" stroke-linecap="round"/>
    <rect x="-27" y="-140" width="54" height="56" rx="14" fill="#4a7bd0" ${S3}/>
    <g id="kit-trousers" opacity="0"><path d="M-26 -92 H26 L24 -16 H4 L0 -54 L-4 -16 H-24 Z" fill="${NAVY}" ${S3}/><rect x="-25" y="-40" width="21" height="7" fill="${VIS}"/><rect x="4" y="-40" width="21" height="7" fill="${VIS}"/></g>
    <g id="kit-boots" opacity="0"><path d="M-24 -30 H-4 V0 H-30 V-8 Q-30 -12 -24 -14 Z" fill="${NAVY}" ${S3}/><rect x="-24" y="-24" width="20" height="5" fill="${VIS}"/>
      <path d="M4 -30 H24 V-14 Q30 -12 30 -8 V0 H4 Z" fill="${NAVY}" ${S3}/><rect x="4" y="-24" width="20" height="5" fill="${VIS}"/></g>
    <g id="kit-jacket" opacity="0">
      <path d="M-25 -126 Q-42 -110 -42 -88" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M-25 -126 Q-42 -110 -42 -88" fill="none" stroke="${NAVY}" stroke-width="16" stroke-linecap="round"/>
      <path d="M25 -126 Q42 -110 42 -88" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M25 -126 Q42 -110 42 -88" fill="none" stroke="${NAVY}" stroke-width="16" stroke-linecap="round"/>
      <rect x="-30" y="-142" width="60" height="70" rx="14" fill="${NAVY}" ${S3}/><rect x="-30" y="-104" width="60" height="8" fill="${VIS}"/><path d="M0 -140 V-72" stroke="${OL}" stroke-width="3"/>
      <path d="M-49 -102 L-35 -100" stroke="${VIS}" stroke-width="6"/><path d="M49 -102 L35 -100" stroke="${VIS}" stroke-width="6"/></g>
    <circle cx="-41" cy="-84" r="9" fill="${SKIN}" ${S3}/><circle cx="41" cy="-84" r="9" fill="${SKIN}" ${S3}/>
    <circle cx="0" cy="-162" r="23" fill="${SKIN}" ${S3}/>
    <path d="M-23 -166 Q-24 -190 0 -190 Q24 -190 23 -166 Q12 -176 0 -174 Q-12 -176 -23 -166 Z" fill="#2a2f45" ${S3}/>
    <circle cx="-8" cy="-162" r="3" fill="${OL}"/><circle cx="8" cy="-162" r="3" fill="${OL}"/>
    <path d="M-8 -151 Q0 -145 8 -151" fill="none" stroke="${OL}" stroke-width="3"/>
    <g id="kit-helmet" opacity="0"><path d="M-30 -164 Q-30 -198 0 -198 Q30 -198 30 -164 Z" fill="${VIS}" ${S3}/><path d="M-34 -164 H34" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M0 -198 V-166" stroke="#e0a800" stroke-width="5"/></g>`;

  const peg = (x, y) => `<rect x="${x - 6}" y="${y - 96}" width="12" height="26" rx="4" fill="#8a5a3c" ${S3}/>`;
  const shelf = (x, y) => `<rect x="${x - 110}" y="${y + 8}" width="220" height="22" rx="6" fill="#b07a4f" ${S3}/><rect x="${x - 96}" y="${y + 30}" width="16" height="${790 - y - 30}" fill="#8a5a3c" ${S3}/><rect x="${x + 80}" y="${y + 30}" width="16" height="${790 - y - 30}" fill="#8a5a3c" ${S3}/>`;

  const dressSvg = spots => `
    <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The fire station changing room">
      ${Art.defs()}
      <defs><clipPath id="above-floor"><rect x="0" y="0" width="1600" height="796"/></clipPath></defs>
      <rect width="1600" height="900" fill="#f4e3c3"/>
      <rect y="0" width="1600" height="150" fill="#e8d1a8"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<g transform="translate(${470 + i * 86} 300)"><rect width="80" height="300" rx="6" fill="${i % 2 ? '#c62828' : '#e53935'}" ${S3}/><rect x="16" y="24" width="48" height="6" rx="3" fill="${OL}" opacity=".5"/><rect x="16" y="38" width="48" height="6" rx="3" fill="${OL}" opacity=".5"/><circle cx="64" cy="150" r="6" fill="#ffd21f" ${S3}/></g>`).join('')}
      <rect y="790" width="1600" height="110" fill="#8a96a8"/><rect y="786" width="1600" height="10" fill="${OL}" opacity=".35"/>
      <g id="alarm" class="flashing" transform="translate(800 220)">
        <rect x="-60" y="-30" width="120" height="16" rx="6" fill="#596178" ${S3}/>
        <circle class="beacon amber" cx="-30" cy="0" r="22" fill="#e53935" ${S3}/><circle class="beacon amber b2" cx="30" cy="0" r="22" fill="#e53935" ${S3}/>
      </g>
      ${shelf(SPOTS[0].x, 640)}${shelf(SPOTS[3].x, 640)}
      ${peg(SPOTS[1].x, SPOTS[1].y)}${peg(SPOTS[2].x, SPOTS[2].y)}
      <g id="pole" class="tappable">
        <ellipse cx="${POLE}" cy="800" rx="70" ry="16" fill="#1b2233"/>
        <rect x="${POLE - 12}" y="150" width="24" height="652" fill="#d8dee8" ${S3}/>
        <rect x="${POLE - 4}" y="150" width="6" height="652" fill="#fff" opacity=".7"/>
        <rect x="${POLE - 60}" y="150" width="120" height="652" fill="transparent"/>
      </g>
      <g clip-path="url(#above-floor)"><g id="sam" class="tappable" transform="translate(${SAM.x} ${SAM.y}) scale(${SAM.s})">${samArt()}<rect x="-60" y="-205" width="120" height="210" fill="transparent"/></g></g>
      ${KIT.map((k, i) => `<g id="item-${k.id}" class="tappable kit-item" transform="translate(${spots[i].x} ${spots[i].y}) scale(1.5)">${k.art}<rect x="-64" y="-70" width="128" height="130" fill="transparent"/></g>`).join('')}
    </svg>`;

  A.screens.dress = (arg, alive) => {
    A.ui({ home: true });
    const spots = shuffle(SPOTS);
    scene().innerHTML = dressSvg(spots);
    const svg = scene().querySelector('svg');
    const el = id => svg.querySelector('#' + id);
    let next = 0, busy = false, done = false;

    const hintNext = () => {
      if (next < KIT.length) A.Hint.set([el('item-' + KIT[next].id)], null);
      else A.Hint.set([el('pole')], 'dress.pole', true);
    };

    KIT.forEach((k, i) => {
      const node = el('item-' + k.id);
      node.addEventListener('click', async () => {
        if (busy || done || node.dataset.used) return;
        if (i !== next) { Sfx.boing(); A.say('dress.wrong', { item: KIT[next].name }); return; }
        busy = true; node.dataset.used = '1';
        Sfx.whoosh();
        const m = node.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)\)/);
        const x0 = +m[1], y0 = +m[2];
        const tx = SAM.x, ty = SAM.y - [10, 90, 220, 330][i];
        await A.tween(450, p => node.setAttribute('transform', `translate(${x0 + (tx - x0) * p} ${y0 + (ty - y0) * p - Math.sin(p * Math.PI) * 120}) scale(${1.5 - p})`));
        if (!alive()) return;
        node.setAttribute('opacity', 0);
        el('kit-' + k.id).setAttribute('opacity', 1);
        Sfx.pop();
        next++; busy = false;
        if (next < KIT.length) A.say('dress.next', { item: KIT[next].name });
        else { Sfx.chime(); A.say('dress.pole'); }
        hintNext();
      });
    });

    el('sam').addEventListener('click', () => {
      if (busy || done) return;
      Sfx.tap();
      if (next < KIT.length) A.say('dress.next', { item: KIT[next].name }); else A.say('dress.pole');
    });

    el('pole').addEventListener('click', async () => {
      if (busy || done) return;
      if (next < KIT.length) { Sfx.boing(); A.say('dress.wrong', { item: KIT[next].name }); return; }
      busy = true; done = true; A.Hint.clear();
      const sam = el('sam');
      await A.tween(500, p => sam.setAttribute('transform', `translate(${SAM.x + (POLE - 50 - SAM.x) * p} ${SAM.y - Math.sin(p * Math.PI) * 60}) scale(${SAM.s})`));
      if (!alive()) return;
      Sfx.whoosh();
      await A.tween(700, p => sam.setAttribute('transform', `translate(${POLE - 50} ${SAM.y + p * 420}) scale(${SAM.s})`), p => p * p);
      if (!alive()) return;
      Sfx.siren(); el('alarm').classList.remove('flashing');
      A.say('dress.done');
      A.gameDone('dress');
    });

    Sfx.ring();
    A.say('dress.intro');
    hintNext();
  };

  // =====================================================================
  // Call 999: dial nine nine nine, then choose the right service for the picture
  // =====================================================================
  const SERVICES = { fire: 'fire engine', ambulance: 'ambulance', police: 'police car' };
  const SCENES = {
    fire: () => `<svg viewBox="0 0 400 300" aria-label="A house on fire">
        <rect width="400" height="300" fill="#bfe6ff"/><rect y="250" width="400" height="50" fill="#7cc46a"/>
        <path d="M110 140 L200 70 L290 140 Z" fill="#c62828" ${S}/><rect x="125" y="138" width="150" height="114" fill="#f4e3c3" ${S}/>
        <rect x="150" y="160" width="40" height="36" fill="#ffd27a" ${S3}/><rect x="212" y="160" width="40" height="36" fill="#ffd27a" ${S3}/><rect x="186" y="206" width="30" height="46" fill="#8a5a3c" ${S3}/>
        <g transform="translate(-660 -366) scale(.85)">${Art.flame(1000, 560, .55, 'cf1')}${Art.flame(1060, 560, .55, 'cf2')}</g>
        <g fill="#9aa3b2" opacity=".8"><circle cx="245" cy="40" r="20"/><circle cx="270" cy="24" r="16"/><circle cx="222" cy="30" r="14"/></g></svg>`,
    ambulance: () => `<svg viewBox="0 0 400 300" aria-label="A girl has hurt her knee">
        <rect width="400" height="300" fill="#bfe6ff"/><rect y="230" width="400" height="70" fill="#7cc46a"/>
        <circle cx="330" cy="60" r="28" fill="#ffd21f"/>
        <g transform="translate(270 238) rotate(12)"><circle cx="-36" cy="0" r="22" fill="none" stroke="${OL}" stroke-width="6"/><circle cx="36" cy="0" r="22" fill="none" stroke="${OL}" stroke-width="6"/><path d="M-36 0 L-6 -28 H24 L36 0 M-6 -28 L4 0" fill="none" stroke="#e53935" stroke-width="6"/></g>
        <g transform="translate(150 250) scale(1.25)">${Kit.sitter({ id: 'cs', top: '#e86aa6', legs: '#1e5bd6', skin: '#8d5524', helmet: '#2e9e4f' })}</g></svg>`,
    police: () => `<svg viewBox="0 0 400 300" aria-label="A little boy is lost">
        <rect width="400" height="300" fill="#bfe6ff"/><rect y="230" width="400" height="70" fill="#7cc46a"/>
        ${[40, 110, 300, 360].map((x, i) => `<g transform="translate(${x} 240) scale(.5)" opacity=".55">${Kit.person({ id: 'cp' + i, suit: ['#8e5bd6', '#1e5bd6', '#2e9e4f', '#e86aa6'][i], band: ['#8e5bd6', '#1e5bd6', '#2e9e4f', '#e86aa6'][i], hat: 'hair', hair: '#2a2f45', skin: '#f1c27d' })}</g>`).join('')}
        <g transform="translate(200 262) scale(.95)">${Kit.person({ id: 'cleo', suit: '#f07a1a', band: '#f07a1a', hat: 'hair', hair: '#c97b2a', skin: '#f1c27d' })}
          <ellipse cx="-10" cy="-136" rx="4" ry="7" fill="#5cc3ff"/><ellipse cx="12" cy="-134" rx="4" ry="7" fill="#5cc3ff"/></g>
        <g transform="translate(200 40)"><circle r="26" fill="#fff" ${S3}/><text y="13" font-family="Fredoka, sans-serif" font-weight="700" font-size="38" fill="#1e5bd6" text-anchor="middle">?</text></g></svg>`
  };

  A.screens.call = (arg, alive) => {
    A.ui({ home: true });
    const rounds = shuffle(Object.keys(SERVICES));
    let round = 0, dialled = '';
    scene().innerHTML = `
      <div class="call-game">
        <div class="handset">
          <div class="display" aria-live="polite"><span class="digits"></span></div>
          <div class="keypad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(k => `<button class="key${k === '9' ? ' nine' : ''}" data-k="${k}" aria-label="${k}">${k}</button>`).join('')}</div>
        </div>
        <div class="call-panel">
          <div class="picture"></div>
          <div class="services">${Object.keys(SERVICES).map(id => `<button class="svc" data-s="${id}" aria-label="${SERVICES[id]}">${Art.sticker(A.vehicle(id), true)}</button>`).join('')}</div>
        </div>
      </div>`;
    const root = scene().querySelector('.call-game');
    const digits = root.querySelector('.digits'), picture = root.querySelector('.picture'), svcs = root.querySelector('.services');
    const nine = root.querySelector('.key.nine');
    let mode = 'dial';

    const startRound = first => {
      mode = 'dial'; dialled = ''; digits.textContent = '';
      root.classList.remove('connected');
      picture.innerHTML = `<div class="waiting"><svg viewBox="0 0 64 64"><path d="M18 10 Q12 10 10 16 Q8 34 26 46 Q40 56 50 54 Q56 52 54 46 L50 40 Q48 36 44 38 L38 42 Q28 36 22 26 L26 20 Q28 16 24 14 Z" fill="#fff"/></svg></div>`;
      svcs.hidden = true;
      A.say(first ? 'call.intro' : 'call.again');
      A.Hint.set([nine], 'call.again', true);
    };

    root.querySelectorAll('.key').forEach(b => b.addEventListener('click', async () => {
      if (mode !== 'dial') return;
      const k = b.dataset.k;
      Sfx.beep();
      b.classList.add('pressed'); setTimeout(() => b.classList.remove('pressed'), 150);
      if (k !== '9') { Sfx.boing(); dialled = ''; digits.textContent = ''; A.say('call.again'); return; }
      dialled += '9'; digits.textContent = dialled;
      if (dialled.length < 3) return;
      mode = 'ringing'; A.Hint.clear();
      Sfx.ring();
      await A.wait(1200);
      if (!alive()) return;
      root.classList.add('connected');
      const s = rounds[round];
      picture.innerHTML = SCENES[s]();
      svcs.hidden = false;
      mode = 'choose';
      A.say('call.which');
      A.Hint.set([...svcs.querySelectorAll('.svc')], 'call.which');
    }));

    svcs.querySelectorAll('.svc').forEach(b => b.addEventListener('click', async () => {
      if (mode !== 'choose') return;
      const s = rounds[round];
      if (b.dataset.s !== s) { Sfx.boing(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); A.say('call.no'); return; }
      mode = 'done'; A.Hint.clear();
      b.classList.add('chosen');
      Sfx.chime(); Sfx.siren();
      await A.say('call.yes', { service: SERVICES[s] });
      if (!alive()) return;
      b.classList.remove('chosen');
      round++;
      if (round < rounds.length) { startRound(false); return; }
      await A.say('call.where');
      if (!alive()) return;
      A.say('call.done');
      A.gameDone('call');
    }));

    startRound(true);
  };
})();
