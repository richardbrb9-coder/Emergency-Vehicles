// Makes Pip's World voice clips with Google Cloud Text-to-Speech.
//
//   GOOGLE_TTS_API_KEY=... node tools/make-voice.mjs [--only map.] [--voice en-GB-Chirp3-HD-Aoede] [--force]
//
// It opens the app in a headless browser to read every line in CONTENT.lines, skips lines with {vars}
// (those stay on the device voice), and saves each clip as audio/voice/<line id>.mp3. Clips that already
// exist are kept unless --force is given. Then it rewrites js/voice.js (the list of clips the app plays)
// and bumps VERSION in sw.js so installed apps pick the new clips up.
import { createRequire } from 'node:module';
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
await browser.close();

const todo = Object.entries(lines).filter(([id, text]) => id.startsWith(only) && !/[{}]/.test(text));
fs.mkdirSync(outDir, { recursive: true });
console.log(`${todo.length} lines to voice with ${voice}`);

// 2. Make each clip.
let made = 0;
for (const [id, text] of todo) {
  const file = path.join(outDir, id + '.mp3');
  if (fs.existsSync(file) && !force) continue;
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: voice.slice(0, 5), name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: rate, sampleRateHertz: 24000 }
    })
  });
  if (!res.ok) { console.error(id, res.status, await res.text()); process.exit(1); }
  fs.writeFileSync(file, Buffer.from((await res.json()).audioContent, 'base64'));
  made++;
  console.log('made', id);
}
console.log(`made ${made} clips`);

// 3. Only write the app's clip list and bump the version when writing into the app.
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
