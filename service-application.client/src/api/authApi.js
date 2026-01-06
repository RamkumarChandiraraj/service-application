import api, { setAuthToken } from "./baseapiinstance"; // or "./api"

export async function loginApi(payload) {
  const res = await api.post("/api/auth/login", payload);

  const { token } = res.data;

  setAuthToken(token);

  return res.data;
}


// SEND OTP
export async function sendOtp(payload) {
    const res = await api.post("/api/auth/forgot-password", payload);
    return res.data;
}

// VERIFY OTP + RESET PASSWORD
export async function verifyOtp(payload) {
    const res = await api.post("/api/auth/verify-otp", payload);
    return res.data;
}