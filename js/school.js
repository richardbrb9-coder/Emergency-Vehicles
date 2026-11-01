// Pip goes to School: the school world pack. Words, pictures, levels and the classroom home screen, plus one
// game of its own (Line Up!). The story, Crayon Run, School Train and Pack My Bag come from the shared engines
// (Story, BallRun, WordTrain, Sorter).

// ---------- Crayon Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Gobble Run puzzles in a new order within each group, each checked solvable again by running its physics.
  // colour: the crayons and the pot they go in. decoyColour: a pot of another colour under the chute.
  const cl = (colour, decoyColour, p) => Object.assign({ balls: 6, colour, decoyColour }, p);
  BR.packs.school = {
    id: 'school',
    free: { hose: 1, goal: 11, balls: 8, colour: 'rainbow' },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      cl('red', null,       { hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      cl('blue', null,      { hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      cl('yellow', 'green', { hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      cl('green', 'red',    { hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      // 5 to 8: two pieces
      cl('orange', 'blue',  { hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      cl('purple', 'yellow',{ hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      cl('red', 'orange',   { hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      cl('blue', 'purple',  { hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      // 9 to 12: a see-saw or a bucket
      cl('yellow', null,    { hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      cl('green', 'blue',   { hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      cl('orange', 'red',   { hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] }),
      cl('purple', 'green', { hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] })
    ]
  };
  // The colour of each crayon: one colour per puzzle, every colour in turn in the free build.
  BR.crayonColour = (level, idx) => level.colour === 'rainbow' ? window.SchoolArt.RAINBOW[idx % 6] : level.colour;
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const SA = window.SchoolArt, COL = SA.COLOURS, ITEMS = SA.ITEMS;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().school) P().school = [];
  const shuffle = Sorter.shuffle;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  // The six things to visit in the classroom; visiting each one earns its sticker.
  const SPOT_IDS = ['peg', 'books', 'teacher', 'easel', 'sand', 'hamster'];
  const SOUND = { teacher: 'ring', peg: 'pop', books: 'whoosh', easel: 'splash', sand: 'hiss', hamster: 'squeak' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'school.welcome': 'Welcome to school! Tap things in the classroom to find out about them, or pick a game at the bottom.',
    'school.back':    'What shall we do at school now?',
    'school.hint':    'Tap something in the classroom!',
    'school.pip':     "Woof! It's my first day at school. Tap things in the classroom to explore.",
    'school.fact.peg':     'This is your peg, with your name on it. Every morning, hang up your coat and bag here.',
    'school.fact.books':   'The book corner! Choose a book, sit on a cushion, and enjoy the pictures and the story.',
    'school.fact.teacher': "Good morning! I'm Mrs Bell, your teacher. When I ring my bell, it's time to stop and listen.",
    'school.fact.easel':   'The painting easel. Put on an apron first, so no paint gets on your jumper!',
    'school.fact.sand':    'The sand tray. You can dig, pour and build, but the sand stays in the tray.',
    'school.fact.hamster': 'This is Nibbles, our class hamster. We take turns to feed him and give him fresh water.',
    'school.badge':     'You earned the Star Pupil badge! Mrs Bell is very proud of you!',
    'school.badge.how': 'Visit everything in the classroom and play every school game to earn the Star Pupil badge.',
    'book.world.school': 'Your school stickers! Explore the classroom and play the games to fill this page.',

    'games.schoolStory': 'First Day',
    'games.crayonrun':   'Crayon Run',
    'games.schooltrain': 'School Train',
    'games.bag':         'Pack My Bag',
    'games.lineup':      'Line Up!',

    // The story
    'school.story.1': "Today is a big day. It's Pip's first day at school! Pip puts on a new blue jumper and picks up a shiny red school bag.",
    'school.story.2': "At the school gate, Pip feels a bit wobbly inside. Mum gives Pip a big hug. It's OK to feel nervous on your first day.",
    'school.story.3': 'Mrs Bell the teacher smiles and says good morning. She shows Pip a peg with his name on it, just for his coat and bag.',
    'school.story.4': 'The classroom has so much to do! A book corner, a sand tray, a painting easel, and Nibbles the class hamster.',
    'school.story.5': 'Pip meets Lily and Sam. They build a tall tower of blocks together, taking turns. Making friends is fun!',
    'school.story.6': 'At playtime, everyone runs out to the playground. Pip whizzes down the slide. Wheee!',
    'school.story.7': 'At home time, Mum is waiting at the gate. How was school, Pip? Brilliant! Can I go again tomorrow?',
    'school.story.end': 'The end! Thank you for reading with me.',

    // Crayon Run (ball run)
    'crayonrun.pick':    'Crayon Run! Build your own, or try one of my puzzles.',
    'crayonrun.free':    'Drag pieces onto the board. Then blow my whistle to send the crayons down!',
    'crayonrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'crayonrun.go':      'Here come the crayons!',
    'crayonrun.flip':    'Tap a piece to turn it around.',
    'crayonrun.n1':      'One!',
    'crayonrun.n2':      'Two!',
    'crayonrun.n3':      'Three!',
    'crayonrun.again':   'Oops! The crayons missed. Move the pieces and try again.',
    'crayonrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'crayonrun.allDone': 'You solved all my puzzles! Every crayon is back in its pot!',
    'crayonrun.freeOut': 'A rainbow of crayons! What else can you build?',
    'crayonrun.bolted':  'That piece is bolted on. Build around it!',
    'crayonrun.cleared': "All clear! Let's build something new.",
    'crayonrun.p.ramp':   'A ramp! Crayons roll down a slope.',
    'crayonrun.p.long':   'A long ramp. The crayons roll a long way down it.',
    'crayonrun.p.curve':  'A curve. It turns falling crayons to the side.',
    'crayonrun.p.funnel': 'A funnel. It catches the crayons and drops them through the middle.',
    'crayonrun.p.spring': 'A spring! Boing! It bounces the crayons up into the air.',
    'crayonrun.p.fan':    'A fan. Whoosh! It blows the crayons sideways.',
    'crayonrun.p.seesaw': 'A see-saw. When a crayon lands on one end, it tips!',
    'crayonrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // School Train
    'schooltrain.pick': 'All aboard the School Train! School words are made of beats too. Pick a game.',
    'schooltrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!',

    // Pack My Bag
    'bag.intro': "It's a school day! Drag the things we need for school into the school bag. Things we don't need stay at home.",
    'bag.no':    'Hmm, think again! Do we need that at school?',
    'bag.done':  'All packed and ready for school! Well done!',
    'bag.bin.bag':  'The school bag. Pack the things we need for school.',
    'bag.bin.home': "Home. Leave the things we don't need at school here.",
    'bag.yes.book':       'A reading book! We read it at school, and at home too.',
    'bag.yes.pencilcase': 'A pencil case, for pencils and crayons.',
    'bag.yes.lunchbox':   'A lunchbox, for a yummy packed lunch.',
    'bag.yes.bottle':     'A water bottle. Drinking water helps us think!',
    'bag.yes.pebag':      'A PE bag, with shorts and a T-shirt for running and jumping.',
    'bag.yes.duck':       'A rubber duck stays at home, for bath time!',
    'bag.yes.pillow':     'A pillow stays at home, on your bed.',
    'bag.yes.slippers':   'Slippers stay at home, for cosy toes.',
    'bag.yes.toaster':    'A toaster stays in the kitchen at home. Silly!',
    'bag.yes.pan':        'A frying pan stays at home, in the kitchen.',
    'bag.name.book': 'A reading book!', 'bag.name.pencilcase': 'A pencil case!', 'bag.name.lunchbox': 'A lunchbox!',
    'bag.name.bottle': 'A water bottle!', 'bag.name.pebag': 'A PE bag!', 'bag.name.duck': 'A rubber duck!',
    'bag.name.pillow': 'A pillow!', 'bag.name.slippers': 'Slippers!', 'bag.name.toaster': 'A toaster!', 'bag.name.pan': 'A frying pan!',

    // Line Up!
    'lineup.intro':       "Mrs Bell says it's time to line up! Let's put everyone in order of size.",
    'lineup.kids.asc':    'Tap the shortest child first. Then the next shortest, all the way to the tallest.',
    'lineup.kids.desc':   'Now the other way round! Tap the tallest child first, all the way down to the shortest.',
    'lineup.pencils.asc': 'Now the pencils. Tap the shortest pencil first, all the way to the longest.',
    'lineup.no.asc':      'Hmm, look again. Is there a shorter one?',
    'lineup.no.desc':     'Hmm, look again. Is there a taller one?',
    'lineup.first.asc':   "Yes! That's the shortest.",
    'lineup.first.desc':  "Yes! That's the tallest.",
    'lineup.done.kids.asc':    'Perfect! Shortest at the front, tallest at the back.',
    'lineup.done.kids.desc':   'Perfect! Tallest at the front, shortest at the back.',
    'lineup.done.pencils.asc': 'Brilliant! From the shortest pencil to the longest.',
    'lineup.allDone':     'Everyone is lined up! You are brilliant at sizes!'
  });
  Object.keys(COL).forEach(c => {
    L['crayonrun.want.' + c] = `Tidy up time! Roll the ${c} crayons into the ${c} pot.`;
    L['crayonrun.no.' + c] = `Oops! That pot is the wrong colour. The ${c} crayons go in the ${c} pot.`;
    L['crayonrun.fed.' + c] = `Three ${c} crayons in the ${c} pot! Well done!`;
  });
  SPOT_IDS.forEach(id => {
    const n = SA.SPOTS[id].name;
    L['school.sticker.' + id] = `You earned the ${id === 'teacher' || id === 'hamster' ? n : n.toLowerCase()} sticker!`;
    L['school.name.' + id] = n + '!';
  });

  // Pip wears his school cap and bag on every school screen.
  ['school', 'schoolStory', 'crayonrun', 'schooltrain', 'bag', 'lineup'].forEach(s => { A.screenWorld[s] = 'school'; });
  const COMMON = { world: 'school', back: 'school' };

  // =====================================================================
  // First Day: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const pipAt = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip('school').replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const grass = `<path d="M0 500 Q300 470 600 495 T1200 490 V660 H0 Z" fill="#8ccf78"/><path d="M0 560 Q400 540 800 565 T1200 560 V660 H0 Z" fill="#7cc46a"/>`;
  const room = (wall = '#fff3d6') => `<rect width="1200" height="500" rx="30" fill="${wall}"/><path d="M0 500 H1200 V660 H0 Z" fill="#e8c48a"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 220 - 40} 500 L${i * 240 - 120} 660" stroke="#d1a96a" stroke-width="4"/>`).join('')}<path d="M0 500 H1200" stroke="#c98b4e" stroke-width="10"/>`;
  const kid = (i, h, x, y, s = 1, mood) => at(x, y, s, SA.kid(h, SA.KIDS[i], mood));
  const blocks = (x, y) => `<g transform="translate(${x} ${y})">${[['A', '#e53935', -60, 0], ['B', '#1e5bd6', 0, 0], ['C', '#2e9e4f', 60, 0], ['1', '#ffd21f', -30, -60], ['2', '#8e5bd6', 30, -60], ['3', '#f07a1a', 0, -120]].map(([l, c, bx, by]) => `<g transform="translate(${bx} ${by - 30})">
    <rect x="-29" y="-29" width="58" height="58" rx="6" fill="${c}" ${S}/><rect x="-20" y="-20" width="40" height="40" rx="4" fill="#fff"/>${SA.txt(0, 14, 38, c, l)}</g>`).join('')}</g>`;
  const sunsetSky = `<rect width="1200" height="660" rx="30" fill="#ffcf9a"/><circle cx="1000" cy="200" r="70" fill="#ffd21f" opacity=".85"/>`;
  const PAGES = [
    () => page('#fff3d6', `${room('#dff3ff')}
      <rect x="120" y="70" width="240" height="190" rx="10" fill="#bfe6ff" ${S}/><path d="M240 70 V260 M120 165 H360" ${S}/><circle cx="180" cy="120" r="30" fill="#ffd21f"/>
      ${tap('pop', at(820, 260, 1.6, ITEMS.uniform))}<path d="M820 158 V120" ${S3}/>
      ${tap('pop', at(1040, 470, 1.4, ITEMS.schoolbag))}${pipAt(420, 300, 260)}`),
    () => page('#bfe6ff', `${Art.cloud(80, 60, .8)}${Art.cloud(900, 40, .7)}${grass}
      ${at(840, 500, 1.1, SA.school)}${at(0, 560, 1, SA.gate(0, 420))}
      ${tap('woof', at(300, 560, 1.2, SA.pipMum))}${pipAt(340, 350, 210)}
      ${kid(1, 170, 1080, 600, 1)}${kid(0, 150, 620, 600, 1)}`),
    () => page('#fff3d6', `${room()}
      ${at(240, 470, 1.1, SA.peg('Pip'))}${at(500, 470, 1.1, SA.peg('Lily')).replace(/fill="#ffd21f" stroke/, 'fill="#e86aa6" stroke')}
      ${tap('ring', at(820, 640, 1.25, SA.teacher(false)))}${pipAt(80, 380, 220)}`),
    () => page('#fff3d6', `${room()}${at(600, 220, .9, SA.whiteboard)}
      ${tap('whoosh', at(330, 560, 1, SA.bookCorner))}${tap('hiss', at(560, 600, 1, SA.sandTray))}
      ${tap('splash', at(800, 600, .9, SA.easel))}<rect x="960" y="500" width="200" height="16" fill="#c98b4e" ${S3}/><path d="M980 516 V620 M1140 516 V620" stroke="${OL}" stroke-width="10"/>
      ${tap('squeak', at(1060, 500, .9, SA.hamsterCage))}${pipAt(0, 420, 190)}`),
    () => page('#fff3d6', `${room()}${blocks(600, 590)}
      ${kid(0, 170, 360, 640, 1.5)}${kid(1, 185, 840, 640, 1.5, 'open')}${pipAt(930, 400, 220)}`),
    () => page('#bfe6ff', `${Art.cloud(100, 70, .9)}${Art.cloud(800, 50, .7)}${grass}
      ${at(560, 400, 3.2, ITEMS.slide)}${pipAt(560, 250, 170)}
      ${kid(3, 160, 220, 600, 1)}${kid(2, 180, 980, 610, 1)}${kid(5, 170, 1110, 600, .95)}
      <text x="900" y="200" font-family="Fredoka, sans-serif" font-weight="700" font-size="64" fill="#e53935" stroke="#fff" stroke-width="6" paint-order="stroke">Wheee!</text>`),
    () => page('#ffcf9a', `${sunsetSky}${grass}
      ${at(860, 500, 1.1, SA.school)}${at(0, 560, 1, SA.gate(0, 400))}
      ${tap('woof', at(260, 560, 1.2, SA.pipMum))}<g class="st-tap" data-sfx="woof">${pipAt(380, 350, 210)}</g>`)
  ];
  Story.mount(Object.assign({ screen: 'schoolStory', colour: '#1e5bd6', cls: 'school-story', lines: { end: 'school.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(28 26) scale(.4)">${ITEMS.schoolbag}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'school.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Crayon Run: crayons roll from the crayon box into the pot of the same colour
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, COLS, ROWS } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const CRAYON_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#ffd21f" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-24 -44) rotate(26) scale(.42)">${SA.crayon(COL.red)}</g><g transform="translate(14 -14) rotate(26) scale(.42)">${SA.crayon(COL.red)}</g>
    <g transform="translate(18 54) scale(.46)">${SA.pot(COL.red, 1)}</g></svg>`;
  const schoolTheme = {
    board(ctx) { // squared paper from a maths book
      ctx.fillStyle = '#fdfcf4'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(30,91,214,.13)'; ctx.lineWidth = 2;
      for (let x = 50; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 50; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(229,57,53,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(40, H); ctx.stroke();
      ctx.fillStyle = '#e8c48a'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // a crayon box
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      const tips = level.colour === 'rainbow' ? SA.RAINBOW.slice(0, 4) : [level.colour, level.colour, level.colour, level.colour];
      tips.forEach((c, i) => poly(ctx, [{ x: x - 35 + i * 20, y: 20 }, { x: x - 21 + i * 20, y: 20 }, { x: x - 28 + i * 20, y: 2 }], COL[c], OL, 3));
      poly(ctx, [{ x: x - 44, y: 14 }, { x: x + 44, y: 14 }, { x: x + 40, y: 48 }, { x: x - 40, y: 48 }], '#ffd21f');
      poly(ctx, [{ x: x - 30, y: 22 }, { x: x + 30, y: 22 }, { x: x + 28, y: 40 }, { x: x - 28, y: 40 }], '#2e9e4f', OL, 3);
      poly(ctx, [{ x: x - 20, y: 48 }, { x: x + 20, y: 48 }, { x: x + 14, y: 62 }, { x: x - 14, y: 62 }], '#c98b4e');
      if (dripping) line(ctx, x - 12, 54, x + 12, 54, '#fff', 4);
    },
    ball(ctx, b, level) { drawImg(ctx, SA.crayonImage(BR.crayonColour(level, b.idx)), b.position.x, b.position.y, 50, 18, b.angle); },
    goal(ctx, st) {
      const { level, fx, hits, won, now } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 6 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 10 : 0;
      drawImg(ctx, SA.potImage(level.colour, Math.min(3, hits)), x, H - 102 + bob + jump, 150, 208);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 10 : 0);
      drawImg(ctx, SA.potImage(level.decoyColour, 0), x, H - 102, 150, 208);
    },
    splash: '#c3cad6',
    release() { Sfx.plop(); },
    hit(ev, fx, level) { Sfx.plink(1 + ev.n * .25); fx.chew = 30; fx.burst(ev.x, ev.y, 8, COL[BR.crayonColour(level, ev.idx)], 1.2); },
    win(fx) { fx.chew = 0; },
    tapGoal() { Sfx.clank(2); },
    tapDecoy() { Sfx.boing(); },
    refuse: level => 'crayonrun.no.' + level.colour,
    intro: level => 'crayonrun.want.' + level.colour,
    winLine: level => 'crayonrun.fed.' + level.colour
  };
  BR.mount(Object.assign({ screen: 'crayonrun', lines: 'crayonrun', colour: '#f07a1a', icon: CRAYON_ICON, pack: BR.packs.school, theme: schoolTheme, cls: 'school-run' }, COMMON));

  // =====================================================================
  // School Train: school words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (a short "ih" for unstressed vowels).
  // alone / carrier: see the Rescue Station words in js/train.js.
  WordTrain.packs.school = {
    id: 'school',
    words: [
      { id: 'pencil',      word: 'pencil',      beats: ['pen', 'cil'],              say: ['pen', 'sill'],              pic: 'pencil' },
      { id: 'teacher',     word: 'teacher',     beats: ['teach', 'er'],             say: ['teach', 'uh'],              pic: 'teacher' },
      { id: 'scissors',    word: 'scissors',    beats: ['scis', 'sors'],            say: ['siz', 'uz'],                pic: 'scissors' },
      { id: 'playground',  word: 'playground',  beats: ['play', 'ground'],          say: ['play', 'ground'],           pic: 'slide' },
      { id: 'crayon',      word: 'crayon',      beats: ['cray', 'on'],              say: ['cray', 'on'],               pic: 'crayon' },
      { id: 'lunchbox',    word: 'lunchbox',    beats: ['lunch', 'box'],            say: ['lunch', 'box'],             pic: 'lunchbox' },
      { id: 'computer',    word: 'computer',    beats: ['com', 'pu', 'ter'],        say: ['kum', 'pyoo', 'tuh'],       pic: 'computer' },
      { id: 'alphabet',    word: 'alphabet',    beats: ['al', 'pha', 'bet'],        say: ['al', 'fuh', 'bet'],         pic: 'alphabet' },
      { id: 'xylophone',   word: 'xylophone',   beats: ['xy', 'lo', 'phone'],       say: ['zai', 'luh', 'fone'],       pic: 'xylophone', alone: [0] },
      { id: 'uniform',     word: 'uniform',     beats: ['u', 'ni', 'form'],         say: ['you', 'nih', 'form'],       pic: 'uniform', alone: [1], carrier: { 1: 'nit' } },
      { id: 'watercolour', word: 'watercolour', beats: ['wa', 'ter', 'col', 'our'], say: ['wor', 'tuh', 'kul', 'uh'],  pic: 'watercolour' },
      { id: 'macaroni',    word: 'macaroni',    beats: ['mac', 'a', 'ro', 'ni'],    say: ['mak', 'uh', 'roh', 'nee'],  pic: 'macaroni' }
    ]
  };
  const trainPic = w => w.pic === 'teacher' ? SA.svg(SA.teacher(true), '-80 -250 160 256') : SA.itemSvg(w.pic);
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 70) scale(.55)">${ITEMS.pencil}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'schooltrain', pack: WordTrain.packs.school, colour: '#2e9e4f', tile: TRAIN_TILE, picture: trainPic, cls: 'school-train',
    lines: { pick: 'schooltrain.pick', done: 'schooltrain.done' } }, COMMON));

  // =====================================================================
  // Pack My Bag: school things into the school bag, home things stay at home (the sorting engine)
  // =====================================================================
  const FOR_SCHOOL = ['book', 'pencilcase', 'lunchbox', 'bottle', 'pebag'], FOR_HOME = ['duck', 'pillow', 'slippers', 'toaster', 'pan'];
  const HOME_ART = `<svg viewBox="-70 -70 140 140"><path d="M-50 -10 L0 -56 L50 -10 V54 H-50 Z" fill="#ffe3ef" ${S}/><path d="M-62 -4 L0 -62 L62 -4" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-62 -4 L0 -62 L62 -4" fill="none" stroke="#e53935" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="-14" y="16" width="28" height="38" fill="#8b5a2b" ${S3}/><rect x="-40" y="0" width="22" height="22" fill="#bfe6ff" ${S3}/><rect x="18" y="0" width="22" height="22" fill="#bfe6ff" ${S3}/></svg>`;
  const BAG_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-10 8) scale(.7)">${ITEMS.schoolbag}</g><g transform="translate(32 -32) scale(.36)">${ITEMS.lunchbox}</g>
    <g transform="translate(36 34) scale(.32)">${ITEMS.book}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'bag', colour: '#e53935', tile: BAG_TILE, cls: 'school-bag',
    lines: { intro: 'bag.intro', no: 'bag.no', done: 'bag.done' },
    round(level) {
      const school = shuffle(FOR_SCHOOL).slice(0, 3 + Math.min(level, 2)), home = shuffle(FOR_HOME).slice(0, level > 1 ? 3 : 2);
      const item = (id, bin) => ({ id, art: SA.itemSvg(id), bin, line: 'bag.yes.' + id, name: 'bag.name.' + id });
      return {
        bins: [{ id: 'bag', art: SA.itemSvg('schoolbag'), name: 'bag.bin.bag', cls: 'bin-bag' }, { id: 'home', art: HOME_ART, name: 'bag.bin.home', cls: 'bin-home' }],
        items: [...school.map(id => item(id, 'bag')), ...home.map(id => item(id, 'home'))]
      };
    },
    onRight(binEl, it) { if (it.bin === 'bag') { Sfx.pop(); binEl.querySelector('.so-art svg').classList.remove('gulp'); void binEl.offsetWidth; binEl.querySelector('.so-art svg').classList.add('gulp'); } else Sfx.chime(); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Line Up!: tap the children (or pencils) in order of size, and they walk into the line
  // =====================================================================
  const LINE_TILE = `<svg viewBox="-60 -60 120 120">${[[110, -34, 0], [140, -6, 1], [170, 24, 3]].map(([h, x, i]) => `<g transform="translate(${x} 56) scale(.42)">${SA.kid(h, SA.KIDS[i])}</g>`).join('')}
    <path d="M-50 -46 H36" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M28 -54 L38 -46 L28 -38" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  A.addGame('lineup', '#00a6a6', LINE_TILE, COMMON);
  const KID_H = [132, 158, 184, 210, 236], PENCIL_L = [62, 86, 110, 134, 158];
  const PENCIL_COLOURS = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
  function lineRounds(level) {
    const n = [3, 4, 5][level] || 5;
    return level === 0
      ? [{ kind: 'kids', dir: 'asc', n: 3 }, { kind: 'pencils', dir: 'asc', n: 3 }, { kind: 'kids', dir: 'asc', n: 4 }]
      : [{ kind: 'kids', dir: 'asc', n }, { kind: 'pencils', dir: 'asc', n }, { kind: 'kids', dir: 'desc', n }];
  }
  // n sizes from the list, spread out so neighbours are easy to tell apart when there are only a few.
  const pickSizes = (list, n) => n >= list.length ? [...list] : n === 4 ? shuffle([[0, 1, 2, 4], [0, 2, 3, 4], [0, 1, 3, 4]])[0].map(i => list[i]) : [list[0], list[2], list[4]];
  A.screens.lineup = (arg, alive) => {
    A.ui({ home: true });
    const rounds = lineRounds(A.level('lineup'));
    scene().innerHTML = `<div class="lineup"><div class="lu-crowd"></div><div class="lu-line"></div></div>`;
    const root = scene().querySelector('.lineup'), crowd = root.querySelector('.lu-crowd'), lineEl = root.querySelector('.lu-line');
    let ri = 0, busy = true, order = [], next = 0, round = null;

    function serve() {
      round = rounds[ri]; next = 0; busy = true;
      const sizes = pickSizes(round.kind === 'kids' ? KID_H : PENCIL_L, round.n);
      const looks = shuffle(SA.KIDS), cols = shuffle(PENCIL_COLOURS);
      const people = sizes.map((h, i) => ({ h, art: round.kind === 'kids'
        ? SA.svg(SA.kid(h, looks[i]), '-46 -246 92 252', 'preserveAspectRatio="xMidYMax meet"')
        : SA.svg(SA.pencil(COL[cols[i]], h), '-22 -166 44 172', 'preserveAspectRatio="xMidYMax meet"') }));
      order = [...people].sort((a, b) => round.dir === 'asc' ? a.h - b.h : b.h - a.h);
      root.className = 'lineup ' + round.kind;
      crowd.innerHTML = shuffle(people).map((p, i) => `<button class="lu-one" data-h="${p.h}" style="animation-delay:${i * .07}s" aria-label="${round.kind === 'kids' ? 'A child' : 'A pencil'}">${p.art}</button>`).join('');
      lineEl.innerHTML = people.map((_, i) => `<span class="lu-spot"><b>${i + 1}</b></span>`).join('');
      crowd.querySelectorAll('.lu-one').forEach(b => b.onclick = () => pick(b));
      (async () => {
        if (ri === 0) { await A.say('lineup.intro'); if (!alive()) return; }
        await A.say(`lineup.${round.kind}.${round.dir}`);
        if (!alive()) return;
        busy = false;
        hint();
      })();
    }
    const hint = () => A.Hint.set([...crowd.querySelectorAll('.lu-one')].filter(b => +b.dataset.h === order[next].h), null);

    async function pick(b) {
      if (busy) return;
      A.Hint.clear();
      if (+b.dataset.h !== order[next].h) {
        Sfx.boing(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
        A.Pip.mood('thinking'); A.say('lineup.no.' + round.dir);
        return;
      }
      busy = true;
      // Walk into the next spot in the line (move it, then animate from where it was).
      const spot = lineEl.children[next], from = b.getBoundingClientRect();
      spot.appendChild(b); b.onclick = null; b.classList.add('in-line');
      const to = b.getBoundingClientRect();
      b.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'translate(0, 0)' }], { duration: 450, easing: 'ease-out' });
      Sfx.plink(1 + next * .2);
      next++;
      if (next === 1) await A.say('lineup.first.' + round.dir); else await A.wait(450);
      if (!alive()) return;
      if (next < order.length) { busy = false; hint(); return; }
      A.Pip.mood('cheer'); Sfx.chime();
      lineEl.classList.remove('done'); void lineEl.offsetWidth; lineEl.classList.add('done');
      await A.say(`lineup.done.${round.kind}.${round.dir}`);
      if (!alive()) return;
      ri++;
      if (ri < rounds.length) { await A.wait(300); if (alive()) serve(); return; }
      A.Pip.act('dance');
      await A.say('lineup.allDone');
      if (alive()) A.gameDone('lineup');
    }
    serve();
  };

  // =====================================================================
  // The classroom: visit six things, and pick a game
  // =====================================================================
  const PLACE = {
    peg:     { x: 210,  y: 600, s: 1.05, art: () => SA.peg('Pip'), hit: [-90, -240, 180, 250] },
    books:   { x: 420,  y: 640, s: 1.05, art: () => SA.bookCorner, hit: [-100, -170, 240, 180] },
    teacher: { x: 760,  y: 650, s: 1.05, art: () => SA.teacher(false), hit: [-70, -260, 140, 270] },
    easel:   { x: 990,  y: 640, s: 1.05, art: () => SA.easel, hit: [-75, -220, 150, 230] },
    sand:    { x: 1220, y: 650, s: 1.05, art: () => SA.sandTray, hit: [-100, -180, 200, 190] },
    hamster: { x: 1400, y: 560, s: 1, art: () => SA.hamsterCage, hit: [-95, -200, 190, 210] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#1e5bd6' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(0 -2)"><path d="M0 -24 L7 -8 L24 -7 L11 4 L15 21 L0 12 L-15 21 L-11 4 L-24 -7 L-7 -8 Z" fill="#ffd21f" ${S3}/></g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const schoolGames = () => A.worldGames('school');
  const badgeEarned = () => SPOT_IDS.every(id => P().school.includes(id)) && schoolGames().every(g => P().games.includes(g.id));

  function classroomArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().school.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="school-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + hx + hw - 16} ${p.y + hy + 20})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx}" y="${p.y + hy}" width="${hw}" height="${hh}" fill="transparent"/>
      </g>`;
    }).join('');
    const bunting = Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 28 l50 0 l-25 44 Z" fill="${['#e53935', '#ffd21f', '#2e9e4f', '#1e5bd6', '#8e5bd6'][i % 5]}" ${S3}/>`).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The classroom">
      ${Art.defs()}
      <rect width="1600" height="900" fill="#fff3d6"/>
      <path d="M0 560 H1600" stroke="#f2c879" stroke-width="16"/>
      <path d="M0 640 H1600 V900 H0 Z" fill="#e8c48a"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 220 - 60} 640 L${i * 260 - 260} 900" stroke="#d1a96a" stroke-width="5"/>`).join('')}
      <path d="M0 640 H1600" stroke="#c98b4e" stroke-width="12"/>
      <path d="M-20 28 Q800 70 1620 28" fill="none" stroke="${OL}" stroke-width="4"/>${bunting}
      <g transform="translate(560 270) scale(.92)">${SA.whiteboard}</g>
      <g transform="translate(1180 120)"><rect width="300" height="200" rx="10" fill="#bfe6ff" ${S}/><path d="M150 0 V200 M0 100 H300" ${S}/><circle cx="70" cy="60" r="28" fill="#ffd21f"/>${Art.cloud(170, 120, .45)}</g>
      <g transform="translate(930 150)"><circle r="54" fill="#fff" ${S}/><path d="M0 0 V-34 M0 0 H24" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
        ${[0, 1, 2, 3].map(i => `<circle cx="${Math.sin(i * Math.PI / 2) * 42}" cy="${-Math.cos(i * Math.PI / 2) * 42}" r="4" fill="${OL}"/>`).join('')}</g>
      <rect x="1310" y="560" width="190" height="16" fill="#c98b4e" ${S3}/><path d="M1330 576 V660 M1480 576 V660" stroke="${OL}" stroke-width="10"/>
      ${spots}
    </svg>`;
  }

  // A sticker for each classroom spot, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().school.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${SA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${SA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${SA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('school.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('school')) return;
    P().badges.push('school'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Star Pupil badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Star Pupil badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('school.badge');
  }

  let welcomed = false;
  A.screens.school = (arg, alive) => {
    scene().innerHTML = `<div class="school-home">${classroomArt()}
      <div class="world-tiles">${schoolGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.school-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelectorAll('.school-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      if (id === 'teacher') art.innerHTML = SA.teacher(true);
      sound(id);
      await A.say('school.fact.' + id);
      if (!alive()) return;
      if (id === 'teacher') art.innerHTML = SA.teacher(false);
      if (!P().school.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.school('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.school-spot')], 'school.hint');
    if (!welcomed) { welcomed = true; A.say('school.welcome'); } else A.say('school.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- School's page in the sticker book, and its badge ----------
  Rewards.pages.school = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="sc" data-id="${id}" aria-label="${SA.SPOTS[id].name}">${SA.sticker(id, P().school.includes(id))}<span>${P().school.includes(id) ? SA.SPOTS[id].name : '?'}</span></button>`).join('')
      + schoolGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'sc') return false;
      if (P().school.includes(id)) { Sfx.sparkle(); A.say('school.name.' + id); }
      else { Sfx.boing(); A.sayText(`Tap ${id === 'teacher' ? 'Mrs Bell' : id === 'hamster' ? 'Nibbles' : 'the ' + SA.SPOTS[id].name.toLowerCase().replace('my ', '')} in the classroom to find this sticker.`); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'school', name: 'Star Pupil', svg: BADGE, earned: () => P().badges.includes('school') || badgeEarned(), how: 'school.badge.how' });

  window.School = { SPOT_IDS, BADGE, badgeEarned };
})();
