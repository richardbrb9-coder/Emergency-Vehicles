// Pip at the Zoo: the zoo world pack. Everything here is words, pictures, levels and the zoo's home screen;
// the games themselves come from the shared engines (Story, BallRun, WordTrain, Sorter).
// Animals and their food (the same pairs in the Snack Run, Who Eats What? and the story).
window.ZOO_EATS = { monkey: 'banana', penguin: 'fish', giraffe: 'leaves', panda: 'bamboo', elephant: 'watermelon', lion: 'meat' };

// ---------- Snack Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun, EATS = window.ZOO_EATS;
  // Built from the Water Run puzzles turned the other way round, then with a second animal under the chute
  // in most of them (the decoy), so the food has to be steered past it. Each was checked solvable by running its physics.
  const zl = (animal, decoyAnimal, p) => Object.assign({ balls: 6, animal, food: EATS[animal], decoyAnimal }, p);
  BR.packs.zoo = {
    id: 'zoo',
    free: { hose: 12, goal: 1, balls: 8, animal: 'elephant', food: 'watermelon' },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      zl('monkey', null,        { hose: 10, goal: 7, tray: ['ramp'], hint: [{ t: 'ramp', c: 9, r: 3, f: true }] }),
      zl('penguin', null,       { hose: 3, goal: 4, tray: ['ramp'], hint: [{ t: 'ramp', c: 2, r: 3 }] }),
      zl('giraffe', 'crocodile',{ hose: 11, goal: 7, decoy: 10, tray: ['long'], hint: [{ t: 'long', c: 9, r: 3, f: true }] }),
      zl('panda', 'lion',       { hose: 4, goal: 6, decoy: 3, tray: ['curve'], hint: [{ t: 'curve', c: 3, r: 3 }] }),
      // 5 to 8: two pieces
      zl('elephant', 'zebra',   { hose: 12, goal: 3, decoy: 11, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 5, r: 4, f: true }] }),
      zl('lion', 'penguin',     { hose: 1, goal: 8, decoy: 0, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 4, r: 4 }] }),
      zl('monkey', 'giraffe',   { hose: 11, goal: 3, decoy: 10, tray: ['long', 'spring'], hint: [{ t: 'long', c: 8, r: 2, f: true }, { t: 'spring', c: 7, r: 5, f: true }] }),
      zl('penguin', 'panda',    { hose: 2, goal: 8, decoy: 1, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 1, r: 3 }, { t: 'ramp', c: 2, r: 3 }] }),
      // 9 to 12: a see-saw or a bucket
      zl('giraffe', 'elephant', { hose: 9, goal: 3, decoy: 8, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 8, r: 3 }, { t: 'ramp', c: 6, r: 5, f: true }] }),
      zl('elephant', null,      { hose: 11, goal: 4, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 10, r: 1, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      zl('panda', 'monkey',     { hose: 8, goal: 1, decoy: 7, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 7, r: 3 }, { t: 'long', c: 3, r: 4, f: true }] }),
      zl('lion', 'zebra',       { hose: 7, goal: 0, decoy: 7, fixed: [{ t: 'block', c: 7, r: 5 }, { t: 'block', c: 4, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 7, r: 1, f: true }, { t: 'long', c: 2, r: 4, f: true }] })
    ]
  };

})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const Z = window.ZooArt;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const EATS = window.ZOO_EATS;
  const FOOD_WORD = { banana: 'bananas', fish: 'fish', leaves: 'leaves', bamboo: 'bamboo', watermelon: 'watermelons', meat: 'meat' };
  // The six animals on the zoo's home screen; meeting each one earns its sticker.
  const ANIMALS = ['elephant', 'giraffe', 'lion', 'penguin', 'monkey', 'panda'];
  const HOMES = { jungle: ['monkey', 'tiger', 'parrot'], sea: ['shark', 'turtle'], ice: ['penguin', 'polarbear'], desert: ['camel', 'meerkat'] };
  const SOUND = { elephant: 'trumpet', giraffe: 'pop', lion: 'roar', penguin: 'honk', monkey: 'oohooh', panda: 'chomp', crocodile: 'chomp', zebra: 'boing' };
  const sound = a => { const s = SOUND[a]; (Sfx[s] || Sfx.pop).call(Sfx); };

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'zoo.welcome': 'Welcome to the zoo! Tap an animal to meet it, or pick a game at the bottom.',
    'zoo.back':    'What shall we do at the zoo now?',
    'zoo.hint':    'Tap an animal to say hello!',
    'zoo.pip':     'Woof! I love the zoo. Tap the animals to find out about them.',
    'zoo.fact.elephant': 'Elephants are the biggest animals on land. They use their long trunks like a hand!',
    'zoo.fact.giraffe':  'Giraffes are the tallest animals in the world. Their long necks reach the tops of the trees.',
    'zoo.fact.lion':     'Lions live together in a family called a pride. Listen to him roar!',
    'zoo.fact.penguin':  "Penguins are birds, but they can't fly. They are brilliant swimmers instead!",
    'zoo.fact.monkey':   'Monkeys are great climbers. Some can even hold on to branches with their tails!',
    'zoo.fact.panda':    'Pandas eat bamboo for most of the day. Munch, munch, munch!',
    'zoo.badge':   'You earned the Zoo Keeper badge! Thank you for helping at the zoo!',
    'book.world.zoo': 'Your zoo stickers! Meet the animals and play the zoo games to fill this page.',
    'zoo.badge.how': 'Meet all six animals and play every zoo game to earn the Zoo Keeper badge.',

    'games.zooStory': 'Feeding Time',
    'games.zoorun':   'Snack Run',
    'games.zootrain': 'Zoo Train',
    'games.zooeat':   'Who Eats What?',
    'games.zoohomes': 'Animal Homes',

    // The story
    'zoo.story.1': "Today Pip is helping Zara the zookeeper. It's feeding time at the zoo!",
    'zoo.story.2': 'First, the monkeys. Zara brings a big bunch of bananas, and the monkeys climb down to munch them.',
    'zoo.story.3': 'Next, the penguins. Splash! They dive into the cold water to catch their fish.',
    'zoo.story.4': 'The giraffe is so tall! She stretches her long neck to eat the leaves at the top of the tree.',
    'zoo.story.5': 'The elephant picks up a whole watermelon with her trunk. Crunch!',
    'zoo.story.6': 'Where is the panda? There he is, hiding in the bamboo, eating his lunch.',
    'zoo.story.7': 'Everyone is full and happy. Thank you for helping, Pip! Goodnight, zoo!',
    'zoo.story.end': 'The end! Thank you for reading with me.',

    // Snack Run (ball run)
    'zoorun.pick':    'Snack Run! Build your own, or try one of my puzzles.',
    'zoorun.free':    'Drag pieces onto the board. Then blow my whistle to send the food down!',
    'zoorun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'zoorun.go':      'Here comes the food!',
    'zoorun.flip':    'Tap a piece to turn it around.',
    'zoorun.n1':      'One!',
    'zoorun.n2':      'Two!',
    'zoorun.n3':      'Three!',
    'zoorun.again':   'Oops! The food missed. Move the pieces and try again.',
    'zoorun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'zoorun.allDone': 'You solved all my puzzles! Every animal has had its dinner!',
    'zoorun.freeOut': 'Yum! Three watermelons for the elephant! What else can you build?',
    'zoorun.bolted':  'That piece is bolted on. Build around it!',
    'zoorun.cleared': "All clear! Let's build something new.",
    'zoorun.p.ramp':   'A ramp! Food rolls down a slope.',
    'zoorun.p.long':   'A long ramp. The food rolls a long way down it.',
    'zoorun.p.curve':  'A curve. It turns falling food to the side.',
    'zoorun.p.funnel': 'A funnel. It catches the food and drops it through the middle.',
    'zoorun.p.spring': 'A spring! Boing! It bounces the food up into the air.',
    'zoorun.p.fan':    'A fan. Whoosh! It blows the food sideways.',
    'zoorun.p.seesaw': 'A see-saw. When food lands on one end, it tips!',
    'zoorun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Who Eats What?
    'zooeat.intro': 'Feeding time! Drag each food to the animal that eats it.',
    'zooeat.no':    'No thank you! Try another animal.',
    'zooeat.done':  'Everyone is full up! Great feeding!',
    'zooeat.yes.monkey':   'Monkeys love bananas!',
    'zooeat.yes.penguin':  'Penguins love fish!',
    'zooeat.yes.giraffe':  'Giraffes love leaves!',
    'zooeat.yes.panda':    'Pandas love bamboo!',
    'zooeat.yes.elephant': 'Elephants love watermelon!',
    'zooeat.yes.lion':     'Lions love meat!',
    'zoo.food.banana': 'Bananas!', 'zoo.food.fish': 'Fish!', 'zoo.food.leaves': 'Leaves!',
    'zoo.food.bamboo': 'Bamboo!', 'zoo.food.watermelon': 'A watermelon!', 'zoo.food.meat': 'Meat!',

    // Animal Homes
    'zoohomes.intro': 'Every animal has a home. Drag each animal to the place where it lives.',
    'zoohomes.no':    "Hmm, that's not its home. Try another place.",
    'zoohomes.done':  'Every animal is home! Brilliant!',
    'zoohomes.home.jungle': 'The jungle. It is hot and rainy, with lots of trees.',
    'zoohomes.home.sea':    'The sea. It is deep, wet and salty.',
    'zoohomes.home.ice':    'The ice. It is freezing cold and snowy.',
    'zoohomes.home.desert': 'The desert. It is hot, dry and sandy.',
    'zoohomes.yes.monkey':    'Monkeys swing through the jungle trees.',
    'zoohomes.yes.tiger':     'Tigers creep through the jungle.',
    'zoohomes.yes.parrot':    'Parrots fly through the jungle.',
    'zoohomes.yes.shark':     'Sharks swim in the sea.',
    'zoohomes.yes.turtle':    'Sea turtles swim in the sea.',
    'zoohomes.yes.penguin':   'Penguins live where it is icy and cold.',
    'zoohomes.yes.polarbear': 'Polar bears live on the snow and ice.',
    'zoohomes.yes.camel':     'Camels live in the hot, dry desert.',
    'zoohomes.yes.meerkat':   'Meerkats dig burrows in the desert sand.',

    // Zoo Train
    'zootrain.pick': 'All aboard the Zoo Train! Animal names are made of beats. Pick a game.',
    'zootrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!'
  });
  ANIMALS.forEach(a => { L['zoo.sticker.' + a] = `You earned the ${a} sticker!`; });
  Object.keys(EATS).forEach(a => {
    const f = FOOD_WORD[EATS[a]];
    L['zoorun.want.' + a] = `The ${a} is hungry! Help the ${f} roll down to the ${a}.`;
    L['zoorun.no.' + a] = `Oops! That food is for the ${a}.`;
    L['zoorun.fed.' + a] = `Yum yum! Three ${f} for the ${a}!`;
  });
  [...new Set([...Object.keys(EATS), ...Object.values(HOMES).flat()])].forEach(a => { L['zoo.name.' + a] = `${cap(Z.ANIMALS[a].name)}!`; });

  // Pip wears the safari hat on every zoo screen.
  ['zoo', 'zooStory', 'zoorun', 'zootrain', 'zooeat', 'zoohomes'].forEach(s => { A.screenWorld[s] = 'zoo'; });
  const COMMON = { world: 'zoo', back: 'zoo' };

  // =====================================================================
  // Feeding Time: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const pipAt = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip('zoo').replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const grass = `<path d="M0 500 Q300 470 600 495 T1200 490 V660 H0 Z" fill="#8ccf78"/><path d="M0 560 Q400 540 800 565 T1200 560 V660 H0 Z" fill="#7cc46a"/>`;
  const PAGES = [
    () => page('#bfe6ff', `${Art.cloud(80, 60, .8)}${Art.cloud(860, 40, .7)}${grass}
      <rect x="330" y="150" width="40" height="370" rx="8" fill="#8b5a2b" ${S}/><rect x="830" y="150" width="40" height="370" rx="8" fill="#8b5a2b" ${S}/>
      <path d="M300 170 Q600 40 900 170 L900 220 Q600 100 300 220 Z" fill="#2e9e4f" ${S}/>
      <text x="600" y="168" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="64" fill="#fff" stroke="${OL}" stroke-width="3">ZOO</text>
      ${Z.fence(0, 520, 300)}${Z.fence(900, 520, 300)}
      ${at(520, 560, 1.15, Z.keeper(true))}${pipAt(640, 360, 200)}
      ${tap('trumpet', at(1060, 380, .9, Z.animal('elephant')))}${tap('honk', at(150, 420, .8, Z.animal('penguin')))}`),
    () => page('#d6f0c2', `${grass}${Z.palm(780, 560, 1.5)}${Z.palm(1020, 560, 1.2)}
      ${tap('oohooh', at(770, 250, 1.2, Z.animal('monkey', 'open')))}${tap('oohooh', at(1010, 330, 1.05, Z.animal('monkey')))}${tap('oohooh', at(600, 520, 1.1, Z.animal('monkey', 'munch')))}
      ${at(340, 600, 1.15, Z.keeper(false))}${at(400, 470, 1.4, Z.FOOD.banana)}${at(440, 500, 1.3, Z.FOOD.banana)}${pipAt(100, 400, 190)}`),
    () => page('#dff3ff', `<path d="M0 420 H1200 V660 H0 Z" fill="url(#water)"/><path d="M0 420 q50 -14 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0" fill="none" stroke="#bfe6ff" stroke-width="8"/>
      <path d="M0 440 V330 Q160 300 330 330 L380 440 Z" fill="#fff" ${S}/>
      ${tap('honk', at(80, 290, .8, Z.animal('penguin', 'open')))}${tap('honk', at(330, 300, .65, Z.animal('penguin')))}
      ${tap('plop', at(700, 470, .7, Z.animal('penguin', 'munch')))}${at(760, 440, 1, Z.FOOD.fish)}${at(900, 300, .9, `<g transform="rotate(-30)">${Z.FOOD.fish}</g>`)}
      <circle cx="660" cy="410" r="10" fill="#fff" opacity=".7"/><circle cx="640" cy="380" r="7" fill="#fff" opacity=".7"/>
      ${at(1040, 470, 1.1, Z.keeper(false))}${pipAt(120, 160, 170)}`),
    () => page('#ffe9b8', `${grass}${Art.tree(330, 520, 1.3)}
      <path d="M560 560 Q560 380 470 230" fill="none" stroke="${OL}" stroke-width="66" stroke-linecap="round"/><path d="M560 560 Q560 380 470 230" fill="none" stroke="#f2b705" stroke-width="56" stroke-linecap="round"/>
      <circle cx="540" cy="460" r="12" fill="#b5651d"/><circle cx="520" cy="360" r="14" fill="#b5651d"/><circle cx="555" cy="520" r="10" fill="#b5651d"/>
      ${tap('pop', at(462, 170, 1.7, Z.animal('giraffe', 'munch')))}${at(350, 110, 1.4, Z.FOOD.leaves)}
      ${at(860, 600, 1.1, Z.keeper(true))}${pipAt(960, 400, 190)}`),
    () => page('#f2e4d0', `${grass}${Z.pool(980, 560, 160, 40)}
      ${tap('trumpet', at(420, 330, 1.8, Z.body('elephant') + Z.animal('elephant')))}${at(445, 440, 1.4, Z.FOOD.watermelon)}
      <path d="M480 400 l20 -20 M500 440 l30 -6 M490 370 l14 -26" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
      ${at(850, 580, 1, Z.keeper(false))}${pipAt(960, 360, 170)}`),
    () => page('#d6f0c2', `${grass}${Z.bambooClump(330, 580, 1.8)}${Z.bambooClump(560, 590, 1.5)}${Z.bambooClump(820, 590, 1.9)}
      ${tap('chomp', at(600, 470, 1.1, Z.animal('panda', 'munch')))}${at(680, 500, 1.2, Z.FOOD.bamboo)}
      ${Z.bambooClump(470, 640, 1.1)}${Z.bambooClump(760, 650, 1)}
      ${at(1060, 600, 1, Z.keeper(false))}${pipAt(60, 420, 170)}`),
    () => page('#3a3f7a', `<circle cx="1040" cy="110" r="60" fill="#fff6cc" ${S3}/><circle cx="1016" cy="96" r="10" fill="#efe3a8"/>
      ${[[120, 80], [300, 140], [520, 60], [760, 120], [880, 50], [200, 230]].map(([x, y]) => `<path d="M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z" fill="#ffd21f"/>`).join('')}
      <path d="M0 470 Q300 440 600 465 T1200 460 V660 H0 Z" fill="#4f7a4a"/>
      ${['monkey', 'penguin', 'giraffe', 'elephant', 'panda', 'lion'].map((a, i) => tap(SOUND[a] || 'pop', at(130 + i * 120, 500 + (i % 2) * 30, .8, Z.animal(a)))).join('')}
      ${at(900, 640, 1.05, Z.keeper(true))}${pipAt(1000, 440, 180)}`)
  ];
  Story.mount(Object.assign({ screen: 'zooStory', colour: '#2e9e4f', cls: 'zoo-story', lines: { end: 'zoo.story.end' },
    pages: PAGES.map((art, i) => ({ art, line: 'zoo.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Snack Run: food rolls from the keeper's chute to the hungry animal
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, COLS, ROWS, R, NEED } = BR;
  const leafy = (ctx, now) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#eef9e4'); g.addColorStop(1, '#d6efc4');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(46,158,79,.22)';
    for (let c = 1; c < COLS; c++) for (let r = 1; r < ROWS; r++) { ctx.beginPath(); ctx.ellipse(c * CELL, r * CELL, 7, 4, (c + r) % 2 ? .6 : -.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#7cc46a'; ctx.fillRect(0, H - 10, W, 10);
  };
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const SNACK_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -30 L0 -6" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -30 L0 -6" stroke="#f07a1a" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-28 -44) scale(.42)">${Z.FOOD.banana}</g><g transform="translate(14 -14) scale(.4)">${Z.FOOD.apple}</g>
    <g transform="translate(6 30) scale(.5)">${Z.animal('monkey', 'open')}</g></svg>`;
  const zooTheme = {
    board: leafy,
    source(ctx, level, now, dripping) {
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      poly(ctx, [{ x: x - 44, y: -6 }, { x: x + 44, y: -6 }, { x: x + 40, y: 40 }, { x: x - 40, y: 40 }], '#c98b4e');
      line(ctx, x - 40, 14, x + 40, 14, '#a8622c', 4);
      poly(ctx, [{ x: x - 20, y: 40 }, { x: x + 20, y: 40 }, { x: x + 14, y: 62 }, { x: x - 14, y: 62 }], '#8b5a2b');
      if (dripping) drawImg(ctx, Z.foodImage(level.food), x, 48 + (now / 25) % 6, 26, 26);
    },
    ball(ctx, b, level) { drawImg(ctx, Z.foodImage(level.food), b.position.x, b.position.y, 40, 40, b.angle); },
    goal(ctx, st) {
      const { level, fx, hits, won, now } = st, x = (level.goal + 1) * CELL;
      const mood = fx.chew > 0 ? 'munch' : won ? 'smile' : 'open', bob = won ? Math.sin(now / 120) * 6 : 0;
      drawImg(ctx, Z.animalImage(level.animal, mood), x, H - 100 + bob, 200, 206);
      for (let i = 0; i < NEED; i++) { // three hearts fill up as the animal eats
        const hx = x - 44 + i * 44, hy = H - 222;
        ctx.save(); ctx.translate(hx, hy); ctx.scale(1.3, 1.3);
        ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(-18, -2, -12, -18, 0, -8); ctx.bezierCurveTo(12, -18, 18, -2, 0, 10);
        ctx.fillStyle = i < hits ? '#e53935' : 'rgba(255,255,255,.8)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = OL; ctx.stroke(); ctx.restore();
      }
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 10 : 0);
      drawImg(ctx, Z.animalImage(level.decoyAnimal, 'smile'), x, H - 96, 190, 196);
    },
    splash: '#9ccc65',
    release() { Sfx.plop(); },
    hit(ev, fx) { Sfx.chomp(2); fx.chew = 36; fx.burst(ev.x, ev.y, 8, '#ff8fa3', 1.2); },
    win(fx) { fx.chew = 0; },
    tapGoal(level) { sound(level.animal); },
    tapDecoy(level) { sound(level.decoyAnimal); },
    refuse: level => 'zoorun.no.' + level.animal,
    intro: level => 'zoorun.want.' + level.animal,
    winLine: level => 'zoorun.fed.' + level.animal
  };
  BR.mount(Object.assign({ screen: 'zoorun', lines: 'zoorun', colour: '#2e9e4f', icon: SNACK_ICON, pack: BR.packs.zoo, theme: zooTheme, cls: 'zoo-run' }, COMMON));

  // =====================================================================
  // Zoo Train: animal names in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat. alone/carrier: see the Rescue Station words.
  WordTrain.packs.zoo = {
    id: 'zoo',
    words: [
      { id: 'zebra',       word: 'zebra',       beats: ['zeb', 'ra'],               say: ['zeb', 'ruh'],               pic: 'zebra' },
      { id: 'monkey',      word: 'monkey',      beats: ['mon', 'key'],              say: ['mun', 'key'],               pic: 'monkey' },
      { id: 'tiger',       word: 'tiger',       beats: ['ti', 'ger'],               say: ['tie', 'guh'],               pic: 'tiger' },
      { id: 'panda',       word: 'panda',       beats: ['pan', 'da'],               say: ['pan', 'duh'],               pic: 'panda' },
      { id: 'penguin',     word: 'penguin',     beats: ['pen', 'guin'],             say: ['pen', 'Gwyn'],              pic: 'penguin', alone: [1] },
      { id: 'parrot',      word: 'parrot',      beats: ['par', 'rot'],              say: ['pa', 'rut'],                pic: 'parrot' },
      { id: 'elephant',    word: 'elephant',    beats: ['el', 'e', 'phant'],        say: ['el', 'ih', 'funt'],         pic: 'elephant', alone: [1], carrier: { 1: 'it' } },
      { id: 'crocodile',   word: 'crocodile',   beats: ['croc', 'o', 'dile'],       say: ['crock', 'uh', 'dial'],      pic: 'crocodile' },
      { id: 'kangaroo',    word: 'kangaroo',    beats: ['kan', 'ga', 'roo'],        say: ['kang', 'guh', 'roo'],       pic: 'kangaroo' },
      { id: 'flamingo',    word: 'flamingo',    beats: ['fla', 'min', 'go'],        say: ['fluh', 'ming', 'go'],       pic: 'flamingo' },
      { id: 'caterpillar', word: 'caterpillar', beats: ['cat', 'er', 'pil', 'lar'], say: ['cat', 'uh', 'pill', 'uh'],  pic: 'caterpillar' },
      { id: 'watermelon',  word: 'watermelon',  beats: ['wa', 'ter', 'mel', 'on'],  say: ['wor', 'tuh', 'mel', 'un'],  pic: 'watermelon', alone: [3] }
    ]
  };
  const trainPic = w => Z.ANIMALS[w.pic] ? Z.animalSvg(w.pic) : Z.foodSvg(w.pic);
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(1))}</g><g transform="translate(262 72) scale(.6)">${Z.animal('zebra')}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'zootrain', pack: WordTrain.packs.zoo, colour: '#f07a1a', tile: TRAIN_TILE, picture: trainPic, cls: 'zoo-train',
    lines: { pick: 'zootrain.pick', done: 'zootrain.done' } }, COMMON));

  // =====================================================================
  // Who Eats What? and Animal Homes (the sorting engine)
  // =====================================================================
  const shuffle = Sorter.shuffle;
  const EAT_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-22 -10) scale(.62)">${Z.animal('monkey', 'open')}</g><g transform="translate(30 30) scale(.6)">${Z.FOOD.banana}</g>
    <path d="M10 -40 Q30 -40 30 -20" fill="none" stroke="${OL}" stroke-width="4" stroke-dasharray="6 5"/></svg>`;
  Sorter.mount(Object.assign({
    screen: 'zooeat', colour: '#e53935', tile: EAT_TILE, cls: 'zoo-eat',
    lines: { intro: 'zooeat.intro', no: 'zooeat.no', done: 'zooeat.done' },
    round(level) {
      const animals = shuffle(Object.keys(EATS)).slice(0, 3 + level);
      return {
        bins: animals.map(a => ({ id: a, art: Z.animalSvg(a, 'open'), name: 'zoo.name.' + a })),
        items: animals.map(a => ({ id: EATS[a], art: Z.foodSvg(EATS[a]), bin: a, line: 'zooeat.yes.' + a, name: 'zoo.food.' + EATS[a] }))
      };
    },
    onRight(binEl, it) { Sfx.chomp(3); binEl.querySelector('.so-art').innerHTML = Z.animalSvg(it.bin, 'munch'); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  const HOMES_TILE = `<svg viewBox="0 0 240 150"><clipPath id="ht"><rect width="240" height="150" rx="24"/></clipPath><g clip-path="url(#ht)">
    <g transform="scale(.5)">${Z.HOMES.jungle.art}</g><g transform="translate(120 0) scale(.5)">${Z.HOMES.ice.art}</g>
    <g transform="translate(0 75) scale(.5)">${Z.HOMES.sea.art}</g><g transform="translate(120 75) scale(.5)">${Z.HOMES.desert.art}</g></g>
    <g transform="translate(180 40) scale(.5)">${Z.animal('penguin')}</g><g transform="translate(60 40) scale(.5)">${Z.animal('monkey')}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'zoohomes', colour: '#1e5bd6', tile: HOMES_TILE, cls: 'zoo-homes',
    lines: { intro: 'zoohomes.intro', no: 'zoohomes.no', done: 'zoohomes.done' },
    round(level) {
      const homes = shuffle(Object.keys(HOMES)).slice(0, 2 + level);
      return {
        bins: homes.map(h => ({ id: h, art: `<svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice">${Z.HOMES[h].art}</svg>`, name: 'zoohomes.home.' + h, cls: 'home-' + h })),
        items: homes.flatMap(h => shuffle(HOMES[h]).slice(0, 2).map(a => ({ id: a, art: Z.animalSvg(a), bin: h, line: 'zoohomes.yes.' + a, name: 'zoo.name.' + a })))
      };
    },
    onRight(binEl, it) { sound(it.id); }
  }, COMMON));

  // =====================================================================
  // The zoo: meet six animals, and pick a game
  // =====================================================================
  const PENS = {
    elephant: { x: 280, y: 560, s: 1, back: Z.pool(330, 640, 90, 20) },
    giraffe:  { x: 500, y: 600, s: 1.1, back: Art.tree(560, 610, .8), neck: true },
    lion:     { x: 690, y: 560, s: .95, back: `<path d="M640 610 Q640 470 720 470 Q800 470 800 610 Z" fill="#b9b3a6" ${S}/><path d="M680 520 Q700 500 730 510" fill="none" stroke="#9b958a" stroke-width="5"/>` },
    penguin:  { x: 900, y: 600, s: 1.05, back: `<ellipse cx="900" cy="612" rx="96" ry="26" fill="#dff3ff" ${S3}/>${Z.pool(960, 616, 50, 14)}` },
    monkey:   { x: 1100, y: 470, s: 1, back: Z.palm(1110, 620, 1.25) },
    panda:    { x: 1300, y: 540, s: .95, back: Z.bambooClump(1330, 620, 1.1) + Z.bambooClump(1250, 625, .9) }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#2e9e4f' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(0 -2) scale(.42)">${Z.animal('elephant')}</g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const zooGames = () => A.worldGames('zoo');
  const badgeEarned = () => ANIMALS.every(a => P().animals.includes(a)) && zooGames().every(g => P().games.includes(g.id));

  function zooArt() {
    const pens = ANIMALS.map(a => {
      const p = PENS[a], got = P().animals.includes(a);
      const neck = p.neck ? `<path d="M${p.x} ${p.y} Q${p.x} ${p.y - 90} ${p.x - 10} ${p.y - 150}" fill="none" stroke="${OL}" stroke-width="40" stroke-linecap="round"/><path d="M${p.x} ${p.y} Q${p.x} ${p.y - 90} ${p.x - 10} ${p.y - 150}" fill="none" stroke="#f2b705" stroke-width="31" stroke-linecap="round"/>` : '';
      const hy = p.neck ? p.y - 190 : p.y - 70 * p.s;
      return `<g class="zoo-pen tappable" data-a="${a}">
        ${p.back}${neck}
        <g class="pen-animal" transform="translate(${p.neck ? p.x - 10 : p.x} ${hy}) scale(${p.s})">${Z.body(a)}${Z.animal(a)}</g>
        ${got ? `<g transform="translate(${p.x + 56} ${p.y - 150})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x - 95}" y="${p.y - 260}" width="190" height="290" fill="transparent"/>
      </g>`;
    }).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The zoo">
      ${Art.defs()}
      <rect width="1600" height="900" fill="url(#sky)"/>
      <g class="clouds">${Art.cloud(140, 90, .8)}${Art.cloud(1180, 70, .7)}</g>
      <path d="M0 420 Q300 360 640 400 T1280 390 T1600 400 V900 H0 Z" fill="#9fd88d"/>
      <path d="M0 640 Q400 600 800 640 T1600 630 V900 H0 Z" fill="#8ccf78"/>
      <path d="M-20 760 Q400 690 800 740 T1620 720" fill="none" stroke="#d9bb7a" stroke-width="90" stroke-linecap="round"/>
      <path d="M-20 760 Q400 690 800 740 T1620 720" fill="none" stroke="#f4dca0" stroke-width="74" stroke-linecap="round"/>
      ${Art.tree(150, 520, .8)}${Art.tree(1470, 530, .85)}${Art.bush(220, 640, .8)}${Art.bush(1400, 650, .9)}
      ${pens}
      ${Z.fence(200, 650, 1200)}
    </svg>`;
  }

  // A sticker for each animal, given the first time the child meets it.
  function animalSticker(a) {
    return new Promise(resolve => {
      P().animals.push(a); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${cap(a)} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${cap(a)} sticker!</h2>
          <div class="sticker-big">${Z.sticker(a, true)}</div>
        </div>`, resolve);
      A.say('zoo.sticker.' + a);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('zoo')) return;
    P().badges.push('zoo'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Zoo Keeper badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Zoo Keeper badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('zoo.badge');
  }

  let welcomed = false;
  A.screens.zoo = (arg, alive) => {
    scene().innerHTML = `<div class="zoo-home">${zooArt()}
      <div class="zoo-tiles">${zooGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.zoo-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelectorAll('.zoo-pen').forEach(pen => pen.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const a = pen.dataset.a, art = pen.querySelector('.pen-animal');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      sound(a);
      await A.say('zoo.fact.' + a);
      if (!alive()) return;
      if (!P().animals.includes(a)) {
        await animalSticker(a);
        if (!alive()) return;
        A.screens.zoo('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.zoo-pen')], 'zoo.hint');
    if (!welcomed) { welcomed = true; A.say('zoo.welcome'); } else A.say('zoo.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The zoo's page in the sticker book, and its badge ----------
  Rewards.pages.zoo = () => ({
    html: ANIMALS.map(a => `<button data-kind="za" data-id="${a}" aria-label="${cap(a)}">${Z.sticker(a, P().animals.includes(a))}<span>${P().animals.includes(a) ? cap(a) : '?'}</span></button>`).join('')
      + zooGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'za') return false;
      if (P().animals.includes(id)) { Sfx.sparkle(); A.say('zoo.name.' + id); }
      else { Sfx.boing(); A.sayText(`Tap the ${id} at the zoo to find this sticker.`); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'zoo', name: 'Zoo Keeper', svg: BADGE, earned: () => P().badges.includes('zoo') || badgeEarned(), how: 'zoo.badge.how' });

  window.Zoo = { ANIMALS, EATS, HOMES, BADGE, badgeEarned };
})();
