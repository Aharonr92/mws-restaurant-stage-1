const staticCacheName = 'mws-restaurant';
const allCaches = [
  staticCacheName,
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        '/sw.js',
        '/manifest.json',
        '/favicon.ico',
        '/index.html',
        '/restaurant.html',
        // '/css/styles.css',
        // '/js/vendor.js',
        // '/js/main.js',
        // '/js/restaurant_info.js',
        '/img/1.webp',
        '/img/2.webp',
        '/img/3.webp',
        '/img/4.webp',
        '/img/5.webp',
        '/img/6.webp',
        '/img/7.webp',
        '/img/8.webp',
        '/img/9.webp',
        '/img/10.webp',
        '/img/icons/icon-72x72.webp',
        '/img/icons/icon-96x96.webp',
        '/img/icons/icon-128x128.webp',
        '/img/icons/icon-144x144.webp',
        '/img/icons/icon-152x152.webp',
        '/img/icons/icon-192x192.webp',
        '/img/icons/icon-384x384.webp',
        '/img/icons/icon-512x512.webp',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter(name => name.startsWith('mws-restaurant') && !allCaches.includes(name)).map((cache) => caches.delete(cache)));
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || caches.open('mws-restaurant').then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});