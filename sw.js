// Offline support: every file the app needs is saved on the device the first time it is opened.
// Change VERSION whenever any app file changes, so devices pick up the new version.
const VERSION = 'v1.2.4';
const CACHE = 'to-the-rescue-' + VERSION;
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'css/fonts.css', 'css/app.css',
  'fonts/andika-400.woff2', 'fonts/andika-700.woff2', 'fonts/fredoka.woff2',
  'icons/icon-48.png', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/icon.svg',
  'js/content.js', 'js/voice.js', 'js/audio.js', 'js/art.js', 'js/app.js', 'js/worlds.js', 'js/vehicles2.js', 'js/vehicles3.js',
  'js/match.js', 'js/games.js', 'js/games4.js', 'js/games5.js', 'js/lib/matter.min.js', 'js/ballrun.js', 'js/train.js', 'js/rewards.js'
];
// The recorded voice clips (listed in js/voice.js) are saved too.
importScripts('js/voice.js');
FILES.push(...self.VOICE_FILES);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('to-the-rescue-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Cache first, so the app opens instantly and works with no connection.
// Anything not in the cache (such as recorded voice clips added later) is fetched and saved for next time.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('index.html') : Response.error());
    })
  );
});
