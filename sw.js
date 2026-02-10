const CACHE_NAME = 'maze-swipe-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/images/icon.png',
    '/assets/images/favicon.png',
    '/assets/images/splash-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});
