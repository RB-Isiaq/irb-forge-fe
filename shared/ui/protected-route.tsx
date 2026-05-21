"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/entities/user";
import { Skeleton } from "@/shared/ui/skeleton";

function AppShellSkeleton() {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-surface">
        <div className="px-5 h-[60px] flex items-center border-b border-border">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-3 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="px-3 py-3 border-t border-border">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-full">
        {/* Mobile header */}
        <div className="lg:hidden h-14 border-b border-border px-4 flex items-center gap-3 shrink-0">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex-1 p-4 sm:p-6 space-y-6 bg-bg">
          <Skeleton className="h-7 w-44" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, router, pathname]);

  if (!isInitialized) return <AppShellSkeleton />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
