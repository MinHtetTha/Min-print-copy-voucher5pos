const CACHE_NAME = 'min-pos-cache';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './443.png',
  './kpay.jpg',
  './wavepay.jpg',
  './ayapay.jpg',
  './cbpay.jpg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => cache.add(url))
      );
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // HTML / navigation requests: always try network first with no-store
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(new Request(e.request.url, { cache: 'no-store' }))
        .then((networkResponse) => {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          return networkResponse;
        })
        .catch(() => caches.match(e.request).then((res) => res || caches.match('./index.html')))
    );
    return;
  }

  // Other local assets: network first, fallback to cache
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        }
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});const CACHE_NAME = 'min-pos-v4';

const ASSETS_TO_CACHE = [

'./',

'./index.html',

'./manifest.json',

'./443.png'

];



self.addEventListener('install', (e) => {

e.waitUntil(

caches.open(CACHE_NAME).then((cache) => {

return cache.addAll(ASSETS_TO_CACHE);

})

);

self.skipWaiting();

});



self.addEventListener('activate', (e) => {

e.waitUntil(

caches.keys().then((keys) => {

return Promise.all(

keys.map((key) => {

if (key !== CACHE_NAME) {

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});



self.addEventListener('fetch', (e) => {

e.respondWith(

caches.match(e.request).then((cachedResponse) => {

return cachedResponse || fetch(e.request);

})

);

});
