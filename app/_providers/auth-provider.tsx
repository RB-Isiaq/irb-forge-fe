"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/entities/user";
import { tokenStore } from "@/shared/api";

function setSessionCookie(value: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = value
    ? "irb_session=1; path=/; max-age=604800; SameSite=Lax"
    : "irb_session=; path=/; max-age=0";
}

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
