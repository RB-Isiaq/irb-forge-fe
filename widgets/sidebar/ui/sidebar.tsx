"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Bell, Settings, LogOut } from "lucide-react";
import { cn } from "@/shared/lib";
import { Avatar } from "@/entities/user/ui/avatar";
import { useAuth } from "@/entities/user";

const navItems = [
  { label: "Dashboard",     href: "/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/orgs",      icon: Building2 },
  { label: "Invitations",   href: "/invitations", icon: Bell },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-56 flex flex-col bg-surface border-r border-border">
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border shrink-0">
        <div className="h-7 w-7 rounded-[6px] bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-[14px]">F</span>
        </div>
        <span className="text-[15px] font-bold text-text-primary">IRB Forge</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-medium transition-colors duration-100",
              active ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-gray-100 hover:text-text-primary"
            )}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border p-3 space-y-0.5">
        <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-medium text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors">
          <Settings size={16} strokeWidth={1.8} /> Settings
        </Link>
        <button onClick={() => logout()} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-medium text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors">
          <LogOut size={16} strokeWidth={1.8} /> Sign out
        </button>
        {user && (
          <div className="flex items-center gap-2.5 px-3 pt-3 border-t border-border mt-1">
            <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-text-primary truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[11px] text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
