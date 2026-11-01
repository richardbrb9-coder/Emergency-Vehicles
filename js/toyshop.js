// Pip at the Toy Shop: the toy shop world pack (Pip spends his birthday money). Words, pictures, levels and the shop
// home screen, plus one game of its own (Pay with Coins). The story, Coin Run, Toy Train and Just the Right Size come
// from the shared engines (Story, BallRun, WordTrain, Sorter).

// ---------- Coin Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Trolley Run puzzles (themselves the Gobble Run layouts) in a new order within each group, each checked
  // solvable again by running its physics with the hint pieces in place.
  // coin: the coin that rolls down (one kind per puzzle, in pence). decoy: a jack-in-the-box under the chute.
  const cn = (coin, p) => Object.assign({ balls: 6, coin }, p);
  BR.packs.shop = {
    id: 'shop',
    free: { hose: 1, goal: 11, balls: 8, coin: 'mixed' },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      cn(1,   { hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      cn(2,   { hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      cn(5,   { hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      cn(10,  { hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      // 5 to 8: two pieces
      cn(1,   { hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      cn(2,   { hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      cn(5,   { hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      cn(10,  { hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      // 9 to 12: a see-saw or a bucket
      cn(20,  { hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      cn(100, { hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      cn(20,  { hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] }),
      cn(100, { hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] })
    ]
  };
  // The coin each ball is: one kind per puzzle, every kind in turn in the free build.
  BR.shopCoin = (level, idx) => level.coin === 'mixed' ? [1, 2, 5, 10, 20, 100][idx % 6] : level.coin;
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const TA = window.ToyArt, ITEMS = TA.ITEMS;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().shop) P().shop = [];
  const shuffle = Sorter.shuffle;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // The six places to visit in the toy shop; visiting each one earns its sticker.
  const SPOT_IDS = ['purse', 'teddies', 'robot', 'bike', 'balloons', 'till'];
  const SOUND = { purse: 'plink', teddies: 'squeak', robot: 'beep', bike: 'ring', balloons: 'whoosh', till: 'chime' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);

  // ---------- Money words: "seven p", "two pounds" ----------
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty'];
  const numWord = n => n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  const moneyWord = p => p >= 100 ? `${numWord(p / 100)} pound${p > 100 ? 's' : ''}` : `${numWord(p)} p`;
  const coinWord = v => v === 100 ? 'pound' : `${numWord(v)} p`;
  // Every amount the games say out loud.
  const AMOUNTS = [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 60, 100, 200, 300];

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'toyshop.welcome': 'Welcome to the toy shop! Pip has birthday money to spend. Tap things in the shop to find out about them, or pick a game at the bottom.',
    'toyshop.back':    'What shall we do at the toy shop now?',
    'toyshop.hint':    'Tap something in the toy shop!',
    'toyshop.pip':     "Woof! It's my birthday! Tap the toys to explore.",
    'toyshop.fact.purse':    "This is Pip's purse, full of birthday money. Coins are worth different amounts. One 2p coin is worth the same as two 1p coins!",
    'toyshop.fact.teddies':  'Teddies! A little one, a middle-sized one and a great big one. Which one would you choose?',
    'toyshop.fact.robot':    'Beep boop! This robot flashes its lights. Look at the price tag! It costs a lot of money, so we could save up for it.',
    'toyshop.fact.bike':     'A shiny red bicycle, with a bell. Ring ring! Always wear a helmet when you ride a bike.',
    'toyshop.fact.balloons': 'Balloons for birthday parties! Hold the string tight, or your balloon will float away.',
    'toyshop.fact.till':     "Hello! I'm Sam. At the till, you give me the money, and the toy is yours to take home. Thank you!",
    'toyshop.badge':     'You earned the Coin Counter badge! You are brilliant with money!',
    'toyshop.badge.how': 'Visit everything in the toy shop and play every toy shop game to earn the Coin Counter badge.',
    'book.world.shop':   'Your toy shop stickers! Explore the shop and play the games to fill this page.',

    'games.toyStory':  'Birthday Money',
    'games.coinrun':   'Coin Run',
    'games.toytrain':  'Toy Train',
    'games.paycoins':  'Pay with Coins',
    'games.rightsize': 'Just the Right Size',

    // The story
    'toyshop.story.1': "It's Pip's birthday! There are cards, balloons and a cake with candles. Inside Grandma's card is a surprise: birthday money!",
    'toyshop.story.2': 'Pip and Mum count the coins. Clink, clink, clink! They put them in Pip\'s purse. Pip can spend some at the toy shop.',
    'toyshop.story.3': 'Off to the toy shop! The window is full of toys, and Pip\'s tail wags and wags.',
    'toyshop.story.4': 'Inside, there are toys everywhere: teddies and robots, kites and balls, and a shiny red bicycle. Wow!',
    'toyshop.story.5': 'Pip loves the big robot. But look at the price tag! It costs much more money than Pip has. Maybe he can save up for it.',
    'toyshop.story.6': 'So many toys! Choosing is tricky. A ball? A kite? A soft teddy with a bow? Pip thinks hard, and picks the teddy.',
    'toyshop.story.7': "At the till, Sam says: That's ten p, please! Pip gives Sam two 5p coins. Five and five make ten. Just right!",
    'toyshop.story.8': 'At home, Teddy joins the party. Pip puts the money that is left in his piggy bank, to save for next time. Happy birthday, Pip!',
    'toyshop.story.end': 'The end! Thank you for reading with me.',

    // Coin Run (ball run)
    'coinrun.pick':    'Coin Run! Build your own, or try one of my puzzles.',
    'coinrun.free':    'Drag pieces onto the board. Then blow my whistle to roll the coins down!',
    'coinrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'coinrun.go':      'Here come the coins!',
    'coinrun.flip':    'Tap a piece to turn it around.',
    'coinrun.n1':      'One!',
    'coinrun.n2':      'Two!',
    'coinrun.n3':      'Three!',
    'coinrun.again':   'Oops! The coins missed the piggy bank. Move the pieces and try again.',
    'coinrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'coinrun.allDone': 'You solved all my puzzles! My piggy bank is full of money!',
    'coinrun.freeOut': 'Clink, clink, clink! What else can you build?',
    'coinrun.bolted':  'That piece is bolted on. Build around it!',
    'coinrun.cleared': "All clear! Let's build something new.",
    'coinrun.no':      'Boing! That was the jack-in-the-box. Roll the coins into the piggy bank.',
    'coinrun.p.ramp':   'A ramp! The coins roll down a slope.',
    'coinrun.p.long':   'A long ramp. The coins roll a long way down it.',
    'coinrun.p.curve':  'A curve. It turns falling coins to the side.',
    'coinrun.p.funnel': 'A funnel. It catches the coins and drops them through the middle.',
    'coinrun.p.spring': 'A spring! Boing! It bounces the coins up into the air.',
    'coinrun.p.fan':    'A fan. Whoosh! It blows the coins sideways.',
    'coinrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'coinrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Toy Train
    'toytrain.pick': 'All aboard the Toy Train! Toy words are made of beats too. Pick a game.',
    'toytrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!',

    // Pay with Coins
    'pay.intro':   'Pip wants to buy a toy with his birthday money. Look at the price, then tap the coins in the purse to pay.',
    'pay.big':     'Look! Some coins are worth more. A 5p coin is worth the same as five 1p coins, and a 10p coin is worth ten!',
    'pay.go':      'Tap a coin in the purse to put it on the counter.',
    'pay.over':    "Oops, that's too much! Tap a coin on the counter to take it back.",
    'pay.right':   "That's just right! Thank you, says Sam. The toy is yours!",
    'pay.next':    "What's next on the shelf?",
    'pay.allDone': 'Brilliant paying! You are great at counting money!',

    // Just the Right Size
    'size.intro': 'The teddies are cold! Drag each hat, scarf, jumper and pair of boots to the teddy it fits.',
    'size.no':    'Hmm, is that the right size? Look how big it is, and how big the teddy is.',
    'size.done':  'Every teddy is warm and cosy, and everything fits. Just right!',
    'size.bin.small':  'The little teddy.',
    'size.bin.middle': 'The middle-sized teddy.',
    'size.bin.big':    'The big teddy.'
  });
  AMOUNTS.forEach(p => { L['money.' + p] = cap(moneyWord(p)) + '!'; });
  for (let p = 2; p <= 15; p++) L['pay.cost.' + p] = `It costs ${moneyWord(p)}.`;
  const PAY_TOYS = ['teddy', 'ball', 'yoyo', 'kite', 'car', 'drum', 'rocket', 'dinosaur', 'puzzle', 'balloon'];
  PAY_TOYS.forEach(id => { L['pay.toy.' + id] = `Pip would like ${TA.NAMES[id]}.`; });
  TA.COIN_VALUES.forEach(v => {
    const many = v === 100 ? 'three pound coins' : `three ${coinWord(v)} coins`;
    L['coinrun.want.' + v] = `Roll ${many} into the piggy bank!`;
    L['coinrun.fed.' + v] = `${cap(moneyWord(v * 3))} in the piggy bank! Well done!`;
  });
  const ADJ = { small: 'little', middle: 'middle-sized', big: 'big' };
  const CLOTH_NAME = { hat: 'hat', boots: 'boots', scarf: 'scarf', jumper: 'jumper' };
  Object.keys(TA.CLOTHES).forEach(c => Object.keys(ADJ).forEach(s => {
    const plural = c === 'boots';
    L[`size.yes.${c}.${s}`] = `The ${ADJ[s]} ${CLOTH_NAME[c]} ${plural ? 'fit' : 'fits'} the ${ADJ[s]} teddy!`;
    L[`size.name.${c}.${s}`] = plural ? `${cap(ADJ[s])} boots.` : `A ${ADJ[s]} ${CLOTH_NAME[c]}.`;
  }));
  SPOT_IDS.forEach(id => {
    const n = TA.SPOTS[id].name;
    L['toyshop.sticker.' + id] = `You earned the ${id === 'till' ? n : n.toLowerCase()} sticker!`;
    L['toyshop.name.' + id] = n + '!';
    L['toyshop.find.' + id] = id === 'till' ? 'Tap Sam at the till to find this sticker.' : id === 'purse' ? "Tap Pip's purse in the shop to find this sticker." : `Tap the ${n.toLowerCase()} in the shop to find this sticker.`;
  });

  // Pip wears his birthday party hat on every toy shop screen.
  ['toyshop', 'toyStory', 'coinrun', 'toytrain', 'paycoins', 'rightsize'].forEach(s => { A.screenWorld[s] = 'shop'; });
  const COMMON = { world: 'shop', back: 'toyshop' };

  // =====================================================================
  // Birthday Money: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const pipAt = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 200 200" overflow="visible">${Art.pip('shop').replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const boards = (y = 520, c1 = '#e8b77a', c2 = '#c98b4e') => `<path d="M0 ${y} H1200 V660 H0 Z" fill="${c1}"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 200} ${y} V660" stroke="${c2}" stroke-width="4"/>`).join('')}
    <path d="M0 ${y} H1200" stroke="#8b5a2b" stroke-width="10"/>`;
  const shopWall = `<rect width="1200" height="520" rx="30" fill="#ffe9f2"/>${boards()}`;
  const home = `<rect width="1200" height="500" rx="30" fill="#fff1d6"/><path d="M0 500 H1200 V660 H0 Z" fill="#c98b4e"/>
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 200} 500 V660" stroke="#a5672e" stroke-width="4"/>`).join('')}<path d="M0 500 H1200" stroke="#8b5a2b" stroke-width="10"/>`;
  const mum = (x, y, s = 1.1) => tap('woof', at(x, y, s, TA.pipMum()));
  const table = (x, y, w = 400) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-12" width="${w}" height="24" rx="8" fill="#e8a54b" ${S}/><path d="M${-w / 2 + 30} 12 V120 M${w / 2 - 30} 12 V120" stroke="${OL}" stroke-width="14"/><path d="M${-w / 2 + 30} 12 V120 M${w / 2 - 30} 12 V120" stroke="#c98b4e" stroke-width="8"/></g>`;
  const say = (x, y, t, c = '#e53935', size = 64) => `<text x="${x}" y="${y}" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const coinsAt = (list, x, y, s = .5, dx = 46) => list.map((v, i) => tap('plink', at(x + i * dx, y, s, TA.coin(v)))).join('');
  const PAGES = [
    () => page('#fff1d6', `${home}${at(150, 40, 1, TA.banner(900))}
      ${tap('whoosh', at(150, 330, .9, TA.balloon('#e53935')))}${tap('whoosh', at(1060, 300, .9, TA.balloon('#1e5bd6')))}
      ${table(600, 470)}${tap('sparkle', at(560, 456, 1.1, TA.cake))}${tap('pop', at(780, 400, .8, TA.card('#2e9e4f')))}
      ${coinsAt([10, 5, 2], 740, 448, .4, 36)}${pipAt(860, 300, 230)}`),
    () => page('#fff1d6', `${home}${table(560, 470, 560)}
      ${tap('plink', at(420, 400, 1, TA.pig()))}${coinsAt([1, 2, 5, 10, 1, 2], 520, 446, .45, 44)}${tap('pop', at(860, 424, .8, TA.purse(false)))}
      ${mum(200, 640)}${pipAt(880, 300, 210)}${say(740, 300, 'Clink!', '#d9883e', 56)}`),
    () => page('#bfe6ff', `${Art.cloud(80, 60, .8)}${Art.cloud(880, 40, .7)}<path d="M0 520 H1200 V660 H0 Z" fill="#c3cad6"/><path d="M0 520 H1200" stroke="#9aa3b5" stroke-width="8"/>
      ${at(600, 530, 1.5, TA.shopFront)}${mum(250, 640, 1.1)}${pipAt(820, 380, 230)}`),
    () => page('#ffe9f2', `${shopWall}<g transform="translate(40 520)">${TA.shelves(560, 0)}</g><g transform="translate(620 520)">${TA.shelves(540, 4)}</g>
      ${tap('ring', at(300, 660, 1.4, TA.bigBike))}${pipAt(800, 410, 230)}${say(780, 150, 'Wow!', '#ff6f9c', 90)}`),
    () => page('#ffe9f2', `${shopWall}<g transform="translate(40 520)">${TA.shelves(1120, 2)}</g>
      ${tap('beep', at(460, 640, 1.25, TA.bigRobot(true)))}${pipAt(780, 360, 220)}${tap('pop', at(1000, 470, .9, TA.purse(true)))}${say(800, 340, '?', '#8e5bd6', 90)}`),
    () => page('#ffe9f2', `${shopWall}
      ${[['ball', 220, 300], ['kite', 420, 260], ['teddy', 640, 290]].map(([id, x, y]) => tap(id === 'teddy' ? 'squeak' : 'pop', at(x, y, 1.6, ITEMS[id]))).join('')}
      <g transform="translate(140 520)"><rect x="0" y="-130" width="620" height="130" fill="#ff8fb1" ${S}/><rect x="-10" y="-144" width="640" height="20" rx="6" fill="#c98b4e" ${S}/></g>
      ${pipAt(860, 320, 240)}${say(900, 300, '?', '#8e5bd6', 90)}`),
    () => page('#ffe9f2', `${shopWall}<g transform="translate(40 520)">${TA.shelves(380, 1)}</g>
      ${tap('ring', at(560, 600, 1.05, TA.sam(true)))}${tap('beep', at(600, 640, 1.2, TA.counter(true)))}
      ${at(450, 440, .8, TA.teddy())}${coinsAt([5, 5], 525, 474, .5, 46)}${pipAt(860, 330, 230)}`),
    () => page('#fff1d6', `${home}${at(150, 40, 1, TA.banner(900))}${table(640, 470, 520)}
      ${tap('squeak', at(560, 400, 1.2, ITEMS.teddy))}${tap('plink', at(820, 420, .9, TA.pig()))}${tap('whoosh', at(130, 330, .9, TA.balloon('#ffd21f')))}
      ${tap('sparkle', at(380, 456, .8, TA.cake))}${mum(1050, 640, 1.05)}${pipAt(150, 360, 230)}`)
  ];
  Story.mount(Object.assign({ screen: 'toyStory', colour: '#ff6f9c', cls: 'toy-story', lines: { end: 'toyshop.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(28 30) scale(.4)">${TA.purse(true)}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'toyshop.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Coin Run: coins roll out of Pip's purse into his piggy bank (not into the jack-in-the-box)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R, NEED } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#ff6f9c" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-26 -46) scale(.3)">${TA.coin(10)}</g><g transform="translate(12 -14) scale(.3)">${TA.coin(2)}</g>
    <g transform="translate(6 34) scale(.56)">${TA.pig()}</g></svg>`;
  let banked = [];
  const coinTheme = {
    board(ctx) { // toy shop wallpaper: soft pink stripes and dots
      ctx.fillStyle = '#fff4f8'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,111,156,.08)';
      for (let x = 0; x < W; x += 100) ctx.fillRect(x, 0, 50, H);
      ctx.fillStyle = 'rgba(255,210,31,.25)';
      for (let y = 50; y < H; y += 100) for (let x = 25; x < W; x += 100) { ctx.beginPath(); ctx.arc(x + (y % 200 ? 50 : 0), y, 5, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#c98b4e'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // Pip's purse, tipping coins out
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      const coins = level.coin === 'mixed' ? [10, 2, 100] : [level.coin, level.coin, level.coin];
      coins.forEach((v, i) => drawImg(ctx, TA.coinImage(v), x - 24 + i * 24, 12, 26, 26));
      poly(ctx, [{ x: x - 40, y: 22 }, { x: x + 40, y: 22 }, { x: x + 34, y: 46 }, { x: x - 34, y: 46 }], '#ff6f9c');
      poly(ctx, [{ x: x - 14, y: 46 }, { x: x + 14, y: 46 }, { x: x + 10, y: 60 }, { x: x - 10, y: 60 }], '#ffd21f');
      if (dripping) line(ctx, x - 9, 54, x + 9, 54, '#fff', 4);
    },
    ball(ctx, b, level) { drawImg(ctx, TA.coinImage(BR.shopCoin(level, b.idx)), b.position.x, b.position.y, 2 * R + 6, 2 * R + 6, b.angle); },
    goal(ctx, st) {
      const { level, fx, won, now } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 6 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 10 : 0;
      drawImg(ctx, TA.pigImage(won), x, H - 64 + bob + jump, 210, 179);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 8 : 0);
      drawImg(ctx, TA.jackImage(fx.shake > 0), x, H - 86, 140, 172);
    },
    splash: '#ffd21f',
    release() { Sfx.plink(1.6); },
    hit(ev, fx, level) { Sfx.plink(1 + ev.n * .25); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ffd21f', 1.2); banked.push(BR.shopCoin(level, ev.idx)); },
    hitLine: (ev, level) => level.coin === 'mixed' ? 'coinrun.n' + ev.n : 'money.' + level.coin * ev.n,
    win(fx) { fx.chew = 0; },
    tapGoal() { Sfx.squeak(); },
    tapDecoy() { Sfx.sproing(); },
    refuse: () => 'coinrun.no',
    intro: level => { banked = []; return 'coinrun.want.' + level.coin; },
    winLine: level => 'coinrun.fed.' + level.coin,
    freeLine: () => { const sum = banked.slice(-NEED).reduce((a, b) => a + b, 0); banked = []; return AMOUNTS.includes(sum) ? 'money.' + sum : 'coinrun.freeOut'; }
  };
  BR.mount(Object.assign({ screen: 'coinrun', lines: 'coinrun', colour: '#f2a900', icon: RUN_ICON, pack: BR.packs.shop, theme: coinTheme, cls: 'toy-run' }, COMMON));

  // =====================================================================
  // Toy Train: toy words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (short "ih" sounds; "row" for ro, "cull" for cle).
  // alone / carrier: see the Rescue Station words in js/train.js.
  WordTrain.packs.shop = {
    id: 'shop',
    words: [
      { id: 'teddy',        word: 'teddy',           beats: ['ted', 'dy'],               say: ['ted', 'dee'],                pic: 'teddy' },
      { id: 'robot',        word: 'robot',           beats: ['ro', 'bot'],               say: ['row', 'bot'],                pic: 'robot' },
      { id: 'puzzle',       word: 'puzzle',          beats: ['puz', 'zle'],              say: ['puzz', 'zull'],              pic: 'puzzle' },
      { id: 'rocket',       word: 'rocket',          beats: ['rock', 'et'],              say: ['rock', 'kit'],               pic: 'rocket' },
      { id: 'balloon',      word: 'balloon',         beats: ['bal', 'loon'],             say: ['buh', 'loon'],               pic: 'balloon' },
      { id: 'money',        word: 'money',           beats: ['mon', 'ey'],               say: ['mun', 'nee'],                pic: 'money' },
      { id: 'bicycle',      word: 'bicycle',         beats: ['bi', 'cy', 'cle'],         say: ['bye', 'sick', 'cull'],       pic: 'bicycle' },
      { id: 'dinosaur',     word: 'dinosaur',        beats: ['di', 'no', 'saur'],        say: ['die', 'nuh', 'sore'],        pic: 'dinosaur' },
      { id: 'aeroplane',    word: 'aeroplane',       beats: ['aer', 'o', 'plane'],       say: ['air', 'uh', 'plane'],       pic: 'aeroplane' },
      { id: 'piggybank',    word: 'piggy bank',      beats: ['pig', 'gy', 'bank'],       say: ['pig', 'ghee', 'bank'],       pic: 'piggybank' },
      { id: 'jackinthebox', word: 'jack-in-the-box', beats: ['jack', 'in', 'the', 'box'], say: ['jack', 'in', 'thuh', 'box'], pic: 'jack', alone: [1, 3] },
      { id: 'ballerina',    word: 'ballerina',       beats: ['bal', 'le', 'ri', 'na'],   say: ['bal', 'luh', 'ree', 'nuh'],  pic: 'ballerina' }
    ]
  };
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 64) scale(.5)">${ITEMS.teddy}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'toytrain', pack: WordTrain.packs.shop, colour: '#1e5bd6', tile: TRAIN_TILE, picture: w => TA.itemSvg(w.pic), cls: 'toy-train',
    lines: { pick: 'toytrain.pick', done: 'toytrain.done' } }, COMMON));

  // =====================================================================
  // Just the Right Size: hats, scarves, jumpers and boots onto the teddy they fit (the sorting engine)
  // =====================================================================
  const SIZE_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-26 50) scale(.55)">${TA.sizeTeddy('small')}</g><g transform="translate(20 54) scale(.62)">${TA.sizeTeddy('big')}</g>
    <g transform="translate(-26 -30) scale(.3)">${TA.CLOTHES.hat}</g><g transform="translate(20 -44) scale(.42)">${TA.CLOTHES.hat}</g></svg>`;
  Sorter.mount(Object.assign({
    screen: 'rightsize', colour: '#8e5bd6', tile: SIZE_TILE, cls: 'toy-size',
    lines: { intro: 'size.intro', no: 'size.no', done: 'size.done' },
    round(level) {
      const sizes = level === 0 ? ['small', 'big'] : ['small', 'middle', 'big'];
      const clothes = shuffle(Object.keys(TA.CLOTHES)).slice(0, level === 2 ? 3 : 2);
      return {
        bins: sizes.map(s => ({ id: s, art: TA.svg(TA.sizeTeddy(s), '-78 -134 156 142'), name: 'size.bin.' + s, cls: 'size-' + s })),
        items: sizes.flatMap(s => clothes.map(c => ({ id: c + '-' + s, bin: s, line: `size.yes.${c}.${s}`, name: `size.name.${c}.${s}`,
          art: TA.svg(`<g transform="scale(${TA.SIZES[s]})">${TA.CLOTHES[c]}</g>`, '-60 -60 120 120') })))
      };
    },
    onRight(binEl) { Sfx.pop(); const s = binEl.querySelector('.so-art svg'); s.classList.remove('gulp'); void s.getBoundingClientRect(); s.classList.add('gulp'); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Pay with Coins: tap coins from Pip's purse onto the counter to pay the price on the tag
  // =====================================================================
  const PAY_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-6 18) scale(.6)">${TA.purse(true)}</g><g transform="translate(26 -34) scale(.5)">${TA.tag('5p', '#fff6cc')}</g></svg>`;
  A.addGame('paycoins', '#00a6a6', PAY_TILE, COMMON);
  // Per level: the coins in the purse, and the prices to pay (every price can be made from the purse).
  const PURSE = [[1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 1, 1, 1, 1], [10, 5, 5, 2, 2, 1, 1]];
  const PRICES = [[2, 3, 4, 5], [3, 4, 5, 6, 7, 8], [6, 7, 8, 9, 11, 12, 13, 14, 15]];
  const pennyDots = n => `<span class="pc-dots">${Array.from({ length: n }, () => '<i></i>').join('')}</span>`;
  A.screens.paycoins = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('paycoins'), ROUNDS = 3;
    scene().innerHTML = `<div class="paycoins">
      <div class="pc-toy"></div>
      <div class="pc-counter"><div class="pc-paid"></div><div class="pc-total"></div></div>
      <div class="pc-sam">${TA.svg(TA.sam(false), '-80 -240 160 244')}</div>
      <div class="pc-purse"></div></div>`;
    const root = scene().querySelector('.paycoins'), toyEl = root.querySelector('.pc-toy'), paidEl = root.querySelector('.pc-paid');
    const totalEl = root.querySelector('.pc-total'), purseEl = root.querySelector('.pc-purse'), samEl = root.querySelector('.pc-sam');
    let ri = 0, busy = true, price = 0, toys = shuffle(PAY_TOYS), prices = shuffle(PRICES[level]);
    const coinBtn = (v, i) => `<button class="pc-coin c${v}" data-v="${v}" data-i="${i}" style="--r:${TA.COIN[v].r}" aria-label="${TA.COIN_NAMES[v]}">${TA.coinSvg(v)}</button>`;
    const paid = () => [...paidEl.querySelectorAll('.pc-coin')].reduce((a, b) => a + +b.dataset.v, 0);
    const showTotal = () => { const t = paid(); totalEl.textContent = t ? t + 'p' : ''; totalEl.classList.toggle('over', t > price); };

    function serve() {
      const toy = toys[ri % toys.length];
      price = prices[ri % prices.length];
      toyEl.innerHTML = `<div class="pc-pic">${TA.itemSvg(toy)}</div><div class="pc-tag"><b>${price}p</b>${pennyDots(price)}</div>`;
      paidEl.innerHTML = ''; showTotal();
      purseEl.innerHTML = PURSE[level].map(coinBtn).join('');
      purseEl.querySelectorAll('.pc-coin').forEach(b => b.onclick = () => move(b));
      busy = true;
      (async () => {
        if (ri === 0) { await A.say('pay.intro'); if (!alive()) return; }
        if (ri === 0 && level === 2) { await A.say('pay.big'); if (!alive()) return; }
        await A.say('pay.toy.' + toy); if (!alive()) return;
        await A.say('pay.cost.' + price); if (!alive()) return;
        busy = false; hint();
      })();
    }
    // Glow the coin that gets closest to the price without going over, or a coin to take back when too much is paid.
    const hint = () => {
      const left = price - paid();
      if (left < 0) { A.Hint.set([paidEl.querySelector('.pc-coin')], 'pay.over'); return; }
      const best = [...purseEl.querySelectorAll('.pc-coin')].filter(b => +b.dataset.v <= left).sort((a, b) => b.dataset.v - a.dataset.v)[0];
      A.Hint.set([best], 'pay.go');
    };
    // A coin slides from the purse to the counter, or back again.
    async function move(b) {
      if (busy) return;
      A.Hint.clear();
      const toCounter = b.parentElement === purseEl, from = b.getBoundingClientRect();
      (toCounter ? paidEl : purseEl).appendChild(b);
      const to = b.getBoundingClientRect();
      b.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }], { duration: 320, easing: 'ease-out' });
      Sfx.plink(toCounter ? 1.3 : .9);
      showTotal();
      const t = paid();
      if (t === price) {
        busy = true;
        await A.say('money.' + t); if (!alive()) return;
        await right();
        return;
      }
      if (t > price) { A.Pip.mood('thinking'); await A.say('money.' + t); if (!alive()) return; await A.say('pay.over'); }
      else if (t) A.say('money.' + t);
      if (alive()) hint();
    }
    async function right() {
      Sfx.chime(); A.Pip.mood('cheer');
      samEl.innerHTML = TA.svg(TA.sam(true), '-80 -240 160 244');
      toyEl.querySelector('.pc-pic').classList.add('bought');
      await A.say('pay.right'); if (!alive()) return;
      samEl.innerHTML = TA.svg(TA.sam(false), '-80 -240 160 244');
      ri++;
      if (ri < ROUNDS) { await A.say('pay.next'); if (alive()) serve(); return; }
      A.Pip.act('dance'); A.confetti();
      await A.say('pay.allDone');
      if (alive()) A.gameDone('paycoins');
    }
    serve();
  };

  // =====================================================================
  // The toy shop: visit six places, and pick a game
  // =====================================================================
  const tillSpot = (wave = false) => `<g transform="translate(-40 -70) scale(.9)">${TA.sam(wave)}</g><g transform="scale(.8)">${TA.counter(wave)}</g>`;
  const PLACE = { // all inside x 200 to 1400, so 4:3 screens show every place
    purse:    { x: 290,  y: 680, s: .95, art: () => TA.purseStool, hit: [-70, -195, 140, 205] },
    teddies:  { x: 485,  y: 680, s: .74, art: () => TA.teddyStand, hit: [-115, -140, 230, 150] },
    robot:    { x: 715,  y: 680, s: .74, art: () => TA.bigRobot(false), hit: [-72, -230, 200, 240] },
    bike:     { x: 965,  y: 680, s: .78, art: () => TA.bigBike, hit: [-95, -145, 190, 155] },
    balloons: { x: 1125, y: 680, s: .64, art: () => TA.balloons(), hit: [-65, -220, 130, 230] },
    till:     { x: 1300, y: 680, s: .7,  art: () => tillSpot(false), hit: [-105, -200, 205, 210] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#ff6f9c' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(-2 2) scale(.46)">${TA.pig()}</g><g opacity="${on ? 1 : 0.3}" transform="translate(-4 -30) scale(.24)">${TA.coin(100)}</g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const toyGames = () => A.worldGames('shop');
  const badgeEarned = () => SPOT_IDS.every(id => P().shop.includes(id)) && toyGames().every(g => P().games.includes(g.id));

  function shopArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().shop.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="toy-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + hx + hw - 16} ${p.y + hy + 20})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx}" y="${p.y + hy}" width="${hw}" height="${hh}" fill="transparent"/>
      </g>`;
    }).join('');
    const bunting = Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 28 l50 0 l-25 44 Z" fill="${['#ff6f9c', '#ffd21f', '#1e5bd6', '#2e9e4f', '#e53935'][i % 5]}" ${S3}/>`).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The toy shop">
      ${Art.defs()}
      <rect width="1600" height="900" fill="#ffe9f2"/>
      ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 100}" y="0" width="50" height="680" fill="#ff6f9c" opacity=".07"/>`).join('')}
      <g transform="translate(60 440)">${TA.shelves(600, 0)}</g><g transform="translate(940 440)">${TA.shelves(600, 5)}</g>
      <path d="M0 680 H1600 V900 H0 Z" fill="#e8b77a"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 200} 680 V900" stroke="#c98b4e" stroke-width="5"/>`).join('')}
      <path d="M0 680 H1600" stroke="#8b5a2b" stroke-width="10"/>
      <path d="M-20 28 Q800 70 1620 28" fill="none" stroke="${OL}" stroke-width="4"/>${bunting}
      <g transform="translate(800 160)"><rect x="-140" y="-40" width="280" height="70" rx="14" fill="#ff6f9c" ${S}/>${TA.txt(0, 10, 36, '#fff', 'TOY SHOP')}</g>
      ${spots}
    </svg>`;
  }

  // A sticker for each place in the toy shop, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().shop.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${TA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${TA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${TA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('toyshop.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('shop')) return;
    P().badges.push('shop'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Coin Counter badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Coin Counter badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('toyshop.badge');
  }

  // What changes while a place is talking: the robot lights up, Sam waves, the balloons bob up.
  const LIVE = { robot: () => TA.bigRobot(true), till: () => tillSpot(true), balloons: () => TA.balloons(16) };
  let welcomed = false;
  A.screens.toyshop = (arg, alive) => {
    scene().innerHTML = `<div class="toy-home">${shopArt()}
      <div class="world-tiles">${toyGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.toy-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelectorAll('.toy-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      if (LIVE[id]) art.innerHTML = LIVE[id]();
      sound(id);
      await A.say('toyshop.fact.' + id);
      if (!alive()) return;
      if (LIVE[id]) art.innerHTML = PLACE[id].art();
      if (!P().shop.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.toyshop('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.toy-spot')], 'toyshop.hint');
    if (!welcomed) { welcomed = true; A.say('toyshop.welcome'); } else A.say('toyshop.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The toy shop's page in the sticker book, and its badge ----------
  Rewards.pages.shop = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="ts" data-id="${id}" aria-label="${TA.SPOTS[id].name}">${TA.sticker(id, P().shop.includes(id))}<span>${P().shop.includes(id) ? TA.SPOTS[id].name : '?'}</span></button>`).join('')
      + toyGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'ts') return false;
      if (P().shop.includes(id)) { Sfx.sparkle(); A.say('toyshop.name.' + id); }
      else { Sfx.boing(); A.say('toyshop.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'shop', name: 'Coin Counter', svg: BADGE, earned: () => P().badges.includes('shop') || badgeEarned(), how: 'toyshop.badge.how' });

  window.ToyShop = { SPOT_IDS, BADGE, badgeEarned };
})();
