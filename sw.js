// 離線快取:改版時 deploy.sh 會把 VERSION 換成新的,手機下次開啟自動換新
const VERSION = 'll-v8';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'data/kana.json', 'data/vocab.json', 'data/examples.json', 'data/grammar.json', 'data/phrases.json', 'data/dialogue.json', 'data/reading.json', 'data/themes_a.json', 'data/themes_b.json', 'data/themes_c.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// 網路優先(拿得到新版就用新版),離線時用快取;同步服務等跨網域請求直接放行
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); if (r.ok) caches.open(VERSION).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
