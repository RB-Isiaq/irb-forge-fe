"use client";

import { useAuthStore } from "./store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  return {
    user,
    isAuthenticated: !!user,
    isVerified: user?.isVerified ?? false,
    isSuperAdmin: user?.role === "super_admin",
    // googleId is not yet returned by the backend UserResponseDto.
    // Once the backend adds it to the DTO, this will work correctly.
    // For now: undefined means unknown (show the change-password form; it handles the 400 gracefully).
    isGoogleAccount: user?.googleId !== undefined ? !!user.googleId : false,
    isLoading,
    isInitialized,
    login,
    loginWithGoogle,
    register,
    logout,
    setUser,
  };
}
