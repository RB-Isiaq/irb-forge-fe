import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "@/shared/lib/types";
import type { NormalizedApiError } from "./error";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

const TOKEN_KEY = "irb_refresh_token";

export const tokenStore = {
  accessToken: null as string | null,

  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, refresh);
    }
  },

  clear(): void {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/* Attach access token to every outgoing request */
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function drainQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

/* Silent token refresh on 401 */
client.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error) => {
    const original: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;

    const status: number = error.response?.status;
    const isRefreshEndpoint = original.url?.includes("/auth/refresh");

    if (status === 401 && !original._retry && !isRefreshEndpoint) {
      original._retry = true;

      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) {
        tokenStore.clear();
        redirectToLogin();
        return Promise.reject(normalizeError(error));
      }

      if (isRefreshing) {
        return new Promise<string>((resolve) => {
          refreshQueue.push(resolve);
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post<ApiResponse<AuthTokens>>(`${BASE_URL}/auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        tokenStore.setTokens(accessToken, newRefresh);
        drainQueue(accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return client(original);
      } catch {
        tokenStore.clear();
        redirectToLogin();
        return Promise.reject(normalizeError(error));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

function redirectToLogin() {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
  }
}

/**
 * Proactively refreshes the access token using the stored refresh token.
 * Call this on app init so the access token is valid before any API request,
 * avoiding the 401 → refresh → retry round trip that happens on every page reload.
 *
 * Returns true on success, false if the refresh token is missing or expired.
 */
export async function silentRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await axios.post<ApiResponse<AuthTokens>>(`${BASE_URL}/auth/refresh`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const { accessToken, refreshToken: newRefresh } = res.data.data;
    tokenStore.setTokens(accessToken, newRefresh);
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
}

/**
 * Transforms a raw Axios error into the normalized shape every onError
 * handler expects: { code, message, details }.
 * Non-API errors (network timeouts, CORS failures) get code "NETWORK_ERROR".
 */
function normalizeError(err: unknown): NormalizedApiError {
  const e = err as {
    response?: { data?: { success?: boolean; error?: Partial<NormalizedApiError> } };
    message?: string;
  };
  const apiError = e?.response?.data?.error;
  if (e?.response?.data?.success === false && apiError) {
    return {
      code: apiError.code ?? "UNKNOWN",
      message: apiError.message ?? "An error occurred.",
      details: apiError.details ?? [],
    };
  }
  return {
    code: "NETWORK_ERROR",
    message: e?.message ?? "No response from server.",
    details: [],
  };
}

/* Typed helper that unwraps the envelope */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.get<ApiResponse<T>>(url, config);
  return res.data.data;
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await client.post<ApiResponse<T>>(url, data, config);
  return res.data.data;
}

export async function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await client.patch<ApiResponse<T>>(url, data, config);
  return res.data.data;
}

export async function apiDelete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await client.delete<ApiResponse<T>>(url, config);
  return res.data.data;
}

export default client;
