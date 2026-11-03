// Pip's Days Out: the Museum. Pip and Mum visit the museum, where Professor Fen has lost a dinosaur bone. Words,
// pictures, levels and the museum home screen, plus one game of its own (Dino Dig). The story, Fossil Run, Museum
// Train and Long Ago or Now? come from the shared engines (Story, BallRun, WordTrain, Sorter).

// ---------- Fossil Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Book Run puzzles in a new order within each group, each checked solvable again by running its physics with
  // the hint pieces in place. decoy: the dinosaur nest.
  const b = p => Object.assign({ balls: 6 }, p);
  BR.packs.museum = {
    id: 'museum',
    free: { hose: 1, goal: 11, balls: 8 },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      b({ hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      b({ hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      b({ hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      b({ hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      // 5 to 8: two pieces
      b({ hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      b({ hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      b({ hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      // 9 to 12: a see-saw or a bucket
      b({ hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      b({ hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      b({ hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] }),
      b({ hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] })
    ]
  };
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const MA = window.MuseumArt, LA = window.LibArt, PA = window.PupArt;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().museum) P().museum = [];
  const shuffle = Sorter.shuffle;
  // The six things to visit in the museum; visiting each one earns its sticker.
  const SPOT_IDS = ['dino', 'fossils', 'toys', 'knight', 'space', 'painting'];
  const SOUND = { dino: 'roar', fossils: 'chime', toys: 'tune', knight: 'clank', space: 'whoosh', painting: 'sparkle' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'mus.welcome': "Welcome to the museum! It's full of amazing things from long ago. Tap things to find out about them, or pick a game at the bottom.",
    'mus.back':    'What shall we look at in the museum now?',
    'mus.hint':    'Tap something in the museum!',
    'mus.egg':     "A dinosaur egg! Don't worry, it won't hatch. It turned into stone millions of years ago.",
    'mus.fact.dino':     'This is a dinosaur skeleton. Dinosaurs lived a long, long time ago, before there were any people. This one used its long neck to eat leaves from the tops of trees.',
    'mus.fact.fossils':  'Fossils! When plants and animals from long ago were buried in mud, they slowly turned into stone. This curly one is an ammonite.',
    'mus.fact.toys':     'Old toys! Long ago, before computers and tablets, children played with spinning tops, wooden dolls and rocking horses.',
    'mus.fact.knight':   'A knight\'s armour! Long ago, knights wore heavy metal suits to keep them safe. Clank, clank!',
    'mus.fact.space':    'The space gallery! A rocket can fly all the way into space. Astronauts have even walked on the moon.',
    'mus.fact.painting': "A painting of sunflowers, in a big gold frame. Look with your eyes, and don't touch, so it stays beautiful.",
    'mus.badge':     'You earned the Little Explorer badge! What a brilliant explorer!',
    'mus.badge.how': 'Visit everything in the museum, and play every museum game, to earn the Little Explorer badge.',
    'book.world.museum': 'Your museum stickers! Explore the museum, and play the games to fill this page.',

    'games.musStory':  'The Bone Hunt',
    'games.fossilrun': 'Fossil Run',
    'games.mustrain':  'Museum Train',
    'games.dig':       'Dino Dig',
    'games.ago':       'Long Ago or Now?',

    // The story
    'mus.story.1': 'Pip and Mum visit the museum. Professor Fen looks after it. Oh dear, says Professor Fen. One of the dinosaur\'s leg bones is missing!',
    'mus.story.2': 'Pip spots some little paw prints, and follows them to the fossils. Fossils are plants and animals from long, long ago, turned into stone.',
    'mus.story.3': 'The paw prints go past the old toys. Long ago, children played with spinning tops, wooden dolls and rocking horses.',
    'mus.story.4': 'Next, a knight\'s shiny armour! In the museum, we look with our eyes, and keep our paws to ourselves.',
    'mus.story.5': 'Up to the space gallery! A rocket, and the planets. The paw prints keep going. Where do they lead?',
    'mus.story.6': 'Past a beautiful painting of sunflowers. Pip looks very closely. The paw prints go into the gift shop!',
    'mus.story.7': 'And there is Bramble the puppy, holding the dinosaur bone! Bramble hid in Mum\'s bag, all the way to the museum.',
    'mus.story.8': 'The bone goes back on the dinosaur. Thank you, Pip, says Professor Fen. You are a real little explorer!',
    'mus.story.end': 'The end! I love the museum.',

    // Fossil Run (ball run)
    'fossilrun.pick':    'Fossil Run! Build your own, or try one of my puzzles.',
    'fossilrun.free':    'Drag pieces onto the board. Then blow my whistle to send the fossils down!',
    'fossilrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'fossilrun.go':      'Here come the fossils!',
    'fossilrun.flip':    'Tap a piece to turn it around.',
    'fossilrun.n1':      'One!',
    'fossilrun.n2':      'Two!',
    'fossilrun.n3':      'Three!',
    'fossilrun.again':   'Oops! The fossils missed the tray. Move the pieces and try again.',
    'fossilrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'fossilrun.allDone': 'You solved all my puzzles! Professor Fen has a whole tray of fossils for the museum!',
    'fossilrun.freeOut': 'Clack, clack! Fossils in the tray! What else can you build?',
    'fossilrun.bolted':  'That piece is bolted on. Build around it!',
    'fossilrun.cleared': "All clear! Let's build something new.",
    'fossilrun.no':      'Oops! That fossil landed in the dinosaur nest. Careful of the eggs! Roll the fossils into the tray.',
    'fossilrun.want':    'Help three fossils roll into the explorer\'s tray!',
    'fossilrun.won.0':   'Three fossils in the tray! Hooray!',
    'fossilrun.won.1':   'What a find! Three amazing fossils.',
    'fossilrun.won.2':   'Well done! These fossils can go in the museum.',
    'fossilrun.p.ramp':   'A ramp! The fossils roll down a slope.',
    'fossilrun.p.long':   'A long ramp. The fossils roll a long way down it.',
    'fossilrun.p.curve':  'A curve. It turns falling fossils to the side.',
    'fossilrun.p.funnel': 'A funnel. It catches the fossils and drops them through the middle.',
    'fossilrun.p.spring': 'A spring! Boing! It bounces the fossils up into the air.',
    'fossilrun.p.fan':    'A fan. Whoosh! It blows the fossils sideways.',
    'fossilrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'fossilrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Museum Train
    'mustrain.pick': 'All aboard the Museum Train! Museum words are made of beats too. Pick a game.',
    'mustrain.done': 'Toot toot! You are a museum beat star!',

    // Dino Dig
    'dig.intro':   'Dino Dig! Some of the dinosaur\'s bones are buried in the sand. Brush the sand away with your finger to find them.',
    'dig.brush':   'Brush the sand away with your finger.',
    'dig.drag':    'Now drag the bone onto the dinosaur, where it fits.',
    'dig.fit.0':   'It fits!',
    'dig.fit.1':   'Perfect!',
    'dig.fit.2':   'Just the right place!',
    'dig.wrong':   "Hmm, that bone doesn't fit there. Look at the shapes, and try another place.",
    'dig.allDone': 'You built the whole dinosaur! Roar! Professor Fen says thank you, little explorer.',

    // Long Ago or Now?
    'ago.intro':    'Long ago, or now? Long, long ago, before Grandad was born, things were very different. Put each thing in long ago, or in now.',
    'ago.no':       'Hmm. Is that from long ago, or do we use it now?',
    'ago.done':     'Brilliant! You know what things were like long ago.',
    'ago.bin.ago':  'Long ago!',
    'ago.bin.now':  'Now!'
  });
  MA.PART_IDS.forEach(id => { L['dig.found.' + id] = `You found the ${MA.DINO[id].name}!`; });

  // Long Ago or Now?: what each thing is, and why it belongs there.
  const THINGS = {
    candle:    { now: false, name: 'A candle.',          yes: 'Long ago! Before electric lights, people used candles to see in the dark.' },
    cart:      { now: false, name: 'A horse and cart.',  yes: 'Long ago! People travelled in carts pulled by horses, before there were cars.' },
    oldPhone:  { now: false, name: 'An old telephone.',  yes: 'Long ago! This old telephone had a wire, and you turned the dial to call someone.' },
    washboard: { now: false, name: 'A washboard.',       yes: 'Long ago! People scrubbed their clothes on a washboard, in a tub of water.' },
    quill:     { now: false, name: 'A quill pen.',       yes: 'Long ago! People wrote with a feather pen called a quill, dipped in ink.' },
    oldCamera: { now: false, name: 'An old camera.',     yes: 'Long ago! Old cameras were big and wooden, and you had to keep very still.' },
    bulb:      { now: true,  name: 'A light bulb.',      yes: 'Now! We flick a switch, and the light bulb lights up the room.' },
    car:       { now: true,  name: 'A car.',             yes: 'Now! Cars take us places much faster than a horse and cart.' },
    tablet:    { now: true,  name: 'A tablet.',          yes: 'Now! A tablet can show us pictures, games and stories.' },
    washer:    { now: true,  name: 'A washing machine.', yes: 'Now! The washing machine washes our clothes for us.' },
    pencil:    { now: true,  name: 'A pencil.',          yes: 'Now! We write and draw with pencils and paper.' },
    mobile:    { now: true,  name: 'A mobile phone.',    yes: 'Now! A mobile phone has no wire. You can carry it in your pocket.' }
  };
  Object.entries(THINGS).forEach(([id, t]) => { L['ago.name.' + id] = t.name; L['ago.yes.' + id] = t.yes; });
  SPOT_IDS.forEach(id => {
    const n = MA.SPOTS[id].name;
    L['mus.sticker.' + id] = `You earned the ${n.toLowerCase()} sticker!`;
    L['mus.name.' + id] = n + '!';
    L['mus.find.' + id] = id === 'space' ? 'Tap the space gallery to find this sticker.' : id === 'knight' ? "Tap the knight's armour to find this sticker." : `Tap the ${n.toLowerCase()} to find this sticker.`;
  });

  // Pip wears his explorer's hat and magnifying glass on every museum screen.
  ['museumhall', 'musStory', 'fossilrun', 'mustrain', 'dig', 'ago'].forEach(s => { A.screenWorld[s] = 'museum'; });
  const COMMON = { world: 'museum', back: 'museumhall' };

  // =====================================================================
  // The Bone Hunt: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const page = inner => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <defs><clipPath id="mus-pg"><rect width="1200" height="660" rx="30"/></clipPath></defs><g clip-path="url(#mus-pg)">${inner}</g></svg>`;
  const say = (x, y, t, c = '#8a5a24', size = 64) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const pip = (x, y, w) => MA.pipAt(x, y, w);
  const mum = () => window.SchoolArt.pipMum;
  const bramble = o => PA.puppy(3, Object.assign({ tongue: true }, o));
  const hall = (floorY = 520) => MA.hall(1200, 660, floorY);
  // A trail of little paw prints from x0 to x1 along the floor at y.
  const prints = (x0, x1, y, n = 6) => Array.from({ length: n }, (_, i) => LA.pawPrint(x0 + (x1 - x0) * i / (n - 1), y + (i % 2 ? 14 : 0), .55, '#8a6a4a')).join('');
  // The skeleton with one leg bone missing (page 1), or whole again (page 8).
  const skeletonMissing = `<g>${MA.skeleton(false).replace(MA.part('front'), '')}</g>`;
  const legBone = `<g transform="rotate(70)">${MA.bone(-40, 0, 40, 0, 18)}</g>`;
  const PAGES = [
    // 1. A bone is missing
    () => page(`${hall()}${tap('roar', at(640, 560, .8, skeletonMissing))}
      ${tap('pop', at(1040, 600, 1, MA.fen(true)))}${tap('woof', at(180, 640, .95, mum()))}${pip(260, 330, 210)}
      ${prints(560, 1150, 610, 7)}${say(640, 120, 'Oh dear!', '#e53935', 70)}`),
    // 2. The fossils
    () => page(`${hall()}${tap('chime', at(700, 520, 1.5, MA.fossilCase(false)))}
      ${pip(140, 340, 220)}${prints(80, 1150, 600, 9)}`),
    // 3. The old toys
    () => page(`${hall()}${tap('tune', at(620, 520, 1.45, MA.toysCase(true)))}
      ${pip(950, 330, 220)}${prints(80, 1150, 600, 9)}`),
    // 4. The knight's armour
    () => page(`${hall()}${tap('clank', at(760, 600, 1.15, MA.knight(false)))}
      ${pip(220, 330, 220)}${tap('woof', at(470, 640, .95, mum()))}${prints(860, 1150, 610, 4)}
      ${say(320, 130, 'Look with your eyes!', '#1e5bd6', 52)}`),
    // 5. The space gallery
    () => page(`${hall()}${tap('whoosh', at(620, 520, 1.45, MA.space(true)))}
      ${pip(130, 330, 220)}${prints(820, 1150, 600, 4)}`),
    // 6. The painting
    () => page(`${hall()}${tap('sparkle', at(560, 600, 1.4, MA.painting(false)))}
      ${pip(920, 330, 210)}${prints(100, 1150, 620, 9)}
      <g transform="translate(1090 290)"><rect x="-80" y="-60" width="160" height="50" rx="8" fill="#e53935" ${S}/>${MA.txt(0, -26, 26, '#fff', 'GIFT SHOP')}</g>`),
    // 7. Bramble in the gift shop, with the bone
    () => page(`${hall()}<g transform="translate(600 300)"><rect x="-520" y="-60" width="1040" height="34" rx="6" fill="#e53935" ${S}/>${MA.txt(0, -34, 28, '#fff', 'GIFT SHOP')}</g>
      <g transform="translate(300 520)">${LA.bookshelf(380, 2, 90, 2)}</g>
      ${at(900, 520, .9, `<rect x="-200" y="-150" width="400" height="150" fill="#c98b4e" stroke="${OL}" stroke-width="5"/>${[-120, 0, 120].map((x, i) => `<g transform="translate(${x} -150) scale(.36)">${[MA.ITEMS.mammoth, MA.ITEMS.pterodactyl, MA.ITEMS.astronaut][i]}</g>`).join('')}`)}
      ${tap('yip', at(640, 620, 1.4, bramble()))}${tap('pop', at(700, 560, 1.1, legBone))}
      ${pip(140, 350, 220)}${tap('woof', at(1080, 650, .95, mum()))}${say(640, 160, 'Bramble!', '#f07a1a', 76)}`),
    // 8. The bone goes back
    () => page(`${hall()}${tap('roar', at(640, 560, .8, MA.skeleton(true)))}
      ${tap('pop', at(1060, 610, 1, MA.fen(true)))}${tap('woof', at(160, 640, .95, mum()))}${tap('yip', at(300, 630, 1, bramble()))}${pip(820, 350, 200)}
      ${say(640, 110, 'Thank you, Pip!', '#2e9e4f', 64)}`)
  ];
  Story.mount(Object.assign({ screen: 'musStory', colour: '#8a5a24', cls: 'mus-story', lines: { end: 'mus.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(30 30) scale(.5)">${legBone}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'mus.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Fossil Run: fossils roll off the rock ledge into the explorer's tray (not into the dinosaur nest)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#ffd21f" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-28 -46) scale(.5)">${MA.ammonite()}</g><g transform="translate(10 -20) scale(.5)">${MA.ammonite('#c9a878')}</g>
    <g transform="translate(0 58) scale(.5)">${MA.tray(2)}</g></svg>`;
  const runTheme = {
    board(ctx) { // a dig site: sandy rock layers, darker towards the bottom
      ctx.fillStyle = '#f6ead0'; ctx.fillRect(0, 0, W, H);
      [['#efdcb8', 200], ['#e6cfa4', 360], ['#dcc092', 520], ['#d2b282', 680]].forEach(([c, y]) => {
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 100) ctx.lineTo(x, y + Math.sin(x / 140) * 14);
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      });
      ctx.fillStyle = '#b8995e'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // a rock ledge at the top, with fossils waiting on it
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      [0, 1, 2].forEach(i => drawImg(ctx, MA.fossilImage(i), x - 22 + i * 22, 14, 26, 26));
      poly(ctx, [{ x: x - 48, y: 24 }, { x: x + 48, y: 24 }, { x: x + 34, y: 54 }, { x: x - 34, y: 54 }], '#a8946e');
      poly(ctx, [{ x: x - 14, y: 54 }, { x: x + 14, y: 54 }, { x: x + 10, y: 64 }, { x: x - 10, y: 64 }], '#7a6a4e');
      line(ctx, x - 34, 34, x + 34, 34, '#cbb994', 4);
      if (dripping) line(ctx, x - 9, 58, x + 9, 58, '#ffd21f', 4);
    },
    ball(ctx, b) { drawImg(ctx, MA.fossilImage(b.idx), b.position.x, b.position.y, 2 * R + 8, 2 * R + 8, b.angle); },
    goal(ctx, st) {
      const { level, fx, won, now, hits } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 4 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 6 : 0;
      drawImg(ctx, MA.trayImage(Math.min(hits, 3), won), x, H - 52 + bob + jump, 200, 104);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 6 : 0);
      drawImg(ctx, MA.nestImage(fx.shake > 0), x, H - 80, 160, 164);
    },
    splash: '#c9a878',
    release() { Sfx.pop(); },
    hit(ev, fx) { Sfx.clank(2); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ffd21f', 1.2); },
    win(fx) { fx.chew = 0; Sfx.chime(); },
    tapGoal() { Sfx.clank(2); },
    tapDecoy() { Sfx.crack(); },
    refuse: () => 'fossilrun.no',
    intro: () => 'fossilrun.want',
    winLine: () => 'fossilrun.won.' + Math.floor(Math.random() * 3)
  };
  BR.mount(Object.assign({ screen: 'fossilrun', lines: 'fossilrun', colour: '#f07a1a', icon: RUN_ICON, pack: BR.packs.museum, theme: runTheme, cls: 'mus-run' }, COMMON));

  // =====================================================================
  // Museum Train: museum words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (short "ih", "cull", "row", "purr").
  // alone / carrier / ipa: see the Rescue Station words in js/train.js and the puppy words in js/puppies.js.
  WordTrain.packs.museum = {
    id: 'museum',
    words: [
      { id: 'fossil',      word: 'fossil',      beats: ['fos', 'sil'],                say: ['foss', 'sull'],                pic: 'fossil' },
      { id: 'statue',      word: 'statue',      beats: ['stat', 'ue'],                say: ['stat', 'chew'],                pic: 'statue' },
      { id: 'painting',    word: 'painting',    beats: ['paint', 'ing'],              say: ['paint', 'ting'],               pic: 'painting' },
      { id: 'treasure',    word: 'treasure',    beats: ['trea', 'sure'],              say: ['trezh', 'zhuh'],               pic: 'treasure', alone: [1], ipa: { 1: 'ʒə' } },
      { id: 'armour',      word: 'armour',      beats: ['ar', 'mour'],                say: ['ar', 'mur'],                   pic: 'armour' },
      { id: 'mammoth',     word: 'mammoth',     beats: ['mam', 'moth'],               say: ['mam', 'muth'],                 pic: 'mammoth' },
      { id: 'castle',      word: 'castle',      beats: ['cas', 'tle'],                say: ['car', 'sull'],                 pic: 'castle' },
      { id: 'skeleton',    word: 'skeleton',    beats: ['skel', 'e', 'ton'],          say: ['skell', 'ih', 'tun'],          pic: 'skeleton', alone: [1], carrier: { 1: 'it' } },
      { id: 'telescope',   word: 'telescope',   beats: ['tel', 'e', 'scope'],         say: ['tell', 'ih', 'scope'],         pic: 'telescope', alone: [1], carrier: { 1: 'it' } },
      { id: 'volcano',     word: 'volcano',     beats: ['vol', 'ca', 'no'],           say: ['voll', 'kay', 'no'],           pic: 'volcano' },
      { id: 'astronaut',   word: 'astronaut',   beats: ['as', 'tro', 'naut'],         say: ['ass', 'truh', 'nort'],         pic: 'astronaut' },
      { id: 'pterodactyl', word: 'pterodactyl', beats: ['pter', 'o', 'dac', 'tyl'],   say: ['terr', 'ruh', 'dack', 'till'], pic: 'pterodactyl' }
    ]
  };
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 92) scale(.5)">${MA.ITEMS.mammoth}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'mustrain', pack: WordTrain.packs.museum, colour: '#1e5bd6', tile: TRAIN_TILE, picture: w => MA.itemSvg(w.pic), cls: 'mus-train',
    lines: { pick: 'mustrain.pick', done: 'mustrain.done' } }, COMMON));

  // =====================================================================
  // Long Ago or Now?: drag each thing to long ago, or to now (the sorting engine)
  // =====================================================================
  const AGO_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-24 -4) scale(.5)">${MA.AGO.candle}</g><g transform="translate(26 -4) scale(.5)">${MA.NOW.bulb}</g>
    <path d="M-8 40 H8 M2 34 L8 40 L2 46" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const AGO_IDS = Object.keys(THINGS).filter(id => !THINGS[id].now), NOW_IDS = Object.keys(THINGS).filter(id => THINGS[id].now);
  Sorter.mount(Object.assign({
    screen: 'ago', colour: '#8e5bd6', tile: AGO_TILE, cls: 'mus-ago',
    lines: { intro: 'ago.intro', no: 'ago.no', done: 'ago.done' },
    round(level) {
      const n = [2, 3, 4][level];
      const ids = shuffle(AGO_IDS).slice(0, n).concat(shuffle(NOW_IDS).slice(0, n));
      return {
        bins: [{ id: 'ago', art: MA.AGO_BIN, name: 'ago.bin.ago', label: 'Long ago', cls: 'bin-ago' }, { id: 'now', art: MA.NOW_BIN, name: 'ago.bin.now', label: 'Now', cls: 'bin-now' }],
        items: ids.map(id => ({ id, bin: THINGS[id].now ? 'now' : 'ago', line: 'ago.yes.' + id, name: 'ago.name.' + id, label: THINGS[id].name.replace(/\.$/, ''), art: MA.agoSvg(id) }))
      };
    },
    onRight() { Sfx.chime(); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Dino Dig: brush the sand away to find the bones, then drag each bone onto the dinosaur
  // =====================================================================
  const DIG_TILE = `<svg viewBox="-60 -60 120 120"><rect x="-54" y="-20" width="108" height="70" rx="10" fill="#f2d79a" ${S3}/>
    <g transform="translate(-6 18) rotate(-20) scale(.8)">${MA.bone(-30, 0, 30, 0, 14)}</g>
    <g transform="translate(30 -24) rotate(30)"><rect x="-6" y="-40" width="12" height="40" rx="4" fill="#8b5a2b" ${S3}/><path d="M-16 0 H16 L12 22 H-12 Z" fill="#ffd21f" ${S3}/></g></svg>`;
  A.addGame('dig', '#c98b4e', DIG_TILE, COMMON);
  const PIT_W = 700, PIT_H = 520;
  const SPOTS_IN_PIT = [[150, 130], [420, 120], [590, 230], [170, 360], [420, 330], [600, 420]];
  const SIZE = { head: 1.05, neck: .85, body: .75, tail: .75, front: .85, back: .85 }; // how big each bone is in the pit
  A.screens.dig = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('dig'), n = [3, 4, 5][level];
    const hidden = shuffle(MA.PART_IDS).slice(0, n);
    const where = shuffle(SPOTS_IN_PIT);
    const pos = {}; hidden.forEach((id, i) => { pos[id] = where[i]; });
    const pitBone = id => `<g class="dig-bone" data-id="${id}" transform="translate(${pos[id][0]} ${pos[id][1]}) scale(${SIZE[id]})">${MA.DINO[id].art('#f4ead2')}</g>`;
    scene().innerHTML = `<div class="dig">
      <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${MA.hall(1600, 900, 640)}</svg>
      <div class="dig-pit"><svg class="dig-under" viewBox="0 0 ${PIT_W} ${PIT_H}"><rect width="${PIT_W}" height="${PIT_H}" fill="#e3c588"/>
          ${[[90, 260], [330, 470], [560, 90], [640, 300]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="10" fill="#c9a86a"/>`).join('')}${hidden.map(pitBone).join('')}</svg>
        <canvas class="dig-sand"></canvas></div>
      <div class="dig-board"><svg viewBox="-340 -430 740 460">
        <rect x="-340" y="-430" width="740" height="460" rx="30" fill="#fff" opacity=".55"/>
        ${MA.PART_IDS.map(id => hidden.includes(id) ? `<g class="dig-slot" data-id="${id}">${MA.ghost(id)}</g>` : MA.part(id)).join('')}
        <rect x="-300" y="-6" width="620" height="16" rx="5" fill="#d9d2c3" ${S3}/></svg></div></div>`;
    const root = scene().querySelector('.dig'), pit = root.querySelector('.dig-pit'), canvas = root.querySelector('.dig-sand'), under = root.querySelector('.dig-under');
    const board = root.querySelector('.dig-board svg');
    // The sand: a canvas over the bones, brushed away with a finger.
    const r = pit.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const ctx = canvas.getContext('2d'), k = canvas.width / PIT_W;
    ctx.fillStyle = '#f2d79a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 500; i++) { ctx.fillStyle = ['#e8c97f', '#f7e3b5', '#dcbb74'][i % 3]; ctx.beginPath(); ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, (2 + Math.random() * 4) * k, 0, 7); ctx.fill(); }
    const found = new Set(), placed = new Set();
    let busy = false, talking = Promise.resolve(), lastBrush = 0, lastCheck = 0;
    const queue = fn => { talking = talking.then(fn); return talking; };
    // How much of a bone's box is clear of sand (0 to 1).
    const boxOf = id => { const b = under.querySelector(`.dig-bone[data-id="${id}"]`).getBBox(), s = SIZE[id], [x, y] = pos[id];
      return [x + b.x * s, y + b.y * s, b.width * s, b.height * s]; };
    const clear = id => {
      const [x, y, w, h] = boxOf(id), px = Math.max(0, Math.round(x * k)), py = Math.max(0, Math.round(y * k));
      const pw = Math.max(1, Math.min(canvas.width - px, Math.round(w * k))), ph = Math.max(1, Math.min(canvas.height - py, Math.round(h * k)));
      const d = ctx.getImageData(px, py, pw, ph).data; let c = 0, t = 0;
      for (let i = 3; i < d.length; i += 4 * 9) { t++; if (d[i] < 40) c++; }
      return t ? c / t : 0;
    };
    const checkFound = () => hidden.forEach(id => {
      if (found.has(id) || clear(id) < .5) return;
      found.add(id); Sfx.sparkle(); A.Hint.clear();
      const el = under.querySelector(`.dig-bone[data-id="${id}"]`); el.classList.add('found');
      // Clear the rest of the sand off it, so the whole bone shows.
      const [x, y, w, h] = boxOf(id); ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillRect((x - 6) * k, (y - 6) * k, (w + 12) * k, (h + 12) * k); ctx.restore();
      queue(async () => { if (!alive()) return; await A.say('dig.found.' + id); if (alive() && found.size === 1) await A.say('dig.drag'); });
    });
    const brush = (cx, cy) => {
      const b = canvas.getBoundingClientRect(), x = (cx - b.left) * canvas.width / b.width, y = (cy - b.top) * canvas.height / b.height;
      ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x, y, 30 * k, 0, 7); ctx.fill(); ctx.restore();
      const now = performance.now();
      if (now - lastBrush > 260) { lastBrush = now; Sfx.brush(); }
      if (now - lastCheck > 200) { lastCheck = now; checkFound(); }
    };
    // Which bone (if found and not yet placed) is under a point on the screen.
    const boneAt = (cx, cy) => [...found].find(id => { if (placed.has(id)) return false; const b = under.querySelector(`.dig-bone[data-id="${id}"]`).getBoundingClientRect();
      return cx >= b.left - 10 && cx <= b.right + 10 && cy >= b.top - 10 && cy <= b.bottom + 10; });
    const slotAt = (cx, cy) => [...root.querySelectorAll('.dig-slot')].find(s => { const b = s.getBoundingClientRect(); return cx >= b.left - 14 && cx <= b.right + 14 && cy >= b.top - 14 && cy <= b.bottom + 14; });
    canvas.onpointerdown = e => {
      if (busy) return;
      e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      const id = boneAt(e.clientX, e.clientY);
      if (id) return drag(e, id);
      brush(e.clientX, e.clientY);
      canvas.onpointermove = ev => brush(ev.clientX, ev.clientY);
      canvas.onpointerup = canvas.onpointercancel = () => { canvas.onpointermove = canvas.onpointerup = canvas.onpointercancel = null; checkFound(); };
    };
    function drag(e, id) {
      const src = under.querySelector(`.dig-bone[data-id="${id}"]`), b = src.getBoundingClientRect();
      const fly = document.createElement('div'); fly.className = 'dig-fly';
      fly.style.cssText = `left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px`;
      const bb = src.getBBox();
      fly.innerHTML = `<svg viewBox="${bb.x - 4} ${bb.y - 4} ${bb.width + 8} ${bb.height + 8}">${MA.DINO[id].art('#f4ead2')}</svg>`;
      document.body.appendChild(fly); src.style.opacity = .25; Sfx.tap(); A.Hint.clear();
      const x0 = e.clientX, y0 = e.clientY; let over = null;
      canvas.onpointermove = ev => {
        fly.style.transform = `translate(${ev.clientX - x0}px, ${ev.clientY - y0}px) scale(1.1)`;
        const s = slotAt(ev.clientX, ev.clientY);
        if (s !== over) { if (over) over.classList.remove('over'); over = s; if (s) s.classList.add('over'); }
      };
      canvas.onpointerup = canvas.onpointercancel = async ev => {
        canvas.onpointermove = canvas.onpointerup = canvas.onpointercancel = null;
        if (over) over.classList.remove('over');
        const s = ev.type === 'pointerup' ? slotAt(ev.clientX, ev.clientY) : null;
        fly.remove();
        if (s && s.dataset.id === id) {
          placed.add(id); src.remove();
          s.outerHTML = `<g class="dig-placed">${MA.part(id)}</g>`;
          Sfx.clank(1); Sfx.chime(); A.Pip.mood('cheer');
          if (placed.size === hidden.length) return finish();
          queue(async () => { if (alive()) await A.say('dig.fit.' + Math.floor(Math.random() * 3)); });
        } else {
          src.style.opacity = 1;
          if (s) { Sfx.boing(); A.Pip.mood('thinking'); queue(async () => { if (alive()) await A.say('dig.wrong'); }); }
        }
      };
    }
    async function finish() {
      busy = true;
      await talking; if (!alive()) return;
      board.classList.add('roar'); Sfx.roar(); A.Pip.act('dance'); A.confetti();
      await A.say('dig.allDone');
      if (alive()) A.gameDone('dig');
    }
    queue(async () => { await A.say('dig.intro'); if (alive() && !found.size) A.Hint.set([pit], 'dig.brush'); });
  };

  // =====================================================================
  // The museum: visit six places, and pick a game
  // =====================================================================
  const PLACE = { // all inside x 200 to 1400, so 4:3 screens show every place; bases at or above y 700 (game tiles below)
    knight:   { x: 260,  y: 690, s: .6,  art: () => MA.knight(false), hit: [-130, -360, 260, 364] },
    painting: { x: 480,  y: 640, s: .72, art: () => MA.painting(false), hit: [-140, -310, 280, 314] },
    dino:     { x: 850,  y: 700, s: .66, art: () => MA.dino(false), hit: [-310, -400, 640, 420] },
    fossils:  { x: 1170, y: 650, s: .62, art: () => MA.fossilCase(false), hit: [-134, -190, 268, 230] },
    toys:     { x: 1340, y: 560, s: .5,  art: () => MA.toysCase(false), hit: [-144, -200, 288, 240] },
    space:    { x: 1240, y: 390, s: .56, art: () => MA.space(false), hit: [-134, -276, 268, 316] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <circle r="56" fill="${on ? '#8a5a24' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7"/>
    <circle r="40" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}"><g transform="translate(-6 -2) scale(.9)">${MA.ammonite()}</g><g transform="translate(18 18) rotate(-40)"><path d="M0 0 V26" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/><circle cy="-10" r="13" fill="#bfe6ff" fill-opacity=".7" stroke="${OL}" stroke-width="5"/></g></g>
    ${on ? '' : `<text y="58" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const musGames = () => A.worldGames('museum');
  const badgeEarned = () => SPOT_IDS.every(id => P().museum.includes(id)) && musGames().every(g => P().games.includes(g.id));

  function homeArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().museum.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="mus-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + (hx + hw - 16) * p.s} ${p.y + (hy + 20) * p.s})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx * p.s}" y="${p.y + hy * p.s}" width="${hw * p.s}" height="${hh * p.s}" fill="transparent"/>
      </g>`;
    }).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The museum">
      ${Art.defs()}${MA.hall(1600, 900, 620)}
      <g transform="translate(800 130)"><rect x="-200" y="-40" width="400" height="70" rx="10" fill="#8a5a24" ${S}/>${MA.txt(0, 12, 40, '#fff', 'MUSEUM')}</g>
      ${spots}
      <g class="mus-egg tappable"><g class="egg-wob" transform="translate(560 700) scale(.5)">${MA.egg(false)}</g><rect x="520" y="610" width="80" height="94" fill="transparent"/></g>
    </svg>`;
  }

  function spotSticker(id) {
    return new Promise(resolve => {
      P().museum.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${MA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${MA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${MA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('mus.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('museum')) return;
    P().badges.push('museum'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Little Explorer badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Little Explorer badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('mus.badge');
  }

  // What changes while a place is talking: the dinosaur rears its head, a fossil tooth shows, the top spins, the knight's
  // visor lifts, the rocket lifts off and the painting's sun smiles.
  const LIVE = { dino: () => MA.dino(true), fossils: () => MA.fossilCase(true), toys: () => MA.toysCase(true), knight: () => MA.knight(true), space: () => MA.space(true), painting: () => MA.painting(true) };
  let welcomed = false;
  A.screens.museumhall = (arg, alive) => {
    scene().innerHTML = `<div class="mus-home">${homeArt()}
      <div class="world-tiles">${musGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.mus-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    const eggEl = root.querySelector('.mus-egg');
    eggEl.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear(); Sfx.crack();
      eggEl.querySelector('.egg-wob').innerHTML = MA.egg(true);
      await A.say('mus.egg');
      if (!alive()) return;
      eggEl.querySelector('.egg-wob').innerHTML = MA.egg(false);
      busy = false;
    });
    root.querySelectorAll('.mus-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      art.innerHTML = LIVE[id]();
      sound(id);
      await A.say('mus.fact.' + id);
      if (!alive()) return;
      art.innerHTML = PLACE[id].art();
      if (!P().museum.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.museumhall('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.mus-spot[data-s="dino"]')], 'mus.hint');
    if (!welcomed) { welcomed = true; A.say('mus.welcome'); } else A.say('mus.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The museum page in the sticker book, and its badge ----------
  Rewards.pages.museum = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="mus" data-id="${id}" aria-label="${MA.SPOTS[id].name}">${MA.sticker(id, P().museum.includes(id))}<span>${P().museum.includes(id) ? MA.SPOTS[id].name : '?'}</span></button>`).join('')
      + musGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'mus') return false;
      if (P().museum.includes(id)) { Sfx.sparkle(); A.say('mus.name.' + id); }
      else { Sfx.boing(); A.say('mus.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'museum', name: 'Little Explorer', svg: BADGE, earned: () => P().badges.includes('museum') || badgeEarned(), how: 'mus.badge.how' });

  window.Museum = { SPOT_IDS, BADGE, badgeEarned, THINGS };
})();
