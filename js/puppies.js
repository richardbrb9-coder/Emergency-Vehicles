// Pip's New Puppies: the puppies world pack (Pip's mum has a litter of five). Words, pictures, levels and the puppy
// room home screen, plus one game of its own (How Many Babies?). The story, Bedtime Run, Puppy Train and Find My Mum
// come from the shared engines (Story, BallRun, WordTrain, Sorter).

// ---------- Bedtime Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Coin Run puzzles (themselves the Gobble Run layouts) in a new order within each group, each checked
  // solvable again by running its physics with the hint pieces in place. decoy: the sleepy cat's basket.
  const b = p => Object.assign({ balls: 6 }, p);
  BR.packs.puppies = {
    id: 'puppies',
    free: { hose: 1, goal: 11, balls: 8 },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      b({ hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      b({ hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      b({ hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      // 5 to 8: two pieces
      b({ hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      b({ hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      b({ hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      // 9 to 12: a see-saw or a bucket
      b({ hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      b({ hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      b({ hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] }),
      b({ hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] })
    ]
  };
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const PA = window.PupArt, PUPS = PA.PUPS;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().puppies) P().puppies = [];
  const shuffle = Sorter.shuffle;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // The six things to visit in the puppy room; visiting each one earns its sticker.
  const SPOT_IDS = ['basket', 'scales', 'bowls', 'toys', 'collars', 'vet'];
  const SOUND = { basket: 'yip', scales: 'beep', bowls: 'chomp', toys: 'squeak', collars: 'ring', vet: 'chime' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);
  const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'puppies.welcome': "Welcome to the puppy room! Pip's mum has five new puppies. Tap things in the room to find out about them, or pick a game at the bottom.",
    'puppies.back':    'What shall we do with the puppies now?',
    'puppies.hint':    'Tap something in the puppy room!',
    'puppies.pip':     "Woof! I'm a big brother now! Tap the puppies to say hello.",
    'puppies.fact.basket':  "Here are Mum and the five new puppies, all snuggled up! Puppies born together are called a litter.",
    'puppies.fact.scales':  'The puppies are weighed every day, to check they are growing big and strong.',
    'puppies.fact.bowls':   "At first the puppies only drink Mum's milk. When they are a few weeks old, they start to eat soft puppy food.",
    'puppies.fact.toys':    'Puppies love to play! Playing helps them learn. Soft toys are best for little puppy teeth.',
    'puppies.fact.collars': 'Five little collars, in five colours. Red, blue, green, yellow and purple, so we can tell the puppies apart!',
    'puppies.fact.vet':     "Hello! I'm Dr Ade, the vet. I check that the puppies are healthy. I listen to their hearts with my stethoscope.",
    'puppies.badge':     'You earned the Puppy Helper badge! The puppies love you!',
    'puppies.badge.how': 'Visit everything in the puppy room and play every puppy game to earn the Puppy Helper badge.',
    'book.world.puppies': 'Your puppy stickers! Explore the puppy room and play the games to fill this page.',

    'games.pupStory':   'New Puppies',
    'games.bedtimerun': 'Bedtime Run',
    'games.puptrain':   'Puppy Train',
    'games.babies':     'How Many Babies?',
    'games.findmum':    'Find My Mum',

    // The story
    'puppies.story.1': "Pip's mum has a big, round tummy. Dr Ade the vet listens with her stethoscope. There are puppies growing inside! Lots of them!",
    'puppies.story.2': 'Pip helps to get ready. He puts soft blankets in a big basket, in a quiet, cosy corner. A perfect puppy bed!',
    'puppies.story.3': 'At bedtime, Mum curls up in the basket. Goodnight, Mum! says Pip. Tomorrow might be a very big day.',
    'puppies.story.4': 'In the morning, Pip peeps into the basket. Mum has had her puppies! One, two, three, four, five tiny puppies, all born in the same night.',
    'puppies.story.5': "The puppies are so small. Their eyes are shut tight, and they can't hear yet. They drink Mum's milk, and sleep in a cosy heap to keep warm.",
    'puppies.story.6': 'Lots of babies born together are called a litter. Cats have litters of kittens, and pigs have litters of piglets. But an elephant usually has just one baby at a time.',
    'puppies.story.7': 'After about two weeks, the puppies open their eyes! Soon they are wobbling, tumbling and playing. Pip shows them his ball.',
    'puppies.story.8': 'Pip helps to give the puppies their names: Patch, Biscuit, Pepper, Bramble and Daisy. Pip is a big brother now, and he is very proud!',
    'puppies.story.end': 'The end! Thank you for reading with me.',

    // Bedtime Run (ball run)
    'bedrun.pick':    'Bedtime Run! Build your own, or try one of my puzzles.',
    'bedrun.free':    'Drag pieces onto the board. Then blow my whistle to roll the balls down!',
    'bedrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'bedrun.go':      'Here come the balls!',
    'bedrun.flip':    'Tap a piece to turn it around.',
    'bedrun.n1':      'One!',
    'bedrun.n2':      'Two!',
    'bedrun.n3':      'Three!',
    'bedrun.again':   'Oops! The balls missed the puppy basket. Move the pieces and try again.',
    'bedrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'bedrun.allDone': 'You solved all my puzzles! Every puppy has a ball to cuddle. Night night, puppies!',
    'bedrun.freeOut': 'Wheee! The puppies love their balls. What else can you build?',
    'bedrun.bolted':  'That piece is bolted on. Build around it!',
    'bedrun.cleared': "All clear! Let's build something new.",
    'bedrun.no':      "Mew! That's the cat's basket. Roll the balls into the puppy basket.",
    'bedrun.want':    "It's bedtime! Roll three balls into the puppy basket.",
    'bedrun.won.0':   'Three balls in the basket! The puppies are happy. Yawn!',
    'bedrun.won.1':   'Hooray! Three balls for the puppies to cuddle. Night night!',
    'bedrun.won.2':   'Well done! The puppies wag their tails, then snuggle down to sleep.',
    'bedrun.p.ramp':   'A ramp! The balls roll down a slope.',
    'bedrun.p.long':   'A long ramp. The balls roll a long way down it.',
    'bedrun.p.curve':  'A curve. It turns falling balls to the side.',
    'bedrun.p.funnel': 'A funnel. It catches the balls and drops them through the middle.',
    'bedrun.p.spring': 'A spring! Boing! It bounces the balls up into the air.',
    'bedrun.p.fan':    'A fan. Whoosh! It blows the balls sideways.',
    'bedrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'bedrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Puppy Train
    'puptrain.pick': 'All aboard the Puppy Train! Animal words are made of beats too. Pick a game.',
    'puptrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!',

    // Find My Mum
    'mum.intro': 'Oh no! These babies have lost their mums. Drag each baby to its mum.',
    'mum.no':    'Hmm, is that its mum? Look carefully at the baby, and at the mum.',
    'mum.done':  'Every baby has found its mum. Hooray! Big cuddles!',

    // How Many Babies?
    'babies.intro': 'How many babies? Tap each baby to count it.',
    'babies.more':  'Keep counting! Tap the babies without a number.',
    'babies.no':    'Count them again. Look at the last number you said.',
    'babies.hatch': 'Crack, crack! The eggs are hatching. Hello, chicks!',
    'babies.next':  "Let's visit another mum.",
    'babies.allDone': 'Brilliant counting! Some mums have lots of babies, and some have just one.'
  });
  for (let n = 1; n <= 8; n++) L['babies.n.' + n] = cap(NUMS[n]) + '!';

  // How Many Babies? The families: how many babies each mum can have (a litter or clutch, or usually just one).
  const FAMS = {
    dog:      { range: [4, 6], ask: "Pip's mum has her puppies! Tap each puppy to count them.", how: 'How many puppies are there?',
      fact: 'Just like Pip! A mummy dog has a litter of puppies, all at once.' },
    cat:      { range: [3, 5], ask: 'Mummy cat has had her kittens! Tap each kitten to count them.', how: 'How many kittens are there?',
      fact: 'A mummy cat has a litter of kittens. They all snuggle up together.' },
    pig:      { range: [5, 8], ask: 'Mummy pig has had her piglets! Tap each piglet to count them.', how: 'How many piglets are there?',
      fact: 'A mummy pig can have a big litter of piglets. Oink oink!' },
    hen:      { range: [4, 6], ask: 'Mummy hen has laid her eggs. Tap each egg to count them.', how: 'How many eggs are there?',
      fact: 'A group of eggs is called a clutch. Each egg hatches into a fluffy chick.' },
    duck:     { range: [4, 6], ask: 'Mummy duck has her ducklings! Tap each duckling to count them.', how: 'How many ducklings are there?',
      fact: 'A mummy duck lays lots of eggs. Out come the ducklings, and they follow her everywhere!' },
    cow:      { range: [1, 1], ask: 'Mummy cow has had her baby! Tap the calf to count it.', how: 'How many calves are there?',
      fact: 'Just one calf! A mummy cow usually has one baby at a time.' },
    horse:    { range: [1, 1], ask: 'Mummy horse has had her baby! Tap the foal to count it.', how: 'How many foals are there?',
      fact: 'Just one foal! A mummy horse usually has one baby at a time.' },
    elephant: { range: [1, 1], ask: 'Mummy elephant has had her baby! Tap the calf to count it.', how: 'How many calves are there?',
      fact: 'Just one! A mummy elephant has one baby at a time, and looks after it for a long time.' },
    sheep:    { range: [1, 2], ask: 'Mummy sheep has had her lambs! Tap each lamb to count them.', how: 'How many lambs are there?',
      fact: 'A mummy sheep often has one lamb, or two lambs called twins. Baa!' }
  };
  const MANY = ['dog', 'cat', 'pig', 'hen', 'duck'], FEW = ['cow', 'horse', 'elephant', 'sheep'];
  Object.entries(FAMS).forEach(([id, f]) => { L['babies.ask.' + id] = f.ask; L['babies.how.' + id] = f.how; L['babies.fact.' + id] = f.fact; });
  // Find My Mum: the pairs.
  const PAIRS = ['dog', 'cat', 'pig', 'hen', 'duck', 'cow', 'sheep', 'horse'];
  const MUM_NAME = { dog: 'Mummy dog', cat: 'Mummy cat', pig: 'Mummy pig', hen: 'Mummy hen', duck: 'Mummy duck', cow: 'Mummy cow', sheep: 'Mummy sheep', horse: 'Mummy horse' };
  PAIRS.forEach(m => {
    const baby = PA.BABY[m], an = /^[aeiou]/.test(baby) ? 'An' : 'A';
    L['mum.bin.' + m] = MUM_NAME[m] + '.';
    L['mum.name.' + baby] = `${an} ${baby}.`;
    L['mum.yes.' + baby] = m === 'dog' ? 'A puppy! A baby dog is called a puppy, just like Pip.' : `${an} ${baby}! A baby ${m} is called ${an.toLowerCase()} ${baby}.`;
  });
  SPOT_IDS.forEach(id => {
    const n = PA.SPOTS[id].name;
    L['puppies.sticker.' + id] = `You earned the ${id === 'vet' ? n : n.toLowerCase()} sticker!`;
    L['puppies.name.' + id] = n + '!';
    L['puppies.find.' + id] = id === 'vet' ? 'Tap Dr Ade the vet to find this sticker.' : id === 'basket' ? 'Tap the puppy basket to find this sticker.' : `Tap the ${n.toLowerCase()} in the puppy room to find this sticker.`;
  });

  // Pip wears his puppy-sitter apron on every puppy screen.
  ['puppies', 'pupStory', 'bedtimerun', 'puptrain', 'babies', 'findmum'].forEach(s => { A.screenWorld[s] = 'puppies'; });
  const COMMON = { world: 'puppies', back: 'puppies' };

  // =====================================================================
  // New Puppies: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const pipAt = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip('puppies').replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const room = (wall = '#fff1d6', floor = '#c98b4e', line = '#a5672e') => `<rect width="1200" height="500" rx="30" fill="${wall}"/>
    ${Array.from({ length: 12 }, (_, i) => `<circle cx="${50 + i * 100}" cy="${60 + (i % 2) * 60}" r="6" fill="#f2c879" opacity=".6"/>`).join('')}
    <path d="M0 500 H1200 V660 H0 Z" fill="${floor}"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 200} 500 V660" stroke="${line}" stroke-width="4"/>`).join('')}
    <path d="M0 500 H1200" stroke="#8b5a2b" stroke-width="10"/>`;
  const night = `${room('#3b4a7a', '#6b5a7a', '#574766')}<rect width="1200" height="660" rx="30" fill="#1b2a5a" opacity=".15"/>`;
  const say = (x, y, t, c = '#e53935', size = 64) => `<text x="${x}" y="${y}" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const hearts = (pts, c) => pts.map(([x, y, s]) => at(x, y, s || 1.4, PA.heart(c))).join('');
  const panel = (x, w, fill, inner) => `<g transform="translate(${x} 0)"><rect x="0" y="80" width="${w}" height="500" rx="24" fill="${fill}" ${S}/>${inner}</g>`;
  const PAGES = [
    () => page('#fff1d6', `${room()}${at(260, 230, 1, PA.dayWindow)}
      ${tap('woof', at(560, 560, 1.35, PA.mumRound()))}${tap('chime', at(800, 580, 1.15, PA.vet(false)))}
      ${hearts([[470, 300], [650, 250, 1.1], [520, 220, 1]])}${pipAt(130, 380, 200)}`),
    () => page('#fff1d6', `${room()}${at(980, 230, 1, PA.dayWindow)}
      ${tap('pop', at(520, 600, 1.3, PA.basket(360, `<g transform="translate(0 -46)">${PA.blanket.replace('<g>', '<g transform="scale(2.2 .9)">')}</g>`)))}
      ${tap('pop', at(860, 560, 1.2, PA.blanket))}${pipAt(860, 340, 220)}`),
    () => page('#3b4a7a', `${night}${at(900, 220, 1, PA.nightWindow)}
      ${tap('woof', at(460, 610, 1.2, PA.basket(420, `<g transform="translate(-20 -30) scale(.86)">${PA.mumLying(true)}</g>`)))}
      ${PA.zzz(420, 340, 1.4)}${pipAt(820, 380, 210)}`),
    () => page('#fff1d6', `${room()}${at(950, 220, 1, PA.dayWindow)}
      ${tap('yip', at(480, 620, 1.35, PA.family(false)))}${pipAt(860, 350, 230)}
      ${[0, 1, 2, 3, 4].map(i => say(260 + i * 68, 380 - (i % 2) * 20, i + 1, '#e53935', 54)).join('')}${say(880, 330, '!', '#e53935', 110)}`),
    () => page('#ffe9f2', `<rect width="1200" height="660" rx="30" fill="#ffe3ef"/>
      ${tap('yip', at(600, 700, 2.4, PA.basket(420, `<g transform="translate(-20 -30) scale(.86)">${PA.mumLying(true)}</g>${[0, 1, 2, 3, 4].map(i => `<g transform="translate(${-110 + i * 50} ${-18 - (i % 2) * 10}) scale(.66)">${PA.curled(i)}</g>`).join('')}`)))}
      ${hearts([[180, 140], [1020, 120], [600, 90, 1]])}${PA.zzz(980, 260, 1.2)}`),
    () => page('#e3f7e8', `<rect width="1200" height="660" rx="30" fill="#e3f7e8"/>
      ${panel(40, 360, '#ffe3ef', `${at(180, 220, 1.2, PA.farm('cat'))}${[0, 1, 2, 3].map(i => at(60 + i * 80, 420 + (i % 2) * 50, .72, PA.farm('cat', true))).join('')}
        ${tap('meow', '<rect x="0" y="80" width="360" height="500" fill="transparent"/>')}`)}
      ${panel(420, 360, '#fff1d6', `${at(180, 220, 1.2, PA.farm('pig'))}${[0, 1, 2, 3, 4, 5].map(i => at(60 + (i % 3) * 120, 390 + Math.floor(i / 3) * 100, .66, PA.farm('pig', true))).join('')}
        ${tap('oink', '<rect x="0" y="80" width="360" height="500" fill="transparent"/>')}`)}
      ${panel(800, 360, '#dff3ff', `${at(180, 230, 1.5, PA.farm('elephant'))}${at(180, 450, .8, PA.farm('elephant', true))}
        ${tap('trumpet', '<rect x="0" y="80" width="360" height="500" fill="transparent"/>')}`)}`),
    () => page('#fff1d6', `${room()}
      ${[0, 1, 2, 3, 4].map(i => tap('yip', at(130 + i * 150, 610 - (i % 2) * 24, 1.6, PA.puppy(i, { tongue: i % 2 === 0 })))).join('')}
      ${tap('pop', at(820, 570, 1.6, PA.ball('#e53935', 22)))}${at(300, 360, 1.2, PA.ball('#1e5bd6', 18))}${pipAt(880, 330, 240)}`),
    () => page('#fff1d6', `${room()}${at(600, 90, 1, `<path d="M-500 0 Q0 60 500 0" fill="none" stroke="${OL}" stroke-width="3"/>${[-400, -200, 0, 200, 400].map((x, i) => at(x, 18 + Math.cos(x / 320) * 10, 1, `<path d="M-30 0 H30 L0 50 Z" fill="${PUPS[i].collar}" ${S3}/>`)).join('')}`)}
      ${tap('woof', at(1090, 610, 1.1, PA.mumStand()))}${pipAt(790, 380, 200)}
      ${[0, 1, 2, 3, 4].map(i => `${tap('yip', at(120 + i * 150, 560, 1.3, PA.puppy(i)))}
        <g transform="translate(${120 + i * 150} 610)"><rect x="-66" y="-24" width="132" height="44" rx="12" fill="#fff" ${S3}/>
        <text y="10" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="28" fill="${PUPS[i].collar === '#ffd21f' ? '#c99a00' : PUPS[i].collar}">${PUPS[i].name}</text></g>`).join('')}`)
  ];
  Story.mount(Object.assign({ screen: 'pupStory', colour: '#f07a1a', cls: 'pup-story', lines: { end: 'puppies.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(28 46) scale(.5)">${PA.puppy(0)}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'puppies.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Bedtime Run: toy balls roll out of the toy box into the puppy basket (not into the cat's basket)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#f07a1a" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-26 -46) scale(.6)">${PA.ball('#e53935', 16)}</g><g transform="translate(12 -16) scale(.6)">${PA.ball('#1e5bd6', 16)}</g>
    <g transform="translate(4 52) scale(.3)">${PA.basket(300, [1, 2, 3].map(i => `<g transform="translate(${-104 + i * 52} -24) scale(.56)">${PA.puppy(i)}</g>`).join(''))}</g></svg>`;
  const ballColour = b => PA.BALLS[b.idx % PA.BALLS.length];
  const bedTheme = {
    board(ctx) { // the puppy room at bedtime: soft lilac wallpaper with little stars
      ctx.fillStyle = '#f3efff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(142,91,214,.06)';
      for (let x = 0; x < W; x += 100) ctx.fillRect(x, 0, 50, H);
      ctx.fillStyle = 'rgba(255,210,31,.45)';
      for (let y = 50; y < H; y += 100) for (let x = 25; x < W; x += 100) {
        const cx = x + (y % 200 ? 50 : 0);
        ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, r = k % 2 ? 2.5 : 7; ctx.lineTo(cx + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.fill();
      }
      ctx.fillStyle = '#c98b4e'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // the toy box, with balls peeping out of the top
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      [0, 1, 2].forEach(i => drawImg(ctx, PA.ballImage(PA.BALLS[i]), x - 22 + i * 22, 14, 26, 26));
      poly(ctx, [{ x: x - 40, y: 22 }, { x: x + 40, y: 22 }, { x: x + 34, y: 48 }, { x: x - 34, y: 48 }], '#ffd21f');
      poly(ctx, [{ x: x - 14, y: 48 }, { x: x + 14, y: 48 }, { x: x + 10, y: 60 }, { x: x - 10, y: 60 }], '#e53935');
      if (dripping) line(ctx, x - 9, 55, x + 9, 55, '#fff', 4);
    },
    ball(ctx, b) { drawImg(ctx, PA.ballImage(ballColour(b)), b.position.x, b.position.y, 2 * R + 6, 2 * R + 6, b.angle); },
    goal(ctx, st) {
      const { level, fx, won, now, hits } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 5 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 8 : 0;
      drawImg(ctx, PA.basketImage(hits > 0 || won, won), x, H - 52 + bob + jump, 240, 78);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 8 : 0);
      drawImg(ctx, PA.catImage(fx.shake > 0), x, H - 58, 160, 114);
    },
    splash: '#ffd21f',
    release() { Sfx.pop(); },
    hit(ev, fx) { Sfx.yip(); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ff6f9c', 1.2); },
    win(fx) { fx.chew = 0; },
    tapGoal() { Sfx.yip(); },
    tapDecoy() { Sfx.meow(); },
    refuse: () => 'bedrun.no',
    intro: () => 'bedrun.want',
    winLine: () => 'bedrun.won.' + Math.floor(Math.random() * 3)
  };
  BR.mount(Object.assign({ screen: 'bedtimerun', lines: 'bedrun', colour: '#8e5bd6', icon: RUN_ICON, pack: BR.packs.puppies, theme: bedTheme, cls: 'pup-run' }, COMMON));

  // =====================================================================
  // Puppy Train: animal words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (short "ih" sounds, cut from "it").
  // alone / carrier: see the Rescue Station words in js/train.js.
  WordTrain.packs.puppies = {
    id: 'puppies',
    words: [
      { id: 'puppy',       word: 'puppy',       beats: ['pup', 'py'],            say: ['pup', 'pee'],           pic: 'puppy' },
      { id: 'kitten',      word: 'kitten',      beats: ['kit', 'ten'],           say: ['kit', 'tun'],           pic: 'kitten' },
      { id: 'piglet',      word: 'piglet',      beats: ['pig', 'let'],           say: ['pig', 'lit'],           pic: 'piglet' },
      { id: 'rabbit',      word: 'rabbit',      beats: ['rab', 'bit'],           say: ['rab', 'bit'],           pic: 'rabbit' },
      { id: 'duckling',    word: 'duckling',    beats: ['duck', 'ling'],         say: ['duck', 'ling'],         pic: 'duckling' },
      { id: 'basket',      word: 'basket',      beats: ['bas', 'ket'],           say: ['bask', 'kit'],          pic: 'basket' },
      { id: 'blanket',     word: 'blanket',     beats: ['blan', 'ket'],          say: ['blank', 'kit'],         pic: 'blanket' },
      { id: 'tadpole',     word: 'tadpole',     beats: ['tad', 'pole'],          say: ['tad', 'pole'],          pic: 'tadpole' },
      { id: 'hedgehog',    word: 'hedgehog',    beats: ['hedge', 'hog'],         say: ['hedge', 'hog'],         pic: 'hedgehog' },
      { id: 'family',      word: 'family',      beats: ['fam', 'i', 'ly'],       say: ['fam', 'ih', 'lee'],     pic: 'family', alone: [1], carrier: { 1: 'it' } },
      { id: 'animal',      word: 'animal',      beats: ['an', 'i', 'mal'],       say: ['ann', 'ih', 'mull'],    pic: 'animals', alone: [1], carrier: { 1: 'it' } },
      { id: 'stethoscope', word: 'stethoscope', beats: ['steth', 'o', 'scope'],  say: ['steth', 'uh', 'scope'], pic: 'stethoscope' }
    ]
  };
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 92) scale(.6)">${PA.puppy(3)}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'puptrain', pack: WordTrain.packs.puppies, colour: '#1e5bd6', tile: TRAIN_TILE, picture: w => PA.itemSvg(w.pic), cls: 'pup-train',
    lines: { pick: 'puptrain.pick', done: 'puptrain.done' } }, COMMON));

  // =====================================================================
  // Find My Mum: drag each baby animal to its mum (the sorting engine)
  // =====================================================================
  const MUM_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-14 -10) scale(.62)">${PA.farm('hen')}</g><g transform="translate(30 30) scale(.4)">${PA.farm('hen', true)}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'findmum', colour: '#2e9e4f', tile: MUM_TILE, cls: 'pup-mum',
    lines: { intro: 'mum.intro', no: 'mum.no', done: 'mum.done' },
    round(level) {
      const mums = shuffle(PAIRS).slice(0, level === 0 ? 3 : 4), copies = level === 2 ? 2 : 1;
      return {
        bins: mums.map(m => ({ id: m, art: PA.svg(PA.farm(m), '-66 -66 132 132'), name: 'mum.bin.' + m, cls: 'mum-' + m })),
        items: mums.flatMap(m => Array.from({ length: copies }, (_, k) => {
          const baby = PA.BABY[m];
          return { id: baby + k, bin: m, line: 'mum.yes.' + baby, name: 'mum.name.' + baby, art: PA.svg(PA.farm(m, true), '-64 -64 128 128') };
        }))
      };
    },
    onRight(binEl, it) { ({ dog: Sfx.yip, cat: Sfx.meow, pig: Sfx.oink, hen: Sfx.cluck, duck: Sfx.quack, cow: Sfx.moo, sheep: Sfx.baa, horse: Sfx.neigh }[it.bin] || Sfx.pop).call(Sfx);
      const s = binEl.querySelector('.so-art svg'); s.classList.remove('gulp'); void s.getBoundingClientRect(); s.classList.add('gulp'); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // How Many Babies?: tap each baby to count it, then (from level 2) pick the number. Some mums have lots, some just one.
  // =====================================================================
  const NS = 'http://www.w3.org/2000/svg';
  const BABIES_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-22 -18) scale(.5)">${PA.farm('pig')}</g>
    ${[0, 1, 2].map(i => `<g transform="translate(${-30 + i * 30} 36) scale(.26)">${PA.farm('pig', true)}</g>`).join('')}
    <g transform="translate(30 -30)"><circle r="18" fill="#ffd21f" ${S3}/>${PA.txt(0, 9, 26, OL, '3')}</g></svg>`;
  A.addGame('babies', '#ff6f9c', BABIES_TILE, COMMON);
  const SOUNDS = { dog: 'yip', cat: 'meow', pig: 'oink', hen: 'cluck', duck: 'quack', cow: 'moo', horse: 'neigh', elephant: 'trumpet', sheep: 'baa' };
  const rand = ([a, b]) => a + Math.floor(Math.random() * (b - a + 1));
  // Where the babies sit: a row, or two rows for six or more.
  const slots = n => {
    const rows = n > 5 ? 2 : 1, per = Math.ceil(n / rows), out = [];
    for (let i = 0; i < n; i++) {
      const row = rows === 2 && i >= per ? 1 : 0, k = row ? i - per : i, inRow = row ? n - per : per;
      out.push([900 + (k - (inRow - 1) / 2) * 150, rows === 1 ? 640 : 560 + row * 170]);
    }
    return out;
  };
  A.screens.babies = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('babies'), max = [5, 6, 8][level];
    // Three mums with lots of babies, and one with just one or two, in a random order.
    const plan = shuffle(MANY).slice(0, 3).concat([pick(FEW)]);
    const order = [plan[0], plan[1], plan[3], plan[2]];
    let round = 0;
    scene().innerHTML = `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="Mums and babies">
      ${Art.defs()}<rect width="1600" height="900" fill="#bfe6ff"/>${Art.cloud(300, 120, .8)}${Art.cloud(1150, 90, .7)}
      <path d="M0 470 Q400 430 800 470 T1600 460 V900 H0 Z" fill="#8fd16a"/><path d="M0 560 Q400 520 800 560 T1600 550" fill="none" stroke="#7cc46a" stroke-width="10"/>
      <g id="mum"></g><g id="kids"></g><g id="choices"></g></svg>`;
    const svg = scene().querySelector('svg'), mumG = svg.querySelector('#mum'), kidsG = svg.querySelector('#kids'), choices = svg.querySelector('#choices');

    async function play() {
      const id = order[round], f = FAMS[id], n = Math.min(max, rand(f.range)), eggs = id === 'hen';
      choices.innerHTML = ''; kidsG.innerHTML = '';
      mumG.innerHTML = `<g class="tappable fam-mum" transform="translate(400 560)"><ellipse cy="150" rx="170" ry="34" fill="#000" opacity=".1"/>
        ${id === 'hen' || id === 'duck' ? `<ellipse cx="500" cy="${n > 5 ? 120 : 110}" rx="${n > 5 ? 440 : 470}" ry="${n > 5 ? 200 : 80}" fill="${id === 'hen' ? '#e8c26a' : '#5cc3ff'}" opacity=".7"/>` : ''}
        <g transform="scale(2.4)">${PA.farm(id)}</g></g>`;
      mumG.querySelector('.fam-mum').addEventListener('click', () => (Sfx[SOUNDS[id]] || Sfx.pop).call(Sfx));
      let counted = 0;
      const items = slots(n).map(([x, y], i) => {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'tappable fam-kid');
        g.setAttribute('transform', `translate(${x} ${y})`);
        g.innerHTML = `<g class="kid-art" transform="scale(${n > 5 ? 1.05 : 1.2})">${eggs ? PA.farm('egg') : PA.farm(id, true)}</g>
          <circle r="70" fill="transparent"/>
          <g class="num" opacity="0"><circle cy="-92" r="32" fill="#ffd21f" ${S3}/><text y="-80" font-family="Fredoka, sans-serif" font-weight="700" font-size="38" text-anchor="middle" fill="${OL}"></text></g>`;
        kidsG.appendChild(g);
        g.animate([{ transform: `translate(${x}px, ${y + 60}px) scale(.2)`, opacity: 0 }, { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 }],
          { duration: 420, delay: i * 120, easing: 'cubic-bezier(.3,1.6,.6,1)', fill: 'backwards' });
        g.addEventListener('click', () => {
          if (g.dataset.n) { Sfx.tap(); A.say('babies.n.' + g.dataset.n); return; }
          if (counted >= n) return;
          counted++; g.dataset.n = counted;
          g.querySelector('.num text').textContent = counted;
          g.querySelector('.num').setAttribute('opacity', 1);
          const art = g.querySelector('.kid-art');
          const k = n > 5 ? 1.05 : 1.2;
          art.animate([{ transform: `scale(${k})` }, { transform: `translateY(-24px) scale(${k})` }, { transform: `scale(${k})` }], { duration: 360 });
          Sfx.pop(); A.say('babies.n.' + counted);
          if (counted === n) { A.Hint.clear(); A.later(counted1, 1000); }
          else A.Hint.set(items.filter(t => !t.dataset.n), 'babies.more');
        });
        return g;
      });
      await A.wait(400 + n * 120);
      if (!alive()) return;
      if (round === 0) { await A.say('babies.intro'); if (!alive()) return; }
      A.say('babies.ask.' + id);
      A.Hint.set(items, 'babies.more');

      async function counted1() {
        if (!alive()) return;
        if (level === 0) return done();
        await A.say('babies.how.' + id); if (!alive()) return;
        const opts = new Set([n]);
        while (opts.size < 3) { const d = n + pick([-2, -1, 1, 2]); if (d >= 1 && d <= 9) opts.add(d); }
        choices.innerHTML = [...opts].sort((a, b) => a - b).map((v, i) => `<g class="tappable choice" data-v="${v}" transform="translate(${720 + i * 180} 250)">
          <circle r="70" fill="#fff" stroke="${OL}" stroke-width="8"/><text y="26" font-family="Fredoka, sans-serif" font-weight="700" font-size="80" text-anchor="middle" fill="#ff6f9c">${v}</text></g>`).join('');
        choices.querySelectorAll('.choice').forEach(c => c.addEventListener('click', async () => {
          if (choices.dataset.done === '1') return;
          if (+c.dataset.v !== n) {
            Sfx.boing(); A.Pip.mood('thinking'); A.say('babies.no');
            A.Hint.set([choices.querySelector(`[data-v="${n}"]`)], 'babies.how.' + id, true);
            return;
          }
          choices.dataset.done = '1'; A.Hint.clear(); Sfx.chime();
          await A.say('babies.n.' + n);
          if (alive()) done();
        }));
        choices.dataset.done = '0';
      }
      async function done() {
        A.Pip.mood('cheer'); (Sfx[SOUNDS[id]] || Sfx.pop).call(Sfx);
        if (eggs) {
          Sfx.crack();
          items.forEach((g, i) => A.later(() => { const a = g.querySelector('.kid-art'); a.innerHTML = PA.farm('hen', true); a.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 300 }); }, i * 160));
          await A.say('babies.hatch'); if (!alive()) return;
        }
        await A.say('babies.fact.' + id); if (!alive()) return;
        round++;
        if (round < order.length) { await A.say('babies.next'); if (alive()) play(); return; }
        A.Pip.act('dance'); A.confetti();
        await A.say('babies.allDone');
        if (alive()) A.gameDone('babies');
      }
    }
    play();
  };

  // =====================================================================
  // The puppy room: visit six places, and pick a game
  // =====================================================================
  const PLACE = { // all inside x 200 to 1400, so 4:3 screens show every place
    collars: { x: 300,  y: 470, s: .8,  art: () => PA.collars, hit: [-124, -100, 248, 150] },
    basket:  { x: 470,  y: 700, s: .95, art: () => PA.family(false), hit: [-205, -170, 410, 180] },
    scales:  { x: 790,  y: 690, s: 1.2, art: () => PA.scales(-1), hit: [-96, -170, 192, 180] },
    bowls:   { x: 1000, y: 690, s: 1,   art: () => PA.bowls, hit: [-110, -80, 220, 90] },
    toys:    { x: 1180, y: 690, s: .95, art: () => PA.toyBox(false), hit: [-68, -140, 136, 150] },
    vet:     { x: 1330, y: 690, s: .9,  art: () => PA.vet(false), hit: [-60, -215, 120, 225] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#f07a1a' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(0 34) scale(.62)">${PA.puppy(0)}</g><g opacity="${on ? 1 : 0.3}" transform="translate(24 -24) scale(.7)">${PA.heart('#ff6f9c')}</g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const pupGames = () => A.worldGames('puppies');
  const badgeEarned = () => SPOT_IDS.every(id => P().puppies.includes(id)) && pupGames().every(g => P().games.includes(g.id));

  function roomArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().puppies.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="pup-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + hx + hw - 16} ${p.y + hy + 20})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx}" y="${p.y + hy}" width="${hw}" height="${hh}" fill="transparent"/>
      </g>`;
    }).join('');
    const bunting = Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 28 l50 0 l-25 44 Z" fill="${PUPS[i % 5].collar}" ${S3}/>`).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The puppy room">
      ${Art.defs()}
      <rect width="1600" height="900" fill="#fff1d6"/>
      ${Array.from({ length: 32 }, (_, i) => `<g transform="translate(${50 + (i % 16) * 100} ${150 + Math.floor(i / 16) * 200 + (i % 2) * 100}) scale(.5)" opacity=".18">${PA.pawPrint('#c98b4e')}</g>`).join('')}
      <g transform="translate(820 300)">${PA.dayWindow}</g>
      <rect x="1170" y="240" width="220" height="150" rx="10" fill="#fff" ${S}/><rect x="1184" y="254" width="192" height="122" rx="4" fill="#dff3ff"/><g transform="translate(1282 372) scale(.42)">${PA.family(true)}</g>
      <path d="M0 680 H1600 V900 H0 Z" fill="#c98b4e"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 200} 680 V900" stroke="#a5672e" stroke-width="5"/>`).join('')}
      <path d="M0 680 H1600" stroke="#8b5a2b" stroke-width="10"/>
      <ellipse cx="470" cy="712" rx="250" ry="38" fill="#ff8fb1" opacity=".45"/>
      <path d="M-20 28 Q800 70 1620 28" fill="none" stroke="${OL}" stroke-width="4"/>${bunting}
      <g transform="translate(800 150)"><rect x="-180" y="-40" width="360" height="70" rx="14" fill="#f07a1a" ${S}/>${PA.txt(0, 10, 34, '#fff', 'PUPPY ROOM')}</g>
      ${spots}
    </svg>`;
  }

  // A sticker for each thing in the puppy room, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().puppies.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${PA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${PA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${PA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('puppies.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('puppies')) return;
    P().badges.push('puppies'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Puppy Helper badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Puppy Helper badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('puppies.badge');
  }

  // What changes while a place is talking: the puppies wake up, a puppy is weighed, the toys tumble out, Dr Ade waves.
  const LIVE = { basket: () => PA.family(true), scales: () => PA.scales(Math.floor(Math.random() * 5)), toys: () => PA.toyBox(true), vet: () => PA.vet(true) };
  let welcomed = false;
  A.screens.puppies = (arg, alive) => {
    scene().innerHTML = `<div class="pup-home">${roomArt()}
      <div class="world-tiles">${pupGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.pup-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelectorAll('.pup-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      if (LIVE[id]) art.innerHTML = LIVE[id]();
      sound(id);
      await A.say('puppies.fact.' + id);
      if (!alive()) return;
      if (LIVE[id]) art.innerHTML = PLACE[id].art();
      if (!P().puppies.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.puppies('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.pup-spot[data-s="basket"]')], 'puppies.hint');
    if (!welcomed) { welcomed = true; A.say('puppies.welcome'); } else A.say('puppies.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The puppy room's page in the sticker book, and its badge ----------
  Rewards.pages.puppies = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="pp" data-id="${id}" aria-label="${PA.SPOTS[id].name}">${PA.sticker(id, P().puppies.includes(id))}<span>${P().puppies.includes(id) ? PA.SPOTS[id].name : '?'}</span></button>`).join('')
      + pupGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'pp') return false;
      if (P().puppies.includes(id)) { Sfx.sparkle(); A.say('puppies.name.' + id); }
      else { Sfx.boing(); A.say('puppies.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'puppies', name: 'Puppy Helper', svg: BADGE, earned: () => P().badges.includes('puppies') || badgeEarned(), how: 'puppies.badge.how' });

  window.Puppies = { SPOT_IDS, BADGE, badgeEarned, FAMS };
})();
