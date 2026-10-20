// All words, vehicles and voice lines live here, so new content doesn't need code changes.
// Every spoken line has an id. If a recorded file exists for that id, list it in voiceFiles
// (e.g. 'hub.welcome': 'audio/voice/hub.welcome.mp3') and it plays instead of the device voice.
window.CONTENT = {
  vehicles: [
    { id: 'fire',      name: 'Fire Engine',          door: 1, area: 'ground', colour: '#e53935', built: true },
    { id: 'ambulance', name: 'Ambulance',            door: 2, area: 'ground', colour: '#2e9e4f', built: false },
    { id: 'police',    name: 'Police Car',           door: 3, area: 'ground', colour: '#1e5bd6', built: false },
    { id: 'tow',       name: 'Rotator Tow Truck',    door: 4, area: 'ground', colour: '#f2b705', built: false },
    { id: 'medical',   name: 'Track Medical Car',    door: 5, area: 'ground', colour: '#8e5bd6', built: false },
    { id: 'airamb',    name: 'Air Ambulance',        door: 6, area: 'roof',   colour: '#2e9e4f', built: false },
    { id: 'helitack',  name: 'Helitack Helicopter',  door: 7, area: 'roof',   colour: '#f07a1a', built: false },
    { id: 'lifeboat',  name: 'Lifeboat',             door: 8, area: 'boat',   colour: '#1b3f8f', built: false },
    { id: 'hover',     name: 'Hovercraft',           door: 9, area: 'boat',   colour: '#f07a1a', built: false }
  ],

  words: {
    hydrant: {
      word: 'hydrant', say: 'hy - drant',
      meaning: 'A big pipe in the street. Firefighters join their hose to it to get lots of water.'
    },
    nozzle: {
      word: 'nozzle', say: 'noz - zle',
      meaning: 'The end of the hose. It makes the water squirt out in a strong spray.'
    }
  },

  lines: {
    'start.title':     'To the Rescue!',
    'hub.welcome':     "Welcome to the Rescue Station! I'm Pip. Tap a door to see which rescue vehicle is inside!",
    'hub.pip':         "Woof! I'm Pip, the station pup. Every door has a number. Can you find door number one?",
    'hub.hint':        'Tap a door to open it!',
    'hub.away':        'The {name} crew is out on a rescue right now. They will be back soon!',
    'hub.sun':         'Good morning, sunshine!',
    'hub.flag':        'Our flag is flapping in the wind!',
    'hub.windowCat':   'Meow! Even the station cat wants to help.',

    'fire.arrive':     'Here comes the fire engine! Tap any part to find out what it does.',
    'fire.lights':     'Blue flashing lights tell everyone: make way, we are coming!',
    'fire.siren':      'Nee naw, nee naw! The siren is loud so cars can hear us coming.',
    'fire.ladder':     'The long ladder stretches up high to reach top windows and roofs.',
    'fire.ladderDown': 'Ladder down, nice and tidy.',
    'fire.lockerHose': 'This locker holds the hose reel. The hose is very, very long!',
    'fire.lockerAxe':  'Tools for breaking through doors, kept safe in the locker.',
    'fire.lockerHelmets': 'Spare helmets and torches for the crew.',
    'fire.wheels':     'Big strong wheels carry the heavy water tank and all the tools.',
    'fire.cab':        'The crew sit in the cab. There are seats for six firefighters!',
    'fire.sam':        "Hello! I'm Sam, a firefighter. My helmet and jacket keep me safe from heat and smoke.",
    'fire.hydrant':    'That is a fire hydrant.',
    'fire.house':      'This is Maple Street. Everyone is safe and sound... for now!',
    'fire.phoneHint':  'The phone is ringing! Tap it to answer the emergency call.',

    'fire.m.call':     'Emergency! Someone called nine nine nine. There is a fire at the house on Maple Street!',
    'fire.m.hydrant':  'We need lots of water. Tap the fire hydrant to join up the hose!',
    'fire.m.hosed':    'The hose is connected. Water is on its way!',
    'fire.m.spray':    'Now tap the flames to spray water on them!',
    'fire.m.sprayHint':'Tap the flames! Splash them with water!',
    'fire.m.more':     'Keep going! You are doing great.',
    'fire.m.out':      'Hooray! The fire is out!',
    'fire.m.meow':     'Listen! Who is that? A kitten is stuck on the roof!',
    'fire.m.ladder':   'Tap the ladder to reach the kitten!',
    'fire.m.saved':    'The kitten is safe! Well done, firefighter!',
    'fire.m.sticker':  'You earned the Fire Engine sticker!',

    'stickers.title':  'My Sticker Book',
    'stickers.count':  'You have {n} {stickers}. Can you collect them all?',
    'stickers.none':   'Your sticker book is empty. Finish a rescue to win a sticker!',

    'grownups.hold':   'Grown-ups: press and hold'
  },

  // Recorded voice files go here once they exist. Empty means the device voice reads every line.
  voiceFiles: {}
};

