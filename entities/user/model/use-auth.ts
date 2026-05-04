"use client";

import { useAuthStore } from "./store";

export function useAuth() {
  const user        = useAuthStore((s) => s.user);
  const isLoading   = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const login       = useAuthStore((s) => s.login);
  const register    = useAuthStore((s) => s.register);
  const logout      = useAuthStore((s) => s.logout);
  const setUser     = useAuthStore((s) => s.setUser);

  return {
    user,
    isAuthenticated: !!user,
    isVerified:  user?.isVerified ?? false,
    isSuperAdmin: user?.role === "super_admin",
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    setUser,
  };
}
