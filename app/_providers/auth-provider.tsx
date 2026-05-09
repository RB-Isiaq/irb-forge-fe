"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/entities/user";
import { tokenStore } from "@/shared/api";
import { setSessionCookie } from "@/shared/lib";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refreshSession = useAuthStore((s) => s.refreshSession);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (tokenStore.getRefresh()) setSessionCookie(true);
    refreshSession().then(() => {
      setSessionCookie(!!useAuthStore.getState().user);
    });
  }, [refreshSession]);

  useEffect(() => {
    setSessionCookie(!!user);
  }, [user]);

  return <>{children}</>;
}