// ---------- Phase 2: the four special rescue vehicles ----------
['medical', 'hover', 'tow', 'helitack'].forEach(id => { window.CONTENT.vehicles.find(v => v.id === id).built = true; });

Object.assign(window.CONTENT.words, {
  circuit:   { word: 'circuit', say: 'cir - cuit', meaning: 'A special road that goes round and round, where racing cars race.' },
  hovercraft:{ word: 'hovercraft', say: 'hov - er - craft', meaning: 'A vehicle that floats on a cushion of air, so it can glide over mud, sand and water.' },
  winch:     { word: 'winch', say: 'winch', meaning: 'A strong machine that winds up a steel rope to pull or lift heavy things.' },
  crane:     { word: 'crane', say: 'crane', meaning: 'A long arm that reaches up high and lifts heavy things with a hook.' },
  helitack:  { word: 'helitack', say: 'heli - tack', meaning: 'Firefighters who use a helicopter to fight fires in forests and hills.' },
  wildfire:  { word: 'wildfire', say: 'wild - fire', meaning: 'A big fire in a forest or on a hill, where fire engines can not drive.' }
});

Object.assign(window.CONTENT.lines, {
  'common.phone':     'The phone is ringing! Tap it to answer the emergency call.',

  'medical.arrive':   'This is the Track Medical Car. It waits by the race circuit, ready to help. Tap any part!',
  'medical.lights':   'Blue and orange lights mean: medical car coming through!',
  'medical.bonnet':   'Vroom! A super fast engine, so the doctor can reach drivers in seconds.',
  'medical.boot':     "The boot holds the doctor's bag, full of bandages and medicine.",
  'medical.doctor':   "Hi! I'm Doctor Asha. I wear a fireproof suit and a helmet, just like the racing drivers.",
  'medical.racecar':  'Racing cars go super fast round and round the track.',
  'medical.crowd':    'Hooray! The crowd is cheering for the drivers.',
  'medical.track':    'This is the race circuit.',
  'medical.m.call':   'Oh no! A racing car has spun off the track. The driver needs a check up!',
  'medical.m.drive':  'Tap the medical car to race to help!',
  'medical.m.bag':    "Tap the boot to get the doctor's bag.",
  'medical.m.check':  'Now tap the driver so Doctor Asha can check they are okay.',
  'medical.m.ok':     'Thumbs up! The driver is fine. Great job!',

  'hover.arrive':     'Here is the rescue hovercraft, on a muddy beach. Tap any part!',
  'hover.fan':        'Whoosh! The giant fan pushes the hovercraft along.',
  'hover.skirt':      'The black skirt fills with air. The hovercraft floats on a cushion of air!',
  'hover.pilot':      "Hello! I'm Captain Ben. Hold on tight, we're on our way!",
  'hover.horn':       'Parp parp! The horn tells everyone we are coming.',
  'hover.ring':       'A life ring. We throw it to people who need help.',
  'hover.jo':         'That is Jo, out for a walk on the beach.',
  'hover.mud':        'Squelch! Boats can not sail on mud, and people sink in it.',
  'hover.m.call':     'Help! Jo is stuck in the sticky mud. A boat can not get there, but a hovercraft can!',
  'hover.m.fan':      'Tap the big fan to start the hovercraft.',
  'hover.m.go':       'We are floating! Tap the arrow to glide over the mud.',
  'hover.m.ring':     'Throw the life ring to Jo! Tap the life ring.',
  'hover.m.saved':    'Pull! Jo is out of the mud and safe. Well done!',

  'tow.arrive':       'This is the Rotator Tow Truck, the strongest truck on the road. Tap any part!',
  'tow.lights':       'Orange flashing lights warn drivers to slow down.',
  'tow.boom':         'The crane arm can turn all the way round and reach far away.',
  'tow.boomDown':     'Crane arm down, nice and safe.',
  'tow.winch':        'The winch winds up a strong steel rope.',
  'tow.legs':         'The legs push down on the road, so the truck does not tip over.',
  'tow.legsUp':       'Legs up, ready to drive.',
  'tow.cab':          "Beep beep! I'm Mo, the tow truck driver.",
  'tow.lorry':        'That lorry has slipped off the road into the ditch!',
  'tow.m.call':       'Emergency! A big lorry has slid into the ditch. Only a super strong truck can lift it.',
  'tow.m.legs':       'First, tap the legs to hold the truck steady.',
  'tow.m.boom':       'Now tap the crane arm to reach the lorry.',
  'tow.m.hooked':     'The hook is on!',
  'tow.m.winch':      'Tap the winch to lift the lorry.',
  'tow.m.saved':      'Up it comes! The lorry is back on the road. Brilliant!',

  'helitack.arrive':  'This is the helitack helicopter. It fights fires from the sky! Tap any part.',
  'helitack.rotor':   'Chop chop chop! The spinning blades lift the helicopter into the air.',
  'helitack.bucket':  'A giant bucket. It can carry as much water as a swimming pool... well, a paddling pool!',
  'helitack.door':    'The helitack crew can slide down ropes to reach fires deep in the forest.',
  'helitack.pilot':   "Hello! I'm Captain Lena. I fly the helicopter.",
  'helitack.lake':    'Splash! The lake is full of water.',
  'helitack.trees':   'A big green forest, full of animals.',
  'helitack.m.call':  'Fire on the hill! Fire engines can not drive up there. Time for the helitack crew!',
  'helitack.m.rotor': 'Tap the rotor blades to take off!',
  'helitack.m.lake':  'Fill the bucket! Tap the lake.',
  'helitack.m.fires': 'Now tap each fire to drop the water!',
  'helitack.m.saved': 'The fire is out and the forest is safe. Amazing!',

  'match.intro':      'Match the gear! Drag each tool to the vehicle that uses it.',
  'match.yes':        'Yes! The {vehicle} uses the {tool}.',
  'match.no':         'Nearly! Try another one.',
  'match.done':       'You matched them all! You are a gear expert!',
  'hub.games':        "Let's play Match the Gear!"
});

