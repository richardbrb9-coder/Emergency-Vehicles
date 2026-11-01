// Pip does Monster Maths: the Monster Town world pack. Words, pictures, levels and the town's home screen, plus
// the two counting games of its own (Feed the Monster and Monster Shapes). The story, Gobble Run, Monster Train
// and Shape Snacks come from the shared engines (Story, BallRun, WordTrain, Sorter).
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

// ---------- Gobble Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Snack Run puzzles mirrored left to right, each checked solvable by running its physics.
  // nums: the number on each ball, in the order they leave the number machine. The monster burps the total of the first three it eats.
  // decoyMonster: a monster asleep under the chute; balls that land on it are lost.
  const ml = (monster, decoyMonster, nums, p) => Object.assign({ balls: 6, monster, decoyMonster, nums }, p);
  BR.packs.monsters = {
    id: 'monsters',
    free: { hose: 1, goal: 11, balls: 8, monster: 'gobble', nums: [1, 2, 3, 2, 1, 3, 2, 1] },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      ml('gobble', null,     [1, 1, 1, 1, 1, 1], { hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      ml('zug', null,        [1, 2, 1, 2, 1, 2], { hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      ml('trixie', 'boxy',   [2, 1, 2, 1, 2, 1], { hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      ml('boxy', 'twinkle',  [2, 2, 1, 2, 2, 1], { hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      // 5 to 8: two pieces
      ml('twinkle', 'hexie', [1, 2, 3, 1, 2, 3], { hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      ml('hexie', 'gobble',  [2, 2, 2, 2, 2, 2], { hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      ml('gobble', 'zug',    [3, 1, 3, 1, 3, 1], { hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      ml('zug', 'trixie',    [2, 3, 2, 3, 2, 3], { hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      // 9 to 12: a see-saw or a bucket
      ml('trixie', 'gobble', [3, 2, 3, 2, 3, 2], { hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      ml('boxy', null,       [3, 3, 2, 3, 3, 2], { hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      ml('twinkle', 'zug',   [3, 3, 3, 3, 3, 3], { hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] }),
      ml('hexie', 'boxy',    [3, 2, 3, 2, 3, 2], { hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] })
    ]
  };
  BR.ballNumber = (level, idx) => level.nums[idx % level.nums.length];
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const SW = w => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const MA = window.MonsterArt, MON = MA.MONSTERS, IDS = MA.IDS;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().monsters) P().monsters = [];
  const shuffle = Sorter.shuffle;
  const N = n => NUMBER_WORDS[n];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const SOUND = { gobble: 'gobble', zug: 'roar', trixie: 'sproing', boxy: 'clank', twinkle: 'sparkle', hexie: 'boing' };
  const sound = id => { const s = SOUND[id]; if (s === 'clank') Sfx.clank(3); else (Sfx[s] || Sfx.pop).call(Sfx); };

  // ---------- Words ----------
  const L = CONTENT.lines;
  for (let n = 1; n <= 10; n++) L['mon.n.' + n] = cap(N(n)) + '!';
  Object.assign(L, {
    'monsters.welcome': 'Welcome to Monster Town! Tap a monster to say hello, or pick a game at the bottom.',
    'monsters.back':    'What shall we do in Monster Town now?',
    'monsters.hint':    'Tap a monster to say hello!',
    'monsters.pip':     'Woof! These monsters love numbers. Tap one to count with it.',
    'monsters.fact.gobble':  "Hello, I'm Gobble! I'm round like a circle, and I have one big eye.",
    'monsters.fact.zug':     "I'm Zug! I'm a square, and I have two pointy horns. One, two!",
    'monsters.fact.trixie':  "Hi, I'm Trixie! I'm a triangle, and I have three eyes. One, two, three!",
    'monsters.fact.boxy':    "I'm Boxy! I'm a rectangle, and I stand on four legs. One, two, three, four!",
    'monsters.fact.twinkle': "I'm Twinkle! I'm a star, and I have five points. One, two, three, four, five!",
    'monsters.fact.hexie':   "I'm Hexie! I'm a hexagon, so I have six sides. One, two, three, four, five, six!",
    'monsters.badge':     'You earned the Number Champion badge! The monsters think you are brilliant at maths!',
    'monsters.badge.how': 'Meet all six monsters and play every Monster Maths game to earn the Number Champion badge.',
    'book.world.monsters': 'Your Monster Maths stickers! Meet the monsters and play the games to fill this page.',

    'games.monStory': 'Hungry Monsters',
    'games.gobble':   'Gobble Run',
    'games.montrain': 'Monster Train',
    'games.monfeed':  'Feed the Monster',
    'games.monbuild': 'Monster Shapes',
    'games.monsnack': 'Shape Snacks',

    // The story
    'mon.story.1': 'Pip has found a funny little town over the hill. The sign says Monster Town!',
    'mon.story.2': 'Out pops a round green monster. This is Gobble! Gobble has one big eye.',
    'mon.story.3': "Here come Gobble's friends. Zug is a square with two horns. Trixie is a triangle with three eyes. One, two, three!",
    'mon.story.4': "Monsters don't eat sandwiches. They eat numbers! Crunch, munch, a number four for lunch!",
    'mon.story.5': 'Gobble is still hungry. Pip has a basket of number balls. Count them with Pip: one, two, three, four, five!',
    'mon.story.6': 'Gobble eats two balls, then three more. Two and three make five! Burp!',
    'mon.story.7': "Everyone is full and happy. Thank you, Pip! Now it's time for a monster dance. Goodnight, Monster Town!",
    'mon.story.end': 'The end! Thank you for reading with me.',

    // Gobble Run (ball run)
    'gobble.pick':    'Gobble Run! Build your own, or try one of my puzzles.',
    'gobble.free':    'Drag pieces onto the board. Then blow my whistle to send the number balls down!',
    'gobble.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'gobble.go':      'Here come the numbers!',
    'gobble.flip':    'Tap a piece to turn it around.',
    'gobble.again':   'Oops! The numbers missed. Move the pieces and try again.',
    'gobble.hint':    "Here's a clue. Try putting a piece where it glows.",
    'gobble.allDone': 'You solved all my puzzles! Every monster is full of numbers!',
    'gobble.bolted':  'That piece is bolted on. Build around it!',
    'gobble.cleared': "All clear! Let's build something new.",
    'gobble.p.ramp':   'A ramp! Balls roll down a slope.',
    'gobble.p.long':   'A long ramp. The balls roll a long way down it.',
    'gobble.p.curve':  'A curve. It turns falling balls to the side.',
    'gobble.p.funnel': 'A funnel. It catches the balls and drops them through the middle.',
    'gobble.p.spring': 'A spring! Boing! It bounces the balls up into the air.',
    'gobble.p.fan':    'A fan. Whoosh! It blows the balls sideways.',
    'gobble.p.seesaw': 'A see-saw. When a ball lands on one end, it tips!',
    'gobble.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Feed the Monster
    'monfeed.intro':    'The monsters are hungry! Tap the cookies to feed them, and count with me.',
    'monfeed.yum':      "Yum! That's just right!",
    'monfeed.yum2':     'Delicious! Thank you!',
    'monfeed.add':      'Two plates of cookies! Feed me all of them, and count them all.',
    'monfeed.ask':      'How many cookies did I eat altogether?',
    'monfeed.tryagain': 'Not quite! Count the dots on my sign, and try again.',
    'monfeed.done':     'All the monsters are full up! Great counting!',

    // Monster Shapes
    'monbuild.intro':  "Let's build a monster out of shapes!",
    'monbuild.body':   "First, pick a shape for your monster's body.",
    'monbuild.eyes':   'How many eyes? Pick a number.',
    'monbuild.horns':  'Now pick some horns.',
    'monbuild.mouth':  'Pick a mouth.',
    'monbuild.legs':   'How many legs? Pick a number.',
    'monbuild.colour': 'Last of all, pick a colour.',
    'monbuild.done':   "Raaah! Your monster is ready. It's made of shapes! I've put it in My Pictures.",
    'monbuild.eyes.1': 'One eye!', 'monbuild.eyes.2': 'Two eyes!', 'monbuild.eyes.3': 'Three eyes!',
    'monbuild.legs.2': 'Two legs!', 'monbuild.legs.3': 'Three legs!', 'monbuild.legs.4': 'Four legs!',
    'monbuild.horns.triangle': 'Pointy triangle horns!',
    'monbuild.horns.circle':   'Bobbles made of circles!',
    'monbuild.horns.none':     'No horns at all!',
    'monbuild.mouth.smile':  'A big half circle smile!',
    'monbuild.mouth.rect':   'A rectangle mouth with square teeth!',
    'monbuild.mouth.zigzag': 'A zig-zag mouth with triangle teeth!',
    'monbuild.colour.green': 'Green!', 'monbuild.colour.orange': 'Orange!', 'monbuild.colour.purple': 'Purple!',
    'monbuild.colour.pink': 'Pink!', 'monbuild.colour.blue': 'Blue!',

    // Shape Snacks
    'monsnack.intro': 'Each monster eats just one shape. Drag each biscuit to the monster with the same shape.',
    'monsnack.no':    "Yuck! That's not my shape. Try another monster.",
    'monsnack.done':  'Every monster is full of shapes! Brilliant!',

    // Monster Train
    'montrain.pick': 'All aboard the Monster Train! Number words and shape words are made of beats too. Pick a game.',
    'montrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!'
  });
  for (let n = 1; n <= 10; n++) L['monfeed.want.' + n] = `I'm hungry! Please feed me ${N(n)} cookie${n > 1 ? 's' : ''}.`;
  for (let n = 2; n <= 10; n++) L['monfeed.made.' + n] = `Yes! That makes ${N(n)} altogether. Burp!`;
  for (let n = 3; n <= 9; n++) L['gobble.total.' + n] = `Burp! That makes ${N(n)} altogether!`;
  const SHAPE_NAMES = ['circle', 'square', 'triangle', 'rectangle', 'star', 'hexagon'];
  SHAPE_NAMES.forEach(s => { L['mon.shape.' + s] = `A ${s}!`; });
  IDS.forEach(id => {
    const m = MON[id];
    L['monsters.sticker.' + id] = `You earned the ${m.name} sticker!`;
    L['monsters.name.' + id] = `${m.name}!`;
    L['gobble.want.' + id] = `${m.name} is hungry for numbers! Roll the number balls into ${m.name}'s mouth.`;
    L['gobble.no.' + id] = `Shh! Don't wake that monster up. The numbers are for ${m.name}.`;
    L['monsnack.yes.' + id] = `${m.name} loves ${m.shape}s!`;
    L['monsnack.bin.' + id] = `${m.name} is a ${m.shape}.`;
  });
  L['gobble.freeOut'] = 'Burp! What else can you build?';

  // Pip wears the monster horns on every Monster Town screen.
  ['monsters', 'monStory', 'gobble', 'montrain', 'monfeed', 'monbuild', 'monsnack'].forEach(s => { A.screenWorld[s] = 'monsters'; });
  const COMMON = { world: 'monsters', back: 'monsters' };

  // =====================================================================
  // Hungry Monsters: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const pipAt = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip('monsters').replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const ground = `<path d="M0 500 Q300 470 600 495 T1200 490 V660 H0 Z" fill="#9fd88d"/><path d="M0 560 Q400 540 800 565 T1200 560 V660 H0 Z" fill="#8ccf78"/>`;
  const ball = (x, y, n, r = 34) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${MA.numColour(n)}" ${S}/><circle cx="${-r * .35}" cy="${-r * .35}" r="${r * .2}" fill="#fff" opacity=".5"/>
    <text y="${r * .36}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${r * 1.1}" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">${n}</text></g>`;
  const mon = (id, x, y, s, mood) => tap(SOUND[id], at(x, y, s, MA.monster(id, mood)));
  const basket = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-80 -40 H80 L64 30 H-64 Z" fill="#c98b4e" ${S}/><path d="M-72 -14 H72 M-66 10 H66" stroke="#a8622c" stroke-width="5"/><path d="M-60 -40 Q0 -110 60 -40" fill="none" ${SW(8)}/></g>`;
  const sign = (x, y, text) => `<g transform="translate(${x} ${y})"><rect x="-8" y="0" width="16" height="140" fill="#8b5a2b" ${S3}/><rect x="-190" y="-70" width="380" height="80" rx="14" fill="#8e5bd6" ${S}/>
    <text y="-15" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="44" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">${text}</text></g>`;
  const PAGES = [
    () => page('#d9ccff', `${Art.cloud(90, 60, .8)}${Art.cloud(900, 50, .7)}
      <path d="M0 420 Q300 340 620 400 T1200 380 V660 H0 Z" fill="#b39ddb"/>${ground}
      ${MA.house(700, 500, .9, '#ffb3c7', '#8e5bd6')}${MA.house(930, 480, .75, '#bfe6ff', '#f07a1a')}${MA.house(1110, 500, .65, '#fff6cc', '#2e9e4f')}
      ${sign(420, 420, 'MONSTER TOWN')}${MA.lolly(600, 560, .8, '#e86aa6')}${pipAt(30, 390, 200)}`),
    () => page('#d9ccff', `<path d="M0 420 Q300 340 620 400 T1200 380 V660 H0 Z" fill="#b39ddb"/>${ground}
      ${MA.house(560, 520, 1.3, '#ffb3c7', '#8e5bd6')}
      ${mon('gobble', 790, 470, 2.1, 'smile')}
      <path d="M690 260 l-30 -30 M720 230 l-10 -40 M880 230 l14 -40 M910 260 l34 -28" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>
      ${pipAt(120, 380, 200)}`),
    () => page('#d9ccff', `<path d="M0 420 Q300 340 620 400 T1200 380 V660 H0 Z" fill="#b39ddb"/>${ground}
      ${MA.house(130, 470, .7, '#bfe6ff', '#f07a1a')}
      ${mon('gobble', 330, 500, 1.5)}${mon('zug', 590, 500, 1.6)}${mon('trixie', 850, 500, 1.6)}
      ${pipAt(990, 390, 170)}`),
    () => page('#fff2cc', `${ground}${MA.house(160, 500, .9, '#bfe6ff', '#1e5bd6')}
      ${mon('boxy', 560, 480, 1.8, 'open')}
      <g transform="translate(760 330) rotate(12)">${MA.numeral(4, MA.numColour(4), 190)}</g>
      <path d="M640 260 l26 -10 M650 300 l30 4" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
      ${mon('twinkle', 980, 520, 1.3, 'munch')}${pipAt(260, 400, 170)}`),
    () => page('#d9ccff', `${ground}${mon('gobble', 900, 480, 1.9, 'open')}
      ${[1, 2, 3, 4, 5].map(n => ball(220 + n * 54, 500 - (n % 2) * 22, n, 30)).join('')}${basket(380, 560)}
      ${pipAt(60, 380, 180)}`),
    () => page('#fff2cc', `${ground}${mon('gobble', 880, 500, 1.9, 'burp')}
      <g font-family="Fredoka, sans-serif">${ball(160, 200, 2, 52)}
        <text x="260" y="222" text-anchor="middle" font-weight="700" font-size="80" fill="${OL}">+</text>${ball(360, 200, 3, 52)}
        <text x="460" y="222" text-anchor="middle" font-weight="700" font-size="80" fill="${OL}">=</text>${ball(560, 200, 5, 52)}</g>
      <g fill="${MA.numColour(2)}">${[0, 1].map(i => `<circle cx="${130 + i * 60}" cy="300" r="14" ${S3}/>`).join('')}</g>
      <g fill="${MA.numColour(3)}">${[0, 1, 2].map(i => `<circle cx="${300 + i * 60}" cy="300" r="14" ${S3}/>`).join('')}</g>
      <text x="1010" y="270" font-family="Fredoka, sans-serif" font-weight="700" font-size="60" fill="#8e5bd6" stroke="#fff" stroke-width="6" paint-order="stroke">BURP!</text>
      ${pipAt(200, 380, 180)}`),
    () => page('#3a3f7a', `<circle cx="1060" cy="110" r="60" fill="#fff6cc" ${S3}/>
      ${[[120, 80], [300, 140], [520, 60], [760, 120], [880, 50], [200, 230]].map(([x, y]) => `<path d="${MA.star(12, 5)}" transform="translate(${x} ${y})" fill="#ffd21f"/>`).join('')}
      <path d="M0 470 Q300 440 600 465 T1200 460 V660 H0 Z" fill="#4f7a4a"/>
      ${IDS.map((id, i) => `<g class="dance d${i % 2}">${mon(id, 120 + i * 150, 540 - (i % 2) * 20, 1.05)}</g>`).join('')}
      ${pipAt(990, 420, 180)}`)
  ];
  Story.mount(Object.assign({ screen: 'monStory', colour: '#8e5bd6', cls: 'mon-story', lines: { end: 'mon.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(26 22) scale(.42)">${MA.monster('gobble')}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'mon.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Gobble Run: number balls roll from the number machine into a monster's mouth
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, COLS, ROWS, R, NEED } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const ballOnCanvas = (ctx, x, y, n, rot = 0, r = R + 4) => {
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = MA.numColour(n); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = OL; ctx.stroke();
    ctx.font = `700 ${Math.round(r * 1.3)}px Fredoka, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeText(n, 0, 2); ctx.fillStyle = '#fff'; ctx.fillText(n, 0, 2);
    ctx.restore();
  };
  let eaten = [];
  const GOBBLE_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#8e5bd6" stroke-width="8" stroke-linecap="round"/>
    ${ball(-26, -46, 2, 12)}${ball(12, -16, 3, 12)}<g transform="translate(14 34) scale(.42)">${MA.monster('gobble', 'open')}</g></svg>`;
  const monTheme = {
    board(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f1ebff'); g.addColorStop(1, '#ddd0ff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(142,91,214,.22)';
      for (let c = 1; c < COLS; c++) for (let r = 1; r < ROWS; r++) { ctx.beginPath(); ctx.arc(c * CELL, r * CELL, 5, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#9fd88d'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) {
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      poly(ctx, [{ x: x - 46, y: -6 }, { x: x + 46, y: -6 }, { x: x + 42, y: 44 }, { x: x - 42, y: 44 }], '#8e5bd6');
      ctx.save(); ctx.font = '700 22px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('123', x, 28); ctx.restore();
      poly(ctx, [{ x: x - 20, y: 44 }, { x: x + 20, y: 44 }, { x: x + 14, y: 62 }, { x: x - 14, y: 62 }], '#5a606b');
      if (dripping) line(ctx, x - 12, 54, x + 12, 54, '#ffd21f', 4);
    },
    ball(ctx, b, level) { ballOnCanvas(ctx, b.position.x, b.position.y, BR.ballNumber(level, b.idx), b.angle); },
    goal(ctx, st) {
      const { level, fx, hits, won, now } = st, x = (level.goal + 1) * CELL;
      const mood = fx.burp > 0 ? 'burp' : fx.chew > 0 ? 'munch' : won ? 'smile' : 'open', bob = won ? Math.sin(now / 120) * 6 : 0;
      drawImg(ctx, MA.monsterImage(level.monster, mood), x, H - 104 + bob, 190, 216);
      // The sum so far, above the monster: 2 + 1 + 3 = 6
      const shown = hits ? eaten.slice(0, NEED) : [];
      if (!shown.length) return;
      const parts = shown.flatMap((n, i) => i ? ['+', n] : [n]);
      if (won && shown.length === NEED) parts.push('=', shown.reduce((a, b) => a + b, 0));
      const step = 44, w = parts.length * step, x0 = Math.max(30, Math.min(W - w - 10, x - w / 2)), y = H - 250;
      ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.strokeStyle = OL; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(x0 - 14, y - 34, w + 28, 68, 18); ctx.fill(); ctx.stroke();
      parts.forEach((p, i) => {
        const px = x0 + i * step + step / 2;
        if (typeof p === 'number') ballOnCanvas(ctx, px, y, p, 0, i === parts.length - 1 && won ? 24 : 19);
        else { ctx.font = '700 36px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = OL; ctx.fillText(p, px, y + 2); }
      });
      ctx.restore();
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 10 : 0);
      drawImg(ctx, MA.monsterImage(level.decoyMonster, fx.shake > 0 ? 'smile' : 'sleep'), x, H - 96, 170, 194);
    },
    splash: '#b39ddb',
    release() { Sfx.plop(); },
    hit(ev, fx, level) {
      if (ev.n === 1) eaten = [];
      eaten.push(BR.ballNumber(level, ev.idx));
      Sfx.gobble(); fx.chew = 30; fx.burst(ev.x, ev.y, 8, MA.numColour(eaten[eaten.length - 1]), 1.2);
    },
    hitLine: (ev, level) => 'mon.n.' + BR.ballNumber(level, ev.idx),
    win(fx) { fx.chew = 0; fx.burp = 70; setTimeout(() => Sfx.burp(), 700); },
    tapGoal(level) { sound(level.monster); },
    tapDecoy() { Sfx.boing(); },
    refuse: level => 'gobble.no.' + level.monster,
    intro: level => 'gobble.want.' + level.monster,
    winLine: () => 'gobble.total.' + eaten.slice(0, NEED).reduce((a, b) => a + b, 0),
    freeLine: () => 'gobble.total.' + eaten.slice(0, NEED).reduce((a, b) => a + b, 0)
  };
  // fx.burp counts down like fx.chew (the engine only counts chew and shake), so count it here.
  const goal0 = monTheme.goal;
  monTheme.goal = (ctx, st) => { if (st.fx.burp > 0) st.fx.burp--; goal0(ctx, st); };
  BR.mount(Object.assign({ screen: 'gobble', lines: 'gobble', colour: '#8e5bd6', icon: GOBBLE_ICON, pack: BR.packs.monsters, theme: monTheme, cls: 'mon-run' }, COMMON));

  // =====================================================================
  // Monster Train: number and shape words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (a short "ih" for unstressed vowels).
  // alone / carrier: see the Rescue Station words in js/train.js.
  WordTrain.packs.monsters = {
    id: 'monsters',
    words: [
      { id: 'monster',     word: 'monster',      beats: ['mon', 'ster'],              say: ['monn', 'stuh'],               pic: 'monster' },
      { id: 'number',      word: 'number',       beats: ['num', 'ber'],               say: ['num', 'buh'],                 pic: 'number' },
      { id: 'seven',       word: 'seven',        beats: ['sev', 'en'],                say: ['sev', 'in'],                  pic: 7 },
      { id: 'circle',      word: 'circle',       beats: ['cir', 'cle'],               say: ['sir', 'kul'],                 pic: 'circle' },
      { id: 'zero',        word: 'zero',         beats: ['ze', 'ro'],                 say: ['zeer', 'roh'],                pic: 0, alone: [1] },
      { id: 'sixteen',     word: 'sixteen',      beats: ['six', 'teen'],              say: ['six', 'teen'],                pic: 16 },
      { id: 'triangle',    word: 'triangle',     beats: ['tri', 'an', 'gle'],         say: ['try', 'ang', 'gul'],          pic: 'triangle' },
      { id: 'eleven',      word: 'eleven',       beats: ['e', 'lev', 'en'],           say: ['ih', 'lev', 'in'],            pic: 11, alone: [0], carrier: { 0: 'it' } },
      { id: 'hexagon',     word: 'hexagon',      beats: ['hex', 'a', 'gon'],          say: ['hex', 'ih', 'gun'],           pic: 'hexagon', alone: [1], carrier: { 1: 'it' } },
      { id: 'rectangle',   word: 'rectangle',    beats: ['rec', 'tan', 'gle'],        say: ['reck', 'tang', 'gul'],        pic: 'rectangle' },
      { id: 'calculator',  word: 'calculator',   beats: ['cal', 'cu', 'la', 'tor'],   say: ['kal', 'kyoo', 'lay', 'tuh'],  pic: 'calculator', alone: [0] },
      { id: 'twentyseven', word: 'twenty-seven', beats: ['twen', 'ty', 'sev', 'en'],  say: ['twen', 'tee', 'sev', 'in'],   pic: 27, alone: [2] }
    ]
  };
  const SHAPE_PIC = { circle: '#e53935', triangle: '#2e9e4f', hexagon: '#00a6a6', rectangle: '#1e5bd6' };
  const trainPic = w => typeof w.pic === 'number' ? MA.svg(MA.numeral(w.pic, MA.numColour(w.pic % 10 || 7), 110), '-80 -70 160 140')
    : w.pic === 'monster' ? MA.monsterSvg('zug')
    : w.pic === 'number' ? MA.svg(`<g transform="translate(-44 0)">${MA.numeral(1, MA.numColour(1), 70)}</g>${MA.numeral(2, MA.numColour(2), 70)}<g transform="translate(44 0)">${MA.numeral(3, MA.numColour(3), 70)}</g>`, '-80 -50 160 100')
    : w.pic === 'calculator' ? MA.svg(MA.calculator, '-50 -60 100 120')
    : MA.svg(MA.shape(w.pic, SHAPE_PIC[w.pic], 1.2), '-75 -75 150 150');
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 64) scale(.5)">${MA.monster('trixie')}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'montrain', pack: WordTrain.packs.monsters, colour: '#f07a1a', tile: TRAIN_TILE, picture: trainPic, cls: 'mon-train',
    lines: { pick: 'montrain.pick', done: 'montrain.done' } }, COMMON));

  // =====================================================================
  // Shape Snacks: drag each shape biscuit to the monster of that shape (the sorting engine)
  // =====================================================================
  const BISCUIT = '#e7b57d';
  const biscuit = s => MA.svg(MA.shape(s, BISCUIT, .9), '-50 -50 100 100');
  const SNACK_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-18 4) scale(.5)">${MA.monster('trixie', 'open')}</g>
    <g transform="translate(30 -28)">${MA.shape('triangle', BISCUIT, .42)}</g><g transform="translate(34 30)">${MA.shape('circle', BISCUIT, .36)}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'monsnack', colour: '#00a6a6', tile: SNACK_TILE, cls: 'mon-snack',
    lines: { intro: 'monsnack.intro', no: 'monsnack.no', done: 'monsnack.done' },
    round(level) {
      const first = ['gobble', 'zug', 'trixie'], more = shuffle(['boxy', 'twinkle', 'hexie']);
      const ids = shuffle([...first, ...more.slice(0, level)]);
      return {
        bins: ids.map(id => ({ id, art: MA.monsterSvg(id, 'open'), name: 'monsnack.bin.' + id })),
        items: ids.flatMap(id => [0, 1].map(() => ({ id: MON[id].shape, art: biscuit(MON[id].shape), bin: id, line: 'monsnack.yes.' + id, name: 'mon.shape.' + MON[id].shape })))
      };
    },
    onRight(binEl, it) { Sfx.gobble(); const art = binEl.querySelector('.so-art'); art.innerHTML = MA.monsterSvg(it.bin, 'munch'); setTimeout(() => { if (art.isConnected) art.innerHTML = MA.monsterSvg(it.bin, 'open'); }, 900); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Feed the Monster: count cookies into a monster's mouth, then add two plates together
  // =====================================================================
  const FEED_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(14 6) scale(.6)">${MA.monster('gobble', 'open')}</g>
    <g transform="translate(-36 -26) scale(.5)">${MA.cookie()}</g><g transform="translate(-40 14) scale(.45)">${MA.cookie()}</g>
    <g transform="translate(36 -42)"><circle r="14" fill="#fff" ${S3}/>${MA.numeral(3, MA.numColour(3), 22)}</g></svg>`;
  A.addGame('monfeed', '#e53935', FEED_TILE, COMMON);
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // Each round is three meals: counting to a number, then (from the start) adding two plates.
  function feedRound(level) {
    const count = (a, b) => ({ kind: 'count', n: rnd(a, b) }), add = max => { const x = rnd(1, Math.min(5, max - 1)), y = rnd(1, Math.min(5, max - x)); return { kind: 'add', a: x, b: y, n: x + y }; };
    const meals = level === 0 ? [count(1, 5), count(2, 5), add(5)] : level === 1 ? [count(3, 8), count(5, 10), add(7)] : [count(6, 10), add(8), add(10)];
    const who = shuffle(IDS);
    return meals.map((m, i) => Object.assign(m, { monster: who[i] }));
  }
  A.screens.monfeed = (arg, alive) => {
    A.ui({ home: true });
    const meals = feedRound(A.level('monfeed'));
    scene().innerHTML = `<div class="mfeed">
      <div class="mf-plates"></div>
      <div class="mf-right"><div class="mf-sign"></div><div class="mf-monster"></div><div class="mf-tally"></div></div></div>`;
    const root = scene().querySelector('.mfeed'), platesEl = root.querySelector('.mf-plates'), signEl = root.querySelector('.mf-sign');
    const monEl = root.querySelector('.mf-monster'), tallyEl = root.querySelector('.mf-tally');
    let meal = null, ate = 0, busy = true, mi = 0;
    const face = mood => { monEl.innerHTML = MA.monsterSvg(meal.monster, mood); };
    const signDots = (n, colour) => `<svg viewBox="-50 -32 100 64">${MA.dots(n, n > 6 ? 6 : 8, n > 6 ? 19 : 20, colour)}</svg>`;

    function serve() {
      meal = meals[mi]; ate = 0; busy = true;
      tallyEl.innerHTML = '';
      face('open');
      monEl.classList.remove('arrive'); void monEl.offsetWidth; monEl.classList.add('arrive');
      if (meal.kind === 'count') {
        signEl.innerHTML = `<span class="mf-num">${MA.svg(MA.numeral(meal.n, MA.numColour(meal.n), 92), '-70 -50 140 100')}</span><span class="mf-dots">${signDots(meal.n, MA.numColour(meal.n))}</span>`;
        const extra = Math.min(12 - meal.n, 2 + (meal.n < 4 ? 1 : 0));
        platesEl.innerHTML = plate(meal.n + extra, 'mf-plate');
      } else {
        signEl.innerHTML = `<span class="mf-dots">${signDots(meal.a, '#e53935')}</span><b>+</b><span class="mf-dots">${signDots(meal.b, '#1e5bd6')}</span><b>=</b><b class="mf-q">?</b>`;
        platesEl.innerHTML = plate(meal.a, 'mf-plate red') + plate(meal.b, 'mf-plate blue');
      }
      platesEl.querySelectorAll('.mf-cookie').forEach(c => c.onclick = () => feed(c));
      (async () => {
        await A.say(meal.kind === 'count' ? 'monfeed.want.' + meal.n : 'monfeed.add');
        if (!alive()) return;
        busy = false;
        A.Hint.set([platesEl.querySelector('.mf-cookie')], null);
      })();
    }
    const plate = (k, cls) => `<div class="${cls}">${Array.from({ length: k }, (_, i) => `<button class="mf-cookie" style="animation-delay:${i * .05}s" aria-label="Cookie">${MA.cookieSvg()}</button>`).join('')}</div>`;

    function feed(c) {
      if (busy || c.classList.contains('eaten') || ate >= meal.n) return;
      A.Hint.clear();
      // The cookie flies into the monster's mouth.
      const from = c.getBoundingClientRect(), to = monEl.getBoundingClientRect();
      const fly = c.cloneNode(true); fly.className = 'mf-fly';
      Object.assign(fly.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px' });
      document.body.appendChild(fly);
      c.classList.add('eaten');
      requestAnimationFrame(() => { fly.style.transform = `translate(${to.left + to.width / 2 - from.left - from.width / 2}px, ${to.top + to.height * .55 - from.top - from.height / 2}px) scale(.4)`; fly.style.opacity = '.2'; });
      setTimeout(() => fly.remove(), 450);
      ate++;
      const n = ate;
      A.later(() => {
        Sfx.gobble(); face('munch');
        const dot = document.createElement('span'); dot.className = 'mf-dot'; dot.textContent = n;
        dot.style.background = meal.kind === 'add' ? (n <= meal.a ? '#e53935' : '#1e5bd6') : MA.numColour(meal.n);
        tallyEl.appendChild(dot);
        A.later(() => { if (alive() && ate === n && ate < meal.n) face('open'); }, 500);
      }, 380);
      A.later(async () => {
        await A.say('mon.n.' + n);
        if (!alive() || n !== meal.n) return;
        busy = true;
        if (meal.kind === 'count') return full();
        ask();
      }, 400);
    }
    async function full() {
      face('smile'); A.Pip.mood('cheer');
      monEl.classList.remove('happy'); void monEl.offsetWidth; monEl.classList.add('happy');
      await A.say(mi % 2 ? 'monfeed.yum2' : 'monfeed.yum');
      if (alive()) next();
    }
    async function ask() {
      face('smile');
      await A.say('monfeed.ask');
      if (!alive()) return;
      const n = meal.n, opts = new Set([n]);
      for (const d of shuffle([-2, -1, 1, 2])) { if (opts.size === 3) break; if (n + d >= 1 && n + d <= 10) opts.add(n + d); }
      platesEl.innerHTML = `<div class="mf-answers">${shuffle([...opts]).map((v, i) => `<button class="mf-ans" data-v="${v}" style="animation-delay:${i * .08}s" aria-label="${v}">${MA.svg(MA.numeral(v, MA.numColour(v), 80), '-50 -45 100 90')}</button>`).join('')}</div>`;
      A.Hint.set([...platesEl.querySelectorAll('.mf-ans')], null);
      platesEl.querySelectorAll('.mf-ans').forEach(b => b.onclick = async () => {
        if (busy === 'done') return;
        A.Hint.clear();
        if (+b.dataset.v !== n) {
          Sfx.boing(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
          A.Pip.mood('thinking'); A.say('monfeed.tryagain');
          return;
        }
        busy = 'done'; b.classList.add('yes'); Sfx.pop();
        signEl.querySelector('.mf-q').textContent = n;
        face('burp'); A.later(() => Sfx.burp(), 300);
        A.Pip.mood('cheer');
        await A.say('monfeed.made.' + n);
        if (alive()) next();
      });
    }
    async function next() {
      mi++;
      if (mi < meals.length) { await A.wait(400); if (alive()) serve(); return; }
      A.Pip.mood('cheer'); A.Pip.act('dance');
      await A.say('monfeed.done');
      if (alive()) A.gameDone('monfeed');
    }
    (async () => { await A.say('monfeed.intro'); if (alive()) serve(); })();
  };

  // =====================================================================
  // Monster Shapes: build a monster from shapes, one choice at a time
  // =====================================================================
  const COLOURS = { green: '#5cc96b', orange: '#f07a1a', purple: '#8e5bd6', pink: '#e86aa6', blue: '#1e5bd6' };
  const STEPS = [
    { key: 'body', line: 'monbuild.body', options: lvl => lvl ? SHAPE_NAMES : SHAPE_NAMES.slice(0, 4), name: v => 'mon.shape.' + v,
      art: v => MA.svg(MA.shape(v, '#c3cad6', .9), '-50 -50 100 100') },
    { key: 'eyes', line: 'monbuild.eyes', options: () => [1, 2, 3], name: v => 'monbuild.eyes.' + v,
      art: v => MA.svg(`<g transform="translate(-30 0)">${MA.numeral(v, MA.numColour(v), 64)}</g><g transform="translate(26 0)">${v === 1 ? MA.eye(0, 0, 13) : v === 2 ? MA.eye(-12, 0, 10) + MA.eye(12, 0, 10) : MA.eye(-14, 8, 8) + MA.eye(0, -10, 8) + MA.eye(14, 8, 8)}</g>`, '-60 -40 120 80') },
    { key: 'horns', line: 'monbuild.horns', options: () => ['triangle', 'circle', 'none'], name: v => 'monbuild.horns.' + v,
      art: v => MA.svg(v === 'none' ? `<circle r="26" fill="none" stroke="#e53935" stroke-width="7"/><path d="M-18 18 L18 -18" stroke="#e53935" stroke-width="7"/>`
        : MA.build({ body: 'circle', horns: v, colour: '#c3cad6' }), v === 'none' ? '-40 -40 80 80' : '-60 -76 120 130') },
    { key: 'mouth', line: 'monbuild.mouth', options: () => ['smile', 'rect', 'zigzag'], name: v => 'monbuild.mouth.' + v,
      art: v => MA.svg(MA.buildMouth(v, -8, 34), '-44 -26 88 52') },
    { key: 'legs', line: 'monbuild.legs', options: () => [2, 3, 4], name: v => 'monbuild.legs.' + v,
      art: v => MA.svg(`<g transform="translate(-34 -6)">${MA.numeral(v, MA.numColour(v), 64)}</g><g transform="translate(22 -40)">${MA.legs(v, Array.from({ length: v }, (_, i) => (i - (v - 1) / 2) * 17), '#c3cad6')}</g>`, '-64 -34 128 60') },
    { key: 'colour', line: 'monbuild.colour', options: () => Object.keys(COLOURS), name: v => 'monbuild.colour.' + v,
      art: v => MA.svg(`<circle r="34" fill="${COLOURS[v]}" ${S}/>`, '-40 -40 80 80') }
  ];
  const BUILD_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-8 4) scale(.62)">${MA.build({ body: 'square', eyes: 3, horns: 'triangle', mouth: 'zigzag', legs: 3, colour: '#e86aa6' })}</g>
    <g transform="translate(40 -36)">${MA.shape('triangle', '#ffd21f', .3)}</g><g transform="translate(42 32)">${MA.shape('circle', '#5cc3ff', .26)}</g></svg>`;
  A.addGame('monbuild', '#e86aa6', BUILD_TILE, COMMON);
  A.screens.monbuild = (arg, alive) => {
    A.ui({ home: true });
    const lvl = A.level('monbuild'), choice = { colour: '#e7ebf2' };
    scene().innerHTML = `<div class="mbuild"><div class="mb-stage"><svg viewBox="-90 -100 180 180" class="mb-monster"></svg></div>
      <div class="mb-side"><div class="mb-steps">${STEPS.map((s, i) => `<span data-i="${i}"></span>`).join('')}</div><div class="mb-options"></div></div></div>`;
    const root = scene().querySelector('.mbuild'), monSvg = root.querySelector('.mb-monster'), optEl = root.querySelector('.mb-options');
    const pips = [...root.querySelectorAll('.mb-steps span')];
    const draw = () => {
      monSvg.innerHTML = choice.body ? MA.build(choice) : `<circle cy="-10" r="60" fill="#fff" stroke="${OL}" stroke-width="5" stroke-dasharray="16 12"/>
        <text y="18" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="80" fill="#c3cad6">?</text>`;
    };
    let step = 0, busy = false;
    function show() {
      const s = STEPS[step];
      pips.forEach((p, i) => { p.classList.toggle('on', i === step); p.classList.toggle('done', i < step); });
      optEl.innerHTML = s.options(lvl).map((v, i) => `<button class="mb-opt" data-v="${v}" style="animation-delay:${i * .06}s" aria-label="${v}">${s.art(v)}</button>`).join('');
      optEl.classList.toggle('many', optEl.children.length > 4);
      optEl.querySelectorAll('.mb-opt').forEach(b => b.onclick = () => pick(b));
      A.say(s.line);
      A.Hint.set([...optEl.children], null);
    }
    async function pick(b) {
      if (busy) return;
      busy = true; A.Hint.clear();
      const s = STEPS[step], raw = b.dataset.v, v = isNaN(+raw) ? raw : +raw;
      choice[s.key] = s.key === 'colour' ? COLOURS[v] : v;
      draw(); Sfx.pop();
      monSvg.classList.remove('pop'); void monSvg.getBoundingClientRect(); monSvg.classList.add('pop');
      b.classList.add('yes');
      await A.say(s.name(v));
      if (!alive()) return;
      step++; busy = false;
      if (step < STEPS.length) return show();
      finish();
    }
    async function finish() {
      optEl.innerHTML = ''; pips.forEach(p => p.classList.add('done'));
      Sfx.roar(); monSvg.classList.add('dance'); A.Pip.mood('cheer'); A.Pip.act('dance');
      // Keep the monster in My Pictures (the newest eight are kept).
      const pic = `<svg viewBox="-90 -100 180 180" xmlns="http://www.w3.org/2000/svg"><rect x="-90" y="-100" width="180" height="180" fill="#f1ebff"/>${MA.build(choice)}</svg>`;
      P().gallery.unshift({ v: 'monster', svg: pic }); P().gallery = P().gallery.slice(0, 8); A.saveProgress();
      await A.say('monbuild.done');
      if (alive()) A.gameDone('monbuild');
    }
    draw();
    (async () => { await A.say('monbuild.intro'); if (alive()) show(); })();
  };

  // =====================================================================
  // Monster Town: meet six monsters, and pick a game
  // =====================================================================
  const SPOTS = { gobble: [230, 650], zug: [450, 660], trixie: [680, 650], boxy: [910, 660], twinkle: [1140, 650], hexie: [1370, 660] };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#8e5bd6' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(0 2) scale(.4)">${MA.monster('gobble')}</g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const monGames = () => A.worldGames('monsters');
  const badgeEarned = () => IDS.every(id => P().monsters.includes(id)) && monGames().every(g => P().games.includes(g.id));

  function townArt() {
    const mons = IDS.map(id => {
      const [x, y] = SPOTS[id], got = P().monsters.includes(id);
      return `<g class="mon-spot tappable" data-m="${id}">
        <ellipse cx="${x}" cy="${y + 6}" rx="80" ry="16" fill="rgba(42,47,69,.15)"/>
        <g class="town-monster" transform="translate(${x} ${y - 86}) scale(1.5)">${MA.monster(id)}</g>
        ${got ? `<g transform="translate(${x + 70} ${y - 200})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${x - 95}" y="${y - 220}" width="190" height="240" fill="transparent"/>
      </g>`;
    }).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="Monster Town">
      ${Art.defs()}
      <rect width="1600" height="900" fill="#e6dbff"/>
      <g class="clouds">${Art.cloud(140, 90, .8)}${Art.cloud(1180, 70, .7)}</g>
      ${MA.hills}
      ${MA.house(200, 470, .9, '#ffb3c7', '#8e5bd6')}${MA.house(520, 450, .75, '#bfe6ff', '#f07a1a')}${MA.house(1080, 455, .8, '#fff6cc', '#2e9e4f')}${MA.house(1400, 470, .9, '#c8f0d4', '#1e5bd6')}
      ${MA.lolly(800, 470, .9, '#e86aa6')}${MA.lolly(1250, 470, .7, '#ffd21f')}
      <path d="M-20 740 Q400 690 800 720 T1620 710" fill="none" stroke="#c3b4e8" stroke-width="110" stroke-linecap="round"/>
      <path d="M-20 740 Q400 690 800 720 T1620 710" fill="none" stroke="#ddd2f5" stroke-width="92" stroke-linecap="round"/>
      ${mons}
    </svg>`;
  }

  // A sticker for each monster, given the first time the child meets it.
  function monsterSticker(id) {
    return new Promise(resolve => {
      P().monsters.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${MON[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${MON[id].name} sticker!</h2>
          <div class="sticker-big">${MA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('monsters.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('monsters')) return;
    P().badges.push('monsters'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Number Champion badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Number Champion badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('monsters.badge');
  }

  let welcomed = false;
  A.screens.monsters = (arg, alive) => {
    scene().innerHTML = `<div class="town-home">${townArt()}
      <div class="world-tiles">${monGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.town-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelectorAll('.mon-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.m, art = spot.querySelector('.town-monster');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      sound(id);
      await A.say('monsters.fact.' + id);
      if (!alive()) return;
      if (!P().monsters.includes(id)) {
        await monsterSticker(id);
        if (!alive()) return;
        A.screens.monsters('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.mon-spot')], 'monsters.hint');
    if (!welcomed) { welcomed = true; A.say('monsters.welcome'); } else A.say('monsters.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- Monster Town's page in the sticker book, and its badge ----------
  Rewards.pages.monsters = () => ({
    html: IDS.map(id => `<button data-kind="mm" data-id="${id}" aria-label="${MON[id].name}">${MA.sticker(id, P().monsters.includes(id))}<span>${P().monsters.includes(id) ? MON[id].name : '?'}</span></button>`).join('')
      + monGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'mm') return false;
      if (P().monsters.includes(id)) { Sfx.sparkle(); A.say('monsters.name.' + id); }
      else { Sfx.boing(); A.sayText(`Tap ${MON[id].name} in Monster Town to find this sticker.`); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'monsters', name: 'Number Champion', svg: BADGE, earned: () => P().badges.includes('monsters') || badgeEarned(), how: 'monsters.badge.how' });

  window.Monsters = { IDS, BADGE, badgeEarned };
})();
