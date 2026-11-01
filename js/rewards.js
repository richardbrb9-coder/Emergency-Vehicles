// Rewards: the sticker book (stickers, badges, Word Book, My Pictures), team badges and the Rescue Cadet certificate.
(function () {
  const A = window.App;
  const { OL, S, S3 } = Art;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().badges) P().badges = [];

  const BADGES = [
    { id: 'fire', name: 'Fire', colour: '#e53935', icon: 'fire', needs: ['fire', 'helitack'], how: 'finish the fire engine and helitack rescues' },
    { id: 'medical', name: 'Medical', colour: '#2e9e4f', icon: 'ambulance', needs: ['ambulance', 'medical'], how: 'finish the ambulance and medical car rescues' },
    { id: 'police', name: 'Police', colour: '#1e5bd6', icon: 'police', needs: ['police'], games: ['call'], how: 'finish the police car rescue and play Call 999' },
    { id: 'sea', name: 'Sea', colour: '#0097a7', icon: 'lifeboat', needs: ['lifeboat', 'hover'], how: 'finish the lifeboat and hovercraft rescues' },
    { id: 'air', name: 'Air', colour: '#8e5bd6', icon: 'airamb', needs: ['airamb', 'helitack'], how: 'finish the air ambulance and helitack rescues' },
    { id: 'special', name: 'Special Rescue', colour: '#f07a1a', icon: 'tow', needs: ['tow'], gameCount: 5, how: 'finish the tow truck rescue and play five different games' }
  ];
  const earned = b => b.needs.every(v => P().stickers.includes(v))
    && (b.games || []).every(g => P().games.includes(g))
    && P().games.filter(g => A.game(g) && A.game(g).world === 'rescue').length >= (b.gameCount || 0);

  const badgeSvg = (b, on, cls = 'badge-svg') => `
    <svg viewBox="-60 -66 120 132" class="${cls} ${on ? 'earned' : 'locked'}">
      <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? b.colour : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
      <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
      <g opacity="${on ? 1 : 0.3}">${Art.picto(b.icon, 0, 0, 0.5)}</g>
      ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}
    </svg>`;

  const pipMini = `<svg viewBox="-60 -60 120 120" class="cert-pip"><circle r="44" fill="#fff" ${S}/><path d="M-40 -20 Q-56 10 -40 30 Q-30 0 -30 -20 Z M40 -20 Q56 10 40 30 Q30 0 30 -20 Z" fill="${OL}"/>
    <circle cx="-14" cy="-6" r="5" fill="${OL}"/><circle cx="14" cy="-6" r="5" fill="${OL}"/><ellipse cy="12" rx="10" ry="7" fill="${OL}"/><path d="M-12 24 Q0 32 12 24" fill="none" stroke="${OL}" stroke-width="4"/>
    <path d="M-34 -36 Q0 -60 34 -36 L30 -28 Q0 -46 -30 -28 Z" fill="#e53935" ${S3}/></svg>`;

  // ---------- Certificate ----------
  function certificate() {
    const name = (A.Settings.name || '').trim();
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const safe = name.replace(/[<>&"]/g, '');
    A.openModal(`
      <div class="card cert" role="dialog" aria-label="Rescue Cadet certificate">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <div class="cert-band"></div>
        <div class="cert-body">
          ${pipMini}
          <div class="cert-label">Certificate</div>
          <h2>Rescue Cadet</h2>
          <div class="cert-name">${safe || 'Super Helper'}</div>
          <p>has finished every rescue and earned all six team badges.</p>
          <div class="cert-badges">${BADGES.map(b => badgeSvg(b, true, 'badge-svg small')).join('')}</div>
          <div class="cert-date">${today} · Signed, Pip the rescue pup</div>
        </div>
        <div class="cert-band"></div>
      </div>`);
    Sfx.fanfare(); A.confetti();
    A.say('cert.ready', { name: safe || 'Super Helper' });
  }

  // ---------- New badges are presented when the child comes back to the station ----------
  function checkNew() {
    const fresh = BADGES.filter(b => earned(b) && !P().badges.includes(b.id));
    if (!fresh.length) {
      if (BADGES.every(earned) && !P().certShown) { P().certShown = true; A.saveProgress(); certificate(); }
      return;
    }
    const b = fresh[0];
    P().badges.push(b.id); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="${b.name} badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>${b.name} badge!</h2>
        <div class="sticker-big">${badgeSvg(b, true, 'badge-svg big')}</div>
      </div>`, () => A.later(checkNew, 400));
    A.say('badge.new', { badge: b.name });
  }
  const hub = A.screens.hub;
  A.screens.hub = (arg, alive) => {
    hub(arg, alive);
    A.later(() => { if (alive() && !A.isModalOpen()) checkNew(); }, 2200);
  };

  // ---------- The book ----------
  const TABS = [
    { id: 'stickers', icon: `<svg viewBox="0 0 64 64"><path d="M32 8 L39 24 L56 25 L43 36 L47 53 L32 44 L17 53 L21 36 L8 25 L25 24 Z" fill="#fff"/></svg>` },
    { id: 'badges', icon: `<svg viewBox="0 0 64 64"><path d="M32 6 L54 14 V32 Q54 50 32 58 Q10 50 10 32 V14 Z" fill="#fff"/></svg>` },
    { id: 'words', icon: `<svg viewBox="0 0 64 64"><path d="M8 14 Q20 10 32 16 Q44 10 56 14 V52 Q44 48 32 54 Q20 48 8 52 Z" fill="#fff"/><path d="M32 16 V54" stroke="#e53935" stroke-width="4"/></svg>` },
    { id: 'pictures', icon: `<svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="40" rx="6" fill="#fff"/><path d="M12 48 L26 30 L36 42 L44 34 L52 48 Z" fill="#2e9e4f"/><circle cx="44" cy="22" r="5" fill="#ffd21f"/></svg>` }
  ];

  // Each world has its own sticker page. A built world adds its page to PAGES: () => ({ html, tap(kind, id) }),
  // and any badge of its own to EXTRA: { id, name, svg(earned), earned(), how (line id) }.
  const PAGES = {}, EXTRA = [];
  let bookWorld = 'rescue';
  const worldChips = () => `<div class="world-chips">${Worlds.WORLDS.map(w => `
    <button class="world-chip${w.id === bookWorld ? ' on' : ''}${w.built ? '' : ' soon'}" data-world="${w.id}" aria-label="${w.name} stickers">
      ${Worlds.placeIcon(w.id)}<span>${w.name}</span></button>`).join('')}</div>`;

  A.screens.stickers = (tab, alive) => {
    A.ui({ home: true });
    if (typeof tab !== 'string') { // opened from the star button: show the page of the world we came from
      tab = 'stickers';
      const w = A.screenWorld[A.bookFrom()];
      bookWorld = w && PAGES[w] ? w : 'rescue';
    }
    const p = P(), C = CONTENT;
    let body = '';
    const own = PAGES[bookWorld];
    if (tab === 'stickers' && own) {
      body = worldChips() + `<div class="book-page">${own().html}</div>`;
    } else if (tab === 'stickers' && bookWorld !== 'rescue') {
      body = worldChips() + `<div class="book-page soon-page">${Array.from({ length: 10 }, () => `<span class="empty-slot">?</span>`).join('')}</div>`;
    } else if (tab === 'stickers') {
      body = worldChips() + `<div class="book-page">${C.vehicles.map(v => `
        <button data-kind="v" data-id="${v.id}" aria-label="${v.name}">${Art.sticker(v, p.stickers.includes(v.id))}<span>${p.stickers.includes(v.id) ? v.name : '?'}</span></button>`).join('')}
        ${A.worldGames('rescue').map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, p.games.includes(g.id))}<span>${p.games.includes(g.id) ? g.title : '?'}</span></button>`).join('')}</div>`;
    } else if (tab === 'badges') {
      const all = BADGES.every(earned);
      body = `<div class="book-page badges">${BADGES.map(b => `<button data-kind="b" data-id="${b.id}" aria-label="${b.name} badge">${badgeSvg(b, earned(b))}<span>${b.name}</span></button>`).join('')}
        <button class="cert-btn${all ? '' : ' locked'}" data-kind="cert" aria-label="Rescue Cadet certificate">
          <svg viewBox="0 0 120 90"><rect x="6" y="6" width="108" height="78" rx="8" fill="${all ? '#fff6cc' : '#e7ebf2'}" stroke="${all ? '#ffd21f' : '#c3cad6'}" stroke-width="6"/><path d="M24 30 H96 M24 44 H96 M36 58 H84" stroke="${all ? OL : '#c3cad6'}" stroke-width="5" stroke-linecap="round"/><circle cx="96" cy="70" r="12" fill="${all ? '#e53935' : '#c3cad6'}"/></svg>
          <span>Certificate</span></button>
        ${EXTRA.map(b => `<button data-kind="xb" data-id="${b.id}" aria-label="${b.name} badge">${b.svg(b.earned())}<span>${b.name}</span></button>`).join('')}</div>`;
    } else if (tab === 'words') {
      const keys = Object.keys(C.words);
      body = `<div class="book-page words">${keys.map(k => {
        const got = p.words.includes(k);
        return `<button data-kind="w" data-id="${k}" class="${got ? '' : 'locked'}" aria-label="${got ? C.words[k].word : 'Not found yet'}">
          <span class="wpic">${got && Art.wordPicture[k] ? Art.wordPicture[k]() : '<b>?</b>'}</span><span class="wword">${got ? C.words[k].word : '?'}</span></button>`;
      }).join('')}</div>`;
    } else {
      body = p.gallery.length
        ? `<div class="book-page pics">${p.gallery.map((g, i) => `<button data-kind="p" data-id="${i}" aria-label="Picture ${i + 1}"><span class="frame">${g.svg}</span></button>`).join('')}</div>`
        : `<div class="book-page pics empty"><p>${C.lines['book.picsNone']}</p></div>`;
    }
    scene().innerHTML = `<div class="book">
      <div class="tabs" role="tablist">${TABS.map(t => `<button role="tab" class="tab${t.id === tab ? ' on' : ''}" data-tab="${t.id}" aria-selected="${t.id === tab}" aria-label="${C.lines['book.' + t.id]}">${t.icon}<span>${C.lines['book.' + t.id]}</span></button>`).join('')}</div>
      ${body}</div>`;
    scene().querySelectorAll('.world-chip').forEach(c => c.onclick = () => {
      if (c.dataset.world === bookWorld) return;
      Sfx.tap(); bookWorld = c.dataset.world; A.screens.stickers('stickers', alive);
    });
    scene().querySelectorAll('.tab').forEach(t => t.onclick = () => { if (t.dataset.tab !== tab) { Sfx.tap(); A.screens.stickers(t.dataset.tab, alive); } });
    scene().querySelectorAll('.book-page button').forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      if (own && own().tap && own().tap(b.dataset.kind, id)) return;
      switch (b.dataset.kind) {
        case 'v': {
          const v = A.vehicle(id);
          if (p.stickers.includes(id)) { Sfx.sparkle(); A.sayText(`The ${v.name}!`); }
          else { Sfx.boing(); A.sayText(`Open door number ${v.door} to find this sticker.`); }
          break;
        }
        case 'g': {
          const g = A.game(id);
          if (p.games.includes(id)) { Sfx.sparkle(); A.sayText(`${g.title}!`); }
          else { Sfx.boing(); A.sayText(`Play ${g.title} to find this sticker.`); }
          break;
        }
        case 'b': {
          const bd = BADGES.find(x => x.id === id);
          if (earned(bd)) { Sfx.sparkle(); A.sayText(`The ${bd.name} badge!`); }
          else { Sfx.boing(); A.say('badge.locked', { how: bd.how }); }
          break;
        }
        case 'xb': {
          const xb = EXTRA.find(x => x.id === id);
          if (xb.earned()) { Sfx.sparkle(); A.sayText(`The ${xb.name} badge!`); }
          else { Sfx.boing(); A.say(xb.how); }
          break;
        }
        case 'cert':
          if (BADGES.every(earned)) certificate();
          else { Sfx.boing(); A.sayText('Earn all six badges to get your Rescue Cadet certificate!'); }
          break;
        case 'w':
          if (p.words.includes(id)) { Sfx.sparkle(); A.wordCard(id); }
          else { Sfx.boing(); A.sayText('You have not found this red word yet.'); }
          break;
        case 'p':
          Sfx.sparkle();
          A.openModal(`<div class="card picture-card" role="dialog" aria-label="My picture"><button class="close" aria-label="Close">${A.ICON.close}</button><div class="frame big">${p.gallery[+id].svg}</div></div>`);
          break;
      }
    });
    if (tab === 'stickers' && own) {
      A.say('book.world.' + bookWorld);
    } else if (tab === 'stickers' && bookWorld !== 'rescue') {
      A.Pip.mood('thinking');
      A.say('book.worldSoon', { name: Worlds.world(bookWorld).of });
    } else if (tab === 'stickers') {
      const n = p.stickers.length + p.games.length;
      if (n) A.say('stickers.count', { n, stickers: n === 1 ? 'sticker' : 'stickers' }); else A.say('stickers.none');
    } else if (tab === 'badges') A.say('book.badgesIntro');
    else if (tab === 'words') A.say(p.words.length ? 'book.wordsIntro' : 'book.wordsNone');
    else if (!p.gallery.length) A.say('book.picsNone');
  };

  window.Rewards = { BADGES, earned, badgeSvg, certificate, pages: PAGES, extraBadges: EXTRA };
})();
