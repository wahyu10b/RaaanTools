const CACHE_NAME = 'raaan-tools-v7';
const CORE_ASSETS = [
  './',
  './index.php',
  './asset/css/style.css',
  './asset/script/config.js',
  './asset/script/savedata.js',
  './script/tool-page.js',
  './handle/404.php'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (new URL(req.url).pathname.endsWith('/api.php')) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./handle/404.php')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    if (req.method === 'GET' && new URL(req.url).origin === location.origin) caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
    return res;
  }).catch(() => cached)));
});
