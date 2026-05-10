"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Home,
  Users,
  BookOpen,
  Megaphone,
  Mail,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, setSessionCookie } from "@/shared/lib";
import { Avatar } from "@/entities/user/ui/avatar";
import { useAuth } from "@/entities/user";
import { useOrg } from "@/entities/org";
import { useMyInvitations } from "@/entities/invitation";
import { useMyRole } from "@/entities/member";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <div className="relative">
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-[7px] text-[13px] font-medium transition-colors duration-100",
          collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2",
          active
            ? "bg-primary/10 text-primary"
            : "text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5"
        )}
      >
        <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
        <span
          className={cn(
            "flex-1 whitespace-nowrap overflow-hidden transition-all duration-200",
            collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
          )}
        >
          {item.label}
        </span>
        {!collapsed && item.badge && item.badge > 0 ? (
          <span className="h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </Link>
      {collapsed && item.badge && item.badge > 0 ? (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-surface pointer-events-none" />
      ) : null}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: myInvitations } = useMyInvitations();

  // Detect org context
  const orgSlugMatch = pathname.match(/^\/orgs\/([^/]+)/);
  const rawSlug = orgSlugMatch?.[1];
  const orgSlug = rawSlug && rawSlug !== "new" ? rawSlug : null;
  const isOrgContext = !!orgSlug;

  const { data: org } = useOrg(orgSlug ?? "");
  const myRole = useMyRole(orgSlug ?? "");
  const canManageOrg = myRole === "owner" || myRole === "admin";

  const pendingCount = myInvitations?.filter((i) => i.status === "pending").length ?? 0;

  const appNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Organizations", href: "/orgs", icon: Building2 },
    { label: "Invitations", href: "/invitations", icon: Bell, badge: pendingCount },
  ];

  const orgNav: NavItem[] = orgSlug
    ? [
        { label: "Overview", href: `/orgs/${orgSlug}`, icon: Home, exact: true },
        { label: "Members", href: `/orgs/${orgSlug}/members`, icon: Users },
        { label: "Programs", href: `/orgs/${orgSlug}/programs`, icon: BookOpen },
        { label: "Announcements", href: `/orgs/${orgSlug}/messages`, icon: Megaphone },
        ...(canManageOrg
          ? ([
              { label: "Invitations", href: `/orgs/${orgSlug}/invitations`, icon: Mail },
              { label: "Settings", href: `/orgs/${orgSlug}/settings`, icon: Settings },
            ] as NavItem[])
          : []),
      ]
    : [];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-surface border-r border-border overflow-hidden",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border shrink-0 transition-all duration-200",
          collapsed ? "justify-center px-0" : "gap-2.5 px-5"
        )}
      >
        <div className="h-7 w-7 shrink-0 rounded-[6px] bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-[14px]">F</span>
        </div>
        <span
          className={cn(
            "text-[15px] font-bold text-text-primary whitespace-nowrap overflow-hidden transition-all duration-200",
            collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
          )}
        >
          IRB Forge
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {isOrgContext ? (
          <>
            {/* Back link */}
            <Link
              href="/orgs"
              title={collapsed ? "All organizations" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-[7px] text-[12px] font-medium transition-colors duration-100 mb-2",
                collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-1.5",
                "text-text-muted hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5"
              )}
            >
              <ArrowLeft size={14} strokeWidth={2} className="shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-200",
                  collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
                )}
              >
                All organizations
              </span>
            </Link>

            {/* Org label */}
            {!collapsed && (
              <div className="px-2.5 pb-2">
                {org ? (
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider truncate">
                    {org.name}
                  </p>
                ) : (
                  <div className="h-3 w-28 rounded bg-border animate-pulse" />
                )}
              </div>
            )}
            {collapsed && <div className="mx-2 my-1 border-t border-border" />}

            {/* Org nav */}
            {orgNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href, item.exact)}
              />
            ))}
          </>
        ) : (
          appNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActive(item.href)}
            />
          ))
        )}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-border p-2 space-y-0.5">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-[7px] text-[13px] font-medium transition-colors",
            collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2",
            "text-text-muted hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5"
          )}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-200",
              collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
            )}
          >
            Collapse
          </span>
        </button>

        {/* Sign out */}
        <button
          type="button"
          title="Sign out"
          onClick={async () => {
            await logout();
            setSessionCookie(false);
            router.push("/login");
          }}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-[7px] text-[13px] font-medium transition-colors",
            collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2",
            "text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5"
          )}
        >
          <LogOut size={16} strokeWidth={1.8} className="shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-200",
              collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
            )}
          >
            Sign out
          </span>
        </button>

        {/* User — clicking goes to /settings */}
        {user && (
          <Link
            href="/settings"
            title={collapsed ? "Account settings" : undefined}
            className={cn(
              "flex items-center gap-2.5 mt-1 pt-2.5 border-t border-border hover:opacity-80 transition-opacity",
              collapsed ? "justify-center px-0" : "px-2.5"
            )}
          >
            <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
            <div
              className={cn(
                "min-w-0 overflow-hidden transition-all duration-200",
                collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
              )}
            >
              <p className="text-[12px] font-medium text-text-primary truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-text-muted truncate">{user.email}</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
