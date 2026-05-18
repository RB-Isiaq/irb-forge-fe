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
  CreditCard,
  Settings,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, setSessionCookie } from "@/shared/lib";
import { Avatar } from "@/entities/user/ui/avatar";
import { useAuth } from "@/entities/user";
import { useOrg } from "@/entities/org";
import { useMyInvitations } from "@/entities/invitation";
import { useMyRole } from "@/entities/member";
import { LogoMark } from "@/shared/ui/logo";

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
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function NavLink({
  item,
  collapsed,
  active,
  onMobileClose,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onMobileClose: () => void;
}) {
  return (
    <div className="relative">
      <Link
        href={item.href}
        onClick={onMobileClose}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-[7px] text-[13px] font-medium transition-colors duration-100",
          // Mobile: always padded with labels. Desktop collapsed: centered icon only.
          "px-2.5 py-2",
          collapsed ? "lg:justify-center lg:px-0 lg:py-2.5" : "",
          active
            ? "bg-primary/10 text-primary"
            : "text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5"
        )}
      >
        <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
        <span
          className={cn(
            "flex-1 whitespace-nowrap overflow-hidden transition-all duration-200",
            // Mobile: always visible. Desktop: hide when collapsed.
            "max-w-xs opacity-100",
            collapsed ? "lg:max-w-0 lg:opacity-0" : ""
          )}
        >
          {item.label}
        </span>
        {item.badge && item.badge > 0 ? (
          <span
            className={cn(
              "h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0",
              // Hide text badge when collapsed on desktop; show dot instead
              collapsed ? "lg:hidden" : ""
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </Link>
      {/* Dot indicator when collapsed on desktop */}
      {collapsed && item.badge && item.badge > 0 ? (
        <span className="hidden lg:block absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-surface pointer-events-none" />
      ) : null}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
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
              { label: "Billing", href: `/orgs/${orgSlug}/billing`, icon: CreditCard },
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
        // Mobile: slide drawer — always w-72, translate in/out
        // Desktop: static sidebar — translate-x-0 always, width transitions
        "w-72 lg:w-56",
        "transition-transform lg:transition-[width] duration-200 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsed ? "lg:w-14" : "lg:w-56"
      )}
    >
      {/* Logo row */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border shrink-0",
          // Mobile: logo + close button
          "px-4 gap-3",
          // Desktop collapsed: centered
          collapsed ? "lg:justify-center lg:px-0 lg:gap-0" : "lg:px-5 lg:gap-2.5"
        )}
      >
        <LogoMark size={26} className="shrink-0" />
        <span
          className={cn(
            "flex-1 text-[15px] font-bold text-text-primary whitespace-nowrap overflow-hidden transition-all duration-200",
            "max-w-xs opacity-100",
            collapsed ? "lg:max-w-0 lg:opacity-0" : ""
          )}
        >
          IRB Forge
        </span>
        {/* Close button — mobile only */}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg text-text-muted hover:bg-gray-100 hover:text-text-primary transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {isOrgContext ? (
          <>
            {/* Back link */}
            <Link
              href="/orgs"
              onClick={onMobileClose}
              title={collapsed ? "All organizations" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-[7px] text-[12px] font-medium transition-colors duration-100 mb-2",
                "px-2.5 py-1.5",
                collapsed ? "lg:justify-center lg:px-0 lg:py-2" : "",
                "text-text-muted hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5"
              )}
            >
              <ArrowLeft size={14} strokeWidth={2} className="shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-200",
                  "max-w-xs opacity-100",
                  collapsed ? "lg:max-w-0 lg:opacity-0" : ""
                )}
              >
                All organizations
              </span>
            </Link>

            {/* Org label */}
            <div className={cn("px-2.5 pb-2", collapsed ? "lg:hidden" : "")}>
              {org ? (
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider truncate">
                  {org.name}
                </p>
              ) : (
                <div className="h-3 w-28 rounded bg-border animate-pulse" />
              )}
            </div>
            {collapsed && <div className="mx-2 my-1 border-t border-border lg:block hidden" />}

            {/* Org nav */}
            {orgNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href, item.exact)}
                onMobileClose={onMobileClose}
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
              onMobileClose={onMobileClose}
            />
          ))
        )}
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-border p-2 space-y-0.5">
        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "hidden lg:flex w-full items-center gap-2.5 rounded-[7px] text-[13px] font-medium transition-colors",
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
            collapsed ? "lg:justify-center lg:px-0 lg:py-2.5" : "",
            "px-2.5 py-2 text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-white/5"
          )}
        >
          <LogOut size={16} strokeWidth={1.8} className="shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-200",
              "max-w-xs opacity-100",
              collapsed ? "lg:max-w-0 lg:opacity-0" : ""
            )}
          >
            Sign out
          </span>
        </button>

        {/* User — links to settings */}
        {user && (
          <Link
            href="/settings"
            onClick={onMobileClose}
            title={collapsed ? "Account settings" : undefined}
            className={cn(
              "flex items-center gap-2.5 mt-1 pt-2.5 border-t border-border hover:opacity-80 transition-opacity",
              collapsed ? "lg:justify-center lg:px-0" : "px-2.5"
            )}
          >
            <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
            <div
              className={cn(
                "min-w-0 overflow-hidden transition-all duration-200",
                "max-w-xs opacity-100",
                collapsed ? "lg:max-w-0 lg:opacity-0" : ""
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
