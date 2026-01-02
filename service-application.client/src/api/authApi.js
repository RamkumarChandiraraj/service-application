import api, { setAuthToken } from "./baseapiinstance"; // or "./api"

export async function loginApi(payload) {
  const res = await api.post("/api/auth/login", payload);

  const { token } = res.data;

  setAuthToken(token);

  return res.data;
}
