const CACHE_NAME = 'benix-tv-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/logo.png',
  '/logotv.avif'
];

// Install Event - cache only static images & manifest (NEVER index.html or JS bundles)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - purge all old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-First for HTML & JS, Stale-While-Revalidate for images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip API requests, audio/video streams, or non-GET requests
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('.m3u8') ||
    url.pathname.includes('.ts') ||
    url.pathname.includes('.aac') ||
    url.pathname.includes('.mp3')
  ) {
    return;
  }

  // HTML navigation & JS bundles: ALWAYS Network-First to avoid stale bundle 404s
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.js') || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // If offline, return cached response if available
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets (images/fonts): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
