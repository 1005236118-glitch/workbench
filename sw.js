const CACHE_NAME = 'taotao-workbench-v9';
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

// Helper: is this a static asset we want to cache-first?
// NOTE: index.html is excluded from cache-first because it's the main app file that changes frequently
function isStaticAsset(url) {
  const path = url.pathname;
  // Skip index.html - always use network-first for the main app
  if (path.endsWith('/index.html') || path.endsWith('index.html') || path === '/' || path.endsWith('/')) return false;
  return path.endsWith('/manifest.json') || path.endsWith('manifest.json') ||
         path.endsWith('.svg') || path.endsWith('.js') || path.endsWith('.css');
}

// Fetch - cache-first for static assets (fast mobile), network-first for others
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // Skip GitHub API requests (don't cache API calls)
  if (url.hostname === 'api.github.com') return;

  // Skip Google Fonts (let browser handle them)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return;

  if (isStaticAsset(url)) {
    // Cache-first with network update for static assets = fast mobile loading
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(() => cached);
        
        return cached || fetchPromise;
      })
    );
  } else {
    // Network-first for other requests
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503 });
          });
        })
    );
  }
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