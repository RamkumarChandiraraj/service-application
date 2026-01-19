/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDJoidu8qlChF3JGauBwk01sC5wiOXWa58",
  authDomain: "mr-lookup.firebaseapp.com",
  projectId: "mr-lookup",
  storageBucket: "mr-lookup.firebasestorage.app",
  messagingSenderId: "625620013804",
  appId: "1:625620013804:web:b064aec67085b0f5ba8bc9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "Notification",
    {
      body: payload.notification?.body,
      icon: "/logo192.png",
      data: payload.data || {},
    }
  );
});
