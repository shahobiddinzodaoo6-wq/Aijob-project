import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Utility to clean the URL: ensure it doesn't start with // unless it's a protocol
const cleanBaseUrl = (url: string) => {
  if (url === "/") return "";
  return url;
};

export const apiClient = axios.create({
  baseURL: cleanBaseUrl(BASE_URL),
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach access token ──────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    // Guard: never send the literal string "undefined" as a Bearer token
    if (token && token !== "undefined" && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Refresh-token helpers ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

import { useAuthStore } from "@/store/AuthStore";

function forceLogout(reason?: string) {
  if (typeof window === "undefined") return;
  
  console.warn("forceLogout triggered. Reason:", reason);
  
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  useAuthStore.getState().logout(); // Sync store state
  
  const path = window.location.pathname;
  if (!path.startsWith("/login") && !path.startsWith("/register")) {
    window.location.replace("/login");
  }
}

// ── Response interceptor: 401 → try refresh once, then logout ────────────
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If it's not a 401, or if we've already retried this request once, stop.
    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    console.warn("401 Unauthorized encountered for URL:", original.url);

    // Ignore 401s for login and register calls to prevent loops on bad credentials
    if (original.url?.includes("/api/Auth/login") || original.url?.includes("/api/Auth/register")) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for the refresh-token endpoint itself
    if (original.url?.includes("/api/Auth/refresh-token")) {
      forceLogout("Refresh token failed with 401");
      return Promise.reject(error);
    }

    // Queue other 401s while a refresh is already in-flight
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          original._retry = true;
          if (original.headers) original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    const storedRefresh =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    // No refresh token → logout immediately
    if (!storedRefresh || storedRefresh === "undefined") {
      isRefreshing = false;
      forceLogout("No refresh token found in storage");
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/Auth/refresh-token`,
        { refreshToken: storedRefresh },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccess: string | null =
        data?.data?.accessToken ??
        data?.data?.token ??
        data?.accessToken ??
        data?.token ??
        null;

      const newRefresh: string | null =
        data?.data?.refreshToken ??
        data?.data?.refresh_token ??
        data?.refreshToken ??
        data?.refresh_token ??
        null;

      if (!newAccess) {
        throw new Error("refresh-token response contained no accessToken");
      }

      // 1. Update localStorage
      localStorage.setItem("accessToken", newAccess);
      if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
      
      // 2. Sync Zustand Store
      useAuthStore.getState().setTokens(newAccess, newRefresh || storedRefresh);

      processQueue(null, newAccess);

      if (original.headers) original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (err) {
      processQueue(err, null);
      forceLogout("Token refresh process failed");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

// ── Error message extractor ───────────────────────────────────────────────
export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const desc = data?.description;
    if (Array.isArray(desc) && desc.length > 0) return desc.join(", ");
    return data?.message ?? data?.title ?? error.message ?? "Unknown error";
  }
  return "An unknown error occurred";
}
