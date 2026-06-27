"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Users, BookOpen, Megaphone, ArrowRight } from "lucide-react";
import { useOrg } from "@/entities/org";
import { useMembers, useMyRole } from "@/entities/member";
import { usePrograms } from "@/entities/program";
import { useMessages } from "@/entities/message";
import { useMyEnrollmentsInOrg } from "@/entities/enrollment";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import { getDisplayName, stripMarkdown, timeAgo } from "@/shared/lib";

/* ── Stat card ───────────────────────────────────────────────── */

function StatCard({
  href,
  icon: Icon,
  value,
  label,
  sub,
}: {
  href: string;
  icon: LucideIcon;
  value: number;
  label: string;
  sub?: string;
}) {
  return (
    <Link href={href}>
      <div className="p-5 rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-primary/1 transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={17} className="text-primary" strokeWidth={1.8} />
          </div>
          <span className="text-[28px] font-bold text-text-primary leading-none">{value}</span>
        </div>
        <p className="text-[13px] font-medium text-text-primary">{label}</p>
        <p className="text-[11px] text-text-muted mt-0.5 h-4">{sub}</p>
      </div>
    </Link>
  );
}

/* ── Main widget ─────────────────────────────────────────────── */

export function OrgOverview({ slug }: { slug: string }) {
  const { data: org, isLoading, isError, refetch } = useOrg(slug);
  const { data: members } = useMembers(slug);
  const { data: programs } = usePrograms(slug);
  const { data: messages } = useMessages(slug);
  const { data: myEnrollments } = useMyEnrollmentsInOrg(slug);
  const myRole = useMyRole(slug);

  const canManage = myRole === "owner" || myRole === "admin" || myRole === "mentor";
  const isMember = myRole === "member";

  const memberCount = members?.total ?? 0;
  const totalPrograms = programs?.total ?? 0;
  const activePrograms = programs?.items.filter((p) => p.status === "active").length ?? 0;
  const recentMessages = messages?.items.slice(0, 3) ?? [];
  const activeEnrollments = (myEnrollments ?? []).filter((e) => e.status === "active");

  if (isLoading)
    return (
      <div className="space-y-8">
        {/* Org title */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-surface">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-7 w-10" />
              </div>
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))}
        </div>
        {/* Recent announcements */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Card>
            <CardContent className="pt-4 pb-0">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={`py-4 ${i < 1 ? "border-b border-border" : ""}`}>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                  <Skeleton className="h-3 w-full mb-1.5" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );

  if (isError)
    return (
      <Card>
        <ErrorState message="Couldn't load this organization." onRetry={refetch} />
      </Card>
    );

  if (!org) return null;

  return (
    <div className="space-y-8">
      {/* Org header */}
      <div>
        <h1 className="text-[26px] font-bold text-text-primary">{org.name}</h1>
        {org.description && (
          <p className="text-[14px] text-text-muted mt-0.5 max-w-2xl">{org.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard href={`/orgs/${slug}/members`} icon={Users} value={memberCount} label="Members" />
        <StatCard
          href={`/orgs/${slug}/programs`}
          icon={BookOpen}
          value={totalPrograms}
          label="Programs"
          sub={activePrograms > 0 ? `${activePrograms} active` : "none active"}
        />
        <StatCard
          href={`/orgs/${slug}/messages`}
          icon={Megaphone}
          value={messages?.total ?? 0}
          label="Announcements"
        />
      </div>

      {/* Member: active enrollments */}
      {isMember && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-text-primary">My programs</h2>
            <Link
              href={`/orgs/${slug}/programs`}
              className="flex items-center gap-1 text-[12px] text-primary hover:underline"
            >
              Browse all <ArrowRight size={12} />
            </Link>
          </div>
          {activeEnrollments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-[14px] text-text-muted mb-3">
                  You&apos;re not enrolled in any programs yet.
                </p>
                <Link
                  href={`/orgs/${slug}/programs`}
                  className="text-[13px] font-medium text-primary hover:underline"
                >
                  Browse available programs →
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              {activeEnrollments.slice(0, 4).map((e, i) => (
                <Link key={e.id} href={`/orgs/${slug}/programs/${e.programId}`}>
                  <div
                    className={`flex items-center gap-3 px-5 py-3.5 hover:bg-primary/2 transition-colors ${i < Math.min(activeEnrollments.length, 4) - 1 ? "border-b border-border" : ""}`}
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-primary" strokeWidth={1.8} />
                    </div>
                    <p className="flex-1 text-[13px] font-medium text-text-primary truncate">
                      {e.program?.name ?? "Program"}
                    </p>
                    <Badge variant="primary">active</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent announcements */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-text-primary">Recent announcements</h2>
          <Link
            href={`/orgs/${slug}/messages`}
            className="flex items-center gap-1 text-[12px] text-primary hover:underline"
          >
            {canManage ? "Manage" : "View all"} <ArrowRight size={12} />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-[14px] text-text-muted">No announcements yet.</p>
              {canManage && (
                <Link
                  href={`/orgs/${slug}/messages`}
                  className="block mt-3 text-[13px] font-medium text-primary hover:underline"
                >
                  Send the first announcement →
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-4 pb-0">
              {recentMessages.map((msg, i) => {
                const author = msg.author
                  ? getDisplayName(msg.author.firstName, msg.author.lastName)
                  : "Deleted user";
                return (
                  <Link
                    key={msg.id}
                    href={`/orgs/${slug}/messages`}
                    className={`block py-4 hover:bg-primary/2 transition-colors ${i < recentMessages.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-text-primary">{author}</p>
                      <time className="text-[11px] text-text-muted shrink-0">
                        {timeAgo(msg.createdAt)}
                      </time>
                    </div>
                    <p className="text-[13px] text-text-secondary line-clamp-2 leading-relaxed">
                      {stripMarkdown(msg.content)}
                    </p>
                  </Link>
                );
              })}
              <Link
                href={`/orgs/${slug}/messages`}
                className="flex items-center justify-center gap-1.5 py-3 text-[12px] text-text-muted hover:text-primary transition-colors border-t border-border"
              >
                View all announcements <ArrowRight size={12} />
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Manager: quick actions */}
      {canManage && (
        <section>
          <h2 className="text-[15px] font-semibold text-text-primary mb-3">Quick actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Invite a member", href: `/orgs/${slug}/invitations`, icon: Users },
              { label: "Create a program", href: `/orgs/${slug}/programs`, icon: BookOpen },
              { label: "Send announcement", href: `/orgs/${slug}/messages`, icon: Megaphone },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-primary/1 transition-colors cursor-pointer">
                  <Icon size={15} className="text-primary shrink-0" strokeWidth={1.8} />
                  <span className="text-[13px] font-medium text-text-primary">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
