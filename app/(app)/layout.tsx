"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/shared/lib";
import { Sidebar } from "@/widgets/sidebar";
import { UnverifiedBanner } from "@/widgets/unverified-banner";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("irb_sidebar_collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("irb_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="h-full flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex-1 flex flex-col min-h-full",
          "lg:transition-[margin-left] lg:duration-200 lg:ease-in-out",
          collapsed ? "lg:ml-14" : "lg:ml-56"
        )}
      >
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 h-14 bg-surface border-b border-border shrink-0">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="h-6 w-6 rounded-sm bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-[12px]">F</span>
          </div>
          <span className="text-[15px] font-bold text-text-primary">IRB Forge</span>
        </header>

        <UnverifiedBanner />
        <main className="flex-1 p-4 sm:p-6 bg-bg">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
