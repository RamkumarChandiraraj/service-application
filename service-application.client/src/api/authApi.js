import api from "./baseApiInstance";
import { storeTokenAndUser } from "../utils/jwtUtils";

export const loginApi = async (credentials) => {
  const res = await api.post("/api/auth/login", credentials);

  const token = res.data.token;

  // ✅ decode + persist payload
  const decodedUser = storeTokenAndUser(token);

  return decodedUser;
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