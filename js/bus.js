// Pip's Days Out: Bus and Train. Pip and Grandad take the bus to the station, then catch the train. Words, pictures,
// levels and the bus stop and station home screen, plus one game of its own (Next Stop!). The story, Ticket Run,
// Station Train and Safe or Not Safe? come from the shared engines (Story, BallRun, WordTrain, Sorter).

// ---------- Ticket Run levels (kept outside the screen code so tests can run them without a screen) ----------
(function () {
  const BR = window.BallRun;
  // The Bedtime Run puzzles (themselves the Coin Run and Gobble Run layouts) in a new order within each group,
  // each checked solvable again by running its physics with the hint pieces in place. decoy: the big puddle.
  const b = p => Object.assign({ balls: 6 }, p);
  BR.packs.bus = {
    id: 'bus',
    free: { hose: 1, goal: 11, balls: 8 },
    freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
    puzzles: [
      // 1 to 4: one piece
      b({ hose: 10, goal: 8, tray: ['ramp'], hint: [{ t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 3, goal: 5, tray: ['ramp'], hint: [{ t: 'ramp', c: 3, r: 3 }] }),
      b({ hose: 9, goal: 6, decoy: 9, tray: ['curve'], hint: [{ t: 'curve', c: 9, r: 3, f: true }] }),
      b({ hose: 2, goal: 5, decoy: 2, tray: ['long'], hint: [{ t: 'long', c: 1, r: 3 }] }),
      // 5 to 8: two pieces
      b({ hose: 1, goal: 9, decoy: 1, tray: ['long', 'long'], hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] }),
      b({ hose: 11, goal: 4, decoy: 11, tray: ['ramp', 'fan'], hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] }),
      b({ hose: 12, goal: 4, decoy: 12, tray: ['long', 'long'], hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] }),
      b({ hose: 2, goal: 9, decoy: 2, tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] }),
      // 9 to 12: a see-saw or a bucket
      b({ hose: 2, goal: 8, tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] }),
      b({ hose: 4, goal: 9, decoy: 4, tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] }),
      b({ hose: 5, goal: 11, decoy: 5, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] }),
      b({ hose: 6, goal: 12, decoy: 5, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
        hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] })
    ]
  };

  // Medium and Hard: mixed things come down, and gates (or a flip-flop) sort them. Each level is one of the
  // checked Zoo and Puppies layouts (some mirrored) with this world's things, and was checked again by running its physics.
  ((pack, g, lv) => {
    pack.medium = [
      lv({ hose: 4, goal: 4, balls: 8, mix: [5, 0], want: 5, tray: [g('gate', 5)], hint: [{ t: 'gate', k: 5, c: 4, r: 1 }] }),
      lv({ hose: 3, goal: 3, balls: 8, mix: [0, 1], want: 0, tray: [g('gate', 0)], hint: [{ t: 'gate', k: 0, c: 3, r: 1 }] }),
      lv({ hose: 12, goal: 7, balls: 8, mix: [1, 2], want: 1, tray: [g('gate', 1), 'long'], hint: [{ t: 'long', c: 10, r: 1, f: true }, { t: 'gate', k: 1, c: 8, r: 2, f: true }] }),
      lv({ hose: 11, goal: 6, balls: 8, mix: [2, 3], want: 2, tray: [g('gate', 2), 'long'], hint: [{ t: 'long', c: 8, r: 1, f: true }, { t: 'gate', k: 2, c: 6, r: 2, f: true }] }),
      lv({ hose: 5, goal: 10, balls: 8, mix: [3, 4], want: 3, fixed: [{ t: 'block', c: 8, r: 4 }], tray: [g('gate', 3), 'ramp'], hint: [{ t: 'gate', k: 3, c: 4, r: 2 }, { t: 'ramp', c: 6, r: 5 }] }),
      lv({ hose: 9, goal: 2, balls: 8, mix: [4, 5], want: 4, tray: [g('gate', 4), 'curve'], hint: [{ t: 'gate', k: 4, c: 9, r: 1, f: true }, { t: 'curve', c: 7, r: 4, f: true }] }),
      lv({ hose: 10, goal: 2, balls: 8, mix: [5, 0], want: 5, tray: [g('gate', 5), 'spring'], hint: [{ t: 'spring', c: 10, r: 1, f: true }, { t: 'gate', k: 5, c: 7, r: 1, f: true }] }),
      lv({ hose: 12, goal: 6, balls: 8, mix: [0, 1], want: 0, fixed: [{ t: 'block', c: 12, r: 4 }], tray: [g('gate', 0), 'long'], hint: [{ t: 'gate', k: 0, c: 11, r: 1, f: true }, { t: 'long', c: 10, r: 5, f: true }] })
    ];
    pack.hard = [
      lv({ hose: 9, goal: 8, balls: 8, mix: [1, 2], goal2: 4, want: 1, want2: 2, tray: [g('gate', 1)], hint: [{ t: 'gate', k: 1, c: 8, r: 3, f: true }] }),
      lv({ hose: 2, goal: 4, balls: 8, mix: [2, 3], goal2: 9, want: 2, want2: 3, tray: [g('gate', 2), 'long'], hint: [{ t: 'gate', k: 2, c: 1, r: 2 }, { t: 'long', c: 5, r: 5 }] }),
      lv({ hose: 5, goal: 6, balls: 9, mix: [3, 4, 5], want: 3, tray: [g('gate', 4), g('gate', 3)], hint: [{ t: 'gate', k: 3, c: 4, r: 2 }] }),
      lv({ hose: 3, goal: 9, balls: 9, mix: [4, 5, 0], want: 4, tray: [g('not', 4), 'long'], hint: [{ t: 'not', k: 4, c: 3, r: 1 }, { t: 'long', c: 5, r: 2 }] }),
      lv({ hose: 7, goal: 11, balls: 8, mix: [5, 0], goal2: 3, want: 5, want2: 0, tray: ['flip', 'long'], hint: [{ t: 'flip', c: 6, r: 2 }, { t: 'long', c: 7, r: 4 }] }),
      lv({ hose: 3, goal: 3, balls: 9, mix: [0, 1, 2], goal2: 6, want: 0, want2: 1, tray: [g('gate', 0), g('gate', 1)], hint: [{ t: 'gate', k: 0, c: 3, r: 1 }, { t: 'gate', k: 1, c: 5, r: 2 }] }),
      lv({ hose: 7, goal: 12, balls: 8, mix: [1, 2], goal2: 1, want: 1, want2: 2, tray: ['flip', 'long', 'long'], hint: [{ t: 'flip', c: 7, r: 2 }, { t: 'long', c: 7, r: 4 }, { t: 'long', c: 3, r: 4, f: true }] }),
      lv({ hose: 2, goal: 6, balls: 8, mix: [2, 3], goal2: 2, want: 2, want2: 3, fixed: [{ t: 'block', c: 9, r: 5 }], tray: [g('not', 2), 'long'], hint: [{ t: 'not', k: 2, c: 2, r: 1 }, { t: 'long', c: 3, r: 3 }] })
    ];
  })(window.BallRun.packs.bus, (t, k) => ({ t, k }), o => Object.assign({ balls: 8, kinds: [...new Set(o.mix)] }, o));
})();

