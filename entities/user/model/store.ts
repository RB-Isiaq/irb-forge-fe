"use client";

import { create } from "zustand";
import { tokenStore } from "@/shared/api";
import type { User, LoginPayload, RegisterPayload } from "./types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: (user: User) => void;
}

/* Lazy import to avoid any potential circular dependency at module init */
async function getApi() {
  const { userApi } = await import("../api");
  return userApi;
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
      tokenStore.setTokens(accessToken, refreshToken);
      const user = await api.getProfile();
      set({ user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const api = await getApi();
    try { await api.logout(); } catch { /* always clear */ }
    finally {
      tokenStore.clear();
      set({ user: null });
    }
  },

  refreshSession: async () => {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) { set({ isInitialized: true }); return; }
    const api = await getApi();
    try {
      const user = await api.getProfile();
      set({ user, isInitialized: true });
    } catch {
      tokenStore.clear();
      set({ user: null, isInitialized: true });
    }
  },
}));
