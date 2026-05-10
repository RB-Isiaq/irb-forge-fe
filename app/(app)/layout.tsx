"use client";

import { useState } from "react";
import { cn } from "@/shared/lib";
import { Sidebar } from "@/widgets/sidebar";
import { UnverifiedBanner } from "@/widgets/unverified-banner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Lazy initializer reads localStorage once on first render — no effect needed
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("irb_sidebar_collapsed") === "true"
  );

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("irb_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="h-full flex">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-full transition-[margin-left] duration-200 ease-in-out",
          collapsed ? "ml-14" : "ml-56"
        )}
      >
        <UnverifiedBanner />
        <main className="flex-1 p-6 bg-bg">{children}</main>
      </div>
    </div>
  );
}