// ---------- Phase 3: the everyday rescue vehicles and two new games ----------
['ambulance', 'police', 'airamb', 'lifeboat'].forEach(id => { window.CONTENT.vehicles.find(v => v.id === id).built = true; });

Object.assign(window.CONTENT.words, {
  paramedic: { word: 'paramedic', say: 'pa - ra - med - ic', meaning: 'Someone who drives an ambulance and is trained to help people who are hurt or poorly.' },
  stretcher: { word: 'stretcher', say: 'stretch - er', meaning: 'A bed with wheels or handles, for carrying someone who can not walk.' },
  patrol:    { word: 'patrol', say: 'pa - trol', meaning: 'Going round and round an area to check that everyone is safe.' },
  radio:     { word: 'radio', say: 'ray - dee - oh', meaning: 'A machine for talking to people far away. Police officers use radios to talk to each other.' },
  helipad:   { word: 'helipad', say: 'heli - pad', meaning: 'A flat place with a big letter H, where helicopters land.' },
  medevac:   { word: 'medevac', say: 'med - ee - vac', meaning: 'Taking a poorly or hurt person to hospital very quickly, often by helicopter.' },
  lifeboat:  { word: 'lifeboat', say: 'life - boat', meaning: 'A strong, fast boat that rescues people at sea.' },
  lifejacket:{ word: 'life jacket', say: 'life - jack - et', meaning: 'A puffy jacket that helps you float in water.' }
});

