
import api from "./baseapiinstance";

export const loginApi = async (credentials) => {
  const res = await api.post("/api/auth/login", credentials);

  const token = res.data.token;

  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return res.data;
};
// Forgot password
export async function sendOtp(payload) {
  const res = await api.post("/api/auth/forgot-password", payload);
  return res.data;
}

// Verify OTP
export async function verifyOtp(payload) {
  const res = await api.post("/api/auth/verify-otp", payload);
  return res.data;
}
