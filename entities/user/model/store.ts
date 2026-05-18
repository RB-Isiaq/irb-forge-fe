"use client";

import { create } from "zustand";
import { tokenStore, silentRefresh } from "@/shared/api";
import type { User, LoginPayload, RegisterPayload, GoogleSignInPayload } from "./types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (payload: GoogleSignInPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: (user: User) => void;
}

// Module-level guard — prevents concurrent refreshSession calls (e.g. StrictMode
// double-invoke, or two components calling it simultaneously on mount).
let sessionRefreshInFlight = false;

async function getApi() {
  const { userApi } = await import("../api");
  return userApi;
}

async function fetchAndSetUser(
  accessToken: string,
  refreshToken: string,
  set: (partial: Partial<AuthState>) => void
) {
  tokenStore.setTokens(accessToken, refreshToken);
  const api = await getApi();
  const user = await api.getProfile();
  set({ user });
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  register: async (payload) => {
    const api = await getApi();
    set({ isLoading: true });
    try {
      const { user, accessToken, refreshToken } = await api.register(payload);
      tokenStore.setTokens(accessToken, refreshToken);
      set({ user });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (payload) => {
    const api = await getApi();
    set({ isLoading: true });
    try {
      const { accessToken, refreshToken } = await api.login(payload);
      await fetchAndSetUser(accessToken, refreshToken, set);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async (payload) => {
    const api = await getApi();
    set({ isLoading: true });
    try {
      const { accessToken, refreshToken } = await api.googleSignIn(payload);
      await fetchAndSetUser(accessToken, refreshToken, set);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const api = await getApi();
    try {
      await api.logout();
    } catch {
      /* always clear local state regardless */
    } finally {
      tokenStore.clear();
      set({ user: null });
    }
  },

  refreshSession: async () => {
    if (sessionRefreshInFlight) return;
    sessionRefreshInFlight = true;

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      set({ isInitialized: true });
      sessionRefreshInFlight = false;
      return;
    }
    const api = await getApi();
    try {
      const ok = await silentRefresh();
      if (!ok) {
        set({ isInitialized: true });
        return;
      }
      const user = await api.getProfile();
      set({ user, isInitialized: true });
    } catch {
      tokenStore.clear();
      set({ user: null, isInitialized: true });
    } finally {
      sessionRefreshInFlight = false;
    }
  },
}));
