"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib";

const tabs = [{ label: "Account", href: "/settings" }];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-140">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-primary mb-4">Settings</h1>
        <div className="flex gap-1 border-b border-border">
          {tabs.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors",
                pathname === href
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
