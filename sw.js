const CACHE_NAME = 'balagoat-v1';

// List of files to cache for offline use
const ASSETS = [
  '/Balagoat/',
  '/Balagoat/index.html',
  // External Fonts and Libraries
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&family=Great+Vibes&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://unpkg.com/html5-qrcode'
];

// 1. Install Event: Saves assets to the browser cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Cleans up old caches if you update the app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Serves files from cache if offline
self.addEventListener('fetch', (event) => {
  // We don't cache POST requests to the Google Apps Script API
  if (event.request.method === 'POST') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file OR fetch from network
      return cachedResponse || fetch(event.request);
    })
  );
});
