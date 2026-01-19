import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { registerFcmToken } from "../api/notificationApi";

const firebaseConfig = {
  apiKey: "AIzaSyDJoidu8qlChF3JGauBwk01sC5wiOXWa58",
  authDomain: "mr-lookup.firebaseapp.com",
  projectId: "mr-lookup",
  storageBucket: "mr-lookup.firebasestorage.app",
  messagingSenderId: "625620013804",
  appId: "1:625620013804:web:b064aec67085b0f5ba8bc9",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

/* 🔔 Request permission + token */
export const requestForToken = async () => {
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const token = await getToken(messaging, {
    vapidKey:
      "BCIbrOMj3TMkgRPVuwuAg_kbQ3Dc4JGfXQOk7557LLg6rPWkXXUhv64N08Tc5W3XrnwIubS1eWrmc9Sm96RyKQA",
  });

  if (token) {
    await registerFcmToken({
      fcmToken: token,
      userId: 0,
    });
  }

  return token;
};

/* 🔔 FOREGROUND LISTENER — THIS EXPORT MUST EXIST */
export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message:", payload);
    callback(payload);
  });
};
