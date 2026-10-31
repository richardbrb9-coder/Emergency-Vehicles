// Makes Pip's World voice clips with Google Cloud Text-to-Speech.
//
//   GOOGLE_TTS_API_KEY=... node tools/make-voice.mjs [--only map.] [--voice en-GB-Chirp3-HD-Aoede] [--force]
//
// It opens the app in a headless browser to read every line in CONTENT.lines, skips lines with {vars}
// (those stay on the device voice), and saves each clip as audio/voice/<line id>.mp3. Clips that already
// exist are kept unless --force is given. Then it rewrites js/voice.js (the list of clips the app plays)
// and bumps VERSION in sw.js so installed apps pick the new clips up.
//
// Word Train beats: each word in WordTrain.packs is said beat by beat with long pauses ("lad [pause long] duh"),
// then cut at the pauses into audio/voice/syl.<word>.<n>.mp3. A voice says a lone "lad" oddly, so the
// spellings in each word's `say` list are tuned for the voice. Needs ffmpeg. Redo one word with --only syl.ladder --force.
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, dflt) => { const i = process.argv.indexOf('--' + name); return i < 0 ? dflt : (process.argv[i + 1] ?? true); };
const only = arg('only', '');
const voice = arg('voice', 'en-GB-Chirp3-HD-Aoede');
const rate = Number(arg('rate', 0.92));
const force = process.argv.includes('--force');
const outDir = arg('out', path.join(root, 'audio/voice'));
const key = process.env.GOOGLE_TTS_API_KEY;
if (!key) { console.error('GOOGLE_TTS_API_KEY is not set.'); process.exit(1); }

// 1. Read the lines from the app itself.
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
await page.waitForFunction(() => window.CONTENT && window.Worlds);
const lines = await page.evaluate(() => window.CONTENT.lines);
const trainWords = await page.evaluate(() => Object.values(window.WordTrain ? window.WordTrain.packs : {}).flatMap(p => p.words));
await browser.close();

const todo = Object.entries(lines).filter(([id, text]) => id.startsWith(only) && !/[{}]/.test(text));
fs.mkdirSync(outDir, { recursive: true });
console.log(`${todo.length} lines to voice with ${voice}`);

// 2. Make each clip.
async function synth(input, speakingRate = rate) {
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key },
    body: JSON.stringify({
      input,
      voice: { languageCode: voice.slice(0, 5), name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate, sampleRateHertz: 24000 }
    })
  });
  if (!res.ok) { console.error(JSON.stringify(input), res.status, await res.text()); process.exit(1); }
  return Buffer.from((await res.json()).audioContent, 'base64');
}
let made = 0;
for (const [id, text] of todo) {
  const file = path.join(outDir, id + '.mp3');
  if (fs.existsSync(file) && !force) continue;
  fs.writeFileSync(file, await synth({ text }));
  made++;
  console.log('made', id);
}

// 3. Word Train beats: say the word beat by beat, then cut it at the pauses.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'beats-'));
const ff = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'info', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
function voiced(file) {
  // Stretches of sound between silences, as [start, end] in seconds.
  const log = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-38dB:d=0.2', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  const total = parseFloat(out);
  const ev = [...log.matchAll(/silence_(start|end): ([\d.]+)/g)].map(m => [m[1], parseFloat(m[2])]);
  const parts = []; let at = 0;
  ev.forEach(([kind, t]) => { if (kind === 'start') { if (t - at > 0.05) parts.push([at, t]); } else at = t; });
  if (!ev.length || ev[ev.length - 1][0] === 'end') { if (total - at > 0.05) parts.push([at, total]); }
  return parts;
}
for (const w of trainWords) {
  const ids = w.beats.map((_, i) => `syl.${w.id}.${i}`);
  if (!ids.some(id => id.startsWith(only) || only.startsWith('syl.' + w.id))) continue;
  if (ids.every(id => fs.existsSync(path.join(outDir, id + '.mp3'))) && !force) continue;
  const whole = path.join(tmp, w.id + '.mp3');
  // The voice doesn't always pause where asked, so try a few times (with and without commas).
  let parts = [];
  for (let tries = 0; tries < 6 && parts.length !== w.beats.length; tries++) {
    fs.writeFileSync(whole, await synth({ markup: w.say.join(tries % 2 ? ', [pause long] ' : ' [pause long] ') }, 0.9));
    parts = voiced(whole);
  }
  if (parts.length === w.beats.length) {
    parts.forEach(([a, b], i) => ff(['-i', whole, '-ss', Math.max(0, a - 0.03).toFixed(3), '-to', (b + 0.08).toFixed(3), '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '48k', path.join(outDir, ids[i] + '.mp3')]));
    console.log('made beats', w.id, parts.map(([a, b]) => (b - a).toFixed(2) + 's').join(' '));
  } else {
    // The pauses didn't split cleanly: say each beat on its own instead.
    console.log(`beats for ${w.id}: found ${parts.length} parts, not ${w.beats.length}; saying each beat alone`);
    for (let i = 0; i < w.beats.length; i++) fs.writeFileSync(path.join(outDir, ids[i] + '.mp3'), await synth({ text: w.say[i] }, 0.9));
  }
  made += w.beats.length;
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`made ${made} clips`);

// 4. Only write the app's clip list and bump the version when writing into the app.
if (outDir !== path.join(root, 'audio/voice')) process.exit(0);
const ids = fs.readdirSync(outDir).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
fs.writeFileSync(path.join(root, 'js/voice.js'),
`// Made by tools/make-voice.mjs: the recorded voice clips, played instead of the device voice.
// Loaded by the page (fills CONTENT.voiceFiles) and by sw.js (saves the clips for offline use).
(function () {
  const ids = ${JSON.stringify(ids, null, 2).replace(/\n/g, '\n  ')};
  self.VOICE_FILES = ids.map(id => 'audio/voice/' + id + '.mp3');
  if (self.CONTENT) ids.forEach((id, i) => { self.CONTENT.voiceFiles[id] = self.VOICE_FILES[i]; });
})();
`);
if (made) {
  const sw = path.join(root, 'sw.js');
  fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').replace(/VERSION = 'v(\d+)\.(\d+)\.(\d+)'/,
    (_, a, b, c) => `VERSION = 'v${a}.${b}.${+c + 1}'`));
}
console.log(`js/voice.js lists ${ids.length} clips`);
