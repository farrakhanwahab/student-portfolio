const CACHE_NAME = 'devstudent-portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/portfolio.html',
    '/resume.html',
    '/blog.html',
    '/testimonials.html',
    '/contact.html',
    '/css/style.css',
    '/css/style-additions.css',
    '/js/script.js',
    '/js/page-transitions.js',
    '/js/theme-toggle.js',
    '/js/components.js',
    '/js/cache-manager.js',
    '/images/hero-image.jpg',
    '/images/favicon.ico',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.log('Service Worker: Error caching static files', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(handleStaticAssetRequest(request));
    } else if (request.destination === 'document') {
        event.respondWith(handleDocumentRequest(request));
    } else {
        event.respondWith(handleOtherRequest(request));
    }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Error handling image request', error);
        return new Response('Image not available', { status: 404 });
    }
}

// Handle static assets with cache-first strategy
async function handleStaticAssetRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Error handling static asset request', error);
        return new Response('Asset not available', { status: 404 });
    }
}

// Handle document requests with network-first strategy
async function handleDocumentRequest(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Page not available offline', { status: 404 });
    }
}

// Handle other requests with cache-first strategy
async function handleOtherRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Error handling other request', error);
        return new Response('Resource not available', { status: 404 });
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle any background sync tasks here
    console.log('Service Worker: Performing background sync');
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    const options = {
        body: event.data ? event.data.text() : 'New notification from DevStudent Portfolio',
        icon: '/images/favicon.ico',
        badge: '/images/favicon.ico',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('DevStudent Portfolio', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
}); 