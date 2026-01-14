import api from "./baseapiinstance";

/* 🔔 Register FCM Token */
export const registerFcmToken = async (payload) => {
  const response = await api.post(
    "/api/notification/register-token",
    payload
  );
  return response.data;
};

/* 🔔 Send Notification (Admin use) */
export const sendNotification = async (payload) => {
  const response = await api.post(
    "/api/notification/send",
    payload
  );
  return response.data;
};
