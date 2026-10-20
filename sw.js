const CACHE_NAME = 'ravens-ridge-v2.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/images/noir_1.png',
  './assets/images/noir_1.jpg',
  './assets/images/morwyn_shade.png',
  './assets/images/ainsley_final.jpg',
  './assets/images/ainsley_neutral.jpg',
  './assets/images/drake_neutral.png',
  './assets/images/killian_neutral.png',
  './assets/images/cassidy_viva.jpg',
  './assets/images/cassidy_memorial.png',
  './assets/images/eliott_neutral.png',
  './assets/images/eliott_final.png',
  './assets/images/bridget_neutral.png',
  './assets/images/bridget_final.png',
  './assets/images/harlan_neutral.png',
  './assets/images/harlan_final.png',
  './assets/images/fin_cronicas_rr.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache pre-fetch non-critical error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        return cachedResponse;
      });
    })
  );
});
