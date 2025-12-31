const CACHE_NAME = 'capsule-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate event - Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Fetch event - Network first for API, Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
    // API calls: Network only (or Network first with offline fallback logic if strictly needed)
    // For now, allow API to fail if offline, as we need server for Gemini.
    if (event.request.url.includes('/api/')) {
        return;
    }

    // Navigation requests: Network first, fall back to cache
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Static assets: Stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});
