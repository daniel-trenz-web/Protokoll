/* Service Worker für Wohnungsprotokoll (PWA)
   - precached den App-Shell, damit die App offline (z. B. auf der Baustelle) läuft
   - Navigation: network-first (frische Version online), Fallback auf Cache (offline)
   - Assets: cache-first (schnell), mit Netzwerk-Nachladen
   Bei Änderungen am App-Code VERSION erhöhen -> alter Cache wird ersetzt. */
const VERSION = 'v9';
const CACHE = 'protokoll-' + VERSION;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './lib/jspdf.umd.min.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // externe Anfragen unangetastet lassen

  // HTML-Navigationen: erst Netzwerk (Updates), dann Cache (offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Übrige Assets: erst Cache, sonst Netzwerk (und nachcachen)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
