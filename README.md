# To the Rescue! 🚒🚑🚓

A free, ad-free emergency vehicles app for children aged 4 to 6. Pip the rescue pup shows children 9 rescue vehicles, each with a short mission to play. There are also 10 games, a sticker book, team badges and a Rescue Cadet certificate. Everything is read aloud, and the app works fully offline once it is installed.

## ▶️ Play it now

**[Open To the Rescue! in your browser](https://richardbrb9-coder.github.io/Emergency-Vehicles/)**

## 📲 Install it on an Android tablet

1. On the tablet, open the link above in **Chrome**.
2. Tap the red play button once. This lets the app finish saving itself for offline use, which takes a few seconds.
3. Install it in either of these ways:
   - tap **Install** if Chrome offers it, or
   - open the **⋮** menu and choose **Add to Home screen** or **Install app**.
4. Open the app from its new icon on the home screen. It runs full screen and sideways, and needs no internet from then on.

The grown-ups area also has an **Install app** button when the tablet supports it. To open the grown-ups area, press and hold the bottom-right button for 3 seconds.

> **Narrator voice offline:** the narrator uses the tablet's own text-to-speech voice. To make sure it talks without the internet, go to **Settings → Accessibility (or System) → Text-to-speech**, choose **Speech Services by Google**, and download the **English (United Kingdom)** voice.

On iPad, open the link in Safari, tap **Share**, then **Add to Home Screen**.

## What's inside

- **9 vehicles**, each with tappable parts and a 999 mission:
  - Fire Engine
  - Ambulance
  - Police Car
  - Rotator Tow Truck
  - Track Medical Car
  - Air Ambulance
  - Helitack Helicopter
  - Lifeboat
  - Hovercraft
- **10 games:**
  - Match the Gear
  - Action Stations
  - Call 999
  - Count the Convoy
  - Look Closer
  - Rescue Maze
  - What's That Sound?
  - Jigsaw
  - Colouring
  - Build a Vehicle
- **Rewards:**
  - 19 stickers
  - 6 team badges
  - a Word Book of red words
  - My Pictures for saved colouring pages
  - a Rescue Cadet certificate with the child's name
- **Grown-ups area:**
  - turn sound effects, the voice and words on screen on or off
  - calm mode, with softer lights and sirens
  - set the child's name for the certificate
  - install the app
  - reset progress

Progress is saved on the device only. There are no ads, purchases, tracking or timers.

## For developers

The app is plain HTML, CSS and JavaScript, with no build step. All artwork is drawn in code as SVG, and the sound effects are made by the browser.

| File | What it does |
|---|---|
| `index.html` | The page, edge buttons and start screen |
| `manifest.webmanifest`, `sw.js` | Installable PWA and offline cache |
| `js/content.js` | All words, vehicles and voice lines |
| `js/art.js` | Hub, fire engine scene, Pip and stickers |
| `js/audio.js` | Sound effects and the narrator voice |
| `js/app.js` | Router, fire engine, stickers, settings and shared toolkit |
| `js/vehicles2.js`, `js/vehicles3.js` | The other eight vehicles |
| `js/match.js`, `js/games.js`, `js/games4.js`, `js/games5.js` | The ten games |
| `js/rewards.js` | Sticker book tabs, badges, Word Book and certificate |
| `fonts/` | Andika and Fredoka, bundled for offline use (SIL Open Font License) |
| `docs/` | Style guide and image prompts |

To run it locally, serve the folder over HTTP (for example with `python3 -m http.server`) and open `http://localhost:8000`. Service workers do not run from `file://`.

**When you change any file,** bump `VERSION` in `sw.js`. Installed tablets then pick up the new version the next time they open the app while online. Add any new file to the `FILES` list in `sw.js` too.

**Recorded voice:** to use recordings instead of the device voice:
1. Save one mp3 per line in `audio/voice/`, named by its line id (for example `hub.welcome.mp3`).
2. List each file in `voiceFiles` in `js/content.js`.
3. Add the files to `FILES` in `sw.js`.

## Build history

### What's in Phase 1
- Rescue Station hub with 9 numbered doors. Door 1 (fire engine) is built; the others say the crew is out on a rescue.
- Fire engine on Maple Street: explore 9 tappable parts, then answer the 999 call and complete the mission (hydrant, put out 3 fires, rescue the kitten with the ladder).
- Red words: hydrant and nozzle. Sticker reward and sticker book.
- Pip the rescue pup reads everything aloud with follow-along words. Repeat button top right.
- Grown-ups area: press and hold the bottom-right button for 3 seconds.

### What's in Phase 2
- Doors 4, 5, 7 and 9 now open: Rotator Tow Truck (motorway), Track Medical Car (race circuit), Helitack Helicopter (forest fire) and Hovercraft (muddy beach). Each has tappable parts and a 999 mission.
- New red words: circuit, hovercraft, crane, winch, helitack, wildfire.
- Match the Gear (green puzzle button on the station): drag each tool to its vehicle, or tap a tool and then a vehicle.

### What's in Phase 3
- All 9 doors now open. New: Ambulance (park, Mia falls off her bike), Police Car (the fair, find Leo's lost teddy), Air Ambulance (hospital helipad, rescue Jim on the hills) and RNLI-style Lifeboat (slipway launch, rescue two sailors).
- New red words: paramedic, stretcher, patrol, radio, helipad, medevac, lifeboat, lifejacket.
- The green puzzle button now opens a games menu with three games:
  - Match the Gear
  - Action Stations: put Sam's kit on in the right order (boots, trousers, jacket, helmet), then slide down the pole.
  - Call 999: dial nine nine nine on a pretend phone, then pick the right service for each picture (fire, hurt girl, lost boy). It reminds children to call only in a real emergency.

### What's in Phase 4
- The games menu now has 10 games. The 7 new ones are Count the Convoy, Look Closer, Rescue Maze, What's That Sound?, Jigsaw, Colouring and Build a Vehicle. Each game gets a little harder each time it is finished.
- Every game earns a sticker the first time it is finished, so there are 19 stickers in all.
- The sticker book has four tabs: Stickers, Badges, Word Book (every red word found, tap to hear it) and My Pictures (saved colouring pages).
- There are six team badges: Fire, Medical, Police, Sea, Air and Special Rescue. New badges are shown when the child returns to the station.
- Earning all six badges unlocks the Rescue Cadet certificate. A grown-up can type the child's first name in the grown-ups area.
- Everything saves on the device. The grown-ups reset clears stickers, words, badges and pictures.

### What's in Phase 5
- Installable PWA with an icon, which runs full screen and sideways.
- Works fully offline: every file and font is cached on the device.
- Install button and offline status in the grown-ups area.
- Goes full screen and keeps the screen awake while playing on a tablet.
