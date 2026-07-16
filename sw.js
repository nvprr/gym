// ===================== SW.JS =====================
// GymFlow Service Worker — cache + update detection + powiadomienia

var CACHE_NAME = 'gymflow-v2.1.3';
var CACHE_FILES = [
  '/gym/',
  '/gym/index.html',
  '/gym/css/style.css',
  '/gym/css/animations.css',
  '/gym/js/db.js',
  '/gym/js/utils.js',
  '/gym/js/storage.js',
  '/gym/js/data.js',
  '/gym/js/svg_icons.js',
  '/gym/js/exercises.js',
  '/gym/js/notifications.js',
  '/gym/js/musclemap.js',
  '/gym/js/dashboard.js',
  '/gym/js/plans.js',
  '/gym/js/workout.js',
  '/gym/js/profile.js',
  '/gym/js/achievements.js',
  '/gym/js/progress.js',
  '/gym/js/body_measurements.js',
  '/gym/js/hydration.js',
  '/gym/js/seasons.js',
  '/gym/js/wiecej.js',
  '/gym/js/app.js',
  '/gym/js/animations.js',
  '/gym/manifest.json',
  '/gym/icons/icon-192.png',
  '/gym/icons/icon-512.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILES).catch(function(err) {
        console.warn('Cache partial fail:', err);
      });
    })
  );
  // Don't skipWaiting here — wait for user to click "Aktualizuj"
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Network first, cache fallback
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(response) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
      return response;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || caches.match('/gym/index.html');
      });
    })
  );
});

// Message from app
self.addEventListener('message', function(e) {
  if (!e.data) return;

  // User clicked "Aktualizuj" — activate new SW immediately
  if (e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Timer notifications
  if (e.data.type === 'TIMER_NOTIFICATION') {
    if (self._timerTimeout) clearTimeout(self._timerTimeout);
    var delay = e.data.delay || 0;
    self._timerTimeout = setTimeout(showTimerNotification, delay);
  }
  if (e.data.type === 'CANCEL_TIMER_NOTIFICATION') {
    if (self._timerTimeout) { clearTimeout(self._timerTimeout); self._timerTimeout = null; }
  }
});

function showTimerNotification() {
  self.registration.showNotification('💪 GymFlow — Czas na serię!', {
    body: 'Przerwa skończona. Wracaj do treningu!',
    icon: '/gym/icons/icon-192.png',
    tag: 'gymflow-timer',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 400],
    actions: [
      { action: 'open', title: '▶ Wróć do treningu' },
      { action: 'dismiss', title: '✕ Zamknij' }
    ]
  });
}

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      for (var i = 0; i < clients.length; i++) {
        if ('focus' in clients[i]) return clients[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/gym/');
    })
  );
});
