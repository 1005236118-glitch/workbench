const CACHE_NAME = 'taotao-workbench-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg'
];

// Install - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('Cache addAll failed, continuing:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches and claim clients
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

// Fetch - network first with cache fallback, cache successful responses
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // Skip GitHub API requests (don't cache API calls)
  if (url.hostname === 'api.github.com') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: try cache first
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // If requesting a page, return the index.html (SPA fallback)
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background Sync - sync data when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'workbench-sync') {
    event.waitUntil(
      // Notify all clients that sync should happen
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'background-sync' });
        });
      })
    );
  }
});

// Periodic Background Sync - keep data fresh (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'workbench-periodic-sync') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'periodic-sync' });
        });
      })
    );
  }
});

// Listen for messages from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'register-sync') {
    // Register background sync if supported
    if ('sync' in self.registration) {
      self.registration.sync.register('workbench-sync').catch(() => {});
    }
    // Register periodic sync if supported
    if ('periodicSync' in self.registration) {
      self.registration.periodicSync.register('workbench-periodic-sync', {
        minInterval: 10 * 60 * 1000 // 10 minutes minimum
      }).catch(() => {});
    }
  }
});