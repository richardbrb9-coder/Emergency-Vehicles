// Pip's Days Out: the Library. Pip gets his very first library card and goes to story time, with Mum and Miss Rosa
// the librarian. Words, pictures, levels and the library home screen, plus one game of its own (Rhyme Time). The story,
// Book Run, Library Train and Sound Shelves come from the shared engines (Story, BallRun, WordTrain, Sorter).

// ---------- Book Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Shell Run puzzles in a new order within each group, each checked solvable again by running its physics with
  // the hint pieces in place. decoy: the fish tank.
  const b = p => Object.assign({ balls: 6 }, p);
  BR.packs.library = {
    id: 'library',
    free: { hose: 1, goal: 11, balls: 8 },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      b({ hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      b({ hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      b({ hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      // 5 to 8: two pieces
      b({ hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      b({ hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      b({ hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      // 9 to 12: a see-saw or a bucket
      b({ hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      b({ hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] }),
      b({ hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      b({ hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] })
    ]
  };
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const LA = window.LibArt, BA = window.BusArt, PA = window.PupArt;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().library) P().library = [];
  const shuffle = Sorter.shuffle;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  // The six things to visit in the library; visiting each one earns its sticker.
  const SPOT_IDS = ['desk', 'box', 'rug', 'beanbag', 'frieze', 'returns'];
  const SOUND = { desk: 'beep', box: 'page', rug: 'sparkle', beanbag: 'plop', frieze: 'chime', returns: 'page' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);

  // ---------- Words ----------
  const L = CONTENT.lines;
  // A few lines say a letter's sound. The recorded voice is given the exact sound (CONTENT.ssml); the words on screen
  // and the device voice use the plain text.
  const SSML = CONTENT.ssml = CONTENT.ssml || {};
  const SOUNDS = { s: { say: 'sss', ipa: 'sː' }, a: { say: 'a', ipa: 'æ' }, t: { say: 't', ipa: 'tə' }, p: { say: 'p', ipa: 'pə' } };
  const ssml = (id, text, letter) => {
    L[id] = text;
    const s = SOUNDS[letter];
    SSML[id] = '<speak>' + text.replace(new RegExp(`\\b${s.say}\\b`), `<phoneme alphabet="ipa" ph="${s.ipa}">${s.say}</phoneme>`) + '</speak>';
  };
  Object.assign(L, {
    'lib.welcome': "Welcome to the library! It's full of books and stories. Tap things to find out about them, or pick a game at the bottom.",
    'lib.back':    'What shall we do in the library now?',
    'lib.hint':    'Tap something in the library!',
    'lib.worm':    "Hello! I'm a bookworm. I love books so much, I could eat them. Munch, munch! Only joking. Books are for reading!",
    'lib.fact.desk':    'This is Miss Rosa, the librarian. She looks after all the books, and helps you find the one you want. Just ask!',
    'lib.fact.box':     'The picture-book box! Flip through the books to find one you like. Which one would you choose?',
    'lib.fact.rug':     'This is the story-time rug. Sit down, listen carefully, and Miss Rosa will read you a story.',
    'lib.fact.beanbag': 'The beanbag corner! A cosy, comfy place to curl up with a book. Flump!',
    'lib.fact.frieze':  'The alphabet! A, b, c, all the way to z. All the words in all these books are made from these 26 letters.',
    'lib.fact.returns': 'The book returns slot. When you have finished your books, post them back in here, so other children can enjoy them too.',
    'lib.badge':     'You earned the Bookworm badge! You really love books!',
    'lib.badge.how': 'Visit everything in the library, and play every library game, to earn the Bookworm badge.',
    'book.world.library': 'Your library stickers! Explore the library, and play the games to fill this page.',

    'games.libStory': 'My Library Card',
    'games.bookrun':  'Book Run',
    'games.libtrain': 'Library Train',
    'games.rhyme':    'Rhyme Time',
    'games.shelves':  'Sound Shelves',

    // The story
    'lib.story.1': 'Pip and Mum go to the library. Miss Rosa the librarian says hello. Would you like a library card, Pip?',
    'lib.story.2': 'Mum fills in a form, and Miss Rosa makes Pip his very own library card. With a library card, you can borrow books for free!',
    'lib.story.3': 'Pip looks in the picture-book box. Dragons, pirates, fire engines! Pip chooses three books to take home.',
    'lib.story.4': 'In the library, we use quiet voices, so everyone can enjoy their books. Shh!',
    'lib.story.5': "It's story time! Everyone sits on the rug, and Miss Rosa reads a story about a friendly dragon. Roar!",
    'lib.story.6': 'Miss Rosa scans Pip\'s card and his books. Beep, beep, beep! Please bring them back in three weeks.',
    'lib.story.7': 'At bedtime, Mum and Pip read together. Pip turns the pages gently, and puts in a bookmark to keep his place.',
    'lib.story.8': 'Three weeks later, Pip posts his books back through the returns slot. Thank you, Pip! Now he can choose some new ones.',
    'lib.story.end': 'The end! I love the library.',

    // Book Run (ball run)
    'bookrun.pick':    'Book Run! Build your own, or try one of my puzzles.',
    'bookrun.free':    'Drag pieces onto the board. Then blow my whistle to send the books down!',
    'bookrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'bookrun.go':      'Here come the books!',
    'bookrun.flip':    'Tap a piece to turn it around.',
    'bookrun.n1':      'One!',
    'bookrun.n2':      'Two!',
    'bookrun.n3':      'Three!',
    'bookrun.again':   'Oops! The books missed the shelf. Move the pieces and try again.',
    'bookrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'bookrun.allDone': 'You solved all my puzzles! Every book is back on the shelf. Miss Rosa says thank you!',
    'bookrun.freeOut': 'Thud, thud! Books on the shelf! What else can you build?',
    'bookrun.bolted':  'That piece is bolted on. Build around it!',
    'bookrun.cleared': "All clear! Let's build something new.",
    'bookrun.no':      'Splosh! That book fell in the fish tank. Books and water don\'t mix! Roll the books onto the shelf.',
    'bookrun.want':    'Help three books roll onto the bookshelf with the same colour!',
    'bookrun.won.0':   'Three books on the shelf! Hooray!',
    'bookrun.won.1':   'Neat and tidy! Every book in its place.',
    'bookrun.won.2':   'Well done! Now everyone can find them.',
    'bookrun.p.ramp':   'A ramp! The books slide down a slope.',
    'bookrun.p.long':   'A long ramp. The books slide a long way down it.',
    'bookrun.p.curve':  'A curve. It turns falling books to the side.',
    'bookrun.p.funnel': 'A funnel. It catches the books and drops them through the middle.',
    'bookrun.p.spring': 'A spring! Boing! It bounces the books up into the air.',
    'bookrun.p.fan':    'A fan. Whoosh! It blows the books sideways.',
    'bookrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'bookrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Library Train
    'libtrain.pick': 'All aboard the Library Train! Story words are made of beats too. Pick a game.',
    'libtrain.done': 'Toot toot! You are a library beat star!',

    // Rhyme Time
    'rhyme.intro':   'Rhyme Time! Words that rhyme sound the same at the end, like cat and hat. Listen to my word, then tap the picture that rhymes with it.',
    'rhyme.tap':     'Tap the picture that rhymes.',
    'rhyme.no.0':    "Hmm, that doesn't rhyme. Listen to the end of the words, and try again.",
    'rhyme.no.1':    'Not that one. Listen again!',
    'rhyme.allDone': 'Brilliant rhyming! You have super listening ears.',

    // Sound Shelves
    'shelves.intro': 'Sound Shelves! Say what each picture is, and listen to its very first sound. Then put it on the shelf that starts the same way.',
    'shelves.no':    'Hmm. Say it slowly, and listen to the very first sound.',
    'shelves.done':  'All the shelves are tidy! You are a super listener.'
  });

  // Rhyme Time: pairs of rhyming pictures (all drawn in LibArt.PICS).
  const RHYMES = [['cat', 'hat'], ['dog', 'frog'], ['boat', 'coat'], ['car', 'star'], ['bee', 'tree'], ['moon', 'spoon'], ['cake', 'snake'], ['mouse', 'house'],
    ['fish', 'dish'], ['clock', 'sock'], ['hen', 'pen'], ['ball', 'wall'], ['sun', 'bun'], ['shell', 'bell'], ['duck', 'truck']];
  RHYMES.forEach(([a, b]) => {
    L['rhyme.yes.' + a] = `${cap(a)} and ${b}! They rhyme!`;
    [a, b].forEach(w => { L['rhyme.ask.' + w] = `${cap(w)}. What rhymes with ${w}?`; L['rhyme.name.' + w] = cap(w) + '.'; });
  });

  // Sound Shelves: each shelf's letter, its picture (the first sound) and the pictures that go on it.
  const SHELVES = {
    s: { pic: 'sun',   colour: '#e53935', items: ['sock', 'snake', 'six'] },
    a: { pic: 'apple', colour: '#1e5bd6', items: ['ant', 'arrow', 'anchor'] },
    t: { pic: 'tap',   colour: '#ffb300', items: ['tiger', 'teddy', 'tomato', 'ten'] },
    p: { pic: 'pig',   colour: '#2e9e4f', items: ['panda', 'penguin', 'pencil', 'pen'] }
  };
  Object.entries(SHELVES).forEach(([l, sh]) => {
    const say = SOUNDS[l].say;
    ssml('shelves.bin.' + l, `${cap(say)}, like ${sh.pic}!`, l);
    sh.items.forEach(id => {
      L['shelves.name.' + id] = cap(id) + '.';
      ssml('shelves.yes.' + id, `Yes! ${cap(id)} starts with ${say}, like ${sh.pic}.`, l);
    });
  });
  SPOT_IDS.forEach(id => {
    const n = LA.SPOTS[id].name;
    L['lib.sticker.' + id] = id === 'desk' ? 'You earned the Miss Rosa sticker!' : `You earned the ${n.toLowerCase()} sticker!`;
    L['lib.name.' + id] = n + '!';
    L['lib.find.' + id] = id === 'desk' ? 'Tap Miss Rosa to find this sticker.' : `Tap the ${n.toLowerCase()} to find this sticker.`;
  });

  // Pip wears his reading glasses and library card on every library screen.
  ['libroom', 'libStory', 'bookrun', 'libtrain', 'rhyme', 'shelves'].forEach(s => { A.screenWorld[s] = 'library'; });
  const COMMON = { world: 'library', back: 'libroom' };

  // =====================================================================
  // My Library Card: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const page = inner => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <defs><clipPath id="lib-pg"><rect width="1200" height="660" rx="30"/></clipPath></defs><g clip-path="url(#lib-pg)">${inner}</g></svg>`;
  const say = (x, y, t, c = '#c2185b', size = 64) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const pip = (x, y, w) => LA.pipAt(x, y, w);
  const mum = () => window.SchoolArt.pipMum;
  const room = (floorY = 520) => LA.room(1200, 660, floorY);
  const star = (x, y, r = 16) => `<path d="${LA.star(r, r * .45)}" transform="translate(${x} ${y})" fill="#ffd21f" ${S3}/>`;
  const kid = (i, x, y, s = 1, book = null) => at(x, y, s, `${BA.face(i, 30)}${book ? `<g transform="translate(0 44) scale(.5)">${LA.cover(book)}</g>` : ''}`);
  // Pip's bed, with a moon in the window (base at 0,0, about 420 wide).
  const bedroom = `<rect width="1200" height="660" fill="#3b4a8a"/><rect y="520" width="1200" height="140" fill="#6b5b8a"/><path d="M0 520 H1200" stroke="${OL}" stroke-width="5"/>
    <g transform="translate(980 300)"><rect x="-110" y="-150" width="220" height="180" rx="10" fill="#1b2a5a" ${S}/><path d="M24 -110 Q-26 -100 -22 -60 Q-16 -18 30 -20 Q0 -40 0 -66 Q0 -96 24 -110 Z" fill="#fff3a0" ${S3}/>
      ${star(-60, -100, 10)}${star(60, -40, 8)}<path d="M0 -150 V30 M-110 -60 H110" stroke="#c3cad6" stroke-width="8"/></g>
    <rect x="160" y="300" width="22" height="260" rx="6" fill="${'#8b5a2b'}" ${S3}/><rect x="760" y="380" width="22" height="180" rx="6" fill="#8b5a2b" ${S3}/>
    <rect x="160" y="300" width="80" height="200" rx="20" fill="#8b5a2b" ${S}/><rect x="180" y="440" width="600" height="80" rx="14" fill="#fff" ${S}/>`;
  const PAGES = [
    // 1. Arriving at the front desk
    () => page(`${room()}<g transform="translate(220 520)">${LA.bookshelf(300, 3, 100, 2)}</g><g transform="translate(1060 520)">${LA.bookshelf(260, 3, 100, 7)}</g>
      ${tap('beep', at(720, 590, .95, LA.desk(true)))}
      ${tap('woof', at(320, 640, 1, mum()))}${pip(380, 330, 220)}`),
    // 2. Pip's very own library card
    () => page(`${room(560)}<g transform="translate(1080 560)">${LA.bookshelf(240, 3, 100, 4)}</g>
      ${tap('sparkle', at(640, 300, 2.3, LA.card()))}
      ${star(330, 110)}${star(960, 80, 20)}${star(1000, 500)}${star(300, 520, 12)}
      ${pip(60, 340, 230)}${tap('woof', at(1060, 650, .9, mum()))}`),
    // 3. The picture-book box
    () => page(`${room()}<g transform="translate(600 520)">${LA.windowArt(260, 200)}</g>
      ${tap('page', at(620, 620, 1.35, LA.bookBox(true)))}
      ${pip(130, 320, 230)}${tap('pop', at(1010, 400, 1.1, LA.cover('#2e9e4f', `<g transform="scale(.36)">${LA.dragonPic}</g>`)))}
      ${tap('pop', at(1090, 470, 1.1, LA.cover('#e53935', `<g transform="scale(.42)">${Art.picto('fire', 0, 0, 1)}</g>`)))}
      ${tap('pop', at(1000, 540, 1.1, LA.cover('#30364a', `<g transform="translate(0 -4) scale(.36)">${LA.ITEMS.pirate}</g>`)))}`),
    // 4. Quiet voices
    () => page(`${room()}<g transform="translate(980 520)">${LA.bookshelf(300, 3, 100, 9)}</g>
      ${at(330, 620, 1.2, LA.beanbag(false))}${kid(0, 260, 490, 1.2, '#8e5bd6')}${kid(3, 400, 500, 1.2, '#ff8a3d')}
      ${pip(620, 300, 240)}${say(740, 140, 'Shh!', '#1e5bd6', 110)}
      ${tap('pop', at(990, 600, .7, LA.bookworm(true)))}`),
    // 5. Story time on the rug
    () => page(`${room(480)}<g transform="translate(160 480)">${LA.bookshelf(260, 3, 100, 3)}</g><g transform="translate(1050 480)">${LA.bookshelf(260, 3, 100, 6)}</g>
      ${at(600, 640, 1.4, '<ellipse cy="-20" rx="200" ry="44" fill="#8e5bd6" stroke="#1b2233" stroke-width="5"/><ellipse cy="-20" rx="150" ry="30" fill="#b48cf0"/><ellipse cy="-20" rx="90" ry="17" fill="#ffd21f"/>')}
      ${tap('roar', at(600, 560, 1.2, LA.rosa(false, true)))}
      ${kid(1, 420, 600, 1.2)}${kid(5, 790, 600, 1.2)}${kid(2, 900, 560, 1.1)}${pip(230, 410, 200)}
      ${say(870, 180, 'Roar!', '#2e9e4f', 70)}`),
    // 6. Scanning the books out
    () => page(`${room()}<g transform="translate(1080 520)">${LA.bookshelf(240, 3, 100, 1)}</g>
      ${tap('beep', at(520, 600, 1.1, LA.desk(true)))}
      ${pip(760, 330, 220)}${tap('woof', at(1000, 650, .95, mum()))}
      ${say(300, 140, 'Beep!', '#e53935', 70)}`),
    // 7. Reading at bedtime
    () => page(`${bedroom}
      ${at(560, 520, 1.1, `<g>${tap('woof', `<g transform="translate(60 0)">${mum()}</g>`)}</g>`)}
      ${pip(250, 250, 230)}<path d="M180 440 H780 V520 H180 Z" fill="#7fb8e6" stroke="${OL}" stroke-width="5"/>
      ${tap('page', at(470, 380, 1.1, LA.openBook('#1e5bd6', `<g transform="translate(-36 -4) scale(.36)">${LA.dragonPic}</g><g transform="translate(40 -4) scale(.4)">${LA.castlePic}</g>`, false)))}
      ${tap('sparkle', at(560, 330, .6, LA.ITEMS.bookmark))}`),
    // 8. Bringing the books back
    () => page(`${room()}<g transform="translate(190 520)">${LA.bookshelf(280, 3, 100, 5)}</g>
      ${tap('page', at(660, 600, 1.15, LA.returns(true)))}
      ${pip(820, 320, 230)}${tap('woof', at(1080, 650, .9, mum()))}
      ${tap('pop', at(380, 560, .8, LA.bookBox(false)))}`)
  ];
  Story.mount(Object.assign({ screen: 'libStory', colour: '#c2185b', cls: 'lib-story', lines: { end: 'lib.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(30 36) scale(.3)">${LA.card()}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'lib.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Book Run: books slide out of the returns chute onto the shelf of their colour (not into the fish tank)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  // Each puzzle's books (and its shelf) have their own colour.
  const RUN_COLOURS = ['#e53935', '#1e5bd6', '#2e9e4f', '#8e5bd6', '#ff8a3d', '#0a8fb0'];
  const colourOf = level => RUN_COLOURS[(level.hose * 3 + level.goal) % RUN_COLOURS.length];
  let runColour = RUN_COLOURS[0];
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#ffd21f" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-28 -46) scale(.6) rotate(-20)">${LA.runBook('#e53935')}</g><g transform="translate(10 -24) scale(.6) rotate(30)">${LA.runBook('#e53935')}</g>
    <g transform="translate(0 58) scale(.42)">${LA.goalShelf(2, false, '#e53935')}</g></svg>`;
  const runTheme = {
    board(ctx) { // the library wall: cream, with shelves of books along the top and a wooden floor
      ctx.fillStyle = '#fdf1e1'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(201,139,78,.25)';
      for (let x = 40; x < W; x += 340) ctx.fillRect(x, 120, 260, 16);
      LA.BOOKC.forEach((c, i) => { ctx.fillStyle = c; ctx.globalAlpha = .28; for (let x = 52 + i * 30; x < W; x += 340) if ((x - 52) % 340 < 240) ctx.fillRect(x, 70, 22, 50); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(243,220,192,.7)'; ctx.fillRect(0, H - 130, W, 130);
      ctx.fillStyle = '#d9a66b'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // the returns chute at the top, with books waiting in it
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      runColour = colourOf(level);
      [0, 1, 2].forEach(i => drawImg(ctx, LA.bookImage(runColour), x - 22 + i * 22, 12, 22, 26));
      poly(ctx, [{ x: x - 44, y: 22 }, { x: x + 44, y: 22 }, { x: x + 34, y: 52 }, { x: x - 34, y: 52 }], '#1e5bd6');
      poly(ctx, [{ x: x - 16, y: 52 }, { x: x + 16, y: 52 }, { x: x + 12, y: 64 }, { x: x - 12, y: 64 }], '#14264f');
      line(ctx, x - 30, 36, x + 30, 36, '#fff', 4);
      if (dripping) line(ctx, x - 9, 58, x + 9, 58, '#ffd21f', 4);
    },
    ball(ctx, b) { drawImg(ctx, LA.bookImage(runColour), b.position.x, b.position.y, 2 * R + 6, 2 * R + 14, b.angle); },
    goal(ctx, st) {
      const { level, fx, won, now, hits } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 4 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 6 : 0;
      drawImg(ctx, LA.shelfImage(Math.min(hits, 3) * 2, won, colourOf(level)), x, H - 74 + bob + jump, 190, 147);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 6 : 0);
      drawImg(ctx, LA.tankImage(fx.shake > 0), x, H - 88, 170, 174);
    },
    splash: '#c98b4e',
    release() { Sfx.page(); },
    hit(ev, fx) { Sfx.drum(); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ffd21f', 1.2); },
    win(fx) { fx.chew = 0; Sfx.chime(); },
    tapGoal() { Sfx.drum(); },
    tapDecoy() { Sfx.splash(); },
    refuse: () => 'bookrun.no',
    intro: () => 'bookrun.want',
    winLine: () => 'bookrun.won.' + Math.floor(Math.random() * 3)
  };
  BR.mount(Object.assign({ screen: 'bookrun', lines: 'bookrun', colour: '#f07a1a', icon: RUN_ICON, pack: BR.packs.library, theme: runTheme, cls: 'lib-run' }, COMMON));

  // =====================================================================
  // Library Train: story words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (short "ih", "cull", "row", "purr").
  // alone / carrier / ipa: see the Rescue Station words in js/train.js and the puppy words in js/puppies.js.
  WordTrain.packs.library = {
    id: 'library',
    words: [
      { id: 'story',     word: 'story',     beats: ['sto', 'ry'],          say: ['store', 'ree'],        pic: 'story' },
      { id: 'bookmark',  word: 'bookmark',  beats: ['book', 'mark'],       say: ['book', 'mark'],        pic: 'bookmark' },
      { id: 'beanbag',   word: 'beanbag',   beats: ['bean', 'bag'],        say: ['bean', 'bag'],         pic: 'beanbag' },
      { id: 'dragon',    word: 'dragon',    beats: ['drag', 'on'],         say: ['drag', 'gun'],         pic: 'dragon' },
      { id: 'pirate',    word: 'pirate',    beats: ['pi', 'rate'],         say: ['pie', 'rut'],          pic: 'pirate' },
      { id: 'princess',  word: 'princess',  beats: ['prin', 'cess'],       say: ['prin', 'sess'],        pic: 'princess' },
      { id: 'giant',     word: 'giant',     beats: ['gi', 'ant'],          say: ['jy', 'unt'],           pic: 'giant', alone: [1], ipa: { 1: 'ənt' } },
      { id: 'wizard',    word: 'wizard',    beats: ['wiz', 'ard'],         say: ['wiz', 'zud'],          pic: 'wizard' },
      { id: 'library',   word: 'library',   beats: ['li', 'bra', 'ry'],    say: ['lie', 'bruh', 'ree'],  pic: 'library' },
      { id: 'magazine',  word: 'magazine',  beats: ['mag', 'a', 'zine'],   say: ['mag', 'guh', 'zeen'],  pic: 'magazine' },
      { id: 'poetry',    word: 'poetry',    beats: ['po', 'e', 'try'],     say: ['poe', 'ih', 'tree'],   pic: 'poetry', alone: [1], carrier: { 1: 'it' } },
      { id: 'adventure', word: 'adventure', beats: ['ad', 'ven', 'ture'],  say: ['add', 'ven', 'cher'],  pic: 'adventure' }
    ]
  };
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 92) scale(.5)">${LA.dragonPic}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'libtrain', pack: WordTrain.packs.library, colour: '#1e5bd6', tile: TRAIN_TILE, picture: w => LA.itemSvg(w.pic), cls: 'lib-train',
    lines: { pick: 'libtrain.pick', done: 'libtrain.done' } }, COMMON));

  // =====================================================================
  // Sound Shelves: drag each picture to the shelf for its first sound, s, a, t or p (the sorting engine)
  // =====================================================================
  const SHELF_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-4 4) scale(.82)">${LA.soundShelf('s', SHELVES.s.colour, 'sun').replace(/<\/?svg[^>]*>/g, '')}</g>
    <g transform="translate(34 30) scale(.3)">${LA.PICS.sock}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'shelves', colour: '#2e9e4f', tile: SHELF_TILE, cls: 'lib-shelves',
    lines: { intro: 'shelves.intro', no: 'shelves.no', done: 'shelves.done' },
    round(level) {
      // s and a first, then t, then p: the order children learn the sounds in.
      const letters = ['s', 'a', 't', 'p'].slice(0, [2, 3, 4][level]);
      const ids = letters.flatMap(l => shuffle(SHELVES[l].items).slice(0, 2).map(id => ({ id, l })));
      return {
        bins: letters.map(l => ({ id: l, art: LA.soundShelf(l, SHELVES[l].colour, SHELVES[l].pic), name: 'shelves.bin.' + l, label: l, cls: 'shelf-' + l })),
        items: ids.map(({ id, l }) => ({ id, bin: l, line: 'shelves.yes.' + id, name: 'shelves.name.' + id, label: cap(id), art: LA.picSvg(id) }))
      };
    },
    onRight() { Sfx.chime(); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Rhyme Time: Pip says a word; tap the picture that rhymes with it
  // =====================================================================
  const RH_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-26 -16) scale(.42)">${LA.PICS.cat}</g><g transform="translate(26 -16) scale(.42)">${LA.PICS.hat}</g>
    <path d="M-40 34 Q0 58 40 34" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="${LA.star(12, 5)}" transform="translate(0 30)" fill="#ffd21f" ${S3}/></svg>`;
  A.addGame('rhyme', '#8e5bd6', RH_TILE, COMMON);
  const SPEAK = `<svg viewBox="-32 -32 64 64"><path d="M-18 -8 H-8 L6 -20 V20 L-8 8 H-18 Z" fill="#fff" ${S3}/><path d="M12 -10 Q20 0 12 10 M18 -18 Q32 0 18 18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`;
  A.screens.rhyme = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('rhyme'), n = [4, 5, 6][level];
    // n pairs; each round shows one word of a pair, its rhyme and two pictures from other pairs.
    const rounds = shuffle(RHYMES).slice(0, n).map(pair => {
      const [word, match] = Math.random() < .5 ? pair : [pair[1], pair[0]];
      const others = shuffle(RHYMES.filter(p => p !== pair)).slice(0, 2).map(p => p[Math.random() < .5 ? 0 : 1]);
      return { word, match, set: pair[0], cards: shuffle([match, ...others]) };
    });
    scene().innerHTML = `<div class="rhyme">
      <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${LA.room(1600, 900, 640)}
        <g transform="translate(150 640)">${LA.bookshelf(260, 4, 100, 3)}</g><g transform="translate(1450 640)">${LA.bookshelf(260, 4, 100, 8)}</g></svg>
      <div class="rh-top"><button class="rh-word" aria-label="Say the word again"></button><span class="rh-speak">${SPEAK}</span></div>
      <div class="rh-cards"></div>
      <div class="rh-dots">${rounds.map(() => '<span></span>').join('')}</div></div>`;
    const root = scene().querySelector('.rhyme'), wordEl = root.querySelector('.rh-word'), cardsEl = root.querySelector('.rh-cards'), dots = [...root.querySelectorAll('.rh-dots span')];
    let i = 0, busy = true;
    const book = id => `<svg viewBox="-90 -70 180 140">${LA.openBook('#c2185b', `<g transform="translate(-36 -2) scale(.46)">${LA.PICS[id]}</g><g transform="translate(38 -2) scale(.46)"><text y="20" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="58" fill="#c2185b">?</text></g>`, false)}</svg>`;
    async function ask() {
      const r = rounds[i];
      await A.say('rhyme.ask.' + r.word);
      if (!alive()) return;
      busy = false;
      A.Hint.set([...cardsEl.querySelectorAll('.rh-card')], 'rhyme.tap');
    }
    async function show() {
      const r = rounds[i];
      busy = true;
      wordEl.innerHTML = book(r.word);
      wordEl.classList.remove('pop'); void wordEl.offsetWidth; wordEl.classList.add('pop');
      cardsEl.innerHTML = r.cards.map((id, k) => `<button class="rh-card" data-id="${id}" style="animation-delay:${.2 + k * .1}s" aria-label="${cap(id)}">${LA.picSvg(id)}</button>`).join('');
      cardsEl.querySelectorAll('.rh-card').forEach(c => c.onclick = () => pick(c));
      Sfx.page();
      if (i === 0) { await A.say('rhyme.intro'); if (!alive()) return; }
      ask();
    }
    async function pick(card) {
      if (busy) return;
      const r = rounds[i], id = card.dataset.id;
      busy = true; A.Hint.clear(); Sfx.tap();
      if (id === r.match) {
        card.classList.add('right'); Sfx.chime(); A.Pip.mood('cheer'); A.Pip.act('jump');
        wordEl.innerHTML = `<svg viewBox="-90 -70 180 140">${LA.openBook('#c2185b', `<g transform="translate(-36 -2) scale(.46)">${LA.PICS[r.word]}</g><g transform="translate(38 -2) scale(.46)">${LA.PICS[r.match]}</g>`, false)}</svg>`;
        dots[i].classList.add('on');
        await A.say('rhyme.yes.' + r.set);
        if (!alive()) return;
        i++;
        if (i < rounds.length) { show(); return; }
        A.Pip.act('dance'); A.confetti();
        await A.say('rhyme.allDone');
        if (alive()) A.gameDone('rhyme');
      } else {
        card.classList.remove('no'); void card.offsetWidth; card.classList.add('no');
        Sfx.boing(); A.Pip.mood('thinking');
        await A.say('rhyme.name.' + id); if (!alive()) return;
        await A.say('rhyme.no.' + Math.floor(Math.random() * 2)); if (!alive()) return;
        ask();
      }
    }
    wordEl.onclick = () => { if (!busy) { busy = true; A.Hint.clear(); ask(); } };
    show();
  };

  // =====================================================================
  // The library: visit six places, and pick a game
  // =====================================================================
  const PLACE = { // all inside x 200 to 1400, so 4:3 screens show every place; bases at or above y 700 (game tiles below)
    desk:    { x: 340,  y: 690, s: .88, art: () => LA.desk(false), hit: [-170, -330, 340, 334] },
    returns: { x: 590,  y: 640, s: .78, art: () => LA.returns(false), hit: [-100, -236, 200, 244] },
    rug:     { x: 830,  y: 700, s: .86, art: () => LA.rug(false), hit: [-200, -340, 400, 340] },
    box:     { x: 1100, y: 690, s: .72, art: () => LA.bookBox(false), hit: [-150, -180, 300, 180] },
    beanbag: { x: 1300, y: 690, s: .78, art: () => LA.beanbag(false), hit: [-130, -240, 280, 244] },
    frieze:  { x: 800,  y: 250, s: 1.1, art: () => LA.frieze(false), hit: [-500, -70, 1000, 90] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M-54 -40 Q-28 -56 0 -40 Q28 -56 54 -40 V48 Q28 34 0 48 Q-28 34 -54 48 Z" fill="${on ? '#c2185b' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-44 -38 Q-22 -48 0 -36 Q22 -48 44 -38 V38 Q22 28 0 40 Q-22 28 -44 38 Z" fill="#fff" opacity="${on ? 1 : 0.6}"/><path d="M0 -36 V40" stroke="${on ? OL : '#c3cad6'}" stroke-width="3"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(-6 46) scale(.42)">${LA.bookworm(true).replace(/<path d="M-70 0[^>]*>|<path d="M-62 -40[^>]*>|<path d="M-62 -30 H62"[^>]*>/g, '')}</g>
    ${on ? '' : `<text y="58" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const libGames = () => A.worldGames('library');
  const badgeEarned = () => SPOT_IDS.every(id => P().library.includes(id)) && libGames().every(g => P().games.includes(g.id));

  function homeArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().library.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="lib-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + (hx + hw - 16) * p.s} ${p.y + (hy + 20) * p.s})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx * p.s}" y="${p.y + hy * p.s}" width="${hw * p.s}" height="${hh * p.s}" fill="transparent"/>
      </g>`;
    }).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The library">
      ${Art.defs()}
      ${LA.room(1600, 900, 600)}
      <g transform="translate(90 600)">${LA.bookshelf(200, 4, 100, 1)}</g><g transform="translate(1510 600)">${LA.bookshelf(200, 4, 100, 6)}</g>
      <g transform="translate(830 450)">${LA.windowArt(240, 150)}</g>
      <g transform="translate(1100 500)">${LA.bookshelf(300, 2, 90, 4)}</g>
      ${spots}
      <g class="lib-worm tappable"><g class="worm-bob" transform="translate(590 457) scale(.62)">${LA.bookworm(false)}</g><rect x="540" y="360" width="110" height="96" fill="transparent"/></g>
    </svg>`;
  }

  // A sticker for each place in the library, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().library.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${LA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${LA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${LA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('lib.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('library')) return;
    P().badges.push('library'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Bookworm badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Bookworm badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('lib.badge');
  }

  // What changes while a place is talking: Miss Rosa waves and the scanner beeps, the picture books pop up, the big
  // storybook opens, the lamp comes on, the alphabet lights up and a book slides into the returns slot.
  const LIVE = { desk: () => LA.desk(true), box: () => LA.bookBox(true), rug: () => LA.rug(true), beanbag: () => LA.beanbag(true), frieze: () => LA.frieze(true), returns: () => LA.returns(true) };
  let welcomed = false;
  A.screens.libroom = (arg, alive) => {
    scene().innerHTML = `<div class="lib-home">${homeArt()}
      <div class="world-tiles">${libGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.lib-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    const worm = root.querySelector('.lib-worm');
    worm.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear(); Sfx.sproing();
      worm.querySelector('.worm-bob').innerHTML = LA.bookworm(true);
      await A.say('lib.worm');
      if (!alive()) return;
      worm.querySelector('.worm-bob').innerHTML = LA.bookworm(false);
      busy = false;
    });
    root.querySelectorAll('.lib-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      art.innerHTML = LIVE[id]();
      sound(id);
      await A.say('lib.fact.' + id);
      if (!alive()) return;
      art.innerHTML = PLACE[id].art();
      if (!P().library.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.libroom('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.lib-spot[data-s="rug"]')], 'lib.hint');
    if (!welcomed) { welcomed = true; A.say('lib.welcome'); } else A.say('lib.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The library page in the sticker book, and its badge ----------
  Rewards.pages.library = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="lib" data-id="${id}" aria-label="${LA.SPOTS[id].name}">${LA.sticker(id, P().library.includes(id))}<span>${P().library.includes(id) ? LA.SPOTS[id].name : '?'}</span></button>`).join('')
      + libGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'lib') return false;
      if (P().library.includes(id)) { Sfx.sparkle(); A.say('lib.name.' + id); }
      else { Sfx.boing(); A.say('lib.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'library', name: 'Bookworm', svg: BADGE, earned: () => P().badges.includes('library') || badgeEarned(), how: 'lib.badge.how' });

  window.Library = { SPOT_IDS, BADGE, badgeEarned, RHYMES, SHELVES };
})();
