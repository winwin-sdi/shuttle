// Firebase Cloud Messaging 백그라운드 처리 전용 서비스워커
// 반드시 앱과 같은 폴더(winwin-sdi/shuttle/)에 두어야 index.html이 './firebase-messaging-sw.js'로 등록할 수 있음
// 캐싱 기능 없음 (fetch 핸들러 없음) → GitHub Pages 최신 파일 반영 동작에 영향 없음

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// index.html의 firebaseConfig와 반드시 동일한 값으로 채워야 함
firebase.initializeApp({
  apiKey: "AIzaSyDKDBvB1ZQsZl_p6sBcdiqvseNzYdh1iNE",
  authDomain: "shuttle-bus-cd8c2.firebaseapp.com",
  databaseURL: "https://shuttle-bus-cd8c2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shuttle-bus-cd8c2",
  storageBucket: "shuttle-bus-cd8c2.firebasestorage.app",
  messagingSenderId: "33337082467",
  appId: "1:33337082467:web:651da33c4fc414957cae56"
});

const messaging = firebase.messaging();

// notification 필드가 있는 메시지는 브라우저가 자동으로 띄워주지만,
// 명시적으로 처리해서 아이콘/태그 등을 통일한다.
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || '🚌 탑승 체크';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, { body, tag: 'shuttle-check' });
});

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
