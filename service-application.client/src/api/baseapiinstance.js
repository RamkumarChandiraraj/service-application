import axios from "axios";

/**
 * Base API instance for service-application.client
 *
 * - Adds Authorization header from localStorage (accessToken)
 * - Handles 401 by attempting token refresh using refreshToken
 * - Queues requests while a refresh is in progress
 *
 * LocalStorage keys used:
 *  - accessToken
 *  - refreshToken
 *
 * Environment:
 *  - REACT_APP_API_BASE_URL or fallback to window location origin + '/api'
 */

/* Helper to read tokens from localStorage */
function getTokens() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

/* Helper to write tokens to localStorage */
function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

/* Helper to clear tokens */
function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/* Base URL configuration */
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 
  `${window.location.origin}/api`;
   
/* Create axios instance */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/* Token refresh state */
let isRefreshing = false;
let refreshSubscribers = [];

/* Subscribe to receive new token once refreshed */
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

/* Notify all subscribers with the new token */
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/* Request interceptor: attach Authorization header */
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response interceptor: handle 401 and token refresh */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If no response or not a 401, reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const { refreshToken } = getTokens();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request until refresh is done
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    // Attempt refresh
    return new Promise((resolve, reject) => {
      // Use plain fetch to avoid interceptor recursion
      fetch(`${BASE_URL.replace(/\/$/, "")}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Token refresh failed");
          }
          const data = await res.json();
          const newAccessToken = data.accessToken || data.token;
          const newRefreshToken = data.refreshToken || refreshToken;

          if (!newAccessToken) {
            throw new Error("No access token in refresh response");
          }

          setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          onRefreshed(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        })
        .catch((err) => {
          clearTokens();
          onRefreshed(null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

/* Utility functions exported for manual token management */
export function setAuthToken(accessToken, refreshToken) {
  setTokens({ accessToken, refreshToken });
  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function clearAuthTokens() {
  clearTokens();
  delete api.defaults.headers.common.Authorization;
}

export default api;