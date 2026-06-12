self.addEventListener('fetch', function(event) {
    // Handle fetch requests with cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached response if available
                return response || fetch(event.request);
            })
            .catch(function() {
                // Fallback for offline - serve cached index.html
                return caches.match('/index.html');
            })
    );
});

// Cache assets on service worker activation
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json'
            ]);
        })
    );
});

// Clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== 'v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});