// ===================== SW.JS =====================
// GymFlow Service Worker — powiadomienia w tle

var CACHE_NAME = 'gymflow-v1';

// Instalacja — cache podstawowych plików
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// Obsługa wiadomości z aplikacji
self.addEventListener('message', function(e) {
  if (!e.data) return;

  // Powiadomienie o końcu przerwy
  if (e.data.type === 'TIMER_NOTIFICATION') {
    var delay = e.data.delay || 0; // ms do końca timera

    // Anuluj poprzedni timer jeśli był
    if (self._timerTimeout) clearTimeout(self._timerTimeout);

    if (delay <= 0) {
      // Pokaż od razu
      showTimerNotification();
    } else {
      self._timerTimeout = setTimeout(function() {
        showTimerNotification();
      }, delay);
    }
  }

  // Anuluj powiadomienie (użytkownik sam pominął timer)
  if (e.data.type === 'CANCEL_TIMER_NOTIFICATION') {
    if (self._timerTimeout) {
      clearTimeout(self._timerTimeout);
      self._timerTimeout = null;
    }
  }
});

function showTimerNotification() {
  self.registration.showNotification('💪 GymFlow — Czas na serię!', {
    body: 'Przerwa skończona. Wracaj do treningu!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
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

// Kliknięcie w powiadomienie — otwórz aplikację
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'dismiss') return;

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      // Jeśli aplikacja jest otwarta — focus
      for (var i = 0; i < clients.length; i++) {
        if ('focus' in clients[i]) return clients[i].focus();
      }
      // Jeśli zamknięta — otwórz
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
