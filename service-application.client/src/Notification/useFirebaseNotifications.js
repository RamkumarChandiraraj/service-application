import { useEffect, useState } from "react";
import { onMessageListener } from "./firebase";

export const useFirebaseNotifications = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    onMessageListener().then((payload) => {
      setNotification({
        title: payload.notification?.title,
        body: payload.notification?.body,
      });
    });
  }, []);

  return { notification, clear: () => setNotification(null) };
};
