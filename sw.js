const CACHE_NAME = 'amanecer-v1';

const urlsToCache = [
  '/supermarket-amanecer/',
  '/supermarket-amanecer/index.html',
  '/supermarket-amanecer/manifest.json',
  '/supermarket-amanecer/icon-192.png',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap'
];

// Instalación: guarda todos los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activación: borra cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: responde desde caché, si no hay va a la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Si está offline y no está en caché, devuelve la página principal
        return caches.match('/supermarket-amanecer/index.html');
      });
    })
  );
});
