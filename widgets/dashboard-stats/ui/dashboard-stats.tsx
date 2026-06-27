"use client";

import Link from "next/link";
import { Building2, Bell, BookOpen, ArrowRight } from "lucide-react";
import { useOrgs } from "@/entities/org";
import { useMyInvitations } from "@/entities/invitation";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

function StatCard({ label, value, icon: Icon, href, badge }: StatCardProps) {
  return (
    <Link href={href}>
      <div className="group rounded-[12px] bg-surface border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="h-9 w-9 rounded-[9px] bg-primary/10 flex items-center justify-center">
            <Icon size={18} className="text-primary" strokeWidth={1.8} />
          </div>
          {badge !== undefined && badge > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </div>
        <p className="text-[28px] font-bold text-text-primary leading-none mb-1">{value}</p>
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-text-muted">{label}</p>
          <ArrowRight
            size={14}
            className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}

export function DashboardStats() {
  const { data: orgs, isLoading: orgsLoading, isError: orgsError } = useOrgs();
  const {
    data: invitations,
    isLoading: invitationsLoading,
    isError: invitationsError,
  } = useMyInvitations();

  // A failed fetch must not collapse to the same "0" a genuinely empty list would show.
  const orgCount = orgsLoading || orgsError ? "—" : (orgs?.length ?? 0);
  const pendingInvitations =
    invitationsLoading || invitationsError
      ? 0
      : (invitations?.filter((i) => i.status === "pending").length ?? 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Organizations" value={orgCount} icon={Building2} href="/orgs" />
      <StatCard
        label="Pending invitations"
        value={invitationsLoading || invitationsError ? "—" : pendingInvitations}
        icon={Bell}
        href="/invitations"
        badge={pendingInvitations}
      />
      <StatCard label="Active programs" value="—" icon={BookOpen} href="/orgs" />
    </div>
  );
}
