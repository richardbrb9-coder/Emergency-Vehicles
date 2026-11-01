// Pip at the Supermarket: the supermarket world pack. Words, pictures, levels and the shop home screen, plus one
// game of its own (Shopping List). The story, Trolley Run, Shop Train and Pack the Bags come from the shared engines
// (Story, BallRun, WordTrain, Sorter).

// ---------- Trolley Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Crayon Run puzzles (themselves the Gobble Run layouts) in a new order within each group, each checked
  // solvable again by running its physics with the hint pieces in place.
  // food: what rolls down (one kind per puzzle). decoy: a cardboard box under the chute.
  const fd = (food, p) => Object.assign({ balls: 6, food }, p);
  BR.packs.supermarket = {
    id: 'supermarket',
    free: { hose: 1, goal: 11, balls: 8, food: 'mixed' },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      fd('orange', { hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      fd('apple',  { hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      fd('tin',    { hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      fd('tomato', { hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      // 5 to 8: two pieces
      fd('lemon',  { hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      fd('onion',  { hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      fd('orange', { hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      fd('tin',    { hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      // 9 to 12: a see-saw or a bucket
      fd('apple',  { hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      fd('tomato', { hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      fd('lemon',  { hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] }),
      fd('onion',  { hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] })
    ]
  };
  // The food each ball is: one kind per puzzle, every kind in turn in the free build.
  BR.shopFood = (level, idx) => level.food === 'mixed' ? window.SupermarketArt.ROUND_IDS[idx % 6] : level.food;
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const SMA = window.SupermarketArt, ITEMS = SMA.ITEMS;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().supermarket) P().supermarket = [];
  const shuffle = Sorter.shuffle;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  // The six places to visit in the shop; visiting each one earns its sticker.
  const SPOT_IDS = ['trolley', 'fruit', 'bakery', 'fridge', 'scales', 'till'];
  const SOUND = { trolley: 'roller', fruit: 'pop', bakery: 'sparkle', fridge: 'whoosh', scales: 'plink', till: 'beep' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);
  // The plural of each round food, for the Trolley Run lines.
  const MANY = { orange: 'oranges', apple: 'apples', tomato: 'tomatoes', lemon: 'lemons', tin: 'tins of beans', onion: 'onions' };

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'supermarket.welcome': 'Welcome to the supermarket! Tap things in the shop to find out about them, or pick a game at the bottom.',
    'supermarket.back':    'What shall we do at the supermarket now?',
    'supermarket.hint':    'Tap something in the shop!',
    'supermarket.pip':     "Woof! It's shopping day. Tap things in the shop to explore.",
    'supermarket.fact.trolley': 'This is our trolley. Hold on to the side and stay close to your grown-up. If you ever get lost, ask someone who works in the shop to help.',
    'supermarket.fact.fruit':   'Fruit and vegetables come in every colour of the rainbow! Try to eat five every day to help you grow strong.',
    'supermarket.fact.bakery':  'The bakery bakes fresh bread every morning: loaves, rolls and croissants. Can you smell it? Mmm!',
    'supermarket.fact.fridge':  'Brrr! The fridge keeps milk, cheese and yoghurt cold, so they stay fresh and safe to eat.',
    'supermarket.fact.scales':  'The scales tell us how heavy things are. Put the bananas on, and the numbers go up!',
    'supermarket.fact.till':    "Hello! I'm Ruby. At the till, I scan each thing. Beep! Then the screen shows how much to pay.",
    'supermarket.badge':     'You earned the Super Shopper badge! Mum says you are the best helper!',
    'supermarket.badge.how': 'Visit everything in the shop and play every supermarket game to earn the Super Shopper badge.',
    'book.world.supermarket': 'Your supermarket stickers! Explore the shop and play the games to fill this page.',

    'games.shopStory':  'The Big Shop',
    'games.trolleyrun': 'Trolley Run',
    'games.shoptrain':  'Shop Train',
    'games.shoplist':   'Shopping List',
    'games.packbags':   'Pack the Bags',

    // The story
    'supermarket.story.1': "It's shopping day! The cupboards are nearly empty. Pip and Mum write a shopping list, with a picture for each thing.",
    'supermarket.story.2': 'At the supermarket, Mum takes a big trolley. Pip holds on to the side. In a busy shop, we always stay close to our grown-up.',
    'supermarket.story.3': 'First, fruit and vegetables! Pip picks shiny red apples, yellow bananas and crunchy orange carrots. Yum!',
    'supermarket.story.4': 'Next, the bakery. Mmm, it smells of warm bread! Pip chooses a big loaf, for toast in the morning.',
    'supermarket.story.5': 'Brrr! The fridges are chilly. Milk, cheese and yoghurt are kept cold, so they stay fresh. Tick, tick, tick!',
    'supermarket.story.6': "Pip spots a giant lollipop. Can we have it, please? Not today, says Mum. It isn't on our list. Pip takes a big breath. OK!",
    'supermarket.story.7': 'At the till, everything goes on the belt. Beep, beep, beep! Ruby scans the shopping, Mum pays, and Pip helps pack the bags.',
    'supermarket.story.8': 'At home, everything is put away: cold things in the fridge, and bread in the bread bin. What a big shop! Who wants a banana?',
    'supermarket.story.end': 'The end! Thank you for reading with me.',

    // Trolley Run (ball run)
    'trolleyrun.pick':    'Trolley Run! Build your own, or try one of my puzzles.',
    'trolleyrun.free':    'Drag pieces onto the board. Then blow my whistle to roll the shopping down!',
    'trolleyrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'trolleyrun.go':      'Here comes the shopping!',
    'trolleyrun.flip':    'Tap a piece to turn it around.',
    'trolleyrun.n1':      'One!',
    'trolleyrun.n2':      'Two!',
    'trolleyrun.n3':      'Three!',
    'trolleyrun.again':   'Oops! The shopping missed the trolley. Move the pieces and try again.',
    'trolleyrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'trolleyrun.allDone': 'You solved all my puzzles! The trolley is full to the top!',
    'trolleyrun.freeOut': 'What a full trolley! What else can you build?',
    'trolleyrun.bolted':  'That piece is bolted on. Build around it!',
    'trolleyrun.cleared': "All clear! Let's build something new.",
    'trolleyrun.p.ramp':   'A ramp! The shopping rolls down a slope.',
    'trolleyrun.p.long':   'A long ramp. The shopping rolls a long way down it.',
    'trolleyrun.p.curve':  'A curve. It turns falling shopping to the side.',
    'trolleyrun.p.funnel': 'A funnel. It catches the shopping and drops it through the middle.',
    'trolleyrun.p.spring': 'A spring! Boing! It bounces the shopping up into the air.',
    'trolleyrun.p.fan':    'A fan. Whoosh! It blows the shopping sideways.',
    'trolleyrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'trolleyrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Shop Train
    'shoptrain.pick': 'All aboard the Shop Train! Food words are made of beats too. Pick a game.',
    'shoptrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!',

    // Shopping List
    'list.intro':  "Here is Mum's shopping list. Find each thing on the shelves, and tap it to put it in the trolley.",
    'list.count':  'Look at the dots on the list. They tell you how many we need!',
    'list.next':   "Here's another list!",
    'list.go':     'What else is on the list? Find it on the shelves.',
    'list.no':     "Hmm, that isn't on our list. Look at the pictures on the list.",
    'list.enough': 'We have enough of those now. What else is on the list?',
    'list.tick':   'Tick!',
    'list.till':   "Everything on the list! Let's go to the till, and count the shopping. Beep!",
    'list.paid':   'All paid for! Thank you, Ruby!',
    'list.allDone': 'Brilliant shopping! You found everything on the list!',

    // Pack the Bags
    'packbags.intro': 'Help Pip pack the shopping! Look at the picture on each bag, and drag the shopping into the right one.',
    'packbags.no':    'Hmm, look at the picture on the bag. Does it go in there?',
    'packbags.done':  'All the shopping is packed. Thank you for helping!',
    'packbags.bin.fruit': 'The fruit bag.',
    'packbags.bin.veg':   'The vegetable bag.',
    'packbags.bin.cold':  'The cool bag. It keeps cold things cold.',
    'packbags.bin.bread': 'The bread bag.',
    'packbags.yes.apple':      'An apple is a fruit. Into the fruit bag!',
    'packbags.yes.banana':     'Bananas are fruit. Into the fruit bag!',
    'packbags.yes.orange':     'An orange is a fruit. Into the fruit bag!',
    'packbags.yes.pear':       'A pear is a fruit. Into the fruit bag!',
    'packbags.yes.grapes':     'Grapes are fruit. Into the fruit bag!',
    'packbags.yes.strawberry': 'Strawberries are fruit. Into the fruit bag!',
    'packbags.yes.carrot':     'A carrot is a vegetable. Into the veg bag!',
    'packbags.yes.broccoli':   'Broccoli is a vegetable. Into the veg bag!',
    'packbags.yes.potato':     'A potato is a vegetable. Into the veg bag!',
    'packbags.yes.cucumber':   'A cucumber is a vegetable. Into the veg bag!',
    'packbags.yes.onion':      'An onion is a vegetable. Into the veg bag!',
    'packbags.yes.milk':       'Milk is kept cold. Into the cool bag!',
    'packbags.yes.cheese':     'Cheese is kept cold. Into the cool bag!',
    'packbags.yes.yoghurt':    'Yoghurt is kept cold. Into the cool bag!',
    'packbags.yes.butter':     'Butter is kept cold. Into the cool bag!',
    'packbags.yes.loaf':       'A loaf of bread. Into the bread bag!',
    'packbags.yes.rolls':      'Bread rolls. Into the bread bag!',
    'packbags.yes.croissant':  'A croissant, from the bakery. Into the bread bag!'
  });
  // Each food's name ("An apple!"), said when it is tapped.
  Object.keys(SMA.NAMES).forEach(id => { L['shop.food.' + id] = cap(SMA.NAMES[id]) + '!'; });
  for (let n = 1; n <= 8; n++) L['list.n' + n] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'][n - 1] + '!';
  Object.keys(MANY).forEach(f => {
    L['trolleyrun.want.' + f] = `Mum needs three ${MANY[f]}! Roll them into the trolley.`;
    L['trolleyrun.no.' + f] = `Oops! That's a cardboard box. Roll the ${MANY[f]} into the trolley.`;
    L['trolleyrun.fed.' + f] = `Three ${MANY[f]} in the trolley! Well done!`;
  });
  SPOT_IDS.forEach(id => {
    const n = SMA.SPOTS[id].name;
    L['supermarket.sticker.' + id] = `You earned the ${id === 'till' ? n : n.toLowerCase()} sticker!`;
    L['supermarket.name.' + id] = n + '!';
    L['supermarket.find.' + id] = id === 'till' ? 'Tap Ruby at the till to find this sticker.' : `Tap the ${n.toLowerCase()} in the shop to find this sticker.`;
  });

  // Pip wears his shop apron on every supermarket screen.
  ['supermarket', 'shopStory', 'trolleyrun', 'shoptrain', 'shoplist', 'packbags'].forEach(s => { A.screenWorld[s] = 'supermarket'; });
  const COMMON = { world: 'supermarket', back: 'supermarket' };

  // =====================================================================
  // The Big Shop: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const pipAt = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip('supermarket').replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const tiles = (y = 520, c1 = '#eef1f6', c2 = '#dde2ea') => `<path d="M0 ${y} H1200 V660 H0 Z" fill="${c1}"/>${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 100} ${y} L${i * 120 - 120} 660" stroke="${c2}" stroke-width="4"/>`).join('')}
    <path d="M0 ${y + 60} H1200" stroke="${c2}" stroke-width="4"/><path d="M0 ${y} H1200" stroke="#9aa3b5" stroke-width="8"/>`;
  const shopWall = `<rect width="1200" height="520" rx="30" fill="#fff8e6"/>${tiles()}`;
  const kitchen = `<rect width="1200" height="500" rx="30" fill="#ffe9d6"/><path d="M0 500 H1200 V660 H0 Z" fill="#c98b4e"/>
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 200} 500 V660" stroke="#a5672e" stroke-width="4"/>`).join('')}<path d="M0 500 H1200" stroke="#8b5a2b" stroke-width="10"/>
    <rect x="80" y="70" width="230" height="170" rx="10" fill="#bfe6ff" ${S}/><path d="M195 70 V240 M80 155 H310" ${S}/>`;
  const mum = (x, y, s = 1.1) => tap('woof', at(x, y, s, SMA.pipMum()));
  const table = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-200" y="-12" width="400" height="24" rx="8" fill="#e8a54b" ${S}/><path d="M-170 12 V120 M170 12 V120" stroke="${OL}" stroke-width="14"/><path d="M-170 12 V120 M170 12 V120" stroke="#c98b4e" stroke-width="8"/></g>`;
  const say = (x, y, t, c = '#e53935', size = 64) => `<text x="${x}" y="${y}" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const PAGES = [
    () => page('#ffe9d6', `${kitchen}
      <rect x="800" y="90" width="240" height="200" rx="8" fill="#a5672e" ${S}/><path d="M800 190 H1040" ${S}/>
      <path d="M800 90 L740 110 V270 L800 290 Z M1040 90 L1100 110 V270 L1040 290 Z" fill="#f6e2c4" ${S}/>
      ${at(980, 162, .5, ITEMS.tin)}${table(600, 470)}
      ${tap('pop', at(600, 400, .9, SMA.list(['apple', 'loaf', 'milk'])))}
      ${mum(330, 610)}${pipAt(820, 300, 240)}`),
    () => page('#bfe6ff', `${Art.cloud(80, 60, .8)}${Art.cloud(880, 40, .7)}<path d="M0 520 H1200 V660 H0 Z" fill="#c3cad6"/><path d="M0 520 H1200" stroke="#9aa3b5" stroke-width="8"/>
      ${at(600, 530, 3, SMA.shopFront)}
      ${mum(330, 640, 1.1)}${tap('roller', at(800, 640, 1.3, SMA.trolley()))}${pipAt(500, 400, 220)}`),
    () => page('#fff8e6', `${shopWall}
      ${tap('pop', at(460, 540, 1.3, SMA.fruitStand))}
      ${tap('roller', at(1010, 630, 1.1, SMA.trolley(['apple', 'banana', 'carrot'])))}${pipAt(690, 400, 200)}`),
    () => page('#fff8e6', `${shopWall}
      ${tap('sparkle', at(420, 560, 1.4, SMA.bakery))}
      ${[[680, 220], [720, 160], [650, 120]].map(([x, y], i) => `<path d="M${x} ${y} q15 -20 0 -40 q-15 -20 0 -40" fill="none" stroke="#c98b4e" stroke-width="7" stroke-linecap="round" opacity="${.7 - i * .15}"/>`).join('')}
      ${pipAt(760, 340, 230)}${tap('pop', at(975, 480, .8, ITEMS.loaf))}`),
    () => page('#dff3ff', `${shopWall.replace('#fff8e6', '#e8f6ff')}
      ${tap('whoosh', at(420, 560, 1.35, SMA.fridge(true)))}${tap('whoosh', at(800, 560, 1.35, SMA.fridge(false)))}
      ${pipAt(940, 320, 230)}${say(960, 300, 'Brrr!', '#1e5bd6')}`),
    () => page('#fff8e6', `${shopWall}<g transform="translate(130 520)">${SMA.aisle(380, 1)}</g>
      ${tap('sparkle', at(620, 430, 2.2, ITEMS.lollipop))}<rect x="560" y="500" width="120" height="30" rx="6" fill="#ff6f9c" ${S}/>
      ${mum(300, 640, 1.15)}${pipAt(800, 340, 230)}${say(820, 320, '?', '#8e5bd6', 90)}`),
    () => page('#fff8e6', `${shopWall}<g transform="translate(20 520)">${SMA.aisle(300, 3)}</g>
      ${tap('ring', at(540, 640, 1.1, SMA.worker(true)))}${tap('beep', at(560, 640, 1.3, SMA.till(true)))}
      ${[['apple', 420], ['milk', 480], ['loaf', 545]].map(([id, x]) => at(x, 478, .45, ITEMS[id])).join('')}
      ${pipAt(820, 380, 200)}${tap('pop', at(1080, 570, .9, SMA.bag('fruit')))}`),
    () => page('#ffe9d6', `${kitchen}
      <rect x="720" y="300" width="460" height="200" fill="#fff" ${S}/><rect x="720" y="290" width="460" height="24" rx="6" fill="#8b5a2b" ${S}/>
      ${tap('whoosh', at(920, 470, 2, SMA.HOME.fridge))}${tap('pop', at(1080, 250, .9, SMA.HOME.breadbin))}${tap('pop', at(800, 250, .9, SMA.HOME.bowl))}
      ${mum(240, 620)}${pipAt(420, 340, 240)}${at(640, 490, .6, ITEMS.banana)}`)
  ];
  Story.mount(Object.assign({ screen: 'shopStory', colour: '#2e9e4f', cls: 'shop-story', lines: { end: 'supermarket.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(26 30) scale(.44)">${SMA.basket}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'supermarket.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Trolley Run: food rolls off the shelf into Mum's trolley (not into the cardboard box)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#2e9e4f" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-26 -46) scale(.24)">${ITEMS.orange}</g><g transform="translate(12 -12) scale(.24)">${ITEMS.orange}</g>
    <g transform="translate(14 58) scale(.42)">${SMA.trolley(['orange', 'apple'])}</g></svg>`;
  const shopTheme = {
    board(ctx) { // a shop floor of big pale tiles
      ctx.fillStyle = '#fbfaf4'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(46,158,79,.14)'; ctx.lineWidth = 3;
      for (let x = 100; x < W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 100; y < H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.fillStyle = '#c3cad6'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // a shelf with the food on it
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      const foods = level.food === 'mixed' ? SMA.ROUND_IDS.slice(0, 3) : [level.food, level.food, level.food];
      foods.forEach((f, i) => drawImg(ctx, SMA.foodImage(f), x - 26 + i * 26, 14, 28, 28));
      poly(ctx, [{ x: x - 48, y: 28 }, { x: x + 48, y: 28 }, { x: x + 48, y: 40 }, { x: x - 48, y: 40 }], '#9aa3b5');
      poly(ctx, [{ x: x - 16, y: 40 }, { x: x + 16, y: 40 }, { x: x + 12, y: 58 }, { x: x - 12, y: 58 }], '#2e9e4f');
      if (dripping) line(ctx, x - 10, 52, x + 10, 52, '#fff', 4);
    },
    ball(ctx, b, level) { drawImg(ctx, SMA.foodImage(BR.shopFood(level, b.idx)), b.position.x, b.position.y, 2 * R + 6, 2 * R + 6, b.angle); },
    goal(ctx, st) {
      const { level, fx, hits, won, now } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 6 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 8 : 0;
      const n = Math.min(3, hits), load = Array.from({ length: n }, (_, i) => BR.shopFood(level, level.food === 'mixed' ? i : 0));
      drawImg(ctx, SMA.trolleyImage(load), x, H - 99 + bob + jump, 220, 198);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 10 : 0);
      drawImg(ctx, SMA.boxImage(), x, H - 68, 180, 136);
    },
    splash: '#c3cad6',
    release() { Sfx.plop(); },
    hit(ev, fx, level) { Sfx.plink(1 + ev.n * .25); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ffd21f', 1.2); },
    win(fx) { fx.chew = 0; },
    tapGoal() { Sfx.roller(); },
    tapDecoy() { Sfx.boing(); },
    refuse: level => 'trolleyrun.no.' + (level.food === 'mixed' ? 'orange' : level.food),
    intro: level => 'trolleyrun.want.' + level.food,
    winLine: level => 'trolleyrun.fed.' + level.food
  };
  BR.mount(Object.assign({ screen: 'trolleyrun', lines: 'trolleyrun', colour: '#f07a1a', icon: RUN_ICON, pack: BR.packs.supermarket, theme: shopTheme, cls: 'shop-run' }, COMMON));

  // =====================================================================
  // Shop Train: food and shop words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (a short "ih" for unstressed "i" sounds).
  // alone / carrier: see the Rescue Station words in js/train.js.
  WordTrain.packs.supermarket = {
    id: 'supermarket',
    words: [
      { id: 'carrot',      word: 'carrot',      beats: ['car', 'rot'],              say: ['ka', 'rot'],                pic: 'carrot', alone: [0, 1], carrier: { 0: 'cat' } },
      { id: 'yoghurt',     word: 'yoghurt',     beats: ['yog', 'hurt'],             say: ['yog', 'urt'],               pic: 'yoghurt', alone: [1] },
      { id: 'apple',       word: 'apple',       beats: ['ap', 'ple'],               say: ['app', 'pull'],              pic: 'apple', alone: [0] },
      { id: 'butter',      word: 'butter',      beats: ['but', 'ter'],              say: ['but', 'tuh'],               pic: 'butter', alone: [0] },
      { id: 'trolley',     word: 'trolley',     beats: ['trol', 'ley'],             say: ['trol', 'lee'],              pic: 'trolley' },
      { id: 'biscuit',     word: 'biscuit',     beats: ['bis', 'cuit'],             say: ['biss', 'kit'],              pic: 'biscuit' },
      { id: 'banana',      word: 'banana',      beats: ['ba', 'na', 'na'],          say: ['buh', 'nah', 'nuh'],        pic: 'banana' },
      { id: 'tomato',      word: 'tomato',      beats: ['to', 'ma', 'to'],          say: ['tuh', 'mah', 'toe'],        pic: 'tomato' },
      { id: 'potato',      word: 'potato',      beats: ['po', 'ta', 'to'],          say: ['puh', 'tay', 'toe'],        pic: 'potato' },
      { id: 'broccoli',    word: 'broccoli',    beats: ['broc', 'co', 'li'],        say: ['brock', 'uh', 'lee'],       pic: 'broccoli' },
      { id: 'supermarket', word: 'supermarket', beats: ['su', 'per', 'mar', 'ket'], say: ['soo', 'purr', 'mar', 'kit'], pic: 'supermarket', alone: [1] },
      { id: 'avocado',     word: 'avocado',     beats: ['av', 'o', 'ca', 'do'],     say: ['av', 'uh', 'kah', 'doe'],   pic: 'avocado', alone: [0, 1, 2, 3] }
    ]
  };
  const trainPic = w => w.pic === 'trolley' ? SMA.svg(SMA.trolley(['apple', 'milk', 'banana']), '-100 -170 200 180')
    : w.pic === 'supermarket' ? SMA.svg(SMA.shopFront, '-90 -130 180 136') : SMA.itemSvg(w.pic);
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 64) scale(.5)">${ITEMS.banana}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'shoptrain', pack: WordTrain.packs.supermarket, colour: '#1e5bd6', tile: TRAIN_TILE, picture: trainPic, cls: 'shop-train',
    lines: { pick: 'shoptrain.pick', done: 'shoptrain.done' } }, COMMON));

  // =====================================================================
  // Pack the Bags: fruit, vegetables, cold things and bread into their bags (the sorting engine)
  // =====================================================================
  const BAG_ITEMS = {
    fruit: ['apple', 'banana', 'orange', 'pear', 'grapes', 'strawberry'],
    veg:   ['carrot', 'broccoli', 'potato', 'cucumber', 'onion'],
    cold:  ['milk', 'cheese', 'yoghurt', 'butter'],
    bread: ['loaf', 'rolls', 'croissant']
  };
  const PACK_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-22 10) scale(.5)">${SMA.bag('fruit')}</g><g transform="translate(24 14) scale(.5)">${SMA.bag('cold')}</g>
    <g transform="translate(0 -40) scale(.34)">${ITEMS.banana}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'packbags', colour: '#e53935', tile: PACK_TILE, cls: 'shop-bags',
    lines: { intro: 'packbags.intro', no: 'packbags.no', done: 'packbags.done' },
    round(level) {
      const bags = shuffle(Object.keys(BAG_ITEMS)).slice(0, 2 + level);
      return {
        bins: bags.map(b => ({ id: b, art: SMA.svg(SMA.bag(b), '-70 -84 140 150'), name: 'packbags.bin.' + b, cls: 'bag-' + b })),
        items: bags.flatMap(b => shuffle(BAG_ITEMS[b]).slice(0, 2).map(id => ({ id, art: SMA.itemSvg(id), bin: b, line: 'packbags.yes.' + id, name: 'shop.food.' + id })))
      };
    },
    onRight(binEl) { Sfx.pop(); const s = binEl.querySelector('.so-art svg'); s.classList.remove('gulp'); void s.getBoundingClientRect(); s.classList.add('gulp'); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Shopping List: find the things on Mum's picture list (and how many), then count them through the till
  // =====================================================================
  const LIST_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-14 0) rotate(-6) scale(.5)">${SMA.list(['apple', 'milk', 'loaf'], 2)}</g>
    <g transform="translate(34 54) scale(.3)">${SMA.trolley(['apple', 'milk'])}</g></svg>`;
  A.addGame('shoplist', '#00a6a6', LIST_TILE, COMMON);
  const SHELF = ['apple', 'banana', 'orange', 'pear', 'grapes', 'strawberry', 'carrot', 'broccoli', 'potato', 'cucumber', 'tomato',
    'milk', 'cheese', 'yoghurt', 'butter', 'loaf', 'croissant', 'cereal', 'pasta', 'tin', 'biscuit'];
  // How many of each thing on the list, per level: three things, then four with a pair, then four with bigger numbers.
  const COUNTS = [[1, 1, 1], [2, 1, 1, 1], [3, 2, 2, 1]];
  const dots = (need, got) => Array.from({ length: need }, (_, i) => `<i class="${i < got ? 'on' : ''}"></i>`).join('');
  A.screens.shoplist = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('shoplist'), ROUNDS = 2;
    scene().innerHTML = `<div class="shoplist"><div class="sl-paper"></div><div class="sl-shelves"></div><div class="sl-trolley"></div><div class="sl-belt" hidden></div></div>`;
    const root = scene().querySelector('.shoplist'), paper = root.querySelector('.sl-paper'), shelves = root.querySelector('.sl-shelves');
    const trolleyEl = root.querySelector('.sl-trolley'), belt = root.querySelector('.sl-belt');
    let ri = 0, busy = true, want = [], load = [];

    const drawTrolley = () => { trolleyEl.innerHTML = SMA.svg(SMA.trolley(load.slice(-8)), '-100 -170 200 180'); };
    const drawList = () => {
      paper.innerHTML = want.map(w => `<div class="sl-row${w.got >= w.need ? ' done' : ''}" data-id="${w.id}"><span class="sl-pic">${SMA.itemSvg(w.id)}</span>
        <span class="sl-dots">${dots(w.need, w.got)}</span><span class="sl-num">${w.need}</span></div>`).join('');
    };
    function serve() {
      const counts = shuffle(COUNTS[level]), ids = shuffle(SHELF);
      want = counts.map((need, i) => ({ id: ids[i], need, got: 0 }));
      const extra = ids.slice(counts.length, counts.length + (level === 0 ? 3 : 4));
      load = []; busy = true;
      root.classList.toggle('counting', level > 0);
      drawList(); drawTrolley(); belt.hidden = true; shelves.hidden = false;
      shelves.style.gridTemplateColumns = `repeat(${level === 0 ? 3 : 4}, minmax(0, 1fr))`;
      shelves.innerHTML = shuffle([...want.map(w => w.id), ...extra]).map((id, i) => `<button class="sl-item" data-id="${id}" style="animation-delay:${i * .05}s" aria-label="${SMA.NAMES[id]}">${SMA.itemSvg(id)}</button>`).join('');
      shelves.querySelectorAll('.sl-item').forEach(b => b.onclick = () => pick(b));
      (async () => {
        await A.say(ri === 0 ? 'list.intro' : 'list.next');
        if (!alive()) return;
        if (ri === 0 && level > 0) { await A.say('list.count'); if (!alive()) return; }
        busy = false; hint();
      })();
    }
    const hint = () => { const w = want.find(x => x.got < x.need); if (w) A.Hint.set([shelves.querySelector(`[data-id="${w.id}"]`)], 'list.go'); };

    async function pick(b) {
      if (busy) return;
      const id = b.dataset.id, w = want.find(x => x.id === id);
      A.Hint.clear();
      if (!w || w.got >= w.need) {
        Sfx.boing(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
        A.Pip.mood('thinking'); await A.say(w ? 'list.enough' : 'list.no');
        if (alive() && !busy) hint();
        return;
      }
      busy = true;
      // A copy of the thing flies from the shelf into the trolley.
      const from = b.getBoundingClientRect(), to = trolleyEl.getBoundingClientRect(), fly = document.createElement('div');
      fly.className = 'sl-fly'; fly.innerHTML = SMA.itemSvg(id);
      Object.assign(fly.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px' });
      document.body.appendChild(fly);
      Sfx.pop();
      await fly.animate([{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${to.left + to.width * .45 - from.left - from.width / 2}px, ${to.top + to.height * .3 - from.top - from.height / 2}px) scale(.45)`, opacity: .6 }],
        { duration: 500, easing: 'ease-in' }).finished.catch(() => {});
      fly.remove();
      if (!alive()) return;
      w.got++; load.push(id); drawTrolley(); drawList();
      Sfx.plink(1 + w.got * .2);
      if (w.got < w.need) await A.say('list.n' + w.got);
      else { Sfx.chime(); await A.say(w.need > 1 ? 'list.n' + w.got : 'list.tick'); }
      if (!alive()) return;
      if (want.some(x => x.got < x.need)) { busy = false; hint(); return; }
      await till();
    }
    // Every thing goes along the belt and beeps, and Pip counts them.
    async function till() {
      A.Pip.mood('cheer');
      await A.say('list.till');
      if (!alive()) return;
      shelves.hidden = true; belt.hidden = false;
      belt.innerHTML = `<div class="sl-till">${SMA.svg(SMA.till(false), '-140 -210 320 214')}</div><div class="sl-row-belt"></div>`;
      const row = belt.querySelector('.sl-row-belt'), tillEl = belt.querySelector('.sl-till');
      for (let i = 0; i < load.length; i++) {
        const span = document.createElement('span'); span.className = 'sl-beep'; span.innerHTML = SMA.itemSvg(load[i]) + `<b>${i + 1}</b>`;
        row.appendChild(span);
        tillEl.innerHTML = SMA.svg(SMA.till(true), '-140 -210 320 214');
        Sfx.beep();
        await A.say('list.n' + (i + 1));
        if (!alive()) return;
        tillEl.innerHTML = SMA.svg(SMA.till(false), '-140 -210 320 214');
      }
      load = []; drawTrolley();
      A.Pip.act('dance'); Sfx.chime();
      await A.say('list.paid');
      if (!alive()) return;
      ri++;
      if (ri < ROUNDS) { await A.wait(300); if (alive()) serve(); return; }
      await A.say('list.allDone');
      if (alive()) A.gameDone('shoplist');
    }
    serve();
  };

  // =====================================================================
  // The shop: visit six places, and pick a game
  // =====================================================================
  const tillSpot = (wave = false) => `<g transform="translate(-30 -8) scale(.8)">${SMA.worker(wave)}</g><g transform="scale(.62)">${SMA.till(wave)}</g>`;
  const PLACE = {
    trolley: { x: 200,  y: 660, s: 1.1, art: () => SMA.trolley(['apple', 'banana']), hit: [-105, -195, 210, 205] },
    fruit:   { x: 460,  y: 660, s: .78, art: () => SMA.fruitStand, hit: [-140, -220, 280, 230] },
    bakery:  { x: 750,  y: 650, s: .76, art: () => SMA.bakery, hit: [-105, -235, 210, 245] },
    fridge:  { x: 995,  y: 660, s: .76, art: () => SMA.fridge(false), hit: [-95, -260, 190, 270] },
    scales:  { x: 1190, y: 660, s: .85, art: () => SMA.scales, hit: [-70, -160, 140, 170] },
    till:    { x: 1360, y: 660, s: .95, art: () => tillSpot(false), hit: [-90, -230, 190, 240] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#2e9e4f' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(-2 18) scale(.3)">${SMA.trolley(['apple', 'banana', 'milk'])}</g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const shopGames = () => A.worldGames('supermarket');
  const badgeEarned = () => SPOT_IDS.every(id => P().supermarket.includes(id)) && shopGames().every(g => P().games.includes(g.id));

  function shopArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().supermarket.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="shop-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + hx + hw - 16} ${p.y + hy + 20})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx}" y="${p.y + hy}" width="${hw}" height="${hh}" fill="transparent"/>
      </g>`;
    }).join('');
    const bunting = Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 28 l50 0 l-25 44 Z" fill="${['#2e9e4f', '#fff', '#2e9e4f', '#ffd21f', '#e53935'][i % 5]}" ${S3}/>`).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The supermarket">
      ${Art.defs()}
      <rect width="1600" height="900" fill="#fff8e6"/>
      <g transform="translate(0 420)">${SMA.aisle(1600, 2)}</g>
      <path d="M0 660 H1600 V900 H0 Z" fill="#eef1f6"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 220 - 60} 660 L${i * 260 - 260} 900" stroke="#dde2ea" stroke-width="5"/>`).join('')}
      <path d="M0 760 H1600" stroke="#dde2ea" stroke-width="5"/><path d="M0 660 H1600" stroke="#9aa3b5" stroke-width="10"/>
      <path d="M-20 28 Q800 70 1620 28" fill="none" stroke="${OL}" stroke-width="4"/>${bunting}
      <g transform="translate(800 150)"><rect x="-150" y="-40" width="300" height="70" rx="14" fill="#2e9e4f" ${S}/>${SMA.txt(0, 10, 34, '#fff', 'SUPERMARKET')}</g>
      ${spots}
    </svg>`;
  }

  // A sticker for each place in the shop, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().supermarket.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${SMA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${SMA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${SMA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('supermarket.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('supermarket')) return;
    P().badges.push('supermarket'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Super Shopper badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Super Shopper badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('supermarket.badge');
  }

  let welcomed = false;
  A.screens.supermarket = (arg, alive) => {
    scene().innerHTML = `<div class="shop-home">${shopArt()}
      <div class="world-tiles">${shopGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.shop-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelectorAll('.shop-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      if (id === 'till') art.innerHTML = tillSpot(true);
      if (id === 'fridge') art.innerHTML = SMA.fridge(true);
      sound(id);
      await A.say('supermarket.fact.' + id);
      if (!alive()) return;
      if (id === 'till' || id === 'fridge') art.innerHTML = PLACE[id].art();
      if (!P().supermarket.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.supermarket('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.shop-spot')], 'supermarket.hint');
    if (!welcomed) { welcomed = true; A.say('supermarket.welcome'); } else A.say('supermarket.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The supermarket's page in the sticker book, and its badge ----------
  Rewards.pages.supermarket = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="sm" data-id="${id}" aria-label="${SMA.SPOTS[id].name}">${SMA.sticker(id, P().supermarket.includes(id))}<span>${P().supermarket.includes(id) ? SMA.SPOTS[id].name : '?'}</span></button>`).join('')
      + shopGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'sm') return false;
      if (P().supermarket.includes(id)) { Sfx.sparkle(); A.say('supermarket.name.' + id); }
      else { Sfx.boing(); A.say('supermarket.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'supermarket', name: 'Super Shopper', svg: BADGE, earned: () => P().badges.includes('supermarket') || badgeEarned(), how: 'supermarket.badge.how' });

  window.Supermarket = { SPOT_IDS, BADGE, badgeEarned };
})();
