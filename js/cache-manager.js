// Cache Manager for DevStudent Portfolio
class CacheManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        await this.registerServiceWorker();
        this.setupEventListeners();
        this.preloadCriticalResources();
        this.setupIntersectionObserver();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/js/sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    setupEventListeners() {
        // Online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('You are back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        });

        // Before unload - save any pending data
        window.addEventListener('beforeunload', () => {
            this.savePendingData();
        });
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            '/css/style.css',
            '/css/style-additions.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.includes('.css') ? 'style' : 'font';
            link.href = resource;
            link.crossOrigin = resource.includes('googleapis.com') ? 'anonymous' : '';
            document.head.appendChild(link);
        });

        // Preload critical images
        const criticalImages = [
            '/images/hero-image.jpg',
            '/images/favicon.ico'
        ];

        criticalImages.forEach(image => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = image;
            document.head.appendChild(link);
        });
    }

    setupIntersectionObserver() {
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Lazy load components
        const componentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    this.loadComponent(component);
                    observer.unobserve(component);
                }
            });
        });

        // Observe components that need lazy loading
        document.querySelectorAll('[data-lazy-component]').forEach(component => {
            componentObserver.observe(component);
        });
    }

    async loadComponent(component) {
        const componentType = component.dataset.lazyComponent;
        try {
            // Load component based on type
            switch (componentType) {
                case 'header':
                    await this.loadHeader(component);
                    break;
                case 'footer':
                    await this.loadFooter(component);
                    break;
                default:
                    console.log('Unknown component type:', componentType);
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    async loadHeader(container) {
        try {
            const response = await fetch('/components/header.html');
            const html = await response.text();
            container.innerHTML = html;
            this.initializeHeaderScripts();
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    async loadFooter(container) {
        try {
            const response = await fetch('/components/footer.html');
            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    initializeHeaderScripts() {
        // Re-initialize header scripts after loading
        if (typeof initializeThemeToggle === 'function') {
            initializeThemeToggle();
        }
        if (typeof initializeMobileMenu === 'function') {
            initializeMobileMenu();
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>New version available!</p>
                <button onclick="location.reload()">Update Now</button>
            </div>
        `;
        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    savePendingData() {
        // Save any pending form data or user preferences
        const pendingData = {
            theme: localStorage.getItem('theme') || 'light-mode',
            lastVisit: new Date().toISOString()
        };

        localStorage.setItem('pendingData', JSON.stringify(pendingData));
    }

    // Cache management methods
    async clearOldCaches() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            const oldCaches = cacheNames.filter(name => 
                name !== 'static-v1.0.0' && name !== 'dynamic-v1.0.0'
            );
            
            await Promise.all(
                oldCaches.map(name => caches.delete(name))
            );
        }
    }

    async getCacheSize() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            let totalSize = 0;

            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                
                for (const request of keys) {
                    const response = await cache.match(request);
                    if (response) {
                        const blob = await response.blob();
                        totalSize += blob.size;
                    }
                }
            }

            return totalSize;
        }
        return 0;
    }

    // Performance monitoring
    measurePageLoad() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            console.log('Page Load Performance:', {
                loadTime: `${loadTime}ms`,
                domContentLoaded: `${domContentLoaded}ms`,
                totalTime: `${perfData.loadEventEnd}ms`
            });

            // Store performance data
            const performanceData = {
                loadTime,
                domContentLoaded,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };

            const existingData = JSON.parse(localStorage.getItem('performanceData') || '[]');
            existingData.push(performanceData);
            
            // Keep only last 10 entries
            if (existingData.length > 10) {
                existingData.splice(0, existingData.length - 10);
            }
            
            localStorage.setItem('performanceData', JSON.stringify(existingData));
        }
    }
}

// Initialize cache manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cacheManager = new CacheManager();
    window.cacheManager.measurePageLoad();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CacheManager;
} 