(function () {
  const A = window.App;
  if (!A) return;
  const { OL, S, S3 } = Art;
  const BA = window.BusArt;
  const scene = () => document.getElementById('scene');
  const P = () => A.progress;
  if (!P().bus) P().bus = [];
  const shuffle = Sorter.shuffle;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // The six things to visit at the bus stop and the station; visiting each one earns its sticker.
  const SPOT_IDS = ['stop', 'bus', 'bell', 'ticket', 'clock', 'train'];
  const SOUND = { stop: 'pop', bus: 'horn', bell: 'ding', ticket: 'beep', clock: 'chime', train: 'whistle' };
  const sound = id => (Sfx[SOUND[id]] || Sfx.pop).call(Sfx);
  const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
  const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth'];

  // ---------- Words ----------
  const L = CONTENT.lines;
  Object.assign(L, {
    'bus.welcome': 'Welcome to the bus stop and the station! Pip and Grandad are going on a day out. Tap things to find out about them, or pick a game at the bottom.',
    'bus.back':    'Where shall we go with Grandad now?',
    'bus.hint':    'Tap something at the bus stop or the station!',
    'bus.grandad': "Hello! I'm Pip's grandad. I love a day out on the bus and the train!",
    'bus.fact.stop':   'This is the bus stop. We wait here for the bus, standing back from the road. The timetable tells us when the next bus comes.',
    'bus.fact.bus':    "Here's the red bus! Hello, Dot! Dot is the bus driver. When you get on, tap your card or show your ticket.",
    'bus.fact.bell':   'This is the bell button on the bus. Press it just before your stop, and Dot knows to stop the bus. Ding ding!',
    'bus.fact.ticket': 'The ticket machine. Choose where you are going, pay, and out comes your ticket!',
    'bus.fact.clock':  "The platform clock. The big hand is on twelve, and the little hand is on three. It's three o'clock, time for the train!",
    'bus.fact.train':  "Here's the train! Mr Amin is the guard. He checks that everyone is safely on, then he blows his whistle. Peep!",
    'bus.badge':     'You earned the Happy Traveller badge! What a brilliant day out!',
    'bus.badge.how': 'Visit everything at the bus stop and the station, and play every bus and train game, to earn the Happy Traveller badge.',
    'book.world.bus': 'Your bus and train stickers! Explore the bus stop and the station, and play the games to fill this page.',

    'games.busStory':     'All Aboard!',
    'games.ticketrun':    'Ticket Run',
    'games.stationtrain': 'Station Train',
    'games.nextstop':     'Next Stop!',
    'games.safety':       'Safe or Not Safe?',

    // The story
    'bus.story.1': 'Pip and Grandad are going on a big day out, on the bus and the train! They wait at the bus stop, holding hands. Here comes the bus!',
    'bus.story.2': "Hello, Dot! says Pip. Dot is the bus driver. Grandad taps his card on the reader. Beep! Then they find a seat by the window.",
    'bus.story.3': 'The station is the next stop. Pip presses the bell button. Ding ding! That tells Dot to stop the bus.',
    'bus.story.4': 'To get to the station, they cross the road. Stop, look and listen! They wait for the green man, then cross together.',
    'bus.story.5': "At the station, Grandad buys the tickets from the ticket machine. One for Grandad, and a child's ticket for Pip.",
    'bus.story.6': "Mr Amin is the guard. Please stand behind the yellow line, he says. Here comes the train, right on time at three o'clock!",
    'bus.story.7': "Mind the gap! Pip holds Grandad's paw and steps carefully onto the train. Mr Amin blows his whistle. Peep!",
    'bus.story.8': 'Off they go! Pip waves from the window. The train goes all the way to the seaside. Next stop, the seaside!',
    'bus.story.end': 'The end! Thank you for travelling with me.',

    // Ticket Run (ball run)
    'tickrun.pick':    'Ticket Run! Build your own, or try one of my puzzles.',
    'tickrun.free':    'Drag pieces onto the board. Then blow my whistle to send the passengers down!',
    'tickrun.puzzle':  'Drag a piece onto the board, then blow my whistle.',
    'tickrun.go':      'Here come the passengers!',
    'tickrun.flip':    'Tap a piece to turn it around.',
    'tickrun.n1':      'One!',
    'tickrun.n2':      'Two!',
    'tickrun.n3':      'Three!',
    'tickrun.again':   'Oops! The passengers missed the bus. Move the pieces and try again.',
    'tickrun.hint':    "Here's a clue. Try putting a piece where it glows.",
    'tickrun.allDone': 'You solved all my puzzles! Everyone caught the bus. Ding ding!',
    'tickrun.freeOut': 'Wheee! All aboard! What else can you build?',
    'tickrun.bolted':  'That piece is bolted on. Build around it!',
    'tickrun.cleared': "All clear! Let's build something new.",
    'tickrun.no':      "Splash! That's a big puddle. Roll the passengers onto the bus.",
    'tickrun.want':    'The bus is here! Help three passengers roll onto the bus.',
    'tickrun.won.0':   'Three passengers on the bus! Ding ding, off we go!',
    'tickrun.won.1':   'Hooray! Everyone is on board. Hold on tight!',
    'tickrun.won.2':   'Well done! Dot waves, and the bus drives off.',
    'tickrun.p.ramp':   'A ramp! The passengers roll down a slope.',
    'tickrun.p.long':   'A long ramp. The passengers roll a long way down it.',
    'tickrun.p.curve':  'A curve. It turns falling passengers to the side.',
    'tickrun.p.funnel': 'A funnel. It catches the passengers and drops them through the middle.',
    'tickrun.p.spring': 'A spring! Boing! It bounces the passengers up into the air.',
    'tickrun.p.fan':    'A fan. Whoosh! It blows the passengers sideways.',
    'tickrun.p.seesaw': 'A see-saw. When something lands on one end, it tips!',
    'tickrun.p.bucket': 'A bucket. When it fills up, it tips over!',

    // Station Train
    'stationtrain.pick': 'All aboard the Station Train! Bus and train words are made of beats too. Pick a game.',
    'stationtrain.done': 'All aboard! Toot toot! You are a brilliant beat spotter!',

    // Safe or Not Safe?
    'safety.intro': 'Is it safe, or not safe? Drag each picture to the green tick or the red cross.',
    'safety.no':    'Hmm, look again. Is that safe?',
    'safety.done':  'Well done! You know how to stay safe on the road, the bus and the train.',
    'safety.bin.safe': 'Safe!',
    'safety.bin.not':  'Not safe!',

    // Next Stop!
    'stop.intro':   'Next Stop! Tap the green arrow to drive the bus to the next stop. When it is our stop, ring the bell!',
    'stop.hint':    'Tap the green arrow to drive to the next stop.',
    'stop.ringnow': 'This is our stop! Ring the bell!',
    'stop.notyet':  "Not yet! We haven't got to a stop. Tap the green arrow.",
    'stop.count':   'Not this stop. Count the stops, and keep going!',
    'stop.yes.0':   'Ding ding! The bus stops, and we hop off.',
    'stop.yes.1':   'Ding ding! You rang the bell at just the right stop!',
    'stop.yes.2':   'Ding ding! Thank you, Dot! Off we get.',
    'stop.next':    "Back on the bus! Let's go somewhere else.",
    'stop.allDone': 'Brilliant! You took Grandad everywhere he wanted to go. You are a super bus rider!'
  });

  // Next Stop! The places on the bus route (the map's places, drawn small).
  const STOPS = {
    rescue:      { the: 'the Rescue Station', name: 'The Rescue Station!' },
    zoo:         { the: 'the zoo', name: 'The zoo!' },
    school:      { the: 'school', name: 'School!' },
    supermarket: { the: 'the supermarket', name: 'The supermarket!' },
    shop:        { the: 'the toy shop', name: 'The toy shop!' },
    library:     { the: 'the library', name: 'The library!' },
    museum:      { the: 'the museum', name: 'The museum!' }
  };
  Object.entries(STOPS).forEach(([id, s]) => {
    L['stop.name.' + id] = s.name;
    L['stop.ring.' + id] = `Grandad wants to go to ${s.the}. Ring the bell at ${s.the}!`;
    L['stop.want.' + id] = `Not this stop. We want ${s.the}! Keep going.`;
    L['stop.at.' + id] = `Here we are at ${s.the}. Thank you, Dot!`;
  });
  for (let n = 1; n <= 5; n++) L['stop.n.' + n] = 'Stop ' + NUMS[n] + '!';
  for (let n = 2; n <= 5; n++) L['stop.num.' + n] = `Grandad wants to get off at the ${ORD[n]} stop. Count the stops, then ring the bell!`;

  // Safe or Not Safe? The pictures, what each one shows, and why.
  const SAFE = {
    hands: { safe: true,  name: "Pip holds Grandad's paw by the road.",  yes: "Safe! Hold a grown-up's hand near the road." },
    seat:  { safe: true,  name: 'Pip sits on the bus seat.',               yes: 'Safe! Sit down on the bus, so you don\'t fall when it stops.' },
    line:  { safe: true,  name: 'Pip stands behind the yellow line.',      yes: 'Safe! Always stand behind the yellow line on the platform.' },
    green: { safe: true,  name: 'Pip crosses at the green man.',           yes: 'Safe! Wait for the green man, then cross.' },
    wait:  { safe: true,  name: 'Pip waits at the bus stop.',              yes: 'Safe! Wait for the bus at the bus stop, away from the road.' },
    belt:  { safe: true,  name: 'Pip wears his seat belt.',                yes: 'Safe! Click! Always wear your seat belt.' },
    run:   { safe: false, name: 'Pip runs into the road.',                 yes: 'Not safe! Never run into the road. Stop, look and listen.' },
    stand: { safe: false, name: 'Pip stands on the bus seat.',             yes: 'Not safe! Feet on the floor, and sit nicely on the seat.' },
    edge:  { safe: false, name: 'Pip is too close to the edge of the platform.', yes: 'Not safe! Stay behind the yellow line, away from the edge.' },
    red:   { safe: false, name: 'Pip crosses at the red man.',             yes: 'Not safe! The red man means stop and wait.' },
    ball:  { safe: false, name: 'Pip chases his ball into the road.',      yes: 'Not safe! Let a grown-up get your ball back for you.' },
    lean:  { safe: false, name: 'Pip leans out of the train window.',      yes: 'Not safe! Keep your head and paws inside the train.' }
  };
  Object.entries(SAFE).forEach(([id, s]) => { L['safety.name.' + id] = s.name; L['safety.yes.' + id] = s.yes; });
  SPOT_IDS.forEach(id => {
    const n = BA.SPOTS[id].name;
    L['bus.sticker.' + id] = `You earned the ${n.toLowerCase()} sticker!`;
    L['bus.name.' + id] = n + '!';
    L['bus.find.' + id] = id === 'bell' ? 'Tap the bell button to find this sticker.' : `Tap the ${n.toLowerCase()} to find this sticker.`;
  });

  // Pip wears his guard's cap and rucksack on every bus and train screen.
  ['busstation', 'busStory', 'ticketrun', 'stationtrain', 'nextstop', 'safety'].forEach(s => { A.screenWorld[s] = 'bus'; });
  const COMMON = { world: 'bus', back: 'busstation' };

  // =====================================================================
  // All Aboard!: the story
  // =====================================================================
  const tap = (sfx, inner) => `<g class="st-tap" data-sfx="${sfx}">${inner}</g>`;
  const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  const page = (sky, inner) => `<svg viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet">${Art.defs()}
    <rect width="1200" height="660" rx="30" fill="${sky}"/>${inner}</svg>`;
  const say = (x, y, t, c = '#e53935', size = 64) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`;
  const pip = (x, y, w) => BA.pipAt(x, y, w);
  // Houses along a street, for the town pages.
  const houses = (y = 470) => [[60, '#f2c879'], [300, '#ffb3c1'], [540, '#bfe6ff'], [780, '#c8e6a0'], [1020, '#f2c879']].map(([x, c], i) => `
    <rect x="${x}" y="${y - 220 + (i % 2) * 30}" width="200" height="${220 - (i % 2) * 30}" fill="${c}" ${S}/>
    <path d="M${x - 10} ${y - 218 + (i % 2) * 30} L${x + 100} ${y - 290 + (i % 2) * 30} L${x + 210} ${y - 218 + (i % 2) * 30} Z" fill="#c95a43" ${S}/>
    <rect x="${x + 30}" y="${y - 170 + (i % 2) * 30}" width="50" height="50" rx="6" fill="#fff6cc" ${S3}/><rect x="${x + 120}" y="${y - 170 + (i % 2) * 30}" width="50" height="50" rx="6" fill="#fff6cc" ${S3}/>
    <rect x="${x + 80}" y="${y - 80}" width="44" height="80" rx="4" fill="#8b5a2b" ${S3}/>`).join('');
  const street = (y = 470) => `${Art.cloud(200, 90, .7)}${Art.cloud(900, 70, .6)}${houses(y)}
    <rect x="0" y="${y}" width="1200" height="60" fill="#c9ced8"/><path d="M0 ${y + 60} H1200" stroke="#9aa3b5" stroke-width="8"/>
    <rect x="0" y="${y + 64}" width="1200" height="${660 - y - 64}" fill="#5a606b"/><path d="M0 ${y + 120} H1200" stroke="#fff" stroke-width="6" stroke-dasharray="40 30"/>`;
  const station = `<rect width="1200" height="660" rx="30" fill="#efe6d6"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${40 + i * 200}" y="120" width="120" height="180" rx="60" fill="#bfe6ff" ${S3}/>`).join('')}
    <path d="M0 60 H1200" stroke="#c95a43" stroke-width="40"/>${BA.txt(600, 74, 30, '#fff', 'STATION')}`;
  const platformFront = (y = 520) => `<rect x="0" y="${y}" width="1200" height="${660 - y}" fill="#c9ced8"/><path d="M0 ${y + 16} H1200" stroke="#ffd21f" stroke-width="10"/>
    <path d="M0 ${y} H1200" stroke="${OL}" stroke-width="4"/>`;
  const PAGES = [
    () => page('#bfe6ff', `${street()}${tap('pop', at(920, 530, 1, BA.busStop))}
      ${tap('woof', at(620, 532, .9, BA.grandad()))}${pip(660, 360, 180)}${tap('horn', at(150, 620, .55, BA.bus()))}`),
    () => page('#bfe6ff', `${street()}${tap('doors', at(520, 640, 1.5, BA.bus({ open: true })))}
      ${tap('woof', at(840, 534, .9, BA.grandad()))}${pip(940, 380, 160)}
      <g transform="translate(1000 160)"><rect x="-60" y="-50" width="120" height="100" rx="14" fill="#fff" ${S}/><rect x="-40" y="-34" width="80" height="44" rx="6" fill="#bff0c8" ${S3}/>${BA.txt(0, 0, 22, '#1b5e20', 'BEEP!')}
        <circle cx="0" cy="30" r="9" fill="#2e9e4f" ${S3}/></g>`),
    () => page('#fff6e6', `<rect width="1200" height="660" rx="30" fill="#fff6e6"/>
      <defs><clipPath id="bus-win"><rect x="60" y="60" width="760" height="260" rx="20"/></clipPath></defs>
      <g clip-path="url(#bus-win)"><rect x="60" y="60" width="760" height="260" fill="#bfe6ff"/><g transform="translate(60 40) scale(.62)">${houses(470)}</g><rect x="60" y="300" width="760" height="24" fill="#c9ced8"/></g>
      <rect x="60" y="60" width="760" height="260" rx="20" fill="none" ${S}/><path d="M300 60 V320 M560 60 V320" stroke="${OL}" stroke-width="8"/>
      <rect x="0" y="560" width="1200" height="100" fill="#9aa3b5"/>
      ${[200, 520].map(x => BA.seat(x, 570, 2.2)).join('')}
      ${tap('woof', at(560, 600, 1.15, BA.grandad()))}
      ${tap('ding', at(960, 640, 1.6, BA.bell(true)))}${pip(250, 340, 220)}`),
    () => page('#bfe6ff', `${street(400)}${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${380 + i * 80}" y="474" width="50" height="186" fill="#fff"/>`).join('')}
      ${tap('beep', at(1040, 462, 1.1, BA.pedLight(true)))}
      ${tap('woof', at(240, 458, .9, BA.grandad()))}${pip(300, 300, 170)}
      ${say(860, 200, 'STOP', '#e53935', 54)}${say(860, 260, 'LOOK', '#1e5bd6', 54)}${say(860, 320, 'LISTEN', '#2e9e4f', 54)}`),
    () => page('#efe6d6', `${station}${platformFront(560)}
      ${tap('beep', at(820, 590, 1.6, BA.ticketMachine(true)))}
      ${tap('woof', at(330, 590, 1, BA.grandad()))}${pip(440, 400, 190)}
      <g transform="translate(1040 230) rotate(10)">${BA.ticket(1.4)}</g><g transform="translate(1060 340) rotate(-6)">${BA.ticket(1)}</g>`),
    () => page('#efe6d6', `${station}${tap('chime', at(220, 500, 1.3, BA.clock(3, 0)))}
      ${BA.track(0, 1200, 492)}<g transform="translate(1100 492)">${BA.train({ cars: 2 })}</g>${platformFront(520)}
      ${tap('whistle', at(440, 640, .95, BA.amin(true)))}
      ${tap('woof', at(760, 640, .9, BA.grandad()))}${pip(800, 470, 160)}`),
    () => page('#efe6d6', `${station}<g transform="translate(1180 470) scale(1.5)">${BA.train({ cars: 2 })}</g>${platformFront(500)}
      ${BA.txt(600, 610, 48, '#1b2233', 'MIND THE GAP')}
      ${tap('woof', at(640, 560, .8, BA.grandad()))}${pip(470, 380, 170)}
      ${tap('whistle', at(140, 640, .8, BA.amin(true)))}`),
    () => page('#bfe6ff', `${Art.cloud(180, 100, .8)}${Art.cloud(800, 70, .6)}
      <path d="M0 360 Q300 300 600 340 T1200 330 V660 H0 Z" fill="#9fd88d"/><path d="M900 660 C940 560 1000 470 1200 440 V660 Z" fill="#f6dc9a"/>
      <path d="M1040 660 C1080 560 1120 500 1200 480 V660 Z" fill="url(#water)"/>
      ${BA.track(0, 1200, 520)}${tap('toot', at(860, 520, 1.25, BA.train({ cars: 2, pip: true })))}
      ${say(300, 220, 'Toot toot!', '#e53935', 70)}`)
  ];
  Story.mount(Object.assign({ screen: 'busStory', colour: '#d6331f', cls: 'bus-story', lines: { end: 'bus.story.end' },
    tile: `<svg viewBox="-60 -60 120 120">${Story.BOOK.replace(/<\/?svg[^>]*>/g, '')}<g transform="translate(28 50) scale(.2)">${BA.bus()}</g></svg>`,
    pages: PAGES.map((art, i) => ({ art, line: 'bus.story.' + (i + 1) })) }, COMMON));

  // =====================================================================
  // Ticket Run: passengers roll out of the bus stop onto the open-top bus (not into the puddle)
  // =====================================================================
  const BR = window.BallRun, { CELL, H, W, R } = BR;
  const drawImg = (ctx, img, x, y, w, h, rot = 0) => {
    if (!img.complete || !img.naturalWidth) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  };
  const RUN_ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 L4 -8" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -34 L4 -8" stroke="#ffd21f" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(-26 -46) scale(.4)">${BA.face(0)}</g><g transform="translate(12 -18) scale(.4)">${BA.face(1)}</g>
    <g transform="translate(4 56) scale(.34)">${BA.openBus(3)}</g></svg>`;
  const runTheme = {
    board(ctx) { // a sunny street: sky, with soft clouds and buildings along the bottom
      ctx.fillStyle = '#dff3ff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      [[200, 120], [760, 90], [1180, 160]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.arc(x + 40, y - 14, 40, 0, 7); ctx.arc(x + 84, y, 32, 0, 7); ctx.fill(); });
      ctx.fillStyle = 'rgba(201,90,67,.12)';
      for (let x = 0; x < W; x += 180) ctx.fillRect(x + 20, H - 300 + (x % 360 ? 40 : 0), 140, 300);
      ctx.fillStyle = '#9aa3b5'; ctx.fillRect(0, H - 10, W, 10);
    },
    source(ctx, level, now, dripping) { // a little bus shelter at the top, with passengers peeping out
      const x = (level.hose + 0.5) * CELL, { line, poly } = BR.draw;
      [0, 1, 2].forEach(i => drawImg(ctx, BA.faceImage(level.mix ? level.mix[i % level.mix.length] : i + 2), x - 22 + i * 22, 16, 26, 26));
      poly(ctx, [{ x: x - 42, y: 24 }, { x: x + 42, y: 24 }, { x: x + 36, y: 50 }, { x: x - 36, y: 50 }], '#e53935');
      poly(ctx, [{ x: x - 14, y: 50 }, { x: x + 14, y: 50 }, { x: x + 10, y: 62 }, { x: x - 10, y: 62 }], '#1e3a7a');
      if (dripping) line(ctx, x - 9, 57, x + 9, 57, '#fff', 4);
    },
    ball(ctx, b) { drawImg(ctx, BA.faceImage(b.kind != null ? b.kind : b.idx), b.position.x, b.position.y, 2 * R + 8, 2 * R + 8, b.angle * .3); },
    kindPic(ctx, k, x, y, size) { drawImg(ctx, BA.faceImage(k), x, y, size, size); },
    goal(ctx, st) {
      const { level, fx, won, now, hits } = st, x = (level.goal + 1) * CELL;
      const bob = won ? Math.sin(now / 120) * 4 : 0, jump = fx.chew > 0 ? -Math.sin(fx.chew / 30 * Math.PI) * 6 : 0;
      drawImg(ctx, BA.openBusImage(Math.min(hits, 3), won, level.want != null ? level.want : null), x, H - 66 + bob + jump, 240, 99);
    },
    decoy(ctx, st) {
      const { level, fx } = st, x = (level.decoy + 1) * CELL + (fx.shake > 0 ? Math.sin(fx.shake * 1.2) * 6 : 0);
      drawImg(ctx, BA.puddleImage(fx.shake > 0), x, H - 37, 160, 74);
    },
    splash: '#7fb8e6',
    release() { Sfx.pop(); },
    hit(ev, fx) { Sfx.ding(); fx.chew = 30; fx.burst(ev.x, ev.y, 8, '#ffd21f', 1.2); },
    win(fx) { fx.chew = 0; Sfx.horn(); },
    tapGoal() { Sfx.horn(); },
    tapDecoy() { Sfx.splash(); },
    refuse: () => 'tickrun.no',
    intro: () => 'tickrun.want',
    winLine: () => 'tickrun.won.' + Math.floor(Math.random() * 3)
  };
  BR.mount(Object.assign({ screen: 'ticketrun', lines: 'tickrun', colour: '#f07a1a', icon: RUN_ICON, pack: BR.packs.bus, theme: runTheme, cls: 'bus-run' }, COMMON));

  // =====================================================================
  // Station Train: bus and train words in beats
  // =====================================================================
  // beats: shown on the carriages. say: how the voice is asked to say each beat ("purr" for per, "cull" for col, short "ih").
  // alone / carrier / ipa: see the Rescue Station words in js/train.js and the puppy words in js/puppies.js.
  WordTrain.packs.bus = {
    id: 'bus',
    words: [
      { id: 'ticket',    word: 'ticket',    beats: ['tick', 'et'],          say: ['tick', 'kit'],         pic: 'ticket' },
      { id: 'platform',  word: 'platform',  beats: ['plat', 'form'],        say: ['plat', 'form'],        pic: 'platform' },
      { id: 'suitcase',  word: 'suitcase',  beats: ['suit', 'case'],        say: ['soot', 'case'],        pic: 'suitcase' },
      { id: 'driver',    word: 'driver',    beats: ['dri', 'ver'],          say: ['dry', 'vuh'],          pic: 'driver' },
      { id: 'window',    word: 'window',    beats: ['win', 'dow'],          say: ['win', 'doe'],          pic: 'window' },
      { id: 'signal',    word: 'signal',    beats: ['sig', 'nal'],          say: ['sig', 'null'],         pic: 'signal' },
      { id: 'carriage',  word: 'carriage',  beats: ['car', 'riage'],        say: ['carr', 'ridge'],       pic: 'carriage' },
      { id: 'timetable', word: 'timetable', beats: ['time', 'ta', 'ble'],   say: ['time', 'tay', 'bull'], pic: 'timetable' },
      { id: 'umbrella',  word: 'umbrella',  beats: ['um', 'brel', 'la'],    say: ['um', 'brell', 'luh'],  pic: 'umbrella', alone: [0], ipa: { 0: 'ʌm' } },
      { id: 'passenger', word: 'passenger', beats: ['pas', 'sen', 'ger'],   say: ['pass', 'sin', 'jur'],  pic: 'passenger' },
      { id: 'conductor', word: 'conductor', beats: ['con', 'duc', 'tor'],   say: ['cun', 'duck', 'tuh'],  pic: 'conductor' },
      { id: 'motorway',  word: 'motorway',  beats: ['mo', 'tor', 'way'],    say: ['moe', 'tuh', 'way'],   pic: 'motorway' }
    ]
  };
  const TRAIN_TILE = `<svg viewBox="0 0 330 200"><g transform="translate(0 24) scale(.8)">${WordTrain.inner(WordTrain.ENGINE)}</g>
    <g transform="translate(200 84) scale(.62)">${WordTrain.inner(WordTrain.carSvg(2))}</g><g transform="translate(262 96) scale(.5)">${BA.ITEMS.ticket}</g></svg>`;
  WordTrain.mount(Object.assign({ screen: 'stationtrain', pack: WordTrain.packs.bus, colour: '#1e5bd6', tile: TRAIN_TILE, picture: w => BA.itemSvg(w.pic), cls: 'bus-train',
    lines: { pick: 'stationtrain.pick', done: 'stationtrain.done' } }, COMMON));

  // =====================================================================
  // Safe or Not Safe?: drag each picture to the green tick or the red cross (the sorting engine)
  // =====================================================================
  const TICK = `<svg viewBox="-64 -64 128 128"><circle r="56" fill="#2e9e4f" ${S}/><path d="M-28 2 L-8 22 L30 -20" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const CROSS = `<svg viewBox="-64 -64 128 128"><circle r="56" fill="#e53935" ${S}/><path d="M-24 -24 L24 24 M24 -24 L-24 24" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/></svg>`;
  const SAFE_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-24 -20) scale(.34)">${TICK.replace(/<\/?svg[^>]*>/g, '')}</g><g transform="translate(24 20) scale(.34)">${CROSS.replace(/<\/?svg[^>]*>/g, '')}</g></svg>`;
  const SAFE_IDS = Object.keys(SAFE).filter(id => SAFE[id].safe), NOT_IDS = Object.keys(SAFE).filter(id => !SAFE[id].safe);
  Sorter.mount(Object.assign({
    screen: 'safety', colour: '#2e9e4f', tile: SAFE_TILE, cls: 'bus-safe',
    lines: { intro: 'safety.intro', no: 'safety.no', done: 'safety.done' },
    round(level) {
      const n = [2, 3, 4][level];
      const ids = shuffle(SAFE_IDS).slice(0, n).concat(shuffle(NOT_IDS).slice(0, n));
      return {
        bins: [{ id: 'safe', art: TICK, name: 'safety.bin.safe', label: 'Safe', cls: 'safe-yes' }, { id: 'not', art: CROSS, name: 'safety.bin.not', label: 'Not safe', cls: 'safe-no' }],
        items: ids.map(id => ({ id, bin: SAFE[id].safe ? 'safe' : 'not', line: 'safety.yes.' + id, name: 'safety.name.' + id, label: SAFE[id].name, art: BA.safetySvg(id) }))
      };
    },
    onRight(binEl, it) { (it.bin === 'safe' ? Sfx.chime : Sfx.ding).call(Sfx); },
    onWrong() { Sfx.boing(); }
  }, COMMON));

  // =====================================================================
  // Next Stop!: drive the bus stop by stop, and ring the bell at the right one (a picture, or count the stops)
  // =====================================================================
  const NS = 'http://www.w3.org/2000/svg';
  const STOP_TILE = `<svg viewBox="-60 -60 120 120"><g transform="translate(-6 40) scale(.3)">${BA.bus()}</g>
    <g transform="translate(38 -24)"><circle r="20" fill="#e53935" ${S3}/>${BA.txt(0, 6, 14, '#fff', 'STOP')}</g></svg>`;
  A.addGame('nextstop', '#8e5bd6', STOP_TILE, COMMON);
  const GO_ICON = `<svg viewBox="0 0 64 64"><path d="M14 32 H46 M32 16 L48 32 L32 48" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const BELL_ICON = `<svg viewBox="-40 -40 80 80"><circle r="30" fill="#ff8a80" stroke="#fff" stroke-width="6"/>${BA.txt(0, 7, 18, '#fff', 'STOP')}</svg>`;
  const BUS_Y = 690, BUS_S = .62, DOOR = 45, POLE = 118; // the bus's door is 45 units ahead of its middle, at this size; each stop's pole is POLE right of its place
  const stopXs = n => n === 5 ? [300, 530, 760, 990, 1220] : [380, 640, 900, 1160];
  A.screens.nextstop = (arg, alive) => {
    A.ui({ home: true });
    const level = A.level('nextstop'), nStops = level === 2 ? 5 : 4;
    // Four trips: picture trips (find the place), and from level 2 trips that count the stops.
    const kinds = level === 0 ? ['pic', 'pic', 'pic', 'pic'] : ['pic', 'num', 'pic', 'num'];
    let trip = 0;
    scene().innerHTML = `<div class="ns-wrap"><svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The bus route">
      ${Art.defs()}<rect width="1600" height="900" fill="#bfe6ff"/>${Art.cloud(260, 110, .8)}${Art.cloud(1200, 80, .7)}
      <path d="M0 470 Q400 420 800 460 T1600 450 V560 H0 Z" fill="#9fd88d"/>
      <g id="places"></g>
      <rect x="0" y="548" width="1600" height="26" fill="#c9ced8"/><path d="M0 574 H1600" stroke="#9aa3b5" stroke-width="6"/>
      <rect x="0" y="576" width="1600" height="150" fill="#5a606b"/><path d="M0 650 H1600" stroke="#fff" stroke-width="6" stroke-dasharray="40 30"/>
      <rect x="0" y="726" width="1600" height="174" fill="#8fd16a"/>
      <g id="nsbus"></g></svg>
      <div class="ns-controls"><button class="big-btn ns-go" aria-label="Drive to the next stop">${GO_ICON}</button>
        <button class="big-btn ns-bell" aria-label="Ring the bell">${BELL_ICON}</button></div></div>`;
    const svg = scene().querySelector('svg'), placesG = svg.querySelector('#places'), busG = svg.querySelector('#nsbus');
    const goBtn = scene().querySelector('.ns-go'), bellBtn = scene().querySelector('.ns-bell');
    let stops = [], xs = [], at = -1, target = 0, kind = 'pic', busy = true, busX = 210;
    const drawBus = (open = false) => { busG.innerHTML = `<g transform="translate(${busX} ${BUS_Y}) scale(${BUS_S})">${BA.bus({ open, pip: true })}</g>`; };

    async function startTrip() {
      kind = kinds[trip];
      stops = shuffle(Object.keys(STOPS)).slice(0, nStops);
      xs = stopXs(nStops);
      target = kind === 'num' ? 1 + Math.floor(Math.random() * (nStops - 1)) : Math.floor(Math.random() * nStops);
      if (kind === 'pic' && level === 0 && trip === 0) target = Math.min(target, 2); // a short first trip
      at = -1; busX = 210;
      placesG.innerHTML = stops.map((id, i) => `<g class="ns-stop" data-i="${i}">
        <g transform="translate(${xs[i] - 105} 330)"><svg width="210" height="227" viewBox="-90 -185 180 195" overflow="visible">${Worlds.placeIcon(id).replace(/<\/?svg[^>]*>/g, '')}</svg></g>
        <g transform="translate(${xs[i] + POLE} 566) scale(.42)">${BA.busStop}</g>
        <g class="ns-num" opacity="0" transform="translate(${xs[i]} 280)"><circle r="34" fill="#ffd21f" ${S3}/>${BA.txt(0, 14, 40, OL, i + 1)}</g></g>`).join('');
      drawBus();
      busG.firstChild.animate([{ transform: `translate(-300px, ${BUS_Y}px) scale(${BUS_S})` }, { transform: `translate(${busX}px, ${BUS_Y}px) scale(${BUS_S})` }], { duration: 900, easing: 'ease-out' });
      Sfx.engine(1);
      await A.wait(900); if (!alive()) return;
      if (trip === 0) { await A.say('stop.intro'); if (!alive()) return; }
      await A.say(kind === 'num' ? 'stop.num.' + (target + 1) : 'stop.ring.' + stops[target]);
      if (!alive()) return;
      busy = false;
      A.Hint.set([goBtn], 'stop.hint');
    }

    goBtn.onclick = async () => {
      if (busy) return;
      if (at === target) { Sfx.boing(); A.say('stop.ringnow'); A.Hint.set([bellBtn], 'stop.ringnow', true); return; }
      if (at >= stops.length - 1) return;
      busy = true; A.Hint.clear(); Sfx.tap(); Sfx.engine(1);
      at++;
      const from = busX, to = xs[at] + POLE - DOOR - 24;
      await A.tween(1000, q => { busX = from + (to - from) * q; busG.firstChild.setAttribute('transform', `translate(${busX} ${BUS_Y}) scale(${BUS_S})`); }, A.ease);
      if (!alive()) return;
      const num = placesG.querySelector(`.ns-stop[data-i="${at}"] .ns-num`);
      if (kind === 'num') { num.setAttribute('opacity', 1); num.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); }
      await A.say(kind === 'num' ? 'stop.n.' + (at + 1) : 'stop.name.' + stops[at]);
      if (!alive()) return;
      busy = false;
      A.Hint.set([at === target ? bellBtn : goBtn], at === target ? 'stop.ringnow' : 'stop.hint');
    };

    bellBtn.onclick = async () => {
      if (busy) return;
      Sfx.ding();
      bellBtn.classList.remove('rung'); void bellBtn.offsetWidth; bellBtn.classList.add('rung');
      if (at < 0) { A.say('stop.notyet'); return; }
      if (at !== target) {
        A.Pip.mood('thinking');
        A.say(kind === 'num' ? 'stop.count' : 'stop.want.' + stops[target]);
        A.Hint.set([goBtn], 'stop.hint');
        return;
      }
      busy = true; A.Hint.clear();
      await A.wait(500); if (!alive()) return;
      Sfx.doors(); drawBus(true); A.Pip.mood('cheer'); A.Pip.act('jump');
      const placeEl = placesG.querySelector(`.ns-stop[data-i="${at}"]`);
      placeEl.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-16px)' }, { transform: 'translateY(0)' }], { duration: 500 });
      await A.say('stop.yes.' + Math.floor(Math.random() * 3)); if (!alive()) return;
      if (kind === 'pic') { await A.say('stop.at.' + stops[at]); if (!alive()) return; }
      trip++;
      if (trip < kinds.length) {
        await A.say('stop.next'); if (!alive()) return;
        Sfx.doors(); drawBus(false);
        await A.tween(800, q => { busG.firstChild.setAttribute('transform', `translate(${busX + q * 900} ${BUS_Y}) scale(${BUS_S})`); });
        if (alive()) startTrip();
        return;
      }
      A.Pip.act('dance'); A.confetti();
      await A.say('stop.allDone');
      if (alive()) A.gameDone('nextstop');
    };
    startTrip();
  };

  // =====================================================================
  // The bus stop and the station: visit six places, and pick a game
  // =====================================================================
  // The bell button is inside the bus, so it's shown in a bubble above it.
  const bubble = inner => `<circle cy="-150" r="170" fill="#fff" opacity=".9" ${S}/>${inner}`;
  const PLACE = { // all inside x 200 to 1400, so 4:3 screens show every place
    stop:   { x: 250,  y: 700, s: .8,  art: () => BA.busStop, hit: [-50, -300, 100, 310] },
    bus:    { x: 540,  y: 612, s: .8,  art: () => BA.bus({ pip: false }), hit: [-150, -230, 300, 240] },
    bell:   { x: 760,  y: 450, s: .55, art: () => bubble(BA.bell(false)), hit: [-150, -320, 300, 330] },
    ticket: { x: 960,  y: 700, s: .85, art: () => BA.ticketMachine(false), hit: [-56, -196, 112, 200] },
    clock:  { x: 1170, y: 700, s: .75, art: () => BA.clock(3, 0), hit: [-70, -340, 140, 350] },
    train:  { x: 1350, y: 700, s: .75, art: () => BA.amin(false), hit: [-60, -240, 120, 250] }
  };
  const BADGE = on => `<svg viewBox="-60 -66 120 132" class="badge-svg ${on ? 'earned' : 'locked'}">
    <path d="M0 -60 L50 -42 V6 Q50 44 0 62 Q-50 44 -50 6 V-42 Z" fill="${on ? '#d6331f' : '#d3d9e3'}" stroke="${on ? '#ffd21f' : '#c3cad6'}" stroke-width="7" stroke-linejoin="round"/>
    <circle cy="-2" r="32" fill="#fff" opacity="${on ? 1 : 0.6}"/>
    <g opacity="${on ? 1 : 0.3}" transform="translate(2 18) scale(.17)">${BA.bus()}</g><g opacity="${on ? 1 : 0.3}" transform="translate(20 -22) scale(.36) rotate(-12)">${BA.ticket()}</g>
    ${on ? `<path d="M-30 40 L0 52 L30 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<text y="48" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#8b94a6">?</text>`}</svg>`;
  const busGames = () => A.worldGames('bus');
  const badgeEarned = () => SPOT_IDS.every(id => P().bus.includes(id)) && busGames().every(g => P().games.includes(g.id));

  function homeArt() {
    const spots = SPOT_IDS.map(id => {
      const p = PLACE[id], got = P().bus.includes(id), [hx, hy, hw, hh] = p.hit;
      return `<g class="bus-spot tappable" data-s="${id}">
        <g class="spot-art" transform="translate(${p.x} ${p.y}) scale(${p.s})">${p.art()}</g>
        ${got ? `<g transform="translate(${p.x + (hx + hw - 16) * p.s} ${p.y + (hy + 20) * p.s})"><circle r="20" fill="#ffd21f" ${S3}/><path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#fff"/></g>` : ''}
        <rect x="${p.x + hx * p.s}" y="${p.y + hy * p.s}" width="${hw * p.s}" height="${hh * p.s}" fill="transparent"/>
      </g>`;
    }).join('');
    return `<svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="The bus stop and the station">
      ${Art.defs()}
      <rect width="1600" height="900" fill="#bfe6ff"/>${Art.cloud(220, 110, .8)}${Art.cloud(640, 70, .6)}
      ${[[-20, '#f2c879'], [200, '#ffb3c1'], [420, '#c8e6a0']].map(([x, c], i) => `<rect x="${x}" y="${190 + i * 20}" width="210" height="${290 - i * 20}" fill="${c}" ${S}/>
        <rect x="${x + 30}" y="${240 + i * 20}" width="56" height="56" rx="6" fill="#fff6cc" ${S3}/><rect x="${x + 124}" y="${240 + i * 20}" width="56" height="56" rx="6" fill="#fff6cc" ${S3}/>`).join('')}
      <!-- the station building -->
      <rect x="800" y="150" width="820" height="320" fill="#efe6d6" ${S}/>
      ${[0, 1, 2, 3].map(i => `<rect x="${860 + i * 190}" y="210" width="110" height="150" rx="55" fill="#bfe6ff" ${S3}/>`).join('')}
      <rect x="800" y="110" width="820" height="60" fill="#c95a43" ${S}/>${BA.txt(1210, 154, 40, '#fff', 'STATION')}
      <!-- the road and pavement on the left, the track and platform on the right -->
      <rect x="0" y="470" width="820" height="150" fill="#5a606b"/><path d="M0 545 H820" stroke="#fff" stroke-width="6" stroke-dasharray="40 30"/>
      <rect x="0" y="620" width="820" height="280" fill="#c9ced8"/><path d="M0 620 H820" stroke="#9aa3b5" stroke-width="10"/>
      <rect x="800" y="440" width="820" height="90" fill="#d9d2c3"/>
      ${BA.track(800, 1600, 520)}
      <g class="bus-train-bg tappable" transform="translate(1000 520) scale(-.72 .72)">${BA.train({ cars: 3 })}</g>
      <rect x="800" y="538" width="820" height="362" fill="#c9ced8" ${S}/><path d="M800 556 H1600" stroke="#ffd21f" stroke-width="10"/>
      <g class="bus-grandad tappable"><g transform="translate(370 704) scale(.7)">${BA.grandad()}</g><rect x="320" y="500" width="120" height="205" fill="transparent"/></g>
      <path d="M700 450 Q620 420 600 440" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round"/>
      ${spots}
    </svg>`;
  }

  // A sticker for each thing at the stop and the station, given the first time the child visits it.
  function spotSticker(id) {
    return new Promise(resolve => {
      P().bus.push(id); A.saveProgress();
      Sfx.fanfare(); A.confetti();
      A.openModal(`
        <div class="card reward" role="dialog" aria-label="${BA.SPOTS[id].name} sticker">
          <button class="close" aria-label="Close">${A.ICON.close}</button>
          <h2>${BA.SPOTS[id].name} sticker!</h2>
          <div class="sticker-big">${BA.sticker(id, true)}</div>
        </div>`, resolve);
      A.say('bus.sticker.' + id);
    });
  }
  function checkBadge() {
    if (!badgeEarned() || P().badges.includes('bus')) return;
    P().badges.push('bus'); A.saveProgress();
    Sfx.fanfare(); A.confetti();
    A.openModal(`
      <div class="card reward" role="dialog" aria-label="Happy Traveller badge">
        <button class="close" aria-label="Close">${A.ICON.close}</button>
        <h2>Happy Traveller badge!</h2>
        <div class="sticker-big">${BADGE(true).replace('class="badge-svg', 'class="badge-svg big')}</div>
      </div>`);
    A.say('bus.badge');
  }

  // What changes while a place is talking: the bus doors open, the bell lights up, a ticket prints, Mr Amin waves his flag.
  const LIVE = { bus: () => BA.bus({ open: true }), bell: () => bubble(BA.bell(true)), ticket: () => BA.ticketMachine(true), train: () => BA.amin(true) };
  let welcomed = false;
  A.screens.busstation = (arg, alive) => {
    scene().innerHTML = `<div class="bus-home">${homeArt()}
      <div class="world-tiles">${busGames().map((g, i) => `<button class="game-tile" data-g="${g.id}" style="--tile:${g.colour};animation-delay:${i * .06}s" aria-label="${g.title}">
        <span class="art">${g.art}</span><span class="label">${g.title}</span>${P().games.includes(g.id) ? '<span class="got-star" aria-hidden="true">★</span>' : ''}</button>`).join('')}</div></div>`;
    A.ui({ stickers: true, grownups: true, map: true });
    const root = scene().querySelector('.bus-home');
    root.querySelectorAll('.game-tile').forEach(b => b.onclick = () => { Sfx.pop(); A.go(b.dataset.g); });
    let busy = false;
    root.querySelector('.bus-grandad').addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear(); Sfx.woof();
      await A.say('bus.grandad');
      if (alive()) busy = false;
    });
    root.querySelector('.bus-train-bg').addEventListener('click', () => root.querySelector('.bus-spot[data-s="train"]').dispatchEvent(new Event('click')));
    root.querySelectorAll('.bus-spot').forEach(spot => spot.addEventListener('click', async () => {
      if (busy) return;
      busy = true; A.Hint.clear();
      const id = spot.dataset.s, art = spot.querySelector('.spot-art');
      art.classList.remove('bounce'); void art.getBoundingClientRect(); art.classList.add('bounce');
      if (LIVE[id]) art.innerHTML = LIVE[id]();
      sound(id); if (id === 'bus') Sfx.doors();
      await A.say('bus.fact.' + id);
      if (!alive()) return;
      if (LIVE[id]) art.innerHTML = PLACE[id].art();
      if (!P().bus.includes(id)) {
        await spotSticker(id);
        if (!alive()) return;
        A.screens.busstation('again', alive); // redraw with the new star
        A.later(checkBadge, 600);
        return;
      }
      busy = false;
    }));
    if (arg === 'again') return;
    A.Hint.set([root.querySelector('.bus-spot[data-s="bus"]')], 'bus.hint');
    if (!welcomed) { welcomed = true; A.say('bus.welcome'); } else A.say('bus.back');
    A.later(() => { if (alive() && !A.isModalOpen()) checkBadge(); }, 2200);
  };

  // ---------- The bus and train page in the sticker book, and its badge ----------
  Rewards.pages.bus = () => ({
    html: SPOT_IDS.map(id => `<button data-kind="bt" data-id="${id}" aria-label="${BA.SPOTS[id].name}">${BA.sticker(id, P().bus.includes(id))}<span>${P().bus.includes(id) ? BA.SPOTS[id].name : '?'}</span></button>`).join('')
      + busGames().map(g => `<button data-kind="g" data-id="${g.id}" aria-label="${g.title}">${A.gameSticker(g, P().games.includes(g.id))}<span>${P().games.includes(g.id) ? g.title : '?'}</span></button>`).join(''),
    tap(kind, id) {
      if (kind !== 'bt') return false;
      if (P().bus.includes(id)) { Sfx.sparkle(); A.say('bus.name.' + id); }
      else { Sfx.boing(); A.say('bus.find.' + id); }
      return true;
    }
  });
  Rewards.extraBadges.push({ id: 'bus', name: 'Happy Traveller', svg: BADGE, earned: () => P().badges.includes('bus') || badgeEarned(), how: 'bus.badge.how' });

  window.BusTrain = { SPOT_IDS, BADGE, badgeEarned, SAFE, STOPS };
})();
