// 알림 전용 최소 서비스워커
// 캐싱/오프라인 기능 없음. fetch 핸들러를 두지 않아 모든 요청은 그대로 네트워크로 통과합니다.
// (GitHub Pages 파일이 항상 최신으로 반영되는 기존 동작에 영향을 주지 않습니다)
// 목적: 안드로이드 Chrome에서 new Notification()이 막혀있어(Illegal constructor),
//       ServiceWorkerRegistration.showNotification()을 쓰기 위해 최소한의 SW만 등록합니다.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// 알림을 탭하면 앱 탭으로 포커스 이동 (열려있으면 포커스, 없으면 새로 열기)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