Object.assign(window.CONTENT.lines, {
  'ambulance.arrive':  'Here is the ambulance, ready to help anyone who is hurt or poorly. Tap any part!',
  'ambulance.lights':  'Blue lights flash so everyone can see the ambulance coming.',
  'ambulance.siren':   'Wee-ooo, wee-ooo! The ambulance siren goes up and down.',
  'ambulance.doors':   'The back doors open wide. Inside there is a stretcher and lots of medical kit.',
  'ambulance.cab':     'The word AMBULANCE is written backwards on the front, so drivers can read it in their mirror!',
  'ambulance.kai':     "Hi! I'm Kai, a paramedic. I help people who are hurt or poorly.",
  'ambulance.swings':  'Whee! The swings in the park.',
  'ambulance.mia':     "That's Mia, riding her bike in the park.",
  'ambulance.m.call':  'Oh dear! Mia fell off her bike and hurt her knee. Someone called nine nine nine.',
  'ambulance.m.drive': 'Tap the ambulance to drive to Mia!',
  'ambulance.m.doors': 'Tap the back doors to get the medical kit.',
  'ambulance.m.mia':   'Now tap Mia so Kai can clean her knee and put on a plaster.',
  'ambulance.m.saved': 'All better! Mia is smiling again. Thank you, Kai!',

  'police.arrive':     'Here comes the police car, on patrol at the fair. Tap any part!',
  'police.lights':     'Blue lights on the roof. They flash when there is an emergency.',
  'police.siren':      'Woo woo woo! The police siren is fast and loud.',
  'police.radio':      'The police radio lets officers talk to each other.',
  'police.officer':    "Hello! I'm Officer Priya. My job is to keep everyone safe. If you are ever lost, find a police officer.",
  'police.wheel':      'Look! The big wheel goes round and round.',
  'police.carousel':   'The merry-go-round plays music!',
  'police.leo':        "That's Leo. He's having fun at the fair.",
  'police.van':        'An ice cream van! Yum.',
  'police.cart':       'Lots of colourful balloons.',
  'police.hedge':      'A big green hedge.',
  'police.m.call':     'Oh no! Leo has lost his teddy bear at the fair. Officer Priya will help!',
  'police.m.radio':    'Tap the radio to ask the other officers to look out for teddy.',
  'police.m.search':   'Where could teddy be? Tap the places to look!',
  'police.m.notHere':  'Not here. Keep looking!',
  'police.m.found':    'You found teddy!',
  'police.m.leo':      'Tap Leo to give him his teddy back.',
  'police.m.saved':    'Leo and teddy are together again. Well done, detective!',

  'airamb.arrive':     'This is the air ambulance. It flies poorly and hurt people to hospital super fast. Tap any part!',
  'airamb.rotor':      'Whirr! The rotor blades spin to lift us into the sky.',
  'airamb.pilot':      "Hi! I'm Captain Zara. I fly the air ambulance.",
  'airamb.door':      'Inside there is a doctor and a stretcher.',
  'airamb.hospital':   'This is the hospital. The helipad is on the roof!',
  'airamb.windsock':   'The windsock shows which way the wind is blowing.',
  'airamb.hills':      'Big green hills. Roads can not reach the top.',
  'airamb.m.call':     'Emergency! Jim has hurt his ankle on top of the hill. No road goes up there!',
  'airamb.m.rotor':    'Tap the rotor blades to take off!',
  'airamb.m.land':     'Tap the field next to Jim to land.',
  'airamb.m.jim':      'Tap Jim to help him onto the stretcher.',
  'airamb.m.back':     'Now fly to hospital! Tap the helipad on the roof.',
  'airamb.m.saved':    'Jim is at the hospital, safe and sound. Brilliant flying!',

  'lifeboat.arrive':   'This is the lifeboat station. The lifeboat waits on the slipway, ready to go. Tap any part!',
  'lifeboat.horn':     'Hoooonk! The horn warns other boats.',
  'lifeboat.light':    'A blue light on the mast flashes at sea.',
  'lifeboat.radar':    'The radar spins round to find boats, even in fog.',
  'lifeboat.crew':     "Ahoy! I'm Ola. Lifeboat crews are very brave volunteers.",
  'lifeboat.jackets':  'A box full of life jackets.',
  'lifeboat.gull':     'Squawk! A seagull.',
  'lifeboat.m.call':   'Mayday! A little sailing boat has tipped over. Two sailors are in the water!',
  'lifeboat.m.launch': 'Tap the lifeboat to launch it down the slipway!',
  'lifeboat.m.jackets':'Tap each sailor to throw them a life jacket.',
  'lifeboat.m.pull':   'Now tap the lifeboat to go and pick them up.',
  'lifeboat.m.saved':  'Both sailors are safe on the lifeboat. Hooray for the crew!',

  'games.title':       'Pick a game to play!',
  'games.match':       'Match the Gear',
  'games.dress':       'Action Stations',
  'games.call':        'Call 999',

  'dress.intro':       'Action stations! The alarm is ringing. Help Sam put on the fire kit. Boots first!',
  'dress.next':        'Now the {item}!',
  'dress.wrong':       'Not yet! First the {item}.',
  'dress.pole':        'All dressed! Tap the pole to slide down to the fire engine.',
  'dress.done':        'Whoosh! Sam is ready in record time!',

  'call.intro':        "Let's practise calling for help. Only call nine nine nine in a real emergency. Tap nine, nine, nine.",
  'call.again':        'Tap nine, nine, nine.',
  'call.which':        'Emergency. Which service do you need? Look at the picture!',
  'call.yes':          'That is right! The {service} is on the way.',
  'call.no':           'Hmm. Look at the picture again.',
  'call.where':        'Where are you? Grown-ups can help you learn your address.',
  'call.done':         'Well done! You know how to call for help. Remember: only in a real emergency.'
});

