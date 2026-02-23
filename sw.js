const CACHE_NAME = 'ultimate-goats-v2';

// Assets to cache for instant offline loading
const ASSETS_TO_CACHE = [
  '/Ultimate-goats/',
  '/Ultimate-goats/index.html',
  '/Ultimate-goats/manifest.json',
  '/Ultimate-goats/icon-192.png',
  '/Ultimate-goats/icon-512.png',
  // External Libraries & Fonts
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&family=Great+Vibes&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://unpkg.com/html5-qrcode'
];

// 1. Install Event: Save everything to the phone's memory
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Building World-Class Cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Remove old versions of the app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Clearing old system data:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // IMPORTANT: Do NOT cache the point submissions (POST requests)
  // We handle offline points in the index.html using LocalStorage
  if (event.request.method === 'POST') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return from cache (instant)
      }
      return fetch(event.request).then((networkResponse) => {
        // Optional: Add new successful requests to cache
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If everything fails (No cache, No internet)
        console.log('Teacher is completely offline and resource not cached.');
      });
    })
  );
});
