const CACHE_NAME = 'fbwordle-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event: any) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  declare var process: { env: { VITE_API_BASE_URL: string } };
const apiBaseUrl = process.env.VITE_API_BASE_URL;

  // For API calls, try network first, then fallback to cache
  if (event.request.url.startsWith(apiBaseUrl)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network request succeeds, cache and return response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other assets (e.g., static files), try cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              // If network request succeeds, cache and return response
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            })
            .catch(() => {
              // If network fails, return a fallback or error
              return new Response('Offline content not available', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
  }
});

self.addEventListener('activate', (event: any) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});