// ---------- Phase 4: more games, badges, Word Book and certificate ----------
Object.assign(window.CONTENT.lines, {
  'games.count':       'Count the Convoy',
  'games.closer':      'Look Closer',
  'games.maze':        'Rescue Maze',
  'games.sound':       "What's That Sound?",
  'games.jigsaw':      'Jigsaw',
  'games.colour':      'Colouring',
  'games.build':       'Build a Vehicle',

  'count.intro':       'Here comes the convoy! Tap each vehicle to count it.',
  'count.more':        'Keep counting! Tap the vehicles without a number.',
  'count.how':         'How many vehicles are there?',
  'count.yes':         'Yes! {n} vehicles. Off they go!',
  'count.no':          'Look at the last number you counted.',
  'count.done':        'Brilliant counting!',

  'closer.intro':      'Look closer! What vehicle is hiding in the picture?',
  'closer.yes':        "Yes! It's the {name}!",
  'closer.no':         'Not that one. Keep looking!',
  'closer.done':       'You have super sharp eyes!',

  'maze.intro':        'Someone needs help! Drive the {vehicle} along the road to get there.',
  'maze.hint':         'Drag the {vehicle} along the grey road.',
  'maze.yes':          'You made it! Help has arrived.',
  'maze.done':         'Every rescue done. Great driving!',

  'sound.intro':       'Listen carefully! Tap the vehicle that makes this sound.',
  'sound.again':       'Tap the big speaker to hear it again.',
  'sound.no':          'Not that one. Listen again!',
  'sound.fire':        'Nee naw, nee naw! That is the fire engine siren.',
  'sound.ambulance':   'Wee-oo, wee-oo! The ambulance siren goes up and down.',
  'sound.police':      'Yip yip yip! The police car siren is quick and fast.',
  'sound.airamb':      'Chop chop chop! That is the helicopter blades spinning.',
  'sound.lifeboat':    'Hoooonk! The lifeboat horn is very deep.',
  'sound.tow':         'Clank clank! The tow truck winch is pulling a chain.',
  'sound.done':        'Super listening!',

  'jigsaw.pick':       'Pick a picture to make a jigsaw.',
  'jigsaw.intro':      'Drag each piece to the right place.',
  'jigsaw.yes':        'It fits!',
  'jigsaw.done':       'You finished the jigsaw! It is the {name}.',

  'colour.pick':       'Pick a picture to colour in.',
  'colour.intro':      'Choose a colour, then tap the picture to fill it in.',
  'colour.saved':      'What a beautiful picture! It is saved in your sticker book.',

  'build.body':        'Let us build a rescue vehicle! First, pick a shape.',
  'build.colour':      'Now pick a colour.',
  'build.wheels':      'Pick some wheels.',
  'build.lights':      'Pick the lights.',
  'build.extra':       'Last one! Pick something special to add.',
  'build.go':          'All built! Tap go to drive it.',
  'build.done':        'Wow! What an amazing rescue vehicle!',

  'book.stickers':     'Stickers',
  'book.badges':       'Badges',
  'book.words':        'Word Book',
  'book.pictures':     'My Pictures',
  'book.badgesIntro':  'Finish rescues to earn a badge for each team.',
  'book.wordsIntro':   'Here are all the red words you have learned. Tap one to hear it.',
  'book.wordsNone':    'No red words yet. You will find them on the rescues!',
  'book.picsNone':     'Colour in a picture and it will appear here.',
  'badge.new':         'You earned the {badge} badge!',
  'badge.locked':      'To earn this badge: {how}.',
  'cert.ready':        'Congratulations, Rescue Cadet {name}! You earned every badge!',
  'cert.title':        'Rescue Cadet certificate'
});
