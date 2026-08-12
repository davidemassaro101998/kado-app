// Kado AI - PWA Service Worker for Smart Web Push Notifications

const CACHE_NAME = 'kado-ai-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Continue if offline cache partial
      });
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate for Static Assets, Network First for API
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  // Stale-While-Revalidate caching pattern
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Event Receiver
self.addEventListener('push', (event) => {
  let data = {
    title: '🎁 Kado AI • Promemoria Regalo',
    body: 'Scopri le migliori idee regalo selezionate dall\'AI su Amazon!',
    icon: '/icon.svg',
    badge: '/favicon.ico',
    tag: 'kado-general',
    data: { url: '/' },
    vibrate: [200, 100, 200],
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon.svg',
    badge: data.badge || '/favicon.ico',
    tag: data.tag || 'kado-notification',
    data: data.data || { url: '/' },
    vibrate: data.vibrate || [200, 100, 200],
    actions: data.actions || [
      { action: 'open_app', title: 'Apri Kado AI' }
    ],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickData = event.notification.data || {};
  let targetUrl = clickData.url || '/';

  if (event.action === 'find_gift' && clickData.recipient) {
    targetUrl = `/?action=find_gift&recipient=${encodeURIComponent(clickData.recipient)}&vibe=${encodeURIComponent(clickData.vibe || '')}`;
  } else if (event.action === 'open_calendar') {
    targetUrl = '/?action=calendar';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
