// Pip's Days Out: the Seaside. Pip's whole family (Mum, Grandad and the five puppies) go on holiday to the beach.
// Words, pictures, levels and the beach home screen, plus one game of its own (Sink or Float?). The story, Shell Run,
// Seaside Train and Pack for the Beach come from the shared engines (Story, BallRun, WordTrain, Sorter).

// ---------- Shell Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Ticket Run puzzles in a new order within each group, each checked solvable again by running its physics with
  // the hint pieces in place. decoy: the rock pool.
  const b = p => Object.assign({ balls: 6 }, p);
  BR.packs.seaside = {
    id: 'seaside',
    free: { hose: 1, goal: 11, balls: 8 },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      b({ hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      b({ hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      b({ hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      // 5 to 8: two pieces
      b({ hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      b({ hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      b({ hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      b({ hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
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
  const SA = window.SeaArt, BA = window.BusArt, PA = window.PupArt;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().seaside) P().seaside = [];
  const shuffle = Sorter.shuffle;
  // The six things to visit on the beach; visiting each one earns its sticker.
  const SPOT_IDS = ['hut', 'tower', 'pool', 'castle', 'van', 'lighthouse'];
  const SOUND = { hut: 'pop', tower: 'whistle', pool: 'plop', castle: 'sparkle', van: 'tune', lighthouse: 'foghorn' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'sea.welcome': "Welcome to the seaside! Pip's whole family are on holiday at the beach. Tap things to find out about them, or pick a game at the bottom.",
    'sea.back':    'What shall we do at the beach now?',
    'sea.hint':    'Tap something on the beach!',
    'sea.gull':    'Squawk! That cheeky seagull wants our chips. Keep your food safe at the seaside!',
    'sea.fact.hut':        'This is our beach hut. It is like a tiny house by the sea, for our towels, buckets and spades.',
    'sea.fact.tower':      'This is Kai the lifeguard! Kai watches the sea to keep everyone safe. Swim between the red and yellow flags, where Kai can see you.',
    'sea.fact.pool':       'A rock pool! When the sea goes out, little pools are left in the rocks. Look, a crab, a starfish and a shrimp! Look carefully, and leave them in their home.',
    'sea.fact.castle':     'A sandcastle! Fill your bucket with wet sand, pat it down, and turn it over. Ta-da!',
    'sea.fact.van':        'The ice cream van plays a tune when it comes. Which flavour would you like?',
    'sea.fact.lighthouse': 'The lighthouse shines a bright light at night. It shows the ships where the rocks are, so they stay safe.',
    'sea.badge':     'You earned the Seaside Star badge! What a sunny holiday!',
    'sea.badge.how': 'Visit everything on the beach, and play every seaside game, to earn the Seaside Star badge.',
    'book.world.seaside': 'Your seaside stickers! Explore the beach, and play the games to fill this page.',

    'games.seaStory':  'Sunny Holiday',
    'games.shellrun':  'Shell Run',
    'games.seatrain':  'Seaside Train',
    'games.sinkfloat': 'Sink or Float?',
    'games.beachbag':  'Pack for the Beach',

    // The story
    'sea.story.1': "Pip's whole family are going on holiday to the seaside! Mum packs the big suitcase. The puppies help. Sun hat, suncream and swimsuit!",
    'sea.story.2': 'Here they are at the beach! Sand, sea and sunshine. Grandad puts up his deckchair, and a seagull says hello. Squawk!',
    'sea.story.3': "Before they play, Mum puts suncream on everyone, even on the puppies' noses! Pip puts on his sun hat. Hat on, suncream on!",
    'sea.story.4': 'Pip and the puppies build a big sandcastle. Fill the bucket, pat, pat, pat, and turn it over. Pip puts a flag on the top.',
    'sea.story.5': 'In the rock pool, Pip finds a crab, a starfish and a shrimp. Look carefully, says Grandad, and leave them in their home.',
    'sea.story.6': 'Kai the lifeguard waves hello. Swim between the red and yellow flags, says Kai. Pip and Mum paddle in the shallow water, right where Kai can see them.',
    'sea.story.7': "Time for a rest in the shade, with a drink of water and an ice cream. Then a cheeky seagull swoops down and takes one of Grandad's chips!",
    'sea.story.8': 'The sun goes down, all orange and pink, and the lighthouse starts to shine. Goodbye, sea! What a happy holiday!',
    'sea.story.end': 'The end! I love the seaside.',

    // Shell Run (ball run)
    'shellrun.pick':    'Shell Run! Build your own, or try one of my puzzles.',
    'shellrun.free':    'Drag pieces onto the board. Then blow my whistle to send the shells down!',
    'shellrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'shellrun.go':      'Here come the shells!',
    'shellrun.flip':    'Tap a piece to turn it around.',
    'shellrun.n1':      'One!',
    'shellrun.n2':      'Two!',
    'shellrun.n3':      'Three!',
    'shellrun.again':   'Oops! The shells missed the bucket. Move the pieces and try again.',
    'shellrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'shellrun.allDone': 'You solved all my puzzles! What a lot of shells for our sandcastle!',
    'shellrun.freeOut': 'Clink, clink! Shells in the bucket! What else can you build?',
    'shellrun.bolted':  'That piece is bolted on. Build around it!',
    'shellrun.cleared': "All clear! Let's build something new.",
    'shellrun.no':      'Plop! That shell fell in the rock pool. Roll the shells into the bucket.',
    'shellrun.want':    'Help three shells roll into the bucket!',
    'shellrun.won.0':   'Three shells in the bucket! Hooray!',
    'shellrun.won.1':   'Clink, clink, clink! A bucket of pretty shells!',
    'shellrun.won.2':   'Well done! Now we can put shells on our sandcastle.',
    'shellrun.p.ramp':   'A ramp! The shells roll down a slope.',
    'shellrun.p.long':   'A long ramp. The shells roll a long way down it.',
    'shellrun.p.curve':  'A curve. It turns falling shells to the side.',
    'shellrun.p.funnel': 'A funnel. It catches the shells and drops them through the middle.',
    'shellrun.p.spring': 'A spring! Boing! It bounces the shells up into the air.',
    'shellrun.p.fan':    'A fan. Whoosh! It blows the shells sideways.',
    'shellrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'shellrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Seaside Train
    'seatrain.pick': 'All aboard the Seaside Train! Seaside words are made of beats too. Pick a game.',
    'seatrain.done': 'Toot toot! You are a seaside beat star!',

    // Pack for the Beach
    'beachbag.intro': "We're off to the beach! Put the things we need in the beach bag, and leave the other things at home.",
    'beachbag.no':    'Hmm, do we need that at the beach?',
    'beachbag.done':  'All packed! Now we are ready for a sunny day at the beach.',
    'beachbag.bin.bag':  'The beach bag!',
    'beachbag.bin.home': 'Leave it at home!',

    // Sink or Float?
    'sink.intro':   'Sink or Float? Some things float on top of the water, and some things sink to the bottom. Guess first, then watch!',
    'sink.guess':   'Will it float, or sink? Tap float, or tap sink.',
    'sink.res.float': 'It floats!',
    'sink.res.sink':  'It sinks!',
    'sink.right.0': 'You guessed right!',
    'sink.right.1': 'Yes! Just like you said!',
    'sink.right.2': 'Brilliant guess!',
    'sink.wrong.0': 'Ooh, a surprise! Now we know.',
    'sink.wrong.1': 'Not what we guessed! That is how we find things out.',
    'sink.allDone': 'Brilliant scientist! The floaters are on the top, and the sinkers are at the bottom.'
  });

  // Sink or Float? The things to drop in, whether each one floats, and why.
  const THINGS = {
    apple:  { float: true,  name: 'An apple',      why: 'Apples have lots of air inside, so they float.' },
    duck:   { float: true,  name: 'A rubber duck', why: 'A rubber duck is light and full of air. Quack!' },
    ball:   { float: true,  name: 'A beach ball',  why: 'A beach ball is full of air, so it bobs on the top.' },
    leaf:   { float: true,  name: 'A leaf',        why: 'A leaf is very light, so it floats like a little boat.' },
    boat:   { float: true,  name: 'A toy boat',    why: "Boats are made to float. That's how they sail on the sea!" },
    sponge: { float: true,  name: 'A sponge',      why: 'A dry sponge is full of tiny holes with air in them, so it floats.' },
    stone:  { float: false, name: 'A stone',       why: 'A stone is small, but it is heavy. Down it goes!' },
    key:    { float: false, name: 'A key',         why: 'A key is made of metal. It is heavy for its size, so it sinks.' },
    coin:   { float: false, name: 'A coin',        why: 'A coin is a little piece of metal. Plop! It sinks to the bottom.' },
    spoon:  { float: false, name: 'A metal spoon', why: 'A metal spoon sinks. Down, down, down!' },
    marble: { float: false, name: 'A marble',      why: 'A glass marble is small, but heavy, so it sinks.' },
    shell:  { float: false, name: 'A seashell',    why: 'A seashell is hard and heavy, so it sinks to the bottom.' }
  };
  Object.entries(THINGS).forEach(([id, t]) => { L['sink.ask.' + id] = `${t.name}! Will it float, or sink?`; L['sink.why.' + id] = t.why; });

  // Pack for the Beach: the things, what each one is, and why it goes in the bag or stays at home.
  const PACKING = {
    hat:    { bag: true,  name: 'A sun hat.',          yes: 'Yes! A sun hat keeps the sun off your face.' },
    cream:  { bag: true,  name: 'Suncream.',           yes: 'Yes! Suncream stops the sun from burning your skin.' },
    water:  { bag: true,  name: 'A water bottle.',     yes: 'Yes! Drink lots of water on a hot day.' },
    towel:  { bag: true,  name: 'A towel.',            yes: 'Yes! A towel to dry off after a paddle.' },
    swim:   { bag: true,  name: 'A swimsuit.',         yes: 'Yes! A swimsuit for splashing in the sea.' },
    spade:  { bag: true,  name: 'A bucket and spade.', yes: 'Yes! A bucket and spade for building sandcastles.' },
    scarf:  { bag: false, name: 'A woolly scarf.',     yes: 'Leave it at home! A scarf is for cold, frosty days.' },
    boots:  { bag: false, name: 'Snow boots.',         yes: 'Leave them at home! Snow boots are for the snow, not the sand.' },
    school: { bag: false, name: 'A school bag.',       yes: "Leave it at home! No school today, it's a holiday!" },
    gloves: { bag: false, name: 'Warm gloves.',        yes: 'Leave them at home! Gloves keep your paws warm when it is cold.' },
    woolly: { bag: false, name: 'A woolly hat.',       yes: 'Leave it at home! A woolly hat is much too hot for the beach.' },
    coat:   { bag: false, name: 'A big winter coat.',  yes: "Leave it at home! It's far too sunny for a winter coat." }
  };
  Object.entries(PACKING).forEach(([id, s]) => { L['beachbag.name.' + id] = s.name; L['beachbag.yes.' + id] = s.yes; });
  SPOT_IDS.forEach(id => {
    const n = SA.SPOTS[id].name;
    L['sea.sticker.' + id] = id === 'tower' ? 'You earned the Lifeguard Kai sticker!' : `You earned the ${n.toLowerCase()} sticker!`;
    L['sea.name.' + id] = n + '!';
    L['sea.find.' + id] = id === 'tower' ? 'Tap Kai the lifeguard to find this sticker.' : `Tap the ${n.toLowerCase()} to find this sticker.`;
  });

  // Pip wears his sun hat and sunglasses on every seaside screen.
  ['beach', 'seaStory', 'shellrun', 'seatrain', 'sinkfloat', 'beachbag'].forEach(s => { A.screenWorld[s] = 'seaside'; });
  const COMMON = { world: 'seaside', back: 'beach' };

  // =====================================================================
  // Sunny Holiday: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const page = inner => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <defs><clipPath id="sea-pg"><rect width="1200" height="660" rx="30"/></clipPath></defs><g clip-path="url(#sea-pg)">${inner}</g></svg>`;
  const say = (x, y, t, c = '#e53935', size = 64) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const pip = (x, y, w) => SA.pipAt(x, y, w);
  const mum = () => window.SchoolArt.pipMum;
  const pup = (i, o) => PA.puppy(i, Object.assign({ tongue: true }, o));
  const beach = (seaY = 250, sandY = 400) => SA.beach(1200, 660, seaY, sandY);
  // A white dab of suncream on a nose.
  const dab = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#fff" ${S3}/>`;
  const suitcase = `<g><path d="M-170 -10 L-150 -150 H150 L170 -10 Z" fill="#c4501e" ${S}/><path d="M-150 -146 H150 L140 -40 H-140 Z" fill="#7fb8e6" ${S3}/>
    <rect x="-180" y="-12" width="360" height="110" rx="16" fill="#f07a1a" ${S}/><path d="M-100 -12 V98 M100 -12 V98" stroke="#c4501e" stroke-width="10"/>
    <g transform="translate(-90 -26) scale(.9)">${SA.PACK.hat}</g><g transform="translate(10 -40) rotate(14) scale(.8)">${SA.PACK.cream}</g>
    <g transform="translate(100 -36) scale(.8)">${SA.PACK.swim}</g></g>`;
  const umbrella = `<g><path d="M0 0 V-260" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M0 0 V-260" stroke="#fff" stroke-width="5"/>
    <path d="M-170 -230 Q0 -340 170 -230 Q140 -244 113 -230 Q85 -246 57 -230 Q28 -246 0 -230 Q-28 -246 -57 -230 Q-85 -246 -113 -230 Q-140 -244 -170 -230 Z" fill="#ff6f9c" ${S}/>
    <path d="M-57 -230 Q-40 -300 0 -312 Q40 -300 57 -230" fill="#fff" ${S3}/></g>`;
  const deckchair = `<g><path d="M-60 0 L30 -150 M60 0 L-20 -150" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M-60 0 L30 -150 M60 0 L-20 -150" stroke="${'#c98b4e'}" stroke-width="6" stroke-linecap="round"/>
    <path d="M-50 -60 L-10 -148 L44 -20 Z" fill="#e53935" ${S3}/><path d="M-36 -90 L-22 -120 L24 -34 L10 -26 Z" fill="#fff"/></g>`;
  const chips = `<g><path d="M-30 0 L-36 -50 H36 L30 0 Z" fill="#e53935" ${S3}/>${[-20, -8, 4, 16].map((x, i) => `<rect x="${x}" y="${-74 + (i % 2) * 8}" width="10" height="34" rx="3" fill="#ffd36b" ${S3}/>`).join('')}
    <path d="M-30 0 L-36 -50 H36 L30 0 Z" fill="#e53935" ${S3}/></g>`;
  const PAGES = [
    // 1. Packing the suitcase at home
    () => page(`<rect width="1200" height="660" fill="#fff1d6"/><rect y="480" width="1200" height="180" fill="#e0b088"/>
      <g transform="translate(980 160)"><rect x="-110" y="-80" width="220" height="170" rx="10" fill="#bfe6ff" ${S}/>${SA.sun(50, -20, 26)}<path d="M-110 30 H110" stroke="${OL}" stroke-width="6"/></g>
      ${tap('pop', at(560, 520, 1, suitcase))}
      ${tap('yip', at(430, 470, .9, pup(0)))}${tap('yip', at(700, 470, .9, pup(3)))}${tap('yip', at(560, 640, .9, pup(1)))}
      ${tap('woof', at(900, 610, 1.1, mum()))}${pip(70, 300, 230)}`),
    // 2. Arriving at the beach
    () => page(`${beach()}${SA.sun(1040, 100, 50)}${Art.cloud(300, 90, .6)}
      ${tap('pop', at(170, 470, .75, SA.hut()))}
      ${tap('pop', at(930, 600, 1.1, deckchair))}${tap('woof', at(820, 590, .85, BA.grandad(true)))}
      ${tap('gull', at(560, 190, 1.1, SA.gull({ fly: true })))}
      ${pip(380, 360, 220)}${tap('yip', at(1040, 610, .8, pup(2)))}`),
    // 3. Suncream and sun hats
    () => page(`${beach()}${SA.sun(1080, 90, 46)}
      ${tap('woof', at(240, 620, 1.15, mum()))}${tap('pop', at(370, 480, .9, `<g transform="rotate(-20)">${SA.PACK.cream}</g>`))}
      ${[0, 1, 2, 3, 4].map(i => tap('yip', at(560 + i * 120, 600, .9, pup(i) + dab(0, -58)))).join('')}
      ${pip(880, 280, 190)}${say(560, 150, 'Hat on!', '#ff6f9c', 60)}${say(560, 220, 'Suncream on!', '#f07a1a', 60)}`),
    // 4. Building a sandcastle
    () => page(`${beach(220, 360)}${SA.sun(160, 90, 44)}
      ${tap('sparkle', at(620, 600, 1.4, SA.castle(true)))}
      ${pip(250, 360, 220)}${tap('pop', at(330, 640, .7, SA.sandBucket(3)))}
      ${tap('yip', at(900, 600, .9, pup(1)))}${tap('yip', at(1020, 620, .9, pup(4)))}${tap('yip', at(1110, 590, .8, pup(2)))}`),
    // 5. The rock pool
    () => page(`${beach(200, 330)}
      ${at(600, 640, 2.4, SA.pool(false, true))}
      ${tap('pop', at(800, 560, .9, SA.crab(true)))}${tap('sparkle', at(470, 560, .8, SA.starfish()))}${tap('plop', at(640, 548, 1.3, SA.shrimp))}
      ${tap('woof', at(1060, 420, .8, BA.grandad()))}${pip(60, 230, 190)}`),
    // 6. Swim between the flags
    () => page(`${beach(180, 470)}${SA.sun(1100, 80, 40)}
      ${at(300, 600, 1.6, SA.flag())}${at(820, 600, 1.6, SA.flag())}
      <path d="M380 470 Q560 440 760 470" fill="none" stroke="#2e9e4f" stroke-width="6" stroke-dasharray="14 12"/>
      ${tap('woof', at(560, 470, .9, mum()))}${pip(380, 310, 170)}
      ${tap('whistle', at(1040, 640, 1, SA.kai(true)))}
      ${say(570, 120, 'Swim between the flags!', '#e53935', 50)}`),
    // 7. Shade, ice cream and the cheeky seagull
    () => page(`${beach()}${SA.sun(1100, 90, 44)}
      ${at(560, 640, 1.2, umbrella)}
      ${tap('woof', at(480, 610, .9, BA.grandad()))}${tap('pop', at(640, 560, 1, chips))}
      ${pip(730, 380, 200)}${tap('pop', at(950, 470, .9, SA.cone(1, ['#ffb3c1'])))}
      ${tap('pop', at(380, 550, .7, SA.PACK.water))}
      ${tap('gull', at(780, 180, 1.2, SA.gull({ fly: true, chip: true })))}`),
    // 8. Sunset
    () => page(`${SA.beach(1200, 660, 300, 450, '#ffb38a', '#2f6fa8')}
      <rect width="1200" height="160" fill="#ff8fa3" opacity=".5"/>
      <circle cx="600" cy="300" r="90" fill="#ffd21f" opacity=".95"/><rect y="300" width="1200" height="40" fill="#2f6fa8"/>${SA.waves(0, 1200, 320, 6, 90, '#ffd21f', 5)}
      ${tap('foghorn', at(1080, 380, .6, SA.lighthouse(true)))}
      ${tap('woof', at(300, 640, 1, mum()))}${tap('woof', at(470, 650, .9, BA.grandad(true)))}
      ${pip(540, 420, 200)}${[0, 1, 2, 3, 4].map(i => tap('yip', at(760 + i * 70, 640 - (i % 2) * 14, .7, pup(i)))).join('')}
      ${say(600, 140, 'Goodbye, sea!', '#fff', 64).replace('stroke="#fff"', `stroke="${OL}"`)}`)
  ];
  Story.mount(Object.assign({ screen: 'seaStory', colour: '#0a8fb0', cls: 'sea-story', lines: { end: 'sea.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(30 50) scale(.24)">${SA.castle()}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'sea.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Shell Run: shells tumble off a wave into the sand bucket (not into the rock pool)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#ffd21f" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-28 -46) scale(.5)">${SA.shell(0)}</g><g transform="translate(10 -20) scale(.5)">${SA.shell(1)}</g>
    <g transform="translate(-6 58) scale(.42)">${SA.sandBucket(2)}</g></svg>`;
  const runTheme = {
    board(ctx) { // a sunny beach: sky, a band of sea and sand along the bottom
      ctx.fillStyle = '#dff3ff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      [[220, 120], [820, 80], [1200, 150]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.arc(x + 40, y - 14, 40, 0, 7); ctx.arc(x + 84, y, 32, 0, 7); ctx.fill(); });
      ctx.fillStyle = 'rgba(58,167,216,.22)'; ctx.fillRect(0, H - 330, W, 200);
      ctx.fillStyle = 'rgba(246,220,154,.6)'; ctx.fillRect(0, H - 130, W, 130);
      ctx.fillStyle = '#e8c477'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // a curling wave at the top, with shells riding on it
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      [0, 1, 2].forEach(i => drawImg(ctx, SA.shellImage(i + 2), x - 22 + i * 22, 14, 26, 26));
      poly(ctx, [{ x: x - 44, y: 22 }, { x: x + 44, y: 22 }, { x: x + 36, y: 50 }, { x: x - 36, y: 50 }], '#3aa7d8');
      poly(ctx, [{ x: x - 14, y: 50 }, { x: x + 14, y: 50 }, { x: x + 10, y: 62 }, { x: x - 10, y: 62 }], '#1e88c7');
      line(ctx, x - 36, 28, x + 36, 28, '#fff', 4);
      if (dripping) line(ctx, x - 9, 57, x + 9, 57, '#fff', 4);
    },
    ball(ctx, b) { drawImg(ctx, SA.shellImage(b.idx), b.position.x, b.position.y, 2 * R + 10, 2 * R + 10, b.angle); },
    goal(ctx, st) {
      const { level, fx, won, now, hits } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 4 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 6 : 0;
      drawImg(ctx, SA.bucketImage(Math.min(hits, 3), won), x + 20, H - 66 + bob + jump, 200, 132);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 6 : 0);
      drawImg(ctx, SA.poolImage(fx.shake > 0), x, H - 42, 180, 95);
    },
    splash: '#7fb8e6',
    release() { Sfx.pop(); },
    hit(ev, fx) { Sfx.plink(1.4); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ffd21f', 1.2); },
    win(fx) { fx.chew = 0; Sfx.chime(); },
    tapGoal() { Sfx.plink(1.2); },
    tapDecoy() { Sfx.plop(); },
    refuse: () => 'shellrun.no',
    intro: () => 'shellrun.want',
    winLine: () => 'shellrun.won.' + Math.floor(Math.random() * 3)
  };
  BR.mount(Object.assign({ screen: 'shellrun', lines: 'shellrun', colour: '#f07a1a', icon: RUN_ICON, pack: BR.packs.seaside, theme: runTheme, cls: 'sea-run' }, COMMON));

  // =====================================================================
  // Seaside Train: seaside words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat (short "ih", "cull", "row", "purr").
  // alone / carrier / ipa: see the Rescue Station words in js/train.js and the puppy words in js/puppies.js.
  WordTrain.packs.seaside = {
    id: 'seaside',
    words: [
      { id: 'seagull',    word: 'seagull',    beats: ['sea', 'gull'],          say: ['see', 'gull'],          pic: 'seagull' },
      { id: 'starfish',   word: 'starfish',   beats: ['star', 'fish'],         say: ['star', 'fish'],         pic: 'starfish' },
      { id: 'lighthouse', word: 'lighthouse', beats: ['light', 'house'],       say: ['light', 'house'],       pic: 'lighthouse' },
      { id: 'bucket',     word: 'bucket',     beats: ['buck', 'et'],           say: ['buck', 'kit'],          pic: 'bucket' },
      { id: 'suncream',   word: 'suncream',   beats: ['sun', 'cream'],         say: ['sun', 'cream'],         pic: 'suncream' },
      { id: 'seaweed',    word: 'seaweed',    beats: ['sea', 'weed'],          say: ['see', 'weed'],          pic: 'seaweed' },
      { id: 'icecream',   word: 'ice cream',  beats: ['ice', 'cream'],         say: ['ice', 'cream'],         pic: 'icecream' },
      { id: 'sandcastle', word: 'sandcastle', beats: ['sand', 'cas', 'tle'],   say: ['sand', 'car', 'sull'],  pic: 'sandcastle' },
      { id: 'jellyfish',  word: 'jellyfish',  beats: ['jel', 'ly', 'fish'],    say: ['jell', 'lee', 'fish'],  pic: 'jellyfish' },
      { id: 'octopus',    word: 'octopus',    beats: ['oc', 'to', 'pus'],      say: ['ock', 'tuh', 'puss'],   pic: 'octopus' },
      { id: 'sunglasses', word: 'sunglasses', beats: ['sun', 'glass', 'es'],   say: ['sun', 'glass', 'iz'],   pic: 'sunglasses', alone: [2], ipa: { 2: 'ɪz' } },
      { id: 'holiday',    word: 'holiday',    beats: ['hol', 'i', 'day'],      say: ['holl', 'ih', 'day'],    pic: 'holiday', alone: [1], carrier: { 1: 'it' } }
    ]
  };
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 96) scale(.5)">${SA.ITEMS.starfish}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'seatrain', pack: WordTrain.packs.seaside, colour: '#1e5bd6', tile: TRAIN_TILE, picture: w => SA.itemSvg(w.pic), cls: 'sea-train',
    lines: { pick: 'seatrain.pick', done: 'seatrain.done' } }, COMMON));

  // =====================================================================
  // Pack for the Beach: drag each thing to the beach bag, or leave it at home (the sorting engine)
  // =====================================================================
  const BAG_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-6 6) scale(.8)">${SA.beachBag.replace(/<\/?svg[^>]*>/g, '')}</g>
    <g transform="translate(30 -30) scale(.42)">${SA.PACK.hat}</g></svg>`;
  const BAG_IDS = Object.keys(PACKING).filter(id => PACKING[id].bag), HOME_IDS = Object.keys(PACKING).filter(id => !PACKING[id].bag);
  Sorter.mount(Object.assign({
    screen: 'beachbag', colour: '#ff6f9c', tile: BAG_TILE, cls: 'sea-bag',
    lines: { intro: 'beachbag.intro', no: 'beachbag.no', done: 'beachbag.done' },
    round(level) {
      const n = [2, 3, 4][level];
      const ids = shuffle(BAG_IDS).slice(0, n).concat(shuffle(HOME_IDS).slice(0, n));
      return {
        bins: [{ id: 'bag', art: SA.beachBag, name: 'beachbag.bin.bag', label: 'Beach bag', cls: 'bag-yes' }, { id: 'home', art: SA.homeBin, name: 'beachbag.bin.home', label: 'Leave at home', cls: 'bag-home' }],
        items: ids.map(id => ({ id, bin: PACKING[id].bag ? 'bag' : 'home', line: 'beachbag.yes.' + id, name: 'beachbag.name.' + id, label: PACKING[id].name.replace(/\.$/, ''), art: SA.packSvg(id) }))
      };
    },
    onRight(binEl, it) { (it.bin === 'bag' ? Sfx.chime : Sfx.pop).call(Sfx); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Sink or Float?: guess first, then drop each thing into the water tank and watch
  // =====================================================================
  const FLOAT_ICON = `<svg viewBox="-50 -50 100 100"><path d="M-46 14 Q-34 4 -22 14 T2 14 T26 14 T50 14 V50 H-46 Z" fill="#9fdcff"/>
    <g transform="translate(0 -2) scale(.5)">${SA.SINKFLOAT.duck}</g><path d="M30 -16 V-44 M20 -34 L30 -46 L40 -34" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const SINK_ICON = `<svg viewBox="-50 -50 100 100"><rect x="-46" y="-30" width="96" height="80" fill="#9fdcff"/><path d="M-46 -30 Q-34 -40 -22 -30 T2 -30 T26 -30 T50 -30" fill="none" stroke="#fff" stroke-width="4"/>
    <g transform="translate(-6 30) scale(.42)">${SA.SINKFLOAT.stone}</g><path d="M30 -18 V14 M20 4 L30 16 L40 4" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const SF_TILE = `<svg viewBox="-60 -60 120 120"><rect x="-48" y="-30" width="96" height="80" rx="10" fill="#9fdcff" ${S3}/>
    <path d="M-48 -10 Q-36 -18 -24 -10 T0 -10 T24 -10 T48 -10" fill="none" stroke="#fff" stroke-width="5"/>
    <g transform="translate(-18 -14) scale(.36)">${SA.SINKFLOAT.duck}</g><g transform="translate(20 36) scale(.3)">${SA.SINKFLOAT.key}</g></svg>`;
  A.addGame('sinkfloat', '#8e5bd6', SF_TILE, COMMON);
  const SURF = 430, BOT = 760, TOP_Y = 190, SLOTS = [580, 800, 1020];
  A.screens.sinkfloat = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('sinkfloat'), n = [4, 5, 6][level];
    const floats = shuffle(Object.keys(THINGS).filter(id => THINGS[id].float)), sinks = shuffle(Object.keys(THINGS).filter(id => !THINGS[id].float));
    const nf = n % 2 ? (Math.random() < .5 ? 2 : 3) : n / 2;
    const ids = shuffle(floats.slice(0, nf).concat(sinks.slice(0, n - nf)));
    scene().innerHTML = `<div class="sf-wrap"><svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="A water tank on the beach">
      ${Art.defs()}${SA.beach(1600, 900, 300, 560)}${SA.sun(1240, 120, 50)}${Art.cloud(260, 100, .7)}
      <rect x="400" y="310" width="800" height="500" rx="26" fill="#f4fbff" opacity=".93"/>
      <g id="sfin"></g>
      <rect x="412" y="${SURF}" width="776" height="${BOT + 34 - SURF}" rx="4" fill="#3aa7d8" opacity=".62"/>
      ${SA.waves(412, 1188, SURF, 8, 97, '#fff', 6)}
      <rect x="400" y="310" width="800" height="500" rx="26" fill="none" ${S}/><path d="M440 350 V560" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".6"/>
      <rect x="380" y="800" width="840" height="34" rx="10" fill="#c98b4e" ${S}/>
      <g id="sfnow"></g><g id="sffx"></g></svg>
      <button class="big-btn sf-btn sf-float" aria-label="Float">${FLOAT_ICON}<span>Float</span></button>
      <button class="big-btn sf-btn sf-sink" aria-label="Sink">${SINK_ICON}<span>Sink</span></button></div>`;
    const svg = scene().querySelector('svg'), inG = svg.querySelector('#sfin'), nowG = svg.querySelector('#sfnow'), fxG = svg.querySelector('#sffx');
    const floatBtn = scene().querySelector('.sf-float'), sinkBtn = scene().querySelector('.sf-sink');
    const NS = 'http://www.w3.org/2000/svg';
    let i = 0, busy = true, el = null, nF = 0, nS = 0;
    const place = (g, x, y) => g.setAttribute('transform', `translate(${x} ${y})`);
    const bits = (x, y, list, dur) => list.forEach(([dx, dy, r]) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
      c.setAttribute('fill', '#fff'); c.setAttribute('stroke', OL); c.setAttribute('stroke-width', 3);
      fxG.appendChild(c);
      c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }], { duration: dur, easing: 'ease-out' }).onfinish = () => c.remove();
    });

    async function next() {
      const id = ids[i];
      el = document.createElementNS(NS, 'g');
      el.innerHTML = `<g class="sf-hang"><g transform="scale(1.25)">${SA.SINKFLOAT[id]}</g></g>`;
      place(el, 800, TOP_Y); nowG.appendChild(el);
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      Sfx.pop();
      if (i === 0) { await A.say('sink.intro'); if (!alive()) return; }
      await A.say('sink.ask.' + id); if (!alive()) return;
      busy = false;
      A.Hint.set([floatBtn, sinkBtn], 'sink.guess');
    }

    async function guess(btn, g) {
      if (busy) return;
      busy = true; A.Hint.clear(); Sfx.tap();
      btn.classList.add('chosen');
      const id = ids[i], t = THINGS[id];
      const x1 = t.float ? SLOTS[nF++] : SLOTS[nS++];
      el.querySelector('.sf-hang').classList.remove('sf-hang');
      // Fall into the water, faster and faster.
      await A.tween(550, q => place(el, 800 + (x1 - 800) * q, TOP_Y + (SURF - 10 - TOP_Y) * q * q));
      if (!alive()) return;
      Sfx.splash();
      bits(x1, SURF, [[-90, -110, 9], [-40, -150, 7], [30, -140, 8], [80, -100, 7], [0, -170, 6]], 700);
      inG.appendChild(el);
      if (t.float) {
        // Dip under, then bob back up and keep bobbing.
        await A.tween(1000, q => place(el, x1, SURF - 18 + Math.cos(q * Math.PI * 2.5) * 34 * (1 - q) + 8 * (1 - q)));
        if (!alive()) return;
        el.firstChild.classList.add('sf-bob');
      } else {
        // Sink slowly to the bottom, with bubbles.
        const y0 = SURF - 10, y1 = BOT - 62;
        let blub = 0;
        await A.tween(1600, q => {
          place(el, x1, y0 + (y1 - y0) * (1 - Math.pow(1 - q, 1.6)));
          if (q > blub) { blub += .25; Sfx.plink(.8 + blub); bits(x1 + 20, y0 + (y1 - y0) * q - 30, [[10, -(y0 + (y1 - y0) * q - SURF) + 20, 6]], 900); }
        });
        if (!alive()) return;
        Sfx.plop();
      }
      await A.say(t.float ? 'sink.res.float' : 'sink.res.sink'); if (!alive()) return;
      const right = (g === 'float') === t.float;
      if (right) { Sfx.chime(); A.Pip.mood('cheer'); A.Pip.act('jump'); await A.say('sink.right.' + Math.floor(Math.random() * 3)); }
      else { A.Pip.mood('thinking'); await A.say('sink.wrong.' + Math.floor(Math.random() * 2)); }
      if (!alive()) return;
      await A.say('sink.why.' + id); if (!alive()) return;
      btn.classList.remove('chosen');
      i++;
      if (i < ids.length) { next(); return; }
      A.Pip.act('dance'); A.confetti();
      await A.say('sink.allDone');
      if (alive()) A.gameDone('sinkfloat');
    }
    floatBtn.onclick = () => guess(floatBtn, 'float');
    sinkBtn.onclick = () => guess(sinkBtn, 'sink');
    next();
  };

  // =====================================================================
  // The beach: visit six places, and pick a game
  // =====================================================================
  const PLACE = { // all inside x 200 to 1400, so 4:3 screens show every place; bases at or above y 700 (game tiles below)
    hut:        { x: 280,  y: 640, s: .9,  art: () => SA.hut(false), hit: [-110, -300, 220, 306] },
    tower:      { x: 530,  y: 660, s: .9,  art: () => SA.tower(false), hit: [-92, -420, 300, 424] },
    castle:     { x: 790,  y: 700, s: .85, art: () => SA.castle(false), hit: [-120, -240, 240, 244] },
    pool:       { x: 1040, y: 700, s: .95, art: () => SA.pool(false), hit: [-130, -110, 260, 112] },
    van:        { x: 1250, y: 640, s: .72, art: () => SA.van(false), hit: [-150, -250, 300, 254] },
    lighthouse: { x: 1330, y: 400, s: .66, art: () => SA.lighthouse(false), hit: [-70, -346, 140, 346] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="${SA.star(62, 34)}" fill="${on ? '#ff8a3d' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle r="27" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(0 2) scale(.32)">${SA.sun(0, 0, 50)}</g>
    ${on ? '' : `<text y="50" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const seaGames = () => A.worldGames('seaside');
  const badgeEarned = () => SPOT_IDS.every(id => P().seaside.includes(id)) && seaGames().every(g => P().games.includes(g.id));

  function homeArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().seaside.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="sea-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + (hx + hw - 16) * p.s} ${p.y + (hy + 20) * p.s})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx * p.s}" y="${p.y + hy * p.s}" width="${hw * p.s}" height="${hh * p.s}" fill="transparent"/>
      </g>`;
    }).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The beach">
      ${Art.defs()}
      ${SA.beach(1600, 900, 300, 470)}${SA.sun(470, 110, 46)}${Art.cloud(640, 80, .7)}${Art.cloud(1000, 130, .5)}
      <path d="M0 470 Q200 452 400 470 T800 470 T1200 470 T1600 470" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".9"/>
      <g class="sea-gull tappable"><g class="gull-fly" transform="translate(950 230)">${SA.gull({ fly: true })}</g><rect x="870" y="110" width="160" height="140" fill="transparent"/></g>
      <g transform="translate(130 790) scale(.8)">${SA.starfish('#ff8fa3')}</g><g transform="translate(1480 800) scale(.6)">${SA.shell(1)}</g>
      ${spots}
    </svg>`;
  }

  // A sticker for each thing on the beach, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().seaside.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${SA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${SA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${SA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('sea.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('seaside')) return;
    P().badges.push('seaside'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Seaside Star badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Seaside Star badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('sea.badge');
  }

  // What changes while a place is talking: the hut doors open, Kai waves, the crab climbs out, the flag flutters,
  // the van opens its hatch and the lighthouse shines.
  const LIVE = { hut: () => SA.hut(true), tower: () => SA.tower(true), pool: () => SA.pool(true), castle: () => SA.castle(true), van: () => SA.van(true), lighthouse: () => SA.lighthouse(true) };
  let welcomed = false;
  A.screens.beach = (arg, alive) => {
    scene().innerHTML = `<div class="sea-home">${homeArt()}
      <div class="world-tiles">${seaGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.sea-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelector('.sea-gull').addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear(); Sfx.gull();
      await A.say('sea.gull');
      if (alive()) busy = false;
    });
    root.querySelectorAll('.sea-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      art.innerHTML = LIVE[id]();
      sound(id); if (id === 'pool' || id === 'tower') Sfx.waves();
      await A.say('sea.fact.' + id);
      if (!alive()) return;
      art.innerHTML = PLACE[id].art();
      if (!P().seaside.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.beach('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.sea-spot[data-s="castle"]')], 'sea.hint');
    Sfx.waves();
    if (!welcomed) { welcomed = true; A.say('sea.welcome'); } else A.say('sea.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The seaside page in the sticker book, and its badge ----------
  Rewards.pages.seaside = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="sea" data-id="${id}" aria-label="${SA.SPOTS[id].name}">${SA.sticker(id, P().seaside.includes(id))}<span>${P().seaside.includes(id) ? SA.SPOTS[id].name : '?'}</span></button>`).join('')
      + seaGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'sea') return false;
      if (P().seaside.includes(id)) { Sfx.sparkle(); A.say('sea.name.' + id); }
      else { Sfx.boing(); A.say('sea.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'seaside', name: 'Seaside Star', svg: BADGE, earned: () => P().badges.includes('seaside') || badgeEarned(), how: 'sea.badge.how' });

  window.Seaside = { SPOT_IDS, BADGE, badgeEarned, THINGS, PACKING };
})();
